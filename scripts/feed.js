// Feed

module.exports = (req, res) => {
    var { type } = req.params;
    var { rows } = req.params;
    
    var db = require('./db');
    var {version_name, version_code} = require('./version');

    if (type == "latest") {
        db.query(
            `SELECT *
            FROM Posts
            ORDER BY timestamp DESC
            LIMIT 100`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    version_name: version_name,
                    version_code: version_code,
                    feed: results
            })
            });
    } else if (type == "top") {
        db.query(
            `SELECT *
            FROM Posts
            ORDER BY votes DESC
            LIMIT 100`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    version_name: version_name,
                    version_code: version_code,
                    feed: results
            })
        });
    }
}