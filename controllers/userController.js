// const bcrypt = require("bcrypt");
const passport = require("passport");
const fetch = require("node-fetch");
const { sendEmail } = require("../utils/mailer");

const User = require("../models/user");

exports.login = (req, res) => {
  res.render("login", {
    path: "/login",
    pageTitle: "ورود به بخش ",
    message: req.flash("success_msg"),
    layout: "./layouts/masterLayouts",
    error: req.flash("error"),
  });
};

exports.handleLogin = async (req, res, next) => {
  if (!req.body["g-recaptcha-response"]) {
    req.flash("error", "اعتبار سنجی captcha الزامی می باشد");
    return res.redirect("/users/login");
  }

  const secretKey = process.env.CAPTCHA_SECRET;
  const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}
  &remoteip=${req.connection.remoteAddress}`;

  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
  });

  const json = await response.json();

  if (json.success) {
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: true,
    })(req, res, next);

    // send welcome email
    sendEmail(req.body.email, req.body.email, "خوش آمدی", "خوش برگشتی");

    // const userFullName = console.log(req);
    // sendEmail(req, res, next);
  } else {
    req.flash("error", "مشکل در اعتبار سنجی captcha هست");
    res.redirect("/users/login");
  }
};

exports.rememberMe = (req, res) => {
  if (req.body.remember) {
    req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000; // 1 day 24
  } else {
    req.session.cookie.expire = null;
  }

  res.redirect("/dashboard");
};

exports.logout = (req, res) => {
  req.session = null;
  req.logout();
  res.redirect("/users/login");
};

exports.register = (req, res) => {
  res.render("register", {
    path: "/register",
    pageTitle: "ثبت نام کاربر جدید",
  });
};

exports.createUser = async (req, res) => {
  const errors = [];
  try {
    await User.userValidation(req.body);
    const { fullname, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      errors.push({ message: "این ایمیل قبلا استفاده شده" });
      return res.render("register", {
        pageTitle: "ثبت نام  کاربر",
        path: "/register",
        errors,
      });
    }

    await User.create({ fullname, email, password });
    req.flash("success_msg", "ثبت نام موفقیت امیز بود");
    res.redirect("/users/login");
  } catch (err) {
    console.log(err);
    err.inner.forEach((e) => {
      errors.push({
        name: e.path,
        message: e.message,
      });
    });
    return res.render("register", {
      pageTitle: "ثبت نام  کاربر",
      path: "/register",
      errors,
    });
  }
};
