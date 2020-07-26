import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useAuth0 } from "../../../react-auth0-spa"
import axios from "axios"
import "./TicketDetails.css"

import Loading from '../../Loading'

export default function TicketDetails(props) {
    const { user } = useAuth0()

    const BASEURL = "http://dev-tickets.herokuapp.com"

    return (
        <div id="tick-dets">
            <section className="tick-dets-left">
                <div className="tick-dets-btn-box">
                    <button>Button</button>
                    <button>Button</button>
                    <button>Button</button>
                </div>
                <div className="tick-dets-desc-box">
                    <h2 className="tick-dets-desc">Lorem ipsum dolor sit amet. consectetur adipisicing elit</h2>
                </div>
                <Link to="/profile">Back to profile</Link>
            </section>

            <section className="tick-dets-right">
                <h1 className="tick-dets-feed-title">Ticket Feed</h1>
                <div className="tick-dets-feed-box">
                    <div className="tick-dets-feed-elem">
                        <p>Lorem ipsum dolor sit amet. consectetur adipisicing elit</p>
                    </div>
                    <div className="tick-dets-feed-elem">
                        <p>Lorem ipsum dolor sit amet.</p>
                    </div>
                </div>
                <form className="tick-dets-form">
                    <textarea></textarea>
                </form>
            </section>
        </div>
    )
}