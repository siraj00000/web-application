const pdpRouter = require("express").Router();

const { productDetais } = require("../../controller/EndUser/pdpCtrl");

pdpRouter
    .post("/product-details/:dsN", productDetais);

module.exports = pdpRouter;