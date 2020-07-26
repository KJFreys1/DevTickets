import React from 'react'
import "./Loading.css"

export default function Loading() {
    return (
        <div id="ld">
            {/* <h1 className='ld-msg'>Loading...</h1>
            <div className="ld-symbol"></div> */}
            <div className="ld-elem">
                <h1 className="ld-msg">Loading...</h1>
                <div className="ld-symbol"></div>
            </div>
        </div>
    )
}