import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";
import NavBar from './components/NavBar';

class App extends Component {
  render() {
    return (
      <div className="App">
      <Header/> 
      <NavBar />     
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
