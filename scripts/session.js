// Create / Verify sessions

module.exports = {
    verify: function (session, req, res, callback) {
        var db = require('./db');
        var ipAddress = req.socket.remoteAddress;
        

        console.log("verifying session: "+session+" with ip: "+ipAddress)

        db.query(
            `SELECT COUNT(*) AS RowCount FROM Sessions WHERE ip="${ipAddress}" AND session_id="${session}"`
            , function (error, results, fields) {

                if (error) {

                    console.log('authentication error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: "ok"
                    })
           
                }

                if (Number(results[0].RowCount) == 0) {

                    console.log("authentication invalid. session does not exist with this ip address");
                    res.status(200).json({
                        success: false,
                        error: false,
                        message: "authentication invalid. session does not exist"
                    })
                   
                } else {

                    db.query(
                        `SELECT user_id FROM Sessions WHERE ip="${ipAddress}" AND session_id="${session}"`
                        , function (error, session_results, fields) {
                                    return callback(true, session_results[0].user_id);
                        });

                }
        })
    }, create: function (username, req, res, callback) {

        var moment = require('moment');
        var date = moment().format('YYYY-MM-DD');
        var db = require('./db');
        var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds
        var ipAddress = req.socket.remoteAddress;

        console.log("creating session with ip: "+ipAddress)

        function randomStr(strLength) {
            const chars = [ ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789' ];
            return [ ...Array(strLength) ]
              .map(() => chars[Math.trunc(Math.random() * chars.length)])
              .join('');
          }

        function uids() {
           const now = String(Date.now());
            const middlePos = Math.ceil(now.length / 2);
            let output = `${now}-${randomStr(6)}-${now.substr(middlePos)}`;
           return output;
        }

       
        db.query(
            `SELECT user_id
            FROM Users
            WHERE username = "${username}"`
            , function (error, results, fields) {
                if (error) console.log(error.message);
                var uid = uids()
            
                var db_res = JSON.parse(JSON.stringify(results))
                                    
                    db.query(
                        `INSERT INTO Sessions (session_id, user_id, ip, timestamp) 
                        VALUES ("${uid}",${db_res[0].user_id},"${ipAddress}","${timestamp}"
                        );`
                        , function (error, results, fields) {
                            if (error) {
            
                                console.log('creating session failed '+error.message);
                                res.status(200).json({ 
                                    success: false,
                                    error: true,
                                    message: "ok" })
            
                            } else {

                             
                                    return callback(uid);
                             
                            };
                              //  console.log()
                                //return callback();
                            
                    });
            })
    }

};

