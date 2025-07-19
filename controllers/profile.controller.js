const User = require("../models/User.model");

// [GET] /profile/:username
module.exports.index = async(req, res) => {
    const userName = req.params.username;
    const userLoggedIn = req.session.user;

    const user = await User.findOne({userName: userName})

    if(user == null) {  
        res.render("pages/profile/index", {
            pageTitle: "User not found",
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn)
        })
    } else {
        res.render("pages/profile/index", {
            pageTitle: user.userName,
            profileUser: user,
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn)
        })
    }
}

// [GET] /profile/:username/replies
module.exports.reply = async(req, res) => {
    const userName = req.params.username;
    const userLoggedIn = req.session.user;

    const user = await User.findOne({userName: userName})

    if(user == null) {  
        res.render("pages/profile/index", {
            pageTitle: "User not found",
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
            selectedTab: "replies"
        })
    } else {
        res.render("pages/profile/index", {
            pageTitle: user.userName,
            profileUser: user,
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
            selectedTab: "replies"
        })
    }
}

// [GET] /profile/:username/following
module.exports.following = async(req, res) => {
    const userName = req.params.username;
    const userLoggedIn = req.session.user;

    const user = await User.findOne({userName: userName});

    if(user == null){
        res.render("pages/followersAndFollowing/index", {
            pageTitle: "User not found",
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
            profileUser: user,
            selectedTab: "following"
        })
    } else {
        res.render("pages/followersAndFollowing/index", {
            pageTitle: "Following",
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
            profileUser: user,
            selectedTab: "following"
        })
    }
}

// [GET] /profile/:username/followers
module.exports.followers = async(req, res) => {
    const userName = req.params.username;
    const userLoggedIn = req.session.user;

    const user = await User.findOne({userName: userName});

    if(user == null){
        res.render("pages/followersAndFollowing/index", {
            pageTitle: "User not found",
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
            profileUser: user,
            selectedTab: "followers"
        })
    } else {
        res.render("pages/followersAndFollowing/index", {
            pageTitle: "Followers",
            userLoggedIn: userLoggedIn,
            userLoggedInJs: JSON.stringify(userLoggedIn),
            profileUser: user,
            selectedTab: "followers"
        })
    }
}

async function getPayLoad(userName, userLoggedIn) {
    var user = await User.findOne({userName: userName})

    if(user == null){
        user = await User.findById(userName);

        if(user == null) {
            return{
                pageTitle: "User not found",
                userLoggedIn: userLoggedIn,
                userLoggedInJs: JSON.stringify(userLoggedIn)
            }
        }
    }
    return {
        pageTitle: user.userName,
        userLoggedIn: userLoggedIn,
        userLoggedInJs: JSON.stringify(userLoggedIn)
    }
}