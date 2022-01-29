const Blog = require("../models/Blog");
const { formatDate } = require("../utils/jalali");
const { truncate } = require("../utils/helpers");

exports.getIndex = async (req, res) => {
  try {
    const posts = await Blog.find({ status: "public" }).sort({
      createdAt: "desc",
    });
    res.render("index", {
      pageTitle: " MNews | صفحه اصلی",
      path: "/",
      posts,
      formatDate,
      truncate,
    });
  } catch (err) {
    console.log(err);
    res.render("errors/500");
  }
};

exports.getDemo = async (req, res) => {
  const page = +req.query.page || 1;
  const postPerPage = 2;

  try {
    const numberOfPosts = await Blog.find({
      status: "public",
    }).countDocuments();
    const posts = await Blog.find({ status: "public" })
      .sort({
        createdAt: "desc",
      })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);
    res.render("demo", {
      pageTitle: "Demo",
      path: "/",
      posts,
      formatDate,
      truncate,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: postPerPage * page < numberOfPosts,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfPosts / postPerPage),
    });
  } catch (err) {
    console.log(err);
    res.render("errors/500");
  }
};
exports.getSinglePost = async (req, res) => {
  try {
    const post = await Blog.findOne({ _id: req.params.id }).populate("user"); // fur slug _id:req.body.user
    if (!post) return res.redirect("errors/404");

    res.render("post", {
      pageTitle: post.title,
      path: "/post",
      formatDate,
      post,
    });
  } catch (err) {
    console.log(err);
    res.render("errors/500");
  }
};
