const express = require("express")
const router = express.Router()

const Project = require("../models/Project")
const User = require("../models/User")

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
    Project.findById(req.params.pid).then(proj => {
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

//@route        /project/developer/:uid/:pid
//@desc         REMOVES user from project
router.put("/developer/:uid/:pid", (req, res) => {
    User.findById(req.params.uid).then(user => {
        Project.findById(req.params.pid).then(proj => {
            let uidx = user.projects_joined.indexOf(req.params.pid)
            user.projects_joined.splice(uidx, 1)
            user.save().then(() => {
                let pidx = proj.developers.indexOf(req.params.uid)
                proj.developers.splice(pidx, 1)
                proj.save().then(() => {
                    res.json(proj)
                })
            })
        })
    })
})

//@route        /project/:pid
//@desc         DELETE specific route
router.delete("/:pid", (req, res) => {
    Project.findByIdAndDelete(req.params.pid).then(() => {
        Project.find().then(projs => {
            res.json(projs)
        })
    })
})

module.exports = router