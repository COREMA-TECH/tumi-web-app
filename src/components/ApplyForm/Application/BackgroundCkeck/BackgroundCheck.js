import React, {Component} from 'react';
import './index.css';
const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class BackgroundCheck extends Component {
    constructor(props) {
        super(props);

        this.state = {
            vehicleReportRequired: false,
            driverLicenseNumber: '',
            licenseState: null,
            licenseExpiration: null,
            commercialDriverLicense: false
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();


    };

    render() {
        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-10">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">Background Check</span>
                            </div>
                            <div className="row">
                                <form id="background-check-form" onSubmit={this.handleSubmit}>
                                    <div className="col-3"></div>
                                    <div className="col-6 form-section-1">
                                        <div className="row">
                                            <div className="col-12">
                                                <span className="primary applicant-card__label">
                                                    Will a Motor Vehicle Report be Required?
                                                </span>
                                                <br/>
                                                <label className="switch">
                                                    <input
                                                        id="vehicleReportRequired"
                                                        onChange={(event) => {
                                                            this.setState({
                                                                vehicleReportRequired: event.target.checked
                                                            });
                                                        }}
                                                        checked={this.state.vehicleReportRequired}
                                                        value={this.state.vehicleReportRequired}
                                                        type="checkbox"
                                                        className="form-control"
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="10"
                                                        form="background-check-form"
                                                    />
                                                    <p className="slider round"></p>
                                                </label>
                                            </div>
                                            <div className="col-12">
                                                <label className="primary applicant-card__label">
                                                    Drivers License Number
                                                </label>
                                                <input
                                                    id="driverLicenseNumber"
                                                    name="studyType"
                                                    type="text"
                                                    className="form-control"
                                                    required
                                                    min="0"
                                                    pattern=".*[^ ].*"
                                                    maxLength="100"
                                                    minLength="2"
                                                    form="background-check-form"
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="primary applicant-card__label">
                                                    State
                                                </label>
                                                <input
                                                    id="licenseState"
                                                    name="licenseState"
                                                    type="text"
                                                    className="form-control"
                                                    required
                                                    min="0"
                                                    pattern=".*[^ ].*"
                                                    maxLength="100"
                                                    minLength="2"
                                                    form="background-check-form"
                                                />
                                            </div>
                                            <div className="col-6">
                                                <label className="primary applicant-card__label">
                                                    Expiration Date
                                                </label>
                                                <input
                                                    id="licenseExpiration"
                                                    name="licenseExpiration"
                                                    type="date"
                                                    className="form-control"
                                                    required
                                                    min="0"
                                                    pattern=".*[^ ].*"
                                                    maxLength="100"
                                                    minLength="2"
                                                    form="background-check-form"
                                                />
                                            </div>
                                            <div className="col-12">
                                                <span className="primary applicant-card__label">
                                                    Is This a Commercial Drivers License?
                                                </span>
                                                <br/>
                                                <label className="switch">
                                                    <input
                                                        id="commercialDriverLicense"
                                                        onChange={(event) => {
                                                            this.setState({
                                                                commercialDriverLicense: event.target.checked
                                                            });
                                                        }}
                                                        checked={this.state.commercialDriverLicense}
                                                        value={this.state.commercialDriverLicense}
                                                        type="checkbox"
                                                        className="form-control"
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="10"
                                                        form="background-check-form"
                                                    />
                                                    <p className="slider round"></p>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="applicant-card__footer--background">
                                            <br/>
                                            <button
                                                className="applicant-card__edit-button"
                                                type="submit"
                                                onClick={() => {
                                                    
                                                }}>
                                                {spanishActions[4].label}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BackgroundCheck;