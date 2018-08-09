import React, {Component} from 'react';
import './index.css';
import HeaderNav from "../HeaderNav/HeaderNav";

class Nav extends Component {
    render() {
        return (
            <div className="nav">
                <HeaderNav/>
            </div>
        );
    }
}


export default Nav;
