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
            console.log('here')
            Promise.all([
                Project.create({
                    name: "test proj one",
                    description: "PROJ TEST"
                }).then(proj => {
                    proj.managers.push(user._id)
                    user.projects_managed.push(proj._id)
                }),
                Project.create({
                    name: "test proj two",
                    description: "PROJ TEST"
                }).then(proj => {
                    proj.developers.push(user._id)
                    user.projects_joined.push(proj._id)
                }),
                Project.create({
                    name: "test proj three",
                    description: "PROJ TEST"
                })
            ]).then(() => {
                console.log(user)
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
        it("should find project by user id", done => {
            User.findOne({ name: "TEST USER" }).then(user => {
                let path = `/project/${user._id}`
                chai.request(app)
                    .get(path)
                    .then(res => {
                        expect(res.body.length).to.equal(2)
                        done()
                    })
            })
        })
    })
})