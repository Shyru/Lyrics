const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    transports: ['polling']
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

let activeUsers = 0;

io.on('connection', (socket) => {
    activeUsers++;
    io.emit('userCount', activeUsers);

    socket.on('toggleScroll', (isEnabled) => {
        if (isEnabled) {
            activeUsers++;
        } else {
            activeUsers--;
        }
        io.emit('userCount', activeUsers);
    });
    console.log('a user connected');
    socket.on('scrollTo', (pId) => {
        io.emit('scrollTo', pId);
    });

    socket.on('disconnect', () => {
        activeUsers--;
        io.emit('userCount', activeUsers);
    });
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
