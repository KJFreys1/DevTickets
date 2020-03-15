const express = require('express')
const cors = require('cors')
const parser = require('body-parser')
const app = express()

app.use(cors())
app.use(parser.urlencoded({ extended: true} ))
app.use(parser.json())

const userController = require("./controllers/User")
const commentController = require("./controllers/Comment")
const projectController = require("./controllers/Project")
const ticketController = require("./controllers/Ticket")

app.use("/user", userController)
app.use("/comment", commentController)
app.use("/project", projectController)
app.use("/ticket", ticketController)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

module.exports = app