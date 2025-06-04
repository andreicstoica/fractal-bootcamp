import { drizzle } from 'drizzle-orm/postgres-js'
import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { gamesTable } from './schema';
import type { TicTacToeApi } from '../api';
import type { Player, Game, CellCoord, EndState } from '../game/game';
import { initializeGame, move } from '../game/game';

const db = drizzle(process.env.DATABASE_URL!);

export class DbTicTacToeApi implements TicTacToeApi {

  async createGame(startingPlayer: Player): Promise<Game> {
    const newGame = initializeGame(startingPlayer)
    const values: typeof gamesTable.$inferInsert = newGame
    await db.insert(gamesTable).values(values)
    return newGame
  }

  async makeMove(id: string, coords: CellCoord): Promise<Game> {
    const foundGame = await this.getGame(id)

    const newGame = move(foundGame, coords)
    const values: typeof gamesTable.$inferInsert = newGame

    await db.update(gamesTable).set(values).where(eq(gamesTable.id, id))
    return newGame
  }

  async getGame(id: string): Promise<Game> {
    const results = await db.select()
        .from(gamesTable)
        .where(eq(gamesTable.id, id))

    if (results.length === 0) {
      throw new Error("No game found!")
    }

    const foundGame = results[0]

    return {
      id: foundGame.id,
      board: foundGame.board,
      currentPlayer: foundGame.currentPlayer as Player,
      endState: foundGame.endState as EndState
    }
  }

}