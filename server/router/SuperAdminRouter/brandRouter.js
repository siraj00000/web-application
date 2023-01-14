const brandRouter = require("express").Router();
const { protect } = require("../../middleware/auth");
const authAdmin = require("../../middleware/authAdmin");
const { authManufacturerAdmin } = require("../../middleware/authSubAdmin");
const {
    fetchBrands,
    insertBrand,
    updateBrandInfo,
    deleteBrand,
    updateImages,
    generateCSV,
    fetchSpecificBrand,
    fetchBrandByEmail,
    fetchBrandByManufacturer,
} = require("../../controller/SuperAdminCtrl/brandCtrl");

brandRouter.post('/insert-brand', protect, authAdmin, insertBrand);
brandRouter.get('/fetch-brands', protect, authAdmin, fetchBrands);
brandRouter.post('/fetch-brand-by-email', protect, fetchBrandByEmail);
brandRouter.post('/fetch-brand-by-manufacturer', protect, authManufacturerAdmin, fetchBrandByManufacturer);
brandRouter.get('/fetch-brands/:id', protect, authAdmin, fetchSpecificBrand);
brandRouter.put('/update-brand/:id', protect, authAdmin, updateBrandInfo);
brandRouter.delete('/delete-brand/:id', protect, authAdmin, deleteBrand);
brandRouter.put('/update-image/:id', protect, authAdmin, updateImages);
brandRouter.get('/generate-brand-csv', protect, authAdmin, generateCSV);

module.exports = brandRouter;