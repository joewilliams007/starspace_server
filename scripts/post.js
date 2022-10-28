// Post

module.exports = (req, res) => {
    var { post_id } = req.params;

    var db = require('./db');

    db.query(
        `SELECT COUNT(*) AS RowCount FROM Posts WHERE post_id=${post_id}`
        , function (error, username_results, fields) {

            if (error) {

                res.status(200).json({ 
                    success: false,
                    error: true,
                    message: "ok" })

            } 

            if (Number(username_results[0].RowCount) == 0) {
                res.status(502).json({
                    success: false,
                    error: false,
                    message: "invalid"
                })
            } else {
                db.query(
                    `SELECT *
                    FROM Posts
                    WHERE post_id = ${post_id}`

                    , function (error, results, fields) {
                        if (error) console.log(error.message);
                    
                        var db_res = JSON.parse(JSON.stringify(results))

                        db.query(
                            `SELECT *
                            FROM Tags
                            WHERE post_id = ${post_id}`
        
                            , function (error, results, fields) {
                                if (error) console.log(error.message);
                            
                                var db_tags = JSON.parse(JSON.stringify(results))

                                var tags = ""

        
                                try {
                                    db_tags.forEach(element => {
                                        tags += element.tag+", "
                                        console.log(element.tag)
                                    });
                                } catch(err) {

                                }

                                if (tags.slice(-2) == ", ") {
                                    tags = tags.slice(0, -2); 
                                }
                                
                
                      
                            db.query(
                                `SELECT *
                                FROM Users
                                WHERE user_id = ${db_res[0].user_id}`
                                , function (error, results, fields) {
                                    if (error) console.log(error.message);
                                
                                    var db_res_user = JSON.parse(JSON.stringify(results))
                                                      
                                    res.status(200).json({
                                        success: true,
                                        error: false,
                                        message: "ok",
                                        post_id: db_res[0].post_id,
                                        votes: db_res[0].votes,
                                        profile_votes: db_res_user[0].votes,
                                        user_id: db_res[0].user_id,
                                        profile_image: db_res_user[0].image,
                                        profile_image_path: db_res_user[0].image_path,
                                        username: db_res_user[0].username,
                                        reports: db_res[0].reports,
                                        comments: db_res[0].comments,
                                        content: db_res[0].content,
                                        link: db_res[0].link,
                                        timestamp: db_res[0].timestamp,
                                        image: db_res[0].image,
                                        image_path: db_res[0].image_path,
                                        post_created: db_res[0].post_created,

                                        edited: db_res[0].edited,
                                        edited_timestamp: db_res[0].edited_timestamp,
                                        
                                        item1: db_res[0].item1,
                                        item2: db_res[0].item2,
                                        item1_votes: db_res[0].item1_votes,
                                        item2_votes: db_res[0].item2_votes,
                                        total_votes: db_res[0].total_votes,
                                        type: db_res[0].type,
                                        tags: tags,
                                    })
                                })
                    
                            })
            
                });
            }

        })

}