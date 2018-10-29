import React, { Component } from 'react';
import './index.css';
import Route from 'react-router-dom/es/Route';
import Login from '../Login/Login';
import Private from '../Private/Private';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import ApplyFormMessage from '../ApplyForm/ApplyFormMessage';
import StepperApplyForm from '../ApplyForm/Stepper/StepperApplyForm';
import PropTypes from 'prop-types';
import ResetPassword from "../ResetPassword/ResetPassword";

class Main extends Component {
    LoginId = localStorage.getItem('LoginId');
    token = localStorage.getItem('Token');

    render() {

        if (
            !(
                window.location.pathname == '/home/signature/' ||
                window.location.pathname == '/employment-application' ||
                window.location.pathname == '/employment-application-message' ||
                window.location.pathname == '/home/reset'
            )
        )
            if (!this.LoginId || !this.token) {
                //Not logged in
                //If not logged in redirect to login form if pahth is not login
                if (window.location.pathname != '/login') {
                    window.location.href = '/login';
                    return false;
                }
            } else {
                //Logged in but path is  root then redirect to home
                if (window.location.pathname == '/') {
                    window.location.href = '/home';
                    return false;
                }
            }
        else {
            //Use this because the endpoint need a valid token be accessed
            localStorage.setItem('Token', this.context.token);
        }
        return (
            <div>
                <Route path="/login" component={Login} />
                <Route exact path="/reset-password" component={ResetPassword} />


                {/*<PrivateRoute path="/application/info" component={ApplicationInfo} />*/}
                <PrivateRoute path="/employment-application" component={StepperApplyForm} />
                <PrivateRoute path="/employment-application-message" component={ApplyFormMessage} />
                <PrivateRoute path="/home" component={Private} />
            </div>
        );
    }

    static contextTypes = {
        token: PropTypes.string
    };
}

export default Main;
