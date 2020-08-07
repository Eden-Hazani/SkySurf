const jwt = require("jsonwebtoken");

function isLoggedIn(request, response, next) {
    if (!request.headers.authorization) {
        response.status(401).send("You are not logged in")
    }
    const token = request.headers.authorization.split(" ")[1].replace(/['"]+/g, '');
    if (!token) {
        response.status(401).send("You are not logged in")
    }
    jwt.verify(token, config.jwt.secretKey, (err, payload) => {
        if (err) {
            if (err.message === 'jwt expired') {
                console.log('expired')
                response.status(403).send("Your Logging session has expired")
                return;
            }
            response.status(401).send("You are not logged in")
            return;
        }
        console.log('Connected & passed')
        next();
    })

}

module.exports = isLoggedIn;