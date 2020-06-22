global.config = require('./config.json');
const express = require('express');
const cors = require('cors');
const authController = require('./controllers/auth-controller');
const vacationController = require('./controllers/vacation-controller');
const session = require('express-session');
const socketIo = require('socket.io');

const server = express();
server.use(cors({
    origin: 'http://localhost:3001',
    credentials: true
}));

server.use(session({
    name: "userSession",
    secret: 'session',
    resave: true,
    saveUninitialized: false
}));
server.use(express.static(__dirname));
server.use(express.json());
server.use('/api', authController);
server.use('/api/vacations', vacationController);





server.listen(3000, () => console.log('Connected!'))