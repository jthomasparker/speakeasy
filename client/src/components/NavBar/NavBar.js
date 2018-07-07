import React from "react";

const NavBar = props => (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="row">
            <div className="col-md-5" />
            <div className="collapse navbar-collapse col-md-2" id="navbarColor01">
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item active">
                        <a onClick={() => props.handlePageChange("Home")}
                            className={
                                props.currentPage === "Home" ? "nav-link active" : "nav-link"
                            }>
                            Search</a>
                    </li>
                    <li className="nav-item">
                        <a onClick={() => props.handlePageChange("Home")}
                            className={
                                props.currentPage === "Home" ? "nav-link active" : "nav-link"
                            }>Saved Articles</a>
                    </li>
                </ul>
            </div>
            <div className="col-md-5" />
        </div>
    </nav >
);

export default NavBar;