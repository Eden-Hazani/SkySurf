const express = require('express');
const { request, response } = require('express');
const loggedIn = require('../middleware/logged-in')
const isAdmin = require('../middleware/is-admin')
const isUser = require('../middleware/is-user');
const Vacation = require('../models/vacation-model')
const vacationLogic = require('../business-logic/vacation-logic');
const router = express.Router();
const uuid = require('uuid');




// for everyone
router.get('/getPickedVacations/:id', loggedIn, async(request, response) => {
    try {
        const id = +request.params.id;
        const vacations = await vacationLogic.getAllPickedVacations(id)
        response.send(vacations)
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.post('/getUnPickedVacations', loggedIn, async(request, response) => {
    try {
        const unPickedVacations = request.body;
        const vacations = await vacationLogic.getAllUnPickedVacations(unPickedVacations)
        response.send(vacations)
    } catch (err) {
        response.status(500).send(err.message)
    }
})


// only for USERS
router.post('/followVacation', isUser, async(request, response) => {
    try {
        const vacations = request.body;
        const addedVacations = await vacationLogic.followVacation(vacations.data)
        response.json(addedVacations)
        const updatedVacations = await vacationLogic.getAllVacations();
        global.socketServer.emit("admin-change", updatedVacations);
    } catch (err) {
        response.status(500).send(err.message)
    }
})


// only for USERS
router.delete('/unfollowVacation', isUser, async(request, response) => {
    try {
        const vacations = request.body;
        await vacationLogic.unfollowVacation(vacations)
        response.sendStatus(204)
        const updatedVacations = await vacationLogic.getAllVacations();
        global.socketServer.emit("admin-change", updatedVacations);
    } catch (err) {
        response.status(500).send(err.message)
    }
})


// only for ADMIN
router.delete('/removeVacation/:id', isAdmin, async(request, response) => {
    try {
        const id = +request.params.id;
        await vacationLogic.removeVacation(id);
        response.sendStatus(204);
        const updatedVacations = await vacationLogic.getAllVacations();
        global.socketServer.emit("admin-change", updatedVacations);
    } catch (err) {
        response.status(500).send(err.message)
    }
})

router.get('/getAllVacations', isAdmin, async(request, response) => {
    try {
        const vacations = await vacationLogic.getAllVacations();
        response.json(vacations);
    } catch (err) {
        response.status(500).send(err.message)
    }
})

// only for ADMIN
router.post('/addVacation', isAdmin, async(request, response) => {
    try {
        const vacations = request.body;
        if (vacations.price === undefined) {
            vacations.price = -1;
        }
        if (!request.files) {
            vacations.vacationImg = 'noImageEntered'
        }
        if (request.files) {
            const image = request.files.vacationImg;
            const extension = image.name.substr(image.name.lastIndexOf('.'))
            const newFileName = uuid.v4() + extension;
            vacations.vacationImg = newFileName
            image.mv("./_front-end/uploads/" + newFileName)
        }
        const vacation = new Vacation(
            0,
            request.body.description,
            request.body.destination,
            request.body.startDate,
            request.body.endDate,
            request.body.vacationImg,
            request.body.price,
            0)
        const addedVacation = await vacationLogic.addVacation(vacation)
        response.status(201).json(addedVacation)
        const updatedVacations = await vacationLogic.getAllVacations();
        global.socketServer.emit("admin-change", updatedVacations);
    } catch (err) {
        response.status(500).send(err.message)
    }
})

// only for ADMIN
router.post('/modify', isAdmin, async(request, response) => {
    try {
        const vacations = request.body;
        if (vacations.price === undefined) {
            vacations.price = -1;
        }
        if (!request.files) {
            vacations.vacationImg = 'noImageEntered'
        }
        if (request.files) {
            const image = request.files.vacationImg;
            const extension = image.name.substr(image.name.lastIndexOf('.'))
            const newFileName = uuid.v4() + extension;
            vacations.vacationImg = newFileName
            image.mv("./_front-end/uploads/" + newFileName)
        }
        const modifiedVacation = await vacationLogic.modifyVacation(vacations);
        response.json(modifiedVacation);
        const updatedVacations = await vacationLogic.getAllVacations();
        global.socketServer.emit("admin-change", updatedVacations);
    } catch (err) {
        response.status(500).send(err.message)
    }
})

module.exports = router;