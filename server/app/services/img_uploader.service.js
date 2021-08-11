const multer = require("multer");
const path = require("path");

// file type filtering based on extension and mimetype
const imageTypeFilter = function (request, file, callback) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png'];
    const allowedMimes = ['image/jpg', 'image/jpeg', 'image/png'];
    const fileExt = path.extname(file.originalname).toLowerCase();

    if (allowedMimes.includes(file.mimetype) && allowedExtensions.includes(fileExt)) {
        callback(null, true);
    } else {
        callback({
            success: false,
            message: 'Invalid file type. Only jpg, png image files are allowed.'
        }, false);
    }
};

// multer options
const obj = {
    storage: multer.memoryStorage(),
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit on each file
    fileFilter: imageTypeFilter
}

// multer setup
const upload = multer(obj).any("file");

module.exports = upload;