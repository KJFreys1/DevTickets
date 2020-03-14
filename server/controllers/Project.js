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