import React, {Component} from 'react';
import './index.css'
import withGlobalContent from "../Generic/Global";
import withApollo from "react-apollo/withApollo";

class ResetPassword extends Component {
    constructor(props){
        super(props);

        this.state = {
            showPassword: false,
            showPasswordConfirm: false,
            password: '',
            confirmPassword: '',
            loading: false
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
                loading: true
            }, () => {
                // this.props.client
                //     .mutate({
                //         mutation: '',
                //         variables: {
                //
                //         }
                //     });
            })
        } else {
            this.props.handleOpenSnackbar(
                'error',
                'Passwords do not match. Please try again!',
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
                            className="reset-password-input form-control"
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
                            className="reset-password-input form-control"
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