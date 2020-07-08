let origin;
if (process.env.NODE_ENV === "production") {
    global.config = require('./config-prod.json');
    origin = 'http://www.sky-surfer.com'
} else {
    global.config = require('./config-dev.json');
    origin = 'http://localhost:3001'
}
const express = require('express');
const cors = require('cors');
const authController = require('./controllers/auth-controller');
const vacationController = require('./controllers/vacation-controller');
const session = require('express-session');
const socketIo = require('socket.io');
const path = require("path");
const fileUpload = require("express-fileupload");

const server = express();
server.use(cors({
    origin: origin,
    credentials: true
}));

server.use(session({
    name: "userSession",
    secret: 'session',
    resave: true,
    saveUninitialized: false
}));
server.use(fileUpload());
server.use(express.static(path.join(__dirname, "./_front-end")));
server.use(express.json());
server.use('/api', authController);
server.use('/api/vacations', vacationController);
server.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, './_front-end/index.html'));
});


const port = process.env.PORT || 3000;
const listener = server.listen(port, () => console.log(`Connected to port ${port}`));
global.socketServer = socketIo(listener);
