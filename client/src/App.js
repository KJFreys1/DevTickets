import React from "react";
import { Route } from "react-router-dom"
import LandingPage from "./components/LandingPage"
import Profile from "./components/Main/Profile/Profile"

import "./App.css";

function App() {
  return (
    <div>
      <Route path="/" exact render={() => <LandingPage />} />
      <Route path="/profile" exact render={() => <Profile />} />
    </div>
  );
}

export default App;
