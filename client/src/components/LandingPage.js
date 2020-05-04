import React from "react"
import { Link } from "react-router-dom"
import "./LandingPage.css"

export default function LandingPage(props) {
    const logoutButton = localStorage.token ? <button onClick={props.logout}>Logout</button> : null
    return (
        <div id="landing-page">
            <div className="lp-left-side">
                <h1 className="lp-title">Welcome to DevTickets</h1>
                <h2 className="lp-headline">Organization matters. That's why we're here.</h2>
                <p className="lp-desc">DevTickets intuitive toolset allows you to organize your projects work flow by establishing roles for your employees, assigning issues to your developers, and connecting your team with comments and personal messages.</p>
            </div>
            <div className="lp-right-side">
                <Link to="/login">Login</Link><br></br>
                <Link to="/register">Sign Up</Link>
                {logoutButton}
                <h2 className="lp-video-desc">Checkout how we can help you.</h2>
                <div className="iframe-placeholder"></div>
            </div>
        </div>
    )
}