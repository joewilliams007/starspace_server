// Edit Account

module.exports = (req, res) => {

    var update_db = require('./update_db');

  
    replacement = req.body.replacement
    edit_type = req.body.edit_type
    session = req.body.session
    
    var session = require('./session.js');

    // Authenticate session and ip
    session.verify(session, req, res, function(user_id){
        saveEditAcount(user_id);
    })

    function saveEditAcount(user_id){

        if (edit_type == "edit-bio") {

            var q = `UPDATE Users set bio = "${replacement}" WHERE user_id = ${user_id}`
            update_db.query(q, res)

        }
    }
}