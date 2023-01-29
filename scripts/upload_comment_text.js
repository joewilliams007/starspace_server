// Upload Text Post

module.exports = (req, res) => {

    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');
    var db = require('./db');
    var notif = require('./notif');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

    session_id = req.body.session_id
    content = req.body.content
    post_id = req.body.post_id

   
    var session = require('./session.js');

    // Authenticate session and ip
    session.verify(session_id, res, function(user_id){
        saveCommentText(user_id);
    })
 
    function saveCommentText(user_id){

        db.query(
            `INSERT INTO Comments (user_id, post_id, comment, link, timestamp, image, image_path, comment_created) 
    VALUES (${user_id},${post_id},"${content}","-",${timestamp},false, "-","${date}")`
            , function (error, results, fields) {
                if (error) {

                    console.log('post error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: "error storing to database"
                    })

                } else {

                    console.log('post successfull');


                    db.query(
                        `UPDATE Posts set comments = comments + 1 WHERE post_id = ${post_id}`
                        , function (error, results, fields) {
                        });

                        db.query(
                            `SELECT user_id FROM Posts WHERE post_id = ${post_id}`
                            , function (error, results, fields) {  
                                if (error) console.log(error)
                                console.log("request notif")
                                // User id of post creator - Post id - User id of comment creator - type
                                notif.notif(results[0].user_id,post_id,user_id,"comment"); // Notif new Comments on post (for creator of post)
            
                        });

                        if ((content.split(" ")[0]).split("")[0] == "@") {

                            console.log("mention "+content.split(" ")[0])

                            db.query(
                                `SELECT user_id FROM Users WHERE username = "${content.split(" ")[0].slice(1)}"`
                                , function (error, results, fields) {  
                                    if (error) console.log(error)
                                    console.log("request notif")
                                    // User id of post creator - Post id - User id of comment creator - type
                                    notif.notif(results[0].user_id,req.body.tags,user_id,"mention"); // Notif new Comments on post (for creator of post)
                
                            });

                        }

                    res.status(200).json({
                        success: true,
                        error: false,
                        message: "post success"
                    })
                }

            });
    }
}