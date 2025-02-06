// External Imports
const express = require("express");

// Internal Imports
const { getLogin } = require("../controller/loginController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");

const router = express.Router();

// Login page
router.get("/",decorateHtmlResponse("Login"), getLogin);

module.exports = router;
