/*
import { DbTicTacToeApi } from '../api'

import { expect, test } from 'vitest'
let api: DbTicTacToeApi

test('should create a new game with correct initial state', async() => {
  api = new DbTicTacToeApi()
  const game = await api.createGame('x')
  expect(game).toBeDefined()
  expect(game.board).toStrictEqual(
    [
      [null, null, null], 
      [null, null, null], 
      [null, null, null]
    ])
  expect(game.currentPlayer).toBe('x')
  expect(game.id).toBeDefined()
  expect(game.endState).toBeUndefined()
})
*/
