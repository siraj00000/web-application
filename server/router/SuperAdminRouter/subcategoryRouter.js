const subCategoryRouter = require("express").Router();
const { protect } = require("../../middleware/auth");
const authAdmin = require("../../middleware/authAdmin");
const {
    insertSubCategory,
    fetchSubCategory,
    updateSubCategory,
    deleteSubCategory,
    generateCSV,
    fetchSubCatByCategory
} = require("../../controller/SuperAdminCtrl/subcategoryCtrl");

subCategoryRouter
    .post("/insert-subcategory", protect, authAdmin, insertSubCategory)
    .get("/fetch-subcategory", protect, fetchSubCategory)
    .get("/fetch-subcategory/:parent_id", protect, fetchSubCatByCategory)
    .put("/update-subcategory/:id", protect, authAdmin, updateSubCategory)
    .delete("/delete-subcategory/:id", protect, authAdmin, deleteSubCategory)
    .get("/generate-csv-subcat", protect, authAdmin, generateCSV);
module.exports = subCategoryRouter;