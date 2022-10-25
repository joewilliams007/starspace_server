// Edit Post

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
    content = req.body.content
    post_id = req.body.post_id

    
    // Authenticate user id and password
    authenticate.identify(user_id, password, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            saveEditPost();
        }
    })

    function saveEditPost(){

        db.query(
            `UPDATE Posts set content = "${content}", edited = true, edited_timestamp = ${timestamp} WHERE post_id = ${post_id} AND user_id = ${user_id}`
            , function (error, results, fields) {

                if (error) {
                    console.log("error\n\n" + error.message);

                    res.status(200).json({
                        success: false,
                        error: true,
                        message: "error getting user id"
                    })
                } else {
                    res.status(200).json({
                        success: false,
                        error: false,
                        message: "ok"
                    })
                }

        });
    }
}