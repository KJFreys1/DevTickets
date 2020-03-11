const mongoose = require("mongoose")
const Schema = mongoose.Schema

const eventSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    }
})

const Event = mongoose.model("Event", eventSchema)
module.exports = Event