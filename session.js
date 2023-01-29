// Create / Verify sessions

module.exports = {
    verify: function (user_id, session_id, res, callback) {

        var moment = require('moment');
        var date = moment().format('YYYY-MM-DD');
        var db = require('./db');
        var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds
        var ipAddress = req.socket.remoteAddress;

        console.log("verifying session: "+session_id+" with ip: "+ipAddress)

        db.query(
            `SELECT COUNT(*) AS RowCount FROM Sessions WHERE ip="${ipAddress}" AND session_id=${session_id}`
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

                    console.log("authentication invalid. session does not exist with this ip address");
                    res.status(200).json({
                        success: false,
                        error: false,
                        message: "authentication invalid. session does not exist"
                    })
                    return callback(false);
                } else {

                    db.query(
                        `SELECT user_id FROM Sessions WHERE ip="${ipAddress}" AND session_id=${session_id}`
                        , function (error, session_results, fields) {
                                    return callback(true, session_results[0].user_id);
                        });

                }
        })
    }
};

