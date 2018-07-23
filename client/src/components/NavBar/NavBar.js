import React, { Component } from 'react';
import { Navbar, NavbarBrand, NavbarNav, NavbarToggler, Collapse, NavItem, NavLink } from 'mdbreact';
import { BrowserRouter as Router } from 'react-router-dom';
import  UserBrainsDropdown from "../../components/UserBrainsDropdown";
import UserBrainItem from "../../components/UserBrainItem";
import API from "../../utils/API";
import {DropdownItem} from 'mdbreact';

import './NavBar.css';

import prof from './JAZ.PNG';
function BrainDropdown(props) {
    if(props.userBrains.length > 1){
        return(<UserBrainsDropdown>
            {props.userBrains.map(brain => {
                return(
                    <UserBrainItem
                    name={brain.name}
                    key={brain.id}
                    />
                );
            })}
            </UserBrainsDropdown>);
    }
    return (<UserBrainsDropdown>
        <DropdownItem href="/braintrain/">Create a Brain to Get Started</DropdownItem>
        </UserBrainsDropdown>)
}

class NavBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapse: false,
            isWideEnough: false,
            dropdownOpen: false,
            userBrains: [],
            currentBrain: '',
            url: "/braintrain/"
        };
        this.onClick = this.onClick.bind(this);
        this.toggle = this.toggle.bind(this);
    }

    componentDidMount = () => {
        // checks to see if the user is already authenticated
        // API.getUser()
        //     .then(res => {
        //         console.log(res)
        //         if(res.data.urlPath !== '/braintrain/'){
        //             this.setState({
        //                 url: res.data.urlPath
        //             })
        //             //  window.location = this.state.url;
        //             API.loadNets().then(res => {console.log(res)});
        //             this.setState({
        //                 userLoggedIn: true
        //             })
        //             console.log(this.state.userLoggedIn);
        //         }
        //     });
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
                                    <NavLink to="/analyzer/">Analyzer</NavLink>
                                </NavItem>
                                <NavItem>
                                    <BrainDropdown userBrains={this.state.userBrains}/>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/trainer/">Our Brain</NavLink>
                                </NavItem>
                                <NavItem>
                                    <NavLink to="/login/">
                                    {this.state.userLoggedIn ? 'Log Out' : 'Log In'}</NavLink>
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