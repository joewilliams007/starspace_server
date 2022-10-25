// Notifs View

module.exports = (req, res) => {
    var { type } = req.params;
    var { password } = req.params;
    var { notif_id } = req.params;

    var db = require('./db');

    db.query(
        `UPDATE Notif SET seen = true WHERE notif_id = ${notif_id}`
        , function (error, results, fields) {
            if (error) console.log(error.message);

            res.status(200).json({
                success: true,
                error: false,
                message: "ok",
        })
    });
  
}