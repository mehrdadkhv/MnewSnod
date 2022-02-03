const Blog = require("../models/Blog");

exports.getArticle = (req, res) => {
  res.render("admin/addArticle", {
    pageTitle: "بخش مدیریت |ساخت پست جدید",
    path: "/admin/add-article",
    layout: "./layouts/dashLayout",
    fullname: req.user.fullname,
  });
};

exports.createArticle = async (req, res) => {
  try {
    await Blog.create({
      ...req.body,
      user: req.user.id,
      category: req.body.category,
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
  }
};
