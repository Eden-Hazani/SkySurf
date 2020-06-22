if (process.env.NODE_ENV === "production") {
    global.config = require('./config-prod.json');
} else {
    global.config = require('./config-dev.json');
}
const express = require('express');
const cors = require('cors');
const authController = require('./controllers/auth-controller');
const vacationController = require('./controllers/vacation-controller');
const session = require('express-session');
const socketIo = require('socket.io');
const path = require("path");

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

server.use(express.static(path.join(__dirname, "./_front-end")));
server.use(express.json());
server.use('/api', authController);
server.use('/api/vacations', vacationController);
server.use("*", (request, response) => {
    response.sendFile(path.join(__dirname, './_front-end/index.html'))
})



const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Connected to port ${port}`))