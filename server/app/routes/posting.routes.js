const posting = require("../controllers/posting.controller.js");
const express = require('express');
const router = express.Router();

// create a new Posting
router.post("/create", posting.create);

module.exports = router;