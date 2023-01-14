const multer = require("multer")
const path = require("path");
const fs = require("fs");
// // specify multer storage engine

// // const storage = multer.diskStorage({
// //     filename: (req, file, cb) => {
// //         cb(null, Date.now() + '-' + file.originalname);
// //     }
// // });

// // // file validation
// const fileFilter = (req, file, cb) => {
//     if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
//         console.log('run filter');
//         cb(null, true);
//     } else {
//         cb({ message: "Unsupported File Format" }, false);
//     }
// };

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, '../tmp/my-uploads');
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//         cb(null, file.fieldname + '-' + uniqueSuffix);
//     }
// })

// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 1024 * 1024 },
//     fileFilter: fileFilter
// });

// module.exports = upload;


// -------------------------------

// Creating uploads folder if not already present
// In "uploads" folder we will temporarily upload
// image before uploading to cloudinary
// Multer setup
var fileStorageEngine = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('destination');
        cb(null, require('./uploads'));
        // cb(null, path.join(__dirname, "./uploads/"));
    },
    filename: function (req, file, cb) {
        cb(null, Data.now() + "-" + file.originalname);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb({ message: "Unsupported File Format" }, false);
    }
};
// const upload = multer({ dest: 'uploads/'});
const upload = multer({ dest: './uploads/' }).array("image");
module.exports = upload;