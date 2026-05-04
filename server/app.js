const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const session = require('express-session');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

app.use(session({
    secret: 'nora-deli-secret',
    resave: false,
    saveUninitialized: false
}));

server.listen(3000, () => {
    console.log('Server körs på http://localhost:3000');
});