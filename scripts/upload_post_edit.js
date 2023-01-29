// Edit Post

module.exports = (req, res) => {
    var db = require('./db');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds
    content = req.body.content
    post_id = req.body.post_id
    session = req.body.session


   
    var session = require('./session.js');

    // Authenticate session and ip
    session.verify(session, req, res, function(user_id){
        saveEditPost(user_id);
    })

    function saveEditPost(user_id){

        db.query(
            `UPDATE Posts set content = "${content}", edited = true, edited_timestamp = ${timestamp} WHERE post_id = ${post_id} AND user_id = ${user_id}`
            , function (error, results, fields) {

                if (error) {
                    console.log("error\n\n" + error.message);

                    res.status(200).json({
                        success: false,
                        error: true,
                        message: "error getting user id"
                    })
                } else {
                    res.status(200).json({
                        success: false,
                        error: false,
                        message: "ok"
                    })
                }

        });
    }
}