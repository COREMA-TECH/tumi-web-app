import React, { Component } from 'react';
import './index.css';
import Redirect from 'react-router-dom/es/Redirect';
import Route from 'react-router-dom/es/Route';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

import './images/icons/favicon.ico';
import './images/login.png';
import './fonts/iconic/css/material-design-iconic-font.min.css';
import './fonts/font-awesome-4.7.0/css/font-awesome.min.css';
import './vendor/animate/animate.css';
import './vendor/css-hamburgers/hamburgers.min.css';
import './vendor/animsition/css/animsition.min.css';
import './vendor/select2/select2.min.css';
import './vendor/daterangepicker/daterangepicker.css';
import './css/util.css';
import './css/main.css';
import { withStyles } from '@material-ui/core/styles';
import withGlobalContent from 'Generic/Global';

import axios from 'axios';

const styles = (theme) => ({
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},
	buttonSuccess: {
		background: ' #3da2c7',
		borderRadius: '5px',
		padding: '.5em 1em',

		fontWeight: '300',
		fontFamily: 'Segoe UI',
		fontSize: '1.1em',
		color: 'white',
		textTransform: 'none',
		//cursor: pointer;
		margin: '2px',

		//	backgroundColor: '#357a38',
		color: 'white',
		'&:hover': {
			background: ' #3da2c7'
		}
	},

	buttonProgress: {
		//color: ,
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12,
		color: 'white'
	}
});

class Login extends Component {
	// var result;
	constructor(props) {
		super(props);

		this.state = {
			username: '',
			password: '',
			logged: false
		};
	}

	GET_USERS_QUERY = gql`
		query getvalid_users($Code_User: String, $Password: String) {
			getvalid_users(Code_User: $Code_User, Password: $Password) {
				Id
				Code_User
				Full_Name
				Electronic_Address
				Phone_Number
				Id_Language
				IsAdmin
				AllowEdit
				AllowDelete
				AllowInsert
				AllowExport
				IsActive
				Token
				Id_Roles
				IdSchedulesEmployees
				IdSchedulesManager
				isEmployee
				Id_Entity
			}
		}
	`;

	handleSubmit = (e) => {
		this.setState({ loadingLogin: true });
		e.preventDefault();
		if (this.checkInputs()) {
			//this.setState({
			this.checkUser();
			//})
		} else {
			this.props.handleOpenSnackbar('warning', 'User invalid');
			this.setState({ loadingLogin: false });
		}
	};

	handleKeyPress = (event) => {
		if (event.key == 'Enter') {
			this.handleSubmit(event);
		}
	};

	// To check valid credentials and empty fields
	checkInputs() {
		return this.state.username && this.state.pass;
	}

	// To check valid credentials
	async checkUser() {
		const config = {
			headers: {
			  "Content-Type": "application/json",
			}
		}

		axios.post(this.context.loginHttpLink, {
			Code_User: document.getElementById('username').value.trim(),
			Password: document.getElementById('pass').value.trim()
		}, config)
		.then(({data: user}) => {
			if (user) {
				// const user = data.data.getvalid_users;
				if (user.IsActive == 0) {
					localStorage.clear();
					this.props.handleOpenSnackbar('error', 'Error: Loading users: User invalid');
					this.setState({ loadingLogin: false });
				}
				else {
					if (document.getElementById('pass').value === 'TEMP') {
						localStorage.setItem('ChangePassword', user.Id);
						localStorage.setItem('CodeUser', user.Code_User);
						window.location.href = '/reset';
					}
					else {
						localStorage.setItem('ChangePassword', user.Id);
						localStorage.setItem('LoginId', user.Id);
						localStorage.setItem('CodeUser', user.Code_User);
						localStorage.setItem('FullName', user.Full_Name);
						localStorage.setItem('Token', user.Token);
						localStorage.setItem('IdRoles', user.Id_Roles);
						localStorage.setItem("Id_Entity", user.Id_Entity);
						localStorage.setItem('IdSchedulesEmployees', user.IdSchedulesEmployees);
						localStorage.setItem('IdSchedulesManager', user.IdSchedulesManager);

						localStorage.setItem('isEmployee', user.Id_Roles == 13 ? true : false);

						if (user.Id_Roles == 1 || user.Id_Roles == 10 || user.Id_Roles == 2) { localStorage.setItem('ShowMarkup', true); }
						else { localStorage.setItem('ShowMarkup', false); }

						if (user.IsAdmin == 1) {
							localStorage.setItem('IsAdmin', true);
						} else {
							localStorage.setItem('IsAdmin', true);
						}
						if (user.AllowEdit == 1) {
							localStorage.setItem('AllowEdit', true);
						} else {
							localStorage.setItem('AllowEdit', true);
						}
						if (user.AllowDelete == 1) {
							localStorage.setItem('AllowDelete', true);
						} else {
							localStorage.setItem('AllowDelete', true);
						}
						if (user.AllowInsert == 1) {
							localStorage.setItem('AllowInsert', true);
						} else {
							localStorage.setItem('AllowInsert', true);
						}
						if (user.AllowExport == 1) {
							localStorage.setItem('AllowExport', true);
						} else {
							localStorage.setItem('AllowExport', true);
						}

						window.location.href = '/home';
					}

				}
			} else {
				localStorage.clear();
				this.props.handleOpenSnackbar('error', 'Error: Loading users: User not exists in data base');
				this.setState({ loadingLogin: false });
			}
		})
		.catch(e => {
			this.props.handleOpenSnackbar('error', 'Error logging in, please try again.');
			this.setState({ loadingLogin: false });
		});
	}

	render(data) {
		// When user is logged redirect to the private routes
		//localStorage.clear();
		if (this.state.logged) {
			return (
				<Redirect
					to={{
						pathname: 'localhost/home',
						state: { logged: true }
					}}
				/>
			);
		}

		return (
			<div className="login-container">
				<div class="login-form">
					<form action="/examples/actions/confirmation.php" method="post">
						<div class="avatar">
							<img src="/avatar.png" alt="Avatar" />
						</div>
						<h2 class="text-center">Member Login</h2>
						<div class="form-group">
							<input
								className="form-control"
								type="text"
								id="username"
								name="username"
								placeholder="Type your username"
								required="required"
								onChange={(text) => {
									this.setState({ username: text });
								}}
								onKeyPress={this.handleKeyPress}
							/>
						</div>
						<div class="form-group">
							<input
								className="form-control"
								type="password"
								id="pass"
								name="pass"
								placeholder="Type your password"
								required="required"
								onChange={(text) => {
									this.setState({ pass: text });
								}}
								onKeyPress={this.handleKeyPress}
							/>
						</div>
						<div class="form-group">
							<button
								//className="contract-next-button"
								className="btn btn-success btn-lg btn-block"
								disabled={this.state.loadingLogin}
								onClick={this.handleSubmit}
								type="submit"
							>
								Sign in
								{this.state.loadingLogin && (<i class="fas fa-spinner fa-spin ml-2" />)}
							</button>

						</div>
						<div class="clearfix">
							<label class="pull-left Remember-label checkbox-inline"><input type="checkbox" /> Remember me</label>
							<a href="/forgotpassword" class="pull-right forgot">Forgot Password?</a>
						</div>
						<div className="txt1">
							<span>Or Sign Up Using</span>
						</div>

						<div className="flex-c-m Social">
							<a href="#" className="login100-social-item_bg1 social-link">
								<i className="fa fa-facebook" />
							</a>

							<a href="#" className="login100-social-item_bg2 social-link">
								<i className="fa fa-twitter" />
							</a>

							<a href="#" className="login100-social-item_bg3 social-link">
								<i className="fa fa-google" />
							</a>
						</div>
					</form>
				</div>

			</div>
		);
	}
	static contextTypes = {
		loginClient: PropTypes.object,
		loginHttpLink: PropTypes.string
	};
}
Login.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(withGlobalContent(Login));

