import React, { useState } from "react"
import NavBar from "./components/NavBar";
import { Router, Route, Switch } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import history from "./utils/history";

import LandingPage from "./components/LandingPage"
import Profile from "./components/Main/Profile/Profile";
import MyProjects from "./components/Main/MyProjects/MyProjects"
import MyTickets from "./components/Main/MyTickets/MyTickets"
import ProjectDetails from "./components/Main/ProjectDetails/ProjectDetails"
import TicketDetails from "./components/Main/TicketDetails/TicketDetails"
import ProjectTickets from "./components/Main/ProjectTickets/ProjectTickets"
import Inbox from "./components/Main/Inbox/Inbox"

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
          <PrivateRoute path="/mytickets" render={() => <MyTickets setDevUser={handleDevUserChange} devUser={devUser} />} />
          <PrivateRoute path="/project/:pid" render={props => <ProjectDetails {...props} setDevUser={handleDevUserChange} devUser={devUser} />} />
          <PrivateRoute path="/ticket/:tid" render={props => <TicketDetails {...props} setDevUser={handleDevUserChange} devUser={devUser} />} />
          <PrivateRoute path="/ticketdisplay/:pid" render={props => <ProjectTickets {...props} setDevUser={handleDevUserChange} devUser={devUser} />} />
          <PrivateRoute path="/inbox" render={() => <Inbox setDevUser={handleDevUserChange} devUser={devUser} /> } />
        </Switch>
      </Router>
    </div>
  );
}

export default App;