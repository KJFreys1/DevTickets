import React, { useState } from "react"

export default function Login(props) {
    let [email, updateEmail] = useState()
    let [password, updatePassword] = useState()

    const handleEmailChange = e => {
        e.preventDefault()
        updateEmail(e.target.value)
    }

    const handlePasswordChange = e => {
        e.preventDefault()
        updatePassword(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        const user = { email, password }
        props.login(user)
    }

    if (props.user) props.history.push("/profile")

    return (
        <div id="login-page">
            <div className="login-container">
                <h1>Login</h1>
                <form onSubmit={handleSubmit}>
                    <input placeholder="email" type="email" value={email} onChange={handleEmailChange} required></input>
                    <input placeholder="password" type="password" value={password} onChange={handlePasswordChange} required></input>
                    <button type="submit">Test</button>
                </form>
            </div>
        </div>
    )
}