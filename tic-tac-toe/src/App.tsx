import { Outlet } from "react-router";
import clsx from 'clsx'
import './App.css'

function App() {
  const centerStyle = 'flex flex-col items-center h-screen w-screen'
  const backgroundStyle = 'bg-gradient-to-tr from-zinc-300 via-slate-100 to-gray-200'
  const globalFontStyle = 'font-[reddit_mono]'
  const headerStyle = 'py-5 text-4xl font-bold font-[sixtyfour] text-amber-50 bg-amber-900 shadow-md/100 shadow-amber-950 text-center self-stretch'
  const gifUrl = '/assets/angel.gif'

  return (
    <div className={clsx(centerStyle, backgroundStyle, globalFontStyle)}>
      <div className={clsx(headerStyle, "flex flex-row gap-3 items-center justify-center")}>
      <img src={gifUrl}/>
      <h1>TIC TAC TOE</h1>
      <img src={gifUrl} className="transform-[scaleX(-1)]"/>
      </div>
      <div className="flex flex-col justify-center grow">
        <Outlet />
      </div>
    </div>
  )
}

export default App
