import type { Game, CellCoord, Player } from './game/game'
import { initializeGame, move } from './game/game'

export interface TicTacToeApi {
  createGame(startingPlayer: Player): Promise<Game>,
  getGame(id: string): Promise<Game>,
  getGames(): Promise<Game[]>,
  makeMove(id: string, coords: CellCoord): Promise<Game>
}

export class MemoryTicTacToeApi implements TicTacToeApi {

  private games: Map<string, Game> = new Map()

  async createGame(startingPlayer: Player): Promise<Game> {
    const newGame = initializeGame(startingPlayer)
    this.games.set(newGame.id, newGame)

    return newGame
  }

  async getGame(id: string): Promise<Game> {
    const foundGame = this.games.get(id)

    if (!foundGame) {
      throw new Error("No game found :(")
    }

    return foundGame
  }

  async getGames(): Promise<Game[]> {
    const gamesList = Array.from(this.games.values())

    if (gamesList.length === 0) {
      throw new Error("No games :( uhoh")
    }

    return gamesList
  }

  async makeMove(id: string, coords: CellCoord): Promise<Game> {
    const foundGame = await this.getGame(id)
    const newGame = move(foundGame, coords)
    this.games.set(id, newGame)

    return newGame
  }
}

export const BASE_URL = "http://localhost:3000"

export class ClientTicTacToe implements TicTacToeApi {
  
  async createGame(startingPlayer: Player): Promise<Game> {
    const response = await fetch(`${BASE_URL}/api/game`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({startingPlayer})
    })
    
    const game = await response.json()
    return game
  }

  async getGame(id: string): Promise<Game> {
    const response = await fetch(`${BASE_URL}/api/game/${id}`)
    const game = await response.json()
    return game
  }

  async getGames(): Promise<Game[]> {
    const response = await fetch(`${BASE_URL}/api/games`)
    const games = await response.json()
    return games
  }

  async makeMove(id: string, coords: CellCoord): Promise<Game> {
    const response = await fetch(`${BASE_URL}/api/game/${id}/move`, {
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