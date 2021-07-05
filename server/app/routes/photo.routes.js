const express = require('express');
const router = express.Router();
const multer = require("multer");

const photos = require("../controllers/photo.controller.js");

// multer setup
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });

// @route  POST api/photos/upload
// @desc   uploads a photo
// @access PRIVATE
router.post("/upload", upload.array("file"), photos.upload);

module.exports = router;
