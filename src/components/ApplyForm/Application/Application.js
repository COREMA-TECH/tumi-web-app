import React, {Component} from 'react';
import './index.css';
import InputMask from 'react-input-mask';
import withApollo from 'react-apollo/withApollo';
//import { GET_APPLICATION_BY_ID, GET_POSITIONS_QUERY, GET_STATES_QUERY } from "../Queries";
import {
    GET_APPLICANT_IDEAL_JOBS,
    GET_APPLICATION_BY_ID,
    GET_CITIES_QUERY,
    GET_POSITIONS_CATALOG,
    GET_POSITIONS_QUERY,
    GET_STATES_QUERY
} from '../Queries';
import {updateApplicationInformation} from '../utils';
import {RECREATE_IDEAL_JOB_LIST, UPDATE_APPLICATION} from '../Mutations';
import SelectNothingToDisplay from '../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import Query from 'react-apollo/Query';
import withGlobalContent from '../../Generic/Global';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import axios from "axios";

if (localStorage.getItem('languageForm') === undefined || localStorage.getItem('languageForm') == null) {
    localStorage.setItem('languageForm', 'es');
}

const menuSpanish = require(`./languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`./languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const formSpanish = require(`./languagesJSON/${localStorage.getItem('languageForm')}/formSpanish`);

const ReactTags = require('react-tag-autocomplete');

const KeyCodes = {
    comma: 188,
    enter: 13,
};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

class Application extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            open: false,
            firstName: '',
            middleName: '',
            lastName: '',
            lastName2: '',
            date: '',
            streetAddress: '',
            aptNumber: '',
            city: 0,
            state: 0,
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
            editing: false,

            loading: false,
            tags: [],


            // React tag input with suggestions
            positionsTags: [],
        };
    }


    handleChangePositionTag = (positionsTags) => {
        this.setState({positionsTags});
        console.log(`Option selected:`, positionsTags);
    };

    handleChange = (positionsTags) => {
        this.setState({positionsTags});
    };

    /**<
     * To update a application by id
     */
    updateApplicationInformation = (id) => {
        this.setState(
            {
                insertDialogLoading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_APPLICATION,
                        variables: {
                            application: {
                                id: id,
                                firstName: this.state.firstName,
                                middleName: this.state.middleName,
                                lastName: this.state.lastName,
                                lastName2: this.state.lastName2,
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
                                dateAvailable: this.state.dateAvailable,
                                scheduleRestrictions: this.state.scheduleRestrictions,
                                scheduleExplain: this.state.scheduleExplain,
                                convicted: this.state.convicted,
                                convictedExplain: this.state.convictedExplain,
                                comment: this.state.comment,
                                idealJob: this.state.idealJob,
                                isLead: false
                            }
                        }
                    })
                    .then(({data}) => {
                        this.setState({
                            editing: false
                        }, () => {
                            let object = [];
                            this.state.positionsTags.map(item => {
                                object.push({
                                    ApplicationId: this.props.applicationId,
                                    idPosition: item.value,
                                    description: item.label
                                })
                            });

                            this.addApplicantJobs(object);
                        });

                        this.props.handleOpenSnackbar('success', 'Successfully updated', 'bottom', 'right');
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to update applicant information. Please, try again!',
                            'bottom',
                            'right'
                        );
                    });
            }
        );
    };

    addApplicantJobs = (idealJobArrayObject) => {
        this.props.client
            .mutate({
                mutation: RECREATE_IDEAL_JOB_LIST,
                variables: {
                    ApplicationId: this.props.applicationId,
                    applicationIdealJob: idealJobArrayObject
                }
            })
            .then(({data}) => {
                console.log("DEBUG");
            })
            .catch(error => {
                console.log("DEBUG ERROR");
            })
    };

    /**
     * To get applications by id
     */
    getApplicationById = (id) => {
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .query({
                        query: GET_APPLICATION_BY_ID,
                        variables: {
                            id: id
                        },
                        fetchPolicy: 'no-cache'
                    })
                    .then(({data}) => {
                        let applicantData = data.applications[0];
                        console.log("applicantData ", applicantData);
                        this.setState(
                            {
                                firstName: applicantData.firstName,
                                middleName: applicantData.middleName,
                                lastName: applicantData.lastName,
                                lastName2: applicantData.lastName2,
                                date:
                                    applicantData.date !== null
                                        ? applicantData.date.substring(0, 10)
                                        : applicantData.date,
                                streetAddress: applicantData.streetAddress,
                                emailAddress: applicantData.emailAddress,
                                aptNumber: applicantData.aptNumber,
                                city: applicantData.city,
                                state: applicantData.state,
                                zipCode: applicantData.zipCode,
                                homePhone: applicantData.homePhone,
                                cellPhone: applicantData.cellPhone,
                                birthDay:
                                    applicantData.birthDay === null ? '' : applicantData.birthDay.substring(0, 10),
                                socialSecurityNumber: applicantData.socialSecurityNumber,
                                positionApplyingFor: applicantData.positionApplyingFor,
                                car: applicantData.car,
                                typeOfId: applicantData.typeOfId,
                                expireDateId:
                                    applicantData.expireDateId !== null
                                        ? applicantData.expireDateId.substring(0, 10)
                                        : applicantData.expireDateId,
                                dateAvailable:
                                    applicantData.dateAvailable !== null
                                        ? applicantData.dateAvailable.substring(0, 10)
                                        : applicantData.dateAvailable,
                                scheduleRestrictions: applicantData.scheduleRestrictions,
                                scheduleExplain: applicantData.scheduleExplain,
                                convicted: applicantData.convicted,
                                convictedExplain: applicantData.convictedExplain,
                                comment: applicantData.comment,
                                editing: false,
                                tags: applicantData.idealJob
                                    ? applicantData.idealJob.split(',').map((d) => d.trim())
                                    : [],
                                idealJob: applicantData.idealJob
                            },
                            () => {
                                this.getIdealJobsByApplicationId();
                                this.removeSkeletonAnimation();
                            }
                        );
                    })
                    .catch((error) => {
                        // TODO: replace alert with snackbar error message
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to show applicant information. Please, try again!',
                            'bottom',
                            'right'
                        );

                        console.log(error);
                    });
            }
        );
    };

    // get ideal jobs
    getIdealJobsByApplicationId = () => {
        this.props.client
            .query({
                query: GET_APPLICANT_IDEAL_JOBS,
                variables: {
                    ApplicationId: this.props.applicationId
                },
                fetchPolicy: 'no-cache'
            })
            .then(({data}) => {
                let dataAPI = data.applicantIdealJob;
                let object;

                dataAPI.map(item => {
                    this.setState(prevState => ({
                        positionsTags: [...prevState.positionsTags, {
                            value: item.id,
                            label: item.description
                        }]
                    }))
                }, () => {
                    this.setState({
                        loading: false
                    })
                });
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to show applicant information. Please, try again!',
                    'bottom',
                    'right'
                );
            })
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

    // To show skeleton animation in css
    removeSkeletonAnimation = () => {
        let inputs, index;

        inputs = document.getElementsByTagName('span');
        for (index = 0; index < inputs.length; ++index) {
            inputs[index].classList.remove('skeleton');
        }
    };

    componentWillMount() {
        this.getApplicationById(this.props.applicationId);
    }

    findByZipCode = (zipCode = null, cityFinal = null) => {
        if (!zipCode) {
            return false;
        }

        this.props.client.query({
            query: GET_STATES_QUERY,
            variables: {parent: -1, value: `'${zipCode}'`},
            fetchPolicy: 'no-cache'
        }).then((data) => {
            this.setState({
                state: data.data.getcatalogitem[0].Id,
                cityFinal: cityFinal
            });
        });

    };

    render() {
        //this.validateInvalidInput();
        const {tags, suggestions} = this.state;

        return (
            <div className="Apply-container--application">
                <form
                    className="general-info-apply-form"
                    id="general-info-form"
                    autoComplete="off"
                    onSubmit={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.updateApplicationInformation(this.props.applicationId);
                    }}
                >
                    <div className="">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{menuSpanish[0].label}</span>
                                {this.state.editing ? (
                                    ''
                                ) : (
                                    <button
                                        className="applicant-card__edit-button"
                                        onClick={() => {
                                            this.setState({
                                                editing: true
                                            });
                                        }}
                                    >
                                        {spanishActions[1].label} <i className="far fa-edit"/>
                                    </button>
                                )}
                            </div>
                            <br/>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 col-lg-6 form-section-1">
                                        <div className="row">
                                            <div className="col-md-6">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[0].label}
												</span>
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
                                            <div className="col-md-6 ">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[1].label}
												</span>
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
                                            <div className="col-md-6 ">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[2].label}
												</span>
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
                                            <div className="col-md-6 ">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[24].label}
												</span>
                                                <input
                                                    onChange={(event) => {
                                                        this.setState({
                                                            lastName2: event.target.value
                                                        });
                                                    }}
                                                    value={this.state.lastName2}
                                                    name="lastName2"
                                                    type="text"
                                                    className="form-control"
                                                    disabled={!this.state.editing}

                                                    min="0"
                                                    maxLength="50"
                                                    minLength="3"
                                                />
                                            </div>
                                            <div className="col-md-12 ">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[22].label}
												</span>
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
                                            <div className="col-md-6 ">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[4].label}
												</span>
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
                                            <div className="col-md-6 ">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[5].label}
												</span>
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
                                                        }, () => {
                                                            const zipCode = this.state.zipCode.trim().replace('-', '').substring(0, 5);
                                                            if (zipCode)
                                                                axios.get(`https://ziptasticapi.com/${zipCode}`)
                                                                    .then(res => {
                                                                        const cities = res.data;
                                                                        if (!cities.error) {
                                                                            this.findByZipCode(cities.state, cities.city.toLowerCase());
                                                                        }
                                                                    });
                                                        });


                                                        // let zip_code = '';
                                                        // zip_code = event.target.value.substring(0, 5);
                                                        // fetch(`https://ziptasticapi.com/${zip_code}`).then((response) => {
                                                        // 	return response.json()
                                                        // }).then((cities) => {
                                                        // 	if (!cities.error) {
                                                        // 		this.findByZipCode(cities.state, cities.city.toLowerCase());
                                                        // 	}
                                                        // });

                                                    }}
                                                    value={this.state.zipCode}
                                                    placeholder="99999-99999"
                                                    required
                                                    minLength="15"
                                                />
                                            </div>
                                            <div className="col-md-6 ">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[6].label}
												</span>
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
                                                                        });
                                                                    }}
                                                                    value={this.state.state}
                                                                >
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
                                            <div className="col-md-6 ">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[7].label}
												</span>
                                                <Query query={GET_CITIES_QUERY} variables={{parent: this.state.state}}>
                                                    {({loading, error, data, refetch, networkStatus}) => {
                                                        //if (networkStatus === 4) return <LinearProgress />;
                                                        if (error) return <p>Error </p>;
                                                        if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                            var citySelected = null;
                                                            citySelected = data.getcatalogitem.filter(city => {
                                                                return city.Name.toLowerCase().includes(this.state.cityFinal);
                                                            });
                                                            if (citySelected.length != 0) {
                                                                if ((citySelected[0].Id != this.state.city)) {
                                                                    this.setState({
                                                                        city: citySelected[0].Id
                                                                    });
                                                                }
                                                            }
                                                            return (
                                                                <select
                                                                    name="city"
                                                                    id="city"
                                                                    required
                                                                    className="form-control"
                                                                    disabled={!this.state.editing}
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            city: e.target.value
                                                                        });
                                                                    }}
                                                                    value={this.state.city}
                                                                >
                                                                    <option value="">Select a city</option>
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
                                            <div className="col-md-6 ">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[9].label}
												</span>
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
                                            <div className="col-md-6 ">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[10].label}
												</span>
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
                                            <div className="col-md-12 ">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[11].label}
												</span>
                                                <InputMask
                                                    id="socialSecurityNumber"
                                                    name="socialSecurityNumber"
                                                    mask="999-99-9999"
                                                    maskChar=" "
                                                    className="form-control"
                                                    disabled={!this.state.editing}
                                                    onClick={(event) => {
                                                        event.target.setSelectionRange(0, 0);
                                                    }}
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
                                    <div className="col-md-12 col-lg-6 form-section-2">
                                        <div className="row">
                                            <div className="col-md-6">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[12].label}
												</span>
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
                                            <div className="col-md-6">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[23].label}
												</span>
                                                <div className="onoffswitch">
                                                    <input
                                                        id="carInput"
                                                        onChange={(event) => {
                                                            this.setState({
                                                                car: event.target.checked
                                                            });
                                                        }}
                                                        checked={this.state.car}
                                                        value={this.state.car}
                                                        name="car"
                                                        type="checkbox"
                                                        disabled={!this.state.editing}
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="10"
                                                        className="onoffswitch-checkbox"
                                                    />
                                                    <label className="onoffswitch-label" htmlFor="carInput">
                                                        <span className="onoffswitch-inner"/>
                                                        <span className="onoffswitch-switch"/>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-12">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[13].label}
												</span>
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
                                            <div className="col-md-6">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[14].label}
												</span>
                                                <select
                                                    name="typeOfID"
                                                    id="typeOfID"
                                                    className="form-control"
                                                    disabled={!this.state.editing}
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
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[15].label}
												</span>
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
                                            <div className="col-md-12">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[16].label}
												</span>
                                                <Query query={GET_POSITIONS_CATALOG}>
                                                    {({loading, error, data, refetch, networkStatus}) => {
                                                        //if (networkStatus === 4) return <LinearProgress />;
                                                        if (error) return <p>Error </p>;
                                                        if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                            let options = [];
                                                            data.getcatalogitem.map((item) => (
                                                                options.push({value: item.Id, label: item.Description})
                                                            ));

                                                            return (
                                                                <div style={{
                                                                    paddingTop: '0px',
                                                                    paddingBottom: '2px',
                                                                }}>
                                                                    <Select
                                                                        isDisabled={!this.state.editing}
                                                                        options={options}
                                                                        value={this.state.positionsTags}
                                                                        onChange={this.handleChangePositionTag}
                                                                        closeMenuOnSelect={false}
                                                                        components={makeAnimated()}
                                                                        isMulti
                                                                    />
                                                                </div>
                                                            );
                                                        }
                                                        return <SelectNothingToDisplay/>;
                                                    }}
                                                </Query>
                                            </div>

                                            <div className="col-md-12">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[17].label}
												</span>
                                                <Query query={GET_POSITIONS_QUERY}>
                                                    {({loading, error, data, refetch, networkStatus}) => {
                                                        //if (networkStatus === 4) return <LinearProgress />;
                                                        if (error) return <p>Error </p>;
                                                        if (data.workOrder != null && data.workOrder.length > 0) {
                                                            return (
                                                                <select
                                                                    name="positionApply"
                                                                    id="positionApply"
                                                                    onChange={(event) => {
                                                                        this.setState({
                                                                            // Fixme: repair this
                                                                            idealJob: event.target.value
                                                                        });
                                                                    }}
                                                                    value={this.state.idealJob}
                                                                    className="form-control"
                                                                    disabled={!this.state.editing}
                                                                >
                                                                    <option value="">Select a position</option>
                                                                    <option value="0">Open Position</option>
                                                                    {data.workOrder.map((item) => (
                                                                        <option
                                                                            value={item.id}>{item.position.Position} ({item.BusinessCompany.Code.trim()})</option>
                                                                    ))}
                                                                </select>
                                                            );
                                                        }
                                                        return <SelectNothingToDisplay/>;
                                                    }}
                                                </Query>
                                            </div>
                                            <div className="col-md-12">
												<span className="primary applicant-card__label skeleton">
													* {formSpanish[18].label}
												</span>
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
                                            <div className="col-md-6">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[19].label}
												</span>

                                                <div className="onoffswitch">
                                                    <input
                                                        id="scheduleInput"
                                                        onChange={(event) => {
                                                            this.setState(
                                                                {
                                                                    scheduleRestrictions: event.target.checked
                                                                },
                                                                () => {
                                                                    if (!this.state.scheduleRestrictions) {
                                                                        this.setState({
                                                                            scheduleExplain: ''
                                                                        });
                                                                    }
                                                                }
                                                            );
                                                        }}
                                                        checked={this.state.scheduleRestrictions}
                                                        value={this.state.scheduleRestrictions}
                                                        name="scheduleRestrictions"
                                                        type="checkbox"
                                                        disabled={!this.state.editing}
                                                        className="onoffswitch-checkbox"
                                                    />
                                                    <label className="onoffswitch-label" htmlFor="scheduleInput">
                                                        <span className="onoffswitch-inner"/>
                                                        <span className="onoffswitch-switch"/>
                                                    </label>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[21].label}
												</span>
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
                                                    disabled={!this.state.editing || !this.state.scheduleRestrictions}
                                                    required
                                                    className="form-control textarea-apply-form"
                                                />
                                            </div>
                                            <div className="col-md-6">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[20].label}
												</span>

                                                <div className="onoffswitch">
                                                    <input
                                                        id="convictedSwitch"
                                                        onChange={(event) => {
                                                            this.setState(
                                                                {
                                                                    convicted: event.target.checked
                                                                },
                                                                () => {
                                                                    if (!this.state.convicted) {
                                                                        this.setState({
                                                                            convictedExplain: ''
                                                                        });
                                                                    }
                                                                }
                                                            );
                                                        }}
                                                        checked={this.state.convicted}
                                                        value={this.state.convicted}
                                                        name="convicted"
                                                        type="checkbox"
                                                        disabled={!this.state.editing}
                                                        className="onoffswitch-checkbox"
                                                    />
                                                    <label className="onoffswitch-label" htmlFor="convictedSwitch">
                                                        <span className="onoffswitch-inner"/>
                                                        <span className="onoffswitch-switch"/>
                                                    </label>
                                                </div>

                                            </div>
                                            <div className="col-md-6">
												<span className="primary applicant-card__label skeleton">
													{formSpanish[21].label}
												</span>
                                                <textarea
                                                    onChange={(event) => {
                                                        this.setState({
                                                            convictedExplain: event.target.value
                                                        });
                                                    }}
                                                    value={this.state.convictedExplain}
                                                    name="form-control"
                                                    disabled={!this.state.editing || !this.state.convicted}
                                                    required
                                                    cols="30"
                                                    rows="3"
                                                    className="form-control textarea-apply-form"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.editing ? (
                                <div className="applicant-card__footer">
                                    <button
                                        className="applicant-card__cancel-button"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();

                                            this.getApplicationById(this.props.applicationId);
                                        }}
                                    >
                                        {spanishActions[2].label}
                                    </button>
                                    <button type="submit" className="applicant-card__save-button">
                                        {spanishActions[4].label}
                                    </button>
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default withApollo(withGlobalContent(Application));
