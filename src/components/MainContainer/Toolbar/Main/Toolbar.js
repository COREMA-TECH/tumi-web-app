import React, { Component } from 'react';
import './index.css';
import onClickOutside from 'react-onclickoutside';
import { withRouter } from 'react-router-dom';
import HotelDialog from './HotelDialog';

class Toolbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			languageIcon: '',
			open: false
		};
	}

	handleClickOpen = (event) => {
		event.preventDefault();
		this.setState({
			open: true
		});
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleClickOutside = () => {
		let dropdowns = document.getElementsByClassName('dropdown-menu');
		var i;
		for (i = 0; i < dropdowns.length; i++) {
			var openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	};

	handleLogout = (event) => {
		localStorage.clear();
		window.location.href = '/login';
		event.preventDefault();
	};

	changeLanguage = (event) => {
		if (this.state.languageIcon == 'en') localStorage.setItem('languageForm', 'es');
		else localStorage.setItem('languageForm', 'en');
		window.location.reload();
		event.preventDefault();

	};

	componentWillMount() {
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
					<span className="main-container__title">Hi, {localStorage.getItem('FullName') ? (localStorage.getItem('FullName').trim() == '' ? localStorage.getItem('CodeUser').trim() : localStorage.getItem('FullName').trim()) : ''}</span>
					<li className="RightMenu-item">
						<a href="" onClick={this.changeLanguage} className="Language-en">
							<img src={`/languages/${this.state.languageIcon}.png`} className="Language-icon" />
						</a>
					</li>

					<li className="RightMenu-item">
						<div className="dropdown">
							<button
								onClick={this.handleDropDown}
								className="btn btn-link btn-empty"
								type="button"
								id="dropdownMenuButton"
								data-toggle="dropdown"
								aria-haspopup="true"
								aria-expanded="false"
							>
								<i className="fas fa-ellipsis-v" />
							</button>
							<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
								<div className="row app-shortcuts">
									{localStorage.getItem('showMenu') == "true" ?
										<React.Fragment>
											<a className="col-4 app-shortcuts__item" href="/home/work-orders">
												<i className="fas fa-briefcase" />
												<small>Work Orders</small>
												<span className="app-shortcuts__helper bg-gd-danger" />
											</a>
											<a className="col-4 app-shortcuts__item" href="" onClick={(e) => {
												e.preventDefault();
												document.getElementById('dropdownMenuButton').click();
												this.props.history.push({
													pathname: '/home/company/add',
													state: { idCompany: 0, idContract: 0 }
												});
											}}
											>
												<i className="fas fa-warehouse" />
												<small>Add Management</small>
												<span className="app-shortcuts__helper bg-gd-primary" />
											</a>
											<a className="col-4 app-shortcuts__item" href="" onClick={(e) => this.handleClickOpen(e)}>
												<i className="fas fa-building" />
												<small>Add New Property</small>
												<span className="app-shortcuts__helper bg-gd-primary" />
											</a>
											<a
												className="col-4 app-shortcuts__item"
												href=""
												onClick={(e) => {
													e.preventDefault();
													document.getElementById('dropdownMenuButton').click();
													this.props.history.push({
														pathname: '/home/contract/add',
														state: { contract: 0 }
													});
												}}
											>
												<i className="far fa-handshake" />
												<small>Add Contract</small>
												<span className="app-shortcuts__helper bg-gd-info" />
											</a>
											<a className="col-4 app-shortcuts__item" href="/reset">
												<i className="fas fa-retweet" />
												<small>Reset Password</small>
												<span className="app-shortcuts__helper bg-gd-danger" />
											</a>
										</React.Fragment>
										: ('')}
									<a className="col-4 app-shortcuts__item" href="" onClick={this.handleLogout}>
										<i className="fas fa-sign-out-alt" />
										<small>LogOut</small>
										<span className="app-shortcuts__helper bg-gd-info" />
									</a>
								</div>
							</div>
						</div>
					</li>
				</ul>
				<HotelDialog
					open={this.state.open}
					handleClose={this.handleClose}
					handleOpenSnackbar={this.props.handleOpenSnackbar} />
			</div>
		);
	}
}

export default withRouter(onClickOutside(Toolbar));
