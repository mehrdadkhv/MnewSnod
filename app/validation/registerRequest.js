const validator = require("./validator");
const { check } = require("express-validator");

class registerValidator extends Validator {
  handle() {
    return [
      check("name")
        .not()
        .isEmpty()
        .withMessage("فیلد نام نمیتواند خالی باشد")
        .isLength({ min: 5 })
        .withMessage("فیلد نام نمیتواند کمتر از 5 کاراکتر بماند"),
    ];
  }
}
