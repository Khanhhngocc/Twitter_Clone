
//[GET] /
module.exports.index = (req, res) => {
    res.render("pages/home/index", {
        pageTitle: "Trang chủ",
        userLoggedIn: req.session.user
    })
}