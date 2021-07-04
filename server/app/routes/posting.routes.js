const posting = require("../controllers/posting.controller.js");
const express = require('express');
const router = express.Router();

// get postings based on given filters
router.post('/index', posting.indexPostingsValidation, posting.indexPostings)

// create a new Posting
router.post("/create", posting.create);

module.exports = router;
