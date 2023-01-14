const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: [true, "Please provide valid category"],
        trim: true,
        unique: true
    }
}, {
    timestamps: true
})


const Category = mongoose.model('category', categorySchema);
module.exports = Category