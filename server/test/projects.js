const chai = require("chai")
const expect = require("chai").expect
const http = require("chai-http")

chai.use(http)

describe("Routes for Project", () => {
    let User
    let Project
    let Comment
    let app

    let testUID
    let testPID
    let testCID
    let testDevID

    before(function (done) {
        this.timeout(4000)
        User = require("../models/User")
        Project = require("../models/Project")
        Comment = require("../models/Comment")
        app = require("../server")

        User.create({
            name: "TEST USER",
            email: "t@t",
            password: "123"
        }).then(user => {
            Promise.all([
                Project.create({
                    name: "test proj one",
                    description: "PROJ TEST"
                }).then(proj => {
                    proj.managers.push(user._id)
                    user.projects_managed.push(proj._id)
                    proj.save()
                }),
                Project.create({
                    name: "test proj two",
                    description: "PROJ TEST"
                }).then(proj => {
                    proj.developers.push(user._id)
                    user.projects_joined.push(proj._id)
                    proj.save()
                }),
                Project.create({
                    name: "test proj three",
                    description: "PROJ TEST"
                })
            ]).then(() => {
                user.save().then(() => {
                    User.create({
                        name: "put test for proj",
                        email: "t@t",
                        password: "123"
                    }).then(() => {
                        done()
                    })
                })
            })
        })
    })

    after(done => {
        User.deleteMany({ email: "t@t" }).then(() => {
            Project.deleteMany({ description: "PROJ TEST" }).then(() => {
                Comment.deleteMany().then(() => {
                    done()
                })
            })
        })
    })

    describe("GET user", () => {
        it("should get user by name", done => {
            chai.request(app)
                .get("/user/name/TEST USER")
                .then(res => {
                    expect(res.body.name).to.equal("TEST USER")
                    done()
                })
        })
    })

    describe("GET project", () => {
        it("should get all projects", done => {
            chai.request(app)
                .get("/project")
                .then(res => {
                    expect(res.body.length).to.equal(3)
                    done()
                })
        })

        it("should get all projects connected to user", done => {
            User.findOne({ name: "TEST USER" }).then(user => {
                testUID = user._id
                let path = `/project/uid/${testUID}`
                chai.request(app)
                    .get(path)
                    .then(res => {
                        expect(res.body.length).to.equal(2)
                        expect(res.body[0].name).to.equal("test proj one")
                        expect(res.body[0].managers[0]).to.contain(user._id)
                        expect(res.body[1].name).to.equal("test proj two")
                        expect(res.body[1].developers[0]).to.contain(user._id)
                        done()
                    })
            })
        })

        it("should get a specific user", done => {
            chai.request(app)
                .get(`/user/uid/${testUID}`)
                .then(res => {
                    expect(res.body.name).to.equal("TEST USER")
                    done()
                })
        })

        it("should get specifc project", done => {
            Project.find({}).then(projs => {
                chai.request(app)
                    .get(`/project/pid/${projs[0]._id}`)
                    .then(res => {
                        expect(res.body.name).to.equal(projs[0].name)
                        done()
                    }).catch(err => console.log(err))
            })
        })

        it("should create a new project", done => {
            let newProject = {
                name: "post test",
                description: "PROJ TEST",
                managers: [testUID]
            }

            chai.request(app)
                .post(`/project/${testUID}`)
                .send(newProject)
                .then(res => {
                    testPID = res.body._id
                    expect(res.body.name).to.equal(newProject.name)
                    expect(res.body.managers[0]).to.contain(testUID)
                    done()
                }).catch(err => { throw err })
        })

        it("should update project info", done => {
            let updatedProject = {
                name: "put test",
                description: "PROJ TEST"
            }

            Project.findOne({ name: "test proj one" }).then(proj => {
                expect(proj.managers.length).to.equal(1)
                chai.request(app)
                    .put(`/project/${proj._id}`)
                    .send(updatedProject)
                    .then(res => {
                        expect(res.body.name).to.equal(updatedProject.name)
                        expect(res.body.managers.length).to.equal(1)
                        done()
                    })
            })
        })

        it("should add developer to a project", done => {
            User.findOne({ name: "put test for proj" }).then(user => {
                Project.findOne({ name: "test proj two" }).then(proj => {
                    testDevID = user._id
                    expect(proj.developers.length).to.equal(1)
                    chai.request(app)
                        .put(`/project/developer/${testDevID}/${proj._id}`)
                        .then(res => {
                            expect(res.body.developers.length).to.equal(2)
                            done()
                        })
                })
            })
        })

        it("should add manager to a project", done => {
            Project.findOne({ name: "put test" }).then(proj => {
                expect(proj.managers.length).to.equal(1)
                chai.request(app)
                    .put(`/project/manager/${testDevID}/${proj._id}`)
                    .then(res => {
                        expect(res.body.managers.length).to.equal(2)
                        done()
                    })
            })
        })

        it("should demote manager to developer in a project", done => {
            Project.findOne({ name: "put test" }).then(proj => {
                expect(proj.managers.length).to.equal(2)
                expect(proj.developers.length).to.equal(0)
                chai.request(app)
                    .put(`/project/demote/${testDevID}/${proj._id}`)
                    .then(res => {
                        expect(res.body.managers.length).to.equal(1)
                        expect(res.body.developers.length).to.equal(1)
                        expect(res.body.developers[0]).to.contain(testDevID)
                        expect(res.body.msg).to.be.undefined
                        done()
                    })
            })
        })

        it("should promote developer to manager in a project", done => {
            Project.findOne({ name: "put test" }).then(proj => {
                expect(proj.managers.length).to.equal(1)
                expect(proj.developers.length).to.equal(1)
                chai.request(app)
                    .put(`/project/promote/${testDevID}/${proj._id}`)
                    .then(res => {
                        expect(res.body.managers.length).to.equal(2)
                        expect(res.body.managers[1]).to.contain(testDevID)
                        expect(res.body.developers.length).to.equal(0)
                        expect(res.body.msg).to.be.undefined
                        done()
                    })
            })
        })

        it("should remove user from a project", done => {
            Project.findOne({ name: "test proj two" }).then(proj => {
                expect(proj.developers.length).to.equal(2)
                chai.request(app)
                    .put(`/project/remove/${testUID}/${proj._id}`)
                    .then(res => {
                        expect(res.body.developers.length).to.equal(1)
                        done()
                    })
            })
        })

        it("should add comment to project", done => {
            let newComment
            User.findOne({ name: "TEST USER" }).then(user => {
                newComment = {
                    message: "Comment one",
                    user: user._id
                }
            }).then(() => {
                chai.request(app)
                    .post(`/project/comment/add/${testPID}`)
                    .send(newComment)
                    .then(res => {
                        testCID = res.body.project.feed[0]
                        expect(res.body.project.feed.length).to.equal(1)
                        done()
                    })
            })
        })

        it("should add second comment to project", done => {
            let newComment
            User.findOne({ name: "TEST USER" }).then(user => {
                newComment = {
                    message: "Comment two",
                    user: user._id
                }
            }).then(() => {
                chai.request(app)
                    .post(`/project/comment/add/${testPID}`)
                    .send(newComment)
                    .then(res => {
                        expect(res.body.project.feed.length).to.equal(2)
                        done()
                    })
            })
        })

        it("should have comments with correct information", done => {
            chai.request(app)
                .get(`/project/pid/${testPID}`)
                .then(res => {
                    expect(res.body.feed.length).to.equal(2)
                    expect(res.body.feed[0].message).to.equal("Comment one")
                    expect(res.body.feed[1].message).to.equal("Comment two")
                    done()
                })
        })

        it("should remove comment from project", done => {
            chai.request(app)
                .put(`/project/comment/remove/${testPID}/${testCID}`)
                .then(res => {
                    expect(res.body.feed.length).to.equal(1)
                    expect(res.body.msg).to.be.undefined
                    done()
                })
        })

        it("should delete a project", done => {
            chai.request(app)
                .delete(`/project/${testPID}`)
                .then(res => {
                    expect(res.body.length).to.equal(3)
                    done()
                })
        })

        it("should not have existing comments", done => {
            chai.request(app)
                .get("/project/comment/test/all")
                .then(res => {
                    expect(res.body.length).to.equal(0)
                    done()
                })
        })
    })
})