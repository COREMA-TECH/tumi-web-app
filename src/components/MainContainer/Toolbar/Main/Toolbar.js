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

    handleDropDown = (event) => {
        event.preventDefault();
        let selfHtml = event.currentTarget;
        let submenu = selfHtml.nextSibling;
        submenu.classList.toggle('show');
    };

    render() {
        return (
            <div className="toolbar__main">
                <ul className="RightMenu-list">
                    <li className="RightMenu-item">
                        <a href="" onClick={this.changeLanguage} className="Language-en">
                            <img src={`/languages/${this.state.languageIcon}.png`} className="Language-icon" />
                        </a>
                    </li>
                    <li className="RightMenu-item">
                        <div class="dropdown">
                            <button onClick={this.handleDropDown} class="btn btn-success btn-white dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i class="fas fa-user-alt"></i>
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <a class="dropdown-item" href="#" onClick={this.handleLogout}>Logout</a>
                                <a class="dropdown-item" href="/reset">Reset Password</a>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        );
    }
}

export default Toolbar;
