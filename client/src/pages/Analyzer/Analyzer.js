import React, { Component } from 'react';
import Header from "../../components/Header";
import NavBar from '../../components/NavBar';
import RangeSlider from "../../components/RangeSlider";
import API from "../../utils/API"


class Analyzer extends Component {
  state = {
    userInput: "",
    sentimentValue: 0
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
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
          let sentiment = Math.round(res.data.neuralNetRating * 100)
          this.setState({
            sentimentValue: sentiment
          })
        })
    }
  }


  render() {
    return (
      <div className="App">
        <Header />
        <div className="container">
          <div className="row">
            <div className="col-md-5">
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
            <div className="col-md-2">
              <h4>Sentiment Rating:</h4>
              <h2>{this.state.sentimentValue}</h2>
            </div>
            <div className="col-md-5">
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
