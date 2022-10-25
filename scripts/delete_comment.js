// Feed

module.exports = (req, res) => {
    var { user_id } = req.params;
    var { password } = req.params;
    var { comment_id } = req.params;
    var { post_id } = req.params;

    var db = require('./db');
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    var authenticate = require('./authenticate');

    // Authenticate user id and password
    authenticate.identify(user_id, password, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
   
            db.query(
                `DELETE
                FROM Comments
                WHERE user_id=${user_id}
                AND comment_id = ${comment_id}`
                , function (error, results, fields) {
                    if (error) {
                        console.log(error.message);
                        res.status(200).json({
                            success: false,
                            error: true,
                            message: error.message
                    })
                    } else {

                        db.query(
                            `UPDATE Posts set comments = comments - 1 WHERE post_id = ${post_id}`
                            , function (error, results, fields) {

                                res.status(200).json({ 
                                    success: true,
                                    error: false,
                                    message: "ok" })
                        });
                
                                
                    }
            });
        }
    })
}