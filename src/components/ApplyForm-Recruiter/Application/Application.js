import React, { Component } from 'react';
import './index.css';
import InputMask from 'react-input-mask';
import withApollo from 'react-apollo/withApollo';
import {
    GET_APPLICATION_BY_ID,
    GET_POSITIONS_QUERY,
    GET_POSITIONS_CATALOG,
    getCompaniesQuery
} from '../Queries';

import { CREATE_APPLICATION, UPDATE_APPLICATION } from '../Mutations';

import SelectNothingToDisplay from '../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import Query from 'react-apollo/Query';
import withGlobalContent from '../../Generic/Global';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { RECREATE_IDEAL_JOB_LIST } from "../../ApplyForm/Mutations";
import { GET_APPLICANT_IDEAL_JOBS } from "../../ApplyForm/Queries";
import LocationForm from '../../ui-components/LocationForm'

if (localStorage.getItem('languageForm') === undefined || localStorage.getItem('languageForm') == null) {
    localStorage.setItem('languageForm', 'en');
}

const menuSpanish = require(`./languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`./languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const formSpanish = require(`./languagesJSON/${localStorage.getItem('languageForm')}/formSpanish`);

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
            date: new Date().toISOString().substring(0, 10),
            streetAddress: '',
            aptNumber: '',
            city: 0,
            state: 419,
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
            generalComment: '',

            // Languages array
            languages: [],

            // Skills array
            skills: [],

            // Schools array
            schools: [],

            //Hotel array
            hotels: [],

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
            idRecruiter: localStorage.getItem('LoginId'),

            // React tag input with suggestions
            positionsTags: [],
        };
    }


    handleChangePositionTag = (positionsTags) => {
        this.setState({ positionsTags });
    };

    handleChange = (positionsTags) => {
        this.setState({ positionsTags });
    };

    handleTextChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    };

    // BUG

    // To handle the stepper
    handleNext = () => {
        this.setState((state) => ({
            activeStep: state.activeStep + 1
        }));
    };
    handleBack = () => {
        this.setState((state) => ({
            activeStep: state.activeStep - 1
        }));
    };
    handleReset = () => {
        this.setState({
            activeStep: 0
        });
    };

    /**
     * To update and insert a application by id
     */
    insertApplicationInformation = () => {
        if (
            this.state.firstName == '' ||
            this.state.lastName == '' ||
            this.state.zipCode == ''
        ) {
            this.props.handleOpenSnackbar('warning', 'the first name, last name and Zipcode are required');
        } else {
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
                                    lastName2: this.state.lastName2,
                                    date: this.state.date,
                                    aptNumber: this.state.aptNumber,
                                    city: this.state.city,
                                    state: this.state.state,
                                    zipCode: this.state.zipCode,
                                    homePhone: this.state.homePhone,
                                    cellPhone: this.state.cellPhone,
                                    car: this.state.car,
                                    emailAddress: this.state.emailAddress,
                                    positionApplyingFor: parseInt(this.state.positionApplyingFor),
                                    scheduleRestrictions: this.state.scheduleRestrictions,
                                    scheduleExplain: this.state.scheduleExplain,
                                    convicted: this.state.convicted,
                                    convictedExplain: this.state.convictedExplain,
                                    comment: this.state.comment,
                                    generalComment: this.state.generalComment,
                                    isLead: true,
                                    idRecruiter: parseInt(this.state.idRecruiter)
                                }
                            }
                        })
                        .then(({ data }) => {
                            localStorage.setItem('idApplication', data.addApplication.id);
                            this.setState({
                                editing: false
                            }, () => {
                                let object = [];
                                this.state.positionsTags.map(item => {
                                    object.push({
                                        ApplicationId: parseInt(data.addApplication.id),
                                        idPosition: item.value,
                                        description: item.label
                                    })
                                });

                                this.addApplicantJobs(object, parseInt(data.addApplication.id));
                            });

                            this.props.handleOpenSnackbar('success', 'Successfully inserted', 'bottom', 'right');

                            // this.props.updateIdApplication(data.addAplication.id);
                        })
                        .catch((error) => {
                            this.props.handleOpenSnackbar(
                                'error',
                                'Error to insert aplicant information. Please, try again!',
                                'bottom',
                                'right'
                            );
                        });
                }
            );
        }
    };

    updateApplicationInformation = (id) => {
        if (
            this.state.firstName == '' ||
            this.state.lastName == '' ||
            this.state.zipCode == ''
        ) {
            this.props.handleOpenSnackbar('warning', 'the first name, last name and Zipcode are required');
        } else {
            this.setState(
                {
                    insertDialogLoading: true
                },
                () => {
                    this.props.client
                        .mutate({
                            mutation: UPDATE_APPLICATION,
                            //mutation: CREATE_APPLICATION,
                            variables: {
                                application: {
                                    id: id,
                                    firstName: this.state.firstName,
                                    middleName: this.state.middleName,
                                    lastName: this.state.lastName,
                                    lastName2: this.state.lastName2,
                                    date: this.state.date,
                                    //streetAddress: this.state.streetAddress,
                                    aptNumber: this.state.aptNumber,
                                    city: this.state.city,
                                    state: this.state.state,
                                    zipCode: this.state.zipCode,
                                    homePhone: this.state.homePhone,
                                    cellPhone: this.state.cellPhone,
                                    //socialSecurityNumber: this.state.socialSecurityNumber,
                                    car: this.state.car,
                                    //typeOfId: parseInt(this.state.typeOfId),
                                    //expireDateId: this.state.expireDateId,
                                    emailAddress: this.state.emailAddress,
                                    positionApplyingFor: parseInt(this.state.positionApplyingFor),
                                    //dateAvailable: this.state.dateAvailable,
                                    //scheduleRestrictions: this.state.scheduleRestrictions,
                                    scheduleExplain: this.state.scheduleExplain,
                                    convicted: this.state.convicted,
                                    convictedExplain: this.state.convictedExplain,
                                    generalComment: this.state.generalComment,
                                    isLead: true,
                                    idRecruiter: parseInt(this.state.idRecruiter)
                                }
                            }
                        })
                        .then(({ data }) => {
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

                                this.addApplicantJobs(object, this.props.applicationId);
                            });

                            this.props.handleOpenSnackbar('success', 'Successfully updated', 'bottom', 'right');
                        })
                        .catch((error) => {
                            this.props.handleOpenSnackbar(
                                'error',
                                'Error to update aaplicant information. Please, try again!',
                                'bottom',
                                'right'
                            );
                        });
                }
            );
        }
    };


    addApplicantJobs = (idealJobArrayObject, applicationId) => {
        this.props.client
            .mutate({
                mutation: RECREATE_IDEAL_JOB_LIST,
                variables: {
                    ApplicationId: applicationId,
                    applicationIdealJob: idealJobArrayObject
                }
            })
    };


    getHotels = (func = () => {
    }) => {
        this.props.client.query({
            query: getCompaniesQuery,
            variables: { Id_Parent: -1 },
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState({
                hotels: data.getbusinesscompanies
            },
                func);
        }).catch();
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
                        }
                    })
                    .then(({ data }) => {
                        if (data.applications != null && data.applications.length > 0) {
                            let applicantData = data.applications[0];
                            this.setState(
                                {
                                    firstName: applicantData.firstName,
                                    middleName: applicantData.middleName,
                                    lastName: applicantData.lastName,
                                    lastName2: applicantData.lastName2,
                                    emailAddress: applicantData.emailAddress,
                                    city: applicantData.city,
                                    state: applicantData.state,
                                    zipCode: applicantData.zipCode,
                                    homePhone: applicantData.homePhone,
                                    cellPhone: applicantData.cellPhone,
                                    positionApplyingFor: applicantData.positionApplyingFor,
                                    car: applicantData.car,
                                    generalComment: applicantData.generalComment,
                                    editing: false
                                },
                                () => {
                                    this.removeSkeletonAnimation();
                                    this.getIdealJobsByApplicationId();
                                }
                            );
                        }
                    })
                    .catch((error) => {
                        // TODO: replace alert with snackbar error message
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to show applicant information. Please, try again!',
                            'bottom',
                            'right'
                        );

                        console.error(error);
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
            .then(({ data }) => {
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
        if (this.props.applicationId > 0) {
            this.getHotels(() => {
                this.getApplicationById(this.props.applicationId);
            });
        }
        this.removeSkeletonAnimation();

        if (this.props.applicationId == 0) {
            this.setState({
                editing: true
            });
        }
    }

    updateCity = (city) => {
        this.setState(() => {
            return { city }
        });
    };
    updateState = (state) => {
        this.setState(() => {
            return { state }
        });
    };

    updateZipCode = (zipCode) => {
        this.setState(() => {
            return { zipCode }
        });
    }

    updateSearchingZipCodeProgress = (searchigZipcode) => {
        this.setState(() => {
            return { searchigZipcode }
        })
    }

    render() {
        return (
            <div className="Apply-container-application">

                <div className="applicant-card">
                    <div className="applicant-card__header">
                        <span className="applicant-card__title">{menuSpanish[0].label}</span>
                        {!this.state.editing && <button
                            className="applicant-card__edit-button"
                            onClick={() => {
                                this.setState({
                                    editing: true
                                });
                            }}
                            disabled={this.state.searchigZipcode}
                        >
                            {spanishActions[1].label} <i className="far fa-edit" />
                        </button>
                        }
                    </div>
                    <br />
                    <div className="card-body">
                        <div className="row">
                            <div className="col-md-12 col-lg-6 form-section-1">
                                <div className="row">
                                    <div className="col-md-6">
                                        <span className="primary applicant-card__label">
                                            {formSpanish[16].label}
                                        </span>
                                        <Query query={GET_POSITIONS_QUERY}>
                                            {({ loading, error, data, refetch, networkStatus }) => {
                                                if (error) return <p>Error </p>;
                                                if (data.workOrder != null && data.workOrder.length > 0) {
                                                    return (
                                                        <select
                                                            name="positionApply"
                                                            id="positionApply"
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
                                                            {data.workOrder.map((item) => (
                                                                <option
                                                                    value={item.id}>{item.position.Position} ({item.BusinessCompany.Code.trim()})</option>
                                                            ))}
                                                        </select>
                                                    );
                                                }
                                                return <SelectNothingToDisplay />;
                                            }}
                                        </Query>
                                    </div>
                                    <div className="col-md-6">
                                        <span className="primary applicant-card__label">
                                            {formSpanish[17].label}
                                        </span>
                                        <Query query={GET_POSITIONS_CATALOG}>
                                            {({ loading, error, data, refetch, networkStatus }) => {
                                                if (error) return <p>Error </p>;
                                                if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                    let options = [];
                                                    data.getcatalogitem.map((item) => (
                                                        options.push({ value: item.Id, label: item.Description })
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
                                                return <SelectNothingToDisplay />;
                                            }}
                                        </Query>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <span className="primary applicant-card__label ">
                                            * {formSpanish[0].label}
                                        </span>
                                        <input
                                            onChange={this.handleTextChange}
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
                                        <span className="primary applicant-card__label ">
                                            {formSpanish[1].label}
                                        </span>
                                        <input
                                            onChange={this.handleTextChange}
                                            value={this.state.middleName}
                                            name="middleName"
                                            type="text"
                                            className="form-control"
                                            disabled={!this.state.editing}
                                            min="0"
                                            maxLength="50"
                                            minLength="1"
                                        />
                                    </div>
                                    <div className="col-md-6 ">
                                        <span className="primary applicant-card__label ">
                                            * {formSpanish[2].label}
                                        </span>
                                        <input
                                            onChange={this.handleTextChange}
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
                                        <span className="primary applicant-card__label ">
                                            {formSpanish[24].label}
                                        </span>
                                        <input
                                            onChange={this.handleTextChange}
                                            value={this.state.lastName2}
                                            id="lastName2"
                                            name="lastName2"
                                            type="text"
                                            className="form-control"
                                            disabled={!this.state.editing}

                                            min="0"
                                            maxLength="50"
                                            minLength="3"
                                        />
                                    </div>
                                    <LocationForm
                                        disabledCheck={!this.state.editing}
                                        disabledCity={!this.state.editing}
                                        disabledZipCode={!this.state.editing}
                                        onChangeCity={this.updateCity}
                                        onChangeState={this.updateState}
                                        onChageZipCode={this.updateZipCode}
                                        city={this.state.city}
                                        state={this.state.state}
                                        zipCode={this.state.zipCode}
                                        changeCity={this.state.changeCity}
                                        cityColClass="col-md-6"
                                        stateColClass="col-md-6"
                                        zipCodeColClass="col-md-6"
                                        zipCodeTitle={`* ${formSpanish[5].label}`}
                                        stateTitle={`${formSpanish[6].label}`}
                                        cityTitle={`${formSpanish[7].label}`}
                                        cssTitle={"text-primary-application"}
                                        placeholder="99999-99999"
                                        mask="99999-99999"
                                        updateSearchingZipCodeProgress={this.updateSearchingZipCodeProgress} />
                                    <div className="col-md-6">
                                        <span className="primary applicant-card__label ">
                                            {formSpanish[23].label}
                                        </span>

                                        <div className="onoffswitch">
                                            <input
                                                id="carSwitch"
                                                className="onoffswitch-checkbox"
                                                onChange={this.handleTextChange}
                                                checked={this.state.car}
                                                value={this.state.car}
                                                name="car"
                                                type="checkbox"
                                                disabled={!this.state.editing}
                                                min="0"
                                                maxLength="50"
                                                minLength="10"
                                            />
                                            <label className="onoffswitch-label" htmlFor="carSwitch">
                                                <span className="onoffswitch-inner" />
                                                <span className="onoffswitch-switch" />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 col-lg-6 form-section-2">
                                <div className="row">
                                    <div className="col-md-6 ">
                                        <span className="primary applicant-card__label ">
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
                                            onChange={this.handleTextChange}
                                            placeholder="+(999) 999-9999"
                                            minLength="15"
                                        />
                                    </div>
                                    <div className="col-md-6 ">
                                        <span className="primary applicant-card__label ">
                                            {formSpanish[10].label}
                                        </span>
                                        <InputMask
                                            id="cell-number"
                                            name="cellPhone"
                                            mask="+(999) 999-9999"
                                            maskChar=" "
                                            value={this.state.cellPhone}
                                            className="form-control"
                                            disabled={!this.state.editing}
                                            onChange={this.handleTextChange}
                                            placeholder="+(999) 999-9999"
                                            minLength="15"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <span className="primary applicant-card__label ">
                                            {formSpanish[13].label}
                                        </span>
                                        <input
                                            onChange={this.handleTextChange}
                                            value={this.state.emailAddress}
                                            name="emailAddress"
                                            type="email"
                                            className="form-control"
                                            disabled={!this.state.editing}
                                            min="0"
                                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                            maxLength="50"
                                            minLength="8"
                                        />
                                    </div>
                                    <div className="col-md-12">
                                        <span className="primary applicant-card__label ">
                                            {formSpanish[21].label}
                                        </span>
                                        <textarea
                                            name="generalComment"
                                            id="generalComment"
                                            onChange={this.handleTextChange}
                                            value={this.state.generalComment}
                                            cols="60"
                                            rows="3"
                                            disabled={!this.state.editing}
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
                                onClick={() => {
                                    if (this.props.applicationId == 0) {
                                        window.location.href = '/home/Recruiter'
                                    }

                                    this.removeSkeletonAnimation();
                                    this.setState({
                                        loading: false, editing: false
                                    });
                                }}
                            >

                                {spanishActions[2].label}
                            </button>
                            {!this.state.searchigZipcode && <button type="submit"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (this.props.applicationId == 0) {
                                        this.insertApplicationInformation();
                                    } else {
                                        this.updateApplicationInformation(this.props.applicationId);
                                    }
                                }}
                                className="applicant-card__save-button">
                                {spanishActions[4].label}
                            </button>}
                        </div>
                    ) : (
                            <div className="applicant-card__footer">
                                <button
                                    className="applicant-card__cancel-button"
                                    onClick={() => {
                                        window.location.href = '/home/Recruiter'
                                    }}
                                >
                                    {spanishActions[9].label}
                                </button>
                                <button
                                    onClick={() => {
                                        this.props.handleNext();
                                    }}
                                    className="applicant-card__save-button">
                                    {spanishActions[8].label}
                                </button>
                            </div>
                        )}
                </div>


            </div>
        );
    }
}

export default withApollo(withGlobalContent(Application));
