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
                                            <span className="primary applicant-card__label">Last Name</span>
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
                                                name="streetAddress"
                                                type="text"
                                                className="form-control"
                                                min="0"
                                                maxLength="50"
                                                minLength="5"
                                                required
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">Apt Number</span>
                                            <input
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

                                                }}
                                                placeholder="99999-99999"
                                                required
                                                minLength="15"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">State</span>
                                            <select name="state" id="state" required className="form-control">
                                                <option value="">Select a state</option>
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label">City</span>
                                            <select name="city" id="city" required className="form-control">
                                                <option value="">Select a city</option>
                                            </select>
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