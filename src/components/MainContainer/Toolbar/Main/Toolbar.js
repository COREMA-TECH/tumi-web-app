import React, { Component } from 'react';
import './index.css';

class Toolbar extends Component {

    constructor(props) {
        super(props)
        this.state = {
            languageIcon: ''
        }
    }

    handleLogout = (event) => {
        localStorage.clear();
        window.location.href = "/login";
        event.preventDefault();
    }

    changeLanguage = (event) => {
        console.log(localStorage.getItem('languageForm'));
        if (this.state.languageIcon == 'en')
            localStorage.setItem('languageForm', 'es');
        else
            localStorage.setItem('languageForm', 'en');
        window.location.reload();
        event.preventDefault();
    }

    componentWillMount() {
        console.log(localStorage.getItem('languageForm'));
        this.setState({
            languageIcon: localStorage.getItem('languageForm')
        });
    }

    render() {
        return (
            <div className="toolbar__main">
                <ul className="RightMenu-list">
                    <li className="RightMenu-item">
                        <a href="" className="logout-link" onClick={this.handleLogout}>Logout</a>
                    </li>
                    <li className="RightMenu-item">
                        <a href="" onClick={this.changeLanguage} className="Language-en">
                            <img src={`/languages/${this.state.languageIcon}.png`} className="Language-icon" />
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Toolbar;
