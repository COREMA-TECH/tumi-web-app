import React, { Component } from 'react';
import './index.css';
import onClickOutside from 'react-onclickoutside';
import { withRouter } from 'react-router-dom';
import HotelDialog from './HotelDialog';
import { GET_ROLES_FORMS } from '../../../Nav/MobileMenu/Queries';
import withApollo from 'react-apollo/withApollo';

class Toolbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			languageIcon: '',
			open: false,
			dataRolForm: []
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

	changeLanguage = async (e) => {
		e.preventDefault();
		let initialValue = localStorage.getItem('languageForm');

		if (this.state.languageIcon == 'en') {
			console.log("IF | Languages is --> ", localStorage.getItem('languageForm'));
			await localStorage.setItem('languageForm', 'es');
            console.log("New value is --> ", localStorage.getItem('languageForm'));
        }

        if (this.state.languageIcon == 'es') {
            console.log("ELSE | Languages is --> ", localStorage.getItem('languageForm', () => {

			}));
			await localStorage.setItem('languageForm', 'en');
            console.log("New value is --> ", localStorage.getItem('languageForm'));
        }

		window.location.reload();
	};

	componentWillMount() {
		//this.getRolesFormsInfo();
		this.setState({
			languageIcon: localStorage.getItem('languageForm')
		}, () => {
			console.log("Language --> ", localStorage.getItem('languageForm'));
		});

		this.getRolesFormsInfo();
	}

	handleDropDown = (event) => {
		event.preventDefault();
		let selfHtml = event.currentTarget;
		let submenu = selfHtml.nextSibling;
		submenu.classList.toggle('show');
	};

	getRolesFormsInfo = () => {
		this.setState(
			{
				loading: true
			},
			() => {
				this.props.client
					.query({
						query: GET_ROLES_FORMS,
						variables: {
							IdRoles: localStorage.getItem('IdRoles')
						}
					})
					.then(({ data }) => {

						this.setState({
							dataRolForm: data.rolesforms,
							loading: false
						});
					})
					.catch((error) => {
						this.setState({
							loading: false
						});

						this.props.handleOpenSnackbar(
							'error',
							'Error to get data. Please, try again!',
							'bottom',
							'right'
						);
					});
			}
		);
	};

	render() {
		let items = this.state.dataRolForm;
		let WO = false;
		let Manager = false;
		let Property = false;
		let Contract = false;

		items.forEach((wo) => {
			if (wo.Forms.Value == '/home/work-orders') { WO = true }
			if (wo.Forms.Value == '/home/company/add') { Manager = true }
			if (wo.Forms.Value == '/home/Properties') { Property = true }
			if (wo.Forms.Value == '/home/contract/add') { Contract = true }
		})

		return (
			<div className="toolbar__main">
				<ul className="RightMenu-list">
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
					
								{/* Greeting */}
								<div className="UserSettings">
									<span className="main-container__title-user">Hi, {localStorage.getItem('FullName') ? (localStorage.getItem('FullName').trim() == '' ? localStorage.getItem('CodeUser').trim() : localStorage.getItem('FullName').trim()) : ''}</span>
									<div className="RightMenu-item">
										<a href="" onClick={this.changeLanguage} className="Language-en">
											<img src={`/languages/${this.state.languageIcon}.png`} className="Language-icon" />
										</a>
									</div>								
								</div>

									{localStorage.getItem('showMenu') == "true" ?
										<React.Fragment>
											<a className={WO ? "col-4 app-shortcuts__item" : "col-4 isDisabled"} href="/home/work-orders">
												<i className="fas fa-briefcase" />
												<small>Work Orders</small>
												<span className="app-shortcuts__helper bg-gd-danger" />
											</a>
											<a className={Manager ? "col-4 app-shortcuts__item" : "col-4 isDisabled"} href="" onClick={(e) => {
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
											<a className={Property ? "col-4 app-shortcuts__item" : "col-4 isDisabled"} href="" onClick={(e) => this.handleClickOpen(e)}>
												<i className="fas fa-building" />
												<small>Add New Property</small>
												<span className="app-shortcuts__helper bg-gd-primary" />
											</a>
											<a
												className={Contract ? "col-4 app-shortcuts__item" : "col-4 isDisabled"}
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

export default withApollo(withRouter(onClickOutside(Toolbar)));
