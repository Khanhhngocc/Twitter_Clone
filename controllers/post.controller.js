const User = require("../models/User.model");
const Post = require("../models/Post.model");


//[GET] /api/posts
module.exports.getPosts = async(req, res) => {
    let find = {};
    if(req.query.postedBy) {
        find.postedBy = req.query.postedBy
        if(req.query.isReply){
            const isReply = req.query.isReply == "true";
            find.replyTo = { $exists: isReply };
        }
    }

    if(req.query.followingOnly) {
        const userFollowingIds = [];

        if(!req.session.user.following) {
            req.session.user.following = [];
        }

        req.session.user.following.forEach(user => {
            userFollowingIds.push(user);    
        });

        userFollowingIds.push(req.session.user._id);
        find.postedBy = { $in: userFollowingIds };
    }

    await Post.find(find)
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

    const results = {};

    await Post.findOne({_id: postId})
    .populate("postedBy")
    .populate("retweetData")
    .then(async postData => {
        
        postData = await User.populate(postData, { path: "retweetData.postedBy" });

        results.postData = postData;
        
        if(postData.replyTo !== undefined) {
            results.replyTo = postData.replyTo;
        }

        let replies = await Post.find({ replyTo: postId })
                            .populate("postedBy")
                            .populate("retweetData")
                            .populate("replyTo");

        replies = await User.populate(replies, { path: "replyTo.postedBy" });
        replies = await User.populate(replies, { path: "retweetData.postedBy" });


        results.replies = replies;

        res.status(200).send(results);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(400);
    })
};

//[POST] /api/posts/:id
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

//[GET] /posts/:id
module.exports.getPost = (req, res) => {
    res.render("pages/post/index", {
        pageTitle: "View post",
        userLoggedIn: req.session.user,
        userLoggedInJs: JSON.stringify(req.session.user),
        postId: req.params.id
    })
}

// [DELETE] /posts/:id
module.exports.deletePost = (req, res) => {
    const postId = req.params.id;

    Post.findByIdAndDelete(postId)
    .then(() => res.sendStatus(202))
    .catch(error => {
        console.log(error);
        res.sendStatus(404);
    })
}
