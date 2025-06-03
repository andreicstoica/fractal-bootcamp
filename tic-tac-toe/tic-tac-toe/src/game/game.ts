// create game, board, etc.
type Player = 'x' | 'o' 
type Cell = Player | null
type CellCoord = {
  row: number,
  col: number,
}
type Board = Cell[][]
type EndState = Player | 'tie' | undefined
type Game = {
  board: Board,
  currentPlayer: Player,
  endState?: EndState
}

export const initializeGame = (): Game => {
  const game: Game = {
      board: [
        [null, null, null], 
        [null, null, null], 
        [null, null, null]
      ],
      currentPlayer: 'x'
  }

  return game
}

// make move
export const move = (game: Game, chosenCellCoord: CellCoord): Game => {
  const nextGame = structuredClone(game)
  const selectedCell = nextGame.board[chosenCellCoord.row][chosenCellCoord.col]

  // if the cell is already selected, change nothing
  if (selectedCell) return nextGame

  // if the cell is empty, fill it and return, calculating endState
  nextGame.board[chosenCellCoord.row][chosenCellCoord.col] = nextGame.currentPlayer
  return {...nextGame, currentPlayer: game.currentPlayer === 'x' ? 'o' : 'x', endState: checkEnd(nextGame)}
}

// check endState

const checkEnd = (game: Game): endState => {
  // any row is complete for a player 

  // any col is complete for a player

  // one of the two diagonals is complete for a player 
}