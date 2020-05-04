import React from "react";
import { Route } from "react-router-dom"
import LandingPage from "./components/LandingPage"
import Login from "./components/Register/Login"
import SignUp from "./components/Register/SignUp"
import Profile from "./components/Main/Profile/Profile"

import "./App.css";
import axios from "axios";

function App() {
  const BASEURL = "http://dev-tickets.herokuapp.com"

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

  return (
    <div>
      <Route path="/" exact render={props => <LandingPage {...props} logout={logout}/>} />
      <Route path="/login" exact render={props => <Login {...props} login={login} />} />
      <Route path="/register" exact render={props => <SignUp {...props} register={register} /> } />
      <Route path="/profile" exact render={() => <Profile />} />
    </div>
  );
}

export default App;
