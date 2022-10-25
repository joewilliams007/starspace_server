// Get Comments

module.exports = (req, res) => {
    var { post_id } = req.params;

    var db = require('./db');


    db.query(
        `SELECT *
        FROM Comments WHERE post_id = ${post_id}
        ORDER BY timestamp ASC`
        , function (error, results, fields) {
            if (error) console.log(error.message);

            res.status(200).json({
                success: true,
                error: false,
                message: "ok",
                comments: results
        })
    });


    /* Add in future!!!
    
    db.query(
        `SELECT 
            Posts.post_id,
            Posts.user_id,
            Vote.vote
        FROM Posts, Vote
        WHERE Posts.post_id = Vote.post_id AND Vote.user_id=1
        ORDER BY Posts.timestamp DESC
        LIMIT 100`
        , function (error, results, fields) {
            if (error) console.log(error.message);

            res.status(200).json({
                feed: results
        })
    }); */
}