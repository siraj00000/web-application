const { Schema, model } = require("mongoose");

const manufacturerAdminSchema = new Schema({
    manufacturer_email: {
        type: String,
        required: [true, 'Please provide a company email'],
        unique: true,
        match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            `Please fill valid email address`
        ],
    },
    manufacturer: {
        type: String,
        required: [true, 'Please provide a manufacturer name'],
        trim: true,
        unique: true
    },
    company_id: {
        type: String,
        required: [true, "Company doesn't found"],
    },
    company_name: {
        type: String,
        required: [true, 'Please provide a company name'],
        trim: true
    },
    pincode: {
        type: Number,
        required: [true, "Please provide a pincode"],
        minlength: 5,
    },
    registered_address: {
        type: String,
        default: null
    },
    phone_one: {
        type: Number,
        trim: true,
        default: null
    },
    phone_two: {
        type: Number,
        trim: true,
        default: null
    },
    manufacturer_active_status: {
        type: Boolean,
        default: true
    },
}, {
    timestamps: true
});

const ManufacturerAdmin = model("manufacturer_admin", manufacturerAdminSchema);
module.exports = ManufacturerAdmin;