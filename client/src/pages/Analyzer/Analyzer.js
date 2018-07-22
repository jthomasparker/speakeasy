import React, { Component } from 'react';
import Header from "../../components/Header";
import NavBar from '../../components/NavBar';
import RangeSlider from "../../components/RangeSlider";
import API from "../../utils/API"


class Analyzer extends Component {
  state = {
    userInput: "",
    sentimentValue: 0,
    topMood: {
      mood: "",
      confidence: ""
    },
    secondMood: {
      mood: "",
      confidence: ""
    },
    thirdMood: {
      mood: "",
      confidence: ""
    },
    displayResult: false
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
      displayResult: false
    });
  }

  handleFormSubmit = event => {
    event.preventDefault();
    if(this.state.userInput){
      API.getSentiment({
        userInput: this.state.userInput
      })
        .then(res => {
          console.log(res)
          let sentiment = Math.round(res.data.allNets.avg * 100)
          this.setState({
            sentimentValue: sentiment,
            displayResult: true,
            topMood: {
              mood: res.data.jaz.moods[0].label,
              confidence: Math.round(res.data.jaz.moods[0].confidence * 100) + '%'
            },
            secondMood: {
              mood: res.data.jaz.moods[1].label,
              confidence: Math.round(res.data.jaz.moods[1].confidence * 100) + '%'
            },
            thirdMood: {
              mood: res.data.jaz.moods[2].label,
              confidence: Math.round(res.data.jaz.moods[2].confidence * 100) + '%'
            }
          })
        })
    }
  }


  render() {
    return (
      <div className="App">
      <NavBar />
        <div className="container">
          <div className="row">
            <div className="col-md">
              <form>
                <div className="form-group">
                <label htmlFor="textInput">Enter text here</label>
                <textarea 
                    className="form-control"
                    id="textInput"
                    name="userInput"
                    rows="3" 
                    value={this.state.userInput}
                    onChange={this.handleInputChange} 
                  />
                </div>
                <button type="submit" 
                    className="btn btn-primary" 
                    onClick={this.handleFormSubmit} 
                    disabled={!(this.state.userInput)}>
                    Submit
                </button>
              </form>
            </div>
            <div className="col col-md-2">
              {this.state.displayResult ? (
              <div>
             <ul className="list-group">
                <div className="list-group-item list-group-item-action flex-column align-items-start">
                  <div className="d-flex w-100 justify-content-between">
                    <h4 className="mb-1 lead">Top 3 Moods</h4>
                  </div>  
                </div>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {this.state.topMood.mood}
                  <span className="badge badge-primary badge-pill">{this.state.topMood.confidence}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {this.state.secondMood.mood}
                  <span className="badge badge-primary badge-pill">{this.state.secondMood.confidence}</span>
                </li>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  {this.state.thirdMood.mood}
                  <span className="badge badge-primary badge-pill">{this.state.thirdMood.confidence}</span>
                </li>
              </ul>
              </div>
              ) : (
              <p className="lead">No Results</p>
              )}
            </div>
            <div className="col-md">

            <ul className="list-group mb-1">
                <div className="list-group-item list-group-item-action flex-column align-items-start">
                  <div className="d-flex w-100 justify-content-between">
                    <h4 className="mb-1 lead">Sentiment</h4>
                  </div>
                </div>
                <li className="list-group-item d-flex justify-content-between align-items-center">
                  <center><h4 className="mb-1">{this.state.sentimentValue} / 100</h4></center>
                </li>
                </ul>
              <RangeSlider 
                value={this.state.sentimentValue}
                orientation="horizontal"
                labels={{0: 'Very Negative', 50: 'Neutral', 100: 'Very Positive'}}
              //  handleLabel={this.state.sentimentValue.toString()}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Analyzer;
