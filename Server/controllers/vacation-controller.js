const express = require('express');
const { request, response } = require('express');
const loggedIn = require('../middleware/logged-in')
const isAdmin = require('../middleware/is-admin')
const isUser = require('../middleware/is-user');
const Vacation = require('../models/vacation-model')
const vacationLogic = require('../business-logic/vacation-logic');
const router = express.Router();


// for everyone
router.get('/getVacations', loggedIn, async(request, response) => {
    try {
        const vacations = await vacationLogic.getAllVacations()
        response.send(vacations)
    } catch (err) {
        response.status(500).send(err.message)
    }
})


// only for USERS
router.patch('/followVacation', isUser, async(request, response) => {
    try {
        const vacations = request.body;
        const addedVacations = await vacationLogic.followVacation(vacations)
        response.json(addedVacations)
    } catch (err) {
        response.status(500).send(err.message)
    }
})


// only for USERS
router.patch('/unfollowVacation', isUser, async(request, response) => {
    try {
        const vacations = request.body;
        const addedVacations = await vacationLogic.unfollowVacation(vacations)
        response.json(addedVacations)
    } catch (err) {
        response.status(500).send(err.message)
    }
})


// only for ADMIN
router.post('/addVacation', isAdmin, async(request, response) => {
    try {
        const vacation = new Vacation(
            0,
            request.body.description,
            request.body.destination,
            request.body.vacationImg,
            request.body.vacationDates,
            request.body.price,
            0)
        const addedVacation = await vacationLogic.addVacation(vacation)
        response.status(201).json(addedVacation)
    } catch (err) {
        response.status(500).send(err.message)
    }
})

// only for ADMIN
router.delete('/removeVacation/:id', isAdmin, async(request, response) => {
    try {
        const id = +request.params.id;
        await vacationLogic.removeVacation(id);
        response.sendStatus(204)
    } catch (err) {
        response.status(500).send(err.message)
    }
})

// only for ADMIN
router.patch('/modify', isAdmin, async(request, response) => {
    try {
        const vacations = request.body;
        const modifiedVacation = await vacationLogic.modifyVacation(vacations);
        response.json(modifiedVacation);
    } catch (err) {
        response.status(500).send(err.message)
    }
})

module.exports = router;