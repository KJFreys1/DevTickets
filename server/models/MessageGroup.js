const mongoose = require("../db/connection")
const Schema = mongoose.Schema

const messageGroupSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    users: [
        {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    messages: [
        {
            ref: "Message",
            type: mongoose.Schema.Types.ObjectId
        }
    ]
})

const MessageGroup = mongoose.model("MessageGroup", messageGroupSchema)
module.exports = MessageGroup