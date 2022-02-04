const express = require("express");
const Category = require("../models/Category");
const router = express.Router();
const { buildAncestors } = require("../utils/buildAncestors");
const { get500 } = require("../controllers/errorController");

exports.getCategory = (req, res) => {
  res.render("admin/categories/new", {
    category: new Category(),
    pageTitle: "ساخت دسته بندی",
    path: "/admin/create-category",
    layout: "./layouts/dashLayout",
    fullname: req.user.fullname,
  });
};

exports.editCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    res.render("admin/updateCategory", {
      category,
      path: "/admin/edit-category",
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

exports.slugCategory = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (category == null) res.redirect("/dashboard");
    res.render("/admin/categories/show", {
      category,
      path: "/admin/slug-category",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
    });
  } catch (error) {
    console.log(err);
    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    res.render("/admin/categories/show", {
      category,
      path: "/admin/slug-category",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      errors: errorArr,
    });
  }
};

exports.sotreCategory = async (req, res) => {
  let parent = req.body.parent ? req.body.parent : null;
  const category = new Category({
    name: req.body.name,
    slug: req.body.slug,
    parent: parent,
  });
  try {
    let newCategory = await category.save();
    buildAncestors(newCategory, category._id, parent);
    res.redirect(`/dashboard/categories/`);
  } catch (err) {
    console.log(err);
    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    res.render("/admin/categories/show", {
      category,
      path: "/admin/slug-category",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      errors: errorArr,
    });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    req.category = await Category.findById(req.params.id);
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

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
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

// exports.saveCategoryAndRedirect = (path) => {
//   return async (req, res) => {
//     let category = req.category;
//     category.name = req.body.name;
//     category.parent = parent;
//     category.ancestors = req.body.ancestors;
//     try {
//       category = await category.save();
//       buildAncestors(category._id, parent);
//       res.redirect(`/dashboard/categories/${category.slug}`);
//     } catch (error) {
//       res.render("/dashboard", {
//         category,
//         path: "/admin/show-category",
//         layout: "./layouts/dashLayout",
//         fullname: req.user.fullname,
//       });
//       console.log(error);
//     }
//   };
// };
