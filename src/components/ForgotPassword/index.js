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
            username: '',
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
                            <h4 className="reset-password-title">Forgot password?</h4>
                            <br />
                            <div className="input-reset-container">
                                <label htmlFor="username" className="primary mb-1">Enter Username</label>
                                <input
                                    name="username"
                                    id="username"
                                    onChange={this.onChangeHanler}
                                    type="text"
                                    className="form-control mt-2"
                                    required
                                />

                            </div>

                            <br />

                            <div className="row">
                                <div className="col-md-12">
                                    <button className="btn btn-md btn-success float-right">
                                        Save
                        {this.state.sending && (<i class="fas fa-spinner fa-spin ml-2" />)}
                                    </button>
                                </div>
                            </div>

                        </form >
                }

            </div >

        );
    }
}

export default withApollo(withGlobalContent(ForgotPassword));