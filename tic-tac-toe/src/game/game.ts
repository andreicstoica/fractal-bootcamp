// create game, board, etc.
export type Player = 'x' | 'o'
export type Cell = Player | null
export type CellCoord = {
  row: number,
  col: number,
}
export type Board = Cell[][]
export type EndState = Player | 'tie' | undefined
export type Game = {
  id: string,
  name: string,
  board: Board,
  currentPlayer: Player,
  endState?: EndState
}

function generateGameName() {
  const nameList = [
    'Time','Past','Future','Dev',
    'Fly','Flying','Soar','Soaring','Power','Falling',
    'Fall','Jump','Cliff','Mountain','Rend','Red','Blue',
    'Green','Yellow','Gold','Demon','Demonic','Panda','Cat',
    'Kitty','Kitten','Zero','Memory','Trooper','XX','Bandit',
    'Fear','Light','Glow','Tread','Deep','Deeper','Deepest',
    'Mine','Your','Worst','Enemy','Hostile','Force','Video',
    'Game','Donkey','Mule','Colt','Cult','Cultist','Magnum',
    'Gun','Assault','Recon','Trap','Trapper','Redeem','Code',
    'Script','Writer','Near','Close','Open','Cube','Circle',
    'Geo','Genome','Germ','Spaz','Shot','Echo','Beta','Alpha',
    'Gamma','Omega','Seal','Squid','Money','Cash','Lord','King',
    'Duke','Rest','Fire','Flame','Morrow','Break','Breaker','Numb',
    'Ice','Cold','Rotten','Sick','Sickly','Janitor','Camel','Rooster',
    'Sand','Desert','Dessert','Hurdle','Racer','Eraser','Erase','Big',
    'Small','Short','Tall','Sith','Bounty','Hunter','Cracked','Broken',
    'Sad','Happy','Joy','Joyful','Crimson','Destiny','Deceit','Lies',
    'Lie','Honest','Destined','Bloxxer','Hawk','Eagle','Hawker','Walker',
    'Zombie','Sarge','Capt','Captain','Punch','One','Two','Uno','Slice',
    'Slash','Melt','Melted','Melting','Fell','Wolf','Hound',
    'Legacy','Sharp','Dead','Mew','Chuckle','Bubba','Bubble','Sandwich',
    'Smasher','Extreme','Multi','Universe','Ultimate','Death','Ready','Monkey',
    'Elevator','Wrench','Grease','Head','Theme','Grand','Cool','Kid',
    'Boy','Girl','Vortex','Paradox'
  ]

  return `${nameList[Math.floor( Math.random() * nameList.length)] + " " + nameList[Math.floor( Math.random() * nameList.length)] }`
}

export const initializeGame = (startPlayer: Player): Game => {
  const game: Game = {
    id: crypto.randomUUID(),
    name: generateGameName(),
    board: [
      [null, null, null], 
      [null, null, null], 
      [null, null, null]
    ],
    currentPlayer: startPlayer
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

  /// WIN SCENARIOS ///
  // any col is complete for a player 
  for (const row of board) {
    const xCount: number = row.filter(cell => cell === 'x').length
    const oCount: number =  row.filter(cell => cell === 'o').length

    if (xCount === 3 || oCount === 3) {
      //console.log('complete in cols')
      return game.currentPlayer
    }
  }
  // any row is complete for a player
  for (let i:number = 0; i < 3; i ++) {
    const col = getRow(board, i)
    const xCount: number = col.filter(cell => cell === 'x').length 
    const oCount: number = col.filter(cell => cell ==='o').length

    if (xCount === 3 || oCount === 3) {
      //console.log('complete in rows');
      return game.currentPlayer
    } 
  }

  // one of the two diagonals is complete for a player 
  // first diagonal
  const firstDiag: Cell[] = [board[0][0], board[1][1],  board[2][2]]
  if (firstDiag.filter(cell => cell === 'x').length === 3 || firstDiag.filter(cell => cell === 'o').length === 3 ) {
    //console.log('complete in first diag');
    return game.currentPlayer
  }
  // backwards diagonal
  const backDiag: Cell[] = [board[2][0], board[1][1],  board[0][2]]
  if (backDiag.filter(cell => cell === 'x').length === 3 || firstDiag.filter(cell => cell === 'o').length === 3 ) {
    //console.log('complete in back diag');
    return game.currentPlayer
  }

  if (playedCells === 9) {
    return 'tie'
  }

  // else, return undefined to continue playing
  return undefined
}
