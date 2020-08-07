const crypto = require("crypto");

const salt = "SkySurfer"

function hash(string) {
    return crypto.createHmac("sha512", salt).update(string).digest('hex');
}

module.exports = hash