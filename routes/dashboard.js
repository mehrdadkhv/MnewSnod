const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");
const authController = require("../controllers/authController");

const adminController = require("../controllers/adminController");

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

//  @desc   Dashboard Edit Post
//  @route  GET /dashboard/edit-post/:id
router.get("/edit-post/:id", authenticated, adminController.getEditPost);

//  @desc   Dashboard delete Post
//  @route  GET /dashboard/delete-post/:id
router.get("/delete-post/:id", authenticated, adminController.deletePost);

//@desc create post.
//@route POST /dashboard/add-post
router.post("/add-post", authenticated, adminController.createPost);

//@desc dashboard post edit.
//@route POST /dashboard/edit-post/:id
router.post("/edit-post/:id", authenticated, adminController.editPost);

//@desc dashboard image-upload.
//@route POST /dashboard/image-upload
router.post("/image-upload", authenticated, adminController.uploadImage);

module.exports = router;
