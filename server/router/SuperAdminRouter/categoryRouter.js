const categoryRouter = require("express").Router();
const { protect } = require("../../middleware/auth");
const authAdmin = require("../../middleware/authAdmin");
const {
    fetchCategory,
    insertCategory,
    deleteCategory,
    updateCategory,
    generateCSV,
    fetchSpecificCategory
} = require("../../controller/SuperAdminCtrl/categoryCtrl");

categoryRouter.get('/category', protect, fetchCategory);
categoryRouter.get('/category/:id', protect, authAdmin, fetchSpecificCategory);
categoryRouter.post('/insert-category', protect, authAdmin, insertCategory);
categoryRouter.delete('/delete-category/:id', protect, authAdmin, deleteCategory);
categoryRouter.put('/update-category/:id', protect, authAdmin, updateCategory);
categoryRouter.get('/generate-category-csv', protect, authAdmin, generateCSV);

module.exports = categoryRouter