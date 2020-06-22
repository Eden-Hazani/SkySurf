const mysql = require("mysql");

// Create connection to the database:
const connection = mysql.createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

// connection.connect(err => {
//     if (err) {
//         console.error(err);
//         return;
//     }
//     console.log("We're connected");
// });

// Execute SQL statement:
function executeAsync(sql) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(result);
        });
    });
}

module.exports = {
    executeAsync
};