const catchAsync = require("./../utils/catchAsync");

exports.getIndex = catchAsync(async (req, res, next) => {
  res.render("resume/index", {
    pageTitle: " resume | علی خداوردی",
    layout: "./resume/index",
  });
});
