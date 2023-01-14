const Warranty = require("../../model/EndUserSchema/warrantyRegistrationSchema");
const ErrorResponse = require("../../utils/errorResponse");
const { uploadWarrantyInvoiceImage } = require("../../utils/upload");

const warrantyCtrl = {
    registerWarranty: async (req, res, next) => {
        try {
            const body = JSON.parse(req.body.req_body);
            
            const file = req.files.image;
            if (!file) return next(new ErrorResponse("Please provide invoice image !!", 400));

            const imageURL = await uploadWarrantyInvoiceImage(file, next, 'warranty');
            if (!imageURL) return next(new ErrorResponse("Invalid invoice image !!", 400));

            body['invoice_image'] = imageURL;

            const warrantyToRegister = await Warranty.create(body);
            if (warrantyToRegister) {
                res.status(201).json({
                    success: true,
                    msg: "Warranty has been registered !!"
                });
            }
        } catch (error) {
            next(error);
        }
    },
    fetchWarranties: async (req, res, next) => {
        try {

        } catch (error) {
            next(error);
        }
    },
    fetchSpecificWarranty: async (req, res, next) => { },
    updateWarranty: async (req, res, next) => { },
    deleteWarranty: async (req, res, next) => { }
};
module.exports = warrantyCtrl;