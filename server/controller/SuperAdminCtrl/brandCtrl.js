const Brand = require("../../model/SuperAdminSchema/brandSchema");
const CompanyAdmin = require("../../model/SuperAdminSchema/companyAdminSchema");
const Manufacturer = require("../../model/SuperAdminSchema/manufacturerAdminSchema");
const csv = require('fast-csv');
const fs = require('fs');
const { uploadImagesToCloudinary, uploadVideoToCloudinary, destroyImageFromCloudinary } = require("../../utils/upload");
const ErrorResponse = require("../../utils/errorResponse");
const Apifeatures = require("../../utils/ApiFeaturer");
const VerifyPagination = require("../../utils/actions");

const brandCtrl = {
    insertBrand: async (req, res, next) => {
        try {
            res.set("Access-Control-Allow-Origin", "http://52.36.197.217/");

            //? Parse body data  
            let body = JSON.parse(req.body.reqBody);

            // Note: image and video word must provide as field name 
            let file = req.files.image;
            let video = req.files.video;

            const { company_id, videoURL, emptyVideo } = body;

            //*TODO: find company detail in db according to company_id
            const company = await CompanyAdmin.findById({ _id: company_id });

            //*TODO: if company not found will not processed further
            if (!company) return next(new ErrorResponse("Please provide valid company", 401));

            /**
             * *uploadImagesToCloudinary method response matters
             * @response will provide image link from cloudinary then store in db
             * @error error occurence, will stop to procceed further 
             * */
            const result = await uploadImagesToCloudinary(file, next, 'label');
            if (!result || result === 0) return next(new ErrorResponse('Image not uploaded!', 404));


            /**
             * *uploadVideoToCloudinary method response matters
             * @response will provide video link from cloudinary then store in db
             * @error error occurence, will stop to procceed further 
             * */
            if (emptyVideo) {
                body["video_url"] = "";
            } else {
                if (videoURL === '') {
                    const videoUploadRes = await uploadVideoToCloudinary(video, next, "label");
                    if (!videoUploadRes || videoUploadRes === 0) return next(new ErrorResponse('Video not uploaded!', 404));
                    body["video_url"] = videoUploadRes;
                } else {
                    body["video_url"] = { url: videoURL, public_id: '' };
                }
            }

            body["company_name"] = company?.company_name;
            body["image_list"] = result;

            const newBrand = await Brand.create(body);
            if (newBrand) {
                res.status(201).json({
                    success: true,
                    msg: "Brand has been succesfully created!",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    fetchBrands: async (req, res, next) => {
        try {
            const search = req.query.brand || "";
            const features = new Apifeatures(Brand.find({ brand: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();
            const brandList = await features.query;

            if (!brandList?.length) return res.status(200).json({ success: false });

            let total = await Brand.countDocuments();
            let pages = await VerifyPagination(req, total);

            if (!pages) return next(new ErrorResponse('No page found', 404));

            if (brandList) {
                res.status(200).json({
                    success: true,
                    result: brandList.length,
                    pages,
                    data: brandList
                });
            }
        } catch (error) {
            next(error);
        }
    },
    fetchBrandByEmail: async (req, res, next) => {
        try {
            const { email } = req.body;
            const company = await CompanyAdmin.where({ company_email: email }).findOne();
            if (!company) return next(new ErrorResponse("Company does not found !!", 400));

            const brand = await Brand.where({ company_id: company._id }).find();

            res.status(200).json({
                success: true,
                result: brand?.length,
                msg: "Brand fetched!",
                data: brand
            });
        } catch (error) {
            next(error);
        }
    },
    fetchBrandByManufacturer: async (req, res, next) => {
        try {
            const { email } = req.body;
            const manufacturer = await Manufacturer.where({ manufacturer_email: email }).findOne();
            if (!manufacturer) return next(new ErrorResponse("Invalid email !!", 400));

            const brand = await Brand.where({ company_id: manufacturer.company_id }).find();

            res.status(200).json({
                success: true,
                result: brand?.length,
                msg: "Brand fetched!",
                data: brand
            });
        } catch (error) {
            next(error);
        }
    },
    fetchSpecificBrand: async (req, res, next) => {
        try {
            const { id } = req.params;
            const brand = await Brand.findById({ _id: id });
            if (brand) {
                res.status(200).json({
                    success: true,
                    result: brand?.length,
                    msg: "Brand fetched!",
                    data: brand
                });
            }
        } catch (error) {
            next(error);
        }
    },
    updateBrandInfo: async (req, res, next) => {
        // Note: image and video word must provide as field name in the formData
        try {
            res.set("Access-Control-Allow-Origin", "http://52.36.197.217/");

            const { id } = req.params;
            if (!id) return next(new ErrorResponse("Invalid brand entry!", 401));

            //? Parse body data  
            let body = JSON.parse(req.body.reqBody);

            let file = req.files?.image;

            if (file) {
                const result = await uploadImagesToCloudinary(file, next, "label");
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
                    const videoUploadRes = await uploadVideoToCloudinary(video, next, "label");
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

            const updateBrand = await Brand.findByIdAndUpdate(id, body, { new: true });
            if (updateBrand) {
                res.status(200).json({
                    success: true,
                    msg: "Brand Updated!",
                });
            }
        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    deleteBrand: async (req, res, next) => {
        try {
            const { id } = req.params;
            const deletedBrand = await Brand.where({ _id: id }).findOneAndDelete();
            if (deletedBrand) {
                res.status(200).json({
                    success: true,
                    msg: "Brand Deleted!",
                });
            }
        } catch (error) {
            next(error);
        }
    },
    deleteContentFromCloudinary: async (req, res, next) => {
        try {
            const { public_id } = req.body;
            if (!public_id) return next(new ErrorResponse("No image selected", 400));

            destroyImageFromCloudinary(public_id)
                .then(res => console.log(res))
                .catch(err => console.log(err));

            res.status(200).json({
                success: true,
                msg: "Image Deleted!"
            });
        } catch (err) {
            next(err);
        }
    },
    updateImages: async (req, res, next) => {
        try {
            const { public_id } = req.body;
            if (!public_id) return next(new ErrorResponse("Please provide a valid image", 400));

            const { id } = req.params;
            const brand = await Brand.findById(id);

            if (brand) {
                let list = [];
                for (const key in brand.image_list) {
                    if (brand.image_list[key].public_id !== public_id) {
                        let element = brand.image_list[key];
                        list.push(element);
                    }
                }
                req.body["image_list"] = list;
            }

            destroyImageFromCloudinary(public_id)
                .then(async response => {
                    const updatebrand = await Brand.findByIdAndUpdate(id, req.body, { new: true });

                    if (updatebrand) res.status(200).json({
                        success: true,
                        msg: "Image Deleted!"
                    });
                })
                .catch(err => next(err));

        } catch (error) {
            console.log(error);
            next(error);
        }
    },
    generateCSV: async (req, res, next) => {
        try {
            const search = req.query.brand || "";
            const features = new Apifeatures(Brand.find({ brand: { $regex: search, $options: 'i' } }), req.query)
                .sorting().paginating();
            const brand = await features.query;

            if (!brand?.length) return res.status(200).json({ success: false });

            const csvStream = csv.format({ headers: true });

            if (!fs.existsSync('public/files/export')) {
                if (!fs.existsSync('public/files')) {
                    fs.mkdirSync('public/files');
                }
                if (!fs.existsSync('public/files/export')) {
                    fs.mkdirSync('public/files/export');
                }
            }

            const writableStream = fs.createWriteStream('public/files/export/brand.csv');

            csvStream.pipe(writableStream);

            writableStream.on("finish", () => {
                res.status(200).json({
                    success: true,
                    downloadURL: 'files/export/brand.csv'
                });
            });

            if (brand.length > 0) {
                brand.map(item => {
                    csvStream.write({
                        Brand: item.brand || '-',
                        Company: item.company_name || '-',
                        Active: item.brand_active_status || '-',
                        Headings: item.carousel_headings || '-',
                        Text: item.carousel_text || '-',
                        Description: item.product_description || '-',
                        AuthenticFeature: item.authentication_feature || '-',
                        Warranty: item.warranty || '-',
                        RequestForHelp: item.request_help || '-',
                        SurveyFeature: item.survey_feature || '-',
                        SurveyLink: item.survey_link || '-',
                        Promocode: item.promo_code || '-',
                        Referrals: item.referrals || '-',
                        ReOrderLink: item.re_order_link || '-',
                        EmailSupport: item.email_support || '-',
                        Email: item.email_id || '-',
                        CallSupport: item.call_support || '-',
                        CallNum: item.call_no || '-',
                        WhatsappSuport: item.whatsapp_support || '-',
                        WhatsappNumber: item.whatsapp_number || '-',
                        Instagram: item.instagram || '-',
                        InstaLink: item.insta_link || '-',
                        Facebook: item.facebook || '-',
                        FacebookLink: item.fb_link || '-',
                        CreatedAt: item.createdAt || '-'
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

module.exports = brandCtrl;