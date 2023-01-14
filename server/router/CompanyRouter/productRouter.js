const productRouter = require("express").Router();
const {
    insertProduct,
    fetchProducts,
    updateProduct,
    deleteProduct,
    generateCSV,
    fetchProductById,
    updateProductImages,
    fetchProductByCompany
} = require("../../controller/CompanyCtrl/productCtrl");
const { protect } = require("../../middleware/auth");
const { authCompanyAdmin, combineAuth } = require("../../middleware/authSubAdmin");

productRouter
    .post('/insert-product', protect, authCompanyAdmin, insertProduct)
    .post('/fetch-product-by-company', protect, authCompanyAdmin, fetchProductByCompany)
    .post('/fetch-product', protect, authCompanyAdmin, fetchProducts)
    .get('/fetch-product/:id', protect, combineAuth, fetchProductById)
    .post('/generate-product-csv', protect, authCompanyAdmin, generateCSV)
    .put('/update-product/:id', protect, authCompanyAdmin, updateProduct)
    .put('/update-product-image/:id', protect, authCompanyAdmin, updateProductImages)
    .delete('/delete-product/:id', protect, authCompanyAdmin, deleteProduct);

module.exports = productRouter;