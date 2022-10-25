// Registration

module.exports = (req, res) => {

    var db = require('./db');
    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    var { identification } = req.params;
    var { password } = req.params;

    console.log(identification)
    console.log(password)
   
 
            
        db.query(
            `SELECT COUNT(*) AS RowCount FROM Users WHERE username="${identification}"`
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
                        message: "wrong username" })
    
                } else {

                    db.query(
                        `SELECT password FROM Users WHERE username="${identification}"`
                        , function (error, passw_results, fields) {

                    // Load hash from your password DB.
                    bcrypt.compare(password, passw_results[0].password, function(err, result) {
                        // result == true
                        console.log(result)
                     
                
                    if (result) {
                        db.query( 

                            `SELECT * FROM Users
                            WHERE username="${identification}"`
                            , function (error, results, fields) {
                                if (error) console.log("error\n\n" + error.message);
    
                                var dbRes = JSON.parse(JSON.stringify(results))
    
                                console.log(dbRes[0].email)
                                
                                    
                                        res.status(200).json({ 
                                            success: true,
                                            error: false,
                                            username: identification,
                                            user_id: dbRes[0].user_id,
                                            password: password,
                                            email: dbRes[0].email,
                                            message: "-" })
                                        
                              
                            
                        });
                    } else {
                        res.status(200).json({ 
                            success: false,
            
                            error: false,
                            message: "wrong password" })
                    }
                   
               
                     });

                    });
                }

            });

 
}