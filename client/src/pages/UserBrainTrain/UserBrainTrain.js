import React, { Component } from 'react';
import Header from "../../components/Header";
import NavBar from '../../components/NavBar';
import CreateBrainModal from "../../components/CreateBrainModal";
import API from "../../utils/API";
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import "./UserBrainTrain.css";

class UserBrainTrain extends Component {
  state = {
    userInput: "",
    userClassification: "",
    userAdded: [],
    userTestInput: "",
    userBrains: [{name: "Test", id: "1"}, {name: "Test2", id: "2"}],
    currentUserId: "",
    currentUserBrain: {},
    url: '/braintrain/',
    testResponseResults: []
  }

  componentDidMount = () => {
    // checks to see if the user is already authenticated
    API.getUser()
        .then(res => {
            console.log(res)
            if(res.data.urlPath !== '/braintrain/'){
                this.setState({
                    url: res.data.urlPath                    
                })
                window.location = this.state.url
            } else {
              API.loadNets().then(res => {
                console.log("nets? " + JSON.stringify(res))
                this.setState({
                  userBrains: [...res.data.nets]                  
                })
                //console.log(this.state.userBrains)
              });
              this.setState({
                currentUserId : res.data.userData.user.userId
              })
            }            
        });

        let height = 300; // Only simluated here!

        // Set the height
        this.setState({ tableHeight: height + "px" });
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
      { input: this.state.userInput, output: this.state.userClassification }],
      userInput : "",
      userClassification : ""
    });
  }

  getstate = event => {
    console.log(this.state);
  }

  handleTestSubmit = event => {
    event.preventDefault();
    if (this.state.userTestInput) {
      API.getResult({
        userInput: this.state.userTestInput,
        netId: this.state.currentUserBrain.id
      })
        .then(res => {
          console.log(res.data.allResults)
          this.setState({
            testResponseResults: [...res.data.allResults]
          })
        })
    }
  }

  handleTrainSubmit = event => {
    event.preventDefault(); 
    let trainData =    
    API.trainNet({      
      trainingData : this.state.userAdded,
      netId: this.state.currentUserBrain.id
    })
      .then(res => {
        console.log(res)        
        this.setState({
          userAdded: []          
        })
      })
  }

  onDeleteRow = row => {
    let toAdd = [];
    toAdd = this.state.userAdded.filter((data) => {
      return data.input !== row[0] && data.output !== row[1];
    });

    this.setState({
      userAdded: toAdd
    });
  }

  handleItemClick = (event) => {
    const { name, value } = event.target
    console.log(name, value);
    this.setState({currentUserBrain : {name : name, id : value}});
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
        <NavBar 
        handleItemClick={this.handleItemClick}/>
        <div className="container">
        <div className="row center">        
            <CreateBrainModal />     
        </div>
          <div className="row">
            <h2>Train Your {this.state.currentUserBrain.name} Brain</h2>
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
              {/* <button type="submit"
                className="btn btn-primary"
                onClick={this.getstate}>
                Get State
                </button> */}
            </div>
            <div className="col-md-4">
              <h4>Added</h4>
              <BootstrapTable maxHeight={this.state.tableHeight} data={this.state.userAdded} deleteRow={true} selectRow={selectRowProp}
                options={options} striped hover version='4'>
                <TableHeaderColumn isKey dataField='input'>Input</TableHeaderColumn>
                <TableHeaderColumn dataField='output'>Classification</TableHeaderColumn>
              </BootstrapTable>
              <br />
              <form>
                <button type="submit"
                  className="btn btn-primary"
                  onClick={this.handleTrainSubmit}
                  disabled={this.state.userAdded.length == 0}>
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
                onChange={this.handleInputChange}
              />
            </div>
            <div className="col-md-6">
              <h4>Top Results</h4>
              <ul>
                {this.state.testResponseResults.map(function(result, idx){
                    return <li key={ idx }>{result.label} - {result.confidence}</li>;
                  })}
            </ul>
            </div>
            <button type="submit"
              className="btn btn-primary"
              onClick={this.handleTestSubmit}
              disabled={!(this.state.userTestInput)}>
              Submit
                </button>
          </div>
          <div> <p>If you're a developer, your API key is {this.state.currentUserId}.</p><p> An example of your API call would be https://jaz-speakeasy.herokuapp.com/api/public/?apikey={this.state.currentUserId}&q=[query]
           </p> </div>
        </div>
      </div>
    );
  }
}

export default UserBrainTrain;
