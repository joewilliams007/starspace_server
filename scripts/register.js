// Registration

module.exports = (req, res) => {

    var db = require('./db');
    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    var { username } = req.params;
    var { email } = req.params;
    var { password } = req.params;

    console.log(username)
    console.log(email)
    console.log(password)


    db.query(
        `SELECT COUNT(*) AS RowCount FROM Users WHERE username="${username}"`
        , function (error, username_results, fields) {

            if (error) {

                console.log('registration error ' + error.message);
                res.status(200).json({
                    success: false,
                    error: true,
                    message: "ok"
                })

            }

            console.log(username_results[0].RowCount)
            if (Number(username_results[0].RowCount) == 0) {

                db.query(
                    `SELECT COUNT(*) AS RowCount FROM Users WHERE email="${email}"`
                    , function (error, email_results, fields) {

                        if (error) {

                            console.log('registration error ' + error.message);
                            res.status(200).json({
                                success: false,
                                error: true,
                                message: "ok"
                            })

                        }

                        if (Number(email_results[0].RowCount) == 0) {

                            var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

                            bcrypt.genSalt(saltRounds, function (err, salt) {
                                bcrypt.hash(password, salt, function (err, hash) {
                                    // Store hash in your password DB.

                                    db.query(
                                        `INSERT INTO Users (username, email, password, timestamp, account_created) 
                                        VALUES ("${username}","${email}","${hash}","${timestamp}","${date}")`
                                        , function (error, results, fields) {
                                            if (error) {

                                                console.log('registration error ' + error.message);
                                                res.status(200).json({
                                                    success: false,
                                                    error: true,
                                                    message: "ok"
                                                })

                                            } else {

                                                var session = require('./session.js');

                                                // Authenticate session and ip
                                                session.create(username, req, res, function (session) {

                                                    db.query(

                                                        `SELECT user_id Users
                                                WHERE username="${username}"`
                                                        , function (error, results, fields) {
                                                            if (error) console.log("error\n\n" + error.message);
                    
                                                            var dbRes = JSON.parse(JSON.stringify(results))
                    
                                                            res.status(200).json({
                                                                success: true,
                                                                error: false,
                                                                session: session,
                                                                user_id: dbRes[0].user_id,
                                                                message: "ok"
                                                            })         
                                                            console.log('registration successfull');  
                                                        });
                                                })

                                            }

                                        });
                                });
                            });



                        } else {

                            console.log('email taken');
                            res.status(200).json({
                                success: false,
                                error: false,
                                message: "email already taken"
                            }) // Email not accepted, Internal Conflict

                        }
                    });

            } else {
                console.log('username taken');

                res.status(200).json({
                    success: false,
                    error: false,
                    message: "username already taken"
                }) // Username not accepted, Internal Conflict

            }
        });
}