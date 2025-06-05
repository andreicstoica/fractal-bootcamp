import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router";
import App from './App.tsx'
import { Game } from './Game.tsx'
import { Lobby } from './Lobby.tsx'
import { ClientTicTacToe } from './api.ts';

const api = new ClientTicTacToe()

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/",
        Component: Lobby,
        loader: async () => {
          return { ongoingGames: await api.getGames()}
        },
      },
      {
        path: "/game/:id",
        Component: Game,
        loader: async ({ params }) => {
          if (!params.id) {
            throw new Error('Game ID is required')
          }
          return {foundGame: await api.getGame(params.id)}
        }
      }
    ]
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
