const fs = require("fs");

const multer = require("multer");
const sharp = require("sharp");
const shortId = require("shortid");
const appRoot = require("app-root-path");

const Blog = require("../models/Blog");
const Post = require("../models/Post");
const { formatDate } = require("../utils/jalali");
const { get500 } = require("../controllers/errorController");
const { fileFilter } = require("../utils/multer");
const Category = require("../models/Category");
const Article = require("../models/Article");

exports.getDashboard = async (req, res) => {
  const page = +req.query.page || 1;
  const postPerPage = 10;
  const category = await Category.find({});

  try {
    const numberOfPosts = await Blog.find({
      user: req.user._id,
    }).countDocuments();
    const blogs = await Blog.find({ user: req.user.id })
      .skip((page - 1) * postPerPage)
      .limit(postPerPage);

    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
    );

    res.render("admin/homeDashboard", {
      pageTitle: "Admin Dashboard",
      path: "/dashboard",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      blogs,
      formatDate,
      currentPage: page,
      nextPage: page + 1,
      previousPage: page - 1,
      hasNextPage: postPerPage * page < numberOfPosts,
      hasPreviousPage: page > 1,
      lastPage: Math.ceil(numberOfPosts / postPerPage),
      categories: category,
    });
  } catch (error) {
    console.log(error);
    get500(req, res);
  }
};

exports.getAddPost = (req, res) => {
  res.render("admin/addPost", {
    pageTitle: "Admin Add Post",
    path: "/admin/addPost",
    layout: "./layouts/dashLayout",
    fullname: req.user.fullname,
  });
};

exports.createPost = async (req, res) => {
  const errorArr = [];

  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  try {
    req.body = { ...req.body, thumbnail };

    await Blog.postValidation(req.body);
    res.redirect("/dashboard");
    await sharp(thumbnail.data)
      .jpeg({ quality: 60 })
      .toFile(uploadPath)
      .catch((err) => console.log(err));

    await Blog.create({
      ...req.body,
      user: req.user.id,
      thumbnail: fileName,
    });
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    res.render("admin/addPost", {
      pageTitle: "Admin Add Post",
      path: "/admin/addPost",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      errors: errorArr,
    });
  }
};

exports.getAddPostNews = (req, res) => {
  res.render("admin/addPostNews", {
    pageTitle: "News create Post",
    path: "/admin/addPostNews",
    layout: "./layouts/dashLayout",
    fullname: req.user.fullname,
  });
};

exports.createPostNews = async (req, res) => {
  const errorArr = [];

  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  try {
    req.body = { ...req.body, thumbnail };
    await Post.postValidation(req.body);
    res.redirect("/dashboard");
    await sharp(thumbnail.data)
      .jpeg({ quality: 60 })
      .toFile(uploadPath)
      .catch((err) => console.log(err));

    const newPost = await Post.create({
      ...req.body,
      user: req.user.id,
      thumbnail: fileName,
    });
    await Post.updateMany(
      { _id: newPost.categories },
      { $push: { products: newPost._id } }
    );
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    res.render("admin/addPostNews", {
      pageTitle: "News create Post",
      path: "/admin/addPostNews",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      errors: errorArr,
    });
  }
};

exports.getEditPost = async (req, res) => {
  const post = await Blog.findOne({
    _id: req.params.id,
  });

  if (!post) {
    return res.redirect("errors/404");
  }

  if (post.user.toString() != req.user._id) {
    return res.redirect("/dashboard");
  } else {
    res.render("admin/editPost", {
      pageTitle: "بخش مدیریت | ویرایش پست",
      path: "/dashboard/edit-post",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      post,
    });
  }
};

exports.editPost = async (req, res) => {
  const errorArr = [];
  const thumbnail = req.files ? req.files.thumbnail : {};
  const fileName = `${shortId.generate()}_${thumbnail.name}`;
  const uploadPath = `${appRoot}/public/uploads/thumbnails/${fileName}`;

  const post = await Blog.findOne({ _id: req.params.id });
  try {
    if (thumbnail.name) await Blog.postValidation({ ...req.body, thumbnail });
    else
      await Blog.postValidation({
        ...req.body,
        thumbnail: {
          name: "placeholder",
          size: 0,
          mimetype: "image/jpeg",
        },
      });

    if (!post) {
      return res.redirect("errors/404");
    }

    if (post.user.toString() != req.user._id) {
      return res.redirect("/dashboard");
    } else {
      if (thumbnail.name) {
        fs.unlink(
          `${appRoot}/public/uploads/thumbnails/${post.thumbnail}`,
          async (err) => {
            if (err) console.log(err);
            else {
              await sharp(thumbnail.data)
                .jpeg({ quality: 60 })
                .toFile(uploadPath)
                .catch((err) => console.log(err));
            }
          }
        );
      }
      const { title, status, body } = req.body;
      post.title = title;
      post.status = status;
      post.body = body;
      post.thumbnail = thumbnail.name ? fileName : post.thumbnail;

      await post.save();
      return res.redirect("/dashboard");
    }
  } catch (err) {
    console.log(err);
    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    res.render("admin/editPost", {
      pageTitle: "بخش مدیریت | ویرایش پست",
      path: "/dashboard/edit-post",
      layout: "./layouts/dashLayout",
      fullname: req.user.fullname,
      errors: errorArr,
      post,
    });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const result = await Blog.findByIdAndRemove(req.params.id);
    console.log(result);
    res.redirect("/dashboard");
  } catch (err) {
    console.log(err);
    return res.render("errors/500");
  }
};

exports.uploadImage = (req, res) => {
  const upload = multer({
    limits: { fileSize: 4000000 },
    fileFilter: fileFilter,
  }).single("image");

  //req.file
  // console.log(req,file);

  upload(req, res, async (err) => {
    if (err) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(400)
          .send("حجم تصویر ارسالی نباید بیشتر از 4 مگابایت باشد");
      }
      res.status(400).send(err);
    } else {
      if (req.file) {
        console.log(req.file);
        const fileName = `${shortId.generate()}_${req.file.originalname}`;
        await sharp(req.file.buffer)
          .toFormat("jpeg")
          .jpeg({ quality: 60 })
          .toFile(`./public/uploads/${fileName}`)
          .catch((err) => console.log(err));

        await res.status(200).send(`http://localhost:3000/uploads/${fileName}`);
      } else {
        res.send("برای آپلود تصویر معتبر انتخاب کنید ");
      }
    }
  });
};

exports.handleDashSearch = async (req, res) => {
  try {
    const page = +req.query.page || 1; //string to number
    const articlePrePage = 10;

    const numberOfArticle = await Article.find({
      $text: { $search: req.body.search },
    }).countDocuments();

    const article = await Article.find({
      $text: { $search: req.body.search },
    })
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
  } catch (err) {
    const category = await Category.find({});

    console.log(err);
    res.render("admin/includes/keinArticle.ejs", {
      pageTitle: "خطای سرور | 500",
      layout: "./layouts/dashLayout",
      path: "/500",
      categories: category,
    });
  }
};
