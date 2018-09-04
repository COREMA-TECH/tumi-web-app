import React, {Component} from 'react';
import InputForm from "../ui-components/InputForm/InputForm";
import './index.css';
import Redirect from "react-router-dom/es/Redirect";
import Route from "react-router-dom/es/Route";
import Link from "@material-ui/icons/es/Link";
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import AlertDialogSlide from '../Generic/AlertDialogSlide';
import { MySnackbarContentWrapper } from '../Generic/SnackBar';
import { Snackbar } from '@material-ui/core';

class Login extends Component {
   // var result;
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            logged: false
        }
    }

    GET_USERS_QUERY = gql`
            query getvalid_users($Code_User:String,$Password:String) {
                getvalid_users(Code_User:$Code_User,Password:$Password)
                {
                    Id
                }
            }
    `;

    handleSubmit = (e,data) => {
        e.preventDefault();
        if (this.checkInputs()) {
            //this.setState({
             this.checkUser()
            //})
        }
    };


    // To check valid credentials and empty fields
    checkInputs() {
        return !(this.state.username === '' || this.state.password === '');
    }

 // To check valid credentials 
    checkUser() {
    this.props.client
            .query({
                query: this.GET_USERS_QUERY,
                variables: {
                    Code_User: `'${this.state.username}'`,
                    Password: `'${this.state.password}'`
                },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getvalid_users.length == 1) {
                   console.log( "entramos en al true");                   
                   window.location.href = "/home";
                } else {
                    console.log( "entramos en al false");     
                        this.handleOpenSnackbar(
                        'error',
                        'Error: Loading users: User not exists in data base'
                    );

                }
            })
            .catch((error) => {
                console.log('Error: Loading users: ', error);
            });
    }

    handleCloseSnackbar = (event, reason) => {
        if(reason ==='clickaway')
        {
            return;
        }
        this.setState({openSnackbar:false});
    };
    handleOpenSnackbar = (variant, message) => {
        this.setState({
            openSnackbar: true,
            variantSnackbar: variant,
            messageSnackbar: message
        });
    };
 

    render(data) {

        // When user is logged redirect to the private routes
        if (this.state.logged) {
            return (
                <Redirect
                    to={{
                        pathname: "/home",
                        state: { logged: true }
                    }}
                />
            )
        }


        return (
            <div className="login-container">

            <Snackbar
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    open={this.state.openSnackbar}
                    autoHideDuration={3000}
                    onClose={this.handleCloseSnackbar}
            >
                    <MySnackbarContentWrapper
                        onClose={this.handleCloseSnackbar}
                        variant={this.state.variantSnackbar}
                        message={this.state.messageSnackbar}
                    />
                </Snackbar>
                <div className="login-form">
                    <div className="login-form__header">
                        <span>Tumi</span>
                    </div>
                    <form onSubmit={this.handleSubmit} className="login-form__content">
                        <InputForm
                            placeholder="Username"
                            value={this.state.username}
                            change={(text) => {
                                this.setState({
                                    username: text
                                })
                            }}
                        />
                        <InputForm
                            placeholder="Password"
                            type="password"
                            value={this.state.password}
                            change={(text) => {
                                this.setState({
                                    password: text
                                })
                            }}
                        />
                        <input type="submit" className="login-button" value="Login"/>
                    </form>
                </div>
            </div>
        );
    }
}


export default withApollo(Login);

const PrivateRouteComponent = ({component: Component, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            1 === 1 ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/login",
                        state: {from: props.location}
                    }}
                />
            )
        }
    />
);