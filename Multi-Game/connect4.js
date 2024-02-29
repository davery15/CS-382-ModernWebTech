/* 
Davery Valdez 
CS 382
Multiplayer-Game

*/
var playerRed = "Red";
var playerYellow = "Yellow";
var currentPlayer = playerRed;

var gameOver = false;
var board;

var rows = 6;
var columns = 7;
var currentColumn;

window.onload = function() {
    setGame();

}

function setGame() {
    board = [];
    currentColumn = [5, 5, 5, 5, 5, 5, 5,];

    for (let r = 0; r < rows; r++) {
        let row = [];
        for (let c = 0; c < columns; c++) {
            row.push(' ');

            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", setPiece);
            document.getElementById("board").append(tile);
        }

        board.push(row);
    }
}

function setPiece() {
    if(gameOver) {
        return;
    }
    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    r = currentColumn[c];
    if (r < 0) {return};

    board[r][c] = currentPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currentPlayer == playerRed) {
        tile.classList.add("redPiece");
        currentPlayer = playerYellow;
    } else {
        tile.classList.add("yellowPiece");
        currentPlayer = playerRed;
    }

    r -= 1;
    currentColumn[c] = r;

    
checkWin();
updateTurnDisplay();
}

function checkWin() {
    for (let r = 0; r < rows; r++) { //horizontal
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ' ) {
                if (board[r][c] == board[r][c+1] && board[r][c+1] == board[r][c+2] && board[r][c+2] == board[r][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }

    for (let c = 0; c < columns; c++) { //vertical
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r+1][c] == board[r+2][c] && board[r+2][c] == board[r+3][c]) {
                    setWinner(r, c);
                    return;
                }

            }
        }
    }
    for (let r = 0; r < rows-3; r++) { //diagonal
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if(board[r][c] == board[r+1][c+1] && board[r+1][c+1] == board[r+2][c+2] && board[r+2][c+2] == board[r+3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r-1][c+1] == board[r-2][c+2] && board[r-2][c+2] == board[r-3][c+3]) {
                    setWinner(r, c);
                    return;
                }
            }
        }
    }
}

function setWinner(r, c) {
    let winner = document.getElementById("winner");
    let fireworks = document.getElementById("fireworks"); // Get fireworks container
    if (board[r][c] == playerRed) {
        winner.innerText = "Red Wins!!";
        winner.classList.add("winner"); // Add class for animated display
        fireworks.classList.add("active"); // Activate fireworks animation
    } else {
        winner.innerText = "Yellow Wins!!";
        winner.classList.add("winner"); // Add class for animated display
        fireworks.classList.add("active"); // Activate fireworks animation
    }
    gameOver = true;
}

function updateTurnDisplay() {
    document.getElementById("current-player").innerText = currentPlayer;
}

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
}