import React, { Component } from 'react';
import {
    ADD_APLICANT_EDUCATION,
    ADD_APLICANT_PREVIOUS_EMPLOYMENT,
    ADD_LANGUAGES,
    CREATE_APPLICATION
} from './Mutations';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import Query from 'react-apollo/Query';
import { GET_LANGUAGES_QUERY, GET_POSITIONS_QUERY, GET_STATES_QUERY } from './Queries';
import './index.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputRange from './ui/InputRange/InputRange';
import InputRangeDisabled from './ui/InputRange/InputRangeDisabled';
import withApollo from 'react-apollo/withApollo';
import studyTypes from './data/studyTypes';
import languageLevelsJSON from './data/languagesLevels';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import CircularProgressLoading from '../material-ui/CircularProgressLoading';
import Route from 'react-router-dom/es/Route';
import InputMask from 'react-input-mask';

const uuidv4 = require('uuid/v4');

class ApplyForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            car: '',
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
            applicationId: 0,

            // Languages catalog
            languagesLoaded: []
        };
    }

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    // To validate all the inputs and set a red border when the input is invalid
    validateInvalidInput = () => {
        if (document.addEventListener) {
            document.addEventListener(
                'invalid',
                (e) => {
                    e.target.className += ' invalid-apply-form';
                },
                true
            );
        }
    };

    insertApplicationInformation = (history) => {
        this.setState(
            {
                insertDialogLoading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: CREATE_APPLICATION,
                        variables: {
                            application: {
                                firstName: this.state.firstName,
                                middleName: this.state.middleName,
                                lastName: this.state.lastName,
                                date: this.state.date,
                                applicantAddress: this.state.applicantAddress,
                                aptNumber: this.state.aptNumber,
                                city: this.state.city,
                                state: this.state.state,
                                zipCode: this.state.zipCode,
                                homePhone: this.state.homePhone,
                                cellPhone: this.state.cellPhone,
                                socialSecurityNumber: this.state.socialSecurityNumber,
                                birthDay: this.state.birthDay,
                                car: this.state.car,
                                typeOfId: parseInt(this.state.typeOfId),
                                expireDateId: this.state.expireDateId,
                                emailAddress: this.state.emailAddress,
                                positionApplyingFor: parseInt(this.state.positionApplyingFor),
                                dateAvailable: this.state.dateAvailable,
                                scheduleRestrictions: this.state.scheduleRestrictions,
                                scheduleExplain: this.state.scheduleExplain,
                                convicted: this.state.convicted,
                                convictedExplain: this.state.convictedExplain,
                                comment: this.state.comment
                            }
                        }
                    })
                    .then(({ data }) => {
                        let idApplication = data.addApplication.id;

                        this.setState(
                            {
                                applicationId: idApplication
                            },
                            () => {
                                // When the application id state property is updated, insert the other form sections

                                // to remove all the uuid properties in the object
                                this.state.languages.forEach((item) => {
                                    delete item.uuid;
                                });

                                this.state.languages.forEach((item) => {
                                    item.ApplicationId = idApplication;
                                });

                                this.props.client
                                    .mutate({
                                        mutation: ADD_LANGUAGES,
                                        variables: {
                                            application: this.state.languages
                                        }
                                    })
                                    .then(() => {
                                        // to remove all the uuid properties in the object
                                        this.state.schools.forEach((item) => {
                                            delete item.uuid;
                                        });

                                        this.state.schools.forEach((item) => {
                                            item.ApplicationId = idApplication;
                                        });

                                        // Then insert education list
                                        this.props.client
                                            .mutate({
                                                mutation: ADD_APLICANT_EDUCATION,
                                                variables: {
                                                    application: this.state.schools
                                                }
                                            })
                                            .then(() => {
                                                // to remove all the uuid properties in the object
                                                this.state.previousEmployment.forEach((item) => {
                                                    delete item.uuid;
                                                });

                                                this.state.previousEmployment.forEach((item) => {
                                                    item.ApplicationId = idApplication;
                                                });

                                                // Then insert previous employment
                                                this.props.client
                                                    .mutate({
                                                        mutation: ADD_APLICANT_PREVIOUS_EMPLOYMENT,
                                                        variables: {
                                                            application: this.state.previousEmployment
                                                        }
                                                    })
                                                    .then(() => {
                                                        // Hide the loading dialog and redirect to component with success message
                                                        this.setState(
                                                            {
                                                                insertDialogLoading: false
                                                            },
                                                            () => {
                                                                // Insert Languages

                                                                history.push({
                                                                    pathname: '/employment-application-message'
                                                                });
                                                            }
                                                        );
                                                    })
                                                    .catch();
                                            })
                                            .catch();
                                    })
                                    .catch();
                            }
                        );
                    })
                    .catch(() => {
                        this.setState(
                            {
                                insertDialogLoading: false
                            },
                            () => {
                                // Show a error message
                                alert('Error saving information');
                            }
                        );
                    });
            }
        );
    };

    // To get a list of languages from API
    getLanguagesList = () => {
        this.props.client
            .query({
                query: GET_LANGUAGES_QUERY
            })
            .then(({ data }) => {
                this.setState({
                    languagesLoaded: data.getcatalogitem
                });
            })
            .catch();
    };

    componentWillMount() {
        // Get languages list from catalogs
        this.getLanguagesList();
    }

    render() {
        this.validateInvalidInput();

        // To render the Applicant Information Section
        let renderApplicantInformationSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Applicant Information</h4>
                <div className="row">
                    <div className="col-md-3">
                        <span className="primary">First Name</span>
                        <div className="input-container--validated">
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
                            <span className="check-icon" />
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="row">
                            <span className="primary">Middle Name</span>
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
                            <span className="check-icon" />
                            <i className="optional" />
                        </div>
                    </div>

                    <div className="col-md-3">
                        <span className="primary">Last Name</span>
                        <div className="input-container--validated">
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
                            <span className="check-icon" />
                        </div>
                    </div>

                    <div className="col-md-3">
                        <span className="primary"> Date</span>
                        <div className="input-container--validated">
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
                            <span className="check-icon" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <span className="primary"> Street Address</span>
                        <div className="input-container--validated">
                            <input
                                onChange={(event) => {
                                    this.setState({
                                        applicantAddress: event.target.value
                                    });
                                }}
                                value={this.state.applicantAddress}
                                name="streetAddress"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="5"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <span className="primary">Apt Number</span>
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
                        <span className="check-icon" />
                        <i className="optional" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <span className="primary"> State</span>
                        <Query query={GET_STATES_QUERY} variables={{ parent: 6 }}>
                            {({ loading, error, data, refetch, networkStatus }) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress />;
                                if (error) return <p>Error </p>;
                                if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                    return (
                                        <select name="state" id="state" required className="form-control">
                                            <option value="">Select a state</option>
                                            {data.getcatalogitem.map((item) => (
                                                <option value={item.Id}>{item.Name}</option>
                                            ))}
                                        </select>
                                    );
                                }
                                return <SelectNothingToDisplay />;
                            }}
                        </Query>
                    </div>
                    <div className="col-md-4">
                        <span className="primary"> City</span>
                        <div className="input-container--validated">
                            <input
                                onChange={(event) => {
                                    this.setState({
                                        city: event.target.value
                                    });
                                }}
                                value={this.state.city}
                                name="city"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="30"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <span className="primary"> Zip Code</span>
                        <div className="input-container--validated">
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

                            <span className="check-icon" />
                        </div>

                        {/*<input*/}
                        {/*onChange={(event) => {*/}
                        {/*this.setState({*/}
                        {/*zipCode: event.target.value*/}
                        {/*});*/}
                        {/*}}*/}
                        {/*value={this.state.zipCode}*/}
                        {/*name="zipCode"*/}
                        {/*type="number"*/}
                        {/*className="form-control"*/}
                        {/*required*/}
                        {/*maxLength="5"*/}
                        {/*minLength="4"*/}
                        {/*min="10000"*/}
                        {/*max="99999"*/}
                        {/*/>*/}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <span className="primary"> Home Phone</span>
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
                        <i className="optional" />
                    </div>

                    <div className="col-md-4">
                        <span className="primary"> Cell Phone</span>
                        <div className="input-container--validated">
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
                            <span className="check-icon" />
                        </div>

                        {/*<input*/}
                        {/*onChange={(event) => {*/}
                        {/*this.setState({*/}
                        {/*cellPhone: event.target.value*/}
                        {/*});*/}
                        {/*}}*/}
                        {/*value={this.state.cellPhone}*/}
                        {/*name="cellPhone"*/}
                        {/*type="tel"*/}
                        {/*className="form-control"*/}
                        {/*required*/}
                        {/*min="0"*/}
                        {/*maxLength="10"*/}
                        {/*minLength="10"*/}
                        {/*/>*/}
                    </div>

                    <div className="col-md-4">
                        <span className="primary"> Social Security Number</span>
                        <div className="input-container--validated">
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
                            <span className="check-icon" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <span className="primary"> Birth Day</span>
                        <div className="input-container--validated">
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
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <span className="primary"> Do you own transportation?</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    car: event.target.value
                                });
                            }}
                            value={this.state.car}
                            name="car"
                            type="checkbox"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="10"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <span className="primary"> Type Of ID</span>
                        <select
                            name="typeOfID"
                            id="typeOfID"
                            className="form-control"
                            onChange={(e) => {
                                this.setState({
                                    typeOfId: e.target.value
                                });
                            }}
                        >
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
                    <div className="col-md-6">
                        <span className="primary"> Expire Date ID</span>
                        <div className="input-container--validated">
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
                            <span className="check-icon" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <span className="primary"> Email Address</span>
                        <div className="input-container--validated">
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
                            <span className="check-icon" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <span className="primary"> Position Applying for</span>
                        <Query query={GET_POSITIONS_QUERY}>
                            {({ loading, error, data, refetch, networkStatus }) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress />;
                                if (error) return <p>Error </p>;
                                if (data.getposition != null && data.getposition.length > 0) {
                                    return (
                                        <select
                                            name="city"
                                            id="city"
                                            onChange={(event) => {
                                                this.setState({
                                                    positionApplyingFor: event.target.value
                                                });
                                            }}
                                            className="form-control"
                                        >
                                            <option value="">Select a position</option>
                                            <option value="0">Open Position</option>
                                            {data.getposition.map((item) => (
                                                <option value={item.Id}>{item.Position}</option>
                                            ))}
                                        </select>
                                    );
                                }
                                return <SelectNothingToDisplay />;
                            }}
                        </Query>
                        <i className="optional" />
                    </div>
                    <div className="col-md-4">
                        <span className="primary"> Ideal Job</span>
                        <div className="input-container--validated">
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
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <span className="primary"> Date Available</span>
                        <div className="input-container--validated">
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
                            <span className="check-icon" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <span className="primary"> Do you have any schedule restrictions? </span>
                        <div className="col-md-12">
                            <input
                                onChange={(event) => {
                                    this.setState({
                                        scheduleRestrictions: event.target.value
                                    });
                                }}
                                value="1"
                                type="radio"
                                name="scheduleRestrictions"
                                className=""
                            />
                            <label className="radio-label"> Yes</label>
                            <input
                                onChange={(event) => {
                                    this.setState({
                                        scheduleRestrictions: event.target.value,
                                        scheduleExplain: ''
                                    });
                                }}
                                value="0"
                                type="radio"
                                name="scheduleRestrictions"
                                className=""
                            />
                            <label className="radio-label"> No</label>
                        </div>
                        <span className="check-icon" />
                    </div>
                    <div className="col-md-8">
                        <span className="primary"> If yes, please explain </span>
                        {this.state.scheduleRestrictions === '0' ? (
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
                        ) : (
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
                                    required
                                    className="form-control textarea-apply-form"
                                />
                            )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <span className="primary"> Have you ever been convicted of a felony? </span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    convicted: event.target.value
                                });
                            }}
                            value="1"
                            type="radio"
                            name="convicted"
                            className=""
                        />
                        <label className="radio-label"> Yes</label>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    convicted: event.target.value,
                                    convictedExplain: ''
                                });
                            }}
                            value="0"
                            type="radio"
                            name="convicted"
                            className=""
                        />
                        <label className="radio-label"> No</label>
                        <span className="check-icon" />
                    </div>
                    <div className="col-md-8">
                        <span className="primary"> If yes, please explain </span>
                        {this.state.convicted === '0' ? (
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
                        ) : (
                                <textarea
                                    onChange={(event) => {
                                        this.setState({
                                            convictedExplain: event.target.value
                                        });
                                    }}
                                    value={this.state.convictedExplain}
                                    name="form-control"
                                    cols="30"
                                    required
                                    rows="3"
                                    className="form-control textarea-apply-form"
                                />
                            )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <span className="primary"> How did you hear about Tumi Staffing </span>
                    </div>
                    <div className="col-md-12">
                        <select
                            name="networks"
                            id="networks"
                            onChange={(event) => {
                                this.setState({
                                    socialNetwork: event.target.value
                                });
                            }}
                            required
                            className="form-control"
                        >
                            <option value="">Select a option</option>
                            <option value="facebook">Facebook</option>
                            <option value="linkedin">Linkedin</option>
                            <option value="instagram">Instagram</option>
                            <option value="newspaper">News Paper</option>
                            <option value="journals">Journals</option>
                            <option value="others">Other</option>
                        </select>
                        <div className="row">
                            <div className="col-md-12">
                                {this.state.socialNetwork === 'others' ? (
                                    <textarea
                                        onChange={(event) => {
                                            this.setState({
                                                comment: event.target.value
                                            });
                                        }}
                                        placeholder="Explain how did you hear about Tumi Staffing"
                                        value={this.state.comment}
                                        required
                                        name="comment"
                                        cols="20"
                                        rows="4"
                                        className="form-control textarea-apply-form"
                                    />
                                ) : (
                                        ''
                                    )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
        let renderInsertDialogLoading = () => (
            <Dialog
                open={this.state.insertDialogLoading}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Sending Application</DialogTitle>
                <DialogContent>
                    <div className="center-progress-dialog">
                        <CircularProgressLoading />
                    </div>
                </DialogContent>
            </Dialog>
        );
        // To render the Skills Dialog
        let renderSkillsDialog = () => (
            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <form
                    autoComplete="off"
                    id="skill-form"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        let item = {
                            uuid: uuidv4(),
                            description: document.getElementById('description').value,
                            level: this.state.percent
                        };
                        this.setState(
                            (prevState) => ({
                                open: false,
                                skills: [...prevState.skills, item]
                            }),
                            () => {
                                this.setState({
                                    percent: 50
                                });
                            }
                        );
                    }}
                    className="apply-form"
                >
                    <h1 className="title-skill-dialog" id="form-dialog-title" style={{ textAlign: 'center' }}>
                        New Skill
                    </h1>
                    <br />
                    <DialogContent style={{ width: '450px' }}>
                        <div className="row">
                            <div className="col-md-12">
                                <span className="primary">Skill Name</span>
                                <br />
                                <input
                                    id="description"
                                    name="description"
                                    type="text"
                                    className="form-control"
                                    required
                                    min="0"
                                    maxLength="20"
                                    minLength="3"
                                    form="skill-form"
                                />
                            </div>
                        </div>
                        <br />
                        <div className="row">
                            <div className="col-md-12">
                                <span className="primary">Skill Level</span>
                                <br />
                                <InputRange
                                    getPercentSkill={(percent) => {
                                        // update the percent skill
                                        this.setState({
                                            percent: percent
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <br />
                        <br />
                    </DialogContent>
                    <DialogActions>
                        <Button className="cancel-skill-button" onClick={this.handleClose} color="default">
                            Cancel
                        </Button>
                        <Button className="save-skill-button" type="submit" form="skill-form" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );
        // To render the Education Service Section
        let renderEducationSection = () => (
            <form
                id="education-form"
                className="ApplyBlock"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let item = {
                        uuid: uuidv4(),
                        schoolType: document.getElementById('studyType').value,
                        educationName: document.getElementById('institutionName').value,
                        educationAddress: document.getElementById('addressInstitution').value,
                        startDate: document.getElementById('startPeriod').value,
                        endDate: document.getElementById('endPeriod').value,
                        graduated: document.getElementById('graduated').checked,
                        degree: parseInt(document.getElementById('degree').value),
                        ApplicationId: 1 // Static application id
                    };
                    console.log(item);
                    this.setState(
                        (prevState) => ({
                            open: false,
                            schools: [...prevState.schools, item]
                        }),
                        () => {
                            document.getElementById('education-form').reset();
                            document.getElementById('studyType').classList.remove('invalid-apply-form');
                            document.getElementById('institutionName').classList.remove('invalid-apply-form');
                            document.getElementById('addressInstitution').classList.remove('invalid-apply-form');
                            document.getElementById('startPeriod').classList.remove('invalid-apply-form');
                            document.getElementById('endPeriod').classList.remove('invalid-apply-form');
                            document.getElementById('graduated').classList.remove('invalid-apply-form');
                            document.getElementById('graduated').checked = false;
                            document.getElementById('degree').classList.remove('invalid-apply-form');
                            this.setState({
                                graduated: false
                            });
                        }
                    );
                }}
            >
                <h4 className="ApplyBlock-title">Education</h4>
                {this.state.schools.length > 0 ? (
                    <div key={uuidv4()} className="skills-container skills-container--header">
                        <div className="row">
                            <div className="col-md-2">
                                <span>Field of Study</span>
                            </div>
                            <div className="col-md-2">
                                <span>Institution</span>
                            </div>
                            <div className="col-md-2">
                                <span>Address</span>
                            </div>
                            <div className="col-md-2">
                                <span>Start Date</span>
                            </div>
                            <div className="col-md-1">
                                <span>End Date</span>
                            </div>
                            <div className="col-md-1">
                                <span>Graduated</span>
                            </div>
                            <div className="col-md-1">
                                <span>Degree</span>
                            </div>
                        </div>
                    </div>
                ) : (
                        ''
                    )}
                {this.state.schools.map((schoolItem) => (
                    <div key={uuidv4()} className="skills-container">
                        <div className="row">
                            <div className="col-md-2">
                                <span>{schoolItem.schoolType}</span>
                            </div>
                            <div className="col-md-2">
                                <span>{schoolItem.educationName}</span>
                            </div>
                            <div className="col-md-2">
                                <span>{schoolItem.educationAddress}</span>
                            </div>
                            <div className="col-md-2">
                                <span>{schoolItem.startDate}</span>
                            </div>
                            <div className="col-md-1">
                                <span>{schoolItem.endDate}</span>
                            </div>
                            <div className="col-md-1">
                                <span>{schoolItem.graduated ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="col-md-1">
                                <span>
                                    {studyTypes.map((item) => {
                                        if (item.Id == schoolItem.degree) {
                                            return item.Name + '';
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="col-md-1">
                                <Button
                                    className="deleteSkillSection"
                                    onClick={() => {
                                        this.setState((prevState) => ({
                                            schools: this.state.schools.filter((_, i) => {
                                                return _.uuid !== schoolItem.uuid;
                                            })
                                        }));
                                    }}
                                >
                                    x
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <hr className="separator" />
                <div className="row">
                    <div className="col-md-3">
                        <label className="primary">Field of Study</label>
                        <div className="input-container--validated">
                            <input
                                id="studyType"
                                form="education-form"
                                name="studyType"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="2"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label className="primary">Name (Institution)</label>
                        <div className="input-container--validated">
                            <input
                                form="education-form"
                                name="institutionName"
                                id="institutionName"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <label className="primary">Address</label>
                        <div className="input-container--validated">
                            <input
                                form="education-form"
                                name="addressInstitution"
                                id="addressInstitution"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <span className="primary"> Time Period</span>
                        <div className="input-container--validated">
                            <input
                                form="education-form"
                                name="startPeriod"
                                id="startPeriod"
                                type="date"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <span className="primary">To</span>
                        <div className="input-container--validated">
                            <input
                                form="education-form"
                                name="endPeriod"
                                id="endPeriod"
                                type="date"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-2">
                        <label className="primary">Graduated</label> <br />
                        <input
                            onChange={(e) => {
                                this.setState({
                                    graduated: document.getElementById('graduated').checked
                                });
                            }}
                            form="education-form"
                            type="checkbox"
                            value="graduated"
                            name="graduated"
                            id="graduated"
                        />
                    </div>
                    <div className="col-md-4">
                        <label className="primary">Degree</label>
                        {this.state.graduated ? (
                            <div className="input-container--validated">
                                <select form="education-form" name="degree" id="degree" className="form-control">
                                    <option value="">Select an option</option>
                                    {studyTypes.map((item) => <option value={item.Id}>{item.Name}</option>)}
                                </select>
                            </div>
                        ) : (
                                <div className="input-container--validated">
                                    <select
                                        form="education-form"
                                        name="degree"
                                        id="degree"
                                        disabled
                                        className="form-control"
                                    >
                                        <option value="">Select an option</option>
                                        {studyTypes.map((item) => <option value={item.Id}>{item.Name}</option>)}
                                    </select>
                                </div>
                            )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Button type="submit" form="education-form" className="save-skill-button">
                            Add
                        </Button>
                    </div>
                </div>
            </form>
        );
        // To render the Military Service Section
        let renderMilitaryServiceSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Military Service</h4>
                <div className="row">
                    <div className="col-md-6">
                        <span className="primary"> Branch</span>
                        <input
                            name="militaryBranch"
                            type="text"
                            className="form-control"
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                        <span className="check-icon" />
                    </div>
                    <div className="col-md-6">
                        <span className="primary"> Rank at Discharge</span>
                        <input
                            name="militaryRankDischarge"
                            type="text"
                            className="form-control"
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                        <span className="check-icon" />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <span className="primary"> Dates</span>
                        <input
                            name="militaryStartDate"
                            type="date"
                            className="form-control"
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                    </div>
                    <div className="col-md-3">
                        <span className="primary">To: </span>
                        <input
                            name="militaryEndDate"
                            type="date"
                            className="form-control"
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                    </div>
                    <div className="col-md-6">
                        <span className="primary"> Type of Discharge</span>
                        <select name="dischargeType" id="dischargeType" className="form-control">
                            <option value="">Select an option</option>
                            <option value="typeOne">Honorable discharge</option>
                            <option value="typeTwo">General discharge</option>
                            <option value="typeThree">Other than honorable (OTH) discharge</option>
                            <option value="typeFour">Bad conduct discharge</option>
                            <option value="typeFive">Dishonorable discharge</option>
                            <option value="typeSix">Entry-level separation.</option>
                        </select>
                        <span className="check-icon" />
                    </div>
                </div>
            </div>
        );
        let renderPreviousEmploymentSection = () => (
            <form
                id="form-previous-employment"
                className="ApplyBlock"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let item = {
                        uuid: uuidv4(),
                        companyName: document.getElementById('companyNameEmployment').value,
                        phone: document.getElementById('companyPhoneEmployment').value,
                        address: document.getElementById('companyAddressEmployment').value,
                        supervisor: document.getElementById('companySupervisor').value,
                        jobTitle: document.getElementById('companyJobTitle').value,
                        payRate: parseFloat(document.getElementById('companyPayRate').value),
                        startDate: document.getElementById('companyStartDate').value,
                        endDate: document.getElementById('companyEndDate').value,
                        reasonForLeaving: document.getElementById('companyReasonForLeaving').value,
                        ApplicationId: 1 // Static application id
                    };
                    this.setState(
                        (prevState) => ({
                            open: false,
                            previousEmployment: [...prevState.previousEmployment, item]
                        }),
                        () => {
                            document.getElementById('form-previous-employment').reset();
                            document.getElementById('companyNameEmployment').classList.remove('invalid-apply-form');
                            document.getElementById('companyPhoneEmployment').classList.remove('invalid-apply-form');
                            document.getElementById('companyAddressEmployment').classList.remove('invalid-apply-form');
                            document.getElementById('companySupervisor').classList.remove('invalid-apply-form');
                            document.getElementById('companyJobTitle').classList.remove('invalid-apply-form');
                            document.getElementById('companyPayRate').classList.remove('invalid-apply-form');
                            document.getElementById('companyStartDate').classList.remove('invalid-apply-form');
                            document.getElementById('companyEndDate').classList.remove('invalid-apply-form');
                            document.getElementById('companyReasonForLeaving').classList.remove('invalid-apply-form');
                            this.setState({
                                previousEmploymentPhone: ''
                            });
                        }
                    );
                }}
            >
                <h4 className="ApplyBlock-title">Previous Employment</h4>
                <div className="row">
                    {this.state.previousEmployment.length > 0 ? (
                        <div key={uuidv4()} className="skills-container skills-container--header">
                            <div className="row">
                                <div className="col-md-2">
                                    <span>Company</span>
                                </div>
                                <div className="col-md-2">
                                    <span>Address</span>
                                </div>
                                <div className="col-md-2">
                                    <span>Job Title</span>
                                </div>
                                <div className="col-md-1">
                                    <span>Phone</span>
                                </div>
                                <div className="col-md-1">
                                    <span>Supervisor</span>
                                </div>
                                <div className="col-md-1">
                                    <span>Pay Rate</span>
                                </div>
                                <div className="col-md-1">
                                    <span>Start Date</span>
                                </div>
                                <div className="col-md-1">
                                    <span>End Date</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                            ''
                        )}
                    {this.state.previousEmployment.map((employmentItem) => (
                        <div key={uuidv4()} className="skills-container">
                            <div className="row">
                                <div className="col-md-2">
                                    <span>{employmentItem.companyName}</span>
                                </div>
                                <div className="col-md-2">
                                    <span>{employmentItem.address}</span>
                                </div>
                                <div className="col-md-2">
                                    <span>{employmentItem.jobTitle}</span>
                                </div>
                                <div className="col-md-1">
                                    <span>{employmentItem.phone}</span>
                                </div>
                                <div className="col-md-1">
                                    <span>{employmentItem.supervisor}</span>
                                </div>
                                <div className="col-md-1">
                                    <span>{employmentItem.payRate}</span>
                                </div>
                                <div className="col-md-1">
                                    <span>{employmentItem.startDate}</span>
                                </div>
                                <div className="col-md-1">
                                    <span>{employmentItem.endDate}</span>
                                </div>
                                <div className="col-md-1">
                                    <Button
                                        className="deleteSkillSection"
                                        onClick={() => {
                                            this.setState((prevState) => ({
                                                previousEmployment: this.state.previousEmployment.filter((_, i) => {
                                                    return _.uuid !== employmentItem.uuid;
                                                })
                                            }));
                                        }}
                                    >
                                        x
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <hr className="separator" />
                </div>
                <div className="row">
                    <div className="col-md-8">
                        <span className="primary"> Company</span>
                        <div className="input-container--validated">
                            <input
                                id="companyNameEmployment"
                                form="form-previous-employment"
                                name="companyNameEmployment"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <span className="primary"> Phone</span>
                        <div className="input-container--validated">
                            <InputMask
                                id="companyPhoneEmployment"
                                form="form-previous-employment"
                                name="phoneEmployment"
                                mask="+(999) 999-9999"
                                maskChar=" "
                                value={this.state.previousEmploymentPhone}
                                className="form-control"
                                onChange={(event) => {
                                    this.setState({
                                        previousEmploymentPhone: event.target.value
                                    });
                                }}
                                required
                                placeholder="+(999) 999-9999"
                                minLength="15"
                            />
                            {/*<input*/}
                            {/*id="companyPhoneEmployment"*/}
                            {/*form="form-previous-employment"*/}
                            {/*name="phoneEmployment"*/}
                            {/*type="number"*/}
                            {/*className="form-control"*/}
                            {/*required*/}
                            {/*min="0"*/}
                            {/*maxLength="10"*/}
                            {/*minLength="10"*/}
                            {/*/>*/}
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-8">
                        <span className="primary"> Address</span>
                        <div className="input-container--validated">
                            <input
                                id="companyAddressEmployment"
                                form="form-previous-employment"
                                name="addressEmployment"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <span className="primary"> Supervisor</span>
                        <div className="input-container--validated">
                            <input
                                id="companySupervisor"
                                form="form-previous-employment"
                                name="supervisorEmployment"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-8">
                        <span className="primary"> Job Title</span>
                        <div className="input-container--validated">
                            <input
                                id="companyJobTitle"
                                form="form-previous-employment"
                                name="jobTitleEmployment"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <span className="primary"> Pay Rate</span>
                        <div className="input-container--validated">
                            <input
                                id="companyPayRate"
                                form="form-previous-employment"
                                name="payRateEmployment"
                                type="number"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <span className="primary"> Dates</span>
                        <div className="input-container--validated">
                            <input
                                id="companyStartDate"
                                form="form-previous-employment"
                                name="startPreviousEmployment"
                                type="date"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <span className="primary">To: </span>
                        <div className="input-container--validated">
                            <input
                                id="companyEndDate"
                                form="form-previous-employment"
                                name="endPreviousEmployment"
                                type="date"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <span className="primary"> Reason for leaving</span>
                        <textarea
                            id="companyReasonForLeaving"
                            form="form-previous-employment"
                            name="reasonForLeavingEmployment"
                            className="form-control textarea-apply-form"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <Button type="submit" form="form-previous-employment" className="save-skill-button">
                            Add
                        </Button>
                    </div>
                </div>
            </form>
        );
        let renderlanguagesSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Languages</h4>
                {this.state.languages.length > 0 ? (
                    <div className="skills-container skills-container--header">
                        <div className="row">
                            <div className="col-md-3">
                                <span>Language Name</span>
                            </div>
                            <div className="col-md-4">
                                <span>Conversation</span>
                            </div>
                            <div className="col-md-4">
                                <span>Writing</span>
                            </div>
                        </div>
                    </div>
                ) : (
                        ''
                    )}
                {this.state.languages.map((languageItem) => (
                    <div key={uuidv4()} className="skills-container">
                        <div className="row">
                            <div className="col-md-3">
                                <span>
                                    {this.state.languagesLoaded.map((item) => {
                                        if (item.Id == languageItem.language) {
                                            return item.Name.trim();
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="col-md-4">
                                <span>
                                    {languageLevelsJSON.map((item) => {
                                        if (item.Id == languageItem.conversation) {
                                            return item.Name;
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="col-md-4">
                                <span>
                                    {languageLevelsJSON.map((item) => {
                                        if (item.Id == languageItem.writing) {
                                            return item.Name;
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="col-md-1">
                                <Button
                                    className="deleteSkillSection"
                                    onClick={() => {
                                        this.setState((prevState) => ({
                                            languages: this.state.languages.filter((_, i) => {
                                                console.log(this.state.languages);
                                                return _.uuid !== languageItem.uuid;
                                            })
                                        }));
                                    }}
                                >
                                    x
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <br />
                <br />
                {this.state.languages.length > 0 ? <hr /> : ''}
                <form
                    className="row"
                    id="form-language"
                    autoComplete="off"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        let item = {
                            uuid: uuidv4(),
                            ApplicationId: this.state.applicationId,
                            language: document.getElementById('nameLanguage').value,
                            writing: parseInt(document.getElementById('writingLanguage').value),
                            conversation: parseInt(document.getElementById('conversationLanguage').value)
                        };
                        this.setState(
                            (prevState) => ({
                                open: false,
                                languages: [...prevState.languages, item]
                            }),
                            () => {
                                document.getElementById('form-language').reset();
                                document.getElementById('writingLanguage').classList.remove('invalid-apply-form');
                                document.getElementById('conversationLanguage').classList.remove('invalid-apply-form');
                                document.getElementById('nameLanguage').classList.remove('invalid-apply-form');
                            }
                        );
                    }}
                >
                    <div className="col-md-4">
                        <span className="primary"> Languages</span>
                        <select
                            id="nameLanguage"
                            name="languageName"
                            required
                            className="form-control"
                            form="form-language"
                        >
                            <option value="">Select an option</option>
                            {this.state.languagesLoaded.map((item) => <option value={item.Id}>{item.Name}</option>)}
                        </select>
                        {/*<Query query={GET_LANGUAGES_QUERY}>*/}
                        {/*{({loading, error, data, refetch, networkStatus}) => {*/}
                        {/*//if (networkStatus === 4) return <LinearProgress />;*/}
                        {/*if (loading) return <LinearProgress/>;*/}
                        {/*if (error) return <p>Error </p>;*/}
                        {/*if (this.state.languagesLoaded != null && this.state.languagesLoaded.length > 0) {*/}
                        {/*return (*/}
                        {/**/}
                        {/*);*/}
                        {/*}*/}
                        {/*return <SelectNothingToDisplay/>;*/}
                        {/*}}*/}
                        {/*</Query>*/}
                        {/*<input*/}
                        <span className="check-icon" />
                    </div>
                    <div className="col-md-3">
                        <span className="primary"> Conversation</span>
                        <select
                            required
                            id="conversationLanguage"
                            form="form-language"
                            name="conversationLanguage"
                            className="form-control"
                        >
                            <option value="">Select an option</option>
                            {languageLevelsJSON.map((item) => <option value={item.Id}>{item.Name}</option>)}
                        </select>
                        <span className="check-icon" />
                    </div>
                    <div className="col-md-3">
                        <span className="primary"> Writing</span>
                        <select
                            required
                            id="writingLanguage"
                            form="form-language"
                            name="writingLanguage"
                            className="form-control"
                        >
                            <option value="">Select an option</option>
                            {languageLevelsJSON.map((item) => <option value={item.Id}>{item.Name}</option>)}
                        </select>
                        <span className="check-icon" />
                    </div>
                    <div className="col-md-2">
                        <br />
                        <Button type="submit" form="form-language" className="save-skill-button">
                            Add
                        </Button>
                    </div>
                </form>
            </div>
        );
        let renderSkillsSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Skills</h4>
                <div className="row">
                    <div className="col-md-9" />
                    <div className="col-md-3">
                        <Button onClick={this.handleClickOpen} className="save-skill-button">
                            New Skill
                        </Button>
                        {renderSkillsDialog()}
                    </div>
                    <div className="col-md-12">
                        {this.state.skills.length > 0 ? (
                            <div className="skills-container skills-container--header">
                                <div className="row">
                                    <div className="col-md-6">
                                        <span>Skill Name</span>
                                    </div>
                                    <div className="col-md-6">
                                        <span>Skill Level</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                                ''
                            )}
                        {this.state.skills.map((skillItem) => (
                            <div key={uuidv4()} className="skills-container">
                                <div className="row">
                                    <div className="col-md-6">
                                        <span>{skillItem.description}</span>
                                    </div>
                                    <div className="col-md-5">
                                        <InputRangeDisabled percent={skillItem.level} />
                                    </div>
                                    <div className="col-md-1">
                                        <Button
                                            className="deleteSkillSection"
                                            onClick={() => {
                                                this.setState((prevState) => ({
                                                    skills: this.state.skills.filter((_, i) => {
                                                        console.log(this.state.skills);
                                                        return _.uuid !== skillItem.uuid;
                                                    })
                                                }));
                                            }}
                                        >
                                            x
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
        return (
            <Route
                render={({ history }) => (
                    <div>
                        <header className="Header">Application Form</header>
                        <form
                            className="ApplyForm apply-form"
                            onSubmit={(e) => {
                                // To cancel the default submit event
                                e.preventDefault();
                                // Call mutation to create a application
                                this.insertApplicationInformation(history);
                            }}
                        >
                            {renderApplicantInformationSection()}
                            {/*{renderlanguagesSection()}*/}
                            {/*{renderEducationSection()}*/}
                            {/*/!*{renderMilitaryServiceSection()}*!/*/}
                            {/*{renderPreviousEmploymentSection()}*/}
                            {/*{renderSkillsSection()}*/}
                            {/*{renderInsertDialogLoading()}*/}
                            <div className="Apply-container">
                                <div className="row">
                                    <div className="col-md-12 buttons-group-right">
                                        <button type="reset" className="btn-circle btn-lg red">
                                            <i className="fas fa-eraser" />
                                        </button>
                                        <button type="submit" className="btn-circle btn-lg">
                                            <i className="fas fa-save" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            />
        );
    }
}
export default withApollo(ApplyForm);