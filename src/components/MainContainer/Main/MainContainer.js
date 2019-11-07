import React, { Component } from 'react';
import './index.css';
import Toolbar from '../Toolbar/Main/Toolbar';
import Container from '../Container/';
import MobileMenu from '../../Nav/MobileMenu';
import Global from 'Generic/Global';
import CustomBreadcrumb from '../../../components/ui-components/CustomBreadcrumb';

class MainContainer extends Component {

	constructor(props) {
		super(props);
		this.state = {
			collapsedMenu: false
		}
	}

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
			title = 'Lead'
		}

		if (str === "/home/punches/report") {
			title = 'Punches Report'
		}

		if (str === "/home/approve-punches") {
			title = 'Approve/Reject Punches'
		}

		if (str.toLowerCase() === "/home/application/Form".toLowerCase())
			title = "Application form"

		if (str.toLowerCase() === "/home/punches/report/consolidated".toLowerCase())
			title = "Punches Report"

		return title;
	};

	/**
	 * Collapse menu when clicking the bars icon
	 * @return void
	 */
	collapsedMenu = () => {
		this.setState(_ => {
			return { collapsedMenu: !this.state.collapsedMenu}
		});
	}

	renderHeader = () => {
		if (localStorage.getItem('LoginId'))
			return <React.Fragment>
				<input type="checkbox" className="MenuMobile-callback" id="MenuMobile-callback" onClick={this.collapsedMenu} />
				{localStorage.getItem('showMenu') == 'true' ?
					<label className="Header-mobileMenu" htmlFor="MenuMobile-callback">
						<i className="fas fa-bars" />
					</label> : ('')
				}
				<MobileMenu />
				<div className="main-container--header">
					<span className="icon-menu" onClick={this.handleClickMenu} />
					<span className="main-container__title"> {this.setTitle(window.location.pathname)}</span>
					<Toolbar handleOpenSnackbar={this.props.handleOpenSnackbar} />
				</div>
			</React.Fragment>
	}
	
	render() {
		return (
			<div className={`main-container ${!this.state.collapsedMenu ? 'uncollapsed-menu' : ''} `}>
				{this.renderHeader()}
				<div className="main-container--container">
					<CustomBreadcrumb />
					<Container />
				</div>
			</div>
		);
	}
}

MainContainer.propTypes = {};

export default Global(MainContainer);
