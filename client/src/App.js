import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Analyzer from './pages/Analyzer';
import Trainer from './pages/Trainer';
import UserBrainTrain from './pages/UserBrainTrain';



const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path='/' component={Analyzer} />
        <Route exact path='/trainer' component={Trainer} />
        <Route exact path='/braintrain' component={UserBrainTrain} />
      </Switch>
    </div>
  </Router>
)

export default App;
