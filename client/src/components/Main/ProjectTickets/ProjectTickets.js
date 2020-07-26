import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth0 } from "../../../react-auth0-spa";
import axios from 'axios'
import './ProjectTickets.css'

import Loading from '../../Loading'

export default function ProjectTickets(props) {
    return (
        <div id="proj-ticks">
            <div className="proj-tick-container">
                <div className="proj-tick-box">
                    <button>Blue</button>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                </div>

                <div className="proj-tick-box">
                    <button>Blue</button>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                </div>

                <div className="proj-tick-box">
                    <button>Blue</button>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                </div>

                <div className="proj-tick-box">
                    <button>Blue</button>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                    <div className="proj-tick-elem">
                        <p>Lorem ipsum solor sit amet, consectetur adipiscing elit, sed do eiusmod tempor</p>
                    </div>
                </div>
            </div>
        </div>
    )
}