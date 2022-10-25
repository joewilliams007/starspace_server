// Profile

module.exports = (req, res) => {
    var { user_id } = req.params;

    var db = require('./db');
    var {version_name, version_code} = require('./version');

    db.query(
        `SELECT *
        FROM Posts
        WHERE user_id = ${user_id}
        ORDER BY timestamp DESC`
        , function (error, results, fields) {
            if (error) console.log(error.message);

            res.status(200).json({
                success: true,
                error: false,
                message: "ok",
                version_name: version_name,
                version_code: version_code,
                post: results
        })
        });

}