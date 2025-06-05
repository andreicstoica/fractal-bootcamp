import { Link, useLoaderData, useNavigate } from "react-router"
import type { Game, Player } from "./game/game"
import { useState } from "react"
import { ClientTicTacToe } from "./api"

export function Lobby() {
  const { ongoingGames: loadedGames } = useLoaderData<{ ongoingGames: Game[] }>()
  const [games, setGames] = useState<Game[]>(loadedGames)
  const navigate = useNavigate()

  const startGame = (startingPlayer: Player) => async () => {
    const api = new ClientTicTacToe()
    const newGame = await api.createGame(startingPlayer)
    return navigate(`game/${newGame.id}`)
  }

  const buttonStyle = 'py-2.5 px-5 my-3 text-l font-[amarante] font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100'

  return (
    <div className="flex flex-col items-center p-4 font-[inter]">
      <h2 className="text-xl font-bold">GAME LOBBY</h2>
      <h3 className="text-lg font-medium">MAKE A GAME</h3>
      <div className="flex flex-row p-2 gap-2">
        <button className={buttonStyle} onClick={startGame('x')}>X</button>
        <button className={buttonStyle} onClick={startGame('o')}>O</button>
      </div>
      <h3 className="text-lg font-medium">JOIN A GAME</h3>
      <ul className="p-0 m-0 w-fit mx-auto">
        {games.map(game => (
          <li key={game.id} className="list-decimal text-blue-500 hover:underline"><Link to={`/game/${game.id}`}>{game.name}</Link></li>
        ))}
      </ul>
    </div>
  )
}
