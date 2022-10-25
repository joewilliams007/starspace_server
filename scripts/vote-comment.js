// Vote

module.exports = (req, res) => {
    var { user_id } = req.params;
    var { password } = req.params;
    var { comment_id } = req.params;
    var { direction } = req.params;
    
    var dir_int;
    if (direction == "up") {
        dir_int = 1
    } else {
        dir_int = -1
    }

    if (user_id == null|| user_id == undefined) {
        console.log("user id undefined")
        return;
    }

    var moment = require('moment');
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

    function startVote() {

    db.query(
    `SELECT COUNT(*) AS RowCount FROM Vote_comment
    WHERE user_id = ${user_id} AND comment_id = ${comment_id}`

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
                `INSERT INTO Vote_comment (comment_id, vote, user_id, timestamp, vote_created) 
                VALUES (${comment_id},${dir_int},${user_id},${timestamp},"${date}")`
                , function (error, results, fields) {
                    if (error) {
    
                        console.log('like error '+error.message);
    
                    } else {
    
                        console.log('like successfull');
                        db.query(
                            `UPDATE Comments SET votes = votes + ${dir_int}
                            WHERE comment_id = ${comment_id}`
                        
                            , function (error, results, fields) {
                        
                                if (error) {
                        
                                    console.log('db error '+error.message);
                                    res.status(200).json({ 
                                        success: false,
                                        error: true,
                                        message: "database error" })
                        
                                }
            
                                db.query(
                                    `SELECT votes, user_id FROM Comments
                                    WHERE comment_id = ${comment_id}`
                                
                                , function (error, results, fields) {
                            
                                    if (error) {}

                                    db.query(
                                        `UPDATE Users SET votes = votes + ${dir_int}
                                        WHERE user_id = ${results[0].user_id}`
                                    
                                        , function (error, up, fields) {

                                            res.status(200).json({ 
                                                success: true,
                                                error: false,
                                                message: `${results[0].votes}` })
                                    })

                                    // send notification
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
                                    // -----------------

                                
                                })
                        })

                        
                    }
    
             });

        } else {

            db.query(
                `SELECT *
                FROM Vote_comment
                WHERE user_id = ${user_id} AND comment_id = ${comment_id}`
        
                , function (error, results, fields) {
                    if (error) console.log(error.message);
                
                    var db_res = JSON.parse(JSON.stringify(results))
                                        
                    if (db_res[0].vote == 1 || db_res[0].vote == -1) {
                        db.query(
                            `DELETE FROM Vote_comment WHERE user_id = ${user_id} && comment_id = ${comment_id}`
                            , function (error, results, fields) {
                                if (error) {
                
                                    console.log('delete error '+error.message);
                
                                } else {
                
                                    console.log('delete successfull');
                                    
                                    db.query(
                                        `UPDATE Comments SET votes = votes + ${db_res[0].vote * -1}
                                        WHERE comment_id= ${comment_id}`
                                    
                                        , function (error, results, fields) {
                                    
                                            if (error) {
                                    
                                                console.log('db error '+error.message);
                                                res.status(200).json({ 
                                                    success: false,
                                                    error: true,
                                                    message: "database error" })
                                    
                                            }
                        
                                            db.query(
                                                `SELECT votes, user_id FROM Comments
                                                WHERE comment_id = ${comment_id}`
                                            
                                            , function (error, results, fields) {
                                        
                                                if (error) {}

                                                db.query(
                                                    `UPDATE Users SET votes = votes + ${db_res[0].vote * -1}
                                                    WHERE user_id = ${results[0].user_id}`
                                                
                                                    , function (error, up, fields) {
            
                                                        if (error) {
                                                            console.log (error)
                                                        }
                                                        res.status(200).json({ 
                                                            success: true,
                                                            error: false,
                                                            message: `${results[0].votes}` })
                                                })
                                            })
                                    })
                        
                                }
                
                         });
                    } else {
                        db.query(
                            `DELETE FROM Vote_comment WHERE user_id = ${user_id} AND comment_id = ${comment_id}`
                            , function (error, results, fields) {
                                if (error) {
                
                                    console.log('delete error '+error.message);
                
                                } else {
                
                                    db.query(
                                        `INSERT INTO Vote_comment (comment_id, vote, user_id, timestamp, vote_created) 
                                        VALUES (${comment_id},-1,${user_id},${timestamp},"${date}")`
                                        , function (error, results, fields) {
                                            if (error) {
                            
                                                console.log('like error '+error.message);
                            
                                            } else {
                            
                                                db.query(
                                                    `UPDATE Comments SET votes = votes + ${db_res[0].vote * -1}
                                                    WHERE comment_id = ${comment_id}`
                                                
                                                    , function (error, results, fields) {
                                                
                                                        if (error) {
                                                
                                                            console.log('db error '+error.message);
                                                            res.status(200).json({ 
                                                                success: false,
                                                                error: true,
                                                                message: "database error" })
                                                
                                                        }
                                    
                                                        db.query(
                                                            `SELECT votes, user_id FROM Posts
                                                            WHERE comment_id = ${comment_id}`
                                                        
                                                        , function (error, results, fields) {
                                                    
                                                            if (error) {}

                                                            db.query(
                                                                `UPDATE Users SET votes = votes + ${dir_int}
                                                                WHERE user_id = ${results[0].user_id}`
                                                            
                                                                , function (error, up, fields) {
                        
                                                                    res.status(200).json({ 
                                                                        success: true,
                                                                        error: false,
                                                                        message: `${results[0].votes}` })
                                                            })
                                                        })
                                                })
                                    
                                    
                                            }
                            
                                     });
                                        
                               
                                }
                
                         });

                    
                    }

                
            })

        
        }
                              
    })

}
}