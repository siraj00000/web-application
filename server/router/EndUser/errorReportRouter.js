const errorReportCtrl = require("../../controller/EndUser/errorReportCtrl");

const errorReportRouter = require("express").Router();

errorReportRouter
    .post("/error-report", errorReportCtrl.insertErrorReport);

module.exports = errorReportRouter;