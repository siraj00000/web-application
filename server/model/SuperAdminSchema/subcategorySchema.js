const { Schema, model } = require("mongoose")

const subcategorySchema = new Schema({
    parent_category_id: {
        type: String,
        required: [true, "Please provide valid category for sub-category"],
    },
    category_name: {
        type: String,
        required: [true, "Please provide valid category name for sub-category"],
    },
    sub_category: {
        type: String,
        required: [true, 'Please provide a sub category'],
        trim: true
    },
    sub_category_active_status: {
        type: Boolean,
        default: true
    },
    feature: {
        type: Array,
    },
}, {
    timestamps: true
})

const SubCategory = model("sub_category", subcategorySchema);
module.exports = SubCategory

