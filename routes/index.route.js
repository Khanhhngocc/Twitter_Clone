const homeRoutes = require("./home.route");
const loginRoutes = require("./auth.route");

// Route Api
const postsApiRoute = require("./api/posts");


module.exports = (app) => {
    app.use("/", homeRoutes);
    
    app.use("/user", loginRoutes);

    app.use("/api/posts", postsApiRoute);
}
