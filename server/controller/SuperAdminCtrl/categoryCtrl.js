const Category = require("../../model/SuperAdminSchema/categorySchema");
const csv = require('fast-csv');
const fs = require('fs');
const ErrorResponse = require("../../utils/errorResponse");
const Apifeatures = require("../../utils/ApiFeaturer");
const VerifyPagination = require("../../utils/actions");

const categoryCtrl = {
    fetchCategory: async (req, res, next) => {
        try {
            const search = req.query.category_name || "";
            const features = new Apifeatures(Category.find({ category_name: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();
            const category = await features.query;

            if (!category?.length) return res.status(200).json({ success: false });

            let total = await Category.countDocuments();
            let pages = await VerifyPagination(req, total);

            if (!pages) return next(new ErrorResponse('No page found', 404));

            res.status(200).json({
                success: true,
                data: category,
                pages,
                msg: "Categories fetched!",
            });
        } catch (error) {
            next(error);
        }
    },
    fetchSpecificCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            const category = await Category.findById({ _id: id });
            if (category) {
                res.status(200).json({
                    success: true,
                    result: category?.length,
                    msg: "Category fetched!",
                    data: category
                });
            }
        } catch (error) {
            next(error);
        }
    },
    insertCategory: async (req, res, next) => {
        const { category_name } = req.body;
        try {
            if (!category_name) return next(new ErrorResponse("Please provide category", 401));

            const newCategory = await Category.create(req.body);

            if (newCategory) {
                res.status(201).json({
                    success: true,
                    msg: "Categories created!"
                });
            }
        } catch (error) {
            next(error);
        }
    },
    updateCategory: async (req, res, next) => {
        try {
            const { category_name } = req.body;
            const { id } = req.params;

            if (!category_name) return next(new ErrorResponse("Please provide category", 401));

            const update_category = await Category.findByIdAndUpdate(id, req.body, {
                new: true
            });

            return res.status(201).json({
                success: true,
                data: update_category,
                msg: "Category update!"
            });
        } catch (error) {
            next(error);
        }
    },
    deleteCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            await Category.where({ _id: id }).findOneAndDelete();

            res.status(200).json({
                success: true,
                data: "Category deleted!"
            });
        } catch (error) {
            next(error);
        }
    },
    generateCSV: async (req, res, next) => {
        try {
            const search = req.query.category_name || "";
            const features = new Apifeatures(Category.find({ category_name: { $regex: search, $options: 'i' } }), req.query)
                .sorting()
                .paginating();
            const sub_category = await features.query;

            if (!sub_category?.length) return res.status(200).json({ success: false });

            const csvStream = csv.format({ headers: true });

            if (!fs.existsSync('public/files/export')) {
                if (!fs.existsSync('public/files')) {
                    fs.mkdirSync('public/files');
                }
                if (!fs.existsSync('public/files/export')) {
                    fs.mkdirSync('public/files/export');
                }
            }

            const writableStream = fs.createWriteStream('public/files/export/category.csv');

            csvStream.pipe(writableStream);

            writableStream.on("finish", () => {
                res.status(200).json({
                    success: true, 
                    downloadURL: 'files/export/category.csv'
                });
            });

            if (sub_category.length > 0) {
                sub_category.map(catg => {
                    csvStream.write({
                        Category: catg.category_name || '-',
                        CreatedAt: catg.createdAt || '-'
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

module.exports = categoryCtrl;