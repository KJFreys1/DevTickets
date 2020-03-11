const express = require('express')
const cors = require('cors')
const parser = require('body-parser')
const app = express()

app.use(cors())
app.use(parser.urlencoded({ extended: true} ))
app.use(parser.json())

const PORT = process.env.PORT || 4000

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))