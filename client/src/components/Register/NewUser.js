import React from "react"
import { useState } from "react"

export default function NewUser(props) {
    let [name, setName] = useState("")
    const handleSubmit = e => {
        e.preventDefault()
        props.postNewUser({
            name,
            email: props.email
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <h1>{props.email}</h1>
            <input value={name} onChange={e => setName(e.target.value)}></input>
        </form>
    )
}