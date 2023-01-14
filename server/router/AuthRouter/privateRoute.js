const { getPrivateData } = require("../../controller/Auth/privateCtrl");
const { protect } = require("../../middleware/auth");

const router = require("express").Router();

router.get('/', protect, getPrivateData)

module.exports.privateRoute = router