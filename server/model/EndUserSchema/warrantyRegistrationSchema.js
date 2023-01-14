const mongoose = require("mongoose");

const warrantyRegistrationSchema = new mongoose.Schema({
    ds1: {
        type: String,
        required: [true, "Unable to find the label !!"]
    },
    warranty_activated: {
        type: Boolean,
    },
    purchase_date: {
        type: String,
    },
    store_name_and_address: {
        type: String
    },
    store_pin_code: {
        type: String
    },
    warranty_duration: {
        type: String
    },
    invoice_number: {
        type: String
    },
    invoice_image: {
        type: Map
    },
    pincode: {
        type: String
    },
    address1: {
        type: String
    },
    address2: {
        type: String
    },
});

const Warranty = mongoose.model('warranty', warrantyRegistrationSchema);
module.exports = Warranty;