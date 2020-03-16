const chai = require("chai")
const expect = require("chai").expect
const http = require("chai-http")

chai.use(http)

describe("Routes for Ticket", () => {
    let User
    let Project
    let Ticket
    let Comment
    let app

    before(function (done) {
        this.timeout(4000)

        User = require("../models/User")
        Project = require("../models/Project")
        Ticket = require("../models/Ticket")
        Comment = require("../models/Comment")
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
                    Comment.deleteMany().then(() => {
                        done()
                    })
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

    it("should post a ticket to a project", done => {
        let newTicket

        User.findOne({ name: "user two" }).then(user => {
            Project.findOne({ name: "proj one" }).then(proj => {
                newTicket = {
                    issue: "ticket post test",
                    submitter: user._id,
                    project: proj._id
                }
            }).then(() => {
                chai.request(app)
                    .post("/ticket")
                    .send(newTicket)
                    .then(res => {
                        expect(res.body.issue).to.equal(newTicket.issue)
                        expect(res.body.submitter).to.contain(newTicket.submitter)
                        expect(res.body.project).to.contain(newTicket.project)
                        done()
                    })
            })
        })
    })

    it("should assign user to ticket", done => {
        User.findOne({ name: "user one" }).then(user => {
            Ticket.findOne({ issue: "ticket post test"} ).then(ticket => {
                expect(ticket.developers.length).to.equal(0)
                chai.request(app)
                    .put(`/ticket/assign/${user._id}/${ticket._id}`)
                    .then(res => {
                        expect(res.body.developers.length).to.equal(1)
                        expect(res.body.developers[0]).to.contain(user._id)
                        done()
                    })
            })
        })
    })

    it("should remove user from ticket", done => {
        User.findOne({ name: "user one" }).then(user => {
            Ticket.findOne({ issue: "ticket post test"} ).then(ticket => {
                expect(ticket.developers.length).to.equal(1)
                chai.request(app)
                    .put(`/ticket/remove/${user._id}/${ticket._id}`)
                    .then(res => {
                        expect(res.body.developers.length).to.equal(0)
                        expect(res.body.msg).to.be.undefined
                        done()
                    })
            })
        })
    })

    it("should update issue name", done => {
        Ticket.findOne({ issue: "ticket post test"} ).then(ticket => {
            chai.request(app)
                .put(`/ticket/info/${ticket._id}`)
                .send({ issue: "put test" })
                .then(res => {
                    expect(res.body.issue).to.equal("put test")
                    expect(res.body.status).to.equal(ticket.status)
                    expect(res.body.due_date).to.equal(ticket.due_date)
                    done()
                })
        })
    })

    it("should update status", done => {
        Ticket.findOne({ issue: "put test"} ).then(ticket => {
            chai.request(app)
                .put(`/ticket/info/${ticket._id}`)
                .send({ status: "In Progress" })
                .then(res => {
                    expect(res.body.issue).to.equal(ticket.issue)
                    expect(res.body.status).to.equal("In Progress")
                    expect(res.body.due_date).to.equal(ticket.due_date)
                    done()
                })
        })
    })

    it("should update due date", done => {
        Ticket.findOne({ issue: "put test"} ).then(ticket => {
            let dueDate = new Date()
            dueDate.setDate(dueDate.getDate() + 7)
            chai.request(app)
                .put(`/ticket/info/${ticket._id}`)
                .send({ due_date: dueDate})
                .then(res => {
                    expect(res.body.issue).to.equal(ticket.issue)
                    expect(res.body.status).to.equal(ticket.status)
                    expect(res.body.due_date).to.equal(dueDate.toISOString())
                    done()
                })
        })
    })

    it("should toggle enable due date", done => {
        Ticket.findOne({ issue: "put test"} ).then(ticket => {
            expect(ticket.enable_due_date).to.equal(true)
            chai.request(app)
                .put(`/ticket/toggledue/${ticket._id}`)
                .then(res => {
                    expect(res.body.enable_due_date).to.not.equal(ticket.enable_due_date)
                    expect(res.body.enable_due_date).to.equal(false)
                    done()
                })
        })
    })

    it("should post new comment to ticket", done => {
        let newComment
        Ticket.findOne({ issue: "put test" }).then(ticket => {
            expect(ticket.comments.length).to.equal(0)
            User.findOne({ name: "user one" }).then(user => {
                newComment = {
                    message: "comment one",
                    user: user._id
                }
                chai.request(app)
                    .post(`/ticket/comment/add/${ticket._id}`)
                    .send(newComment)
                    .then(res => {
                        expect(res.body.comments.length).to.equal(1)
                        done()
                    })
            })
        })
    })

    it("should have correct info on comment", done => {
        Ticket.findOne({ issue: "put test" }).then(ticket => {
            expect(ticket.comments.length).to.equal(1)
            User.findOne({ name: "user one" }).then(user => {
                chai.request(app)
                    .get("/ticket/comment/test/all")
                    .then(res => {
                        expect(res.body.length).to.equal(1)
                        expect(res.body[0].message).to.equal("comment one")
                        expect(res.body[0].user).to.contain(user._id)
                        done()
                    })
            })
        })
    })

    it("should remove a comment", done => {
        Ticket.findOne({ issue: "put test" }).then(ticket => {
            expect(ticket.comments.length).to.equal(1)
            Comment.findOne({ message: "comment one" }).then(com => {
                chai.request(app)
                    .put(`/ticket/comment/remove/${ticket._id}/${com._id}`)
                    .then(res => {
                        expect(res.body.comments.length).to.equal(0)
                        done()
                    })
            })
        })
    })

    it("should delete a ticket", done => {
        Ticket.findOne({ issue: "put test" }).then(ticket => {
            chai.request(app)
                .delete(`/ticket/${ticket._id}`)
                .then(res => {
                    expect(res.body.length).to.equal(1)
                    expect(res.body.filter(arr => arr.issue === "put test").length).to.equal(0)
                    done()
                })
        })
    })
})