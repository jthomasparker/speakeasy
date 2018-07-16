import React, { Component } from "react";
import "./login.css"
import Header from "../../components/Header";
import NavBar from '../../components/NavBar';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from "../../utils/API"

class Login extends Component {
    state = {
        username: "",
        password: "",
        status: "",
        url: "/login"
    };

    componentDidMount = () => {
        // checks to see if the user is already authenticated
        API.getUser()
            .then(res => {
                console.log(res)
                if(res.data.urlPath !== '/login'){
                    this.setState({
                        url: res.data.urlPath
                    })
                    window.location = this.state.url
                }
            })
    }

    handleInputChange = event => {
        const { id, value } = event.target;
        this.setState({
          [id]: value
        });
      };

    validateForm(){
        return this.state.username.length > 0 && this.state.password.length > 0
    }

    handleFormSubmit = event => {
        event.preventDefault();
        let data = {
            username: this.state.username,
            password: this.state.password
        }
        if(event.target.id === 'login'){
            API.login(data)
            .then(res => {
                console.log(res)
                if(res.data.userId){
                    window.location = '/braintrain/' + res.data.userId
                } else {
                    this.setState({
                        status: res.data.status,
                        username: "",
                        password: ""
                    })
                }
            })
        } else {
            API.signup(data)
            .then(res => {
                console.log(res)
                if(res.data.userId){
                    window.location = '/braintrain/' + res.data.userId
                } else {
                    this.setState({
                        status: res.data.status,
                        username: "",
                        password: ""
                    })
                }
            })
        }
    }

    render() {
        return (
            <div className="Login">
                <Header />
                <div className="container">
                <div className="row">
                <div className="col-sm"></div>
                <div className="col-sm">
                <div className="card">
                <div className="card-body">
                <h4 className="card-title">Login or Signup</h4>
                <form>
                    <FormGroup controlId="username" bsSize="large">
                        <ControlLabel>Username</ControlLabel>
                        <FormControl
                            autoFocus
                            type="text"
                            value={this.state.username}
                            onChange={this.handleInputChange}
                            />
                    </FormGroup>
                    <FormGroup controlId="password" bsSize="large">
                        <ControlLabel>Password</ControlLabel>
                        <FormControl
                            value={this.state.password}
                            onChange={this.handleInputChange}
                            type="password"
                            />
                    </FormGroup>
                    <Button
                        block
                        id="login"
                        bsSize="sm"
                        disabled={!this.validateForm()}
                        className="btn btn-primary"
                        onClick={this.handleFormSubmit}
                        >
                        Login
                    </Button>
                    <center><p className="card-text">OR</p></center>
                    <Button
                        block
                        id="signup"
                        bsSize="sm"
                        disabled={!this.validateForm()}
                        className="btn btn-primary"
                        onClick={this.handleFormSubmit}
                        >
                        Signup
                    </Button>
                    <p className="card-text">{this.state.status}</p>
                </form>
                </div>
                </div>
                </div>
                <div className="col-sm"></div>
                </div>
                </div>
            </div>
        )
    }

}

export default Login;