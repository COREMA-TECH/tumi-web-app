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
		var pathname = str.split('/');
		var title;
		if (pathname[3] != undefined) {
			if (pathname[3] == "manager")
				pathname[3] = "Operation Manager";
			if (pathname[3] == "hotel")
				pathname[3] = "Hotel Manager";
			title = pathname[3] + ' ' + pathname[2];
		} else
			title = pathname[2];

		title = title == 'Company' ? 'Management' : title;

		if (str === "/home/application/info" || str === "/home/application") {
			title = 'Employee Package'
		}

		if (str === "/home/company/edit") {
			title = 'Edit Management Company'
		}

		if (str === "/home/Company") {
			title = 'Add Management Company'
		}

		if (str === "/home/Recruiter") {
			title = 'New Lead'
		}

		if (str === "/home/punches/report") {
			title = 'Punches Report'
		}

		if (str === "/home/approve-punches") {
			title = 'Approve/Reject Punches'
		}


		return title;
	};

	renderHeader = () => {
		if (localStorage.getItem('LoginId'))
			return <div>
				<input type="checkbox" className="MenuMobile-callback" id="MenuMobile-callback" />
				{localStorage.getItem('showMenu') == 'true' ?
					<label className="Header-mobileMenu" htmlFor="MenuMobile-callback">
						<i className="fas fa-bars" />
					</label> : ('')
				}
				<MobileMenu />
				<div className="MenuMobile-overlay" onClick={this.props.handleCloseMenu} />
				<div className="main-container--header">
					<span className="icon-menu" onClick={this.handleClickMenu} />
					<span className="main-container__title"> {this.setTitle(window.location.pathname)}</span>
					<Toolbar handleOpenSnackbar={this.props.handleOpenSnackbar} />
				</div>
			</div>
	}

	render() {
		return (
			<div className="main-container">
				{this.renderHeader()}
				<div className="main-container--container">
					<Container />
				</div>
			</div>
		);
	}
}

MainContainer.propTypes = {};

export default Global(MainContainer);
