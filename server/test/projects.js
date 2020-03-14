const chai = require("chai")
const expect = require("chai").expect
const http = require("chai-http")

chai.use(http)

describe("Routes for Project", () => {
    let User
    let Project
    let app

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

        it("should find project by user id", done => {
            User.findOne({ name: "TEST USER" }).then(user => {
                let path = `/project/${user._id}`
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
    })
})