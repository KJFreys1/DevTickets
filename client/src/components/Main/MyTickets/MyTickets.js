import React, { useState, useEffect } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { useAuth0 } from "../../../react-auth0-spa"
import axios from "axios"
import "./MyTickets.css"

import Loading from '../../Loading'

export default function MyTickets(props) {
    const { user } = useAuth0()

    const BASEURL = "http://dev-tickets.herokuapp.com"

    return (
        <div id="my-ticks">
            <h1 className="my-tick-title">My Tickets</h1>
            <div className="my-tick-container">
                <section className="my-tick-req">
                    <h1 className="my-tick-box-title">Requested</h1>
                    <div className="my-tick-box">
                        <h3 className="my-tick-name">Lorem ipsum dolor sit amet</h3>
                        <Link to="ticket/1">Details</Link>
                        <button>Pick Up</button>
                    </div>
                    <div className="my-tick-box">
                        <h3 className="my-tick-name">Lorem ipsum dolor sit amet</h3>
                        <button>Details</button>
                        <button>Pick Up</button>
                    </div>
                </section>

                <section className="my-tick-ip">
                    <h1 className="my-tick-box-title">In Progress</h1>
                    <div className="my-tick-box">
                        <h3 className="my-tick-name">Lorem ipsum dolor sit amet</h3>
                        <button>Details</button>
                        <button>Finish</button>
                    </div>
                    <div className="my-tick-box">
                        <h3 className="my-tick-name">Lorem ipsum dolor sit amet</h3>
                        <button>Details</button>
                        <button>Finish</button>
                    </div>
                    <div className="my-tick-box">
                        <h3 className="my-tick-name">Lorem ipsum dolor sit amet</h3>
                        <button>Details</button>
                        <button>Finish</button>
                    </div>
                </section>

                <section className="my-tick-closed">
                    <h1 className="my-tick-box-title">Closed</h1>
                    <div className="my-tick-box">
                        <h3 className="my-tick-name">Lorem ipsum dolor sit amet</h3>
                        <button>Details</button>
                        <button>Reopen</button>
                    </div>
                </section>
            </div>
            <Link to="/profile">Back to profile</Link>
        </div>
    )
}