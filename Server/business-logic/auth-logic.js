const dal = require('../data-access-layer/dal');

async function register(user) {
    const sql = `INSERT INTO users VALUES(DEFAULT,'${user.userName}','${user.passWord}',DEFAULT,DEFAULT)`
    const info = await dal.executeAsync(sql);
    user.userId = info.insertId;
    return user;
}

async function validateRegister(user) {
    const sql = `SELECT * FROM users WHERE userName = '${user.userName}' AND passWord = '${user.passWord}'`
    const users = await dal.executeAsync(sql);
    return users;
}

async function login(credentials) {
    const sql = `SELECT * FROM users
    WHERE userName = '${credentials.userName}'
    AND passWord = '${credentials.passWord}'`;

    const users = await dal.executeAsync(sql);
    const user = users[0];
    return user;

}



module.exports = {
    register,
    login,
    validateRegister
}