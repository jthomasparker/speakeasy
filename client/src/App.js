import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Header from "./components/Header";
import NavBar from './components/NavBar';
import RangeSlider from "./components/RangeSlider";


class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <div className="row">
          <div className="col-md-5">
            <label>Enter text here</label>
            <textarea className="form-control" id="textInput" rows="3" />
            <button type="submit" className="btn btn-primary">Submit</button>
          </div>
          <div className="col-md-7">
            <RangeSlider />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
