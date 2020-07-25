import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from "../../../react-auth0-spa";
import axios from 'axios'
import './MyProjects.css'

import Loading from '../../Loading'

export default function MyProjects(props) {
    const { user } = useAuth0()
    let [projListElem, setProjListElem] = useState([])
    let [displayForm, setDisplayForm] = useState("none")
    let [projTitle, setProjTitle] = useState("")
    let [projDesc, setProjDesc] = useState("")

    const BASEURL = "http://dev-tickets.herokuapp.com"

    const createProjListElement = proj => {
        return (
            <div className="proj-list-elem" key={proj._id}>
                <h1 className="proj-list-name">{proj.name}</h1>
                <Link to={`/project/${proj._id}`} className="proj-list-btn">Details</Link>
                <button className="proj-list-btn">Tickets</button>
            </div>
        )
    }

    const getProjects = () => {
        axios.get(BASEURL + `/project/uid/${props.devUser._id}`).then(projs => {
            setProjListElem(projs.data.map(proj => {
                return createProjListElement(proj)
            }))
        })
    }

    const handleDisplayFormSwitch = () => {
        if (displayForm === "none") {
            setDisplayForm("block")
        } else {
            setDisplayForm("none")
        }
    }

    const handleProjTitleChange = e => {
        setProjTitle(e.target.value)
    }

    const handleProjDescChange = e => {
        setProjDesc(e.target.value)
    }

    const handleFormSubmit = e => {
        e.preventDefault()
        let newProjData = { 
            name: projTitle, 
            description: projDesc, 
            managers: [props.devUser._id] 
        }
        newProject(newProjData)
        setProjTitle("")
        setProjDesc("")
    }

    const newProject = data => {
        axios.post(BASEURL + `/project/${props.devUser._id}`, data).then(proj => {
            setProjListElem(projListElem.push(createProjListElement(proj)))
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        if (user && !props.devUser) {
            axios.get(BASEURL + `/user/check_email/${user.email}`).then(existingUser => {
                if (existingUser.data) {
                    props.setDevUser(existingUser.data)
                }
            })
        } else if (props.devUser) {
            getProjects()
        }
    }, [user])
    
    if (!props.devUser) {
        return <Loading />
    }

    if (!projListElem[0]) {
        getProjects()
    }

    return (
        <div id="my-projs">
            <h1 className="my-proj-title">My Projects</h1>
            <div className="proj-list">
                {projListElem}
            </div>
            <button onClick={handleDisplayFormSwitch}>New project</button>
            <form onSubmit={handleFormSubmit} style={{display: displayForm}}>
                <input value={projTitle} onChange={handleProjTitleChange}></input>
                <textarea value={projDesc} onChange={handleProjDescChange}></textarea>
                <button type="submit">Submit</button>
            </form>
            <Link to="/profile">Back to Profile</Link>
        </div>
    )
}