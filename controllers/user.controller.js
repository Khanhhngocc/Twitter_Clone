const User = require("../models/User.model");

// [PATCH] /api/users/:userId/follow
module.exports.follow = async(req, res) => {
    const userId = req.params.userId;
    const userLoggedIn = req.session.user;

    const user = await User.findById(userId);

    if(user == undefined) return res.sendStatus(404);

    let isFollowing = user.followers && user.followers.includes(userLoggedIn._id);
    let option = isFollowing ? "$pull" : "$addToSet";

    try {
        req.session.user = await User.findByIdAndUpdate(userLoggedIn._id, { [option]: {following: userId } }, { new: true });
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }

    try {
        await User.findByIdAndUpdate(userId, { [option]: {followers: userLoggedIn._id}}, { new: true });
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
    
    res.status(200).send(req.session.user);
}

// [GET] /api/users/:userId/following
module.exports.following = async(req, res) => {
    const userId = req.params.userId;

    try {
        const results = await User.findOne({_id: userId}).populate("following");
        res.status(200).send(results);
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
}

// [GET] /api/users/:userId/followers
module.exports.followers  = async(req, res) => {
    const userId = req.params.userId;

    try {
        const results = await User.findOne({_id: userId}).populate("followers");
        res.status(200).send(results)
    } catch (error) {
        console.log(error);
        res.sendStatus(400)
    }
}
