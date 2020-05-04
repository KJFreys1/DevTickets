import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom"
import LandingPage from "./components/LandingPage"
import Login from "./components/Register/Login"
import SignUp from "./components/Register/SignUp"
import Profile from "./components/Main/Profile/Profile"

import "./App.css";
import axios from "axios";

function App() {
  let [user, setUser] = useState()
  let [visted, setVisited] = useState(false)

  const BASEURL = "http://dev-tickets.herokuapp.com"

  useEffect(() => {
    if (localStorage.token) {
      axios.get(BASEURL + '/login/user', {
        headers: {
          "x-auth-token": localStorage.token
        }
      }).then(res => {
        setUser(res.data)
      })
    }
  }, [])

  const register = user => {
    axios.post(BASEURL+"/register", user).then(res => {
      console.log(res.data)
      localStorage.token = res.data.token
    }).catch(err => {
      console.log(err)
    })
  }

  const login = user => {
    axios.post(BASEURL+"/login", user).then(res => {
      console.log(res.data)
      localStorage.token = res.data.token
    }).catch(err => {
      console.log(err)
    })
  }

  const logout = () => {
    localStorage.clear()
  }

  const redirectPath = user ? <Redirect to="/profile" /> : null

  return (
    <div>
      {redirectPath}
      <Route path="/" exact render={props => <LandingPage {...props} />} />
      <Route path="/login" render={props => <Login {...props} user={user} login={login} />} />
      <Route path="/register" render={props => <SignUp {...props} user={user} register={register} />} />
      <Route path="/profile" render={props => <Profile {...props} logout={logout} user={user} />} />
    </div>
  );
}

export default App;
