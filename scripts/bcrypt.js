const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function hash(plaintextPassword) {

    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(plaintextPassword, salt, function(err, hash) {
            // Store hash in your password DB.
            console.log (hash)
            return hash;
        });
    });
}

module.exports = function compare(plaintextPassword) {

    // Load hash from your password DB.
    bcrypt.compare(plaintextPassword, hash, function(err, result) {
    // result == true
    console.log(result)
    });
}