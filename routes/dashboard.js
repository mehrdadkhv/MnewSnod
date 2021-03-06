const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");
const authController = require("../controllers/authController");

const adminController = require("../controllers/adminController");
const articleController = require("../controllers/articleController");
const categoryController = require("../controllers/categoryController");

const router = new Router();

//@desc dashboard.
//@route GET /dashboard
router.get(
  "/",
  authController.authenticated,
  authController.restricTo("admin"),
  adminController.getDashboard
);

//@desc get post.
//@route GET /dashboard/add-post
router.get("/add-post", authenticated, adminController.getAddPost);
router.get("/add-post-news", authenticated, adminController.getAddPostNews);

//  @desc   Dashboard Edit Post
//  @route  GET /dashboard/edit-post/:id
router.get("/edit-post/:id", authenticated, adminController.getEditPost);

//  @desc   Dashboard delete Post
//  @route  GET /dashboard/delete-post/:id
router.get("/delete-post/:id", authenticated, adminController.deletePost);

//@desc create post.
//@route POST /dashboard/add-post
router.post("/add-post", authenticated, adminController.createPost);
router.post("/add-post-news", authenticated, adminController.createPostNews);

//@desc dashboard post edit.
//@route POST /dashboard/edit-post/:id
router.post("/edit-post/:id", authenticated, adminController.editPost);

//@desc dashboard image-upload.
//@route POST /dashboard/image-upload
// router.post("/image-upload", authenticated, adminController.uploadImage);

// @desc Handle serach
// @route Article /serach
router.post("/search", adminController.handleDashSearch);

//categories

router.get("/categories", categoryController.getCategory);
router.post("/categories", categoryController.sotreCategory);
// router.get("/categories/new", categoryController.createCategory);
router.get("/categories/edit/:id", categoryController.editCategory);
router.get("/categories/:slug", categoryController.slugCategory);
router.post("/categories/update/:id", categoryController.updateCategory);
router.get("/categories-del/:id", categoryController.deleteCategory);

//articles
// article routes
router.get("/articles/all", articleController.getArticles);
router.get("/add-article", articleController.createArticle);
router.post("/add-article", articleController.storeArticle);

router.get("/article/:slug", articleController.slugArticle);
router.post("/image-article", authenticated, articleController.uploadImage);
router.get("/edit-article/:id", articleController.getEditArticle);
router.post("/edit-article/:id", articleController.editArticle);
// router.get("/articles/:slug", articleController.slugArticle);
router.get("/articles/:id", articleController.deleteArticle);

module.exports = router;
