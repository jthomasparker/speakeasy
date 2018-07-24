import React, { Component } from 'react';
import Header from "../../components/Header";
import NavBar from '../../components/NavBar';
import RangeSlider from "../../components/RangeSlider";
import API from "../../utils/API"
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";



class Trainer extends Component {
  
  state = {
    brainName: "",
    input: "",
    output: "",
    netId: "",
    netName: "",
    userInput: "",
    topMoodResult: "",
    secondMoodResult: "",
    thirdMoodResult: "",
    lastRecord: {
      id: "",
      input: "",
      sentiment: "",
      moods: ""
    },
    sentimentValue: 0,
    moods: [
      {
        value: "happy",
        checked: false
       },
       {
         value: "sad",
         checked: false
        },
        {
          value: "irritated",
          checked: false
        },
        {
          value: "excited",
          checked: false
        },
        {
          value: "angry",
          checked: false
        },
        {
          value: "grateful",
          checked: false
        },
        {
          value: "neutral",
          checked: false
        }
      ]
  }

  componentDidMount = () => {
    API.loadNets()
      .then(res => {
        if(res.status === 401){
          window.location = '/login'
      }
      console.log(res)
      })
    .catch(err => {
      console.log(err)
      window.location = '/login'
    })
  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  toggleCheckBoxes = event => {
    const { value, checked} = event.target
    const updatedMoods = [...this.state.moods]
    const indexForUpdate = this.state.moods.findIndex((mood) => {
          return mood.value === value
    })
    updatedMoods[indexForUpdate].checked = !updatedMoods[indexForUpdate].checked;

    this.setState({
      moods: updatedMoods
    })
 //   console.log(this.state)

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
            topMoodResult: `${res.data.jaz.moods[0].label} (${Math.round(res.data.jaz.moods[0].confidence * 100)}%)`,
            secondMoodResult: `${res.data.jaz.moods[1].label} (${Math.round(res.data.jaz.moods[1].confidence * 100)}%)`,
            thirdMoodResult: `${res.data.jaz.moods[2].label} (${Math.round(res.data.jaz.moods[2].confidence * 100)}%)`
          })
        })
    }
  }

  handleSliderChange = value => {
      this.setState({
          sentimentValue: value
      })
  }

  createBrain = event => {
    event.preventDefault()
    let brainName = this.state.brainName
    console.log(brainName)
    API.createNet({
      netName: brainName
    })
    .then(res => {
      console.log(res)
      this.setState({
        netId: res.data.netId,
        netName: res.data.netName
      })
    })
  }

  trainBrain = event => {
    event.preventDefault()
    let trainingData = [{
      input: this.state.input,
      output: this.state.output
    }]
    API.trainNet({
      trainingData: trainingData,
      netId: this.state.netId
    })
    .then(res => {
      console.log(res)
      API.getResult({
        netId: this.state.netId,
        userInput: this.state.userInput
      }).then(result => console.log(result))
    })

  }

  

  handleTrainSubmit = event => {
      event.preventDefault();
      let moodsToInclude = this.state.moods.filter(moodObj => moodObj.checked)
      API.trainSentiment({
        input: this.state.userInput,
        sentiment: this.state.sentimentValue,
        moods: moodsToInclude,
        trained: false
      })
      .then(res => {
        console.log(res)
        let moods = res.data.moods.map(mood => mood.value)
        this.setState({
          lastRecord: {
            id: res.data._id,
            input: res.data.input,
            sentiment: res.data.sentiment,
            moods: moods
          },
          userInput: "",
          sentimentValue: 0,
    moods: [
      {
        value: "happy",
        checked: false
       },
       {
         value: "sad",
         checked: false
        },
        {
          value: "irritated",
          checked: false
        },
        {
          value: "excited",
          checked: false
        },
        {
          value: "angry",
          checked: false
        },
        {
          value: "grateful",
          checked: false
        },
        {
          value: "neutral",
          checked: false
        }
      ]
        })
      })
  }


  render() {
    return (
      <div className="App">
        <NavBar />
        <div className="container">
          <div className="row">
            <div className="col-md-5">
              <form>
                <div className="form-group">
                <label htmlFor="textInput">Enter text here</label>
                <textarea 
                    className="form-control"
                    id="userInput"
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
              <h4>Top 3 Moods:</h4>
              <h4>{this.state.topMoodResult}</h4>
              <h4>{this.state.secondMoodResult}</h4>
              <h4>{this.state.thirdMoodResult}</h4>
            </div>
            <div className="col-md-5">
              <RangeSlider 
                value={this.state.sentimentValue}
                orientation="horizontal"
                labels={{0: 'Very Negative', 50: 'Neutral', 100: 'Very Positive'}}
                handleSliderChange={this.handleSliderChange}

              />
              <br/>
              <form>
                <div className="checkbox">
                <label><input type="checkbox" value="happy" onChange={this.toggleCheckBoxes} checked={this.state.moods[0].checked}/>Happy</label>
                </div>
                <div className="checkbox">
                <label><input type="checkbox" value="sad" onChange={this.toggleCheckBoxes} checked={this.state.moods[1].checked}/>Sad</label>
                </div>
                <div className="checkbox">
                <label><input type="checkbox" value="irritated" onChange={this.toggleCheckBoxes} checked={this.state.moods[2].checked}/>Irritated</label>
                </div>
                <div className="checkbox">
                <label><input type="checkbox" value="excited" onChange={this.toggleCheckBoxes} checked={this.state.moods[3].checked}/>Excited</label>
                </div>
                <div className="checkbox">
                <label><input type="checkbox" value="angry" onChange={this.toggleCheckBoxes} checked={this.state.moods[4].checked}/>Angry</label>
                </div>
                <div className="checkbox">
                <label><input type="checkbox" value="grateful" onChange={this.toggleCheckBoxes} checked={this.state.moods[5].checked}/>Grateful</label>
                </div>
                <div className="checkbox">
                <label><input type="checkbox" value="neutral" onChange={this.toggleCheckBoxes} checked={this.state.moods[6].checked}/>Neutral</label>
                </div>

                
                <button type="submit" 
                    className="btn btn-primary" 
                    onClick={this.handleTrainSubmit} 
                    disabled={!(this.state.userInput)}>
                    Train
                </button>
                </form>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <h2>Last Record Added/Updated:</h2>
              <p>Id: {this.state.lastRecord.id}</p>
              <p>Input: {this.state.lastRecord.input}</p>
              <p>Sentiment: {this.state.lastRecord.sentiment}</p>
              <p>Moods: {this.state.lastRecord.moods}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Trainer;
