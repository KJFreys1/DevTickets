import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom"
import axios from "axios";

import LandingPage from "./components/LandingPage"
import Login from "./components/Register/Login"
import SignUp from "./components/Register/SignUp"
import Profile from "./components/Main/Profile/Profile"

import "./App.css";

function App() {
  let [user, setUser] = useState()

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
      localStorage.token = res.data.token
      setUser(res.data.user)
    }).catch(err => {
      console.log(err)
    })
  }

  const login = user => {
    axios.post(BASEURL+"/login", user).then(res => {
      localStorage.token = res.data.token
      setUser(res.data.user)
    }).catch(err => {
      console.log(err)
    })
  }

  const logout = () => {
    localStorage.clear()
    setUser()
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
