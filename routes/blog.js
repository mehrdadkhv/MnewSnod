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

// @desc weblog Contact page
// @route GET /contact
router.get("/contact", blogController.getContactPage);

// @desc weblog Contact page
// @route GET /captcha.png
router.get("/captcha.png", blogController.getCaptcha);

// @desc Handle Contact page
// @route Post /contact
router.post("/contact", blogController.handleContactPage);

router.get("/demo", authenticated, blogController.getDemo);
router.get("/post/:id", blogController.getSinglePost);

module.exports = router;
