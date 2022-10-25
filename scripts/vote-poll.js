// Vote

module.exports = (req, res) => {
    var { user_id } = req.params;
    var { password } = req.params;
    var { post_id } = req.params;
    var { item } = req.params;
    

    if (user_id == null|| user_id == undefined) {
        console.log("user id undefined")
        return;
    }

    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');
    var db = require('./db');
    var notif = require('./notif');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds
    
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    db.query(
        `SELECT COUNT(*) AS RowCount FROM Users WHERE user_id=${user_id}`
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
                    `SELECT password FROM Users WHERE user_id=${user_id}`
                    , function (error, passw_results, fields) {

                // Load hash from your password DB.
                bcrypt.compare(password, passw_results[0].password, function(err, result) {
                    // result == true
                    console.log(result)

            
                if (result) {

                            startVote();
                            
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

    // START OF POLL VOTING ----------------------------------------------------------------------------------
    function startVote() {

    db.query(
    `SELECT COUNT(*) AS RowCount FROM Vote_poll
    WHERE user_id = ${user_id} AND post_id = ${post_id}`

    , function (error, results, fields) {

        if (error) {

            console.log('db error '+error.message);
            res.status(200).json({ 
                success: false,
                error: true,
                message: "database error" })

        }

        if (Number(results[0].RowCount) == 0) {
        
            db.query(
                `INSERT INTO Vote_poll (post_id, item, user_id, timestamp, poll_created) 
                VALUES (${post_id},${item},${user_id},${timestamp},"${date}")`
                , function (error, results, fields) {
                    if (error) {
    
                        console.log('poll vote error '+error.message);
    
                    } else {
    
                        console.log('poll vote successfull');
                        db.query(
                            `UPDATE Posts SET item${item}_votes = item${item}_votes + 1
                            WHERE post_id = ${post_id}`
                        
                            , function (error, results, fields) {
                        
                                if (error) {
                        
                                    console.log('db error '+error.message);
                                    res.status(200).json({ 
                                        success: false,
                                        error: true,
                                        message: "database error" })
                        
                                }
            
                                db.query(
                                    `UPDATE Posts 
                                    SET total_votes = total_votes + 1
                                    WHERE post_id = ${post_id}`
                                
                                    , function (error, results, fields) {
                                
                                        if (error) {
                                
                                            console.log('db error '+error.message);
                                            res.status(200).json({ 
                                                success: false,
                                                error: true,
                                                message: "database error" })
                                
                                        }

                                        res.status(200).json({ 
                                            success: true,
                                            error: false,
                                            message: "ok" })
                    
                                
                                })

                         

                                    /* send notification
                                    if (dir_int == 1) {
                                        db.query(
                                            `SELECT post_id, user_id FROM Comments WHERE comment_id = ${comment_id}`
                                            , function (error, results, fields) {  
                                                if (error) console.log(error)
                                                console.log("request notif")
                                                // User id of post creator - Post id - User id of comment creator - type
                                                notif.notif(results[0].user_id,results[0].post_id,user_id,"like-comment"); // Notif new Like on a comment
                            
                                        });
                                    }
                                    // -----------------*/

                        
                        })

                        
                    }
    
             });

        } else {

            db.query(
                `SELECT *
                FROM Vote_poll
                WHERE user_id = ${user_id} AND post_id = ${post_id}`
                , function (error, results, fields) {
                    if (error) console.log(error.message);
                
                    var db_res = JSON.parse(JSON.stringify(results))
                    
                    db.query(
                        `UPDATE Posts 
                        SET item${db_res[0].item}_votes = item${db_res[0].item}_votes - 1,
                        item${item}_votes = item${item}_votes + 1
                        WHERE post_id = ${post_id}`
                    
                        , function (error, results, fields) {
                    
                            if (error) {
                    
                                console.log('db error '+error.message);
                                res.status(200).json({ 
                                    success: false,
                                    error: true,
                                    message: "database error" })
                    
                            }
        
        
                    
                    })
                   
                    db.query(
                        `UPDATE Vote_poll SET item = ${item}
                        WHERE post_id = ${post_id} AND user_id = ${user_id}`
                    
                        , function (error, results, fields) {
                    
                            if (error) {
                    
                                console.log('db error '+error.message);
                                res.status(200).json({ 
                                    success: false,
                                    error: true,
                                    message: "database error" })
                    
                            }
                            res.status(200).json({ 
                                success: true,
                                error: false,
                                message: "ok" })
                    
                    })
                        
                       
                        
                })
    
        
        }
                              
    })

}
}