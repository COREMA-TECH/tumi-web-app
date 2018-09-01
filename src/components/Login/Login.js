import React, {Component} from 'react';
import InputForm from "../ui-components/InputForm/InputForm";
import './index.css';
import Redirect from "react-router-dom/es/Redirect";
import Route from "react-router-dom/es/Route";
import Link from "@material-ui/icons/es/Link";

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            logged: false
        }
    }

    handleSubmit = () => {
        if (this.checkInputs()) {
            this.setState({
                logged: true
            })
        }
    };


    // To check valid credentials and empty fields
    checkInputs() {
        return !(this.state.username === '' || this.state.password === '');
    }

    render() {

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


export default Login;


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