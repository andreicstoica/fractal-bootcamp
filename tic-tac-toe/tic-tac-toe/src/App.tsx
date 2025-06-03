import { useState } from 'react'
import './App.css'
import { Howl, Howler } from 'howler'
import { initializeGame, move, type EndState, type Player} from './game/game'

Howler.volume(1)
const clickSound = new Howl({
  src: ['/public/assets/click.wav'],
  html5: true,
  preload: true
})

interface GameOverProps {
  endState: EndState;
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

  return(
    <>
      <div className={'text-xl'}>{message}</div>
      <button onClick={() => onRestart(null)} className='py-2.5 px-5 my-3 text-l font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'>Restart?</button>
    </>
  )
}

interface TurnProps {
  currentPlayer: Player;
  endState: EndState;
}

function Turn({ currentPlayer, endState }: TurnProps) {
  if (!endState) return(<div>Player turn: <span style={{ fontFamily: "Amarante" }}>{currentPlayer.toUpperCase()}</span></div>)
}

function App() {
    const [startingPlayer, setStartingPlayer] = useState<Player | null>(null)

    if(!startingPlayer) return (
      <div className='flex flex-col items-center justify-center h-screen space-y-4'>
        <h1 className='text-2xl'>Welcome to Tic-Tac-Toe</h1>
        <h2 className='text-xl'>Pick a player to begin:</h2>
        <div>
          <button type='button' style={{fontFamily: "Amarante"}} onClick={() => setStartingPlayer('x')} className='py-2.5 px-5 me-2 mb-2 text-2xl font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'>X</button>
          <button type='button' style={{fontFamily: "Amarante"}} onClick={() => setStartingPlayer('o')} className='py-2.5 px-5 me-2 mb-2 text-2xl font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'>O</button>
        </div>
      </div>
    )

    return <Game startingPlayer={startingPlayer} onRestart={setStartingPlayer}/>
}

interface GameProps {
  startingPlayer: Player;
  onRestart: Function;
}

function Game({ startingPlayer, onRestart }: GameProps) {
  const [game, setGame] = useState(initializeGame(startingPlayer))

  return (
    <>
      <div className="flex flex-col items-center font-inter">
        <h1 className="text-4xl font-bold py-6">Play Tic Tac Toe!</h1>
        <Turn currentPlayer={game.currentPlayer} endState={game.endState} />
        <br></br>
        <GameOver endState={game.endState} onRestart={onRestart}/>
      </div>

      <div className="flex justify-center items-center h-screen">
        {game.board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className='flex items-center justify-center border border-gray-500 bg-gray-200 hover:bg-gray-300' 
                style={{ width: "3em", height: "3em", fontSize: "3rem", fontFamily: "Amarante"}}
                onClick={() => {
                  clickSound.play();
                  setGame((prev) => move(prev, { row: rowIndex, col: colIndex }))
                }}
              >
                {cell ? cell.toUpperCase() : ""}
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  )
}

export default App
