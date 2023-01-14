const CompanyAdmin = require("../../model/SuperAdminSchema/companyAdminSchema");
const ManufacturerAdmin = require("../../model/SuperAdminSchema/manufacturerAdminSchema");
const User = require("../../model/AuthSchema/userSchema");
const ErrorResponse = require("../../utils/errorResponse");
const Apifeatures = require("../../utils/ApiFeaturer");
const VerifyPagination = require("../../utils/actions");
const csv = require('fast-csv');
const fs = require('fs');

const manufacturerAdminCtrl = {
    insertManufacturerDetail: async (req, res, next) => {
        try {
            const {
                manufacturer_email, manufacturer, company_id, pincode,
                registered_address, phone_one, phone_two, manufacturer_active_status
            } = req.body;

            const company = await CompanyAdmin.findById({ _id: company_id });

            if (!company) return next(new ErrorResponse("Invalid company", 404));

            const manufacturerDetail = await ManufacturerAdmin.create({
                manufacturer_email, manufacturer, company_id, pincode, manufacturer_active_status,
                registered_address, phone_one, phone_two, company_name: company?.company_name
            });

            if (manufacturerDetail) {
                res.status(201).json({
                    success: true,
                    msg: "Manufacturer detail has been added"
                });
            }
        } catch (error) {
            next(error);
        }
    },
    fetchManufacturerDetail: async (req, res, next) => {
        try {
            const searchManufacture = req.query.manufacturer || "";
            const searchCompany = req.query.company_name || "";

            const features = new Apifeatures(ManufacturerAdmin.find(
                {
                    manufacturer: { $regex: searchManufacture, $options: 'i' },
                    company_name: { $regex: searchCompany, $options: 'i' }
                })
                , req.query)
                .sorting().paginating();
            const manufacturerDetail = await features.query;

            if (!manufacturerDetail?.length) return res.status(200).json({ success: false });

            let total = await ManufacturerAdmin.countDocuments();
            let pages = await VerifyPagination(req, total);

            if (!pages) return next(new ErrorResponse('No page found', 404));

            if (manufacturerDetail)
                res.status(200).json({ success: true, msg: "Detail fetched!", pages, data: manufacturerDetail });
        } catch (error) {
            next(error);
        }
    },
    updateManufacturerDetail: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) return next(new ErrorResponse("condition does'nt match", 404));

            const updateManufacturerDetail = await ManufacturerAdmin.findByIdAndUpdate(id, req.body, { new: true });
          
            if (updateManufacturerDetail) {
                return res.status(201).json({
                    success: true,
                    msg: "Manufacturer update!",
                    data: updateManufacturerDetail,
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteManufacturerDetail: async (req, res, next) => {
        try {
            const { id } = req.params;
            const { email } = req.body;

            if (!id) return next(new ErrorResponse("data is empty", 404));

            await User.where({ email }).findOneAndDelete();

            await ManufacturerAdmin.where({ _id: id }).findOneAndDelete();

            res.status(200).json({
                success: true,
                msg: "Manufacturer deleted!"
            });
        } catch (error) {
            next(error);
        }
    },
    generateCSV: async (req, res, next) => {
        try {
            const search = req.query.manufacturer || "";
            const features = new Apifeatures(ManufacturerAdmin.find({ manufacturer: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();
            const manufacturerDetail = await features.query;

            if (!manufacturerDetail?.length) return res.status(200).json({ success: false });

            const csvStream = csv.format({ headers: true });

            if (!fs.existsSync('public/files/export')) {
                if (!fs.existsSync('public/files')) {
                    fs.mkdirSync('public/files');
                }
                if (!fs.existsSync('public/files/export')) {
                    fs.mkdirSync('public/files/export');
                }
            }

            const writableStream = fs.createWriteStream('public/files/export/manufacture.csv');

            csvStream.pipe(writableStream);

            writableStream.on("finish", () => {
                res.status(200).json({
                    success: true,
                    downloadURL: 'files/export/manufacture.csv'
                });
            });

            if (manufacturerDetail.length > 0) {
                manufacturerDetail.map(manu => {
                    csvStream.write({
                        Manufacturer_Email: manu.manufacturer_email || '-',
                        Manufacturer: manu.manufacturer || '-',
                        Company_Id: manu.company_id || '-',
                        Company_Name: manu.company_name || '-',
                        Pincode: manu.pincode || '-',
                        Registered_Address: manu.registered_address || '-',
                        Phone_One: manu.phone_one || '-',
                        Phone_Two: manu.phone_two || '-',
                        Manufacturer_Active_Status: manu.manufacturer_active_status || '-',
                        CreatedAt: manu.createdAt || '-'
                    });
                });
            }

            csvStream.end();
            writableStream.end();
        } catch (error) {
            next(error);
        }
    }
};
module.exports = manufacturerAdminCtrl;