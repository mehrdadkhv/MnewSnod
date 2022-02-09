const Article = require("../models/Article");
const Category = require("../models/Category");
const mongoose = require("mongoose");

const { buildAncestors } = require("../utils/buildAncestors");

exports.getArticle = async (req, res) => {
  const article = await Article.find().populate("category", "-_id title slug");

  const category = await Category.find({});

  res.render("admin/articles/index", {
    pageTitle: "بخش مدیریت |   تمام مقالات",
    path: "/admin/get-article",
    layout: "./layouts/dashLayout",
    articles: article,
    categories: category,
  });
};

exports.createArticle = async (req, res) => {
  const category = await Category.find({});
  res.render("admin/articles/new", {
    pageTitle: "بخش مدیریت |ساخت پست جدید",
    path: "/admin/add-article",
    layout: "./layouts/dashLayout",
    fullname: req.user.fullname,
    categories: category,
  });
};

exports.editArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    res.render("admin/articles/edits", {
      article,
      path: "/admin/edit-article",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
    });
  } catch (error) {
    res.render("admin/articles/edits", {
      path: "/admin/edit-article",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
    });
    console.log(error);
  }
};

exports.slugArticle = async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug });
    if (article == null) res.redirect("/dashboard");
    res.render("admin/articles", {
      article,
      path: "/admin/slug-article",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
    });
  } catch (error) {
    res.render("errors/500", {
      pageTitle: "خطای سرور | 500",
      page: "/500",
      layout: "errors/500",
    });
    console.log(error);
  }
};

exports.storeArticle = async (req, res) => {
  const Allcategory = await Category.find({});

  let category = req.body.category ? req.body.category : null;

  const newArticle = await Article.create({
    title: req.body.title,
    slug: req.body.slug,
    summary: req.body.summary,
    description: req.body.description,
    body: req.body.body,
    category: category,
    categories: Allcategory,
  });

  const articleCategoriesID = mongoose.Types.ObjectId(req.body.category);

  Category.findByIdAndUpdate(
    { _id: articleCategoriesID },
    { $push: { articles: newArticle._id } },
    { new: true, useFindAndModify: false }
  )
    .then((docs) => {
      if (docs) {
        console.log({ success: true, data: docs });
      } else {
        console.log(console.log({ success: true, data: docs }));
      }
    })
    .catch((err) => {
      console.log(err);
    });
  // console.log(req.body);
  try {
    // let newArticle = await article.save();

    // buildAncestors(newArticle, article._id, category);
    res.redirect(`/dashboard/categories/`);
  } catch (err) {
    res.render("admin/categories/new", {
      category: new Category(),
      pageTitle: "ساخت دسته بندی",
      path: "/admin/create-category",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      errorArr: err,
    });
    console.log(err.message);
  }
};

exports.updateArticle = async (req, res) => {
  try {
    req.article = await Article.findById(req.params.id);
  } catch (error) {
    res.render("errors/500", {
      pageTitle: "خطای سرور | 500",
      page: "/500",
      layout: "errors/500",
    });
    console.log(error);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    await Article.findByIdAndDelete(req.params.id);
    res.redirect("/dashboard");
  } catch (error) {
    res.render("errors/500", {
      pageTitle: "خطای سرور | 500",
      page: "/500",
      layout: "errors/500",
    });
    console.log(error);
  }
};
