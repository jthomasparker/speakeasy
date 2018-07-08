import React from "react";
import './Header.css';

const Header = props => (
    <div>
        <div className="App-header navbar row">
            <div className="col-md-6">
                <h1>Speakeasy</h1>
                <h5>Sentiment Analyzer</h5>
            </div>
            <div className="col-md-6 profile-info">
                <a href={"#"}><br />Log in</a>
                <img src={"../../../public/assets/img/anon-profile-pic.png"} alt={"profile-pic"} />
            </div>

        </div>
    </div>
);
export default Header;