const multer = require("multer");
const uuid = require("uuid").v4;

exports.storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/uploads/");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, `${uuid()}_${file.originalname}`);
  },
});

exports.fileFilter = (req, file, cb) => {
  const fileTypes = /jpeg|jpg|png|gif/;
  const mimetype = fileTypes.test(file.mimetype);
  if (mimetype) {
    cb(null, true);
  } else {
    cb("خطا: فایل باید یک تصویر معتبر باشد", false);
  }
};
