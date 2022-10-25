// Edit Account

module.exports = (req, res) => {

    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');
    var db = require('./db');
    var notif = require('./notif');
    var authenticate = require('./authenticate');
    var update_db = require('./update_db');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

    const sharp = require('sharp');
    var fs = require('fs');
    const bcrypt = require('bcrypt');

    user_id = req.body.user_id
    password = req.body.password
    replacement = req.body.replacement
    edit_type = req.body.edit_type

    
    // Authenticate user id and password
    authenticate.identify(user_id, password, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            saveEditAcount();
        }
    })

    function saveEditAcount(){

        if (edit_type == "edit-bio") {

            var q = `UPDATE Users set bio = "${replacement}" WHERE user_id = ${user_id}`
            update_db.query(q, res)

        }
    }
}