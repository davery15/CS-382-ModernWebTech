/* 
Davery Valdez 
CS 382
Distributed Multiplayer-Game

*/
// Variables to store player names and current player
var playerRed = "Red";
var playerYellow = "Yellow";
var currentPlayer = playerRed;

// Variable to track game state
var gameOver = false;
var board;

// Array to represent the game board and variables for its dimensions
var rows = 6;
var columns = 7;
var currentColumn;

// Function to initialize the game when the window loads
window.onload = function () {
    setGame();
    updateTurnDisplay();

}
/* Function to set up the game board */
function setGame() {
    board = [];
    currentColumn = [5, 5, 5, 5, 5, 5, 5,]; // Initialize the current column index for each column

    // Loop through rows and columns to create the game board and add event listeners for clicking
    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(' ');

            let tile = document.createElement("div"); // Create a new div element for each cell
            tile.id = r.toString() + "-" + c.toString(); // Set the id of the div based on its position
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece); // Add event listener for clicking to add a game piece
            document.getElementById("board").append(tile);
        }

        board.push(row); // Add the row to the game board
    }
}

// Original setPiece function for local moves
function setPiece() {
    if (gameOver) {
        return;
    }
    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currentColumn[c];
    if (r < 0) {
        return;
    }

    // Set the game piece on the board and update the display
    board[r][c] = currentPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currentPlayer == playerRed) {
        tile.classList.add("redPiece");
        currentPlayer = playerYellow; // Switch to the next player
    } else {
        tile.classList.add("yellowPiece");
        currentPlayer = playerRed; // Switch to the next player
    }

    r -= 1; // Update the current row index for the clicked column
    currentColumn[c] = r;

    checkWin();
    updateTurnDisplay();

    // Emit player move to the server
    socket.emit('move', { row: r, column: c });
}


/* Function to check if a player has won the game */
function checkWin() {
    for (let r = 0; r < rows; r++) { // Horizontal
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c + 1] && board[r][c + 1] == board[r][c + 2] && board[r][c + 2] == board[r][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    for (let c = 0; c < columns; c++) { // Vertical
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r + 1][c] && board[r + 1][c] == board[r + 2][c] && board[r + 2][c] == board[r + 3][c]) {
                    setWinner(r, c);
                    return;
                }

            }
        }
    }
    for (let r = 0; r < rows - 3; r++) { // Diagonal
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r + 1][c + 1] && board[r + 1][c + 1] == board[r + 2][c + 2] && board[r + 2][c + 2] == board[r + 3][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
    for (let r = 3; r < rows; r++) { // Check for diagonal wins in the other direction
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r - 1][c + 1] && board[r - 1][c + 1] == board[r - 2][c + 2] && board[r - 2][c + 2] == board[r - 3][c + 3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
    // Check for draw
    let draw = true;
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            if (board[r][c] === ' ') {
                draw = false; // If there's an empty space, the game is not a draw
                break;
            }
        }
        if (!draw) {
            break;
        }
    }

    if (draw) {
        declareDraw();
    }
}

/* Function to declare a draw */
function declareDraw() {
    let winner = document.getElementById("winner");
    winner.innerText = "It's a Draw!";
    winner.style.color = "blue";
    winner.classList.add("winner");
    gameOver = true;
}

/* Function to declare a winner */
function setWinner(r, c) {
    let winner = document.getElementById("winner");
    let fireworks = document.getElementById("fireworks"); // Get fireworks container
    if (board[r][c] == playerRed) {
        winner.innerText = "Red Wins!!";
        winner.style.color = "red";
        winner.classList.add("winner"); // Add class for animated display
        fireworks.classList.add("active"); // Activate fireworks animation
    } else {
        winner.innerText = "Yellow Wins!!";
        winner.style.color = "yellow";
        winner.classList.add("winner"); // Add class for animated display
        fireworks.classList.add("active"); // Activate fireworks animation
    }
    gameOver = true;
}

/* FUnction for turns display with color */
function updateTurnDisplay() {
    let currentPlayerSpan = document.getElementById("current-player");
    currentPlayerSpan.innerText = currentPlayer;

    // Set color and text shadow based on the current player
    if (currentPlayer === playerRed) {
        currentPlayerSpan.style.color = "red";
        currentPlayerSpan.style.textShadow = "0 0 3px black";
    } else if (currentPlayer === playerYellow) {
        currentPlayerSpan.style.color = "yellow";
        currentPlayerSpan.style.textShadow = "0 0 3px black"; // Add text shadow for yellow
    } else {
        currentPlayerSpan.style.color = "red"; // Set the initial color to red if currentPlayer isn't explicitly set
        currentPlayerSpan.style.textShadow = "0 0 3px black"; // Shadow
    }
}

/* Function for reset game */
function resetGame() {
    // Clear the board
    let boardElement = document.getElementById("board");
    boardElement.innerHTML = "";
    // Reset variables
    currentPlayer = playerRed;
    gameOver = false;
    // Clear the winner display and remove animations
    let winner = document.getElementById("winner");
    winner.innerText = "";
    winner.classList.remove("winner");
    let fireworks = document.getElementById("fireworks");
    fireworks.classList.remove("active");
    // Reset the game board
    setGame();
    updateTurnDisplay();
}

// Initialize Socket.IO connection
const socket = io('http://192.168.1.185:1090');

// Handle receiving player movement updates from the server
socket.on('move', function(data) {
    let row = data.row;
    let column = data.column;
    
    // Call a function to update the game board based on the received data
    updateGameBoard(row, column);
});

function updateGameBoard(row, column) {
    // Construct the id of the cell to be updated
    let cellId = row.toString() + "-" + column.toString();
    // Find the corresponding cell element
    let cell = document.getElementById(cellId);

    // Update the board array with the player's move
    board[row][column] = currentPlayer;

    // Add a class to the cell to indicate the color of the player who made the move
    if (currentPlayer === playerRed) {
        cell.classList.add("redPiece");
    } else {
        cell.classList.add("yellowPiece");
    }
}