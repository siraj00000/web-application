class Apifeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    sorting() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else {
            this.query = this.query.sort('-createdAt');
        }
        return this;
    }
    paginating() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 9;
        this.query = this.query.skip((page - 1) * limit).limit(limit);
        return this;
    }
}

module.exports = Apifeatures;