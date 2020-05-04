import React from "react"
import "./Profile.css"

export default function Profile(props) {
    if (!props.user) props.history.push("/")

    const { name } = props.user ? props.user : ''
    console.log(props.user)
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
                        <h1 className="profile-info-item" onClick={props.logout}>Logout</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}