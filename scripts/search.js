// Search

module.exports = (req, res) => {
    var { type } = req.params;
    var { search } = req.params;

    var db = require('./db');

    if (type == "top_tags") {
        db.query(
            `SELECT *
            FROM Unique_tags
            WHERE usages > 0
            ORDER BY usages DESC
            LIMIT 100`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    search: results
            })
            });

            console.log("search")

    } else if (type == "tags") {
        db.query(
            `SELECT *
            FROM Unique_tags
            WHERE usages > 0
            AND LOWER(tag) LIKE LOWER("%${search}%")
            LIMIT 100`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    search: results
            })
            });

            console.log("search "+search)
    } 
}