// Notifs

module.exports = (req, res) => {
    var { type } = req.params;
    var { password } = req.params;
    var { user_id } = req.params;

    var db = require('./db');

    if (type == "all") {
        db.query(
            `
            SELECT Notif.type, Notif.notif_id, Notif.action_id, Notif.source_user_id, Notif.notif_created,Notif.timestamp, Notif.seen, Users.user_id, Users.username, Users.image, Users.image_path
            FROM Notif
            INNER JOIN Users ON Notif.source_user_id=Users.user_id
            WHERE Notif.user_id = ${user_id} AND Notif.source_user_id != ${user_id}
            ORDER BY Notif.timestamp DESC
            LIMIT 50;`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    notif: results
            })
            });
    } else if (type == "comments") {
        db.query(
            `
            SELECT Notif.type, Notif.notif_id, Notif.action_id, Notif.source_user_id, Notif.notif_created,Notif.timestamp, Notif.seen, Users.user_id, Users.username, Users.image, Users.image_path
            FROM Notif
            INNER JOIN Users ON Notif.source_user_id=Users.user_id
            WHERE Notif.user_id = ${user_id} AND Notif.type = "comment" AND Notif.source_user_id != ${user_id}
            ORDER BY Notif.timestamp DESC
            LIMIT 50;`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    notif: results
            })
            });
    } else if (type == "stars") { 
        db.query(
            `
            SELECT Notif.type, Notif.notif_id, Notif.action_id, Notif.source_user_id, Notif.notif_created,Notif.timestamp, Notif.seen, Users.user_id, Users.username, Users.image, Users.image_path
            FROM Notif
            INNER JOIN Users ON Notif.source_user_id=Users.user_id
            WHERE Notif.user_id = ${user_id} AND Notif.type = "like-comment" AND Notif.source_user_id != ${user_id} 
            OR Notif.type = "like-post" AND Notif.user_id = ${user_id} AND Notif.source_user_id != ${user_id}
            ORDER BY Notif.timestamp DESC
            LIMIT 50;`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    notif: results
            })
            });
    } else if (type == "mentions") {
        db.query(
            `
            SELECT Notif.type, Notif.notif_id, Notif.action_id, Notif.source_user_id, Notif.notif_created,Notif.timestamp, Notif.seen, Users.user_id, Users.username, Users.image, Users.image_path
            FROM Notif
            INNER JOIN Users ON Notif.source_user_id=Users.user_id
            WHERE Notif.user_id = ${user_id} AND Notif.type = "mention" AND Notif.source_user_id != ${user_id}
            ORDER BY Notif.timestamp DESC
            LIMIT 50;`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                res.status(200).json({
                    success: true,
                    error: false,
                    message: "ok",
                    notif: results
            })
            });
    } else if (type == "clear") {

        db.query(
            `
            UPDATE Notif SET seen = true WHERE user_id = ${user_id}`
            , function (error, results, fields) {
                if (error) console.log(error.message);

                db.query(
                    `
                    SELECT Notif.type, Notif.notif_id, Notif.action_id, Notif.source_user_id, Notif.notif_created,Notif.timestamp, Notif.seen, Users.user_id, Users.username, Users.image, Users.image_path
                    FROM Notif
                    INNER JOIN Users ON Notif.source_user_id=Users.user_id
                    WHERE Notif.user_id = ${user_id} AND Notif.source_user_id != ${user_id}
                    ORDER BY Notif.timestamp DESC;`
                    , function (error, results, fields) {
                        if (error) console.log(error.message);
        
                        res.status(200).json({
                            success: true,
                            error: false,
                            message: "ok",
                            notif: results
                    })
                    });
            });

    } else {

    }

    db.query(
        `
        UPDATE Notif
        SET app_opened = true WHERE user_id = ${user_id}`
        , function (error, results, fields) {
            if (error) console.log(error.message)
        });
}