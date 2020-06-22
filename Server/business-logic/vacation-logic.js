const dal = require('../data-access-layer/dal');


async function getAllVacations() { //for every user that has signed in. 
    const sql = `SELECT * FROM vacations`
    const vacations = await dal.executeAsync(sql);
    return vacations;
}

async function followVacation(pickedVacation) { //ONLY FOR USERS
    // needs - User Id + pickedVacation Id 
    const sql = `UPDATE users SET followsVacations = CONCAT(followsVacations,'${pickedVacation.id},') WHERE userId = ${pickedVacation.userId}`
    const updatedVacations = await dal.executeAsync(sql);
    return updatedVacations;
}

async function unfollowVacation(pickedVacation) { //ONLY FOR USERS  
    // needs - User Id + pickedVacation Id 
    const sql = `UPDATE users SET followsVacations = REPLACE(followsVacations, '${pickedVacation.id},' ,'') WHERE userId = ${pickedVacation.userId}`
    const updatedVacations = await dal.executeAsync(sql);
    return updatedVacations;
}
// UPDATE table SET fieldname=REPLACE(fieldname,'APS','')



async function addVacation(vacation) { //for ADMIN ONLY!
    const sql = `INSERT INTO vacations
        VALUES(DEFAULT,
        '${vacation.description}',
        '${vacation.destination}',
        '${vacation.vacationImg}',
        '${vacation.vacationDates}',
         ${vacation.price}
         ,DEFAULT)`
    const addedVacation = await dal.executeAsync(sql);
    vacation.vacationId = addedVacation.insertId
    return vacation;
}

async function removeVacation(vacationId) { //for ADMIN ONLY!
    // needs - vacation ID
    const sql = `DELETE FROM vacations WHERE '${vacationId}' = vacationId`
    const Removed = await dal.executeAsync(sql);
    return Removed;
}


async function modifyVacation(vacation) { //for ADMIN ONLY!
    const sql = `UPDATE vacations SET 
    description = (CASE WHEN description <> '${vacation.description}' THEN '${vacation.description}' ELSE description END),
    destination = (CASE WHEN destination <> '${vacation.destination}' THEN '${vacation.destination}' ELSE destination END),
    vacationImg = (CASE WHEN vacationImg <> '${vacation.vacationImg}' THEN '${vacation.vacationImg}' ELSE vacationImg END),
    vacationDates = (CASE WHEN vacationDates <> '${vacation.vacationDates}' THEN '${vacation.vacationDates}' ELSE vacationDates END),
    price = (CASE WHEN price <> ${vacation.price} THEN ${vacation.price} ELSE price END)
    WHERE ${vacation.vacationId} = vacationId`
    const modified = await dal.executeAsync(sql);
    return modified;
}


module.exports = {
    getAllVacations,
    followVacation,
    addVacation,
    modifyVacation,
    removeVacation,
    unfollowVacation
}