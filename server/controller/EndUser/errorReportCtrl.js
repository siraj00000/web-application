const ErrorReport = require("../../model/EndUserSchema/reportErrorSchema");

const errorReportCtrl = {
    insertErrorReport: async (req, res, next) => {
        try {
            const errorReport = await ErrorReport.create(req.body);
            
            if (errorReport) {
                res.status(201).json({
                    success: true,
                    msg: "Successfully error reported!"
                })
            }
        } catch (error) {
            next(error);
        }
    }
};

module.exports = errorReportCtrl;