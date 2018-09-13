import React, {Component} from 'react';
import './index.css';
import Toolbar from '../Toolbar/Main/Toolbar';
import Container from '../Container/';
import MobileMenu from '../../Nav/MobileMenu';

class MainContainer extends Component {

    handleClickMenu = (event) => {
        //Open the menu
    };

    render() {
        return (
            <div className="main-container">
                <input type="checkbox" className="MenuMobile-callback" id="MenuMobile-callback"/>
                <label className="Header-mobileMenu" for="MenuMobile-callback">
                    <i className="fas fa-bars"></i>
                </label>
                <MobileMenu/>
                <div className="main-container--header">
                    <span className="icon-menu" onClick={this.handleClickMenu}></span>
                    <span className="main-container__title">Company Information</span>
                    <Toolbar/>
                </div>
                <div className="main-container--container">
                    <Container/>
                </div>
            </div>
        );
    }
}

MainContainer.propTypes = {};

export default MainContainer;
