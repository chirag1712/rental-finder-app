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

// image uploader with filetype validations
const imgUploader = (request, response) => {
    upload(request, response, (error) => {
        if (error) {
            return response.status(500).json({ success: false, code: error.code, message: error.message });
        } else if (!request.files) {
            return response.status(500).json('file not found');
        } else {
            response.status(200).json({
                success: true,
                message: 'Files uploaded successfully!'
            });
        }
    });
};

module.exports = imgUploader;