const posting = require("../controllers/posting.controller.js");
const express = require('express');
const router = express.Router();
const multer = require("multer");

// multer setup
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// get postings based on given filters
router.post('/index', posting.indexPostingsValidation, posting.indexPostings)

// create a new Posting
router.post("/create", upload.any("file"), posting.create);

module.exports = router;
