const express = require('express');
const authLogic = require('../business-logic/auth-logic');
const User = require('../models/user-model');
const jwt = require('jsonwebtoken');
const { request, response } = require('express');
const router = express.Router();

router.post("/register", async(request, response) => {
    try {
        const credentials = new User(
            0,
            0,
            request.body.userName,
            request.body.passWord,
            request.body.firstName,
            request.body.lastName,
            0);
        const validation = await authLogic.validateRegister(credentials);
        if (validation.length > 0) {
            response.status(401).send('User Already exists in system!')
            return
        }
        const user = await authLogic.register(credentials);
        const token = jwt.sign({ user }, config.jwt.secretKey, { expiresIn: "30m" })
        response.status(201).json({ user, token });
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.post("/login", async(request, response) => {
    try {
        const credentials = new User(
            0,
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
        const token = jwt.sign({ user }, config.jwt.secretKey, { expiresIn: "30m" })
        response.json({ user, token });
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.patch("/userDetails/:uuid", async(request, response) => {
    try {
        const details = request.body;
        details.uuid = request.params.uuid
        await authLogic.changeUserDetails(details);
        const token = jwt.sign({ details }, config.jwt.secretKey, { expiresIn: "30m" })
        response.json({ details, token });
    } catch (err) {
        console.log(err.message)
    }
})

router.post("/checkPass", async(request, response) => {
    try {
        const user = request.body;
        const userResponse = await authLogic.validatePassword(user);
        response.json(userResponse);
    } catch (err) {
        console.log(err.message)
    }
})



module.exports = router;