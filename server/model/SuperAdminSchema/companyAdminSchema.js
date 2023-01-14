const mongoose = require("mongoose");

const companyAdminSchema = new mongoose.Schema({
    company_email: {
        type: String,
        required: [true, 'Please provide a company email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            `Please fill valid email address`
        ],
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
        default: null,
        minlength: 10
    },
    phone_two: {
        type: Number,
        trim: true,
        default: null,
        minlength: 10
    },
    company_active_status: {
        type: Boolean,
        default: true
    },
    estaiblishment_year: {
        type: Date,
        required: [true, "Please provide company year of estaiblisment"]
    },
    sub_category: {
        type: Array,
        default: null
    }
},
    {
        timestamps: true,
    }
);

const CompanyAdmin = mongoose.model("company_admin", companyAdminSchema);
module.exports = CompanyAdmin;