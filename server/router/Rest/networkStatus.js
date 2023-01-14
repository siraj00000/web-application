const statusRouter = require('express').Router();

statusRouter.get("/", async (req, res, next) => {
    try {
        res.status(200).json({ status: true });
    } catch (error) {
        next(error);
    }
});

module.exports = statusRouter;