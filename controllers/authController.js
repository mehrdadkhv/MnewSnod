exports.restricTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      req.flash("error", "شما مجاز به درسترسی این بخش نیستید");
      res.redirect("/users/login");
    }
    next();
  };
};

exports.authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/404");
};
