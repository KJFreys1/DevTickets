import React from "react"
import "./Profile.css"

export default function Profile() {
    return (
        <div id="profile">
            <div class="profile-left-side">
                <h1 class="profile-greeting">Hello, ____</h1>
                <div class="profile-container">
                    <div class="profile-item-container">
                        <h1 class="profile-item">My Projects</h1>
                    </div>
                    <div class="profile-item-container">
                        <h1 class="profile-item">My Tickets</h1>
                    </div>
                    <div class="profile-item-container">
                        <h1 class="profile-item">Inbox</h1>
                    </div>
                </div>
            </div>
            <div class="profile-right-side">
                <div class="profile-pic-placeholder"></div>
                <div class="profile-info-container">
                    <div class="profile-info-item-container">
                        <h1 class="profile-info-item">Edit Profile</h1>
                    </div>
                    <div class="profile-info-item-container">
                        <h1 class="profile-info-item">Change Picture</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}