const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const EndUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please provide a email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            `Please fill valid email address`
        ],
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: 6,
        select: true
    },
    phone: {
        type: String,
        required: [true, "Phone number is required"],
        minlength: 10
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});


// Password Encrption
EndUserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Compare requested and encrypted password
EndUserSchema.methods.matchPasswords = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// JsonWebToken
EndUserSchema.methods.getSignedJwtToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
};

// To reset password
EndUserSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * (60 * 1000);

    return resetToken;
}

const EndUser = mongoose.model('Visitors', EndUserSchema);
module.exports = EndUser;