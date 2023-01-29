// Feed

module.exports = (req, res) => {
    var { comment_id } = req.params;
    var { post_id } = req.params;

    var db = require('./db');

    session_id = req.params;

    var session = require('./session.js');

    // Authenticate session and ip
    session.verify(session_id, res, function (user_id) {
        deleteComment(user_id);
    })

    function deleteComment(user_id) {
        db.query(
            `DELETE
            FROM Comments
            WHERE user_id=${user_id}
            AND comment_id = ${comment_id}`
            , function (error, results, fields) {
                if (error) {
                    console.log(error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: error.message
                    })
                } else {

                    db.query(
                        `UPDATE Posts set comments = comments - 1 WHERE post_id = ${post_id}`
                        , function (error, results, fields) {

                            res.status(200).json({
                                success: true,
                                error: false,
                                message: "ok"
                            })
                        });


                }
            });
    }
}