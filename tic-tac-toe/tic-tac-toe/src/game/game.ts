// create game, board, etc.
export type Player = 'x' | 'o' 
type Cell = Player | null
type CellCoord = {
  row: number,
  col: number,
}
type Board = Cell[][]
export type EndState = Player | 'tie' | undefined
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

const getRow = (board: Board, index: number): Cell[] => {
  return board.map(row => row[index])
}

// check endState
const checkEnd = (game: Game): EndState => {
  const board = game.board

  /// TIE ///
  let playedCells: number = 0
  for (const row of board) {
    for (const cell of row) {
      if (cell) playedCells = playedCells + 1
    }
  }
  if (playedCells === 9) {
    return 'tie'
  }

  /// WIN SCENARIOS ///
  // any col is complete for a player 
  for (const row of board) {
    const xCount: number = row.filter(cell => cell === 'x').length
    const oCount: number =  row.filter(cell => cell === 'o').length

    if (xCount === 3 || oCount === 3) {
      console.log('complete in cols')
      return game.currentPlayer
    }
  }
  // any row is complete for a player
  for (let i:number = 0; i < 3; i ++) {
    const col = getRow(board, i)
    const xCount: number = col.filter(cell => cell === 'x').length 
    const oCount: number = col.filter(cell => cell ==='o').length

    if (xCount === 3 || oCount === 3) {
      console.log('complete in rows');
      return game.currentPlayer
    } 
  }

  // one of the two diagonals is complete for a player 
  // first diagonal
  const firstDiag: Cell[] = [board[0][0], board[1][1],  board[2][2]]
  if (firstDiag.filter(cell => cell === 'x').length === 3 || firstDiag.filter(cell => cell === 'o').length === 3 ) {
    console.log('complete in first diag');
    return game.currentPlayer
  }
  // backwards diagonal
  const backDiag: Cell[] = [board[2][0], board[1][1],  board[0][2]]
  if (backDiag.filter(cell => cell === 'x').length === 3 || firstDiag.filter(cell => cell === 'o').length === 3 ) {
    console.log('complete in back diag');
    return game.currentPlayer
  }

  // else, return undefined to continue playing
  return undefined
}