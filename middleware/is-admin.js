function isAdmin(request, response, next) {
    if (!request.session.user) {
        response.status(401).send("Please LogIn First")
        return;
    }
    if (!request.session.user.isAdmin) {
        response.status(403).send("You Are Not An Admin!")
        return;
    }
    next();
}

module.exports = isAdmin;