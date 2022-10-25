// Save tags of posts

module.exports = {
    save: function (tags, post_id) {

        var moment = require('moment');
        var date = moment().format('YYYY-MM-DD');
        var db = require('./db');
        var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

        var separated_tags;

        if (tags.includes(",")) {
            separated_tags = tags.split(",")
        } else {
            separated_tags = [ tags ]
        }

        separated_tags.forEach(tag => {

            if (tag.slice(-1) == " ") {
                tag = tag.slice(0, -1); 
            }

            if (tag.charAt(0) == " ") {
                tag = tag.slice(1); 
            }

            console.log(tag);

            db.query(
                `SELECT COUNT(*) AS RowCount FROM Unique_tags WHERE tag="${tag}"`
                , function (error, results, fields) {
    
                    if (error) {
    
                        console.log('database error ' + error.message);
     
                    }

                    if (tag.length>20) {
                        return;
                    }
    
                    if (Number(results[0].RowCount) == 0) {
    
                        db.query(
                            `INSERT INTO Unique_tags (tag, usages) 
                            VALUES ("${tag}", 1)`
                            , function (error, results, fields) {
                
                                if (error) {
                
                                    console.log('database error ' + error.message);
                        
                                } 
                
                        })

                    } else {

                        db.query(
                            `UPDATE Unique_tags
                            SET usages = usages + 1
                            WHERE tag="${tag}"`

                            , function (error, results, fields) {
                
                                if (error) {
                
                                    console.log('database error ' + error.message);
                        
                                } 
                
                        })

                    }
            }) 

            db.query(
                `INSERT INTO Tags (post_id, tag) 
                VALUES (${post_id},"${tag}")`
                , function (error, results, fields) {
    
                    if (error) {
    
                        console.log('database error ' + error.message);
            
                    } 
    
            })
        });

        
    }
};

