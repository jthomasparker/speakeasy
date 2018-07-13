import React, { Component } from "react";
import Header from "../../components/Header";
import NavBar from '../../components/NavBar';
import { Button, FormGroup, FormControl, ControlLabel } from "react-bootstrap";

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
    }

    render() {
        return (
            <div className="Login">
                <Header />
                <form>
                    <FormGroup controlId="username" bsSize="large">
                        <ControlLabel>username</ControlLabel>
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
                            onChange={this.handleChange}
                            type="password"
                            />
                    </FormGroup>
                    <Button
                        block
                        bsSize="large"
                        disabled={!this.validateForm()}
                        className="btn btn-primary"
                        onClick={this.handleFormSubmit}
                        >
                        Login
                    </Button>
                </form>
            </div>
        )
    }



}