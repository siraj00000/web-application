const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: [true, "Please provide the product"],
        unique: true,
        trim: true
    },
    company: {
        type: String,
        required: [true, "Please select company"],
    },
    variant_type: {
        type: String,
        required: [true, "Please provide a variant type"],
        trim: true
    },
    variants: {
        type: Array,
    },
    brand: {
        type: String,
        default: null
    },
    category: {
        type: String,
        default: null
    },
    sub_category: {
        type: String,
        default: null
    },
    image_list: {
        type: Array,
        default: null
    },
    video_url: {
        type: Map,
        default: null,
        trim: true
    },
    carousel_headings: {
        type: Array,
        default: null
    },
    carousel_text: {
        type: Array,
        default: null
    },
    product_description: {
        type: String,
        default: null,
    },
    general_warranty_duration: {
        type: String,
        default: null
    },
    special_warranty_type: {
        type: String,
        default: null
    },
    special_warranty_duration: {
        type: String,
        default: null
    },
    free_brand_maintenance_duration: {
        type: String,
        default: null,
    },
    one_click_reorder_feature: {
        type: Boolean,
        default: false
    },
    reorder_link: {
        type: String,
        default: null
    },
    survey_feature: {
        type: Boolean,
        default: false
    },
    survey_link: {
        type: String,
        default: null
    },
    feature: {
        type: Map,
        default: null
    },
}, {
    timestamps: true
});

const Product = mongoose.model('Company/product', productSchema);
module.exports = Product;