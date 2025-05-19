const User = require("../models/User.model");
const bcrypt = require("bcrypt");

//[GET] user/login
module.exports.login = (req, res) => {
    res.render("pages/user/login", {
        pageTitle: "Login",
        payload: {}
    })
};

//[POST] user/login
module.exports.loginPost = async(req, res) => {
    const logUserName = req.body.logUserName;
    const logPassword = req.body.logPassword;

    let payload = req.body;

    if(logUserName && logPassword){
        const user = await User.findOne({
            $or: [
                {userName: logUserName},
                {email: logUserName}
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("pages/user/login", {
                pageTitle: "Login",
                payload
            })
        }) 

        if(user != null) {
            let result = await bcrypt.compare(logPassword, user.password);

            if(result === true) {
                req.session.user = user;
                return res.redirect("/")
            }
        }

        payload.errorMessage = "Login credentials incorrect."
        res.status(200).render("pages/user/login", {
            pageTitle: "login",
            payload
        })
    }
};

//[GET] user/register
module.exports.register = (req, res) => {
    res.render("pages/user/register", {
        pageTitle: "Register",
        payload: {},
    })
};

//[POST] user/register
module.exports.registerPost = async(req, res) => {
    const firstName = req.body.firstName.trim();
    const lastName = req.body.lastName.trim();
    const userName = req.body.userName.trim();
    const email = req.body.email.trim();
    const password = req.body.password;
    
    let payload = req.body;

    if(firstName && lastName && userName && email && password){
        const user = await User.findOne({
            $or: [
                { userName: userName },
                { email: email }
            ]
        })
        .catch((error) => {
            console.log(error);
            payload.errorMessage = "Something went wrong.";
            res.status(200).render("pages/user/register", {
                pageTitle: "Register",
                payload
            })
        })

        if(user == null) {
            req.body.password = await bcrypt.hash(password, 10);

            User.create(req.body)
            .then((user) => {
                req.session.user = user;
                return res.redirect("/")
            })

        } else {
            if(email == user.email){
                payload.errorMessage = "Email already in use."
            } else {
                payload.errorMessage = "Username already in use."
            }
            res.status(200).render("pages/user/register", {
                pageTitle: "Register",
                payload
            })
        }
        
    } else {
        payload.errorMessage = "Make sure each field has a valid value"
        res.status(200).render("pages/user/register", {
            pageTitle: "Register",
            payload
        })
    }
};

//[GET] user/logout
module.exports.logout = (req, res) => {
    if(req.session){
        req.session.destroy(() => {
            res.redirect("/user/login");
        })
    }
};