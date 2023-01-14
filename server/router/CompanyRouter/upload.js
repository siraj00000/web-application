const ErrorResponse = require("../../utils/errorResponse");
const { uploadImagesToCloudinary, uploadVideoToCloudinary } = require("../../utils/upload");

const uploadRouter = require("express").Router();

uploadRouter.post('/upload', async (req, res, next) => {
    try {
        file = req.files?.image;
        video = req.files?.video;

        // images upload
        if (file) {
            const result = await uploadImagesToCloudinary(file, next, 'Company');
            if (!result || result === 0) return next(new ErrorResponse('Image not uploaded!', 404));
            req.body["images"] = result;
        }

        if (video) {
            const videoUploadRes = await uploadVideoToCloudinary(video, next, 'Company');
            if (!videoUploadRes || videoUploadRes === 0) return next(new ErrorResponse('Video not uploaded!', 404));
            req.body["video_url"] = videoUploadRes;
        }
        res.status(201).json({
            msg: 'uploaded',
            result: req.body
        });

    } catch (error) {
        next(error);
    }
});

module.exports = uploadRouter;