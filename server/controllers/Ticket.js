const express = require("express")
const router = express.Router()

const User = require("../models/User")
const Project = require("../models/Project")
const Ticket = require("../models/Ticket")
const Comment = require("../models/Comment")

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

router.put("/assign/:uid/:tid", (req, res) => {
    Ticket.findById(req.params.tid).then(ticket => {
        User.findById(req.params.uid).then(user => {
            ticket.developers.push(user._id)
            ticket.save().then(() => {
                user.tickets_assigned.push(ticket._id)
                user.save().then(() => {
                    res.json(ticket)
                })
            })
        })
    })
})

router.put("/remove/:uid/:tid", (req, res) => {
    Ticket.findById(req.params.tid).then(ticket => {
        User.findById(req.params.uid).then(user => {
            let tidx = ticket.developers.indexOf(user._id)
            let uidx = user.tickets_assigned.indexOf(ticket._id)
            if(tidx != -1 && uidx != -1) {
                ticket.developers.splice(tidx, 1)
                ticket.save().then(() => {
                    user.tickets_assigned.splice(uidx, 1)
                    user.save().then(() => {
                        res.json(ticket)
                    })
                })
            } else {
                res.json({ msg: "User not found"})
            }
        })
    })
})

router.put("/info/:tid", (req, res) => {
    Ticket.findById(req.params.tid).then(ticket => {
        if (req.body.issue) {
            ticket.issue = req.body.issue
        }
        if (req.body.status) {
            ticket.status = req.body.status
        }
        if (req.body.due_date) {
            ticket.due_date = req.body.due_date
            ticket.enable_due_date = true
        }
        ticket.save().then(newTicket => {
            res.json(newTicket)
        })
    })
})

router.put("/toggledue/:tid", (req, res) => {
    Ticket.findById(req.params.tid).then(ticket => {
        ticket.enable_due_date = !ticket.enable_due_date
        ticket.save().then(() => {
            res.json(ticket)
        })
    })
})

router.delete("/:tid", (req, res) => {
    Ticket.findByIdAndDelete(req.params.tid).then(() => {
        Ticket.find().then(tickets => {
            res.json(tickets)
        })
    })
})

module.exports = router