const cloudinary = require('cloudinary').v2;
const fs = require("fs");
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadToCloudinary = async (locaFilePath) => {
    console.log('cloudinary.....');
    var mainFolderName = "main";
    // filePathOnCloudinary: path of image we want
    // to set when it is uploaded to cloudinary
    var filePathOnCloudinary =
        mainFolderName + "/" + locaFilePath;

    return cloudinary.uploader
        .upload(locaFilePath, { public_id: filePathOnCloudinary })
        .then((result) => {

            // Image has been successfully uploaded on
            // cloudinary So we dont need local image 
            // file anymore
            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);

            return {
                message: "Success",
                url: result.url,
            };
        })
        .catch((error) => {

            // Remove file from local uploads folder
            fs.unlinkSync(locaFilePath);
            return { message: "Fail" };
        });
};

module.exports = uploadToCloudinary;

