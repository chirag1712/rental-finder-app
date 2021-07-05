const aws = require("aws-sdk");

let s3bucket = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
});

uploadToS3 = async (key, file) => {
    return new Promise((resolve, reject) => {
        var params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
            ACL: "public-read",
        };
        s3bucket.upload(params, (err, data) => {
            if (err) {
                console.log("error: ", error);
                reject(err);
            } else {
                console.log("uploaded to s3: ", data);
                resolve(data);
            }
        });
    });
}

module.exports = uploadToS3;
