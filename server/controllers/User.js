const express = require("express")
const router = express.Router()

const User = require("../models/User")

router.get("/", (req, res) => {
    User.find({})
        .select("-password")
        .then(users => {
            res.json(users)
        })
})

router.get("/name/:name", (req, res) => {
    User.findOne({ name: req.params.name })
        .select("-password")
        .then(user => {
            res.json(user)
        })
})

router.get("/uid/:uid", (req, res) => {
    User.findById(req.params.uid)
        .select("-password")
        .then(user => {
            res.json(user)
        })
})

router.get("/check_email/:email", (req, res) => {
    User.findOne({ email: req.params.email })
        .select("-password")
        .then(user => {
            res.json(user)
        }).catch(() => res.json(null))
})

router.post("/", (req, res) => {
    User.create(req.body)
        .select("-password")
        .then(user => {
            res.json(user)
        })
})

router.put("/:uid", (req, res) => {
    User.findById(req.params.uid)
        .select("-password")
        .then(user => {
            user = req.body
            res.json(user)
        })
})

router.delete("/:uid", (req, res) => {
    User.findByIdAndDelete(req.params.uid).then(() => {
        User.find({})
            .select("-password")
            .then(users => {
                res.json(users)
            })
    })
})

module.exports = router