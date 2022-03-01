const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");

const blogController = require("../controllers/blogController");

const router = new Router();

// @desc weblog index page
// @route GET
router.get("/", blogController.getIndex);

// @desc weblog article page
// @route GET /article/:id
router.get("/article/:id", blogController.getSingleArticle);

router.get("/demo", authenticated, blogController.getDemo);
router.get("/post/:id", blogController.getSinglePost);

module.exports = router;
