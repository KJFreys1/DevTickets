const Comment = require("../models/Comment")
const User = require("../models/User")

// Comment.create({ message: "hello test" })
//     .then(() => console.log('created comment'))
//     .catch(err => console.log(err))
User.deleteMany({}).then(() => {
    User.create({
        name: "test",
        email: "test email"
    }).then(() => console.log("created user"))
})