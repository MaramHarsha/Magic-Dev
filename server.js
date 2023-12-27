// server.js

const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static('public'));

// Serve audio files
app.use('/audio', express.static(path.join(__dirname, 'public', 'audio')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/control', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'control.html'));
});

let isMusicPlaying = false;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('playMusic', () => {
        isMusicPlaying = true;
        io.emit('musicStatus', isMusicPlaying);
    });

    socket.on('stopMusic', () => {
        isMusicPlaying = false;
        io.emit('musicStatus', isMusicPlaying);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
