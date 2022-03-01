const fs = require("fs");
const multer = require("multer");
const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Article = require("../models/Article");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const { fileFilter } = require("../utils/multer");

exports.getArticle = async (req, res) => {
  const page = +req.query.page || 1; //string to number
  const articlePrePage = 10;

  const numberOfArticle = await Article.find({}).countDocuments();

  const article = await Article.find({})
    .populate("category", "-_id title slug")
    .skip((page - 1) * articlePrePage)
    .limit(articlePrePage);

  const category = await Category.find({});

  res.render("admin/articles/index", {
    pageTitle: "بخش مدیریت |   تمام مقالات",
    path: "/admin/addArticles",
    layout: "./layouts/dashLayout",
    articles: article,
    categories: category,
    currentPage: page,
    nextPage: page + 1,
    previousPage: page - 1,
    hasNextPage: articlePrePage * page < numberOfArticle,
    hasPreviousPage: page > 1,
    lastPage: Math.ceil(numberOfArticle / articlePrePage),
  });
};

exports.createArticle = async (req, res) => {
  const category = await Category.find({});
  res.render("admin/articles/new", {
    pageTitle: "بخش مدیریت |ساخت پست جدید",
    path: "/admin/addArticles",
    layout: "./layouts/dashLayout",
    fullname: category.title,
    categories: category,
  });
};

exports.getEditArticle = async (req, res) => {
  const category = await Category.find({});

  const article = await Article.findOne({
    _id: req.params.id,
  }).populate("category", "title slug");

  if (!article) {
    return res.redirect("errors/404");
  }

  // console.log(article.category[0].title);

  res.render("admin/articles/edit", {
    pageTitle: "بخش مدیریت |ویرایش مقاله ",
    path: "/admin/editArticle",
    layout: "./layouts/dashLayout",
    fullname: category.title,
    categories: category,
    article,
  });
};

exports.editArticle = async (req, res) => {
  const errArr = [];

  const image = req.files ? req.files.image : {};
  const fileName = `${shortId.generate()}_${image.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  const article = await Article.findById(req.params.id);
  try {
    // validate image thumbnail edit##############################

    // if (image.name) await Article.postValidation({ ...req.body, image });
    // else
    //   await Article.postValidation({
    //     ...req.body,
    //     image: {
    //       name: "placeholder",
    //       size: 0,
    //       mimetype: "image/jpeg",
    //     },
    //   });

    if (!article) {
      return res.redirect("errors/404");
    }
    req.body = { ...req.body, image };

    if (image.name) {
      fs.unlink(
        `${appRoot}/public/uploads/thumbnails/${article.image}`,
        async (err) => {
          if (err) console.log(err);
          else {
            await sharp(image.data)
              .jpeg({ quality: 60 })
              .toFile(uploadPath)
              .catch((err) => {
                console.log(err);
              });
          }
        }
      );
    }

    const { title, summary, description, body, category } = req.body;
    article.title = title;

    article.description = description;
    article.summary = summary;
    article.body = body;
    article.category = category;
    article.image = image.name ? fileName : article.image;

    await article.save();
    return res.redirect("/dashboard");
  } catch (error) {
    res.render("admin/articles/edits", {
      path: "/admin/editArticle",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      article,
    });
    console.log(error);
  }
};

exports.slugArticle = async (req, res) => {
  try {
    const article = await Article.findOne({
      slug: req.params.slug,
    });
    if (article == null) res.redirect("/dashboard");
    res.render("admin/articles", {
      article,
      path: "/admin/addArticles",
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

  const image = req.files ? req.files.image : {};
  const fileName = `${shortId.generate()}_${image.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  let category = req.body.category ? req.body.category : null;

  try {
    req.body = { ...req.body, image };

    await sharp(image.data)
      .jpeg({ quality: 60 })
      .toFile(uploadPath)
      .catch((err) => {
        console.log(err);
      });

    const newArticle = await Article.create({
      title: req.body.title,
      slug: req.body.slug,
      summary: req.body.summary,
      description: req.body.description,
      body: req.body.body,
      category: category,
      image: fileName,
    });

    const articleCategoriesID = mongoose.Types.ObjectId(req.body.category);

    Category.findByIdAndUpdate(
      {
        _id: articleCategoriesID,
      },
      {
        $push: {
          articles: newArticle._id,
        },
      },
      {
        new: true,
        useFindAndModify: false,
      }
    )
      .then((docs) => {
        if (docs) {
          console.log({
            success: true,
            data: docs,
          });
        } else {
          console.log(
            console.log({
              success: false,
              data: docs,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });

    res.redirect("/dashboard");
  } catch (err) {
    res.render("admin/categories/new", {
      category: new Category(),
      pageTitle: "ساخت دسته بندی",
      path: "/admin/addArticles",
      layout: "./layouts/dashLayout",
      fullname: req.body.category,
      categories: Allcategory,
      errorArr: err,
    });
    console.log(err.message);
  }
};

exports.deleteArticle = async (req, res) => {
  try {
    console.log("da");
    await Article.findByIdAndRemove(req.params.id);
    res.redirect("/dashboard/articles/all");
  } catch (error) {
    res.render("errors/500", {
      pageTitle: "خطای سرور | 500",
      page: "/500",
      layout: "errors/500",
    });
    console.log(error);
  }
};

exports.uploadImage = (req, res) => {
  const upload = multer({
    limits: { fileSize: 4000000 },
    // dest: "uploads/",
    // storage: storage,
    fileFilter: fileFilter,
  }).single("image");
  //req.file
  // console.log(req.file)

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .send("حجم عکس ارسالی نباید بیشتر از 4 مگابایت باشد");
      }
      res.status(400).send(err);
    } else {
      if (req.files) {
        const fileName = `${shortId.generate()}_${req.files.image.name}`;
        await sharp(req.files.image.data)
          .jpeg({
            quality: 60,
          })
          .toFile(`./public/uploads/${fileName}`)
          .catch((err) => console.log(err));
        // res.json({"message" : "", "address" : ""});
        res.status(200).send(`http://localhost:3000/uploads/${fileName}`);
      } else {
        res.send("جهت آپلود باید عکسی انتخاب کنید");
      }
    }
  });
};
