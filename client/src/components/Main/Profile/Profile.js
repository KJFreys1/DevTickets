import React, { useEffect, useState } from "react"
import { Route, Redirect } from "react-router-dom"
import NewUser from "../../Register/NewUser"
import "./Profile.css"
import { useAuth0 } from "../../../react-auth0-spa";
import axios from "axios"

export default function Profile() {
    const { loading, user } = useAuth0()
    let [devUser, setDevUser] = useState()
    let [isFetching, setFetching] = useState(true)

    const BASEURL = "http://dev-tickets.herokuapp.com"

    const postNewUser = userInfo => {
        axios.post(BASEURL + '/user', userInfo).then(postedUser => {
            setDevUser(postedUser.data)
        }).catch(err => console.log(err))
    }

    useEffect(() => {
        if (user) {
            axios.get(BASEURL + `/user/check_email/${user.email}`).then(existingUser => {
                if (existingUser.data) {
                    setDevUser(existingUser.data)
                } else {
                    setFetching(false)
                }
            })
        }
    }, [user])

    //Conditions
    //First to pass
    if (loading || !user) {
        console.log(1)
        return <div>Loading...</div>;
    }

    //Third to pass
    if (!isFetching) {
        console.log(3)
        return <NewUser email={user.email} postNewUser={postNewUser} />
    }

    //Second to pass
    if (!devUser) {
        console.log(2)
        return <div>loading...</div>
    }

    const { name } = devUser

    return (
        <div id="profile">
            <div className="profile-left-side">
                <h1 className="profile-greeting">Hello, {name}</h1>
                <div className="profile-container">
                    <div className="profile-item-container">
                        <h1 className="profile-item">My Projects</h1>
                    </div>
                    <div className="profile-item-container">
                        <h1 className="profile-item">My Tickets</h1>
                    </div>
                    <div className="profile-item-container">
                        <h1 className="profile-item">Inbox</h1>
                    </div>
                </div>
            </div>
            <div className="profile-right-side">
                <div className="profile-pic-placeholder"></div>
                <div className="profile-info-container">
                    <div className="profile-info-item-container">
                        <h1 className="profile-info-item">Edit Profile</h1>
                    </div>
                    <div className="profile-info-item-container">
                        <h1 className="profile-info-item">Change Picture</h1>
                    </div>
                    <div className="profile-info-item-container">
                        <h1 className="profile-info-item">Logout</h1>
                    </div>
                </div>
            </div>
            <div className="routes">

            </div>
        </div>
    )
}