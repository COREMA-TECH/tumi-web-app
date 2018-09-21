import React, {Component} from 'react';
import './index.css';
import Route from 'react-router-dom/es/Route';
import Login from '../Login/Login';
import Private from '../Private/Private';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import ApplyForm from "../ApplyForm/ApplyForm";

class Main extends Component {
    LoginId = sessionStorage.getItem('LoginId');

    render() {
        console.log('Home Signature', window.location.pathname);
        if (!window.location.pathname.toLocaleLowerCase().startsWith('home/signature')) {
            if (!this.LoginId & (window.location.pathname != '/login')) {
                window.location.href = '/login';
                return false;
            }
        }

        return (
            <div>
                <Route path="/login" component={Login}/>
                <Route path="/employment-application" component={ApplyForm}/>
                <PrivateRoute path="/home" component={Private}/>
            </div>
        );
    }
}

export default Main;
