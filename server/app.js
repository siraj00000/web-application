require("dotenv").config(); 
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const express = require("express");
const fileUpload = require("express-fileupload");
const connectMongoDb = require("./config/db");
const errorHandler = require("./middleware/error");

// Router imports
const authRouter = require("./router/AuthRouter/authRouter");
const brandRouter = require("./router/SuperAdminRouter/brandRouter");
const categoryRouter = require("./router/SuperAdminRouter/categoryRouter");
const companyAdminRouter = require("./router/SuperAdminRouter/companyAdminRouter");
const manufactureRouter = require("./router/SuperAdminRouter/manufacturerAdminRouter");
const { privateRoute } = require('./router/AuthRouter/privateRoute');
const subCategoryRouter = require("./router/SuperAdminRouter/subcategoryRouter");
const statusRouter = require("./router/Rest/networkStatus");
const productRouter = require("./router/CompanyRouter/productRouter");
const uploadRouter = require("./router/CompanyRouter/upload");
const labelRouter = require("./router/ManufacturerRouter/labelRouter");
const authProtectionRouter = require("./router/AuthRouter/protectionRouter");
const pdpRouter = require("./router/EndUser/pdpRouter");
const warrantyRouter = require("./router/EndUser/warrantyRouter");
const errorReportRouter = require("./router/EndUser/errorReportRouter");
const OTPVerificationRouter = require("./router/EndUser/endUserVerificationRouter");

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload({
    useTempFiles: true
}));
app.use(bodyParser.urlencoded({ extended: false }));

// DB Connection
connectMongoDb();

// Auth
app.use("/api/auth", authRouter);
app.use('/api/private', privateRoute);
app.use('/api/auth', authProtectionRouter);

// ============== SUPER ADMIN ================== //

// Category & Sub-category
app.use("/api", categoryRouter);
app.use("/api", subCategoryRouter);

// Company Admin
app.use("/api", companyAdminRouter);
app.use("/api", manufactureRouter);

// Brand
app.use("/api", brandRouter);

// ============== COMPANY ADMIN ================== //

app.use("/api", productRouter);

// ============== Manufacturer ADMIN ================== //

app.use("/api", labelRouter);

// ============== End User ================== //
app.use("/api", pdpRouter);
app.use("/api", warrantyRouter);
app.use("/api", errorReportRouter);
app.use("/api", OTPVerificationRouter);

// Download CSV
app.use("/files", express.static(path.join(__dirname, 'public/files')));

// Network Status
app.use("/", statusRouter);

// upload
app.use("/api", uploadRouter);


// Error Handler (should be the last piece of middleware)
app.use(errorHandler);


let port = process.env.PORT;
const server = app.listen(port, () => {
    console.log(`server is running on ${port}`);
});

process.on("unhandledRejection", (err, promise) => {
    console.log(`Logged Error ${err}`);
    server.close(() => process.exit(1));
});
