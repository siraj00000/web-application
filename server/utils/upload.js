const fs = require("fs");
const ErrorResponse = require("./errorResponse");
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadImagesToCloudinary = (_file, next, folderName) => {
    return new Promise(async (resolve, reject) => {
        try {
            let imageUrlList = [];

            const isList = Array.isArray(_file);

            if (!isList) {
                verifyImageSizaAndtype(_file, next);
                const result = await uploadImage(_file, next, folderName);
                imageUrlList.push(result);

            } else {
                for (var i = 0; i < _file.length; i++) {
                    var file = _file[i];
                    verifyImageSizaAndtype(file, next);
                    const result = await uploadImage(file, next, folderName);
                    imageUrlList.push(result);
                }
            }

            if (imageUrlList.length !== 0) {
                resolve(imageUrlList);
            }
            else reject(0);

        } catch (error) {
            next(error);
        }
    });
};

const removeTmp = (path) => {
    fs.unlinkSync(path);
};

const uploadImage = (file, next, folderName) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(file.tempFilePath, { folder: folderName }, async (err, result) => {
            if (err) return next(new ErrorResponse("cloudinary error", 412));
            removeTmp(file.tempFilePath);
            resolve({ public_id: result.public_id, url: result.secure_url });
        });
    });
};

const verifyImageSizaAndtype = async (file, next) => {
    // 1024*1024 = 1mb
    // file must be less than 1mb
    if (file.size > 1024 * 1024) {
        removeTmp(file.tempFilePath);
        return next(new ErrorResponse("Size too large", 400));
    }
    
    // file format must be jpeg or png
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
        return next(new ErrorResponse("Incorrect file format", 400));
    }
};

const uploadVideoToCloudinary = (video, next, folderName) => {
    return new Promise(async (resolve, reject) => {
        // file format must be jpeg or png
        if (video.mimetype !== 'video/mp4') {
            return next(new ErrorResponse("Incorrect video file format", 400));
        }
        uploadVideo(video, folderName)
            .then(res => resolve(res))
            .catch(error => reject(error));
    });
};

const uploadVideo = (video, folderName) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(video.tempFilePath,
            {
                resource_type: "video",
                folder: folderName,
                chunk_size: 15000000,
                eager: [
                    { width: 300, height: 300 },
                    { width: 160, height: 100, gravity: "south" }],
                eager_async: true,
                eager_notification_url: "https://54.213.140.206/brands",
                notification_url: "https://54.213.140.206/brands"
            }, async (err, result) => {
                if (err) reject(err);
                removeTmp(video.tempFilePath);
                resolve({ public_id: result?.public_id, url: result?.secure_url });
            });
    });
};

const destroyImageFromCloudinary = (public_id) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(public_id, async (err, result) => {
            if (err) reject(err);
            resolve({ result });
        });
    });
};

module.exports = {
    uploadImagesToCloudinary,
    uploadVideoToCloudinary,
    destroyImageFromCloudinary,
    uploadWarrantyInvoiceImage: uploadImage
};