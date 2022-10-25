// Uploading

module.exports = (req, res) => {

    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');
    var db = require('./db');
    var notif = require('./notif');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

    const sharp = require('sharp');
    var fs = require('fs');
    const bcrypt = require('bcrypt');
    const saltRounds = 10;

    var { username, password, post, tags } = req.params;
    
    type = "post"

    var isImage = false;

    if (username == undefined) {

        if (req.body.type == "text-based"||req.body.type == "poll-based") {

        } else {
            isImage = true;
        }

        username = req.body.username
        password = req.body.password
        post = req.body.description
        tags = req.body.tags
        type = req.body.type


        console.log(req.body);
    }

    if (type == "text-comment" || type == "edit-post" || type == "set-bio") {
        db.query(
            `SELECT COUNT(*) AS RowCount FROM Users WHERE username="${username}"`
            , function (error, username_results, fields) {

                if (error) {

                    res.status(200).json({
                        success: false,
                        error: true,
                        message: "ok"
                    })

                }

                if (Number(username_results[0].RowCount) == 0) {
                    console.log('not found');

                    res.status(200).json({
                        success: false,
                        error: false,
                        message: "wrong username"
                    })

                } else {

                    db.query(
                        `SELECT password FROM Users WHERE username="${username}"`
                        , function (error, passw_results, fields) {

                            // Load hash from your password DB.
                            bcrypt.compare(password, passw_results[0].password, function (err, result) {
                                // result == true
                                console.log(result)


                                if (result) {

                                    finduseridComment();

                                } else {
                                    res.status(200).json({
                                        success: false,

                                        error: false,
                                        message: "wrong password"
                                    })
                                }


                            });

                        });
                }

            });


        function finduseridComment() {
            db.query(

                `SELECT user_id FROM Users
            WHERE username="${username}"`
                , function (error, results, fields) {
                    if (error) {
                        console.log("error\n\n" + error.message);

                        res.status(200).json({
                            success: false,
                            error: true,
                            message: "error getting user id"
                        })
                    }

                    var dbRes = JSON.parse(JSON.stringify(results))

                    if (type == "text-comment") {

                        storepostComment(dbRes[0].user_id, "-");

                    } else if (type == "set-bio") {

                        db.query(
                            `UPDATE Users set bio = "${req.body.description}" WHERE user_id = ${dbRes[0].user_id}`
                            , function (error, results, fields) {

                                if (error) {
                                    console.log("error\n\n" + error.message);
            
                                    res.status(200).json({
                                        success: false,
                                        error: true,
                                        message: "error getting user id"
                                    })
                                } else {
                                    res.status(200).json({
                                        success: false,
                                        error: false,
                                        message: "ok"
                                    })
                                }

                        });

                    } else if (type == "edit-post"){
          
                        db.query(
                            `UPDATE Posts set content = "${req.body.description}", edited = true, edited_timestamp = ${timestamp} WHERE post_id = ${req.body.tags} AND user_id = ${dbRes[0].user_id}`
                            , function (error, results, fields) {

                                if (error) {
                                    console.log("error\n\n" + error.message);
            
                                    res.status(200).json({
                                        success: false,
                                        error: true,
                                        message: "error getting user id"
                                    })
                                } else {
                                    res.status(200).json({
                                        success: false,
                                        error: false,
                                        message: "ok"
                                    })
                                }

                        });

                    }

                });

        }

        function storepostComment(user_id, newPath) {
            var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds


            db.query(
                `INSERT INTO Comments (user_id, post_id, comment, link, timestamp, image, image_path, comment_created) 
        VALUES (${user_id},${req.body.tags},"${req.body.description}","-",${timestamp},false, "-","${date}")`
                , function (error, results, fields) {
                    if (error) {

                        console.log('post error ' + error.message);
                        res.status(200).json({
                            success: false,
                            error: true,
                            message: "error storing to database"
                        })

                    } else {

                        console.log('post successfull');


                        db.query(
                            `UPDATE Posts set comments = comments + 1 WHERE post_id = ${req.body.tags}`
                            , function (error, results, fields) {
                            });

                            db.query(
                                `SELECT user_id FROM Posts WHERE post_id = ${req.body.tags}`
                                , function (error, results, fields) {  
                                    if (error) console.log(error)
                                    console.log("request notif")
                                    // User id of post creator - Post id - User id of comment creator - type
                                    notif.notif(results[0].user_id,req.body.tags,user_id,"comment"); // Notif new Comments on post (for creator of post)
                
                            });

                            if ((req.body.description.split(" ")[0]).split("")[0] == "@") {

                                console.log("mention "+req.body.description.split(" ")[0])

                                db.query(
                                    `SELECT user_id FROM Users WHERE username = "${req.body.description.split(" ")[0].slice(1)}"`
                                    , function (error, results, fields) {  
                                        if (error) console.log(error)
                                        console.log("request notif")
                                        // User id of post creator - Post id - User id of comment creator - type
                                        notif.notif(results[0].user_id,req.body.tags,user_id,"mention"); // Notif new Comments on post (for creator of post)
                    
                                });

                            }

                        res.status(200).json({
                            success: true,
                            error: false,
                            message: "post success"
                        })
                    }

                });
        }



        console.log(username + " " + password)
        console.log(post)
        console.log(tags)

    } else if (type != "profile_picture" || isImage == false || type == "post") {

        db.query(
            `SELECT COUNT(*) AS RowCount FROM Users WHERE username="${username}"`
            , function (error, username_results, fields) {

                if (error) {

                    console.log('login error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: "ok"
                    })

                }

                if (Number(username_results[0].RowCount) == 0) {
                    console.log('not found');

                    res.status(200).json({
                        success: false,
                        error: false,
                        message: "wrong username"
                    })

                } else {

                    db.query(
                        `SELECT password FROM Users WHERE username="${username}"`
                        , function (error, passw_results, fields) {

                            // Load hash from your password DB.
                            bcrypt.compare(password, passw_results[0].password, function (err, result) {
                                // result == true
                                console.log(result)


                                if (result) {

                                    finduserid();

                                } else {
                                    res.status(200).json({
                                        success: false,

                                        error: false,
                                        message: "wrong password"
                                    })
                                }


                            });

                        });
                }

            });

        function finduserid() {
            db.query(

                `SELECT user_id FROM Users
            WHERE username="${username}"`
                , function (error, results, fields) {
                    if (error) {
                        console.log("error\n\n" + error.message);

                        res.status(200).json({
                            success: false,
                            error: true,
                            message: "error getting user id"
                        })
                    }

                    var dbRes = JSON.parse(JSON.stringify(results))


                    if (isImage) {



                        sharp("./uploads/" + req.files[0].filename)
                            .jpeg({ progressive: true, force: false, quality: 10 })
                            .png({ progressive: true, force: false, quality: 10 })
                            .resize(1000)
                            .webp({ quality: 10 })
                            .toFile("./uploads/" + req.files[0].filename + ".webp", (err, info) => {

                                fs.unlinkSync("./uploads/" + req.files[0].filename)
                                var newPath = between(0, 100) + "-" + dbRes[0].user_id + "-" + req.files[0].originalname
                                fs.rename("./uploads/" + req.files[0].filename + ".webp", "./uploads/" + newPath, function (err) {
                                    if (err) console.log('ERROR: ' + err);

                                    storepost(dbRes[0].user_id, newPath);

                                });

                            })



                    } else {
                        storepost(dbRes[0].user_id, "-");
                    }


                });

        }

        function between(min, max) {
            return Math.floor(
                Math.random() * (max - min) + min
            )
        }


        function storepost(user_id, newPath) {
            var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

            var filename;
            if (isImage && type != "text-based") {
                filename = newPath;
            } else {
                filename = "-"
            }


            if (type == "poll-based") {
            // Only for Polls

                 db.query(
                `INSERT INTO Posts (user_id, content, item1, item2, type, link, timestamp, image, image_path, post_created) 
        VALUES (${user_id},"${post.split("ITEM")[0]}","${post.split("ITEM")[1]}","${post.split("ITEM")[2]}","poll","-",${timestamp},${isImage}, "-","${date}")`
                , function (error, results, fields) {
                    if (error) {

                        console.log('post error ' + error.message);
                        res.status(200).json({
                            success: false,
                            error: true,
                            message: "error storing to database"
                        })

                    } else {

                        db.query(
                            `SELECT post_id FROM Posts WHERE timestamp=${timestamp} AND user_id = ${user_id}`
                            , function (error, results, fields) {

                                console.log('post successfull');
                                res.status(200).json({
                                    success: true,
                                    error: false,
                                    message: `${results[0].post_id}`
                                })

                            });

                    }

                });
        
            } else {
            // For images and text Posts
                db.query(
                    `INSERT INTO Posts (user_id, content, link, timestamp, image, image_path, post_created) 
            VALUES (${user_id},"${post}","-",${timestamp},${isImage}, "${filename}","${date}")`
                    , function (error, results, fields) {
                        if (error) {
    
                            console.log('post error ' + error.message);
                            res.status(200).json({
                                success: false,
                                error: true,
                                message: "error storing to database"
                            })
    
                        } else {
    
                            db.query(
                                `SELECT post_id FROM Posts WHERE timestamp=${timestamp} AND user_id = ${user_id}`
                                , function (error, results, fields) {
    
                                    console.log('post successfull');
                                    res.status(200).json({
                                        success: true,
                                        error: false,
                                        message: `${results[0].post_id}`
                                    })
    
                                });
    
                        }
    
                    });
            }
            }
        

    } else {
        db.query(
            `SELECT COUNT(*) AS RowCount FROM Users WHERE username="${username}"`
            , function (error, username_results, fields) {

                if (error) {

                    console.log('login error ' + error.message);
                    res.status(200).json({
                        success: false,
                        error: true,
                        message: "ok"
                    })

                }

                if (Number(username_results[0].RowCount) == 0) {
                    console.log('not found');

                    res.status(200).json({
                        success: false,
                        error: false,
                        message: "wrong username"
                    })

                } else {

                    db.query(
                        `SELECT password FROM Users WHERE username="${username}"`
                        , function (error, passw_results, fields) {

                            // Load hash from your password DB.
                            bcrypt.compare(password, passw_results[0].password, function (err, result) {
                                // result == true
                                console.log(result)


                                if (result) {

                                    finduserid();

                                } else {
                                    res.status(200).json({
                                        success: false,

                                        error: false,
                                        message: "wrong password"
                                    })
                                }


                            });

                        });
                }

            });

        function finduserid() {
            db.query(

                `SELECT user_id FROM Users
                WHERE username="${username}"`
                , function (error, results, fields) {
                    if (error) {
                        console.log("error\n\n" + error.message);

                        res.status(200).json({
                            success: false,
                            error: true,
                            message: "error getting user id"
                        })
                    }

                    var dbRes = JSON.parse(JSON.stringify(results))


                    sharp("./uploads/" + req.files[0].filename)
                        .jpeg({ progressive: true, force: false, quality: 10 })
                        .png({ progressive: true, force: false, quality: 10 })
                        .resize(1000)
                        .webp({ quality: 10 })
                        .toFile("./uploads/" + req.files[0].filename + ".webp", (err, info) => {

                            fs.unlinkSync("./uploads/" + req.files[0].filename)
                            var newPath = dbRes[0].user_id + "-" + timestamp + ".jpg"
                            fs.rename("./uploads/" + req.files[0].filename + ".webp", "./uploads/" + newPath , function (err) {
                                if (err) console.log('ERROR: ' + err);

                                storepost(dbRes[0].user_id, newPath);

                            });

                        })




                });

        }

        function between(min, max) {
            return Math.floor(
                Math.random() * (max - min) + min
            )
        }


        function storepost(user_id, newPath) {

            var filename;
            if (isImage) {
                filename = newPath
            } else {
                filename = "-"
            }

            db.query(
                `UPDATE Users set image_path = "${filename}", image = true WHERE username = "${username}"`
                , function (error, results, fields) {
                    if (error) {

                        console.log('profile picture error ' + error.message);
                        res.status(200).json({
                            success: false,
                            error: true,
                            message: "error storing to database"
                        })

                    } else {

                        console.log('profile picture successfull');
                        res.status(200).json({
                            success: true,
                            error: false,
                            message: "profile picture success"
                        })
                    }

                });
        }
    }

}