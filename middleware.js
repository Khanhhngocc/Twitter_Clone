module.exports.requireLogin = (req, res, next) => {
    if(req.session && req.session.user){
        res.locals.userLoggedIn = req.session.user;
        return next()
    }
    else {
        return res.redirect('/user/login');
    }
}   