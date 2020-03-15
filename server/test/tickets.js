const chai = require("chai")
const expect = require("chai").expect
const http = require("chai-http")

chai.use(http)

describe("Routes for Ticket", () => {
    let User
    let Project
    let Ticket
    let app

    before(function (done) {
        this.timeout(4000)

        User = require("../models/User")
        Project = require("../models/Project")
        Ticket = require("../models/Ticket")
        app = require("../server")

        Promise.all([
            User.create({
                name: "user one",
                email: "t@t",
                password: "123"
            }),
            User.create({
                name: "user two",
                email: "t@t",
                password: "123"
            })
        ]).then(users => {
            Project.create({
                name: "proj one",
                description: "TEST PROJ"
            }).then(proj => {
                Ticket.create({
                    issue: "ticket one",
                    submitter: users[0]._id,
                    developers: [users[1]._id]
                }).then(ticket => {
                    proj.tickets.push(ticket._id)
                    proj.managers.push(users[0]._id)
                    users[0].projects_managed.push(proj._id)
                    users[0].tickets_issued.push(ticket._id)
                    proj.developers.push(users[1]._id)
                    users[1].projects_joined.push(proj._id)
                    users[1].tickets_assigned.push(ticket._id)
                    proj.save().then(() => {
                        users[0].save().then(() => {
                            users[1].save().then(() => {
                                done()
                            })
                        })
                    })
                })
            })
        })
    })

    after(done => {
        User.deleteMany({ email: "t@t" }).then(() => {
            Project.deleteMany({ description: "TEST PROJ" }).then(() => {
                Ticket.deleteMany().then(() => {
                    done()
                })
            })
        })
    })

    it("should have a new ticket", done => {
        chai.request(app)
            .get("/ticket")
            .then(res => {
                expect(res.body.length).to.equal(1)
                expect(res.body[0].issue).to.equal("ticket one")
                done()
            })
    })

    it("should get all tickets within project", done => {
        Project.findOne({ name: "proj one" }).then(proj => {
            expect(proj.tickets.length).to.equal(1)
            chai.request(app)
                .get(`/ticket/pid/${proj._id}`)
                .then(res => {
                    expect(res.body.length).to.equal(1)
                    expect(res.body[0]._id).to.contain(proj.tickets[0])
                    done()
                })
        })
    })

    it("should get all tickets issued by user", done => {
        User.findOne({ name: "user one" }).then(user => {
            expect(user.tickets_issued.length).to.equal(1)
            expect(user.tickets_assigned.length).to.equal(0)
            chai.request(app)
                .get(`/ticket/issued/${user._id}`)
                .then(res => {
                    expect(res.body.length).to.equal(1)
                    expect(res.body[0]._id).to.contain(user.tickets_issued[0])
                    done()
                }).catch(err => { throw err })
        })
    })

    it("should get all tickets assigned to user", done => {
        User.findOne({ name: "user two" }).then(user => {
            expect(user.tickets_issued.length).to.equal(0)
            expect(user.tickets_assigned.length).to.equal(1)
            chai.request(app)
                .get(`/ticket/assigned/${user._id}`)
                .then(res => {
                    expect(res.body.length).to.equal(1)
                    expect(res.body[0]._id).to.contain(user.tickets_assigned[0])
                    done()
                }).catch(err => { throw err })
        })
    })
})