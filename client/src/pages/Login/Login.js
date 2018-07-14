import React, { Component } from "react";
import "./login.css"
import Header from "../../components/Header";
import NavBar from '../../components/NavBar';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";
import API from "../../utils/API"

class Login extends Component {
    state = {
        username: "",
        password: ""
    };

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
            })
        } else {
            API.signup(data)
            .then(res => {
                console.log(res)
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
                    <center>OR</center>
                    <Button
                        block
                        id="signup"
                        bsSize="sm"
                        disabled={!this.validateForm()}
                        className="btn btn-primary"
                        onClick={this.handleFormSubmit}
                        >
                        <p className="card-text">Signup</p>
                    </Button>
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