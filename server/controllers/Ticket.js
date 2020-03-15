const express = require("express")
const router = express.Router()

const User = require("../models/User")
const Project = require("../models/Project")
const Ticket = require("../models/Ticket")
const Comment = require("../models/Comment")
const Event = require("../models/Event")

router.get("/", (req, res) => {
    Ticket.find().then(tickets => {
        res.json(tickets)
    })
})

router.get("/pid/:pid", (req, res) => {
    Project.findById(req.params.pid).then(proj => {
        res.json(proj.tickets)
    })
})

module.exports = router