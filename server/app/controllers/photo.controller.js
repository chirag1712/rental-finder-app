const Photo = require("../models/photo.model.js");
var aws = require("aws-sdk")
const util = require('util')

const upload = async (request, response) => {
    const file = request.file;
    console.log(file)
    const s3FileUrl = process.env.AWS_UPLOADED_FILE_URL_LINK;

    let s3bucket = new aws.S3({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    });

    var params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: file.originalname,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: "public-read"
    };

    const upload = util.promisify(s3bucket.upload).bind(s3bucket)
    
    try {
        const data = await upload(params);
        if (!data) {
            return response.status(401).json({ error: "Photo upload to s3 failed" });
        }
        console.log(data);

        // add image url to db
        const photo = new Photo({
            posting_id: request.body.posting_id,
            photo_url: s3FileUrl + file.originalname
        });
        const photo_id = await Photo.create(photo);
        
        return response.send({ id: photo_id });
    } catch(err) {
        console.log(err);
    }
};

module.exports = { upload }
