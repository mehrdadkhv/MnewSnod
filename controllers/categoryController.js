const Category = require("../models/Category");
const { formatDate } = require("../utils/jalali");
const { truncate } = require("../utils/helpers");

const { buildAncestors } = require("../utils/buildAncestors");

exports.getCategory = async (req, res) => {
  const category = await Category.find({});

  res.render("admin/categories/new", {
    category: new Category(),
    pageTitle: "ساخت دسته بندی",
    path: "/admin/create-category",
    layout: "./layouts/dashLayout",
    fullname: req.user.fullname,
    categories: category,
  });
};

exports.editCategory = async (req, res) => {
  try {
    const categories = await Category.find({});
    const category = await Category.findById(req.params.id);
    res.render("admin/categories/edit", {
      pageTitle: "ویرایش دسته بندی",
      category,
      path: "/admin/edit-category",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      categories,
    });
  } catch (error) {
    res.render("admin/updateCategory", {
      category,
      path: "/admin/edit-category",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      errors: errorArr,
    });
    console.log(error);
  }
};

exports.slugCategory = async (req, res) => {
  try {
    const Allcategory = await Category.find({});

    const category = await Category.findOne({ slug: req.params.slug }).populate(
      "articles",
      "-_id title"
    );
    const ariclesCategory = await Category.find({
      slug: req.params.slug,
    }).populate({
      path: "articles",
      fields: "title slug",
    });

    // console.log(ariclesCategory[0].articles);

    if (category == null) res.redirect("/dashboard");
    res.render("admin/categories/show", {
      pageTitle: req.params.slug,
      path: "/admin/slug-category",
      layout: "./layouts/dashLayout",
      fullname: category.title,
      category,
      ariclesCategory,
      categories: Allcategory,
      formatDate,
      truncate,
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

exports.sotreCategory = async (req, res) => {
  const Allcategory = await Category.find({});
  let parent = req.body.parent ? req.body.parent : null;
  const category = new Category({
    title: req.body.title,
    slug: req.body.slug,
    parent: parent,
  });
  try {
    let newCategory = await category.save();
    buildAncestors(newCategory, category._id, parent);
    res.redirect(`/dashboard/categories/`);
  } catch (err) {
    res.render("admin/categories/new", {
      category: new Category(),
      pageTitle: "ساخت دسته بندی",
      path: "/admin/create-category",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      categories: Allcategory,
      errorArr: err,
    });
    console.log(err.message);
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    const { title, slug } = req.body;

    category.title = title;
    category.slug = slug;
    await category.save();
    return res.redirect("back");
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
    console.log("test");
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
