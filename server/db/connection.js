const mongoose = require('mongoose')
mongoose.Promise = Promise
const MONGODB_URI = 'mongodb://localhost/chatapp'
mongoose.connect(MONGODB_URI, { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
module.exports = mongoose