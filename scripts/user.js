// Users / stars in post etc

module.exports = (req, res) => {
    var { type } = req.params;
    var { action_id } = req.params;

    var db = require('./db');

    if (type == "stars-post") {
        db.query(
            `
            SELECT Vote.user_id, Vote.timestamp,Users.user_id, Users.username, Users.votes, Users.image, Users.image_path
            FROM Vote
            INNER JOIN Users ON Vote.user_id=Users.user_id
            WHERE Vote.post_id = ${action_id} AND Vote.vote = 1
            ORDER BY Vote.timestamp DESC;`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    user: results
            })
        });

    } else if (type == "1-poll") {
        db.query(
            `
            SELECT Vote_poll.user_id, Vote_poll.timestamp,Users.user_id, Users.username, Users.votes, Users.image, Users.image_path
            FROM Vote_poll
            INNER JOIN Users ON Vote_poll.user_id=Users.user_id
            WHERE Vote_poll.post_id = ${action_id} AND Vote_poll.item = 1
            ORDER BY Vote_poll.timestamp DESC;`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    user: results
            })
        });

    } else if (type == "2-poll") {
        db.query(
            `
            SELECT Vote_poll.user_id, Vote_poll.timestamp,Users.user_id, Users.username, Users.votes, Users.image, Users.image_path
            FROM Vote_poll
            INNER JOIN Users ON Vote_poll.user_id=Users.user_id
            WHERE Vote_poll.post_id = ${action_id} AND Vote_poll.item = 2
            ORDER BY Vote_poll.timestamp DESC;`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    user: results
            })
        });
    }
}