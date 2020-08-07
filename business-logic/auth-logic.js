const dal = require('../data-access-layer/dal');
const uuid = require('uuid');
const hash = require('../helpers/hash')

async function register(user) {
    user.uuid = uuid.v4();
    user.isAdmin = hash('notAdmin');
    const sql = `INSERT INTO users VALUES(DEFAULT,'${user.uuid}','${user.userName}','${user.passWord}','${user.firstName}','${user.lastName}','${user.isAdmin}')`
    const info = await dal.executeAsync(sql);
    user.userId = info.insertId
    delete user.password
    return user;
}

async function validateRegister(user) {
    const sql = `SELECT * FROM users WHERE userName = '${user.userName}'`
    const users = await dal.executeAsync(sql);
    return users;
}

async function login(credentials) {
    const sql = `SELECT userId, uuid, userName, firstName, lastName, isAdmin FROM users
    WHERE userName = '${credentials.userName}'
    AND passWord = '${credentials.passWord}'`;
    const users = await dal.executeAsync(sql);
    const user = users[0];
    return user;

}

async function validatePassword(userDetails) {
    const sql = `SELECT uuid FROM users WHERE userName = '${userDetails.userName}' AND passWord = '${userDetails.password}'`;
    const user = await dal.executeAsync(sql);
    if (user[0]) {
        return true;
    }
    return false;
}

async function changeUserDetails(details) {
    const sql = `UPDATE users SET
    userName = (CASE WHEN '${details.userName}' = 'undefined' THEN userName ELSE '${details.userName}' END),
    passWord = (CASE WHEN '${details.passWord}' = 'undefined' THEN passWord ELSE '${details.passWord}' END)
    WHERE '${details.uuid}' = uuid`
    const responseDetails = await dal.executeAsync(sql);
    return responseDetails;
}



module.exports = {
    register,
    login,
    validateRegister,
    changeUserDetails,
    validatePassword
}