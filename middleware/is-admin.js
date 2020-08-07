const checkIfAdmin = require('../business-logic/middleware-logic')

async function isAdmin(request, response, next) {
    const admin = {
        uuid: request.headers.userlogged
    }
    if ((request.url === '/modify' && !request.headers.userlogged) || (request.url === '/addVacation' && !request.headers.userlogged)) {
        if (!checkIfAdmin(request.body.isAdmin)) {
            response.status(403).send("You Are Not An Admin!")
            return;
        }
    }
    if (request.url !== '/modify' && request.url !== '/addVacation') {
        if (!request.headers.userlogged) {
            response.status(401).send("Please LogIn First")
            return;
        }
        if (!checkIfAdmin(admin)) {
            response.status(403).send("You Are Not An Admin!")
            return;
        }
    }
    next();
}

module.exports = isAdmin;