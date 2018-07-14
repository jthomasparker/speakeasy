import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Analyzer from './pages/Analyzer'
import Trainer from './pages/Trainer'
import Login from './pages/Login'



const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path='/' component={Analyzer} />
        <Route exact path='/trainer' component={Trainer} />
        <Route exact path='/login' component={Login} />
      </Switch>
    </div>
  </Router>
)

export default App;
