import type { Game, CellCoord, Player } from './game/game'
import { SERVER_URL } from "./constants"

export interface TicTacToeApi {
  createGame(startingPlayer: Player): Promise<Game>,
  getGame(id: string): Promise<Game>,
  getGames(): Promise<Game[]>,
  makeMove(id: string, coords: CellCoord): Promise<Game>
}

export class ClientTicTacToe implements TicTacToeApi {
  
  async createGame(startingPlayer: Player): Promise<Game> {
    const response = await fetch(`${SERVER_URL}/api/game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ startingPlayer })
    })
    
    const game = await response.json()
    return game
  }

  async getGame(id: string): Promise<Game> {
    const response = await fetch(`${SERVER_URL}/api/game/${id}`)
    const game = await response.json()
    return game
  }

  async getGames(): Promise<Game[]> {
    const response = await fetch(`${SERVER_URL}/api/games`)
    const games = await response.json()
    return games
  }

  async makeMove(id: string, coords: CellCoord): Promise<Game> {
    const response = await fetch(`${SERVER_URL}/api/game/${id}/move`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({coords})
    })
    
    const game = await response.json()
    return game
  }
}
