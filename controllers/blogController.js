const Blog = require("../models/Blog");
const Article = require("../models/Article");
const { formatDate } = require("../utils/jalali");
const { truncate } = require("../utils/helpers");

exports.getIndex = async (req, res) => {
  try {
    const posts = await Blog.find({ status: "public" }).sort({
      createdAt: "desc",
    });

    const LastArticle = await Article.find({}).limit(1).sort({
      createdAt: "desc",
    });

    const LastArticles = await Article.find({}).limit(4).sort({
      createdAt: "desc",
    });

    const policArticke = await Article.find().limit(3);
    const policArticketest = await Article.find()
      .limit(3)
      .populate("category", "title slug");

    res.render("index", {
      pageTitle: " MNews | صفحه اصلی",
      path: "/",
      posts,
      formatDate,
      truncate,
      LastArticles,
      LastArticle,
      policArticke,
    });
  } catch (err) {
    console.log(err);
    res.render("errors/500");
  }
};

exports.getSingleArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ _id: req.params.id }).populate(
      "category"
    );

    if (!article) return res.redirect("errors/404");

    res.render("article", {
      pageTitle: article.title,
      path: "/article",
      article,
      formatDate,
    });
  } catch (err) {
    console.log(err);
    res.redirect("errors/500");
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
