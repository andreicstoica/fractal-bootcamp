import { jsonb, pgTable, varchar } from "drizzle-orm/pg-core";
import type { Board } from '../game/game'

export const gamesTable = pgTable("games", {
    id: varchar({ length: 255 }).primaryKey(),
    name: varchar({ length: 255 }).notNull(),
    board: jsonb().$type<Board>().notNull(),
    currentPlayer: varchar({ length: 255 }).notNull(),
    endState: varchar({ length: 255 })
})