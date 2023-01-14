const SubCategory = require("../../model/SuperAdminSchema/subcategorySchema");
const Category = require("../../model/SuperAdminSchema/categorySchema");
const ErrorResponse = require("../../utils/errorResponse");
const Apifeatures = require("../../utils/ApiFeaturer");
const VerifyPagination = require("../../utils/actions");
const csv = require('fast-csv');
const fs = require('fs');

const subCategoryCtrl = {
    insertSubCategory: async (req, res, next) => {
        const { parent_category_id, sub_category, sub_category_active_status, feature } = req.body;

        const category = await Category.findById({ _id: parent_category_id });

        if (!category) return next(new ErrorResponse("Invalid category", 404));

        try {
            await SubCategory.create({
                parent_category_id,
                category_name: category.category_name,
                sub_category,
                sub_category_active_status,
                feature
            });

            res.status(201).json({
                success: true,
                msg: "Sub-Category has been created!"
            });
        } catch (error) {
            next(error);
        }
    },
    fetchSubCategory: async (req, res, next) => {
        try {
            const search = req.query.sub_category || "";
            const features = new Apifeatures(SubCategory.find({ sub_category: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();
            const subCategory = await features.query;

            if (!subCategory?.length) return res.status(200).json({ success: false });

            let total = await SubCategory.countDocuments();
            let pages = await VerifyPagination(req, total);

            if (!pages) return next(new ErrorResponse('No page found', 404));

            res.status(200).json({
                success: true,
                result: subCategory.length,
                pages,
                data: subCategory,
            });
        } catch (error) {
            next(error);
        }
    },
    fetchSubCatByCategory: async (req, res, next) => {
        try {
            const { parent_id } = req.params;
            const subcategory = await SubCategory.where({ parent_category_id: parent_id }).find();

            res.status(200).json({
                success: true,
                data: subcategory
            })
        } catch (error) {
            next(error);
        }
    },
    updateSubCategory: async (req, res, next) => {
        try {
            const { sub_category_active_status } = req.body;
            const { id } = req.params;

            const category = await Category.findById({ _id: req.body?.parent_category_id });

            if (!category) return next(new ErrorResponse("Invalid category", 404));

            await SubCategory.findByIdAndUpdate(id, { sub_category_active_status }, { new: true });

            return res.status(201).json({
                success: true,
                msg: "Sub-Category update!"
            });
        } catch (error) {
            next(error);
        }
    },
    deleteSubCategory: async (req, res, next) => {
        try {
            const { id } = req.params;
            await SubCategory.where({ _id: id }).findOneAndDelete();

            res.status(200).json({
                success: true,
                data: "Sub-Category deleted!"
            });
        } catch (error) {
            next(error);
        }
    },
    generateCSV: async (req, res, next) => {
        try {
            const search = req.query.sub_category || "";
            const features = new Apifeatures(SubCategory.find({ sub_category: { $regex: search, $options: 'i' } }), req.query)
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

            const writableStream = fs.createWriteStream('public/files/export/sub-category.csv');

            csvStream.pipe(writableStream);

            writableStream.on("finish", () => {
                res.status(200).json({
                    success: true,
                    downloadURL: 'files/export/sub-category.csv'
                });
            });

            if (sub_category.length > 0) {
                sub_category.map(subCat => {
                    csvStream.write({
                        Category: subCat.category_name ? subCat.category_name : '-',
                        SubCategory: subCat.sub_category ? subCat.sub_category : '-',
                        CreatedAt: subCat.createdAt ? subCat.createdAt : '-'
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
module.exports = subCategoryCtrl;