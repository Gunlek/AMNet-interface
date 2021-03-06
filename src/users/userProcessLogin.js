const { loginUser } = require('../utils/loginUser');

/*
 * Handle POST request from log-in page
 * Check if they are registered in the database and if username/password corresponds
*/
const UserProcessLogin = async (req, res) => {
    let loggedIn = await loginUser(req, req.body.username, req.body.password);
    if(loggedIn){
            let returnURL = "/";
            if(req.session.returnTo != null)
                returnURL = req.session.returnTo;
            res.redirect(returnURL);
    }
    else
        res.redirect('/users/login/?state=failed');
}

module.exports = { UserProcessLogin };
