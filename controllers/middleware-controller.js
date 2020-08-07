const express = require('express');
const router = express.Router();
const middlewareLogic = require('../business-logic/middleware-logic')
const isLogged = require('../middleware/logged-in')

router.get('/isUserAdmin/:isAdmin', async(request, response) => {
    try {
        const isAdmin = request.params.isAdmin;
        const result = await middlewareLogic(isAdmin);
        response.json(result);
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.get('/isUserLogged', isLogged, async(request, response) => {
    try {} catch (err) {
        response.status(500).send(err.message)
    }
})

module.exports = router;