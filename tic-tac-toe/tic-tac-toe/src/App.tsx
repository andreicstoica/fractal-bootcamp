import { useState } from 'react'
import './App.css'
import { initializeGame } from './game/game'

function App() {
  const [game, setGame] = useState(initializeGame())

  return (
    <>
      <div>
        current player = {game.currentPlayer}
      </div>
    </>
  )
}

export default App
