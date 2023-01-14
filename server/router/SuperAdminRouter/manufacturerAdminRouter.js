const manufactureRouter = require("express").Router();
const { protect } = require("../../middleware/auth");
const authAdmin = require("../../middleware/authAdmin");
const {
    insertManufacturerDetail,
    fetchManufacturerDetail,
    updateManufacturerDetail,
    deleteManufacturerDetail,
    generateCSV
} = require("../../controller/SuperAdminCtrl/manufacturerAdminCtrl");

manufactureRouter.post('/insert-manufacturer-admin', protect, authAdmin, insertManufacturerDetail);
manufactureRouter.get('/fetch-manufacturer-admin', protect, authAdmin, fetchManufacturerDetail);
manufactureRouter.put('/update-manufacturer-admin/:id', protect, authAdmin, updateManufacturerDetail);
manufactureRouter.delete('/delete-manufacturer-admin/:id', protect, authAdmin, deleteManufacturerDetail);
manufactureRouter.get('/generate-manufacturer-csv', protect, authAdmin, generateCSV);

module.exports = manufactureRouter;