import React, { Component } from 'react';
import Header from "../../components/Header";
import NavBar from '../../components/NavBar';
import RangeSlider from "../../components/RangeSlider";
import AddedTable from "../../components/AddedTable";
import API from "../../utils/API";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import "./UserBrainTrain.css";

class UserBrainTrain extends Component {
  state = {
    userInput: "",
    userClassification: "",
    userAdded: [],
    userTestInput: ""
  }


  handleInputChange = event => {
    // alert(event.target.name + " " + event.target.value);
    const { name, value } = event.target;
    this.setState({
      [name]: value
    });
  }

  handleDataStage = event => {
    this.setState({
      userAdded: [...this.state.userAdded,
      { input: this.state.userInput, classification: this.state.userClassification }]
    });

  }

  getstate = event => {
    console.log(this.state);
  }

  toggleCheckBoxes = event => {
    const { value, checked } = event.target
    const updatedMoods = [...this.state.moods]
    const indexForUpdate = this.state.moods.findIndex((mood) => {
      return mood.value === value
    })
    updatedMoods[indexForUpdate].checked = !updatedMoods[indexForUpdate].checked;

    this.setState({
      moods: updatedMoods
    })
    console.log(this.state)

  }

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.userInput) {
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
              value: "nuetral",
              checked: false
            }
          ]
        })
      })
  }
  componentDidMount() {
    // Calculate the height
    let height = 300; // Only simluated here!

    // Set the height
    this.setState({ tableHeight: height + "px" });

    // API.getUser()
    //   .then(res => window.location = res.data.urlPath)
  }

  onDeleteRow = row => {
    let toAdd = [];
    toAdd = this.state.userAdded.filter((data) => {
      return data.input !== row[0] && data.classification !== row[1];
    });

    this.setState({
      userAdded: toAdd
    });
  }

  render() {

    const options = {
      afterDeleteRow: this.onDeleteRow  // A hook for after droping rows.
    };

    // If you want to enable deleteRow, you must enable row selection also.
    const selectRowProp = {
      mode: 'checkbox',
      clickToSelect: true
    };

    return (
      <div className="App">
        <NavBar />
        <div className="container">
          <div className="row">
            <h2>Train Your Brain</h2>
          </div>
          <div className="row">
            <div className="col-md-5">
              <form>
                <div className="form-group">
                  <h4 htmlFor="textInput">Enter text here</h4>
                  <textarea
                    className="form-control"
                    id="userInput"
                    name="userInput"
                    rows="3"
                    value={this.state.userInput}
                    onChange={this.handleInputChange}
                  />
                </div>
              </form>
            </div>
            <div className="col-md-3 form-group">
              <h4>Classification</h4>
              <input type="text"
                className="form-control"
                id="classificationInput"
                name="userClassification"
                value={this.state.userClassification}
                onChange={this.handleInputChange} />
              <button type="submit"
                className="btn btn-primary"
                onClick={this.handleDataStage}
                disabled={!(this.state.userInput) || !(this.state.userClassification)}>
                Stage Training Data
                </button>
              <button type="submit"
                className="btn btn-primary"
                onClick={this.getstate}>
                Get State
                </button>
            </div>
            <div className="col-md-4">
              <h4>Added</h4>
              <BootstrapTable data={this.state.userAdded} deleteRow={true} selectRow={selectRowProp}
                options={options} striped hover version='4'
                maxHeight={this.state.tableHeight}>
                <TableHeaderColumn isKey dataField='input'>Input</TableHeaderColumn>
                <TableHeaderColumn dataField='classification'>Classification</TableHeaderColumn>
              </BootstrapTable>
              <br />
              <form>
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
            <h2>Test Your Brain</h2>
          </div>
          <div className="row">
            <div className="col-md-6 form-group">
              <h4 htmlFor="textInput">Enter text here</h4>
              <textarea
                className="form-control"
                id="userTestInput"
                name="userTestInput"
                rows="3"
                value={this.state.userTestInput}
                onChange={this.handleTestInputChange}
              />
            </div>
            <div className="col-md-6">
              <h4>Classification</h4>
            </div>
            <button type="submit"
              className="btn btn-primary"
              onClick={this.handleTestSubmit}
              disabled={!(this.state.userTestInput)}>
              Submit
                </button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserBrainTrain;
