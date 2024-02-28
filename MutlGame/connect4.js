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
    updateTurnDisplay();
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

    updateTurnDisplay();
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
    // Reset the game board
    setGame();
}