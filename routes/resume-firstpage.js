const { Router } = require("express");
const resumeController = require("../controllers/resumeController");

const router = new Router();

router.get("/", resumeController.getIndex);
module.exports = router;
