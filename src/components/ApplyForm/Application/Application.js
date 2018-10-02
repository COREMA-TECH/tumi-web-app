import React, {Component} from 'react';
import './index.css';
import InputMask from "react-input-mask";

class Application extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            open: false,
            firstName: '',
            middleName: '',
            lastName: '',
            date: '',
            streetAddress: '',
            aptNumber: '',
            city: '',
            state: '',
            zipCode: '',
            homePhone: '',
            cellPhone: '',
            socialSecurityNumber: '',
            birthDay: '',
            car: false,
            typeOfId: '',
            expireDateId: '',
            emailAddress: '',
            positionApplyingFor: 1,
            idealJob: '',
            dateAvailable: '',
            scheduleRestrictions: '',
            scheduleExplain: '',
            convicted: '',
            convictedExplain: '',
            socialNetwork: '',
            comment: '',

            // Languages array
            languages: [],

            // Skills array
            skills: [],

            // Schools array
            schools: [],

            // Military Service state fields
            branch: '',
            startDateMilitaryService: '',
            endDateMilitaryService: '',
            rankAtDischarge: '',
            typeOfDischarge: '',

            // Previous Employment
            previousEmployment: [],
            companyName: '',
            companyPhone: '',
            companyAddress: '',
            companySupervisor: '',
            companyJobTitle: '',
            companyPayRate: '',
            companyStartDate: '',
            companyEndDate: '',
            companyReasonForLeaving: '',

            percent: 50,
            insertDialogLoading: false,
            graduated: false,
            previousEmploymentPhone: '',

            // Application id property state is used to save languages, education, mulitary services, skills
            applicationId: null,

            // Languages catalog
            languagesLoaded: []
        };
    }


    render() {
        return (
            <div className="Apply-container--application">
                <header className="Header header-application-info">Application</header>
                <div className="row">
                    <div className="col-1"></div>
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
                                            <span className="primary applicant-card__label">First Name</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        firstName: event.target.value
                                                    });
                                                }}
                                                value={this.state.firstName}
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
                                            <span className="primary applicant-card__label">Middle Name</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        middleName: event.target.value
                                                    });
                                                }}
                                                value={this.state.middleName}
                                                name="midleName"
                                                type="text"
                                                className="form-control"
                                                min="0"
                                                maxLength="50"
                                                minLength="1"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <span className="primary applicant-card__label">Last Name</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        lastName: event.target.value
                                                    });
                                                }}
                                                value={this.state.lastName}
                                                name="lastName"
                                                type="text"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="3"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <span className="primary applicant-card__label">Date</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        date: event.target.value
                                                    });
                                                }}
                                                value={this.state.date}
                                                name="date"
                                                type="date"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <span className="primary applicant-card__label">Street Address</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        streetAddress: event.target.value
                                                    });
                                                }}
                                                value={this.state.streetAddress}
                                                name="streetAddress"
                                                type="text"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="5"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">Apt Number</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        aptNumber: event.target.value
                                                    });
                                                }}
                                                value={this.state.aptNumber}
                                                name="aptNumber"
                                                type="number"
                                                className="form-control"
                                                min="0"
                                                maxLength="50"
                                                minLength="5"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">Zip Code</span>
                                            <InputMask
                                                id="zipCode"
                                                name="zipCode"
                                                mask="99999-99999"
                                                maskChar=" "
                                                className="form-control"
                                                onChange={(event) => {
                                                    this.setState({
                                                        zipCode: event.target.value
                                                    });
                                                }}
                                                value={this.state.zipCode}
                                                placeholder="99999-99999"
                                                required
                                                minLength="15"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">State</span>
                                            <select
                                                name="state"
                                                id="state"
                                                required
                                                className="form-control"
                                                onChange={(e) => {
                                                    this.setState({
                                                        state: e.target.value
                                                    })
                                                }}
                                                value={this.state.state}>
                                                <option value="">Select a state</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">City</span>
                                            <select
                                                name="city"
                                                id="city"
                                                required
                                                className="form-control"
                                                onChange={(e) => {
                                                    this.setState({
                                                        city: e.target.value
                                                    })
                                                }}
                                                value={this.state.city}>
                                                <option value="">Select a city</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">Home Phone</span>
                                            <InputMask
                                                id="home-number"
                                                name="homePhone"
                                                mask="+(999) 999-9999"
                                                maskChar=" "
                                                value={this.state.homePhone}
                                                className="form-control"
                                                onChange={(event) => {
                                                    this.setState({
                                                        homePhone: event.target.value
                                                    });
                                                }}
                                                placeholder="+(999) 999-9999"
                                                minLength="15"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">Cell Phone</span>
                                            <InputMask
                                                id="cell-number"
                                                name="cellPhone"
                                                mask="+(999) 999-9999"
                                                maskChar=" "
                                                value={this.state.cellPhone}
                                                className="form-control"
                                                onChange={(event) => {
                                                    this.setState({
                                                        cellPhone: event.target.value
                                                    });
                                                }}
                                                placeholder="+(999) 999-9999"
                                                required
                                                minLength="15"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <span
                                                className="primary applicant-card__label">Social Security Number</span>
                                            <InputMask
                                                id="socialSecurityNumber"
                                                name="socialSecurityNumber"
                                                mask="999-99-9999"
                                                maskChar=" "
                                                className="form-control"
                                                onChange={(event) => {
                                                    this.setState({
                                                        socialSecurityNumber: event.target.value
                                                    });
                                                }}
                                                value={this.state.socialSecurityNumber}
                                                placeholder="999-99-9999"
                                                required
                                                minLength="15"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">Birth Day</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        birthDay: event.target.value
                                                    });
                                                }}
                                                value={this.state.birthDay}
                                                name="birthDay"
                                                type="date"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="10"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label">Do you own transportation?</span>
                                            <label className="switch">
                                                <input
                                                    onChange={(event) => {
                                                        this.setState({
                                                            car: event.target.checked
                                                        });
                                                    }}
                                                    checked={this.state.car}
                                                    value={this.state.car}
                                                    name="car"
                                                    type="checkbox"
                                                    className="form-control"
                                                    min="0"
                                                    maxLength="50"
                                                    minLength="10"
                                                />
                                                <p className="slider round"></p>
                                            </label>
                                        </div>
                                        <div className="col-12">
                                            <span
                                                className="primary applicant-card__label">Email Address</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        emailAddress: event.target.value
                                                    });
                                                }}
                                                value={this.state.emailAddress}
                                                name="emailAddress"
                                                type="email"
                                                className="form-control"
                                                required
                                                min="0"
                                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                                maxLength="50"
                                                minLength="8"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">Type of ID</span>
                                            <select name="typeOfID" id="typeOfID" className="form-control"
                                                    onChange={(e) => {
                                                        this.setState({
                                                            typeOfId: e.target.value
                                                        })
                                                    }}>
                                                <option value="">Select an option</option>
                                                <option value="1">Birth certificate</option>
                                                <option value="2">Social Security card</option>
                                                <option value="3">State-issued driver's license</option>
                                                <option value="4">State-issued ID</option>
                                                <option value="5">Passport</option>
                                                <option value="6">Department of Defense Identification Card</option>
                                                <option value="7">Green Card</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label">Expire Date ID</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        expireDateId: event.target.value
                                                    });
                                                }}
                                                value={this.state.expireDateId}
                                                name="expireDateId"
                                                type="date"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="10"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">Position Applying For</span>
                                            <select
                                                name="position"
                                                id="position"
                                                onChange={(event) => {
                                                    this.setState({
                                                        positionApplyingFor: event.target.value
                                                    });
                                                }}
                                                value={this.state.positionApplyingFor}
                                                className="form-control"
                                            >
                                                <option value="">Select a position</option>
                                                <option value="0">Open Position</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label">Ideal Job</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        idealJob: event.target.value
                                                    });
                                                }}
                                                value={this.state.idealJob}
                                                name="idealJob"
                                                type="text"
                                                className="form-control"
                                                required
                                                min="0"
                                                minLength="3"
                                                maxLength="50"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <span
                                                className="primary applicant-card__label">Date Available</span>
                                            <input
                                                onChange={(event) => {
                                                    this.setState({
                                                        dateAvailable: event.target.value
                                                    });
                                                }}
                                                value={this.state.dateAvailable}
                                                name="dateAvailable"
                                                type="date"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label">Do you have any schedule restrictions?</span>
                                            <label className="switch">
                                                <input
                                                    onChange={(event) => {
                                                        this.setState({
                                                            scheduleRestrictions: event.target.checked
                                                        });
                                                    }}
                                                    checked={this.state.scheduleRestrictions}
                                                    value={this.state.scheduleRestrictions}
                                                    name="scheduleRestrictions"
                                                    type="checkbox"
                                                    className="form-control"
                                                />
                                                <p className="slider round"></p>
                                            </label>
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label">If yes, explain</span>
                                            <textarea
                                                onChange={(event) => {
                                                    this.setState({
                                                        scheduleExplain: event.target.value
                                                    });
                                                }}
                                                value={this.state.scheduleExplain}
                                                name="form-control"
                                                cols="30"
                                                rows="3"
                                                disabled
                                                className="form-control textarea-apply-form"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label">Have you ever been convicted of a felony?</span>
                                            <label className="switch">
                                                <input
                                                    onChange={(event) => {
                                                        this.setState({
                                                            convicted: event.target.checked
                                                        });
                                                    }}
                                                    checked={this.state.convicted}
                                                    value={this.state.convicted}
                                                    name="convicted"
                                                    type="checkbox"
                                                    className="form-control"
                                                />
                                                <p className="slider round"></p>
                                            </label>
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label">If yes, explain</span>
                                            <textarea
                                                onChange={(event) => {
                                                    this.setState({
                                                        convictedExplain: event.target.value
                                                    });
                                                }}
                                                value={this.state.convictedExplain}
                                                name="form-control"
                                                cols="30"
                                                disabled
                                                rows="3"
                                                className="form-control textarea-apply-form"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Application;