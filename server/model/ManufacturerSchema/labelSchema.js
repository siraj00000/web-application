const mongoose = require("mongoose");

const LabelSchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: [true, "Manufacturer's company does not found !!"]
    },
    manufacture_id: {
        type: String,
        required: [true, "Manufacturer does not found !!"],
    },
    brand_id: {
        type: String,
        required: [true, "Brand does not found !!"]
    },
    product_id: {
        type: String,
        required: [true, "Product does not found !!"]
    },
    variant: {
        type: Array,
        required: [true, "Product variant does not found !!"]
    },
    plant_name: {
        type: String,
        default: null
    },
    batch_number: {
        type: String,
        required: [true, "Batch number does not found !!"]
    },
    serial_number: {
        type: Number,
        required: [true, "Serial number does not found !!"]
    },
    tag_number: {
        type: String,
        required: [true, "Tag number does not found !!"]
    },
    tag_active: {
        type: Boolean,
        default: true
    },
    DS1: {
        type: Array,
        required: [true, "DS1 does not found !!"]
    },
    DS2: {
        type: Array,
        required: [true, "DS1 does not found !!"]
    },
    shortDS1: {
        type: Array,
        required: [true, "Short DS1 count does not found !!"],
    },
    shortDS2: {
        type: Array,
        required: [true, "Short DS2 count does not found !!"]
    },
    owner_mobile: {
        type: String,
        default: null
    }
},
    {
        timestamps: true
    }
);

const Label = mongoose.model('manufacturer/label', LabelSchema);
module.exports = Label;