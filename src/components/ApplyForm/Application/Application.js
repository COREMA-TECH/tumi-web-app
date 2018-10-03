import React, {Component} from 'react';
import './index.css';
import InputMask from "react-input-mask";
import withApollo from "react-apollo/withApollo";
import {GET_APPLICATION_BY_ID, GET_POSITIONS_QUERY, GET_STATES_QUERY} from "../Queries";
import {updateApplicationInformation} from "../utils";
import {UPDATE_APPLICATION} from "../Mutations";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import SelectNothingToDisplay from "../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay";
import Query from "react-apollo/Query";

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
            languagesLoaded: [],

            // Editing state properties - To edit general info
            editing: false
        };
    }

    /**
     * To update a application by id
     */
    updateApplicationInformation = (id) => {
        this.setState({
            insertDialogLoading: true
        }, () => {
            this.props.client.mutate({
                mutation: UPDATE_APPLICATION,
                variables: {
                    application: {
                        id: id,
                        firstName: this.state.firstName,
                        middleName: this.state.middleName,
                        lastName: this.state.lastName,
                        date: this.state.date,
                        streetAddress: this.state.streetAddress,
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
                        idealJob: this.state.idealJob,
                        dateAvailable: this.state.dateAvailable,
                        scheduleRestrictions: this.state.scheduleRestrictions,
                        scheduleExplain: this.state.scheduleExplain,
                        convicted: this.state.convicted,
                        convictedExplain: this.state.convictedExplain,
                        comment: this.state.comment
                    }
                }
            })
                .then(({data}) => {
                    this.setState({
                        editing: false
                    })
                })
                .catch((error) => {
                    alert("Error updating information: " + error);
                });
        });
    };

    /**
     * To get applications by id
     */
    getApplicationById = (id) => {
        this.props.client
            .query({
                query: GET_APPLICATION_BY_ID,
                variables: {
                    id: id
                }
            })

            .then(({data}) => {
                let applicantData = data.applications[0];
                this.setState({
                    firstName: applicantData.firstName,
                    middleName: applicantData.middleName,
                    lastName: applicantData.lastName,
                    date: applicantData.date.substring(0, 10),
                    streetAddress: applicantData.streetAddress,
                    emailAddress: applicantData.emailAddress,
                    aptNumber: applicantData.aptNumber,
                    city: applicantData.city,
                    state: applicantData.state,
                    zipCode: applicantData.zipCode,
                    homePhone: applicantData.homePhone,
                    cellPhone: applicantData.cellPhone,
                    socialSecurityNumber: applicantData.socialSecurityNumber,
                    positionApplyingFor: applicantData.positionApplyingFor,
                    birthDay: applicantData.birthDay.substring(0, 10),
                    car: applicantData.car,
                    typeOfId: applicantData.typeOfId,
                    expireDateId: applicantData.expireDateId.substring(0, 10),
                    dateAvailable: applicantData.dateAvailable.substring(0, 10),
                    scheduleRestrictions: applicantData.scheduleRestrictions,
                    scheduleExplain: applicantData.scheduleExplain,
                    convicted: applicantData.convicted,
                    convictedExplain: applicantData.convictedExplain,
                    comment: applicantData.comment,
                    editing: false
                }, () => {
                    this.removeSkeletonAnimation();
                })
            })
            .catch(error => {
                // TODO: replace alert with snackbar error message
                alert("Error loading applicant information")
            });
    };

    // To validate all the inputs and set a red border when the input is invalid
    validateInvalidInput = () => {
        if (document.addEventListener) {
            document.addEventListener('invalid', (e) => {
                    e.target.className += ' invalid-apply-form';
                }, true
            );
        }
    };

    // To show skeleton animation in css
    removeSkeletonAnimation = () => {
        let inputs, index;

        inputs = document.getElementsByTagName('span');
        for (index = 0; index < inputs.length; ++index) {
            inputs[index].classList.remove('skeleton');
        }
    };

    componentWillMount() {
        this.getApplicationById(70);
    }

    render() {
        this.validateInvalidInput();

        return (
            <div className="Apply-container--application">
                <header className="Header header-application-info">Application</header>
                <form className="general-info-apply-form row" id="general-info-form" autoComplete="off" onSubmit={
                    (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.updateApplicationInformation(70)
                    }
                }>
                    <div className="col-2"></div>
                    <div className="col-8">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">General Information</span>
                                {
                                    this.state.editing ? (
                                        ''
                                    ) : (
                                        <button className="applicant-card__edit-button" onClick={() => {
                                            this.setState({
                                                editing: true
                                            })
                                        }}>Edit <i className="far fa-edit"></i>
                                        </button>
                                    )
                                }
                            </div>
                            <br/>
                            <div className="row">
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-6">
                                            <span className="primary applicant-card__label skeleton">First Name</span>
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
                                                disabled={!this.state.editing}
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="3"
                                            />
                                        </div>
                                        <div className="col-6 ">
                                            <span className="primary applicant-card__label skeleton">Middle Name</span>
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
                                                disabled={!this.state.editing}
                                                min="0"
                                                maxLength="50"
                                                minLength="1"
                                            />
                                        </div>
                                        <div className="col-12 ">
                                            <span className="primary applicant-card__label skeleton">Last Name</span>
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
                                                disabled={!this.state.editing}
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="3"
                                            />
                                        </div>
                                        <div className="col-12 ">
                                            <span className="primary applicant-card__label skeleton">Date</span>
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
                                                disabled={!this.state.editing}
                                                required
                                                min="0"
                                                maxLength="50"
                                            />
                                        </div>
                                        <div className="col-12 ">
                                            <span
                                                className="primary applicant-card__label skeleton">Street Address</span>
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
                                                disabled={!this.state.editing}
                                                min="0"
                                                maxLength="50"
                                                minLength="5"
                                            />
                                        </div>
                                        <div className="col-6 ">
                                            <span className="primary applicant-card__label skeleton">Apt Number</span>
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
                                                disabled={!this.state.editing}
                                                min="0"
                                                maxLength="50"
                                                minLength="5"
                                            />
                                        </div>
                                        <div className="col-6 ">
                                            <span className="primary applicant-card__label skeleton">Zip Code</span>
                                            <InputMask
                                                id="zipCode"
                                                name="zipCode"
                                                mask="99999-99999"
                                                maskChar=" "
                                                className="form-control"
                                                disabled={!this.state.editing}
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
                                        <div className="col-6 ">
                                            <span className="primary applicant-card__label skeleton">State</span>
                                            <Query query={GET_STATES_QUERY} variables={{parent: 6}}>
                                                {({loading, error, data, refetch, networkStatus}) => {
                                                    //if (networkStatus === 4) return <LinearProgress />;
                                                    if (error) return <p>Error </p>;
                                                    if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                        return (
                                                            <select
                                                                name="state"
                                                                id="state"
                                                                required
                                                                className="form-control"
                                                                disabled={!this.state.editing}
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        state: e.target.value
                                                                    })
                                                                }}
                                                                value={this.state.state}>
                                                                <option value="">Select a state</option>
                                                                {data.getcatalogitem.map((item) => (
                                                                    <option value={item.Id}>{item.Name}</option>
                                                                ))}
                                                            </select>
                                                        );
                                                    }
                                                    return <SelectNothingToDisplay/>;
                                                }}
                                            </Query>
                                        </div>
                                        <div className="col-6 ">
                                            <span className="primary applicant-card__label skeleton">City</span>
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
                                                disabled={!this.state.editing}
                                                required
                                                min="0"
                                                maxLength="30"
                                                minLength="3"
                                            />
                                        </div>
                                        <div className="col-6 ">
                                            <span className="primary applicant-card__label skeleton">Home Phone</span>
                                            <InputMask
                                                id="home-number"
                                                name="homePhone"
                                                mask="+(999) 999-9999"
                                                maskChar=" "
                                                value={this.state.homePhone}
                                                className="form-control"
                                                disabled={!this.state.editing}
                                                onChange={(event) => {
                                                    this.setState({
                                                        homePhone: event.target.value
                                                    });
                                                }}
                                                placeholder="+(999) 999-9999"
                                                minLength="15"
                                            />
                                        </div>
                                        <div className="col-6 ">
                                            <span className="primary applicant-card__label skeleton">Cell Phone</span>
                                            <InputMask
                                                id="cell-number"
                                                name="cellPhone"
                                                mask="+(999) 999-9999"
                                                maskChar=" "
                                                value={this.state.cellPhone}
                                                className="form-control"
                                                disabled={!this.state.editing}
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
                                        <div className="col-12 ">
                                            <span
                                                className="primary applicant-card__label skeleton">Social Security Number</span>
                                            <InputMask
                                                id="socialSecurityNumber"
                                                name="socialSecurityNumber"
                                                mask="999-99-9999"
                                                maskChar=" "
                                                className="form-control"
                                                disabled={!this.state.editing}
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
                                <div className="linear-border"></div>
                                <div className="col-6">
                                    <div className="row">
                                        <div className="col-6">
                                            <span className="primary applicant-card__label skeleton">Birth Day</span>
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
                                                disabled={!this.state.editing}
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="10"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label skeleton">Do you own transportation?</span>
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
                                                    disabled={!this.state.editing}
                                                    min="0"
                                                    maxLength="50"
                                                    minLength="10"
                                                />
                                                <p className="slider round"></p>
                                            </label>
                                        </div>
                                        <div className="col-12">
                                            <span
                                                className="primary applicant-card__label skeleton">Email Address</span>
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
                                                disabled={!this.state.editing}
                                                min="0"
                                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                                maxLength="50"
                                                minLength="8"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label skeleton">Type of ID</span>
                                            <select name="typeOfID" id="typeOfID" className="form-control"
                                                    disabled={!this.state.editing}
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
                                                className="primary applicant-card__label skeleton">Expire Date ID</span>
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
                                                disabled={!this.state.editing}
                                                min="0"
                                                maxLength="50"
                                                minLength="10"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span className="primary applicant-card__label skeleton">Position Applying For</span>
                                            <Query query={GET_POSITIONS_QUERY}>
                                                {({loading, error, data, refetch, networkStatus}) => {
                                                    //if (networkStatus === 4) return <LinearProgress />;
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
                                                                value={this.state.positionApplyingFor}
                                                                className="form-control"
                                                                disabled={!this.state.editing}
                                                            >
                                                                <option value="">Select a position</option>
                                                                <option value="0">Open Position</option>
                                                                {data.getposition.map((item) => (
                                                                    <option value={item.Id}>{item.Position}</option>
                                                                ))}
                                                            </select>
                                                        );
                                                    }
                                                    return <SelectNothingToDisplay/>;
                                                }}
                                            </Query>
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label skeleton">Ideal Job</span>
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
                                                disabled={!this.state.editing}
                                                min="0"
                                                minLength="3"
                                                maxLength="50"
                                            />
                                        </div>
                                        <div className="col-12">
                                            <span
                                                className="primary applicant-card__label skeleton">Date Available</span>
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
                                                disabled={!this.state.editing}
                                                required
                                                min="0"
                                                maxLength="50"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label skeleton">Do you have any schedule restrictions?</span>
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
                                                    disabled={!this.state.editing}
                                                />
                                                <p className="slider round"></p>
                                            </label>
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label skeleton">If yes, explain</span>
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
                                                disabled={!this.state.editing}
                                                className="form-control textarea-apply-form"
                                            />
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label skeleton">Have you ever been convicted of a felony?</span>
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
                                                    disabled={!this.state.editing}
                                                />
                                                <p className="slider round"></p>
                                            </label>
                                        </div>
                                        <div className="col-6">
                                            <span
                                                className="primary applicant-card__label skeleton">If yes, explain</span>
                                            <textarea
                                                onChange={(event) => {
                                                    this.setState({
                                                        convictedExplain: event.target.value
                                                    });
                                                }}
                                                value={this.state.convictedExplain}
                                                name="form-control"
                                                disabled={!this.state.editing}
                                                cols="30"
                                                rows="3"
                                                className="form-control textarea-apply-form"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {
                                this.state.editing ? (
                                    <div className="applicant-card__footer">
                                        <button
                                            className="applicant-card__cancel-button"
                                            onClick={
                                                () => {
                                                    this.getApplicationById(70);
                                                }
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="applicant-card__save-button">
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    ''
                                )
                            }
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default withApollo(Application);