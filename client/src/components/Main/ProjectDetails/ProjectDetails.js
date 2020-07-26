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

    const BASEURL = "http://dev-tickets.herokuapp.com"

    const handleDeleteProject = () => {
        axios.delete(BASEURL + `/project/${props.match.params.pid}`).then(() => {
            setRedirect(<Redirect to="/myprojects" />)
        })
    }

    const createMemberElem = (member, status) => {
        return (
            <div className="proj-dets-member" style={{backgroundColor: status}}>
                <h1>{member}</h1>
                <button>Remove*</button>
            </div>
        )
    }

    useEffect(() => {
        axios.get(BASEURL + `/project/pid/${props.match.params.pid}`).then(proj => {
            setProject(proj.data)
            setMemberListElem(proj.data.managers.map(member => {
                return createMemberElem(member.name, "lightgreen")
            }))
        })
    }, [user])

    // Refactor so if no project, display error on page then redirect
    if (!user || !project) {
        return <Loading />
    }

    console.log(memberListElem)
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
                    {memberListElem}
                </div>
            </section>
            <section className="proj-dets-right">
                <div className="proj-dets-feed-container">
                    <h1>Project Feed</h1>
                    <div className="proj-dets-feed">
                        <div className="proj-dets-msg-left">
                            <p>lorem ipsum sdad asda dsds ds a dsad</p>
                        </div>
                        <div className="proj-dets-msg-right">
                            <p>lorem ipsum sdad asda dsds ds a dsad</p>
                        </div>
                        <div className="proj-dets-msg-left">
                            <p>lorem ipsum sdad asda dsds ds a dsad</p>
                        </div>
                    </div>
                </div>
                <form className="proj-dets-form">
                    <textarea className="proj-dets-inpt"></textarea>
                    <button type="submit" className="proj-dets-submit">Submit</button>
                </form>
            </section>
        </div>
    )
}