class Character {
    constructor(type, player) {
      this.type = type;
      this.player = player;
    }
  
    isValidMove(from, to, board) {
      const dx = to.x - from.x;
      const dy = to.y - from.y;
  
      switch (this.type) {
        case 'Pawn':
          return Math.abs(dx) <= 1 && Math.abs(dy) <= 1 && (dx !== 0 || dy !== 0);
        case 'Hero1':
          return (Math.abs(dx) === 2 && dy === 0) || (Math.abs(dy) === 2 && dx === 0);
        case 'Hero2':
          return Math.abs(dx) === 2 && Math.abs(dy) === 2;
        default:
          return false;
      }
    }
  }
  
  module.exports = Character;