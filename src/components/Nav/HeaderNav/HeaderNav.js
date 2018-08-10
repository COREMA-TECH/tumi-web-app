import React, {Component} from 'react';
import './index.css'
import UserInformation from "../UserInformation/UserInformation";
import Avatar from "../Avatar/Avatar";

class HeaderNav extends Component {
    render() {
        return (
            <div className="nav__header">
                <Avatar/>
                <UserInformation username="Lauren Steven Montenegro"/>
            </div>
        );
    }
}


export default HeaderNav;
