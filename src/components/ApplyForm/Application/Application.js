import React, {Component} from 'react';
import './index.css';

class Application extends Component {
    render() {
        return (
            <div className="Apply-container--application">
                <header className="Header header-application-info">Application</header>
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-2">
                        <img src="https://cdn3.iconfinder.com/data/icons/outline-style-1/512/profile-512.png"
                             alt="Avatar" className="applicant-avatar"/>
                    </div>
                    <div className="col-8">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">General Information</span>
                                <button className="applicant-card__edit-button">Edit <i className="far fa-edit"></i>
                                </button>
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-6">
                                            <span className="primary">First Name</span>
                                            <input
                                                name="firstName"
                                                type="text"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="3"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary">Middle Name</span>
                                            <input
                                                name="middleName"
                                                type="text"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="3"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <span className="primary">Last Name</span>
                                            <input
                                                name="lastName"
                                                type="text"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="3"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Application;