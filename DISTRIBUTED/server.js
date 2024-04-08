/*
Davery Valdez
CS 382
Simple Multiplayer-Distributed Game
Server-Side
*/

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 4000;

app.use(express.static(__dirname + "/public"));

// Variables to store player names and current player
let playerRed = "Red";
let playerYellow = "Yellow";
let currentPlayer = playerRed;

let connectedClients = 0;

// Variable to track game state
let gameOver = false;
let board;

// Array to represent the game board and variables for its dimensions
const rows = 6;
const columns = 7;
let currentColumn;

setGame();

// Function to initialize the game when a client connects
function setGame() {
    gameOver = false;
    board = [];
    currentColumn = [5, 5, 5, 5, 5, 5, 5]; // Initialize the current column index for each column

    // Loop through rows and columns to create the game board
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(' ');
        }
        board.push(row); // Add the row to the game board
    }
}

// Function to update turn display
function updateTurnDisplay() {
    io.emit('updateTurnDisplay', currentPlayer);
}

// Socket.io connection handler
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.emit('assignRole', connectedClients <= 1 ? 'Red' : 'Yellow');

    connectedClients++;
    
    if (connectedClients === 1) {
        currentPlayer = playerRed;
    } else if (connectedClients === 2) {
        currentPlayer = playerYellow;
    }

    // Initialize game for the newly connected client
    updateTurnDisplay();

    // Event listener for setting a game piece
    socket.on('setPiece', (coords) => {
        if (!gameOver) {
            let r = parseInt(coords[0]);
            let c = parseInt(coords[1]);

            r = currentColumn[c];
            if (r < 0) {
                return;
            }

            // Set the game piece on the board and update the display
            board[r][c] = currentPlayer;
            currentColumn[c] = r - 1;

        // Check for win or draw
        if (checkWin(socket)) {
            gameOver = true;
            return;
        }
        //Toggle between players
        currentPlayer = currentPlayer === playerRed ? playerYellow : playerRed;

        // Emit updated game state to all clients
        io.emit('updateBoard', { board, currentPlayer });

        // Emit update turn display event
        io.emit('updateTurnDisplay', currentPlayer);

    
        }
    });

    // Event listener for resetting the game
    socket.on('resetGame', () => {
        setGame();
        currentPlayer = playerRed;
        gameOver = false;
        io.emit('resetGame');
        updateTurnDisplay();
    });

    // Disconnect event handler
    socket.on('disconnect', () => {
        console.log('User disconnected');
        connectedClients--; 
    });

    socket.on('draw', () => {
        alert("It's a draw!");
    
    });

});

// Function to check if a player has won the game
function checkWin(socket) { {
        // Horizontal Check
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns - 3; c++) {
                if (board[r][c] !== ' ' &&
                    board[r][c] === board[r][c + 1] &&
                    board[r][c] === board[r][c + 2] &&
                    board[r][c] === board[r][c + 3]) {
                    // Emit winning condition
                    io.emit('win', currentPlayer);
                    return;
                }
            }
        }
    
        // Vertical Check
        for (let r = 0; r < rows - 3; r++) {
            for (let c = 0; c < columns; c++) {
                if (board[r][c] !== ' ' &&
                    board[r][c] === board[r + 1][c] &&
                    board[r][c] === board[r + 2][c] &&
                    board[r][c] === board[r + 3][c]) {
                    // Emit winning condition
                    io.emit('win', currentPlayer);
                    return;
                }
            }
        }
    
        // Diagonal Check (from top-left to bottom-right)
        for (let r = 0; r < rows - 3; r++) {
            for (let c = 0; c < columns - 3; c++) {
                if (board[r][c] !== ' ' &&
                    board[r][c] === board[r + 1][c + 1] &&
                    board[r][c] === board[r + 2][c + 2] &&
                    board[r][c] === board[r + 3][c + 3]) {
                    // Emit winning condition
                    io.emit('win', currentPlayer);
                    return;
                }
            }
        }
    
        // Diagonal Check (from top-right to bottom-left)
        for (let r = 0; r < rows - 3; r++) {
            for (let c = 3; c < columns; c++) {
                if (board[r][c] !== ' ' &&
                    board[r][c] === board[r + 1][c - 1] &&
                    board[r][c] === board[r + 2][c - 2] &&
                    board[r][c] === board[r + 3][c - 3]) {
                    // Emit winning condition
                    io.emit('win', currentPlayer);
                    return;
                }
            }
        }
    
        // Check for Draw
        let draw = true;
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                if (board[r][c] === ' ') {
                    draw = false;
                    break;
                }
            }
            if (!draw) {
                break;
            }
        }
    
        if (draw) {
            // Emit draw condition
            io.emit('draw');
        }
    }
}  
// Serve the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});