const Label = require("../../model/ManufacturerSchema/labelSchema");
const Product = require("../../model/CompanySchema/productSchema");
const ErrorResponse = require("../../utils/errorResponse");
const Brand = require("../../model/SuperAdminSchema/brandSchema");

const pdpCtrl = {
    productDetais: async (req, res, next) => {
        try {
            const { dsN } = req.params;
            if (!dsN) return next(new ErrorResponse("invalid !!", 400));
            
            let dsN_Url = dsN?.split("_");

            let dsN_Index = Number(dsN_Url[dsN_Url.length - 1]);

            const label = await Label.where({ product_id: dsN_Url[1], batch_number: dsN_Url[2] }).findOne();
            
            //!! Note: 
            //? verifies is there ds1 available
            if (!label?.DS1[dsN_Index - 1]) return next(new ErrorResponse("Error 010: Missing label", 400));

            label["DS1"] = label?.DS1[dsN_Index - 1];
            label["DS2"] = label?.DS2[dsN_Index - 1];
            label["DS1_URL"] = undefined;
            label["DS2_URL"] = undefined;
            let owner = {
                number: label.owner_mobile,
                msg: label.owner_mobile !== null ? `This product is owned by ${label.owner_mobile}` : ""
            };


            const productDetail = await Product.where({ _id: dsN_Url[1] }).findOne();

            const brand = await Brand.findById(label.brand_id);

            if (productDetail) res.status(200).json({
                success: true,
                msg: "Yes exists",
                data: {
                    label, productDetail, owner, brand
                },
            });
        } catch (error) {
            next(error);
        }
    }
};
module.exports = pdpCtrl;