exports.get404 = (req, res) => {
  res.render("errors/404", {
    pageTitle: "صفحه پیدا نشد| 404",
    page: "/404",
    layout: "errors/404",
  });
};
exports.get500 = (req, res) => {
  res.render("errors/500", {
    pageTitle: "خطای سرور | 500",
    page: "/500",
    layout: "errors/500",
  });
};
