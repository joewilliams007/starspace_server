// Notif Amount

module.exports = (req, res) => {

    var db = require('./db');
    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');
    var authenticate = require('./authenticate');

    var { user_id } = req.params;
    var { password } = req.params;

    // Authenticate user id and password
    authenticate.identify(user_id, password, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            db.query(
                `SELECT COUNT(*) AS RowCount FROM Notif WHERE user_id = ${user_id} AND seen = false AND source_user_id != ${user_id}`
                , function (error, results, fields) {
        
                    if (error) {
        
                        console.log('check error '+error.message);
                        res.status(200).json({ 
                            success: false,
                            error: true,
                            message: "ok" })
        
                    }
        
                    console.log()
                    if (Number(results[0].RowCount) == 0) {
        
                        res.status(200).json({ 
                            success: false,
                            error: false,
                            message: "no new notifs"})
                            
        
        
                    } else {
        
                        res.status(200).json({ 
                            success: true,
                            error: false,
                            message: `${results[0].RowCount}` })
        
                    }
            });
        }
    })
}
