const AppError = require('./../utils/appError');


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

const sendError = (req, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err.message,
    message: err.message,
    stack: err.stack,
    pageTitle: "بخش مدیریت |ویرایش مقاله ",
  });
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  console.log(message);
  return new AppError(message, 400);
  
};

const sendErrorProd = (err, res) => {
  //oprational ,trust error : send message to client
  if (err.isOperation) {
    res.render("errors/500", {
      pageTitle: "صفحه پیدا نشد| 500",
      page: "/500",
      layout: "errors/500",
    });
    // Programming or other unknown error: don't leak error details
  } else {
    // 1) log error
    console.error("ERROR", err.message);
    // 2) send generic message
    res.status(500).render("errors/500", {
      status: "error",
      message: "Something went wrong !",
    });
  }
};

exports.global = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (err.code === 11000) err = handleDuplicateFieldsDB(err);


  if (process.env.NODE_ENV !== "development") {
    sendError(err, res);
  } else if (process.env.NODE_ENV !== "production") {
    sendErrorProd(err, res);
  }
};
