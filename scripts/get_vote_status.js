// Vote

module.exports = (req, res) => {
    var { user_id } = req.params;
    var { post_id } = req.params;

    var db = require('./db');

    db.query(
    `SELECT COUNT(*) AS RowCount FROM Vote
    WHERE user_id = ${user_id} && post_id = ${post_id}`

    , function (error, results, fields) {

        if (error) {

            console.log('db error '+error.message);
            res.status(200).json({ 
                success: false,
                error: true,
                message: "database error" })

        }

        if (Number(results[0].RowCount) == 0) {
        
            res.status(200).json({ 
                success: true,
                error: false,
                message: "0" })

        } else {
            db.query(
                `SELECT *
                FROM Vote
                WHERE user_id = ${user_id} && post_id = ${post_id}`
        
                , function (error, results, fields) {
                    if (error) console.log(error.message);
                
                    var db_res = JSON.parse(JSON.stringify(results))
                                        
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: `${db_res[0].vote}`
                })
            })
        }
                              
    })

}