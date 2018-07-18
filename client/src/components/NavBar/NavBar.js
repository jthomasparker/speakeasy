import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import './NavBar.css';

import prof from './JAZ.PNG';

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
            dropdownOpen: false
        };
        this.onClick = this.onClick.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    onClick() {
        this.setState({
            collapse: !this.state.collapse,
        });
    }

    toggle() {
        this.setState({
            dropdownOpen: !this.state.dropdownOpen
        });
    }

    render() {
        return (
                <div className="App-header row">
                    <Navbar dark color="blue-grey lighten-5" expand="md" scrolling>
                        <div className="col-md-3">
                            <NavbarBrand href="/">
                                <h1 className="titleHeader">Speakeasy</h1>
                                <h5>Sentiment Analyzer</h5>
                            </NavbarBrand>
                        </div>
                        <div className="col-md-7">
                        {!this.state.isWideEnough && <NavbarToggler onClick={this.onClick} />}
                        <Collapse isOpen={this.state.collapse} navbar>
                            <NavbarNav left>
                                <NavItem>
                                    <NavLink to="/analyzer">Analyzer</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/braintrain">Your Brain</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/trainer">Our Brain</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/login">Log In</NavLink>
                                </NavItem>                                
                            </NavbarNav>                            
                        </Collapse>
                        </div>
                        <div className="col-md-2 profile-info">
                            <img className="profilePic" src={prof} alt={"profile-pic"} />
                        </div>
                    </Navbar>
                </div>
        );
    }
}

export default NavBar;