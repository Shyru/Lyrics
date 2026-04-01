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

let lastScrollId = null;
const clientStates = new Map();

function getActiveUsers() {
    let activeUsers = 0;

    clientStates.forEach((state) => {
        if (!state.isPresenter && state.autoScrollEnabled) {
            activeUsers++;
        }
    });

    return activeUsers;
}

function broadcastUserCount() {
    io.emit('userCount', getActiveUsers());
}

io.on('connection', (socket) => {
    clientStates.set(socket.id, {
        isPresenter: false,
        autoScrollEnabled: true
    });

    broadcastUserCount();
    console.log('a user connected');

    socket.on('registerClient', ({ isPresenter = false, autoScrollEnabled = true } = {}) => {
        clientStates.set(socket.id, {
            isPresenter,
            autoScrollEnabled
        });

        broadcastUserCount();

        if (!isPresenter && autoScrollEnabled && lastScrollId !== null) {
            socket.emit('scrollTo', lastScrollId);
        }
    });

    socket.on('toggleScroll', (isEnabled) => {
        const currentState = clientStates.get(socket.id) || {
            isPresenter: false,
            autoScrollEnabled: true
        };

        currentState.autoScrollEnabled = isEnabled;
        clientStates.set(socket.id, currentState);
        broadcastUserCount();

        if (!currentState.isPresenter && isEnabled && lastScrollId !== null) {
            socket.emit('scrollTo', lastScrollId);
        }
    });

    socket.on('scrollTo', (pId) => {
        lastScrollId = pId;
        io.emit('scrollTo', pId);
    });

    socket.on('disconnect', () => {
        clientStates.delete(socket.id);
        broadcastUserCount();
        console.log('user disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
