import React, {Component} from 'react';
import './index.css'
import UserInformation from "../UserInformation/UserInformation";

class HeaderNav extends Component {
    render() {
        return (
            <div className="nav__header">
                <UserInformation username="Lauren Steven Montenegro"/>
            </div>
        );
    }
}


export default HeaderNav;
