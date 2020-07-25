import React from "react";
import { useState } from "react"
import NavBar from "./components/NavBar";
import { Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import history from "./utils/history";

import LandingPage from "./components/LandingPage"
import Profile from "./components/Main/Profile/Profile";
import MyProjects from "./components/Main/MyProjects/MyProjects"

function App() {
  let [devUser, setDevUser] = useState()

  const handleDevUserChange = newData => {
    setDevUser(newData)
  }

  return (
    <div className="App">
      <Router history={history}>
        <header>
          <Route path="/" exact component={NavBar} />
        </header>
        <Switch>
          <Route path="/" exact component={LandingPage} />
          <PrivateRoute path="/profile" exact render={() => <Profile setDevUser={handleDevUserChange} devUser={devUser} />} />
          <PrivateRoute path="/myprojects" exact render={() => <MyProjects setDevUser={handleDevUserChange} devUser={devUser} />} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;