const mongoose = require("mongoose");

const errorReportSchema = new mongoose.Schema({
    brand_name: {
        type: String,
        required: [true, "Brand name is required !!"]
    },
    product_name: {
        type: String,
        required: [true, "Product name is required !!"]
    },
    product_image: {
        type: Map,
        required: [true, "Product image is required !!"]
    },
    store_and_location: {
        type: String,
        required: [true, "Store and Location is required !!"]
    },
    purchase_date: {
        type: String,
        required: [true, "Purchase date is required !!"]
    },
    store_pin_code: {
        type: String,
        required: [true, "Store pin code is required !!"]
    }
}, { timestamps: true });

const ErrorReport = mongoose.model("error_reports", errorReportSchema);
module.exports = ErrorReport;