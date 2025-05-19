module.exports.register = (req, res, next) => {
    let payload = req.body;
    if(
        !req.body.firstName.trim() || 
        !req.body.lastName.trim() ||
        !req.body.userName.trim() ||
        !req.body.email.trim() ||
        !req.body.password.trim()
    ){
        payload.errorMessage = "Make sure each field has a valid value"
        res.status(200).render("pages/user/register", {
            pageTitle: "Register",
            payload
        })
        return;
    }

    if(req.body.password != req.body.passwordConf) {
        payload.errorMessage = "Passwords do not match!";
        res.status(200).render("pages/user/register", {
            pageTitle: "Register",
            payload
        });
        return;
    }

    next();
}

module.exports.login = (req, res, next) => {
    let payload = req.body;
    if(
        !req.body.logUserName.trim() || 
        !req.body.logPassword.trim()
    ){
        payload.errorMessage = "Make sure each field has a valid value"
        res.status(200).render("pages/user/login", {
            pageTitle: "Login",
            payload
        })
        return;
    }
    next();
}