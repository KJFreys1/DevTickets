const mongoose = require("../db/connection")
const Schema = mongoose.Schema

const commentSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    message: {
        type: String,
        required: true
    },
    user: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    }
})

const Comment = mongoose.model("Comment", commentSchema)
module.exports = Comment