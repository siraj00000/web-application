const mongoose = require("mongoose");
// mongodb uri
const URI = process.env.MONGODB_URL
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}

const connectMongoDb = () => {
    mongoose.connect(URI, connectionParams)
        .then(res => console.log('Successfully db connected'))
        .catch(err => console.log(err.message))
}

module.exports = connectMongoDb