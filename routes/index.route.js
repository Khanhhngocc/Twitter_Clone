const homeRoutes = require("./home.route");
const loginRoutes = require("./auth.route");
const postRoute = require("./post.route");
const profileRoute = require("./profile.route");

// Route Api
const postsApiRoute = require("./api/posts");
const usersApiRoute = require("./api/users");

const middleware = require("../middleware");


module.exports = (app) => {
    app.use("/", homeRoutes);
    
    app.use("/user", loginRoutes);

    app.use("/api/posts", postsApiRoute);

    app.use("/api/users", usersApiRoute);

    app.use("/posts", middleware.requireLogin, postRoute);

    app.use("/profile", middleware.requireLogin, profileRoute);
}
