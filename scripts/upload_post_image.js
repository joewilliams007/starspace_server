// Upload Image Post

module.exports = (req, res) => {

    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');
    var db = require('./db');
    var notif = require('./notif');
    var authenticate = require('./authenticate');
    var update_db = require('./update_db');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds
    var save_tags = require('./save_tags');
    
    const sharp = require('sharp');
    var fs = require('fs');
    const bcrypt = require('bcrypt');

    user_id = req.body.user_id
    password = req.body.password
    content = req.body.content
    tags = req.body.tags

    console.log("tags: "+tags)
   
    // Authenticate user id and password
    authenticate.identify(user_id, password, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            savePostImage();
        }
    })

    function savePostImage(){

        sharp("./uploads/" + req.files[0].filename)
        .jpeg({ progressive: true, force: false, quality: 10 })
        .png({ progressive: true, force: false, quality: 10 })
        .resize(1000)
        .webp({ quality: 10 })
        .toFile("./uploads/" + req.files[0].filename + ".webp", (err, info) => {

            fs.unlinkSync("./uploads/" + req.files[0].filename)
            var newPath = between(0, 100) + "-" + user_id + "-" + req.files[0].originalname
            fs.rename("./uploads/" + req.files[0].filename + ".webp", "./uploads/" + newPath, function (err) {
                if (err) console.log('ERROR: ' + err);

                db.query(
                    `INSERT INTO Posts (user_id, content, link, timestamp, image, image_path, post_created) 
                VALUES (${user_id},"${content}","-",${timestamp},true, "${newPath}","${date}")`
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
        
                            db.query(
                                `SELECT post_id FROM Posts
                                WHERE user_id = ${user_id}
                                AND content = "${content}"
                                ORDER BY timestamp DESC
                                LIMIT 1`
                                , function (error, results, fields) {
        
                                    save_tags.save(tags, results[0].post_id) // Save tags
        
                                });
                            
                        }
        
                })

            });


        })

    
    }

    function between(min, max) {
        return Math.floor(
            Math.random() * (max - min) + min
        )
    }
}