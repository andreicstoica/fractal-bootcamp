import { Link, useLoaderData, useNavigate } from "react-router"
import type { Game, Player } from "./game/game"
import { useState } from "react"
import { ClientTicTacToe } from "./api"
import clsx from "clsx"

export function Lobby() {
  const { ongoingGames: loadedGames } = useLoaderData<{ ongoingGames: Game[] }>()
  const [games, setGames] = useState<Game[]>(loadedGames)
  const navigate = useNavigate()

  const startGame = (startingPlayer: Player) => async () => {
    const api = new ClientTicTacToe()
    const newGame = await api.createGame(startingPlayer)
    return navigate(`game/${newGame.id}`)
  }

  const buttonStyle = 
  'py-3 px-4 text-xl font-medium bg-white border-2 border-r-5 border-b-5 border-zinc-black hover:cursor-pointer hover:border-r-2 hover:border-b-2 focus:text-amber-600 focus:font-bold'
  const cardStle = 'p-4 border border-2 shadow-lg/100 shadow-black text-xl font-bold bg-zinc-100'
  const colCenter = 'flex flex-col items-center gap-4'

  return (
    <div className="flex flex-col p-10 grow gap-15 mt-10">
      <div className={clsx(colCenter, 'gap-2')}>
        <h2 className={cardStle}>MAKE A GAME</h2>
        <div className="flex flex-row pt-2 gap-4">
          <button className={buttonStyle} onClick={startGame('x')}>Play as <span className="font-[amarante]">X</span></button>
          <button className={buttonStyle} onClick={startGame('o')}>Play as <span className="font-[amarante]">O</span></button>
        </div>
      </div>

      <div className={clsx(colCenter)}>
        <h2 className={cardStle}>JOIN A GAME</h2>
        <ul className="ml-9 w-fit mt-3">
          {games.map(game => (
            <li key={game.id} className="text-lg font-medium list-decimal text-amber-600 hover:underline hover:cursor-pointer"><Link to={`/game/${game.id}`}>{game.name}</Link></li>
          ))}
        </ul> 
      </div>
    </div>
  )
}
