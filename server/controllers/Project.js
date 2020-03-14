const express = require("express")
const router = express.Router()

const Project = require("../models/Project")
const User = require("../models/User")

router.get("/", (req, res) => {
    Project.find({}).then(projs => {
        res.json(projs)
    })
})

router.get("/:uid", (req, res) => {
    Project.find({
        $or: [
            { developers: { $in: [req.params.uid] } },
            { managers: { $in: [req.params.uid] } }
        ] 
    }).then(projs => {
        res.json(projs)
    })
})

module.exports = router