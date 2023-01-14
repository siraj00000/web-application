const EndUser = require("../../model/AuthSchema/endUserSchema");
const UserOTPVerification = require("../../model/AuthSchema/userOTPVerificationModel");
const ErrorResponse = require("../../utils/errorResponse");
const sendEmail = require("../../utils/sendEmail");

const OTPVerification = {
    reqisterEndUser: async (req, res, next) => {
        try {
            let { email, password, phone } = req.body;
            const newEndUser = new EndUser({ email, password, phone });
            const result = await newEndUser.save();
            sendOTPVerificationEmail(result, res, next);
        } catch (error) {
            next(error);
        }
    },
    verifyOTP: async (req, res, next) => {
        try {
            const { user_id, otp } = req.body;
            if (!user_id || !otp) return next(new ErrorResponse("Empty otp detail are not allowed", 400));

            const userOTPVerificationRecords = await UserOTPVerification.find({ user_id });

            if (userOTPVerificationRecords.length <= 0) {
                return next(new ErrorResponse("Account record doesn't exist or has been verified already, Please Sign up or login", 400));
            }
            const { expiresAt } = userOTPVerificationRecords[0];
            if (expiresAt < Date.now()) {
                // user record otp has expired
                await UserOTPVerification.deleteMany({ user_id });
                return next(new ErrorResponse("Code has expired. Please request again", 400));
            }

            const isMatch = await userOTPVerificationRecords[0].matchOTP(otp);
            if (!isMatch) return next(new ErrorResponse("Invalid OTP.", 401));

            // Success
            await EndUser.updateOne({ _id: user_id }, { verified: true });
            await UserOTPVerification.deleteMany({ user_id });

            res.status(200).json({
                success: true,
                msg: "User email verified successfully."
            });
        } catch (error) {
            next(error);
        }
    },
    resendOTP: async (req, res, next) => {
        try {
            const { user_id, email } = req.body;
            if (!user_id || !email) return next(new ErrorResponse("Empty otp detail are not allowed", 400));

            // deleting existing record and resend
            await UserOTPVerification.deleteMany({ user_id });
            sendOTPVerificationEmail({ _id: user_id, email }, res, next);

        } catch (error) {
            next(error);
        }
    },
    loginEndUser: async (req, res, next) => {
        try {
            const { email, password } = req.body;
            if (!email || !password) return next(new ErrorResponse("Please provide email and password.", 401));

            const endUser = await EndUser.findOne({ email }).select("+password");
            if (!endUser) return next(new ErrorResponse("Invalid Credentials.", 401));

            if (!endUser.verified) {
                await EndUser.deleteMany({ _id: endUser._id });
                return next(new ErrorResponse("Invalid user. Please sign in again", 401));
            }
            const isMatch = await endUser.matchPasswords(password);
            if (!isMatch) return next(new ErrorResponse("Invalid Credentials.", 401));;

            sendToken(endUser, 200, res);

        } catch (error) {
            next(error);
        }
    },
};

const sendOTPVerificationEmail = async ({ _id, email }, res, next) => {
    try {
        let otp = Math.floor(1000 + Math.random() * 9000);

        const message = `
            <h1>OTP Verification</h1>
            <p>Enter ${otp} to get verified</p>
        `;

        const newOTPVerification = await new UserOTPVerification({
            user_id: _id,
            otp,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOTPVerification.save();
        sendEmail({
            to: email,
            subject: "Email OTP verification",
            text: message
        });
        res.status(200).json({
            success: true, status: "pending",
            data: {
                user_id: _id,
                email
            }
        });

    } catch (error) {
        next(error);
    }
};

const sendToken = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();
    let userInfo = { role: user.role };
    res.status(statusCode).json({ success: true, token, userInfo });
};

module.exports = OTPVerification;