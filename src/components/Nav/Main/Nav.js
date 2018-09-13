import React, {Component} from 'react';
import './index.css';
import Menu from '../Menu';

class Nav extends Component {

    handleResizeNavClick = (event) => {
        let nav = event.target.parentNode.parentNode;

        nav.classList.toggle('nav-expanded');
    };

    render() {
        return (
            <div className="nav">
                <Menu/>
                <div className="nav-element">
                    <span className="icon-right" onClick={this.handleResizeNavClick}></span>
                </div>
            </div>
        );
    }
}

export default Nav;
