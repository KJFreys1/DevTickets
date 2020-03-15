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
        Ticket.find({ _id: { $in: [proj.tickets] } }).then(tickets => {
            res.json(tickets)
        })
    })
})

router.get("/issued/:uid", (req, res) => {
    User.findById(req.params.uid).then(user => {
        Ticket.find({ _id: { $in: [user.tickets_issued] } }).then(tickets => {
            res.json(tickets)
        }).catch(err => { throw err })
    }).catch(err => { throw err })
})

router.get("/assigned/:uid", (req, res) => {
    User.findById(req.params.uid).then(user => {
        Ticket.find({ _id: { $in: [user.tickets_assigned] } }).then(tickets => {
            res.json(tickets)
        }).catch(err => { throw err })
    }).catch(err => { throw err })
})

router.post("/", (req, res) => {
    Ticket.create(req.body).then(ticket => {
        User.findById(ticket.submitter).then(user => {
            user.tickets_issued.push(ticket._id)
            user.save().then(() => {
                Project.findById(ticket.project).then(proj => {
                    proj.tickets.push(ticket._id)
                    proj.save().then(() => {
                        res.json(ticket)
                    })
                })
            })
        })
    })
})

module.exports = router