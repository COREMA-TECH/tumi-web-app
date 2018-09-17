import React, { Component } from 'react';
import InputForm from 'ui-components/InputForm/InputForm';
import './index.css';
import Redirect from 'react-router-dom/es/Redirect';
import Route from 'react-router-dom/es/Route';
import Link from '@material-ui/icons/es/Link';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import AlertDialogSlide from 'Generic/AlertDialogSlide';

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

import withGlobalContent from 'Generic/Global';
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
			}
		}
	`;

	handleSubmit = (e, data) => {
		e.preventDefault();
		if (this.checkInputs()) {
			//this.setState({
			this.checkUser();
			//})
		}
	};

	// To check valid credentials and empty fields
	checkInputs() {
		return !(this.username === '' || this.pass === '');
	}

	// To check valid credentials
	checkUser() {
		this.props.client
			.query({
				query: this.GET_USERS_QUERY,
				variables: {
					Code_User: `'${document.getElementById('username').value}'`,
					Password: `'${document.getElementById('pass').value}'`
				},
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getvalid_users.length == 1) {
					if (data.data.getvalid_users[0].IsActive == 0) {
						sessionStorage.clear();
						this.props.handleOpenSnackbar('error', 'Error: Loading users: User invalid');
					} else {
						sessionStorage.setItem('LoginId', data.data.getvalid_users[0].Id);
						sessionStorage.setItem('FullName', data.data.getvalid_users[0].Full_Name);

						if (data.data.getvalid_users[0].IsAdmin == 1) { sessionStorage.setItem('IsAdmin', true); } else { sessionStorage.setItem('IsAdmin', false); }
						if (data.data.getvalid_users[0].AllowEdit == 1) { sessionStorage.setItem('AllowEdit', true); } else { sessionStorage.setItem('AllowEdit', false); }
						if (data.data.getvalid_users[0].AllowDelete == 1) { sessionStorage.setItem('AllowDelete', true); } else { sessionStorage.setItem('AllowDelete', false); }
						if (data.data.getvalid_users[0].AllowInsert == 1) { sessionStorage.setItem('AllowInsert', true); } else { sessionStorage.setItem('AllowInsert', false); }
						if (data.data.getvalid_users[0].AllowExport == 1) { sessionStorage.setItem('AllowExport', true); } else { sessionStorage.setItem('AllowExport', false); }

						/*sessionStorage.setItem('AllowEdit', data.data.getvalid_users[0].AllowEdit);
						sessionStorage.setItem('AllowDelete', data.data.getvalid_users[0].AllowDelete);
						sessionStorage.setItem('AllowInsert', data.data.getvalid_users[0].AllowInsert);
						sessionStorage.setItem('AllowExport', data.data.getvalid_users[0].AllowExport);*/
						window.location.href = '/home';
					}
				} else {
					sessionStorage.clear();
					this.props.handleOpenSnackbar('error', 'Error: Loading users: User not exists in data base');
				}
			})
			.catch((error) => {
				console.log('Error: Loading users: ', error);
			});
	}

	render(data) {
		// When user is logged redirect to the private routes
		sessionStorage.clear();
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
				<div className="limiter">
					<div className="container-login100">
						<div className="login-form">
							<div className="login-form__header" />
							<div className="txt1">
								<img
									width="150"
									height="150"
									src=" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOAAAADhCAMAAADmr0l2AAAAMFBMVEX////BwcG9vb37+/vDw8Pi4uL4+Pjz8/PW1tbZ2dnd3d3CwsLNzc3u7u7R0dHm5ubS8z9uAAAEaElEQVR4nO2d2barKhBFY49d/P+/PTZJru5hjEJ1eNd8yqNzAEXRFHk8AAAAAAAAAAAAAAAAAADwfyWr+qFoRoqhL7U/hppycHmSpmkykU4/OjfcxrJq8pfahjTNmzs4DvmO3EeyG7S/L5AmOdCbFZNG+xsD+Km3KBba3+lJf9Q5N4p5r/2tPjxP6s2KTvtrL1Odt1saMbKAWlxovpdiVN20vuw3GkYUTp2HX0wD8Up42RjW2l9+Dr/2mw2j6KWNt99oGEHm1gf4xRBLsxC9iUzb4AddqGCnbXDMENRBJ2wPw+AOOqEtcYSjEDQ8G5bBHXQitZt3kzSg4SbMSBpwbEJtkW+E5DAbQat7GDmNX5Lk2ib7VEQNODZhpe2yS0PlZ7WPBmdp/2EzXyProUbjaNg66Y+gxUF4fSPtQNBixk2UxixY3LsgjDFJ8tS22YFsmp+wGEYp/UzmMhCEIAR1uX0Uvf08SJrJWNyWoVsOGs1Fb7+aoNpTmwW1ZXYhDKMWg+jjUZP5Gd2ToRuEJofggzCXsdlD6fqo0R5KdbhkNYZOEGVrdi8E0YQZw+eDNE1oMQ99Q3L+Yvoiic81wy0m8+wVwfma1TnwTXAnNd1BJ8KOKOzfVfO/LTr7Wc1hNnT+90UtzxArfA1Ti1tNu9z9zrbfjZlY+ufC9WuV1if4v1ysfElao4v4Ay7VLkUTXtacrz5rI5jedzkXa+KoltgnO1EBWpvPPo8pDmt48yhysx9U9bcqbBdf6PxCVTyX8vmX2iR3nzr6N1VfNLVzdVP0t2k5AAAAANyTqm9cl//cyW/z7lkXkT3ylPWuS/fy66+LijE3fRaR5G9l0V1xW1u2zv7KfvC0e0smpldQpQuyezl2VpuxCjl12SjmFrdISyo9o4r+L5B8UzQ1Fntau0XR0FEMZe9cYaUROZpvwcaOMFVt+a5hp78pzNQ9Pyh304y0GmQP3WsX/H66B6Mlv56qIcnrOIYNs1ZIUGscCoy/j6FGLCUtNvuJ/JZG+MXQS4gXTFJWYp1COPWWmSDWCIdS2QG4IJmWUr7LcRrBu86UlYLnEeykTw2/RO5NQPEI+kJs/asRYRZDmTij1YCJ1GSo1oBCZVuKDShTt6XYgIlEIKWq8vRDYC6kfNDBA/50RmwZvw/70lc1xExwT/akb6r4wL3y1fbj7qN0b6R6C/Je8laOoRO8cVR3ll9gFdSWS5gHoW4a8xLkHITqs+AEZx2XymbTXzhnQrpHjUJgFNTabdrAuXFhQ5BxWW9DkLEF1VPtGT4/C5kabxQN/08eAjiTUQuZDO+SV/Bc/hu8C0ILMz2nn4EFL/fer/qCkHv3Xn09wX7+otyE/CdoOsfXHz+BdwVUJ3uRiwjCd5zWCN13oq6ROI/UjTUlQ8G/y9bYm0lFHz2szj72Q+cn/S5L0Uoqpk6hgCKwFvK8XNo2SiW+2eC6dn4dhosxsujX9macKLsBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjmH73ePwmPinNzAAAAAElFTkSuQmCC"
								/>
							</div>
							<form onSubmit={this.handleSubmit} className="login-form__content">
								<div
									className="wrap-input100 validate-input m-b-23"
									data-validate="Username is reauired"
								>
									<span className="label-input100">Username</span>
									<input
										className="input100"
										type="text"
										id="username"
										name="username"
										placeholder="Type your username"
										required="required"
									/>
									<span className="focus-input100" data-symbol="&#xf206;" />
								</div>
								<div className="wrap-input100 validate-input" data-validate="Password is required">
									<span className="label-input100">Password</span>
									<input
										className="input100"
										type="password"
										id="pass"
										name="pass"
										placeholder="Type your password"
										required="required"
									/>
									<span className="focus-input100" data-symbol="&#xf190;" />
								</div>

								<div className="text-right">
									<a href="#" />
								</div>

								<div className="text-right">
									<a href="#">Forgot password?</a>
								</div>
								<input type="submit" className="login-button" value="Login" />

								<div className="txt1">
									<span>Or Sign Up Using</span>
								</div>

								<div className="flex-c-m">
									<a href="#" className="login100-social-item_bg1">
										<i className="fa fa-facebook" />
									</a>

									<a href="#" className="login100-social-item_bg2">
										<i className="fa fa-twitter" />
									</a>

									<a href="#" className="login100-social-item_bg3">
										<i className="fa fa-google" />
									</a>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withApollo(withGlobalContent(Login));

const PrivateRouteComponent = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={(props) =>
			1 === 1 ? (
				<Component {...props} />
			) : (
					<Redirect
						to={{
							pathname: '/login',
							state: { from: props.location }
						}}
					/>
				)}
	/>
);
