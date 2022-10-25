// Identify user

module.exports = {
    identify: function (user_id, password, res, callback) {

        var moment = require('moment');
        var date = moment().format('YYYY-MM-DD');
        var db = require('./db');
        var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds
        const bcrypt = require('bcrypt');
        const saltRounds = 10;

        console.log("proccess identify of user id #"+user_id)

        db.query(
            `SELECT COUNT(*) AS RowCount FROM Users WHERE user_id=${user_id}`
            , function (error, results, fields) {

                if (error) {

                    console.log('authentication error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: "ok"
                    })
                    return callback(false);
                }

                if (Number(results[0].RowCount) == 0) {

                    console.log("authentication invalid. user id does not exist");
                    res.status(200).json({
                        success: false,
                        error: false,
                        message: "authentication invalid. user id does not exist"
                    })
                    return callback(false);
                } else {

                    db.query(
                        `SELECT password FROM Users WHERE user_id=${user_id}`
                        , function (error, passw_results, fields) {

                            // Load hash from your password DB.
                            bcrypt.compare(password, passw_results[0].password, function (err, result) {

                                // result == true
                                if (result) {

                                    return callback(true);

                                } else {
                                    res.status(200).json({
                                        success: false,

                                        error: false,
                                        message: "wrong password"
                                    })
                                    return callback(false);
                                }


                            });

                        });

                }
        })
    }
};

