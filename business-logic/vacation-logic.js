const dal = require('../data-access-layer/dal');
const { json } = require('express');


async function getAllUnPickedVacations(unPickedVacations) { //for every user that has signed in. 
    let sql = `SELECT * FROM vacations`;
    if (unPickedVacations.data.pickedVacations.length > 0) {
        sql = sql.concat(` WHERE`)
        for (let item of unPickedVacations.data.pickedVacations) {
            sql = sql.concat(` vacationId <> ${item} AND `)
        }
        sql = sql.slice(0, -5)
    }
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

async function getAllPickedVacations(userId) {
    const sql = `SELECT vacations.* FROM vacations JOIN usersvsvacations ON vacations.vacationID = usersvsvacations.vacationID AND usersvsvacations.userId = ${userId}`
    const vacations = await dal.executeAsync(sql)
    return vacations;
}

async function followVacation(pickedVacation) { //ONLY FOR USERS
    const sql = `INSERT INTO usersvsvacations VALUES(${pickedVacation.userId} , ${pickedVacation.vacationId})`
    const secSql = `UPDATE vacations SET numberOfFollowers=(numberOfFollowers+1) WHERE vacations.vacationId = ${pickedVacation.vacationId}`;
    const updatedVacations = await dal.executeAsync(sql);
    await dal.executeAsync(secSql)
    return updatedVacations;
}

async function unfollowVacation(pickedVacation) { //ONLY FOR USERS  
    const sql = `DELETE FROM usersvsvacations WHERE ${pickedVacation.vacationId} = usersvsvacations.vacationID AND ${pickedVacation.userId} = usersvsvacations.userId`
    const secSql = `UPDATE vacations SET numberOfFollowers=(numberOfFollowers-1) WHERE vacations.vacationId = ${pickedVacation.vacationId}`;
    const updatedVacations = await dal.executeAsync(sql);
    await dal.executeAsync(secSql)
    return updatedVacations;
}
// UPDATE table SET fieldname=REPLACE(fieldname,'APS','')



async function addVacation(vacation) { //for ADMIN ONLY!
    const sql = `INSERT INTO vacations
        VALUES(DEFAULT,
        '${vacation.description}',
        '${vacation.destination}',
        '${vacation.startDate}',
        '${vacation.endDate}',
        '${vacation.vacationImg}',
         ${vacation.price}
         ,DEFAULT)`
    const addedVacation = await dal.executeAsync(sql);
    vacation.vacationId = addedVacation.insertId
    return vacation;
}

async function getAllVacations() {
    const sql = `SELECT * FROM vacations`;
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

async function removeVacation(vacationId) { //for ADMIN ONLY!
    // needs - vacation ID
    const sql = `DELETE FROM vacations WHERE '${vacationId}' = vacationId`
    const Removed = await dal.executeAsync(sql);
    return Removed;
}


async function modifyVacation(vacation) { //for ADMIN ONLY!
    console.log(vacation.startDate)
    const sql = `UPDATE vacations SET 
    description = (CASE WHEN '${vacation.description}' = 'undefined' THEN description ELSE  '${vacation.description}' END),
    destination = (CASE WHEN '${vacation.destination}' = 'undefined' THEN destination ELSE '${vacation.destination}' END),
    startDate = (CASE WHEN '${vacation.startDate}' = 'undefined' THEN startDate ELSE '${vacation.startDate}' END),
    endDate = (CASE WHEN '${vacation.endDate}' = 'undefined' THEN endDate ELSE '${vacation.endDate}' END),
    vacationImg = (CASE WHEN '${vacation.vacationImg}' = 'noImageEntered' THEN vacationImg ELSE '${vacation.vacationImg}' END),
    price = (CASE WHEN ${vacation.price} = -1 THEN price ELSE ${vacation.price} END)
    WHERE ${vacation.vacationId} = vacationId`
    const modified = await dal.executeAsync(sql);
    return modified;
}


module.exports = {
    getAllUnPickedVacations,
    followVacation,
    addVacation,
    modifyVacation,
    removeVacation,
    unfollowVacation,
    getAllPickedVacations,
    getAllVacations
}