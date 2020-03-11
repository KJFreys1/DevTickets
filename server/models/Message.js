const mongoose = require("mongoose")
const Schema = mongoose.Schema

const messageSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    message: {
        type: String,
        required: true
    }
})

const Message = mongoose.model("Message", messageSchema)
module.exports = Message