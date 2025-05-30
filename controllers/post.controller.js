const User = require("../models/User.model");
const Post = require("../models/Post.model");


//[GET] /api/posts
module.exports.getPosts = async(req, res) => {
    try {
        const posts = await Post
            .find()
            .populate("postedBy")
            .sort({ "createdAt" : -1 });
        if(posts) {
            res.status(200).send(posts);
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(400); 
    }
}

//[POST] /api/posts
module.exports.postPosts = async(req, res) => {
    req.body.postedBy = req.session.user;

    if(!req.body || !req.body.content) {
        console.log("Content param not send with request")
        return res.sendStatus(400);
    }

    Post.create(req.body)
    .then(async newPost => {
        newPost = await User.populate(newPost, { path: "postedBy" });

        res.status(200).send(newPost);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
} 

//[PATCH] /api/posts/:id/like
module.exports.patchPosts = async(req, res) => {
    const postId = req.params.id;
    let user = req.session.user;

    let isLiked = user.likes && user.likes.includes(postId);

    const option = isLiked ? "$pull" : "$addToSet";

    //Insert user like
    try {
        user = await User.findByIdAndUpdate(user._id, { [option]: { likes: postId }}, { new: true });
        req.session.user = user;          
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }
    //Insert post like
    try {
        var post = await Post.findByIdAndUpdate(postId, { [option]: { likes: user._id }}, { new: true });
    } catch (error) {
        console.log(error);
        res.sendStatus(400);
    }

    res.status(200).send(post);
}