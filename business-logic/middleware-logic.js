const dal = require('../data-access-layer/dal');
const hash = require('../helpers/hash')


async function checkIfAdmin(user) {
    try {
        const sql = `SELECT isAdmin FROM users WHERE isAdmin = '${user}'`;
        const result = await dal.executeAsync(sql);
        if (result.length === 0 || result[0].isAdmin !== hash('isAdmin')) {
            return false
        }
        return true;

    } catch (err) {
        response.status(500).send(err.message)
    }
}

module.exports = checkIfAdmin;