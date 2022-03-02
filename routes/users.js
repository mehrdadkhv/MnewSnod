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

// @desc forget-password
// @route GET /users/forget-password
router.get("/forget-password", userController.forgetPassword);

// @desc Reset Passwor Page
// @route GET /users/rest-password/:token
router.get("/reset-password/:token", userController.resetPassword);

// @desc Handle Forget Password
// @route POST /users/forget-password
router.post("/forget-password", userController.handleForgetPassword);

// @desc Handle reset Password
// @route POST /users/reset-password/:id
router.post("/reset-password/:id", userController.handleResetPassword);

// @desc forgetPassword page
// @route GET /users/register
router.get("/register", userController.register);

// @desc register Handle
// @route POST /users/register
router.post("/register", userController.createUser);

module.exports = router;
