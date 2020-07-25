import React from 'react'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from "../../../react-auth0-spa";
import axios from 'axios'

import Loading from '../../Loading'

export default function MyProjects(props) {
    const { user } = useAuth0()

    const BASEURL = "http://dev-tickets.herokuapp.com"

    useEffect(() => {
        if (user && !props.devUser) {
            axios.get(BASEURL + `/user/check_email/${user.email}`).then(existingUser => {
                if (existingUser.data) {
                    props.setDevUser(existingUser.data)
                }
            })
        }
    }, [user])

    if (!props.devUser) {
        return <Loading />
    }

    let projList = props.devUser.projects_managed
    projList.concat(props.devUser.projects_joined)

    let projListElem = null
    if (projList.length > 0) {
        projList.map(proj => {
            console.log(proj)
            return (
                <div className="proj-list-elem">
                    <h1>{proj.name}</h1>
                    <button>Details</button>
                    <button>Tickets</button>
                </div>
            )
        })
    }

    return (
        <div id="my-projs">
            <h1 className="my-proj-title">My Projects</h1>
            <div className="proj-list">
                {projListElem}
            </div>
            <Link to="/profile">Back to Profile</Link>
        </div>
    )
}