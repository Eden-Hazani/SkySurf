const checkIfAdmin = require('../business-logic/middleware-logic')

async function isUser(request, response, next) {
    const admin = {
        uuid: request.headers.userlogged
    }
    if (!request.headers.userlogged) {
        response.status(401).send("Please LogIn First")
        return;
    }
    if (await checkIfAdmin(admin)) {
        response.status(403).send("Admin cannot follow Vacations")
        return;
    }
    next();
}

module.exports = isUser;