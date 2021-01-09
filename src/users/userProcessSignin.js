const { DatabaseSingleton } = require("../utils/databaseSingleton");
const md5 = require('md5');
const { RegisterNewRadiusUser } = require("../utils/radius/registerNewRadiusUser");

require('dotenv').config();

/*
 * Handle POST request from sign-in page
 * Gather username, firstname, lastname, email, bucque, fams, proms and password from
 * form and check if password and conf_password corresponds
 * then register the newly created user to the database and redirect to log-in
*/
const UserProcessSignin = (req, res) => {
    let database = DatabaseSingleton.getInstance().getDatabase();
    let username = req.body.username;
    let firstname = req.body.firstname;
    let lastname = req.body.lastname;
    let email = req.body.email;
    let phone = req.body.phone;
    let bucque = req.body.bucque;
    let fams = req.body.fams;
    let password = md5(req.body.password);
    let password_conf = md5(req.body.password_confirmation);
    let charte = req.body.check_charte;

    const select_or_text = req.body.select_or_text;
    let proms = req.body.user_proms_select;
    if(select_or_text === "text"){
        proms = req.body.user_proms_text;
    }

    if((username !== "" && bucque !== "" && fams !== "" && proms !== "" && email !== "" && phone !== "") && password === password_conf){
        if(charte=="true"){

            if(process.env.RADIUS == "true"){
                RegisterNewRadiusUser(username, password);
            }

            database.query('SELECT * FROM users WHERE user_name=?', [username], function(errors, results, fields){
                if(results.length == 0){
                    database.query('INSERT INTO users(user_name, user_firstname, user_lastname, user_email, user_phone, user_password, user_bucque, user_fams, user_proms) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)', [username, firstname, lastname, email, phone, password, bucque, fams, proms]);
                    res.redirect('/users/login/');
                }
                else
                    res.redirect('/users/signin/?state=username_already_used');
            });
        }
        else
            res.redirect('/users/signin/?state=no_charte');
    }
    else
        res.redirect('/users/signin/?state=empty_field');
}

module.exports = { UserProcessSignin };