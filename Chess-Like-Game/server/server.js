const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const { initializeGame, makeMove, getGameState } = require('./gameLogic');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../public')));

const games = new Map();

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('createGame', () => {
    const gameId = Math.random().toString(36).substring(7);
    games.set(gameId, initializeGame());
    socket.join(gameId);
    socket.emit('gameCreated', gameId);
  });

  socket.on('joinGame', (gameId) => {
    if (games.has(gameId)) {
      socket.join(gameId);
      const gameState = getGameState(games.get(gameId));
      io.to(gameId).emit('gameState', gameState);
    } else {
      socket.emit('error', 'Game not found');
    }
  });

  socket.on('move', ({ gameId, move }) => {
    if (games.has(gameId)) {
      const game = games.get(gameId);
      const result = makeMove(game, move);
      if (result.valid) {
        const gameState = getGameState(game);
        io.to(gameId).emit('gameState', gameState);
        if (result.gameOver) {
          io.to(gameId).emit('gameOver', result.winner);
        }
      } else {
        socket.emit('error', 'Invalid move');
      }
    } else {
      socket.emit('error', 'Game not found');
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));