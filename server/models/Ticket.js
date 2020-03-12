const mongoose = require("../db/connection")
const Schema = mongoose.Schema

const ticketSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    due_date: Date,
    issue: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "open"
    },
    project: {
        ref: "Project",
        type: mongoose.Schema.Types.ObjectId
    },
    submitter: {
        ref: "User",
        type: mongoose.Schema.Types.ObjectId
    },
    comments: [
        {
            ref: "Comment",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    developers: [
        {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId
        }
    ]
})

const Ticket = mongoose.model("Ticket", ticketSchema)
module.exports = Ticket