import React, {Component} from 'react';
import InputForm from "../ui-components/InputForm/InputForm";
import './index.css';

class Login extends Component {
    render() {
        return (
            <div className="login-container">
                <div className="login-form">
                    <div className="login-form__header">
                        <span>Tumi</span>
                    </div>
                    <div className="login-form__content">
                        <InputForm/>
                        <InputForm/>
                        <input type="submit" className="login-button" value="Login" />
                    </div>
                </div>
            </div>
        );
    }
}


export default Login;
