// Comment

module.exports = (req, res) => {
    var { username } = req.params;
    var { password } = req.params;
    var { post_id } = req.params;
    var { comment } = req.params;
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');
    var db = require('./db');
    var notif = require('./notif');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

    db.query(
        `SELECT COUNT(*) AS RowCount FROM Users WHERE username="${username}"`
        , function (error, username_results, fields) {

            if (error) {

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
                    `SELECT password FROM Users WHERE username="${username}"`
                    , function (error, passw_results, fields) {

                // Load hash from your password DB.
                bcrypt.compare(password, passw_results[0].password, function(err, result) {
                    // result == true
                    console.log(result)

            
                if (result) {

                  finduserid();
                            
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


    function finduserid() {
        db.query( 

            `SELECT user_id FROM Users
            WHERE username="${username}"`
            , function (error, results, fields) {
                if (error) {
                    console.log("error\n\n" + error.message);

                    res.status(200).json({ 
                        success: false,
                        error: true,
                        message: "error getting user id" })
                }

                var dbRes = JSON.parse(JSON.stringify(results))
               
                storepost(dbRes[0].user_id, "-");
            
        });

    }

    function storepost(user_id, newPath) {
        var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

        filename = "-"
      
        db.query(
        `INSERT INTO Comments (user_id, post_id, comment, link, timestamp, image, image_path, comment_created) 
        VALUES (${user_id},${post_id},"${comment}","-",${timestamp},false, "${filename}","${date}")`
        , function (error, results, fields) {
            if (error) {

                console.log('post error '+error.message);
                res.status(200).json({ 
                    success: false,
                    error: true,
                    message: "error storing to database" })

            } else {

                console.log('post successfull');


                db.query(
                `UPDATE Posts set comments = comments + 1 WHERE post_id = ${post_id}`
                , function (error, results, fields) {  

                    console.log("start notif")
                    
                    db.query(
                        `SELECT user_id FROM Posts WHERE post_id = ${post_id}`
                        , function (error, results, fields) {  
                            if (error) console.log(error)
                            console.log("request notif")
                            // User id of post creator - Post id - User id of comment creator - type
                            notif.notif(results[0].user_id,post_id,user_id,"comment"); // Notif new Comments on post (for creator of post)
        
                    });

                });

            

                

                res.status(200).json({ 
                    success: true,
                    error: false,
                    message: "post success" })
            }

        });
    }
}