const CompanyAdmin = require("../../model/SuperAdminSchema/companyAdminSchema");
const User = require("../../model/AuthSchema/userSchema");
const ErrorResponse = require("../../utils/errorResponse");
const Apifeatures = require("../../utils/ApiFeaturer");
const VerifyPagination = require("../../utils/actions");
const fs = require('fs');
const csv = require('fast-csv');

const companyAdminDetail = {
    insertCompanyAdminDetail: async (req, res, next) => {
        try {
            const companyAdminDetail = await CompanyAdmin.create(req.body);

            if (companyAdminDetail) {
                res.status(201).json({
                    success: true,
                    msg: "Company detail has been added",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    fetchCompanyAdminDetail: async (req, res, next) => {
        try {
            const search = req.query.company_name || "";
            const features = new Apifeatures(CompanyAdmin.find({ company_name: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();
            const companyAdminDetail = await features.query;

            if (!companyAdminDetail?.length) return res.status(200).json({ success: false });

            let total = await CompanyAdmin.countDocuments();
            let pages = await VerifyPagination(req, total);

            if (!pages) return next(new ErrorResponse('No page found', 404));

            if (companyAdminDetail)
                res.status(200).json({ success: true, msg: "Detail fetched!", data: companyAdminDetail });
        } catch (error) {
            next(error);
        }
    },
    fetchAdmins: async (req, res, next) => {
        try {
            const { company_email } = req.body;
            if (!company_email) return next(new ErrorResponse("No company admin found!", 400));

            const admins = await User.where({ company_email: company_email }).find();
            if (admins) {
                res.status(200).json({
                    success: true,
                    msg: "Company Admins Fetched!",
                    data: admins
                });
            }
        } catch (error) {
            next(error);
        }
    },
    updateCompanyAdminDetail: async (req, res, next) => {
        try {
            const { id } = req.params;
            if (!id) return next(new ErrorResponse("condition does'nt match", 404));

            const updatCompanyAdminDetail = await CompanyAdmin.findByIdAndUpdate(id, req.body, {
                new: true
            });

            return res.status(201).json({
                success: true,
                msg: "Company update!",
                data: updatCompanyAdminDetail,
            });
        } catch (error) {
            next(error);
        }
    },
    deleteCompanyAdmin: async (req, res, next) => {
        try {
            const { id } = req.params;

            if (!id) return next(new ErrorResponse("condition does'nt match", 404));

            await CompanyAdmin.where({ _id: id }).findOneAndDelete();

            res.status(200).json({
                success: true,
                msg: "Company deleted!"
            });
        } catch (error) {
            next(error);
        }
    },
    generateCSV: async (req, res, next) => {
        try {
            const search = req.query.company_name || "";
            const features = new Apifeatures(CompanyAdmin.find({ company_name: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();
            const companyAdminDetail = await features.query;

            if (!companyAdminDetail?.length) return res.status(200).json({ success: false });

            const csvStream = csv.format({ headers: true });

            if (!fs.existsSync('public/files/export')) {
                if (!fs.existsSync('public/files')) {
                    fs.mkdirSync('public/files');
                }
                if (!fs.existsSync('public/files/export')) {
                    fs.mkdirSync('public/files/export');
                }
            }

            const writableStream = fs.createWriteStream('public/files/export/company.csv');

            csvStream.pipe(writableStream);

            writableStream.on("finish", () => {
                res.status(200).json({
                    success: true,
                    downloadURL: 'files/export/company.csv'
                });
            });

            if (companyAdminDetail.length > 0) {
                companyAdminDetail.map(com => {
                    csvStream.write({
                        Company_Email: com.company_email || '-',
                        Company_Name: com.company_name || '-',
                        Pincode: com.pincode || '-',
                        Registered_Address: com.registered_address || '-',
                        Phone_One: com.phone_one || '-',
                        Phone_Two: com.phone_two || '-',
                        Company_Active_Status: com.company_active_status || '-',
                        Estaiblishment_Year: com.estaiblishment_year || '-',
                        Sub_Category: com.sub_category?.map(i => i.sub_category) || '-',
                        CreatedAt: com.createdAt || '-'
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

module.exports = companyAdminDetail;