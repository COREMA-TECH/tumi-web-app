import React, { Component } from 'react';
import './index.css';
import Route from 'react-router-dom/es/Route';
import Login from '../Login/Login';
import Private from '../Private/Private';
import PrivateRoute from '../PrivateRoute/PrivateRoute';

class Main extends Component {
	LoginId = sessionStorage.getItem('LoginId');
	render() {
<<<<<<< HEAD
		if (!this.LoginId & (window.location.pathname != '/login')) {
			window.location.href = '/login';
			return false;
=======
		if (!window.location.pathname.toLocaleLowerCase().startsWith('home/signature')) {
			if (!this.LoginId & (window.location.pathname != '/login')) {
				window.location.href = '/login';
				return false;
			}
>>>>>>> e405e581056a7cb6a62f5de7ef9af0d95509676d
		}

		return (
			<div>
				<Route path="/login" component={Login} />
				<PrivateRoute path="/home" component={Private} />
			</div>
		);
	}
}

export default Main;
