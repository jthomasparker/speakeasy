import React from "react";
import './Header.css';
import prof from './JAZ.PNG';

const Header = props => (
    <div>
        <div className="App-header navbar row">
            <div className="col-md-6">
                <h1 className="titleHeader">Speakeasy</h1>
                <h5>Sentiment Analyzer</h5>
            </div>
            <div className="col-md-6 profile-info">
                <a href={"#"}><br />Log in</a>
                <img className="profilePic" src={prof} alt={"profile-pic"} />
            </div>

        </div>
    </div>
);
export default Header;