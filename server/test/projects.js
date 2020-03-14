const chai = require("chai")
const expect = require("chai").expect
const http = require("chai-http")

chai.use(http)

describe("Routes for Project", () => {
    let User
    let Project
    let app

    let testUID

    before(function(done) {
        this.timeout(4000)
        User = require("../models/User")
        Project = require("../models/Project")
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
                user.save()
                done()
            })
        })
    })

    after(done => {
        User.findOneAndDelete({ name: "TEST USER" }).then(() => {
            Project.deleteMany({ description: "PROJ TEST" }).then(() => {
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
                        expect(res.body[0].name).to.contain("test proj one")
                        expect(res.body[0].managers[0]).to.contain(user._id)
                        expect(res.body[1].name).to.contain("test proj two")
                        expect(res.body[1].developers[0]).to.contain(user._id)
                        done()
                    })
            })
        })

        it("should get specifc project", done => {
            Project.find({}).then(projs => {
                chai.request(app)
                    .get(`/project/pid/${projs[0]._id}`)
                    .then(res => {
                        expect(res.body.name).to.contain(projs[0].name)
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
                    expect(res.body.name).to.equal(newProject.name)
                    expect(res.body.managers[0]).to.contain(testUID)
                    done()
                }).catch(err => { throw err })
        })
    })
})