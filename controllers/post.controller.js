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

//[POST] /api/posts/:id/retweet
module.exports.postRetweet = async(req, res) => {
    const user = req.session.user;
    const postId = req.params.id;

    try {
        var deletedPost = await Post.findOneAndDelete({postedBy: user._id, retweetData: postId})   
    } catch (error) {
        console.log(error)
    }
    const option = deletedPost == null ? "$addToSet" : "$pull";

    var repost = deletedPost;

    if(repost == null) {
        repost = await Post.create({ postedBy: user._id, retweetData: postId})
        .catch(error => {
            console.log(error);
            res.sendStatus(400)
        })
    }

    //Insert user retweet
    req.session.user = await User.findByIdAndUpdate({_id: user._id}, { [option]: {retweet: repost._id} }, {new: true})
    .catch(error => {
        console.log(error)
        res.sendStatus(400)
    })

    //Insert post retweet
    const post = await Post.findByIdAndUpdate(postId, { [option]: {retweetUsers: user._id} }, {new: true})
    .catch(error => {
        console.log(error)
        res.sendStatus(400)
    })

    res.status(200).send(post);
}
