function isUser(request, response, next) {
    if (!request.session.user) {
        response.status(401).send("Please LogIn First")
        return;
    }
    if (request.session.user.isAdmin) {
        response.status(403).send("Admin cannot follow Vacations")
        return;
    }
    next();
}

module.exports = isUser;