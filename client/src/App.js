import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom"
import Analyzer from './pages/Analyzer'


const App = () => (
  <Router>
    <div>
      <Switch>
        <Route exact path='/' component={Analyzer} />
      </Switch>
    </div>
  </Router>
)

export default App;
