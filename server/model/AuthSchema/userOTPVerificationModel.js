const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userOTPVerificationSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: [true, "Invalid User!"]
    },
    otp: {
        type: String,
        required: [true, "Invalid OTP"]
    },
    createdAt: Date,
    expiresAt: Date
});

// OTP Encrption
userOTPVerificationSchema.pre("save", async function (next) {
    if (!this.isModified("otp")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
});

// Compare requested and encrypted opt
userOTPVerificationSchema.methods.matchOTP = async function (opt) {
    return await bcrypt.compare(opt, this.otp);
};

const UserOTPVerification = mongoose.model("UserOTPVerification", userOTPVerificationSchema);
module.exports = UserOTPVerification;