/* 
Davery Valdez 
CS 382
Simple Multiplayer-Distributed Game
Client-Side
*/

document.addEventListener('DOMContentLoaded', (event) => {
    // Your initialization code here

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

    // Establish Socket.io connection with the server
    const socket = io();

    // Event listener for setting a game piece
    function setPiece() {
        if (gameOver) {
            return;
        }
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        // Emit 'setPiece' event to the server with the coordinates of the clicked tile
        socket.emit('setPiece', [r, c]);
    }

    // Handle the 'updateTurnDisplay' message
    socket.on('updateTurnDisplay', (currentPlayer) => {
        // Update the display to show whose turn it is
        updateTurnDisplay(currentPlayer);
    });

    // Function to update the turn display
    function updateTurnDisplay(currentPlayer) {
        // Update the turn display to indicate the current player's turn

        console.log(document.getElementById('turn')); // Should not be null
        let currentPlayerSpan = document.getElementById("current-Player");


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

    // Event listener for updating the game board
    socket.on('updateBoard', (data) => {
        board = data.board;
        currentPlayer = data.currentPlayer;
        // Update the game board display
        updateBoardDisplay();
        updateTurnDisplay(currentPlayer); //update turn
        if (gameOver) {
            declareWinner(data.winner);
        }
    });
    // Function to update the game board display
    function updateBoardDisplay() {

        const boardContainer = document.getElementById("board");

        // Clear the board container
        boardContainer.innerHTML = '';

        // Loop through the rows and columns of the board
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < columns; c++) {
                const tile = document.createElement("div");
                tile.classList.add("tile");

                // Set the class of the tile based on the value in the board array
                if (board[r][c] === playerRed) {
                    tile.classList.add("redPiece");
                } else if (board[r][c] === playerYellow) {
                    tile.classList.add("yellowPiece");
                }
                tile.id = r + "-" + c;
                tile.addEventListener("click", setPiece);
                // Add the tile to the board container
                boardContainer.appendChild(tile);
            }
        }
    }

    // Function to initialize the game when the window loads
    function setGame() {

        // Clear the existing board first
        let boardElement = document.getElementById("board");
        boardElement.innerHTML = ''; // This removes all child elements


        board = [];
        currentColumn = [5, 5, 5, 5, 5, 5, 5]; // Initialize the current column index for each column

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

    // Function to declare the winner
    function declareWinner(winner) {
        // Display the winner
        let winnerDisplay = document.getElementById("winner");
        winnerDisplay.innerText = "Winner: " + winner;
    }

    // Event listener for declaring a winner
    socket.on('win', (winner) => {
        gameOver = true;
        alert(`${winner} wins!`);

    });
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
        socket.emit('resetGame');
    }

    // Call the setGame() function to initialize the game board display when the window loads
    setGame();

    // Event listener for resetting the game
    socket.on('resetGame', () => {
        // Reset the game
        gameOver = false;
        setGame();
        updateTurnDisplay();
    });
    // Event listeners for clicking to add a game piece and resetting the game
    let resetButton = document.getElementsByClassName("reset-button")[0];
    // Check if the button exists to avoid errors in case the class name is incorrect or the element does not exist
    if (resetButton) {
        // Add the click event listener to the reset button
        resetButton.addEventListener('click', resetGame);
    } else {
        console.error('Reset button not found');
    }
});