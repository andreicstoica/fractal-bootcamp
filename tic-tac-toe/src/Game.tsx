import { useEffect, useState, type JSX } from "react";
import { useLoaderData, useNavigate } from "react-router";
import { io } from "socket.io-client";

import { Howl, Howler } from "howler";
import { useSpring, animated } from "@react-spring/web";
import clsx from "clsx";

import type { Game, Player, CellCoord, EndState } from "./game/game";
import { BASE_URL, ClientTicTacToe } from "./api";

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

  useEffect(() => {
    const socket = io(BASE_URL);
    socket.on("connect", () => {
      socket.emit("join-game", game.id)

      socket.on("game-updated", (game: Game) => {
        setAiAllowed(false)
        setGame(game)
        // start timer for AI next move button 
        setInterval(() => setAiAllowed(true), 5000)
      })
    })

    return () => socket.disconnect();
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
  handleClick: Function
}

function AiButton({ aiAllowed, game, handleClick }: AiButtonProp) {
  function aiMove(game: Game) {
    for (let rowIndex = 0; rowIndex < game.board.length; rowIndex++) {
      for (let colIndex = 0; colIndex < game.board[rowIndex].length; colIndex++) {
        if (!game.board[rowIndex][colIndex]) {
          return { row: rowIndex, col: colIndex }
        }
      }
    }
  }

  return(
    <button onClick={() => handleClick(aiMove(game)) } className={clsx(buttonStyle,  {"invisible": aiAllowed === false || game.endState })}>Let computer make the next move?</button>
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
