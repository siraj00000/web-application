const Product = require("../../model/CompanySchema/productSchema");
const Brand = require("../../model/SuperAdminSchema/brandSchema");
const Category = require("../../model/SuperAdminSchema/categorySchema");
const SubCategory = require("../../model/SuperAdminSchema/subcategorySchema");
const Company = require("../../model/SuperAdminSchema/companyAdminSchema");
const Apifeatures = require("../../utils/ApiFeaturer");
const ErrorResponse = require("../../utils/errorResponse");
const csv = require('fast-csv');
const fs = require('fs');
const VerifyPagination = require("../../utils/actions");
const { uploadImagesToCloudinary, uploadVideoToCloudinary, destroyImageFromCloudinary } = require("../../utils/upload");

const productCtrl = {
    insertProduct: async (req, res, next) => {
        try {
            //? Parse body data
            let body = JSON.parse(req.body.reqBody);
            let { company_email, videoURL, emptyVideo } = body;

            // Note: image and video word must provide as field name
            let file = req.files?.image;
            let video = req.files?.video;

            //? find company collection according to admin's category
            let company = await Company.where({ company_email: company_email }).findOne();

            // means this company isn't present in collection
            if (!company) return next(new ErrorResponse("Couldn't find any Company", 400));

            //? add id as a company key
            body["company"] = company._id;

            // uploadImagesToCloudinary method response matters
            // @response will provide image link from cloudinary then store in db
            // @error error occurence, will stop to procceed further 
            if (file !== undefined) {
                const result = await uploadImagesToCloudinary(file, next, 'Company');
                if (!result || result === 0) return next(new ErrorResponse('Image not uploaded!', 404));
                body["image_list"] = result;
            }

            // uploadVideoToCloudinary method response matters
            // @response will provide video link from cloudinary then store in db
            // @error error occurence, will stop to procceed further 
            if (emptyVideo) {
                body["video_url"] = "";
            } else {
                if (videoURL === '') {
                    const videoUploadRes = await uploadVideoToCloudinary(video, next, "Company");
                    if (!videoUploadRes || videoUploadRes === 0) return next(new ErrorResponse('Video not uploaded!', 404));
                    body["video_url"] = videoUploadRes;
                } else {
                    body["video_url"] = { url: videoURL, public_id: '' };
                }
            }

            // insert collection to db
            const product = await Product.create(body);

            if (product) res.status(201).json({
                success: true,
                msg: "Product Created!",
                data: product
            });
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    fetchProducts: async (req, res, next) => {
        try {
            const { email } = req.body;
            const company = await Company.where({ company_email: email }).findOne();
            if (!company) return next(new ErrorResponse("Company does not found !!", 400));

            const search = req.query.product_name || "";
            const features = new Apifeatures(Product.where({ company: company._id }).find({ product_name: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();

            const product = await features.query;

            if (!product?.length) return res.status(200).json({ success: false });

            const newProduct = await insertNameInProduct(product, next);

            let total = await Product.countDocuments();
            let pages = await VerifyPagination(req, total);

            if (!pages) return next(new ErrorResponse('No page found', 404));

            if (newProduct) {
                res.status(200).json({
                    success: true,
                    result: newProduct.length,
                    pages,
                    data: newProduct
                });
            }

        } catch (error) {
            next(error);
        }
    },
    fetchProductById: async (req, res, next) => {
        try {
            const { id } = req.params;
            const product = await Product.where({ brand: id }).find();
            if (product) {
                res.status(200).json({
                    success: true,
                    result: product?.length,
                    msg: "Product fetched!",
                    data: product
                });
            }
        } catch (error) {
            next(error);
        }
    },
    fetchProductByCompany: async (req, res, next) => {
        try {
            const { email } = req.body;
            const company = await Company.where({ company_email: email }).findOne();
            if (!company) return next(new ErrorResponse("Company does not found !!", 400));

            const search = req.query.product_name || "";
            const features = new Apifeatures(Product.where({ company: company._id }).find({ product_name: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();

            const product = await features.query;

            if (!product?.length) return res.status(200).json({ success: false });

            const newProduct = await insertNameInProduct(product, next);

            let total = await Product.countDocuments();
            let pages = await VerifyPagination(req, total);

            if (!pages) return next(new ErrorResponse('No page found', 404));

            if (newProduct) {
                res.status(200).json({
                    success: true,
                    result: newProduct.length,
                    pages,
                    data: newProduct
                });
            }
        } catch (error) {
            next(error);
        }
    },
    updateProduct: async (req, res, next) => {
        try {
            res.set("Access-Control-Allow-Origin", "http://52.36.197.217/");

            //? Parse body data  
            let body = JSON.parse(req.body.reqBody);

            const { id } = req.params;
            if (!id) return next(new ErrorResponse("Invalid product entry!", 401));

            let file = req.files?.image;

            if (file) {
                const result = await uploadImagesToCloudinary(file, next, "Company");
                if (!result || result === 0) return next(new ErrorResponse('Image not uploaded!', 404));

                let newImages = [...body.prevImages, ...result];
                body["image_list"] = newImages;

            } else {
                body["image_list"] = body.prevImages;
            }

            /**
           * *uploadVideoToCloudinary method response matters
           * @response will provide video link from cloudinary then store in db
           * @error error occurence, will stop to procceed further 
           * */
            if (body.emptyVideo === true) {
                body["video_url"] = "";
            } else {
                if (body.videoURL === '') {
                    let video = req.files.video;
                    const videoUploadRes = await uploadVideoToCloudinary(video, next, "Company");
                    if (!videoUploadRes || videoUploadRes === 0) return next(new ErrorResponse('Video not uploaded!', 404));
                    body["video_url"] = videoUploadRes;
                } else {
                    if (typeof body.videoURL === 'object') {
                        body["video_url"] = body.videoURL;
                    } else {
                        body["video_url"] = { url: body.videoURL, public_id: '' };
                    }
                }
            }

            const updateProduct = await Product.findByIdAndUpdate(id, body, { new: true });
            if (updateProduct) {
                res.status(200).json({
                    success: true,
                    msg: "Product Updated!",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteProduct: async (req, res, next) => {
        try {
            const { id } = req.params;
            const deletedProduct = await Product.where({ _id: id }).findOneAndDelete();
            if (deletedProduct) {
                res.status(200).json({
                    success: true,
                    msg: "Product Deleted!",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    generateCSV: async (req, res, next) => {
        try {
            const { email } = req.body;
            const company = await Company.where({ company_email: email }).findOne();
            if (!company) return next(new ErrorResponse("Company does not found !!", 400));

            const search = req.query.product_name || "";
            const features = new Apifeatures(Product.where({ company: company._id }).find({ product_name: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();

            const queryProduct = await features.query;

            if (!queryProduct?.length) return res.status(200).json({ success: false });

            const product = await insertNameInProduct(queryProduct, next);

            const csvStream = csv.format({ headers: true });

            if (!fs.existsSync('public/files/export')) {
                if (!fs.existsSync('public/files')) {
                    fs.mkdirSync('public/files');
                }
                if (!fs.existsSync('public/files/export')) {
                    fs.mkdirSync('public/files/export');
                }
            }

            const writableStream = fs.createWriteStream('public/files/export/product.csv');

            csvStream.pipe(writableStream);

            writableStream.on("finish", () => {
                res.status(200).json({
                    success: true,
                    downloadURL: 'files/export/product.csv'
                });
            });

            if (product.length > 0) {
                product.map(item => {
                    csvStream.write({
                        Product: item.product_name || '-',
                        Company: item.company_name || '-',
                        VariantType: item.variant_type || '-',
                        Variants: item.variants.map(i => i) || '-',
                        BrandName: item.brand_name || '-',
                        CategoryName: item.category_name || '-',
                        SubCategory: item.sub_category_name || '-',
                        image_list: item.image_list.map(i => i.url + ",") || '-',
                        Headings: item.carousel_headings || '-',
                        Text: item.carousel_text || '-',
                        Description: item.product_description || '-',
                        GeneralWarrantyDuration: item.general_warranty_duration || '-',
                        SpecialWarrantyType: item.special_warranty_type || '-',
                        SpecialWarrantyDuration: item.special_warranty_duration || '-',
                        FreeBrandMaintenanceDuration: item.free_brand_maintenance_duration || '-',
                        OneClickReorderFeature: item.one_click_reorder_feature || '-',
                        ReorderLink: item.reorder_link || '-',
                        SurveyFeature: item.survey_feature || '-',
                        SurveyLink: item.survey_link || '-',
                        CreatedAt: item.createdAt || '-',
                    });
                });
            }

            csvStream.end();
            writableStream.end();
        } catch (error) {
            next(error);
        }
    },
    updateProductImages: async (req, res, next) => {
        try {
            const { public_id } = req.body;
            if (!public_id) return next(new ErrorResponse("Please provide a valid image", 400));

            const { id } = req.params;
            const product = await Product.findById(id);

            if (product) {
                let list = [];
                for (const key in product.image_list) {
                    if (product.image_list[key].public_id !== public_id) {
                        let element = product.image_list[key];
                        console.log(typeof element);
                        list.push(element);
                    }
                }
                req.body["image_list"] = list;
            }

            destroyImageFromCloudinary(public_id)
                .then(async response => {
                    console.log(response.result.result);
                    if (response.result.result === "ok") {
                        const updateProduct = await Product.findByIdAndUpdate(id, req.body, { new: true });
                        if (updateProduct) res.status(200).json({
                            success: true,
                            msg: "Image Deleted!"
                        });
                    } else next(response.result.result);
                })
                .catch(err => next(err));

        } catch (error) {
            next(error);
        }
    },
};
module.exports = productCtrl;

const insertNameInProduct = async (product, next) => {
    let newPro = [];
    for (let index = 0; index < product.length; index++) {
        let element = [...product];

        const { company, brand, category, sub_category } = element[index];
        if (!company || !brand || !category || !sub_category) return next(new ErrorResponse("Invalid info !!", 400));

        // Add company name
        const companyName = await Company.findById({ _id: company });
        if (!companyName) return next(new ErrorResponse("Brand name does not found !!", 400));
        element[index]._doc.company_name = companyName?.company_name;

        // Add brand name
        const brandName = await Brand.findById({ _id: brand });
        if (!brandName) return next(new ErrorResponse("Brand name does not found !!", 400));
        element[index]._doc.brand_name = brandName?.brand;

        // Add Category name
        const categoryName = await Category.findById({ _id: category });
        if (!categoryName) return next(new ErrorResponse("Category name does not found !!", 400));
        element[index]._doc.category_name = categoryName?.category_name;

        // Add subCategory name
        const SubCategoryName = await SubCategory.findById({ _id: sub_category });
        if (!SubCategoryName) return next(new ErrorResponse("SubCategory name does not found !!", 400));
        element[index]._doc.sub_category_name = SubCategoryName?.sub_category;

        newPro[index] = { ...element[index]._doc };
    }
    return newPro;
};