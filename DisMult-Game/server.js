const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle player movement
    socket.on('move', (data) => {
        // Broadcast player movement to other players
        socket.broadcast.emit('move', data);
    });

    // Handle disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 5500; 
io.listen(PORT);
console.log(`Server listening on port ${PORT}`);