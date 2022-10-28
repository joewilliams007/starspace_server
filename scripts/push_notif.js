// Push Notifs

module.exports = (req, res) => {
    var { user_id } = req.params;



    var db = require('./db');


    db.query(
        `SELECT COUNT(*) AS RowCount FROM Notif WHERE user_id = ${user_id} AND app_opened = false AND source_user_id != ${user_id}`
        , function (error, username_results, fields) {

            if (error) {

                res.status(200).json({ 
                    success: false,
                    error: true,
                    message: "ok" })

            }

            var d = new Date();
            var n = d.toLocaleTimeString();
        
            console.log(n+" push notif for user id "+user_id+" pushing "+username_results[0].RowCount+" push notifs")

            if (Number(username_results[0].RowCount) == 0) {
                console.log('not new push notifs for him');
            
                res.status(200).json({ 
                    success: false,
                    error: false,
                    message: "no new pushes" })

            } else {
                console.log('sending the push notifs');

                db.query(
                    `
                    SELECT * FROM Notif WHERE user_id = ${user_id} AND app_opened = false AND source_user_id != ${user_id}
                    ORDER by timestamp desc`
                    , function (error, results, fields) {
                        if (error) console.log(error.message);
            
                        var dbRes = JSON.parse(JSON.stringify(results))

                        var text;
                        var amount = "";
                        if (dbRes[0].type == "like-post") {
                            text = "Somebody stared your post!"
                        } else if (dbRes[0].type == "like-comment") {
                            text = "Somebody stared your comment!"
                        } else if (dbRes[0].type == "mention") {
                            text = "Somebody mentioned you on a comment!"
                        } else if (dbRes[0].type == "comment") {
                            text = "Somebody commented on your post!"
                        } else {
                       
                        }

                        if (Number(username_results[0].RowCount)>1) {
                            amount = " in total you got " + username_results[0].RowCount + " new notifs"
                        } 

                        res.status(200).json({
                            success: true,
                            error: false,
                            message: text+amount
                    })
                });
            
                db.query(
                    `
                    UPDATE Notif
                    SET app_opened = true WHERE user_id = ${user_id}`
                    , function (error, results, fields) {
                        if (error) console.log(error.message)
                });
            }

    });

}