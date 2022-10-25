module.exports = {
    notif: function (user_id, action_id, source_user_id, type) {

        var moment = require('moment');
        var date = moment().format('YYYY-MM-DD');
        var db = require('./db');
     // var notif = require('./notif');
       var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

        console.log("proccess notif")

        db.query(
            `INSERT INTO Notif (user_id, action_id, source_user_id, type, timestamp, notif_created) 
            VALUES (${user_id},${action_id},${source_user_id},"${type}",${timestamp},"${date}")`
            , function (error, results, fields) {
                if (error) {
        
                    console.log('notif error '+error.message);
        
                } else {
        
                    console.log('notif successfull');
        
                }
        
        });

    },

    delete: function (user_id, action_id, source_user_id, type) {

        var moment = require('moment');
        var date = moment().format('YYYY-MM-DD');
        var db = require('./db');
     // var notif = require('./notif');
     var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

        console.log("proccess notif")

        db.query(
            `INSERT INTO Notif (user_id, action_id, source_user_id, type, timestamp, notif_created) 
            VALUES (${user_id},${action_id},${source_user_id},"${type}",${timestamp},"${date}")`
            , function (error, results, fields) {
                if (error) {
        
                    console.log('notif error '+error.message);
        
                } else {
        
                    console.log('notif successfull');
        
                }
        
        });

        db.query(
            `DELETE FROM Notif WHERE action_id = ${action_id} AND source_user_id = ${source_user_id} AND user_id = ${user_id} AND type = "${type}"`
            , function (error, results, fields) {  
                if (error) console.log(error)
                console.log("delete notif")
        
        });

    },
};

