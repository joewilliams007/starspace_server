// Post

module.exports = (req, res) => {
    var { user_id } = req.params;

    var db = require('./db');
                            
        
    db.query(
        `SELECT *
        FROM Users
        WHERE user_id = ${user_id}`
        , function (error, results, fields) {
            if (error) console.log(error.message);
        
            var db_res = JSON.parse(JSON.stringify(results))
                                
            res.status(200).json({
                success: true,
                error: false,
                message: "ok",
                user_id: user_id,
                username: db_res[0].username,
                votes: db_res[0].votes,
                bio: db_res[0].bio,
                link: db_res[0].link,
                follows: db_res[0].follows,
                followers: db_res[0].followers,
                timestamp: db_res[0].timestamp,
                image: db_res[0].image,
                image_path: db_res[0].image_path,
                account_created: db_res[0].account_created
        })

        })

}