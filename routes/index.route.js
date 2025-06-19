const homeRoutes = require("./home.route");
const loginRoutes = require("./auth.route");
const postRoute = require("./post.route");

// Route Api
const postsApiRoute = require("./api/posts");

const middleware = require("../middleware");


module.exports = (app) => {
    app.use("/", homeRoutes);
    
    app.use("/user", loginRoutes);

    app.use("/api/posts", postsApiRoute);

    app.use("/posts", middleware.requireLogin, postRoute);
}
