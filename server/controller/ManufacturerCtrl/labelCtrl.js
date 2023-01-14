const Product = require('../../model/CompanySchema/productSchema');
const Label = require('../../model/ManufacturerSchema/labelSchema');
const Brand = require('../../model/SuperAdminSchema/brandSchema');
const Company = require('../../model/SuperAdminSchema/companyAdminSchema');
const User = require('../../model/AuthSchema/userSchema');
const Apifeatures = require('../../utils/ApiFeaturer');
const ErrorResponse = require('../../utils/errorResponse');
const fs = require('fs');
const csv = require('fast-csv');
const VerifyPagination = require('../../utils/actions');

const labelCtrl = {
    insertLabel: async (req, res, next) => {
        try {
            const { brand_id, product_id, batch_number, serial_number } = req.body;
            const brand = await Brand.findById({ _id: brand_id });

            if (!brand) return next(new ErrorResponse("Brand does not found !!", 400));

            // Generate DS1
            req.body["DS1"] = generateURL("ds1", brand, product_id, batch_number, serial_number);
            req.body["DS2"] = generateURL("ds2", brand, product_id, batch_number, serial_number);

            req.body["shortDS1"] = req.body["DS1"];
            req.body["shortDS2"] = req.body["DS2"];

            const label = await Label.create(req.body);
            if (label) {
                res.status(200).json({
                    success: true,
                    msg: "Label has been inserted successfully !!",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    fetchLabel: async (req, res, next) => {
        try {
            const { id } = req.body;
            const search = req.query.company_name || "";
            const features = new Apifeatures(Label.where({ manufacture_id: id }).find({ company_name: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();
            const label = await features.query;

            if (!label?.length) return res.status(200).json({ success: false });

            const newLabel = await insertNameInLabel(label, next);

            let total = await Label.countDocuments();
            let pages = await VerifyPagination(req, total);

            if (!pages) return next(new ErrorResponse('No page found', 404));

            if (newLabel) res.status(200).json({
                success: true,
                pages,
                msg: "Label fetch !!",
                data: newLabel,
            });
        } catch (error) {
            next(error);
        }
    },
    fetchLabelByCompany: async (req, res, next) => {
        try {
            const { id } = req.body;
            if (!id) return next(new ErrorResponse("Manufacturer does not found !!", 400));

            const search = req.query.company_name || "";
            const features = new Apifeatures(Label.where({ manufacture_id: id }).find({ company_name: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();
            const label = await features.query;

            if (!label?.length) return res.status(200).json({ success: false });

            const newLabel = await insertNameInLabel(label, next);

            let total = await Label.countDocuments();
            let pages = await VerifyPagination(req, total);

            if (!pages) return next(new ErrorResponse('No page found', 404));

            if (newLabel) res.status(200).json({
                success: true,
                pages,
                msg: "Label fetch !!",
                data: newLabel,
            });


        } catch (error) {
            next(error);
        }
    },
    updateLabel: async (req, res, next) => {
        try {
            const { id } = req.params;

            const update_label = await Label.findByIdAndUpdate(id, req.body, {
                new: true
            });

            return res.status(201).json({
                success: true,
                data: update_label,
                msg: "Label update!"
            });
        } catch (error) {
            next(error);
        }
    },
    deleteLabel: async (req, res, next) => {
        try {
            const { id } = req.params;
            await Label.where({ _id: id }).findOneAndDelete();

            res.status(200).json({
                success: true,
                data: "Label deleted!"
            });
        } catch (error) {
            next(error);
        }
    },
    generateCSV: async (req, res, next) => {
        try {
            const { uId } = req.body;
            if (!uId) return next(new ErrorResponse("Manufacturer does not found !!", 400));
            const search = req.query.company_name || "";
            const features = new Apifeatures(Label.where({ manufacture_id: uId }).find({ company_name: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();

            const label = await features.query;

            if (!label?.length) return res.status(200).json({ success: false });

            const newLabel = await insertNameInLabel(label, next);

            const csvStream = csv.format({ headers: true });

            if (!fs.existsSync('public/files/export')) {
                if (!fs.existsSync('public/files')) {
                    fs.mkdirSync('public/files');
                }
                if (!fs.existsSync('public/files/export')) {
                    fs.mkdirSync('public/files/export');
                }
            }

            const writableStream = fs.createWriteStream('public/files/export/label.csv');

            csvStream.pipe(writableStream);

            writableStream.on("finish", () => {
                res.status(200).json({
                    downloadURL: 'files/export/label.csv'
                });
            });

            if (newLabel.length > 0) {
                newLabel.map(lab => {
                    csvStream.write({
                        Category: lab.company_name || '-',
                        Manufacturer_Name: lab.manufacturer_name || '-',
                        Brand_Name: lab.brand_name || '-',
                        Product_Name: lab.product_name || '-',
                        Variants: lab.variant.map(i => i) || '-',
                        Batch_Number: lab.batch_number || '-',
                        Serial_Number: lab.serial_number || '-',
                        Tag_Number: lab.tag_number || '-',
                        Tag_Active: lab.tag_active ? "Active" : "Inactive",
                        DS1: lab.DS1.map(i => i) || '-',
                        DS2: lab.DS2.map(i => i) || '-',
                        ShortDS1: lab.shortDS1.map(i => i) || '-',
                        ShortDS2: lab.shortDS2.map(i => i) || '-',
                        Owner_Mobile: lab.owner_mobile || '-',
                        CreatedAt: lab.createdAt || '-'
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
module.exports = labelCtrl;

const generateURL = (type, brand, product_id, batch_number, serial_number) => {
    let urlList = [];
    for (let index = 0; index < serial_number; index++) {
        let brandName = brand?.brand.trim().split(" ").join(""); 
        let url = `${type}/${brandName}_${product_id}_${batch_number}_${index + 1}`;
        urlList.push(url);
    }
    return urlList;
};

// fetch name through id by collection
const insertNameInLabel = async (label, next) => {
    let newLabelList = [];
    for (let index = 0; index < label.length; index++) {
        const element = [...label];
        const { brand_id, product_id, manufacture_id } = element[index];
        if (!brand_id || !product_id || !manufacture_id) return next(new ErrorResponse("Invalid info !!", 400));

        // Add Manufacturer name
        const manufacturerName = await User.findById({ _id: manufacture_id });
        if (!manufacturerName) return next(new ErrorResponse("Manufacturer name does not found !!", 400));
        element[index]._doc.manufacturer_name = manufacturerName?.email;

        // Add brand name
        const brandName = await Brand.findById({ _id: brand_id });
        if (!brandName) return next(new ErrorResponse("Brand name does not found !!", 400));
        element[index]._doc.brand_name = brandName?.brand;

        // Add Product name
        const productName = await Product.findById({ _id: product_id });
        if (!productName) return next(new ErrorResponse("Product name does not found !!", 400));
        element[index]._doc.product_name = productName?.product_name;

        newLabelList[index] = { ...element[index]._doc };
    }

    return newLabelList;
};