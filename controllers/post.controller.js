const User = require("../models/User.model");
const Post = require("../models/Post.model");


//[GET] /api/posts
module.exports.getPosts = async(req, res) => {
    await Post.find()
    .populate("postedBy")
    .populate("retweetData")
    .populate("replyTo")
    .sort({ "createdAt": -1 })
    .then(async results => {
        results = await User.populate(results, { path: "replyTo.postedBy" });
        results = await User.populate(results, { path: "retweetData.postedBy" });
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
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

//[GET] /api/posts/:id
module.exports.getReply = async(req, res) => {
    const postId = req.params.id;

    await Post.findOne({_id: postId})
    .populate("postedBy")
    .populate("retweetData")
    .then(async results => {
        results = await User.populate(results, { path: "retweetData.postedBy" });
        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
};

//[POST] /apt/posts/:id
module.exports.postReply = async(req, res) => {
    const content = req.body.content;
    const replyTo = req.body.replyTo;
    req.body.postedBy = req.session.user

    if(!content || !replyTo) return res.sendStatus(400);

    Post.create(req.body)
    .then(async newPost => {
        newPost = await User.populate(newPost, { path: "postedBy" })
        res.status(201).send(newPost)
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400)
    })
}

