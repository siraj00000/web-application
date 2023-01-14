const { Schema, model } = require("mongoose");

const brandSchema = new Schema({
    company_id: {
        type: String,
        required: [true, "Company doesn't found"],
    },
    company_name: {
        type: String,
        required: [true, 'Please provide a company name'],
        trim: true
    },
    brand: {
        type: String,
        required: [true, 'Please provide a brand name'],
        unique: true,
        trim: true
    },
    brand_active_status: {
        type: Boolean,
        default: false
    },
    // Landing page properties
    image_list: {
        type: Array,
        required: [true, 'Please upload atleast one image'],
    },
    video_url: {
        type: Map,
        default: null,
        trim: true
    },
    carousel_headings: {
        type: Array,
        default: null,
    },
    carousel_text: {
        type: Array,
        default: null,
    },
    product_description: {
        type: String,
        default: null,
    },
    // Survey
    authentication_feature: {
        type: String,
        required: [true, 'Please provide a authentication feature'],
        trim: true
    },
    warranty: {
        type: Boolean,
        default: false
    },
    request_help: {
        type: Boolean,
        default: false
    },
    survey_feature: {
        type: Boolean,
        default: false
    },
    survey_link: {
        type: String,
        default: null,
        trim: true
    },
    promo_code: {
        type: Boolean,
        default: false
    },
    referrals: {
        type: Boolean,
        default: false
    },
    re_order_link: {
        type: String,
        default: null,
        trim: true
    },
    email_support: {
        type: Boolean,
        default: false
    },
    email_id: {
        type: String,
        default: null,
    },
    call_support: {
        type: Boolean,
        default: false
    },
    call_no: {
        type: String,
        trim: true,
        default: null
    },
    whatsapp_support: {
        type: Boolean,
        default: false
    },
    whatsapp_number: {
        type: String,
        trim: true,
        default: null
    },
    instagram: {
        type: Boolean,
        default: false
    },
    insta_link: {
        type: String,
        default: null,
        trim: true
    },
    facebook: {
        type: Boolean,
        default: false
    },
    fb_link: {
        type: String,
        default: null,
        trim: true
    },
},
    {
        timestamps: true
    }
);

const Brand = model("brand", brandSchema);
module.exports = Brand;