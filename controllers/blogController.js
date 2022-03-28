const Yup = require("yup");
const captchapng = require("captchapng");
const Blog = require("../models/Blog");
const Article = require("../models/Article");
const { formatDate } = require("../utils/jalali");
const { truncate } = require("../utils/helpers");
const { sendEmail } = require("../utils/mailer");
const Category = require("../models/Category");

let CAPTCHA_NUM;

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

    const filter = { view: { $gte: 20 } };
    const categoryFilter = { category: "syasy" };

    const mostViewedArticlesTwo = await Article.aggregate([
      { $match: filter },
      {
        $limit: 2,
      },
    ]);
    const mostViewedArticles = await Article.aggregate([
      {
        $sort: { view: -1 },
      },
      {
        $limit: 6,
      },
    ]);

    const foundCategoryPolic = await Category.findOne({ title: "اقتصاد" });
    const policArticke = await Article.find({
      category: foundCategoryPolic.id,
    })
      .sort("-createdAt")
      .limit(3);

    const policArtickeOne = await Article.find({
      category: foundCategoryPolic.id,
    })
      .sort("-view")
      .limit(1);

    const foundCategoryBusiness = await Category.findOne({ title: "اقتصاد" });
    const businessArticle = await Article.find({
      category: foundCategoryBusiness.id,
    })
      .sort("-view")
      .limit(1);

    const foundCategorySoport = await Category.findOne({ title: "ورزش" });
    const sportArticle = await Article.find({
      category: foundCategorySoport.id,
    })
      .sort("-view")
      .limit(1);

    const sportArticles = await Article.find({
      category: foundCategorySoport.id,
    })
      .sort("-createdAt")
      .limit(3);

  
    res.render("index", {
      pageTitle: " MNews | صفحه اصلی",
      path: "/",
      posts,
      formatDate,
      truncate,
      LastArticles,
      LastArticle,
      policArticke,
      mostViewedArticles,
      mostViewedArticlesTwo,
      policArtickeOne,
      businessArticle,
      sportArticle,
      sportArticles,
    });
  } catch (err) {
    console.log(err);
    res.render("errors/500");
  }
};

exports.getSingleArticle = async (req, res) => {
  try {
    const article = await Article.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { $inc: { view: 1 } },
      { new: true }
    ).populate("category");

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

exports.getContactPage = (req, res) => {
  res.render("contact", {
    pageTitle: "تماس با ما",
    path: "/contact",
    message: req.flash("success_msg"),
    error: req.flash("error_msg"),
    error: [],
  });
};
exports.handleContactPage = async (req, res) => {
  const errorArr = [];

  const { fullname, email, message, captcha } = req.body;

  const schema = Yup.object().shape({
    fullname: Yup.string().required("نام و نام خانوادگی الزامی می باشد"),
    email: Yup.string()
      .email("آدرس ایمیل صحیح نیست")
      .required("آدرس ایمیل الزامی می باشد"),
    message: Yup.string().required("پیام اصلی الزامی می باشد"),
  });

  try {
    await schema.validate(req.body, { abortEarly: false });

    if (parseInt(captcha) === CAPTCHA_NUM) {
      sendEmail(
        email,
        fullname,
        "پیام از طرف وبلاگ",
        `${message} <br/> ایمیل کاربر : ${email}`
      );

      req.flash("success_msg", "پیام شما با موفقیت ارسال شد");

      return res.render("contact", {
        pageTitle: "تماس با ما",
        path: "/contact",
        message: req.flash("success_msg"),
        error: req.flash("error"),
        errors: errorArr,
      });
    }

    req.flash("error", "کد امنیتی صحیح نیست");

    res.render("contact", {
      pageTitle: "تماس با ما",
      path: "/contact",
      message: req.flash("success_msg"),
      error: req.flash("error"),
      errors: errorArr,
    });
  } catch (err) {
    err.inner.forEach((e) => {
      errorArr.push({
        name: e.path,
        message: e.message,
      });
    });
    res.render("contact", {
      pageTitle: "تماس با ما",
      path: "/contact",
      message: req.flash("success_msg"),
      error: req.flash("error"),
      errors: errorArr,
    });
  }
};

exports.getCaptcha = (req, res) => {
  CAPTCHA_NUM = parseInt(Math.random() * 9000 + 1000);
  const p = new captchapng(80, 30, CAPTCHA_NUM);
  p.color(0, 0, 0, 0);
  p.color(80, 80, 80, 255);

  const img = p.getBase64();
  const imgBase64 = Buffer.from(img, "base64");

  res.send(imgBase64);
};
