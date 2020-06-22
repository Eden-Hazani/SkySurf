const express = require('express');
const authLogic = require('../business-logic/auth-logic');
const User = require('../models/user-model');
const router = express.Router();


router.post("/register", async(request, response) => {
    try {
        const user = new User(
            0,
            request.body.userName,
            request.body.passWord,
            0,
            0);
        const validation = await authLogic.validateRegister(user);
        if (validation[0] !== undefined) {
            response.status(401).send('User Already exists in system!')
            return
        }
        const addedUser = await authLogic.register(user);
        request.session.user = addedUser;
        response.status(201).json(addedUser);
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.post("/login", async(request, response) => {
    try {
        const credentials = new User(
            0,
            request.body.userName,
            request.body.passWord,
            0,
            0);
        const user = await authLogic.login(credentials);
        if (!user) {
            response.status(401).send('User not in System')
            return;
        }
        request.session.user = user;
        response.json(user);
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.post("/logout", (request, response) => {
    try {
        request.session.destroy();
        response.end();
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.get('/userLogged', async(request, response) => {
    if (request.session.user === undefined) {
        response.status(401).send('Not Allowed')
        return;
    }
    response.json(request.session.user);
})


module.exports = router;