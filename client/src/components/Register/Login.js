import React, { useState } from "react"

export default function Login(props) {
    let [email, updateEmail] = useState()
    let [password, updatePassword] = useState()

    const handleEmail = e => {
        e.preventDefault()
        updateEmail(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        props.login(email)
    }

    return (
        <div id="login-page">
            <div className="login-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input placeholder="email" value={email} onChange={handleEmail}></input>
                    <input placeholder="password"></input>
                    <button type="submit">Test</button>
                </form>
            </div>
        </div>
    )
}