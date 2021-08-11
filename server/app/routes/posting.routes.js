const posting = require("../controllers/posting.controller.js");
const express = require('express');
const router = express.Router();
// const imgUploader = require('../services/img_uploader.service.js');

// get postings based on given filters
router.post('/index', posting.indexPostingsValidation, posting.indexPostings)

// create a new Posting
router.post("/create", /*imgUploader,*/ posting.create);

router.get("/posting/:id", posting.showPosting)

module.exports = router;
