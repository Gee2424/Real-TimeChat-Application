const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let userList = [];

app.use(express.static('public'));

io.on('connection', (socket) => {
    socket.on('username', (username) => {
        socket.username = username;
        userList.push(username);
        io.emit('userList', userList);
        console.log(`${username} connected`);
    });

    socket.on('disconnect', () => {
        userList = userList.filter(user => user !== socket.username);
        io.emit('userList', userList);
        console.log(`${socket.username} disconnected`);
    });

    socket.on('chat message', (msg) => {
        io.emit('chat message', { user: socket.username, message: msg });
    });
});

server.listen(3000, () => {
    console.log('listening on *:3000');
});
