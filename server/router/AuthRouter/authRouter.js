const authRouter = require("express").Router();
const { register, login, forgetPassword, resetPassword, deleteUser, resetSubAdminPassword } = require("../../controller/Auth/authCtrl");
const { protect } = require("../../middleware/auth");
const authAdmin = require("../../middleware/authAdmin");

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/forgetpassword', forgetPassword);
authRouter.put('/resetpassword/:resetToken', resetPassword);
authRouter.delete('/remove-user/:id/:role', deleteUser);
authRouter.put('/resetpassword-sub-admin', protect, authAdmin, resetSubAdminPassword);

module.exports = authRouter