import React, { Component } from 'react';
import './index.css'
import withGlobalContent from "../Generic/Global";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';

import { UPDATE_USER_PASSWORD } from "./Mutations";
import Button from '@material-ui/core/Button';
import SaveIcon from '@material-ui/icons/Save';

class ResetPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            showPassword: false,
            showPasswordConfirm: false,
            password: '',
            confirmPassword: '',
            loading: false,
            invalidPassword: false
        }
    }

    // To validate all the inputs and set a red border when the input is invalid
    validateInvalidInput = () => {
        if (document.addEventListener) {
            document.addEventListener(
                'invalid',
                (e) => {
                    e.target.className += ' invalid-input';
                },
                true
            );
        }

        if (document.addEventListener) {
            document.addEventListener(
                'valid',
                (e) => {
                    e.target.className -= ' invalid-input';
                },
                true
            );
        }
    };

    handleSubmit = (e) => {
        e.preventDefault();

        if (this.state.password === this.state.confirmPassword) {

            this.setState(
                { Changing: true }
            )
            this.props.client
                .mutate({
                    mutation: UPDATE_USER_PASSWORD,
                    variables: {
                        id: localStorage.getItem('ChangePassword'),
                        password: "'" + this.state.password + "','AES_KEY'"
                    },
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {
                    this.setState(
                        { Changing: false }
                    )
                    this.props.handleOpenSnackbar(
                        'success',
                        'Password reset Successfully!',
                        'bottom',
                        'right'
                    );
                    window.location.href = '/login';
                })
                .catch(error => {
                    // If there's an error show a snackbar with a error message
                    this.setState(
                        { Changing: false }
                    )
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error reset password. Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        } else {
            this.props.handleOpenSnackbar(
                'error',
                'Error reset password. both password is not equal!',
                'bottom',
                'center'
            );
        }
    };

    render() {
        this.validateInvalidInput();

        return (
            <div className="reset-password-container">
                <form className="reset-password-form" onSubmit={this.handleSubmit}>
                    <h4 className="reset-password-title">New Password</h4>
                    <br />
                    <div className="input-reset-container">
                        <label htmlFor="" className="primary">Password</label>
                        <input
                            id="password"
                            onChange={e => {
                                this.setState({
                                    password: e.target.value
                                })
                            }}
                            type={this.state.showPassword ? 'text' : 'password'}
                            className={!this.state.invalidPassword ? "reset-password-input form-control" : "reset-password-input form-control invalid-password"}
                            minLength="8"
                            required
                        />
                        {
                            this.state.showPassword ? (
                                <i className="far fa-eye" onClick={event => {
                                    this.setState({
                                        showPassword: false
                                    })
                                }} />
                            ) : (
                                    <i className="far fa-eye-slash" onClick={event => {
                                        this.setState({
                                            showPassword: true
                                        })
                                    }} />
                                )
                        }
                    </div>
                    <div className="input-reset-container">
                        <label htmlFor="" className="primary">Confirm Password</label>
                        <input
                            id="confirmPassword"
                            onChange={e => {
                                this.setState({
                                    confirmPassword: e.target.value
                                })
                            }}
                            type={this.state.showPasswordConfirm ? 'text' : 'password'}
                            className={!this.state.invalidPassword ? "reset-password-input form-control" : "reset-password-input form-control invalid-password"}
                            minLength="8"
                            required
                        />
                        {
                            this.state.showPasswordConfirm ? (
                                <i className="far fa-eye" onClick={event => {
                                    this.setState({
                                        showPasswordConfirm: false
                                    })
                                }} />
                            ) : (
                                    <i className="far fa-eye-slash" onClick={event => {
                                        this.setState({
                                            showPasswordConfirm: true
                                        })
                                    }} />
                                )
                        }
                    </div>
                    <br />

                    <div className="row">
                        <div className="col-md-12">
                            <button className="btn btn-md btn-success float-right">
                                Save
                            {this.state.Changing && (<i class="fas fa-spinner fa-spin ml-2" />)}
                            </button>
                        </div>
                    </div>

                </form>
            </div>

        );
    }
}

export default withApollo(withGlobalContent(ResetPassword));