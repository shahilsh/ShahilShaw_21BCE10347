const Character = require('./character');

function createBoard() {
  return Array(5).fill().map(() => Array(5).fill(null));
}

function initializeGame() {
  const board = createBoard();
  const players = ['A', 'B'];
  
  players.forEach((player, index) => {
    const row = index === 0 ? 0 : 4;
    for (let i = 0; i < 5; i++) {
      let type;
      if (i === 0 || i === 4) type = 'Hero1';
      else if (i === 1 || i === 3) type = 'Hero2';
      else type = 'Pawn';
      board[row][i] = new Character(type, player);
    }
  });

  return {
    board,
    currentPlayer: 'A',
    moveHistory: []
  };
}

function makeMove(game, move) {
  const { from, to } = move;
  const character = game.board[from.y][from.x];

  if (!character || character.player !== game.currentPlayer) {
    return { valid: false };
  }

  if (!character.isValidMove(from, to, game.board)) {
    return { valid: false };
  }

  // Perform the move
  game.board[to.y][to.x] = character;
  game.board[from.y][from.x] = null;

  game.moveHistory.push(move);
  game.currentPlayer = game.currentPlayer === 'A' ? 'B' : 'A';

  const gameOver = checkGameOver(game.board);

  return {
    valid: true,
    gameOver: gameOver.over,
    winner: gameOver.winner
  };
}

function checkGameOver(board) {
  const players = ['A', 'B'];
  for (const player of players) {
    if (!board.flat().some(char => char && char.player === player)) {
      return { over: true, winner: player === 'A' ? 'B' : 'A' };
    }
  }
  return { over: false };
}

function getGameState(game) {
  return {
    board: game.board.map(row => row.map(cell => cell ? { type: cell.type, player: cell.player } : null)),
    currentPlayer: game.currentPlayer,
    moveHistory: game.moveHistory
  };
}

module.exports = {
  initializeGame,
  makeMove,
  getGameState
};