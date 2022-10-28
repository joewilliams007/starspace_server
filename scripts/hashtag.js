// Hashtag

module.exports = (req, res) => {
    var { tag } = req.params;
    var { type } = req.params;

    var db = require('./db');

    if (type == "latest") {
        db.query(

            `
            SELECT Tags.post_id, Tags.tag, Posts.*
            FROM Tags
            INNER JOIN Posts ON Tags.post_id=Posts.post_id
            WHERE Tags.tag= "${tag}"
            ORDER BY Posts.timestamp DESC
            LIMIT 100;
            `

            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    feed: results
            })
            });
    } else if (type == "top") {
        db.query(
            
            `
            SELECT Tags.post_id, Tags.tag, Posts.*
            FROM Tags
            INNER JOIN Posts ON Tags.post_id=Posts.post_id
            WHERE Tags.tag= "${tag}"
            ORDER BY Posts.votes DESC
            LIMIT 100;
            `
            
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    feed: results
            })
        });
    }
}