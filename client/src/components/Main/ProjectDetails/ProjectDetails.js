import React, { useEffect, useState } from 'react'
import { useAuth0 } from "../../../react-auth0-spa"
import axios from "axios"

import Loading from '../../Loading'

import './ProjectDetails.css'

export default function ProjectDetails(props) {
    const { user } = useAuth0()
    let [project, setProject] = useState(false)

    const BASEURL = "http://dev-tickets.herokuapp.com"

    useEffect(() => {
        axios.get(BASEURL + `/project/pid/${props.match.params.pid}`).then(proj => {
            setProject(proj.data)
        })
    }, [user])

    if (!user || !project) {
        return <Loading />
    }

    console.log(project)
    return (
        <div id="proj-dets">
            <section className="proj-dets-left">
                <div className="proj-dets-header">
                    <h1>{project.name}</h1><button style={{backgroundColor: "red", color: "white", display: "block", margin: "auto"}}>TEST DELETE PROJECT</button>
                    <button>Leave Project</button>
                    <p>{project.description}</p>
                </div>
                <div className="proj-dets-team">
                    <div className="proj-dets-member">
                        <h1>Sam Jenkins</h1>
                        <button>Remove*</button>
                    </div>
                    <div className="proj-dets-member">
                        <h1>Eric Smith</h1>
                        <button>Remove*</button>
                    </div>
                    <button>Add Developer*</button>
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