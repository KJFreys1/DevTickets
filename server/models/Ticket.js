const mongoose = require("../db/connection")
const Schema = mongoose.Schema

const ticketSchema = new Schema({
    date: {
        type: Date,
        default: Date.now()
    },
    due_date: Date,
    enable_due_date: {
        type: Boolean,
        default: false
    },
    issue: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "Open"
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