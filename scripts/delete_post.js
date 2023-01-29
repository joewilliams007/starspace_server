// Feed

module.exports = (req, res) => {
    var { post_id } = req.params;

    var db = require('./db');
    session_id = req.params;

    var session = require('./session.js');

    // Authenticate session and ip
    session.verify(session_id, req, res, function (user_id) {
        deletePost(user_id);
    })

    function deletePost(user_id) {
        db.query(
            `DELETE
            FROM Posts
            WHERE user_id=${user_id}
            AND post_id = ${post_id}`
            , function (error, results, fields) {
                if (error) {
                    console.log(error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: error.message
                    })
                } else {
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: "ok"
                    })


                    db.query(
                        `DELETE
                            FROM Comments
                            WHERE post_id = ${post_id}`
                        , function (error, results, fields) {

                            db.query(
                                `DELETE
                                    FROM Notif
                                    WHERE action_id = ${post_id} AND type = "like-comment" OR action_id = ${post_id} AND type = "like-post" OR action_id = ${post_id} AND type = "comment" OR action_id = ${post_id} AND type = "mention"`
                                , function (error, results, fields) {
                                    db.query(
                                        `SELECT tag FROM Tags
                                    WHERE post_id = ${post_id}`
                                        , function (error, results, fields) {


                                            var res = JSON.parse(JSON.stringify(results))

                                            res.forEach(tag => {

                                                db.query(
                                                    `UPDATE Unique_tags
                                                SET usages = usages - 1
                                                WHERE tag="${tag}"`

                                                    , function (error, results, fields) {

                                                        if (error) {

                                                            console.log('database error ' + error.message);

                                                        }

                                                    })
                                            })

                                            db.query(
                                                `DELETE FROM Tags
                                            WHERE post_id=${post_id}`

                                                , function (error, results, fields) {

                                                    if (error) {

                                                        console.log('database error ' + error.message);

                                                    }

                                                })

                                        });



                                });

                        });
                }
            });
    }
}