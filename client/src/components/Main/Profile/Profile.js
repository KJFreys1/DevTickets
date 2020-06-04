import React from "react"
import "./Profile.css"
import { useAuth0 } from "../../../react-auth0-spa";

export default function Profile() {
    const { loading, user } = useAuth0();

    if (loading || !user) {
        return <div>Loading...</div>;
    }

    const { name } = user
    console.log(name)
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
        </div>
    )
}