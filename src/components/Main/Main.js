import React, {Component} from 'react';
import './index.css';
import Route from 'react-router-dom/es/Route';
import Login from '../Login/Login';
import Private from '../Private/Private';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import ApplyFormMessage from '../ApplyForm/ApplyFormMessage';
import StepperApplyForm from "../ApplyForm/Stepper/StepperApplyForm";

class Main extends Component {
    LoginId = sessionStorage.getItem('LoginId');

    //(window.location.pathname != '/home/signature/')
    render() {
        if (
            !(
                window.location.pathname == '/home/signature/' ||
                window.location.pathname == '/employment-application' ||
                window.location.pathname == '/employment-application-message'
            )
        )
            if (!this.LoginId) {
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

        return (
            <div>
                <Route path="/login" component={Login}/>
                <PrivateRoute path="/employment-application" component={StepperApplyForm}/>
                <PrivateRoute path="/employment-application-message" component={ApplyFormMessage}/>
                <PrivateRoute path="/home" component={Private}/>
            </div>
        );
    }
}

export default Main;
