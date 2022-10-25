// Registration

module.exports = (req, res) => {

    var db = require('./db');
    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');

    var { username } = req.params;
   
    console.log(username)

    db.query(
        `SELECT COUNT(*) AS RowCount FROM Users WHERE username="${username}"`
        , function (error, username_results, fields) {

            if (error) {

                console.log('check error '+error.message);
                res.status(200).json({ 
                    success: false,
                    error: true,
                    message: "ok" })

            }

            console.log(username_results[0].RowCount)
            if (Number(username_results[0].RowCount) == 0) {

                res.status(200).json({ 
                    success: true,
                    error: false,
                    message: "username available" }) // Username available
                    
                    console.log("available")


            } else {

                res.status(200).json({ 
                    success: false,
                    error: false,
                    message: "username already taken" }) // Username not accepted, Internal Conflict

            }
    });
 
}