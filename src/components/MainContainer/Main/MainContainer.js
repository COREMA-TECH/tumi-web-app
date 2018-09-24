import React, { Component } from 'react';
import './index.css';
import Toolbar from '../Toolbar/Main/Toolbar';
import Container from '../Container/';
import MobileMenu from '../../Nav/MobileMenu';
import Global from 'Generic/Global';

class MainContainer extends Component {
	handleClickMenu = (event) => {
		//Open the menu
	};

	setTitle = (str) => {
		var pathname = str.split("/");
		var title;
		if (pathname[3] != undefined)
			title = pathname[3] + " " + pathname[2];
		else
			title = pathname[2];
		console.log(title);
		title = title == "Company" ? "Management" : title;
		return title;
	}

	render() {
		return (
			<div className="main-container">
				<input type="checkbox" className="MenuMobile-callback" id="MenuMobile-callback" />
				<label className="Header-mobileMenu" htmlFor="MenuMobile-callback">
					<i className="fas fa-bars" />
				</label>
				<MobileMenu />
				<div className="MenuMobile-overlay" onClick={this.props.handleCloseMenu} />
				<div className="main-container--header">
					<span className="icon-menu" onClick={this.handleClickMenu} />
					<span className="main-container__title">
						{this.setTitle(window.location.pathname)}
					</span>
					<Toolbar />
				</div>
				<div className="main-container--container">
					<Container />
				</div>
			</div>
		);
	}
}

MainContainer.propTypes = {};

export default Global(MainContainer);
