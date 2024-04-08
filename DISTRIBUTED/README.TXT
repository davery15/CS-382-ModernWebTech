# Simple Distributed Multiplayer Game

# Description
-This game is a simple multiplayer "Connect 4" developed for CS 382.
Players can take turns placing their pieces on a grid with the aim to 
connect a sequence of their own pieces vertically, horizontally, or diagonally 
before their opponent. It features a real-time gameplay experience powered by 
Socket.io, allowing players to compete from different devices.

# Installation
Before you begin, ensure you have met the following requirements:
-Node.js installed on your system. (npm install) or (npm install express socket.io)

-Basic knowledge of JavaScript and Node.js.

-An internet connection for multiplayer capabilities.

# How to Run:
After installation, the game server can be started by running: node server.js
Open a web browser and go to `http://localhost:4000` to play the game.

## Gameplay
- Two players can join the game from different devices.
- Players take turns dropping their colored discs into a seven-column, six-row vertically suspended grid.
- The first player to form a horizontal, vertical, or diagonal line of four of their own discs wins the game.
- If the board fills up with discs before either player achieves four in a row, the game is a draw.
- Reset button will clear board and start a new game.


# Contact 
Developed by Davery Valdez as a project for CS 382.
