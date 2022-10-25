// update databases

module.exports = {
    query: function (query, res) {

        var moment = require('moment');
        var date = moment().format('YYYY-MM-DD');
        var db = require('./db');
        var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

        db.query(
            query
            , function (error, results, fields) {

                if (error) {

                    console.log('database error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: "error"
                    })
        
                } else {
                    res.status(200).json({
                        success: true,
                        error: false,
                        message: "success"
                    })
                }

        })
    }
};

