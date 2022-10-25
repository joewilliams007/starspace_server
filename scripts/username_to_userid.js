// Convert username to user id

module.exports = (req, res) => {

    var db = require('./db');
    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');

    var { username } = req.params;

            
        db.query(
            `SELECT COUNT(*) AS RowCount FROM Users WHERE username="${username}"`
            , function (error, username_results, fields) {
    
                if (error) {
    
                    console.log('login error '+error.message);
                    res.status(200).json({ 
                        success: false,
                        error: true,
                        message: "ok" })
    
                }

                if (Number(username_results[0].RowCount) == 0) {
                    console.log('not found');
                
                    res.status(200).json({ 
                        success: false,
                        error: false,
                        message: "invalid username" })
    
                } else {

                    db.query(
                        `SELECT user_id FROM Users WHERE username="${username}"`
                        , function (error, results, fields) {

                
    
                                var dbRes = JSON.parse(JSON.stringify(results))

    
                                    
                                        res.status(200).json({ 
                                            success: true,
                                            error: false,
                                            user_id: dbRes[0].user_id,
                                            message: "ok" })

                    });
                }

            });

 
}