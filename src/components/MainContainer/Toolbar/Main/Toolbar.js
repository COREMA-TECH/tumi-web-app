import React, { Component } from 'react';
import './index.css';

class Toolbar extends Component {

    handleLogout = (event) => {
        localStorage.clear();
        window.location.href = "/login";
        event.preventDefault();
    }

    render() {
        return (
            <div className="toolbar__main">
                <a href="" className="logout-link" onClick={this.handleLogout}>Logout</a>
            </div>
        );
    }
}

export default Toolbar;
