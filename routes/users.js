const { Router } = require("express");

const userController = require("../controllers/userController");
const { authenticated } = require("../middlewares/auth");

const router = new Router();

// @desc login page
// @route GET /users/login
router.get("/login", userController.login);

// @desc login handle
// @route GET /users/login
router.post("/login", userController.handleLogin, userController.rememberMe);

// @desc logout handle
// @route GET /users/logout
router.get("/logout", authenticated, userController.logout);

// @desc register page
// @route GET /users/register
router.get("/register", userController.register);

// @desc register Handle
// @route POST /users/register
router.post("/register", userController.createUser);

module.exports = router;
