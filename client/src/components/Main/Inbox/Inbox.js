import React, { useEffect, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useAuth0 } from "../../../react-auth0-spa"
import axios from "axios"
import "./Inbox.css"

import Loading from '../../Loading'

export default function Inbox(props) {
    return (
        <div id="ix">
            <section className="ix-grp">
                <h1>Messages</h1>
                <div className="ix-grp-box">
                    <div className="ix-grp-elem">
                        <h1>Sam Smith</h1>
                    </div>
                    <div className="ix-grp-elem">
                        <h1>Eric Smith</h1>
                    </div>
                    <div className="ix-grp-elem">
                        <h1>Mathew Smith</h1>
                    </div>
                </div>
                <Link to="/profile">Back to profile</Link>
            </section>

            <section className="ix-msg">
                <div className="ix-msg-head">
                    <div className="ix-msg-pic-placeholder"></div>
                    <h1>Sam Smith</h1>
                </div>
                <div className="ix-msg-body">
                    <div className="ix-msg-elem ix-msg-left">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                    <div className="ix-msg-elem ix-msg-right">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit.</p>
                    </div>
                </div>
                <form className="ix-msg-form">
                    <textarea></textarea>
                </form>
            </section>
        </div>
    )
}