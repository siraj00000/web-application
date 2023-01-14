const OTPVerification = require("../../controller/EndUser/otpVerificationCtrl");

const OTPVerificationRouter = require("express").Router();

OTPVerificationRouter.post("/reqister-enduser", OTPVerification.reqisterEndUser)
    .post("/verify-otp", OTPVerification.verifyOTP)
    .post("/resend-otp", OTPVerification.resendOTP)
    .post("/login-enduser", OTPVerification.loginEndUser)

module.exports = OTPVerificationRouter;