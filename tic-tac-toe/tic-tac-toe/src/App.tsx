import { useState } from 'react'
import './App.css'
import { initializeGame, move} from './game/game'

function App() {
  const [game, setGame] = useState(initializeGame())

  return (
    <>
      <h1 className='flex justify-center text-4xl font-bold py-6'>Play Tic Tac Toe!</h1>
      <div className='flex justify-center items-center h-screen'>
        {game.board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-col py-2">
          {row.map((cell, colIndex) => (
            <div
              key={colIndex}
              className="m-1 border border-blue-500 bg-blue-200 flex items-center justify-center font-mono"
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
