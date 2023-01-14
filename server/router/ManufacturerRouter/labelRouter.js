const labelRouter = require("express").Router();
const { insertLabel, fetchLabel, deleteLabel, generateCSV } = require("../../controller/ManufacturerCtrl/labelCtrl");
const { protect } = require("../../middleware/auth");
const { authManufacturerAdmin } = require("../../middleware/authSubAdmin");

labelRouter
    .post('/insert-label', protect, authManufacturerAdmin, insertLabel)
    .post('/fetch-label/', protect, authManufacturerAdmin, fetchLabel)
    .post('/generate-label-csv', protect, authManufacturerAdmin, generateCSV)
    .delete('/delete-label/:id', protect, authManufacturerAdmin, deleteLabel);

module.exports = labelRouter;