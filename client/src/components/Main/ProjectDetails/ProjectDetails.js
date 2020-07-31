import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useAuth0 } from "../../../react-auth0-spa"
import axios from "axios"

import Loading from '../../Loading'

import './ProjectDetails.css'

export default function ProjectDetails(props) {
    const { user } = useAuth0()
    let [redirectPath, setRedirect] = useState(null)
    let [project, setProject] = useState(false)
    let [memberListElem, setMemberListElem] = useState([])
    let [managerListElem, setManagerListElem] = useState([])
    let [feedListElem, setFeedListElem] = useState([])
    let [userMessage, setUserMessage] = useState("")
    let [isManager, setIsManager] = useState(false)

    const BASEURL = "http://dev-tickets.herokuapp.com"

    const handleDeleteProject = () => {
        axios.delete(BASEURL + `/project/${props.match.params.pid}`).then(() => {
            setRedirect(<Redirect to="/myprojects" />)
        })
    }

    const handleUserMessageChange = e => {
        setUserMessage(e.target.value)
    }

    const handleFormSubmit = e => {
        e.preventDefault()
        const comment = {
            message: userMessage,
            user: props.devUser._id
        }
        axios.post(BASEURL + `/project/comment/add/${project._id}`, comment).then(res => {
            let tempFeedList = [...feedListElem]
            tempFeedList.push(createFeedElem(res.data.comment.message, props.devUser.name, res.data.comment._id))
            setFeedListElem(tempFeedList)
        })
        setUserMessage("")
    }

    const createMemberElem = (member, status) => {
        return (
            <div className="proj-dets-member" key={member._id} style={{ backgroundColor: status }}>
                <h1>{member.name}</h1>
                <button>Remove*</button>
            </div>
        )
    }

    const createFeedElem = (message, user, key) => {
        return (
            <div className="proj-dets-msg-left" key={key}>
                <p>{user}</p>
                <p>{message}</p>
            </div>
        )
    }

    const fetchProjData = (devUser=props.devUser) => {
        axios.get(BASEURL + `/project/pid/${props.match.params.pid}`).then(proj => {
            setProject(proj.data)
            setMemberListElem(proj.data.developers.map(member => {
                return createMemberElem(member, "lightgreen")
            }))
            setManagerListElem(proj.data.managers.map(member => {
                if (member._id === devUser._id && !isManager) {
                    setIsManager(true)
                }
                return createMemberElem(member, "lightblue")
            }))
            setFeedListElem(proj.data.feed.map(feed => {
                return createFeedElem(feed.message, feed.user.name, feed._id)
            }))
        })
    }

    useEffect(() => {
        if (user && !props.devUser) {
            axios.get(BASEURL + `/user/check_email/${user.email}`).then(existingUser => {
                if (existingUser.data) {
                    props.setDevUser(existingUser.data)
                    fetchProjData(existingUser.data)
                }
            })
        } else if (user && props.devUser) {
            console.log(user)
            console.log(props.devUser)
            fetchProjData()
        }
    }, [user])

    // Refactor so if no project, display error on page then redirect
    if (!user || !project) {
        return <Loading />
    }

    return (
        <div id="proj-dets">
            {redirectPath}
            <section className="proj-dets-left">
                <div className="proj-dets-header">
                    <h1>{project.name}</h1><button onClick={handleDeleteProject} style={{ backgroundColor: "red", color: "white", display: "block", margin: "auto" }}>TEST DELETE PROJECT</button>
                    <button>Leave Project</button>
                    <p>{project.description}</p>
                </div>
                <div className="proj-dets-team">
                    {managerListElem}
                    {memberListElem}
                </div>
            </section>
            <section className="proj-dets-right">
                <div className="proj-dets-feed-container">
                    <h1>Project Feed</h1>
                    <div className="proj-dets-feed">
                        {feedListElem}
                    </div>
                </div>
                <form className="proj-dets-form" onSubmit={handleFormSubmit}>
                    <textarea className="proj-dets-inpt" value={userMessage} onChange={handleUserMessageChange}></textarea>
                    <button type="submit" className="proj-dets-submit">Submit</button>
                </form>
                <Link to="/profile">Back to profile</Link><br></br>
                <Link to="/myprojects">Back to my projects</Link>
            </section>
        </div>
    )
}