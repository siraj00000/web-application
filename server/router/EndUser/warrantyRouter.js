const warrantyRouter = require("express").Router();
const warrantyCtrl = require('../../controller/EndUser/warrantyCtrl');
warrantyRouter
    .post('/insert-warranty', warrantyCtrl.registerWarranty)
    .get('/fetch-warranties')
    .get('/fetch-spacific-warranty')
    .put('/update-warranty')
    .delete('/delete-warranty');

module.exports = warrantyRouter;