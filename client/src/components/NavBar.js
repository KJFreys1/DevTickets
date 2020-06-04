import React from "react"
import { Link, Redirect } from "react-router-dom"
import { useAuth0 } from "../react-auth0-spa"

const NavBar = () => {
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const redirectPath = isAuthenticated ? <Redirect to="/profile" /> : null
  return (
    <div>
        {redirectPath}
      {!isAuthenticated && (
        <button onClick={() => loginWithRedirect({})}>Log in</button>
      )}

      {isAuthenticated && <button onClick={() => logout()}>Log out</button>}
    </div>
  )
}

export default NavBar