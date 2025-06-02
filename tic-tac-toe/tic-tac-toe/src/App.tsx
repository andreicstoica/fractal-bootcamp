import { useState } from 'react'
import './App.css'
import { initializeGame, move, type EndState, type Player} from './game/game'

interface GameOverProps {
  endState: EndState;
}

function GameOver({ endState }: GameOverProps) {
  if (!endState) return null
  if (endState === 'tie') {
    return(
      <div>
        Wow, what an exciting matchup, the game ends in a tie!
      </div>
    )
  }
  else {
    return(
      <div>
        Congrats Player {endState}! Player {endState} wins!
      </div>
    )
  }
}

interface TurnProps {
  currentPlayer: Player;
}

function Turn({ currentPlayer }: TurnProps) {
  return(<>
    Player turn: {currentPlayer}
  </>)
}

function App() {
  const [game, setGame] = useState(initializeGame())

  return (
    <>
      <div className='flex flex-col items-center'>
        <h1 className='text-4xl font-bold py-6'>Play Tic Tac Toe!</h1>
        <Turn currentPlayer={game.currentPlayer} />
        <br></br>
        <GameOver endState={game.endState} />
      </div>
      <div className='flex justify-center items-center h-screen'>
        {game.board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-col">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className="border border-blue-500 bg-blue-200 flex items-center justify-center font-mono"
              style={{ width: '3em', height: '3em', fontSize: '3rem' }}
              onClick={() => {
                setGame((prev) => move(prev, { row: rowIndex, col: colIndex }));
              }}
            >
              {cell ? cell.toUpperCase() : ""}
            </div>
          ))}
        </div>
        ))}
      </div>
    </>
  );
}

export default App
