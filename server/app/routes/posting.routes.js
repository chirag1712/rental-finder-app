const posting = require("../controllers/posting.controller.js");
const express = require('express');
const router = express.Router();
const upload = require('../services/img_uploader.service.js');

// get postings based on given filters
router.post('/index', posting.indexPostingsValidation, posting.indexPostings)

// create a new Posting
router.post("/create", /*posting.createPostingValidation,*/ (request, response) => {
    upload(request, response, (error) => {
        if (error) {
            return response.status(500).json({ success: false, code: error.code, message: error.message });
        } else {
            posting.create(request, response);
        }
    });
});

router.get("/posting/:id", posting.showPosting)

module.exports = router;
