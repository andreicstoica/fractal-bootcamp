import { Outlet } from "react-router";
import clsx from 'clsx'
import './App.css'

function App() {
  const centerStyle = 'flex flex-col items-center justify-center h-screen w-screen'
  const backgroundStyle = 'bg-gradient-to-tr from-violet-100 via-slate-50 to-teal-100'

  return (
    <div className={clsx(centerStyle, backgroundStyle)}>
      <h1 className="text-4xl font-bold py-6">Play Tic Tac Toe!</h1>
      <Outlet />
    </div>
  )
  //return <Game startingPlayer={startingPlayer} onRestart={setStartingPlayer} />
}

export default App
