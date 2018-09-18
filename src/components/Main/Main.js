import React, { Component } from 'react';
import './index.css';
import Route from 'react-router-dom/es/Route';
import Login from '../Login/Login';
import Private from '../Private/Private';
import PrivateRoute from '../PrivateRoute/PrivateRoute';

class Main extends Component {
<<<<<<< HEAD
	LoginId = sessionStorage.getItem('LoginId');
	render() {
		if (!window.location.pathname.toLocaleLowerCase().startsWith('home/signature')) {
			if (!this.LoginId & (window.location.pathname != '/login')) {
				window.location.href = '/login';
				return false;
			}
		}
=======
    LoginId = sessionStorage.getItem('LoginId');
    render() {
        if (!window.location.pathname.toLocaleLowerCase().startsWith('home/signature')) {
            if (!this.LoginId & (window.location.pathname != '/login')) {
                window.location.href = '/login';
                return false;
            }
        }
>>>>>>> 626b5ff3e4e6023b5cd1ece5fbd7f3fa48774b7a

        return (
            <div>
                <Route path="/login" component={Login} />
                <PrivateRoute path="/home" component={Private} />
            </div>
        );
    }
}

export default Main;
