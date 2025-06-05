import { useEffect, useState, type JSX } from "react";
import { useLoaderData, useNavigate } from "react-router";

import { Howl, Howler } from 'howler'
import clsx from "clsx";
import { io } from "socket.io-client"

import type { Game, Player, CellCoord, EndState } from "./game/game";
import { BASE_URL, ClientTicTacToe } from "./api";

const centerStyle = 'flex flex-col items-center justify-center'
const hoverStyle = 'hover:bg-gray-200 hover:shadow-[inset_1px_1px_10px_0px_#ffa1ad,inset_-1px_-1px_10px_0px_#ffa1ad]'

Howler.volume(.75)
const clickSound = new Howl({
  src: ['/assets/click.wav'],
  html5: true,
  preload: true
})
const victorySound = new Howl({
  src: ['/assets/victory.mp3'],
  html5: true,
  preload: true
})

const api = new ClientTicTacToe()

export function Game() {
  const { foundGame: foundGame } = useLoaderData<{ foundGame: Game }>()
  const [game, setGame] = useState<Game>(foundGame)
  const navigate = useNavigate()

  useEffect(() => {
    const socket = io(BASE_URL);
    socket.on("connect", () => {
      //console.log('connected to socket')
      socket.emit("join-game", game.id)
      /*
      socket.on('user-joined', (userId: string) => {
        console.log(`user ${userId} joined`);
      })
      */
      socket.on('game-updated', (game: Game) => {
        //console.log('game updated')
        setGame(game)
      })

    })

    return () => socket.disconnect()
  }, [game.id])

  async function handleClick(coords: CellCoord) {
    const newGame = await api.makeMove(game!.id, coords)
    setGame(newGame)
  }

  if (!game) {
    return <div className={clsx(centerStyle, 'text-[amarante] text-6xl')}>Loading...</div>
  }

  const cellStyle = 'border border-gray-500 bg-gray-200 font-[amarante] w-[3em] h-[3em] text-5xl'

  return (
    <div className={clsx(centerStyle, 'gap-20')}>
      <div className={clsx('flex flex-col items-center font-[inter]')}> 
        <Turn currentPlayer={game.currentPlayer} endState={game.endState} />
        <br></br>
      </div>

      <div className="flex justify-center shadow-md">
        {game.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={clsx(centerStyle, hoverStyle, cellStyle, {'text-sky-500': cell === 'x'}, {'text-rose-500': cell === 'o'})} 
                onClick={() => {
                  clickSound.play();
                  handleClick({ row: rowIndex, col: colIndex })
                }}
              >
                {cell ? cell.toUpperCase() : ""}
              </div>
            ))}
          </div>
        ))}
      </div>

      <GameOver endState={game.endState} onRestart={() => navigate(`/`)} />
    </div>
  )
}

interface TurnProps {
  currentPlayer: Player;
  endState: EndState;
}

function Turn({ currentPlayer, endState }: TurnProps) {
  const turnStyle = clsx({'text-sky-500': currentPlayer === 'x'}, {'text-rose-500': currentPlayer === 'o'}, 'font-[amarante]')
  if (!endState) return(<div className='text-xl'>Player turn: <span className={turnStyle}>{currentPlayer.toUpperCase()}</span></div>)
}

interface GameOverProps {
  endState: EndState;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  onRestart: Function;
}

function GameOver({ endState, onRestart }: GameOverProps) {
  let message: JSX.Element | null = null
  const winnerStyle = clsx({'text-sky-500': endState === 'x'}, {'text-rose-500': endState === 'o'}, 'font-[amarante] text-xl')

  if (!endState) return null
  if (endState === 'tie') {
    message = <div>Wow, what an exciting matchup, the game ends in a tie!</div>;
  } else {
  // If endState is 'x' or 'o', construct JSX for the winner message
    message = (
      <div>
        Congrats player{' '}
        <span className={winnerStyle}>
          {endState.toUpperCase()}
        </span>
        ! Player{' '}
        <span className={winnerStyle}>
          {endState.toUpperCase()}
        </span>
        {' '}wins!
      </div>
    )
  }

  const winnerElement = <div className="font-[inter] text-xl font-medium">{message}</div>
  victorySound.play()
  const buttonStyle = 'py-2.5 px-5 my-3 text-l font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'
  
  return(
    <div className="flex flex-col">
      {winnerElement}
      <button onClick={() => onRestart()} className={clsx(buttonStyle, 'animate-pulse')}>Play Again?</button>
    </div>
  )
}
