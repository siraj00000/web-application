const User = require("../model/AuthSchema/userSchema");
const ErrorResponse = require("../utils/errorResponse");

const authCompanyAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.user.id
        });
        if (user.role !== 2) return next(new ErrorResponse("Admin resources are denied !", 400));
        next();
    } catch (error) {
        next(error);
    }
};

const authManufacturerAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.user.id
        });
        if (user.role !== 3) return next(new ErrorResponse("Admin resources are denied !!", 400));
        next();
    } catch (error) {
        next(error);
    }
};

const combineAuth = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.user.id
        });
        if (user.role !== 2 && user.role !== 3) return next(new ErrorResponse("Admin resources are denied ! ! !", 400));
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { authManufacturerAdmin, authCompanyAdmin, combineAuth };