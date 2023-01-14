const jwt = require('jsonwebtoken');
const User = require("../../model/AuthSchema/userSchema");
const ErrorResponse = require("../../utils/errorResponse");

const authProtectionRouter = require("express").Router();

authProtectionRouter
    .get('/protect-auth', async (req, res, next) => {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return next(new ErrorResponse("Not authorized to access this route", 401));
        }
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            const user = await User.findById(decoded.id)

            if (!user) {
                return next(new ErrorResponse("No user found with this id", 404));
            }

            res.status(200).json({ user });
        } catch (error) {
            next(new ErrorResponse("Not authorized to access this route", 401));
        }   
    });

module.exports = authProtectionRouter;