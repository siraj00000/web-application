const VerifyPagination = async (req, total) => {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.limit) || 9;
    const pages = Math.ceil(total / pageSize);
    if (page > pages) return false;
    return pages;
};
module.exports = VerifyPagination;