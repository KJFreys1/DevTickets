const chai = require("chai")
const expect = require("chai").expect
const http = require("chai-http")

chai.use(http)

describe("Routes", () => {
    this.timeout = 2000
    
    let User
    let Ticket
    let Project
    let MessageGroup
    let Message
    let Event
    let Comment
    let app = require("../server")

    before(function(done) {
        this.timeout(4000)

        User = require("../models/User")
        Ticket = require("../models/Ticket")
        Project = require("../models/Project")
        MessageGroup = require("../models/MessageGroup")
        Message = require("../models/Message")
        Event = require("../models/Event")
        Comment = require("../models/Comment")

        User.deleteMany({}).then(() => {
            Ticket.deleteMany({}).then(() => {
                Project.deleteMany({}).then(() => {
                    MessageGroup.deleteMany({}).then(() => {
                        Message.deleteMany({}).then(() => {
                            Event.deleteMany({}).then(() => {
                                Comment.deleteMany({}).then(() => done())
                            })
                        })
                    })
                })
            })
        })
    })

    after(done => {
        User.deleteMany({}).then(() => {
            Ticket.deleteMany({}).then(() => {
                Project.deleteMany({}).then(() => {
                    MessageGroup.deleteMany({}).then(() => {
                        Message.deleteMany({}).then(() => {
                            Event.deleteMany({}).then(() => {
                                Comment.deleteMany({})
                            })
                        })
                    })
                })
            })
        }).then(() => done())
    })

    describe("GET user model", () => {
        before(done => {
            User.create({
                name: "Test name",
                email: "test@email.com",
                password: "testpass"
            }).then(() => done())
        })

        it("should return correct new user", done => {
            User.findOne({}).then(user => {
                chai.request(app)
                    .get("/user")
                    .end((err, res) => {
                        expect(res.body.length).to.not.equal(0)
                        expect(res.body[0].name).to.contain(user.name)
                        expect(res.body[0].email).to.contain(user.email)
                        if (err) console.log(err)
                        done()
                    })
            }).catch(err => console.log(err))
        })
    })

    describe("POST user model", () => {
        let newUser = {
            name: "post test",
            email: "p@p",
            password: "123"
        }

        it("should post a new user", done => {
            chai.request(app)
                .post("/user")
                .send(newUser)
                .then(res => {
                    User.findOne({ name: "post test" }).then(() => {
                        expect(res.body).not.to.be.undefined
                        expect(res.body.name).to.contain(newUser.name)
                    }).catch(err => { throw err })
                    done()
                }).catch(err => { throw err })
        })
    })

    describe("PUT user model", () => {
        let newUser = {
            name: "put test",
            email: "p@p",
            password: "123"
        } 

        it("should edit existing user", done => {
            User.findOne({ name: "post test" }).then(user => {
                let path = `/user/${user._id}`
                chai.request(app)
                    .put(path)
                    .send(newUser)
                    .then(res => {
                        expect(res.body).not.to.be.undefined
                        expect(res.body.name).to.contain(newUser.name)
                        done()
                    }).catch(err => { throw err })
            }).catch(err => { throw err })
        })
    })

    describe("DELETE user model", () => {
        it("should delete existing user", done => {
            User.findOne({ name: "Test name" }).then(user => {
                let path = `/user/${user._id}`
                chai.request(app)
                    .delete(path)
                    .then(res => {
                        expect(res.body.length).to.equal(1)
                        done()
                    })
            })
        })
    })
})