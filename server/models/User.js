const mongoose = require("../db/connection")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    projects_managed: [
        {
            ref: "Project",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    projects_joined: [
        {
            ref: "Project",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    date_joined: {
        type: Date,
        default: Date.now()
    },
    tickets_assigned: [
        {
            ref: "Tickets",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    tickets_issued: [
        {
            ref: "Tickets",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    message_groups: [
        {
            ref: "MessageGroup",
            type: mongoose.Schema.Types.ObjectId
        }
    ]
})

const User = mongoose.model("User", userSchema)

module.exports = User