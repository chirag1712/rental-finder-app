const express = require('express');
const router = express.Router();
const photos = require("../controllers/photo.controller.js");
const upload = require('../services/img_uploader.service.js');

// @route  POST api/photos/upload
// @desc   uploads a photo
// @access PRIVATE
router.post("/upload", (request, response) => {
    upload(request, response, (error) => {
        if (error) {
            return response.status(500).json({ success: false, code: error.code, message: error.message });
        } else {
            photos.upload(request, response);
        }
    });
});

module.exports = router;
