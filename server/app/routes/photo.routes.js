const express = require('express');
const router = express.Router();
const photos = require("../controllers/photo.controller.js");
const imgUploader = require('../services/img_uploader.service.js');

// @route  POST api/photos/upload
// @desc   uploads a photo
// @access PRIVATE
router.post("/upload", imgUploader, photos.upload);

module.exports = router;
