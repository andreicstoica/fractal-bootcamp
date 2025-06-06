import { useEffect, useRef, useState, type JSX } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { io } from "socket.io-client";

import { Howl, Howler } from "howler";
import { useSpring, animated } from "@react-spring/web";
import clsx from "clsx";

import type { Game, Player, CellCoord, EndState } from "./game/game";
import { ClientTicTacToe } from "./api";
import { CLIENT_URL } from "./constants"

const centerStyle = "flex flex-col items-center justify-center";
const hoverStyle =
  "hover:bg-gray-200 hover:shadow-[inset_1px_1px_10px_0px_#ffa1ad,inset_-1px_-1px_10px_0px_#ffa1ad]";

Howler.volume(0.75);
const clickSound = new Howl({
  src: ["/assets/click.wav"],
  html5: true,
  preload: true,
});
const victorySound = new Howl({
  src: ["/assets/victory.mp3"],
  html5: true,
  preload: true,
});

const api = new ClientTicTacToe();
const cellStyle = "outline outline-3 outline-zinc-500 bg-zinc-100 active:bg-zinc-300 font-[amarante] w-40 h-40 text-7xl"
const cardStyle = 'p-4 border border-2 shadow-lg/100 shadow-black text-xl font-bold bg-zinc-100'
const buttonStyle = 'py-3 px-4 text-xl font-medium shadow-md/100 shadow-zinc-500 bg-white border-2 border-r-5 border-b-5 border-zinc-black hover:cursor-pointer hover:border-r-2 hover:border-b-2 hover:bg-zinc-100 focus:text-amber-600 focus:bg-zinc-300'


export function Game() {
  const { foundGame: foundGame } = useLoaderData<{ foundGame: Game }>()
  const [game, setGame] = useState<Game>(foundGame)
  const [aiAllowed, setAiAllowed] = useState<boolean>(false)
  const navigate = useNavigate()

  const intervalId = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const socket = io(CLIENT_URL);
    //let intervalId: NodeJS.Timeout
    socket.on("connect", () => {
      socket.emit("join-game", game.id)

      socket.on("game-updated", (game: Game) => {
        setAiAllowed(false)
        setGame(game)
        // start timer for AI next move button 
        if (intervalId.current) {
          clearInterval(intervalId.current)
        }
        intervalId.current = setInterval(() => setAiAllowed(true), 5000)
      })
    })

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current)
      }
      socket.disconnect();
    }
  }, [game.id])

  async function handleClick(coords: CellCoord) {
    const newGame = await api.makeMove(game!.id, coords);
    setGame(newGame);
  }

  if (!game) {
    return (
      <div className={clsx(centerStyle, "text-[amarante] text-6xl")}>
        Loading...
      </div>
    );
  }

  return (
    <div className={clsx(centerStyle, "gap-6")}>
      <div className={clsx(cardStyle, "flex flex-col items-center mt-4 mb-4")}>
        <div className="text-2xl font-bold">Game: {game.name}</div>
        <Turn currentPlayer={game.currentPlayer} endState={game.endState} />
        <br></br>
      </div>

      <div className="flex justify-center shadow-md">
        {game.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={clsx(
                  centerStyle,
                  hoverStyle,
                  cellStyle,
                  { "text-emerald-500 hover:cursor-not-allowed": cell === "x" },
                  { "text-red-500 hover:cursor-not-allowed": cell === "o" },
                  { "hover:cursor-pointer": cell === null },
                )}
                onClick={() => {
                  clickSound.play();
                  handleClick({ row: rowIndex, col: colIndex });
                }}>
                <TicTacToeCell cell={cell} />
              </div>
            ))}
          </div>
        ))}
      </div>

      <AiButton aiAllowed={aiAllowed} game={game} handleClick={handleClick} />
      <GameOver endState={game.endState} onRestart={() => navigate(`/`)} />
    </div>
  );
}

interface AiButtonProp {
  aiAllowed: boolean,
  game: Game,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  handleClick: Function
}

function AiButton({ aiAllowed, game, handleClick }: AiButtonProp) {
  /*
  function aiMove(game: Game) {
    for (let rowIndex = 0; rowIndex < game.board.length; rowIndex++) {
      for (let colIndex = 0; colIndex < game.board[rowIndex].length; colIndex++) {
        if (!game.board[rowIndex][colIndex]) {
          return { row: rowIndex, col: colIndex }
        }
      }
    }
  }
  */

  function isMovesLeft(game: Game): boolean {
    for(let i = 0; i < 3; i++)
        for(let j = 0; j < 3; j++)
            if (game.board[i][j] === null)
                return true;
                
    return false;
  }

  function getScore(game: Game): number | undefined {
    const player = game.currentPlayer;
    const board = game.board;
    const opponent = player === "x" ? "o" : "x";

    // checking for row victory
    for (let row = 0; row < 3; row++) {
      if (board[row][0] == board[row][1] && board[row][1] == board[row][2]) {
        if (board[row][0] === player) {
          return 10;
        } else if (board[row][0] === opponent) {
          return -10;
        } 
      } 
    }

    // checking for col victory
    for (let col = 0; col < 3; col++) {
      if (board[0][col] == board[1][col] && board[1][col] == board[2][col]) {
        if (board[0][col] === player) {
          return 10;
        } else if (board[0][col] === opponent) {
          return -10;
        } 
      }

      // Checking for Diagonals for X or O victory.
      if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
        if (board[0][0] == player) return 10;
        else if (board[0][0] == opponent) return -10;
      }

      if (board[0][2] == board[1][1] && board[1][1] == board[2][0]) {
        if (board[0][2] == player) return 10;
        else if (board[0][2] == opponent) return -10;
      }

      // Else if none of them have won then return 0
      return 0;
    } 
  }

  function minimax(game: Game, depth: number, isMax: boolean): number {
    const score = getScore(game);
    const player = game.currentPlayer
    const board = game.board;
    const opponent = player === "x" ? "o" : "x";

    // if Max has won the game, return score
    if (score === 10) {
      return score;
    }

    // if Min has won the game, return score
    if (score === -10) {
      return score;
    }

    if (isMovesLeft(game) === false) {
      return 0;
    }

    if (isMax) {
      let best = -1000;

      // Traverse all cells
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Check if cell is empty
          if (board[i][j] === null) {
            // Make the move
            board[i][j] = player;

            // Call minimax recursively
            // and choose the maximum value
            best = Math.max(best, minimax(game, depth + 1, !isMax));

            // Undo the move
            board[i][j] = null;
          }
        }
      }
      return best;
    }

    // If this minimizer's move
    else {
      let best = 1000;

      // Traverse all cells
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Check if cell is empty
          if (board[i][j] === null) {
            // Make the move
            board[i][j] = opponent;

            // Call minimax recursively and
            // choose the minimum value
            best = Math.min(best, minimax(game, depth + 1, !isMax));

            // Undo the move
            board[i][j] = null;
          }
        }
      }
      return best;
    }
  }

  function findBestMove(game: Game) {
    const player = game.currentPlayer;
    const board = game.board;
    let bestVal = -1000
    const bestMove: CellCoord = { row: -1, col: -1 }

    // Traverse all cells, evaluate minimax function for all empty cells. 
    // return the cell with optimal value.
    for (let i = 0; i < 3; i++)
    {
        for (let j = 0; j < 3; j++)
        {
            // Check if cell is empty
            if (board[i][j] === null)
            {
                
                // Make the move
                board[i][j] = player;
 
                // compute evaluation function 
                // for this move.
                const moveVal = minimax(game, 0, false);
 
                // Undo the move
                board[i][j] = null;
 
                // If the value of the current move 
                // is more than the best value, then 
                // update best
                if (moveVal > bestVal)
                {
                    bestMove.row = i;
                    bestMove.col = j;
                    bestVal = moveVal;
                }
            }
        }
    }
 
    return bestMove;
  }

  const bestMove: CellCoord = findBestMove(game)
  return(
    // handleClick(aiMove(game))
    <button onClick={() => handleClick(bestMove)} className={clsx(buttonStyle,  {"invisible": aiAllowed === false || game.endState })}>Let computer make the next move?</button>
  )
}

interface CellProp {
  cell: 'x' | 'o' | null
}

function TicTacToeCell( { cell }: CellProp ) {
  const slamSprings = useSpring(
    cell ? 
    { from: { scale: 1.5 }, to: { scale: 1 }, config: {mass: 3, friction: 20, tension: 500} }
    : {}
  );

  return(
    <animated.div style={slamSprings}>
      {cell ? cell.toUpperCase() : ""}
    </animated.div>
  )
}

interface TurnProps {
  currentPlayer: Player;
  endState: EndState;
}

function Turn({ currentPlayer, endState }: TurnProps) {
  const turnStyle = clsx(
    { "text-emerald-500": currentPlayer === "x" },
    { "text-red-500": currentPlayer === "o" },
    "font-[amarante]"
  );
  if (!endState)
    return (
      <div className="text-xl font-semibold">
        Player turn:{" "}
        <span className={turnStyle}>{currentPlayer.toUpperCase()}</span>
      </div>
    );
}

interface GameOverProps {
  endState: EndState;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  onRestart: Function;
}

function GameOver({ endState, onRestart }: GameOverProps) {
  let message: JSX.Element | null = null;
  const winnerStyle = clsx(
    { "text-emerald-500": endState === "x" },
    { "text-red-500": endState === "o" },
    "font-[amarante] text-xl"
  );

  if (!endState) return null;
  if (endState === "tie") {
    message = <div>Wow, what an exciting matchup! The game ends in a tie.</div>;
  } else {
    // If endState is 'x' or 'o', construct JSX for the winner message
    message = (
      <div>
        Congrats player{" "}
        <span className={winnerStyle}>{endState.toUpperCase()}</span>! Player{" "}
        <span className={winnerStyle}>{endState.toUpperCase()}</span> wins!
      </div>
    );
  }

  const winnerElement = (
    <div className="text-2xl font-bold">{message}</div>
  )

  victorySound.play();

  return (
    <div className="flex flex-col items-center">
      {winnerElement}
      <button
        onClick={() => onRestart()}
        className={clsx(buttonStyle, "hover:cursor-pointer m-4 -rotate-8")}
      >
        <span className="animate-pulse">Play Again?</span>
      </button>
    </div>
  )
}
