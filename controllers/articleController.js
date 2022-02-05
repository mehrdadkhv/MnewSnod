const express = require("express");
const Article = require("../models/Article");
const Category = require("../models/Category");

const { buildAncestors } = require("../utils/buildAncestors");

exports.getArticle = async (req, res) => {
  const category = await Category.findById({}).populate("category").exec;
  const article = await Article.find({});
  res.render("admin/articles/index", {
    pageTitle: "بخش مدیریت |ساخت پست جدید",
    path: "/admin/get-article",
    layout: "./layouts/dashLayout",
    fullname: req.user.fullname,
    articles: article,
    category,
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
      article,
      path: "/admin/edit-article",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      errors: errorArr,
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
  const errorArr = [];

  const article = new Article({
    title: req.body.title,
    summary: req.body.summary,
    body: req.body.body,
    slug: req.body.slug,
    category: req.body.category,
  });

  try {
    console.log(req.body);
    let newArticle = await article.save();

    // buildAncestors(newArticle, article._id, parent);
    res.redirect(`/dashboard/articles/`);
  } catch (err) {
    res.render("admin/articles/new", {
      article: new Article(),
      pageTitle: "ساخت آرتیکل",
      path: "/admin/create-article",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      errors: errorArr,
    });
    console.log(err.message);
  }
};

exports.updateArticle = async (req, res) => {
  try {
    req.article = await Article.findById(req.params.id);
    next();
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
