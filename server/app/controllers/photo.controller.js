const Photo = require("../models/photo.model.js");
const uploadToS3 = require("../models/s3.js");

// used to add photos for existing postings
const upload = async (request, response) => {
    const files = request.files? request.files : [];
    const posting_id = request.body.posting_id
    const s3FileUrl = process.env.AWS_UPLOADED_FILE_URL_LINK;

    const photo_ids = [];
    const uploadPromises = files.map(async (file) => {
        try {
            var key = "posting_" + posting_id + "_" + new Date().toISOString() + "_" + file.originalname;
            const data = await uploadToS3(key, file);
            if (!data) {
                return response.status(401).json({ error: "Photo upload to s3 failed" });
            }

            // add image url to db
            const photo = new Photo({
                posting_id: posting_id,
                photo_url: s3FileUrl + key,
            });
            const photo_id = await Photo.create(photo);
            photo_ids.push(photo_id);
        } catch (err) {
            console.log(err);
            return response.status(500).send({ error: "Internal Error while uploading to s3" });
        }
    });
    await Promise.all([...uploadPromises]);

    console.log("photo_ids uploaded = ", photo_ids);
    return response.send({ photo_ids: photo_ids });
};

module.exports = { upload };
