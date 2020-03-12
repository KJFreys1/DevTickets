const express = require("express")
const router = express.Router()

const Comment = require("../models/Comment")

router.get("/", (req, res) => {
    Comment.find().then(coms => {
        res.json(coms)
    })
})

router.post("/", (req, res) => {
    Comment.create(req.body).then(com => {
        res.json(com)
    })
})

module.exports = router