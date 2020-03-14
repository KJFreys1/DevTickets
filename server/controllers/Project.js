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

module.exports = router