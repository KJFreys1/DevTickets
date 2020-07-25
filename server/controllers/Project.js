const express = require("express")
const router = express.Router()

const User = require("../models/User")
const Project = require("../models/Project")
const Comment = require("../models/Comment")
const Ticket = require("../models/Ticket")

//@route        /project
//@desc         GET all projects
router.get("/", (req, res) => {
    Project.find({}).then(projs => {
        res.json(projs)
    })
})

//@route        /project/uid/:uid
//@desc         GET all projects connected to user
router.get("/uid/:uid", (req, res) => {
    Project.find({
        $or: [
            { developers: { $in: [req.params.uid] } },
            { managers: { $in: [req.params.uid] } }
        ] 
    }).then(projs => {
        res.json(projs)
    })
})

//@route        /project/pid/:pid
//@desc         GET specific project by project id
router.get("/pid/:pid", (req, res) => {
    Project.findById(req.params.pid)
        .populate("feed")
        .populate("tickets")
        .populate({
            path: "developers",
            select: "name, _id"
        })
        .populate({
            path: "managers",
            select: "name, _id"
        })
        .then(proj => {
            res.json(proj)
    }).catch(err => console.log(err))
})

//@route        /project/:uid
//@desc         POST new project
router.post("/:uid", (req, res) => {
    User.findById(req.params.uid).then(user => {
        Project.create(req.body).then(proj => {
            user.projects_managed.push(proj._id)
            user.save().then(() => {
                res.json(proj)
            })
        }).catch(err => { throw err })
    })
})

//@route        /project/:pid
//@desc         UPDATE semantic information of project
router.put("/:pid", (req, res) => {
    Project.findById(req.params.pid).then(proj => {
        proj.name = req.body.name
        proj.description = req.body.description
        proj.save().then(() => {
            res.json(proj)
        })
    })
})

//@route        /project/developer/:uid/:pid
//@desc         REMOVE user from project
router.put("/remove/:uid/:pid", (req, res) => {
    User.findById(req.params.uid).then(user => {
        Project.findById(req.params.pid).then(proj => {
            let uidx = user.projects_joined.indexOf(req.params.pid)
            user.projects_joined.splice(uidx, 1)
            uidx = user.projects_managed.indexOf(req.params.pid)
            user.projects_managed.splice(uidx, 1)
            user.save().then(() => {
                let pidx = proj.developers.indexOf(req.params.uid)
                proj.developers.splice(pidx, 1)
                pidx = proj.managers.indexOf(req.params.uid)
                proj.managers.splice(pidx, 1)
                proj.save().then(() => {
                    res.json(proj)
                })
            })
        })
    })
})

//@route        /project/developer/:uid/:pid
//@desc         PUT user into project developer array
router.put("/developer/:uid/:pid", (req, res) => {
    User.findById(req.params.uid).then(user => {
        Project.findById(req.params.pid).then(proj => {
            user.projects_joined.push(proj._id)
            user.save().then(() => {
                proj.developers.push(user._id)
                proj.save().then(() => {
                    res.json(proj)
                })
            })
        })
    })
})

//@route        /project/manager/:uid/:pid
//@desc         PUT user into project manager array
router.put("/manager/:uid/:pid", (req, res) => {
    User.findById(req.params.uid).then(user => {
        Project.findById(req.params.pid).then(proj => {
            user.projects_managed.push(proj._id)
            user.save().then(() => {
                proj.managers.push(user._id)
                proj.save().then(() => {
                    res.json(proj)
                })
            })
        })
    })
})

//@route        /project/demote/:uid/:pid
//@desc         DEMOTE user from manager array to develoepr array
router.put("/demote/:uid/:pid", (req, res) => {
    User.findById(req.params.uid).then(user => {
        Project.findById(req.params.pid).then(proj => {
            let uidx = user.projects_managed.indexOf(proj._id)
            let pidx = proj.managers.indexOf(user._id)
            if(uidx != -1 && pidx != -1) {
                user.projects_joined.push(user.projects_managed.splice(uidx, 1))
                user.save().then(() => {
                    proj.developers.push(proj.managers.splice(pidx, 1))
                    proj.save().then(() => {
                        res.json(proj)
                    })
                })
            } else {
                res.json({ msg: "User not found" })
            }
        })
    })
})

//@route        /project/promote/:uid/:pid
//@desc         PROMOTE user from manager array to develoepr array
router.put("/promote/:uid/:pid", (req, res) => {
    User.findById(req.params.uid).then(user => {
        Project.findById(req.params.pid).then(proj => {
            let uidx = user.projects_joined.indexOf(proj._id)
            let pidx = proj.developers.indexOf(user._id)
            if(uidx != -1 && pidx != -1) {
                user.projects_managed.push(user.projects_joined.splice(uidx, 1))
                user.save().then(() => {
                    proj.managers.push(proj.developers.splice(pidx, 1))
                    proj.save().then(() => {
                        res.json(proj)
                    })
                })
            } else {
                res.json({ msg: "User not found" })
            }
        })
    })
})

router.post("/comment/add/:pid", (req, res) => {
    Comment.create(req.body).then(com => {
        Project.findById(req.params.pid).then(proj => {
            proj.feed.push(com._id)
            proj.save().then(() => {
                res.json(proj)
            })
        })
    })
})

router.put("/comment/remove/:pid/:cid", (req, res) => {
    Project.findById(req.params.pid).then(proj => {
        Comment.findById(req.params.cid).then(com => {
            let idx = proj.feed.indexOf(com._id)
            if (idx != -1) {
                proj.feed.splice(idx, 1)
                proj.save().then(() => {
                    Comment.findByIdAndDelete(req.params.cid).then(() => {
                        res.json(proj)
                    })
                })
            } else {
                res.json({ msg: "Comment not found" })
            }
        })
    })
})

router.get("/comment/test/all", (req, res) => {
    Comment.find().then(coms => {
        res.json(coms)
    })
})

//@route        /project/:pid
//@desc         DELETE specific route
//@cascades     Comments, Events, Tickets
router.delete("/:pid", (req, res) => {
    Project.findById(req.params.pid).then(proj => {
        proj.feed.forEach(id => {
            Comment.findByIdAndDelete(id).catch(err => { throw err })
        })
        proj.tickets.forEach(id => {
            Ticket.findByIdAndDelete(id).catch(err => { throw err })
        })
    }).then(() => {
        Project.findByIdAndDelete(req.params.pid).then(() => {
            Project.find().then(projs => {
                res.json(projs)
            })
        })
    })
})

module.exports = router