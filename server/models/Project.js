const mongoose = require("../db/connection")
const Schema = mongoose.Schema

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    managers: [
        {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    developers: [
        {
            ref: "User",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    tickets: [
        {
            ref: "Ticket",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    feed: [
        {
            ref: "Comment",
            type: mongoose.Schema.Types.ObjectId
        },
        {
            ref: "Event",
            type: mongoose.Schema.Types.ObjectId
        }
    ],
    date: {
        type: Date,
        default: Date.now()
    }
})

const Project = mongoose.model('Project', projectSchema)
module.exports = Project