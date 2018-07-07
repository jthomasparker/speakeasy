import React from "react";
import './Header.css';

const Header = props => (
    <div>
        <div className="App-header navbar row">
            <div className="col-md-12">
                {/* <img className="App-logo" alt="logo" /> */}
                <h1>Sentiment Analyzer</h1>

            </div>
        </div>
        <div className="App-sub-header navbar row">
            <div className="col-md-12">
                <h5>but what do they mean?</h5>
            </div>
        </div>
    </div>
);
export default Header;