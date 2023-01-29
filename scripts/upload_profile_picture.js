// Upload Profile Picture

module.exports = (req, res) => {
    var update_db = require('./update_db');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds
    const sharp = require('sharp');
    var fs = require('fs');

    user_id = req.body.user_id
    password = req.body.password
    session_id = req.body.session_id

    var session = require('./session.js');

    // Authenticate session and ip
    session.verify(session_id, res, function(user_id){
        saveProfilePicture(user_id);
    })

    function saveProfilePicture(user_id){
        sharp("./uploads/" + req.files[0].filename)
        .jpeg({ progressive: true, force: false, quality: 10 })
        .png({ progressive: true, force: false, quality: 10 })
        .resize(1000)
        .webp({ quality: 10 })
        .toFile("./uploads/" + req.files[0].filename + ".webp", (err, info) => {

            fs.unlinkSync("./uploads/" + req.files[0].filename)
            var newPath = user_id + "-" + timestamp + ".jpg"
            fs.rename("./uploads/" + req.files[0].filename + ".webp", "./uploads/" + newPath , function (err) {
                if (err) console.error('ERROR: ' + err);

                update_db.query(`UPDATE Users set image_path = "${newPath}", image = true WHERE user_id = ${user_id}`,res)
            });

        })
    }
}