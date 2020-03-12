const config = require('config')

const mongoose = require('mongoose')
mongoose.Promise = Promise
const MONGODB_URI = config.get("mongoURI") || "mongodb://localhost/devtickets"
mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log("Mongo connected"))
module.exports = mongoose