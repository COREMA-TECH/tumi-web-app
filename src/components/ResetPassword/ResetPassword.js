import React, {Component} from 'react';
import './index.css'
import withGlobalContent from "../Generic/Global";
import withApollo from "react-apollo/withApollo";
import {UPDATE_USER_PASSWORD} from "./Mutations";

class ResetPassword extends Component {
    constructor(props){
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
        e.stopPropagation();

        if(this.state.password === this.state.confirmPassword){
            this.setState({
                loading: true,
                invalidPassword: false
            }, () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_USER_PASSWORD,
                        variables: {
                            id: 10,
                            password: "'ADMIN','AES_KEY'"
                        }
                    });
            })
        } else {
            this.props.handleOpenSnackbar(
                'error',
                'Passwords do not match. Please try again!',
                'bottom',
                'center'
            );

            this.setState({
                invalidPassword: true
            })
        }
    };

    render() {
        this.validateInvalidInput();

        return (
            <div className="reset-password-container">
                <form className="reset-password-form" onSubmit={this.handleSubmit}>
                    <h4 className="reset-password-title">New Password</h4>
                    <br/>
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
                                }}/>
                            ) : (
                                <i className="far fa-eye-slash" onClick={event => {
                                    this.setState({
                                        showPassword: true
                                    })
                                }}/>
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
                                }}/>
                            ) : (
                                <i className="far fa-eye-slash" onClick={event => {
                                    this.setState({
                                        showPasswordConfirm: true
                                    })
                                }}/>
                            )
                        }
                    </div>
                    <br/>
                    <button className="btn btn-success btn-reset-password">
                        Save
                    </button>
                </form>
            </div>
        );
    }
}

ResetPassword.propTypes = {};

export default withApollo(withGlobalContent(ResetPassword));