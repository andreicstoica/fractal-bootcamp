import { useCallback, useEffect, useMemo, useState } from 'react'
import './App.css'
import { Howl, Howler } from 'howler'
import { clsx } from 'clsx'
import type { Game, EndState, Player, CellCoord} from './game/game'
import { ClientTicTacToe } from './api'

Howler.volume(1)
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

const backgroundStyle = 'bg-gradient-to-tr from-violet-100 via-slate-50 to-teal-100'
const centerStyle = 'flex flex-col items-center justify-center'

function App() {
  const [startingPlayer, setStartingPlayer] = useState<Player | null>(null)

  const startPlayerButtonStyle = 'py-2.5 px-5 me-2 mb-2 text-2xl font-[amarante] font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'
  if(!startingPlayer) return (
    <div className={clsx(centerStyle, backgroundStyle, 'h-screen space-y-4 font-[inter]')}>
      <h1 className='text-2xl'>Welcome to Tic-Tac-Toe</h1>
      <h2 className='mt-2 animate-pulse text-xl'>Pick a player to begin:</h2>
      <div className=''>
        <button type='button' onClick={() => setStartingPlayer('x')} className={startPlayerButtonStyle}>X</button>
        <button type='button' onClick={() => setStartingPlayer('o')} className={startPlayerButtonStyle}>O</button>
      </div>
    </div>
  )

  return <Game startingPlayer={startingPlayer} onRestart={setStartingPlayer} />
}

interface GameProps {
  startingPlayer: Player;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  onRestart: Function;
}

function Game({ startingPlayer, onRestart }: GameProps) {
  const [game, setGame] = useState<Game | undefined>()
  const api = useMemo(() => new ClientTicTacToe(), [])

  const startGame = useCallback(async () => {
    const initialGame = await api.createGame(startingPlayer)
    setGame(initialGame)
  }, [api, startingPlayer])

  useEffect(() => {
    startGame()
  }, [startingPlayer, startGame])

  async function handleClick(coords: CellCoord) {
    const newGame = await api.makeMove(game!.id, coords)
    setGame(newGame)
  }

  if (!game) {
    return <div className={clsx(centerStyle, 'text-[amarante] text-6xl')}>Loading...</div>
  }
  
  return (
    <div className={clsx(centerStyle, backgroundStyle, 'h-screen gap-10')}>
      <div className="flex flex-col items-center font-[inter]">
        <h1 className="text-4xl font-bold py-6">Play Tic Tac Toe!</h1>
        <Turn currentPlayer={game.currentPlayer} endState={game.endState} />
        <br></br>
        <GameOver endState={game.endState} onRestart={onRestart}/>
      </div>

      <div className="flex justify-center shadow-md">
        {game.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className={clsx(centerStyle, 'font-[amarante] w-[3em] h-[3em] text-5xl border border-gray-500 bg-gray-200 hover:bg-gray-300')} 
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
    </div>
  )
}

interface GameOverProps {
  endState: EndState;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  onRestart: Function;
}

function GameOver({ endState, onRestart }: GameOverProps) {
  let message: string
  if (!endState) return null
  if (endState === 'tie') {
    message = "Wow, what an exciting matchup, the game ends in a tie!"
  } else {
    message = `Congrats player ${endState.toUpperCase()}! Player ${endState.toUpperCase()} wins!`
  }

  victorySound.play()
  const buttonStyle = 'py-2.5 px-5 my-3 text-l font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'
  return(
    <>
      <div className={'text-xl'}>{message}</div>
      <button onClick={() => onRestart(null)} className={clsx(buttonStyle, 'mt-5 animate-pulse')}>Restart?</button>
    </>
  )
}

interface TurnProps {
  currentPlayer: Player;
  endState: EndState;
}

function Turn({ currentPlayer, endState }: TurnProps) {
  if (!endState) return(<div className='text-xl'>Player turn: <span className={'font-[amarante]'}>{currentPlayer.toUpperCase()}</span></div>)
}

export default App
