const catchAsync = require("./../utils/catchAsync");
const { sendEmail } = require("./../utils/mailer");

exports.getIndex = catchAsync(async (req, res, next) => {
  res.render("resume/index", {
    pageTitle: " resume | علی خداوردی",
    layout: "./resume/index",
  });
});

exports.formResume = catchAsync(async (req, res, next) => {
  const { name, email, message } = req.body;

  sendEmail(
    email,
    name,
    "پیام از طرف وبلاگ",
    `${message} <br/> ایمیل کاربر : ${email}`
  );

  res.render("resume/index", {
    pageTitle: " resume | علی خداوردی",
    layout: "./resume/index",
  });
});
