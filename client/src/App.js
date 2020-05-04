import React from "react";
import { Route } from "react-router-dom"
import LandingPage from "./components/LandingPage"
import Login from "./components/Register/Login"
import Profile from "./components/Main/Profile/Profile"

import "./App.css";
import axios from "axios";

function App() {
  const BASEURL = "http://dev-tickets.herokuapp.com"
  const login = (test) => {
    console.log(test)
    axios.get(BASEURL+"/user").then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err)
    })
  }

  return (
    <div>
      <Route path="/" exact render={() => <LandingPage />} />
      <Route path="/login" exact render={props => <Login {...props} login = {login} />} />
      <Route path="/profile" exact render={() => <Profile />} />
    </div>
  );
}

export default App;
