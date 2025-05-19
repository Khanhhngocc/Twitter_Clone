const express = require("express");
require("dotenv").config();
const path = require("path");
const bodyParser = require("body-parser");
const session = require("express-session");
const app = express();

// ROUTES 
const route = require("./routes/index.route");

// Database
const database = require("./config/database");
database.connect();

// View & static
app.set("views", "./views");
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

// Middleware xử lý body và session - phải đặt TRƯỚC routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: "khengngoc xink dep",
    resave: true,
    saveUninitialized: false
}));

// Router
route(app);

// Port
const port = process.env.PORT;
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
