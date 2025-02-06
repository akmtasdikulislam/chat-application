// External Imports
const express = require("express");

// Internal Imports
const { getUsers } = require("../controller/usersController");
const decorateHtmlResponse = require("../middlewares/common/decorateHtmlResponse");
const router = express.Router();

// Login page
router.get("/", decorateHtmlResponse("Users"), getUsers);

module.exports = router;
