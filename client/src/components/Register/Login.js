import React, { useState } from "react"

export default function Login(props) {
    let [email, setEmail] = useState()
    let [password, setPassword] = useState()

    const handleEmailChange = e => {
        e.preventDefault()
        setEmail(e.target.value)
    }

    const handlePasswordChange = e => {
        e.preventDefault()
        setPassword(e.target.value)
    }

    const handleSubmit = e => {
        e.preventDefault()
        console.log('at submit')
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