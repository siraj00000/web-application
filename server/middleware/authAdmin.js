const User = require("../model/AuthSchema/userSchema");
const ErrorResponse = require("../utils/errorResponse");

const authAdmin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.user.id
        });
        if (user.role !== 1) return next(new ErrorResponse("Admin resources are denied", 400))
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = authAdmin;