import React, { Component } from 'react';
import InputForm from "../InputForm/InputForm";
import InputMask from "react-input-mask";

class UserFormContent extends Component {
    render() {
        return <div className="row">
            <div className="col-lg-12">
                <div className="row">
                    <div className="col-md-6 col-lg-6">
                        <label htmlFor="">First Name</label>
                        <input type="text" className={this.props.firstNameValid ? 'form-control' : 'form-control _invalid'} value={this.props.firstName} onChange={(e) => this.props.onChangeHandler(e.target.value, 'firstName')} />
                    </div>
                    <div className="col-md-6 col-lg-6">
                        <label htmlFor="">Last Name</label>
                        <input type="text" className={this.props.lastNameValid ? 'form-control' : 'form-control _invalid'} value={this.props.lastName} onChange={(e) => this.props.onChangeHandler(e.target.value, 'lastName')} />
                    </div>
                    <div className="col-md-12 col-lg-6">
                        <label>* Username</label>
                        <InputForm
                            id="username"
                            name="username"
                            maxLength="15"
                            value={this.props.username}
                            error={!this.props.usernameValid}
                            disabled={true}
                        />
                    </div>
                    <div className="col-md-12 col-lg-6">
                        <label>* Email</label>
                        <InputForm
                            id="email"
                            name="email"
                            maxLength="50"
                            value={this.props.email}
                            error={!this.props.emailValid}
                            change={(value) => this.props.onChangeHandler(value, 'email')}
                        />
                    </div>
                    <div className="col-md-12 col-lg-6">
                        <label>* Phone Number</label>
                        <InputMask
                            id="number"
                            name="number"
                            mask="+(999) 999-9999"
                            maskChar=" "
                            value={this.props.number}
                            className={
                                this.props.numberValid ? 'form-control' : 'form-control _invalid'
                            }
                            onChange={(e) => {
                                this.props.onChangeHandler(e.target.value, 'number');
                            }}
                            placeholder="+(___) ___-____"
                        />
                    </div>
                    <div className="col-md-12 col-lg-6">
                        <label>* Role</label>
                        <select
                            name="idRol"
                            className={['form-control', this.props.idRolValid ? '' : '_invalid'].join(
                                ' '
                            )}
                            value={this.props.idRol}
                            disabled
                        >
                            <option value="">Select role</option>
                            {this.props.roles.map((item) => (
                                <option key={item.Id} value={item.Id}>
                                    {item.Name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6 col-lg-6">
                        <label>* Language</label>

                        <select
                            name="idLanguage"
                            className={[
                                'form-control',
                                this.props.idLanguageValid ? '' : '_invalid'
                            ].join(' ')}
                            disabled={this.props.loadingLanguages}
                            onChange={(event) => {
                                this.props.updateSelect(event.target.value, 'idLanguage');
                            }}
                            value={this.props.idLanguage}
                        >
                            <option value="">Select language</option>
                            {this.props.languages.map((item) => (
                                <option key={item.Id} value={item.Id} disabled={item.Id == 199 ? "disabled" : ""}>
                                    {item.Name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

            </div>

        </div>
    }
}

export default UserFormContent;