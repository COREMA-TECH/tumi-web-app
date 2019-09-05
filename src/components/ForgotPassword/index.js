import React, { Component } from 'react';
import './index.css'
import withGlobalContent from "../Generic/Global";
import withApollo from "react-apollo/withApollo";
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import { UPDATE_USER_PASSWORD } from "./mutations";

class ForgotPassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sending: false,
            username: null,
            reseted: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();

        this.setState(() => ({ sending: true }), () => {
            this.props.client
                .mutate({
                    mutation: UPDATE_USER_PASSWORD,
                    variables: {
                        Code_User: this.state.username
                    }
                })
                .then(({ data }) => {
                    this.setState(() => ({ sending: false, reseted: true }));
                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 1000)
                })
                .catch(error => {
                    // If there's an error show a snackbar with a error message
                    this.setState(() => ({ sending: false }));
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error reset password. Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        })


    };

    onChangeHanler = (e) => {
        let elem = e.target;
        this.setState(() => ({ [elem.name]: elem.value }));
    }

    onClickCancelHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        window.location.href = '/login';
    }

    render() {
        let { reseted } = this.state;

        return (

            < div className="reset-password-container" >
                {
                    reseted ? <div className="reset-password-form">
                        <div className="mb-5">
                            <NothingToDisplay message={'Password Reseted!'} type="Error-success" icon="ok" />
                        </div>
                    </div> :
                        < form className="reset-password-form" onSubmit={this.handleSubmit} >
                            <h4 className="reset-password-title w-100 text-center mb-3 pb-3 border-bottom">Forgot password?</h4>
                            <div className="input-reset-container">
                                <input
                                    name="username"
                                    id="username"
                                    onChange={this.onChangeHanler}
                                    placeholder="Username"
                                    type="text"
                                    className="form-control mt-2"
                                    value={this.state.username}
                                    required
                                />

                            </div>
                            <div className="row w-100">
                                <div className="col-md-6">
                                    <button className="btn btn-md btn-danger float-right" disabled={this.state.sending} onClick={this.onClickCancelHandler}>
                                        Cancel <i class="fas fa-sign-out-alt ml-1"></i>
                                    </button>
                                </div>
                                <div className="col-md-6">
                                    <button className="btn btn-md btn-success float-right">
                                        Submit{this.state.sending ? <i class="fas fa-spinner fa-spin ml-2" /> : <i class="fas fa-key ml-2"></i>}
                                    </button>
                                </div>
                            </div>
                            <div className="row border-top">
                                <span className="text-muted">
                                    Please enter your username in the field above, once completed, you will receive an email containing a temporary password shortly.
                                </span>
                            </div>

                        </form >
                }

            </div >

        );
    }
}

export default withApollo(withGlobalContent(ForgotPassword));