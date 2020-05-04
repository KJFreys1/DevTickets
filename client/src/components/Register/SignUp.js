import React, { useState } from "react"

export default function SignUp(props) {
    let [name, setName] = useState()
    let [email, setEmail] = useState()
    let [password, setPassword] = useState()

    const handleNameChange = e => {
        e.preventDefault()
        setName(e.target.value)
    }

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
        const user = { name, email, password }
        props.register(user)
    }

    if (props.user) props.history.push("/profile")

    return (
        <div id="login-page">
            <div className="login-container">
                <h1>Sign Up</h1>
                <form onSubmit={handleSubmit}>
                    <input placeholder="name" type="text" id="name" value={name} onChange={handleNameChange} required></input>
                    <input placeholder="email" type="email" id="email" value={email} onChange={handleEmailChange} required></input>
                    <input placeholder="password" type="password" id="password" value={password} onChange={handlePasswordChange} required></input>
                    <button type="submit">Test</button>
                </form>
            </div>
        </div>
    )
}