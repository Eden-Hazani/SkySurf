function isLoggedIn(request, response, next) {
    if (!request.session.user) {
        response.status(401).send("Please LogIn First")
        return;
    }
    next();
}

module.exports = isLoggedIn;