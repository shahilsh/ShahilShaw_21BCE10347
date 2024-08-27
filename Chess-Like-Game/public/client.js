const socket = io();

let gameId = null;
let playerColor = null;
let selectedCharacter = null;

const board = document.getElementById('board');
const createGameBtn = document.getElementById('create-game');
const joinGameBtn = document.getElementById('join-game');
const gameIdInput = document.getElementById('game-id-input');
const moveOptions = document.getElementById('move-options');
const statusDisplay = document.getElementById('status');

createGameBtn.addEventListener('click', () => {
    socket.emit('createGame');
});

joinGameBtn.addEventListener('click', () => {
    const id = gameIdInput.value.trim();
    if (id) {
        socket.emit('joinGame', id);
    }
});

socket.on('gameCreated', (id) => {
    gameId = id;
    playerColor = 'A';
    statusDisplay.textContent = `Game created. ID: ${gameId}`;
});

socket.on('gameState', (gameState) => {
    renderBoard(gameState.board);
    statusDisplay.textContent = `Current player: ${gameState.currentPlayer}`;
});

socket.on('gameOver', (winner) => {
    statusDisplay.textContent = `Game Over! Winner: ${winner}`;
});

socket.on('error', (message) => {
    statusDisplay.textContent = `Error: ${message}`;
});

function renderBoard(boardState) {
    board.innerHTML = '';
    boardState.forEach((row, y) => {
        row.forEach((cell, x) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';
            if (cell) {
                cellElement.textContent = `${cell.player}-${cell.type[0]}`;
                cellElement.dataset.player = cell.player;
                cellElement.addEventListener('click', () => selectCharacter(x, y));
            }
            board.appendChild(cellElement);
        });
    });
}

function selectCharacter(x, y) {
    if (selectedCharacter) {
        const move = { from: selectedCharacter, to: { x, y } };
        socket.emit('move', { gameId, move });
        selectedCharacter = null;
        moveOptions.innerHTML = '';
    } else {
        selectedCharacter = { x, y };
        showMoveOptions(x, y);
    }
}

function showMoveOptions(x, y) {
    moveOptions.innerHTML = '';
    const directions = ['L', 'R', 'F', 'B', 'FL', 'FR', 'BL', 'BR'];
    directions.forEach(dir => {
        const button = document.createElement('button');
        button.textContent = dir;
        button.className = 'btn';
        button.addEventListener('click', () => makeMove(x, y, dir));
        moveOptions.appendChild(button);
    });
}

function makeMove(x, y, direction) {
    let newX = x;
    let newY = y;
    switch (direction) {
        case 'L': newX--; break;
        case 'R': newX++; break;
        case 'F': newY--; break;
        case 'B': newY++; break;
        case 'FL': newX--; newY--; break;
        case 'FR': newX++; newY--; break;
        case 'BL': newX--; newY++; break;
        case 'BR': newX++; newY++; break;
    }
    const move = { from: { x, y }, to: { x: newX, y: newY } };
    socket.emit('move', { gameId, move });
    selectedCharacter = null;
    moveOptions.innerHTML = '';
}
