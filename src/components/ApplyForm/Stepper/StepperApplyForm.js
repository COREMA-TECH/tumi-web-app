import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './index.css';
import '../index.css';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import CircularProgressLoading from '../../material-ui/CircularProgressLoading';
import InputRange from '../ui/InputRange/InputRange';
import studyTypes from '../data/studyTypes';
import InputMask from 'react-input-mask';
import languageLevelsJSON from '../data/languagesLevels';
import InputRangeDisabled from '../ui/InputRange/InputRangeDisabled';
import { GET_LANGUAGES_QUERY } from '../Queries.js';
import withApollo from 'react-apollo/withApollo';
import { GET_CITIES_QUERY, GET_POSITIONS_CATALOG, GET_POSITIONS_QUERY, GET_STATES_QUERY } from '../Queries';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import SelectNothingToDisplay from '../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import {
    ADD_APLICANT_EDUCATION,
    ADD_APLICANT_PREVIOUS_EMPLOYMENT,
    ADD_LANGUAGES,
    ADD_MILITARY_SERVICES,
    ADD_SKILL,
    CREATE_APPLICATION,
    RECREATE_IDEAL_JOB_LIST,
    UPDATE_APPLICATION
} from '../Mutations';
import Route from 'react-router-dom/es/Route';
import withGlobalContent from "../../Generic/Global";
import SignatureForm from "../SignatureForm/SignatureForm";
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import LocationForm from '../../ui-components/LocationForm';

import labels from './labels.json';

import ReactFlagsSelect from 'react-flags-select';

import {debounce} from 'throttle-debounce';

const spanishActions = require(`../Application/languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

const uuidv4 = require('uuid/v4');

const styles = (theme) => ({
    root: {
        width: '100%',
        display: 'flex'
    },
    button: {
        marginTop: 0,
        marginRight: theme.spacing.unit,
        backgroundColor: '#41afd7',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#3d93b9'
        }
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2
    },
    resetContainer: {
        padding: theme.spacing.unit * 3
    },
    stepper: {
        color: '#41afd7'
    }
});

const selectStyles = {
    option: (provided, {isFocused}) => ({
        ...provided,
        border: 'none',
        backgroundColor: isFocused ? '#000000' : 'transparent',
        fontFamily: '"Ropa Sans", sans-serif !important',
        color: isFocused ? '#FFFFFF' : '#000000'
    }),
    control: _ => ({
        border: 'none',
        backgroundColor: 'transparent',
        fontFamily: '"Ropa Sans", sans-serif !important',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        fontSize: '18px'
    }),
    singleValue: (provided, state) => ({
        ...provided,
        border: 'none',
        backgroundColor: 'transparent',
        fontFamily: '"Ropa Sans", sans-serif !important',
        color: '#ffffff'
    }),
    placeholder: styles => ({
        ...styles,
        color: '#FFFFFF',
        fontSize: '18px',
        fontFamily: '"Ropa Sans", sans-serif !important',
    })
}

function getSteps() {
    return [
        'Applicant Information',
        'Languages',
        'Education',
        'Previous Employment',
        'Military Service',
        'Skills',
        'Disclaimer'
    ];
}

class VerticalLinearStepper extends Component {
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
            idealJobs: [],
            dateAvailable: '',
            scheduleRestrictions: '0',
            scheduleExplain: '',
            convicted: '0',
            convictedExplain: '',
            socialNetwork: '',
            comment: '',

            // Languages array
            languages: [],
            displayLanguage: "US",

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

            openSnackbar: true,
            aceptedDisclaimer: false,
            openSignature: false,

            // React tag input with suggestions
            positionsTags: [],
            validCity: true,
            validState: true,
            validZipCode: true,
      
            positionApplyOptions: [
                { value: "", label: "Select a Position" },
                { value: 0, label: "Open Position" }
            ],

            positionCatalogOptions: [
            ],

            idTypeOptions: [
                { value:'', label: 'Select an option' },
                { value:'1', label: 'Birth certificate' },
                { value:'2', label: 'Social Security card' },
                { value:'3', label: `State-issued driver's license` },
                { value:'4', label: `State-issued ID` },
                { value:'5', label: `Passport` },
                { value:'6', label: `Department of Defense Identification Card` },
                { value:'7', label: `Green Card` },                
            ],

            heardTumiOptions: [
                { value:'', label:'Select an option' },
                { value:'facebook', label:'Facebook' },
                { value:'linkedin', label:'Linkedin' },
                { value:'instagram', label:'Instagram' },
                { value:'newspaper', label:'Newspaper' },
                { value:'journals', label:'Journals' },
                { value:'others', label:'Other' },
            ]
        };
    }

    findSelectedIdType = idType => {
        const defValue = {value: "", label: "Select an Option"};

        if(!idType || idType === "")
            return defValue;

        const found = this.state.idTypeOptions.find(item => {
            return item.value === idType;
        });

        return found ? found : defValue;
    }

    handleIdTypeChange = ({value}) => {
        this.setState(_ => {
            return {
                typeOfId: value
            }
        })
    }

    findSelectedReference = refId => {
        const defValue = {value: "", label: "Select an Option"};

        if(!refId || refId === "")
            return defValue;

        const found = this.state.heardTumiOptions.find(item => {
            return item.value === refId;
        });

        return found ? found : defValue;
    }

    handleReferenceChange = ({value}) => {
        this.setState(_ => {
            return {
                socialNetwork: value
            }
        })
    }

    //#region PositionApplyFor dropdown
    fetchPositions = _ => {
        this.props.client.query({
            query: GET_POSITIONS_QUERY,
            fetchPolicy: 'no-cache'
        })
        .then(({data}) => {
            const {workOrder} = data;

            const options = workOrder.map(item => {
                return { value: item.id, label: `${item.position.Position.trim()} ${item.BusinessCompany.Code.trim()}`}
            });
            
            this.setState(_ => {
                return {
                    positionApplyOptions: [{ value: "", label: "Select a Position" }, { value: 0, label: "Open Position" }, ...options]
                }
            });
        })
    }

    findSelectedPositionApply = positionId => {
        const defValue = {value: "", label: "Select a Position"};

        if(!positionId && positionId !== 0)
            return defValue;

        const found = this.state.positionApplyOptions.find(item => {
            return item.value === positionId;
        });

        return found ? found : defValue;
    }

    handlePositionApplyChange = ({value}) => {
        this.setState(_ => {
            return {
                idealJob: value
            }
        })
    }
    //#endregion

    //#region PositionCatalog dropdown
    fetchPositionCatalogs = _ => {
        this.props.client.query({
            query: GET_POSITIONS_CATALOG,
            fetchPolicy: 'no-cache'
        })
        .then(({data}) => {
            const {getcatalogitem} = data;

            const options = getcatalogitem.map(item => {
                return { value: item.Id, label: item.Description }
            });
            
            this.setState(_ => {
                return {
                    positionCatalogOptions: options
                }
            });
        })
    }
    //#endregion

    handleChangePositionTag = (positionsTags) => {
        this.setState({ positionsTags });
    };

    handleChange = (positionsTags) => {
        this.setState({ positionsTags });
    };

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

    // To open the skill dialog
    handleClickOpen = () => {
        this.setState({ open: true });
    };

    // To close the skill dialog
    handleClose = () => {
        this.setState({ open: false });
    };

    //Generic state change handler
    handleStateChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }
    

    // To insert general applicant information
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
                                car: this.state.car,
                                typeOfId: parseInt(this.state.typeOfId),
                                expireDateId: this.state.expireDateId,
                                emailAddress: this.state.emailAddress,
                                positionApplyingFor: parseInt(this.state.idealJob),
                                dateAvailable: this.state.dateAvailable,
                                scheduleRestrictions: this.state.scheduleRestrictions,
                                scheduleExplain: this.state.scheduleExplain,
                                convicted: this.state.convicted,
                                convictedExplain: this.state.convictedExplain,
                                comment: this.state.comment,
                                isLead: true,
                                idealJob: this.state.idealJob
                            }
                        }
                    })
                    .then(({ data }) => {
                        let idApplication = data.addApplication.id;
                        this.setState({
                            applicationId: idApplication
                        }, () => {
                            this.props.handleOpenSnackbar(
                                'success',
                                'Successfully created',
                                'bottom',
                                'right'
                            );

                            let object = [];
                            this.state.positionsTags.map(item => {
                                object.push({
                                    ApplicationId: this.state.applicationId,
                                    idPosition: item.value,
                                    description: item.label
                                })
                            });

                            this.addApplicantJobs(object);
                        });
                        this.handleNext();
                    })
                    .catch(() => {
                        this.setState(
                            {
                                insertDialogLoading: false
                            },
                            () => {
                                this.props.handleOpenSnackbar(
                                    'error',
                                    'Error to create the application: Please, try again!',
                                    'bottom',
                                    'right'
                                );
                            }
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
                    ApplicationId: this.state.applicationId,
                    applicationIdealJob: idealJobArrayObject
                }
            })
            .then(({ data }) => {
            })
            .catch(error => {
            })
    };

    updateApplicationInformation = () => {
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
                                id: parseInt(this.state.applicationId),
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
                                car: this.state.car,
                                typeOfId: parseInt(this.state.typeOfId),
                                expireDateId: this.state.expireDateId,
                                emailAddress: this.state.emailAddress,
                                positionApplyingFor: parseInt(this.state.idealJob),
                                dateAvailable: this.state.dateAvailable,
                                scheduleRestrictions: this.state.scheduleRestrictions,
                                scheduleExplain: this.state.scheduleExplain,
                                convicted: this.state.convicted,
                                convictedExplain: this.state.convictedExplain,
                                comment: this.state.comment,
                                isLead: true,
                                idealJob: this.state.idealJob
                            }
                        }
                    })
                    .then(({ data }) => {
                        this.props.handleOpenSnackbar(
                            'success',
                            'Successfully updated',
                            'bottom',
                            'right'
                        );

                        let object = [];
                        this.state.positionsTags.map(item => {
                            object.push({
                                ApplicationId: this.state.applicationId,
                                idPosition: item.value,
                                description: item.label
                            })
                        });

                        this.addApplicantJobs(object);

                        this.handleNext();
                    })
                    .catch(() => {
                        this.setState(
                            {
                                insertDialogLoading: false
                            },
                            () => {
                                // Show a error message
                                this.props.handleOpenSnackbar(
                                    'error',
                                    'Error to update the application: Please, try again!',
                                    'bottom',
                                    'right'
                                );
                            }
                        );
                    });
            }
        );
    };

    // To insert languages
    insertLanguagesApplication = () => {
        if (this.state.languages.length > 0) {
            // to remove all the uuid properties in the object
            this.state.languages.forEach((item) => {
                delete item.uuid;
            });

            this.state.languages.forEach((item) => {
                item.ApplicationId = this.state.applicationId;
            });

            this.props.client
                .mutate({
                    mutation: ADD_LANGUAGES,
                    variables: {
                        application: this.state.languages
                    }
                })
                .then(() => {
                    this.props.handleOpenSnackbar(
                        'success',
                        'Successfully created',
                        'bottom',
                        'right'
                    );

                    this.handleNext();
                })
                .catch((error) => {
                    // Replace this alert with a Snackbar message error
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to save languages: Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        } else {
            this.handleNext();
        }
    };

    // To insert education
    insertEducationApplication = () => {
        if (this.state.schools.length > 0) {
            // to remove all the uuid properties in the object
            this.state.schools.forEach((item) => {
                delete item.uuid;
            });

            this.state.schools.forEach((item) => {
                item.ApplicationId = this.state.applicationId;
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
                    this.props.handleOpenSnackbar(
                        'success',
                        'Successfully created',
                        'bottom',
                        'right'
                    );

                    this.handleNext();
                })
                .catch((error) => {
                    // Replace this alert with a Snackbar message error
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to save education: Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        } else {
            this.handleNext();
        }
    };

    // To insert Military services section
    insertPreviousEmploymentApplication = () => {
        if (this.state.previousEmployment.length > 0) {
            // to remove all the uuid properties in the object
            this.state.previousEmployment.forEach((item) => {
                delete item.uuid;
            });

            this.state.previousEmployment.forEach((item) => {
                item.ApplicationId = this.state.applicationId;
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
                    this.props.handleOpenSnackbar(
                        'success',
                        'Successfully created',
                        'bottom',
                        'right'
                    );

                    this.handleNext();
                })
                .catch((error) => {
                    // Replace this alert with a Snackbar message error
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to save previous employments: Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        } else {
            this.handleNext();
        }
    };

    // To insert a object with mnilitary service information
    insertMilitaryServicesApplication = () => {
        // TODO: validate empty fields in this sections
        if (
            this.state.branch ||
            this.state.startDateMilitaryService ||
            this.state.endDateMilitaryService ||
            this.state.rankAtDischarge ||
            this.state.typeOfDischarge
        ) {
            this.props.client
                .mutate({
                    mutation: ADD_MILITARY_SERVICES,
                    variables: {
                        application: [
                            {
                                branch: this.state.branch,
                                startDate: this.state.startDateMilitaryService,
                                endDate: this.state.endDateMilitaryService,
                                rankAtDischarge: this.state.rankAtDischarge,
                                typeOfDischarge: parseInt(this.state.typeOfDischarge),
                                ApplicationId: this.state.applicationId
                            }
                        ]
                    }
                })
                .then(() => {
                    this.props.handleOpenSnackbar(
                        'success',
                        'Successfully created',
                        'bottom',
                        'right'
                    );

                    this.handleNext();
                })
                .catch((error) => {
                    // Replace this alert with a Snackbar message error
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to save military services: Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        } else {
            this.handleNext();
        }
    };

    // To insert a list of skills
    insertSkillsApplication = () => {
        if (this.state.skills.length > 0) {
            // to remove all the uuid properties in the object
            this.state.skills.forEach((item) => {
                delete item.uuid;
            });

            this.state.skills.forEach((item) => {
                item.ApplicationId = this.state.applicationId;
            });

            this.props.client
                .mutate({
                    mutation: ADD_SKILL,
                    variables: {
                        application: this.state.skills
                    }
                })
                .then(() => {
                    this.props.handleOpenSnackbar(
                        'success',
                        'Successfully created',
                        'bottom',
                        'right'
                    );

                    this.handleNext();
                })
                .catch((error) => {
                    // Replace this alert with a Snackbar message error
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to save skills: Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        } else {
            this.handleNext();
        }
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

    // Execute methods before rendering
    componentWillMount() {
        // Get languages list from catalogs
        this.getLanguagesList();

        //Fetch positions
        this.fetchPositions();

        //Fetch position catalogs
        this.fetchPositionCatalogs();

        this.setState(_ => {
            return {
                labels: labels
            }
        });
    }

    updateCity = (city) => {
        this.setState(() => { return { city, validCity: city && true } });
    };
    updateState = (state) => {
        this.setState(() => { return { state, validState: state && true } });
    };

    updateZipCode = (zipCode) => {
        this.setState(() => { return { zipCode, validZipCode: zipCode.trim().replace('-', '') && true } });
    }

    updateSearchingZipCodeProgress = (searchigZipcode) => {
        this.setState(() => {
            return { searchigZipcode }
        })
    }

    handleIdealJobClick = (idealJobItem) => (event) => {
        debounce( 300, 
            this.setState((prevState) => ({
                idealJobs: this.state.idealJobs.filter((_, i) => {
                    return _.uuid !== idealJobItem.uuid;
                })
            }))
        );        
    }
//#region Functions called in render
    handleDisplayLanguageChange = language => {
        this.setState(_ => {
            return {
                displayLanguage: language
            }
        })
    }

    // To render the applicant information section
    renderApplicantInformationSection = (steps) => {
        const { labels, displayLanguage } = this.state;
     
        return (        
            <div className="ApplyBlock">            
                <h4 className="ApplyBlock-title">{labels.formTitle[displayLanguage]}</h4>
                <div className="row External-row">
                    <div className="col-md-3">
                        <span className="External-label">* {labels.firstName[displayLanguage]}</span>
                        <div className="input-container--validated">
                            <input
                                onChange={ this.handleStateChange }
                                value={this.state.firstName}
                                name="firstName"
                                type="text"
                                className="form-control External-input"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                                placeholder='John'
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <span className="External-label">{labels.midName[displayLanguage]}</span>
                        <input
                            onChange={ this.handleStateChange }
                            value={this.state.middleName}
                            name="middleName"
                            type="text"
                            className="form-control External-input"
                            min="0"
                            maxLength="50"
                            minLength="1"
                            placeholder='Michael'
                        />
                    </div>
                    <div className="col-md-3">
                        <span className="External-label">* {labels.lastName[displayLanguage]}</span>
                        <div className="input-container--validated">
                            <input
                                onChange={ this.handleStateChange }
                                value={this.state.lastName}
                                name="lastName"
                                type="text"
                                className="form-control External-input"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                                placeholder='Doe'
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <span className="External-label">{labels.secLastName[displayLanguage]}</span>
                        <div className="input-container--validated">
                            <input
                                onChange={ this.handleStateChange }
                                value={this.state.lastName2}
                                name="lastName2"
                                type="text"
                                className="form-control External-input"
                                min="0"
                                maxLength="50"
                                minLength="3"
                                placeholder='Doe'
                            />
                        </div>
                    </div>
                </div>

                <div className="row External-row">
                    <div className="col-md-3">
                        <span className="External-label">* {labels.stAddress[displayLanguage]}</span>
                        <div className="input-container--validated">
                            <input
                                onChange={ this.handleStateChange }
                                value={this.state.streetAddress}
                                name="streetAddress"
                                type="text"
                                className="form-control External-input"
                                required
                                min="0"
                                maxLength="50"
                                minLength="5"
                                placeholder='445 Mount Eden Road, Mount Eden, Auckland.'
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <span className="External-label">{labels.apt[displayLanguage]}</span>
                        <input
                            onChange={ this.handleStateChange }
                            value={this.state.aptNumber}
                            name="aptNumber"
                            type="number"
                            className="form-control External-input"
                            min="0"
                            maxLength="50"
                            minLength="5"
                            placeholder='34'
                        />
                    </div>
                </div>

                <div className="row External-row">
                    <LocationForm
                        onChangeCity={this.updateCity}
                        onChangeState={this.updateState}
                        onChageZipCode={this.updateZipCode}
                        city={this.state.city}
                        state={this.state.state}
                        zipCode={this.state.zipCode}
                        changeCity={this.state.changeCity}
                        cityClass={`form-control ${!this.state.validCity && ' _invalid'} External-input`}
                        stateClass={`form-control ${!this.state.validState && ' _invalid'} External-input`}
                        zipCodeClass={`form-control ${!this.state.validZipCode && ' _invalid'} External-input`}

                        cityColClass="col-md-3"
                        stateColClass="col-md-3"
                        zipCodeColClass="col-md-3"
                        cssTitle={"primary"}
                        placeholder="99999-99999"
                        mask="99999-99999"
                        updateSearchingZipCodeProgress={this.updateSearchingZipCodeProgress} />
                    <div className="col-md-3">
                        <span className="External-label"> {labels.homePhone[displayLanguage]}</span>
                        <InputMask
                            id="home-number"
                            name="homePhone"
                            mask="+(999) 999-9999"
                            maskChar=" "
                            value={this.state.homePhone}
                            className="form-control External-input"
                            onChange={(event) => {
                                this.setState({
                                    homePhone: event.target.value
                                });
                            }}
                            placeholder="+(___) ___-____"
                            pattern="^(\+\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$"
                            minLength="15"
                        />
                    </div>
                </div>
                <div className="row External-row">

                    <div className="col-md-3">
                        <span className="External-label">* {labels.cellPhone[displayLanguage]}</span>
                        <div className="input-container--validated">
                            <InputMask
                                id="cell-number"
                                name="cellPhone"
                                mask="+(999) 999-9999"
                                maskChar=" "
                                value={this.state.cellPhone}
                                className="form-control External-input"
                                onChange={ this.handleStateChange }
                                pattern="^(\+\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$"
                                placeholder="+(___) ___-____"
                                required
                                minLength="15"
                            />
                        </div>
                    </div>

                    <div className="col-md-3">
                        <span className="External-label">* {labels.ssn[displayLanguage]}</span>
                        <div className="input-container--validated">
                            <InputMask
                                id="socialSecurityNumber"
                                name="socialSecurityNumber"
                                mask="999-99-9999"
                                maskChar=" "
                                className="form-control External-input"
                                onChange={ this.handleStateChange }
                                value={this.state.socialSecurityNumber}
                                placeholder="___-__-____"
                                pattern="^\d{3}-\d{2}-\d{4}$"
                                required
                                minLength="15"
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="col-md-12">
                            <span className="External-label"> {labels.transport[displayLanguage]}</span>
                        </div>
                        <div className="col-md-12">
                            <div className="onoffswitch">
                                <input
                                    id="carSwitch"
                                    className="onoffswitch-checkbox"
                                    onChange={ this.handleStateChange }
                                    checked={this.state.car}
                                    value={this.state.car}
                                    name="car"
                                    type="checkbox"
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
                    <div className="col-md-3">
                        <span className="External-label">* {labels.idType[displayLanguage]}</span>                        
                        <Select
                            options={this.state.idTypeOptions}
                            value={this.findSelectedIdType(this.state.typeOfId)}
                            onChange={this.handleIdTypeChange}
                            closeMenuOnSelect={true}
                            components={makeAnimated()}
                            isMulti={false}                            
                            styles={selectStyles}
                        />
                    </div>
                </div>
                
                <div className="row External-row">
                    <div className="col-md-3">
                        <span className="External-label">* {labels.idExpire[displayLanguage]}</span>
                        <div className="input-container--validated">
                            <input
                                onChange={ this.handleStateChange }
                                value={this.state.expireDateId}
                                name="expireDateId"
                                type="date"
                                className="form-control External-input"
                                required
                                min="0"
                                maxLength="50"
                                minLength="10"
                            />
                        </div>
                    </div>
                    <div className="col-md-3">
                        <span className="External-label">* {labels.email[displayLanguage]}</span>
                        <div className="input-container--validated">
                            <input
                                onChange={ this.handleStateChange }
                                value={this.state.emailAddress}
                                name="emailAddress"
                                type="email"
                                className="form-control External-input"
                                required
                                min="0"
                                maxLength="50"
                                minLength="8"
                                placeholder='john.doe@email.com'
                            />
                        </div>
                    </div>
                
                    <div className="col-md-3">
                        <span className="External-label"> * {labels.position[displayLanguage]}</span>
                        
                        <Select
                            options={this.state.positionApplyOptions}
                            value={this.findSelectedPositionApply(this.state.idealJob)}
                            onChange={this.handlePositionApplyChange}
                            closeMenuOnSelect={true}
                            components={makeAnimated()}
                            isMulti={false}
                            styles={selectStyles}
                        />
                    </div>
                    <div className="col-md-3">
                        <span className="External-label">{labels.willing[displayLanguage]}</span>

                        <Select
                            options={this.state.positionCatalogOptions}
                            value={this.state.positionsTags}
                            onChange={this.handleChangePositionTag}
                            closeMenuOnSelect={false}
                            components={makeAnimated()}
                            isMulti
                            styles={selectStyles}                            
                        />
                    </div>                    
                </div>
                <div className="row External-row">
                    <div className="col-md-3">
                        <span className="External-label">* {labels.available[displayLanguage]}</span>
                        <div className="input-container--validated">
                            <input
                                onChange={ this.handleStateChange }
                                value={this.state.dateAvailable}
                                name="dateAvailable"
                                type="date"
                                className="form-control External-input"
                                required
                                min="0"
                                maxLength="50"
                            />
                        </div>
                    </div>                    
                </div>
                {/* <hr className="separator" /> */}
                <div className="row External-row">
                    <div className="col-md-3">
                        <span className="External-label"> {labels.restrictions[displayLanguage]} </span>
                        <div className="col-md-12">
                            <input
                                onChange={ this.handleStateChange }
                                value="1"
                                type="radio"
                                name="scheduleRestrictions"
                                className=""
                            />
                            <label className="radio-label External-label"> Yes</label>
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
                                checked={this.state.scheduleRestrictions === '0'}
                            />
                            <label className="radio-label External-label"> No</label>
                        </div>
                        <span className="check-icon" />
                    </div>
                    <div className="col-md-3">
                        <span className="External-label"> {labels.explain[displayLanguage]} </span>
                        {this.state.scheduleRestrictions === '0' ? (
                            <textarea
                                onChange={ this.handleStateChange }
                                value={this.state.scheduleExplain}
                                name="scheduleExplain"
                                cols="30"
                                rows="3"
                                disabled
                                className="form-control textarea-apply-form External-input"
                                placeholder='Add details...'
                            />
                        ) : (
                                <textarea
                                    onChange={ this.handleStateChange }
                                    value={this.state.scheduleExplain}
                                    name="scheduleExplain"
                                    cols="30"
                                    rows="3"
                                    required
                                    className="form-control textarea-apply-form External-input"
                                    placeholder='Add details...'
                                />
                            )}
                    </div>
                
                    <div className="col-md-3">
                        <span className="External-label"> {labels.felony[displayLanguage]} </span>
                        <div className="col-md-12">
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
                            <label className="radio-label External-label"> Yes</label>
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
                                checked={this.state.convicted === '0'}
                            />
                            <label className="radio-label External-label"> No</label>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <span className="External-label"> {labels.explain[displayLanguage]} </span>
                        {this.state.convicted === '0' ? (
                            <textarea
                                onChange={ this.handleStateChange }
                                value={this.state.convictedExplain}
                                name="convictedExplain"
                                cols="30"
                                disabled
                                rows="3"
                                className="form-control textarea-apply-form External-input"
                                placeholder='Add details...'
                            />
                        ) : (
                                <textarea
                                    onChange={ this.handleStateChange }
                                    value={this.state.convictedExplain}
                                    name="convictedExplain"
                                    cols="30"
                                    required
                                    rows="3"
                                    className="form-control textarea-apply-form External-input"
                                    placeholder='Add details...'
                                />
                            )}
                    </div>
                </div>
                <div className="row External-row">
                    <div className="col-md-3">
                        <span className="External-label"> {labels.heardTumi[displayLanguage]} </span>
                        <Select
                            options={this.state.heardTumiOptions}
                            value={this.findSelectedReference(this.state.socialNetwork)}
                            onChange={this.handleReferenceChange}
                            closeMenuOnSelect={true}
                            components={makeAnimated()}
                            isMulti={false}                            
                            styles={selectStyles}
                        />                        
                    </div>
                    <div className="col-md-3">
                        {this.state.socialNetwork === 'others' ? (
                            <textarea
                                onChange={ this.handleStateChange }
                                placeholder="Explain how did you hear about Tumi Staffing"
                                value={this.state.comment}
                                required
                                name="comment"
                                cols="20"
                                rows="4"
                                className="form-control textarea-apply-form External-input"
                                placeholder='Add Details...'
                            />
                        ) : (
                                ''
                            )}
                    </div>
                </div>
                <div className="External-formButtons">
                    <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} className={`${this.props.classes.button} External-formButton`}>
                        {labels.back[displayLanguage]}
                    </Button>
                    <Button type="submit" variant="contained" color="primary" className={`${this.props.classes.button} External-formButton`} disabled={this.state.searchigZipcode}>
                        {this.state.activeStep === steps.length - 1 ? 'Finish' : `${labels.next[displayLanguage]}`}
                    </Button>             
                </div>                            
            </div>
        )
    };

    // To render a dialog loading when the mutation is loading
    renderInsertDialogLoading = (steps) => (
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
    renderSkillsDialog = (steps) => {
        
        return(
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


                            document.getElementById('skill-form').reset();
                        }
                    );
                }}
                className="apply-form row form-section-1"
            >
                <div className="col-md-5">
                    <span className="External-label">* Skill Name</span>
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
                <div className="col-md-5">
                    <span className="External-label">Skill Level</span>
                    <InputRange
                        getPercentSkill={(percent) => {
                            // update the percent skill
                            this.setState({
                                percent: percent
                            });
                        }}
                    />
                </div>
                <div className="col-md-2">
                    <div className="form-section--center form-section--center--margin">
                        <button className="btn btn-save-skill btn-success col-md-6" type="submit" form="skill-form">
                            <i className="fas fa-plus"></i>
                        </button>
                        <button className="btn btn-danger col-md-6" type="reset" onClick={this.handleClose}>
                            <i className="fas fa-ban"></i>
                        </button>
                    </div>
                </div>
            </form>
        );
    }

    // To render the Education Service Section
    renderEducationSection = (steps) => {
        const { labels, displayLanguage } = this.state;

        return(
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
                            <span className='skills-label'>{schoolItem.schoolType}</span>
                        </div>
                        <div className="col-md-2">
                            <span className='skills-label'>{schoolItem.educationName}</span>
                        </div>
                        <div className="col-md-2">
                            <span className='skills-label'>{schoolItem.educationAddress}</span>
                        </div>
                        <div className="col-md-2">
                            <span className='skills-label'>{schoolItem.startDate}</span>
                        </div>
                        <div className="col-md-1">
                            <span className='skills-label'>{schoolItem.endDate}</span>
                        </div>
                        <div className="col-md-1">
                            <span className='skills-label'>{schoolItem.graduated ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="col-md-1">
                            <span className='skills-label'>
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
            <div className="row">
                <div className="col-md-3">
                    <label className="External-label">* Field of Study</label>
                    <div className="input-container--validated">
                        <input
                            id="studyType"
                            form="education-form"
                            name="studyType"
                            type="text"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="2"
                            placeholder='Engineering'
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <label className="External-label">* Name (Institution)</label>
                    <div className="input-container--validated">
                        <input
                            form="education-form"
                            name="institutionName"
                            id="institutionName"
                            type="text"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                            placeholder='Universitiy of California'
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <label className="External-label">* Address</label>
                    <div className="input-container--validated">
                        <input
                            form="education-form"
                            name="addressInstitution"
                            id="addressInstitution"
                            type="text"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                            placeholder='445 Mount Eden Road, Mount Eden, Auckland'
                        />
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-md-3">
                    <span className="External-label">* Time Period</span>
                    <div className="input-container--validated">
                        <input
                            form="education-form"
                            name="startPeriod"
                            id="startPeriod"
                            type="date"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <span className="External-label">* To</span>
                    <div className="input-container--validated">
                        <input
                            form="education-form"
                            name="endPeriod"
                            id="endPeriod"
                            type="date"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <label className="External-label">Graduated</label> <br />

                    <div className="onoffswitch">
                        <input
                            className="onoffswitch-checkbox"
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
                        <label className="onoffswitch-label" htmlFor="graduated">
                            <span className="onoffswitch-inner" />
                            <span className="onoffswitch-switch" />
                        </label>
                    </div>               
                </div>
                <div className="col-md-3">
                    <label className="External-label">Degree</label>
                    {this.state.graduated ? (
                        <div className="input-container--validated">
                            <select form="education-form" name="degree" id="degree" className="form-control External-input">
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
                                    className="form-control External-input"
                                >
                                    <option value="">Select an option</option>
                                    {studyTypes.map((item) => <option value={item.Id}>{item.Name}</option>)}
                                </select>
                            </div>
                        )}
                </div>
            </div>
            <div className="row mb-4">
                <div className="col-md-12">
                    <Button type="submit" form="education-form" className="External-formButton float-right">
                        Add
                    </Button>
                </div>
            </div>
            <div className="External-formButtons">
                <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} className={`${this.props.classes.button} External-formButton`}>
                    {labels.back[displayLanguage]}
                </Button>
                <Button type="submit" onClick={this.insertEducationApplication} variant="contained" color="primary" className={`${this.props.classes.button} External-formButton`}>
                    {this.state.activeStep === steps.length - 1 ? 'Finish' : `${labels.next[displayLanguage]}`}
                </Button>             
            </div>  
        </form>
    )};

    // To render the Military Service Section
    renderMilitaryServiceSection = (steps) => (
        <div className="ApplyBlock">
            <h4 className="ApplyBlock-title">Military Service</h4>
            <div className="row">
                <div className="col-md-6">
                    <span className="External-label"> Branch</span>
                    <input
                        onChange={(e) => {
                            this.setState({
                                branch: e.target.value
                            });
                        }}
                        value={this.state.branch}
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
                    <span className="External-label"> Rank at Discharge</span>
                    <input
                        onChange={(e) => {
                            this.setState({
                                rankAtDischarge: e.target.value
                            });
                        }}
                        value={this.state.rankAtDischarge}
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
                    <span className="External-label"> Dates</span>
                    <input
                        onChange={(e) => {
                            this.setState({
                                startDateMilitaryService: e.target.value
                            });
                        }}
                        value={this.state.startDateMilitaryService}
                        name="militaryStartDate"
                        type="date"
                        className="form-control"
                        min="0"
                        maxLength="50"
                        minLength="3"
                    />
                </div>
                <div className="col-md-3">
                    <span className="External-label">To: </span>
                    <input
                        onChange={(e) => {
                            this.setState({
                                endDateMilitaryService: e.target.value
                            });
                        }}
                        value={this.state.endDateMilitaryService}
                        name="militaryEndDate"
                        type="date"
                        className="form-control"
                        min="0"
                        maxLength="50"
                        minLength="3"
                    />
                </div>
                <div className="col-md-6">
                    <span className="External-label"> Type of Discharge</span>
                    <select
                        onChange={(e) => {
                            this.setState({
                                typeOfDischarge: e.target.value
                            });
                        }}
                        value={this.state.typeOfDischarge}
                        name="dischargeType"
                        id="dischargeType"
                        className="form-control"
                    >
                        <option value="">Select an option</option>
                        <option value="1">Honorable discharge</option>
                        <option value="2">General discharge</option>
                        <option value="3">Other than honorable (OTH) discharge</option>
                        <option value="4">Bad conduct discharge</option>
                        <option value="5">Dishonorable discharge</option>
                        <option value="6">Entry-level separation.</option>
                    </select>
                    <span className="check-icon" />
                </div>
            </div>
            <div className="bottom-container-stepper">
                <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} className={this.props.classes.button}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        this.insertMilitaryServicesApplication();
                    }}
                    className={this.props.classes.button}
                >
                    {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </div>
        </div>
    );

    // To render the Previous Employment Section
    renderPreviousEmploymentSection = (steps) => {
        const { labels, displayLanguage } = this.state;
        return(
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
                                <span className='External-label'>{employmentItem.companyName}</span>
                            </div>
                            <div className="col-md-2">
                                <span className='External-label'>{employmentItem.address}</span>
                            </div>
                            <div className="col-md-2">
                                <span className='External-label'>{employmentItem.jobTitle}</span>
                            </div>
                            <div className="col-md-1">
                                <span className='External-label'>{employmentItem.phone}</span>
                            </div>
                            <div className="col-md-1">
                                <span className='External-label'>{employmentItem.supervisor}</span>
                            </div>
                            <div className="col-md-1">
                                <span className='External-label'>{employmentItem.payRate}</span>
                            </div>
                            <div className="col-md-1">
                                <span className='External-label'>{employmentItem.startDate}</span>
                            </div>
                            <div className="col-md-1">
                                <span className='External-label'>{employmentItem.endDate}</span>
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
            </div>
            <div className="row External-row">
                <div className="col-md-3">
                    <span className="External-label">* Company</span>
                    <div className="input-container--validated">
                        <input
                            id="companyNameEmployment"
                            form="form-previous-employment"
                            name="companyNameEmployment"
                            type="text"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                            placeholder='Name of the Company'
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <span className="External-label">* Phone</span>
                    <div className="input-container--validated">
                        <InputMask
                            id="companyPhoneEmployment"
                            form="form-previous-employment"
                            name="phoneEmployment"
                            mask="+(999) 999-9999"
                            maskChar=" "
                            value={this.state.previousEmploymentPhone}
                            className="form-control External-input"
                            onChange={(event) => {
                                this.setState({
                                    previousEmploymentPhone: event.target.value
                                });
                            }}
                            required
                            placeholder="+(___) ___-____"
                            minLength="15"
                        />                       
                    </div>
                </div>
                <div className="col-md-3">
                    <span className="External-label">* Address</span>
                    <div className="input-container--validated">
                        <input
                            id="companyAddressEmployment"
                            form="form-previous-employment"
                            name="addressEmployment"
                            type="text"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                            placeholder='445 Mount Eden Road, Mount Eden, Auckland'
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <span className="External-label">* Supervisor</span>
                    <div className="input-container--validated">
                        <input
                            id="companySupervisor"
                            form="form-previous-employment"
                            name="supervisorEmployment"
                            type="text"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                            placeholder='John Doe'
                        />
                    </div>
                </div>
            </div>
            <div className="row External-row">
                <div className="col-md-3">
                    <span className="External-label">* Job Title</span>
                    <div className="input-container--validated">
                        <input
                            id="companyJobTitle"
                            form="form-previous-employment"
                            name="jobTitleEmployment"
                            type="text"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                            placeholder='Area Manager'
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <span className="External-label">* Pay Rate</span>
                    <div className="input-container--validated">
                        <input
                            id="companyPayRate"
                            form="form-previous-employment"
                            name="payRateEmployment"
                            type="number"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                            placeholder='1111.1'
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <span className="External-label">* Dates</span>
                    <div className="input-container--validated">
                        <input
                            id="companyStartDate"
                            form="form-previous-employment"
                            name="startPreviousEmployment"
                            type="date"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                    </div>
                </div>
                <div className="col-md-3">
                    <span className="External-label">* To: </span>
                    <div className="input-container--validated">
                        <input
                            id="companyEndDate"
                            form="form-previous-employment"
                            name="endPreviousEmployment"
                            type="date"
                            className="form-control External-input"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                    </div>
                </div>
            </div>
            <div className="row External-row">
                <div className="col-md-3">
                    <span className="External-label"> Reason for leaving</span>
                    <textarea
                        id="companyReasonForLeaving"
                        form="form-previous-employment"
                        name="reasonForLeavingEmployment"
                        className="form-control External-input"
                        placeholder='Add details...'
                    />
                </div>
            </div>
            <div className="row External-row">
                <div className="col-md-12">
                    <Button type="submit" form="form-previous-employment" className="External-formButton float-right">
                        Add
                    </Button>
                </div>
            </div>            
            <div className="External-formButtons">
                <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} className={`${this.props.classes.button} External-formButton`}>
                    {labels.back[displayLanguage]}
                </Button>
                <Button type="submit" onClick={this.insertPreviousEmploymentApplication} variant="contained" color="primary" className={`${this.props.classes.button} External-formButton`}>
                    {this.state.activeStep === steps.length - 1 ? 'Finish' : `${labels.next[displayLanguage]}`}
                </Button>             
            </div>
        </form>
    )};

    // To render the Languages Section
    renderlanguagesSection = (steps) => {
        const { labels, displayLanguage } = this.state;
        
        return(
        <div className="ApplyBlock">
            <h4 className="ApplyBlock-title">Languages</h4>
            {this.state.languages.length > 0 ? (
                <div className="skills-container skills-container--header">
                    <div className="row pt-0 pb-0">
                        <div className="col-md-3">
                            <span className='skills-label'>Language Name</span>
                        </div>
                        <div className="col-md-4">
                            <span className='skills-label'>Conversation</span>
                        </div>
                        <div className="col-md-4">
                            <span className='skills-label'>Writing</span>
                        </div>
                    </div>
                </div>
            ) : (
                    ''
                )}
            {this.state.languages.map((languageItem) => (
                <div key={uuidv4()} className="skills-container">
                    <div className="row pt-0 pb-0">
                        <div className="col-md-3">
                            <span className='skills-desc'>
                                {this.state.languagesLoaded.map((item) => {
                                    if (item.Id == languageItem.language) {
                                        return item.Name.trim();
                                    }
                                })}
                            </span>
                        </div>
                        <div className="col-md-4">
                            <span className='skills-desc'>
                                {languageLevelsJSON.map((item) => {
                                    if (item.Id == languageItem.conversation) {
                                        return item.Name;
                                    }
                                })}
                            </span>
                        </div>
                        <div className="col-md-4">
                            <span className='skills-desc'>
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
                className="row mb-4"
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
                    <span className="External-label">* Languages</span>
                    <select
                        id="nameLanguage"
                        name="languageName"
                        required
                        className="form-control External-input"
                        form="form-language"
                    >
                        <option value="">Select an option</option>
                        {this.state.languagesLoaded.map((item) => <option value={item.Id}>{item.Name}</option>)}
                    </select>
                  
                    <span className="check-icon" />
                </div>
                <div className="col-md-3">
                    <span className="External-label">* Conversation</span>
                    <select
                        required
                        id="conversationLanguage"
                        form="form-language"
                        name="conversationLanguage"
                        className="form-control External-input"
                    >
                        <option value="">Select an option</option>
                        {languageLevelsJSON.map((item) => <option value={item.Id}>{item.Name}</option>)}
                    </select>
                    <span className="check-icon" />
                </div>
                <div className="col-md-3">
                    <span className="External-label">* Writing</span>
                    <select
                        required
                        id="writingLanguage"
                        form="form-language"
                        name="writingLanguage"
                        className="form-control External-input"
                    >
                        <option value="">Select an option</option>
                        {languageLevelsJSON.map((item) => <option value={item.Id}>{item.Name}</option>)}
                    </select>
                    <span className="check-icon" />
                </div>
                <div className="col-md-2">
                    <br />
                    <Button type="submit" form="form-language" className="External-formButton">
                        Add
                    </Button>
                </div>                
            </form>
            <div className="External-formButtons">
                <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} className={`${this.props.classes.button} External-formButton`}>
                    {labels.back[displayLanguage]}
                </Button>
                <Button variant="contained" color="primary" className={`${this.props.classes.button} External-formButton`} onClick={this.insertLanguagesApplication}>
                    {this.state.activeStep === steps.length - 1 ? 'Finish' : `${labels.next[displayLanguage]}`}
                </Button>             
            </div>   
        </div>
    )};

    // To render the skills section
    renderSkillsSection = (steps) => (
        <div className="ApplyBlock">
            <h4 className="ApplyBlock-title">Skills</h4>
            <div className="row">
                <div className="col-md-12">
                    {this.renderSkillsDialog()}
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
            <div className="bottom-container-stepper">
                <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} className={this.props.classes.button}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => {
                        this.insertSkillsApplication();
                    }}
                    className={this.props.classes.button}
                >
                    {this.state.activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
            </div>
        </div>
    );

    // To render the disclaimer section
    renderDisclaimerSection = (history, steps) => (
        <div className="ApplyBlock">
            <h4 className="ApplyBlock-title">Disclaimer</h4>
            <div className="row">
                <div className="col-md-12">
                    <p className="disclaimer-text">
                        I certify that the information on this application is correct and I understand that any
                        misrepresentation or omission of any information will result in my disqualification from
                        consideration for employment or, if employed, my dismissal. I hereby acknowledge and agree
                        that, as part of my application for employment, Tumi Staffing, Inc., may request background
                        information about me from a consumer reporting agency for employment purposes in accordance
                        with federal and state law. I authorize law enforcement agencies, learning institutions
                        (including public and private schools and universities), information service bureaus, credit
                        bureaus, record/data repositories, courts (federal, state and local), motor vehicle records
                        agencies, my past or present employers, the military, and other individuals and sources to
                        furnish any and all information on me that is requested by the consumer reporting agency. By
                        my acceptance below, I certify the information I provided on this form is true and correct.
                        I agree that this Disclosure and Authorization form will be valid for any reports that may
                        be requested by or on behalf of the Company. By my acceptance below, the company may obtain
                        a consumer report as discussed above.
                    </p>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <input
                            type="checkbox"
                            checked={this.state.aceptedDisclaimer}
                            onChange={(e) => {
                                this.setState({
                                    aceptedDisclaimer: e.target.checked,
                                    openSignature: e.target.checked
                                });
                            }} />
                        <span className="External-label"> Accept and Sign</span>
                    </div>
                </div>
                {
                    this.state.aceptedDisclaimer ? (
                        <Dialog
                            open={this.state.openSignature}
                            onClose={() => {
                                this.setState({
                                    openSignature: false,
                                    aceptedDisclaimer: false
                                })
                            }}
                            aria-labelledby="form-dialog-title">
                            <DialogTitle>
                                <h1 className="primary apply-form-container__label text-center">Please Sign</h1>
                            </DialogTitle>
                            <DialogContent>
                                <SignatureForm applicationId={this.state.applicationId} signatureValue={null}
                                    showSaveIcon={null} />
                            </DialogContent>
                        </Dialog>
                    ) : (
                            ''
                        )
                }
            </div>
            <div className="bottom-container-stepper">
                <Button disabled={this.state.activeStep === 0} onClick={this.handleBack} className={this.props.classes.button}>
                    Back
                </Button>
            </div>
        </div>
    );

    getStepContent = (step, history, steps) => {
        switch (step) {
            case 0:
                return this.renderApplicantInformationSection(steps);
            case 1:
                return this.renderlanguagesSection(steps);
            case 2:
                return this.renderEducationSection(steps);
            case 3:
                return this.renderPreviousEmploymentSection(steps);
            case 4:
                return this.renderMilitaryServiceSection(steps);
            case 5:
                return this.renderSkillsSection(steps);
            case 6:
                return this.renderDisclaimerSection(history, steps);
            default:
                return 'Unknown step';
        }
    };
//#endregion

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;            

        return (
            <React.Fragment>
                <div className="main-stepper-container External">
                    <div className="container-fluid">
                        <div className="row External-bg">
                            <div className="col-md-4 pr-0">
                                <div className="Stepper-wrapper p-3">
                                    <Stepper activeStep={activeStep} orientation="vertical" className="main-stepper-nav External-stepper">
                                        {steps.map((label, index) => {
                                            return (
                                                <Step key={label}>
                                                    <StepLabel className={classes.stepper}>{label}</StepLabel>
                                                    <StepContent>
                                                        <Typography
                                                            variant="caption">{index === 0 ? 'Required' : 'Optional'}
                                                        </Typography>
                                                    </StepContent>
                                                </Step>
                                            );
                                        })}
                                    </Stepper>
                                </div>
                                {activeStep === steps.length && (
                                    <Paper square elevation={0} className={classes.resetContainer}>
                                        <Typography>All steps completed - you&quot;re finished</Typography>
                                        <Button onClick={this.handleReset} className={classes.button}>
                                            Reset
                                        </Button>
                                    </Paper>
                                )}

                            </div>
                            <div className="col-md-8 pl-0">
                                <Typography className="">
                                    <Route
                                        render={({ history }) => (
                                            <form
                                                className="ApplyForm apply-form External-form"
                                                onSubmit={(e) => {
                                                    // To cancel the default submit event
                                                    e.preventDefault();
                                                    this.setState(() => {
                                                        return {
                                                            validCity: this.state.city && true,
                                                            validState: this.state.state && true,
                                                            validZipCode: this.state.zipCode.trim().replace('-', '') && true
                                                        }
                                                    }, () => {
                                                        if (!this.state.validCity)
                                                            this.props.handleOpenSnackbar('warning', 'City needed');
                                                        else if (!this.state.validState)
                                                            this.props.handleOpenSnackbar('warning', 'State needed');
                                                        else if (!this.state.validZipCode)
                                                            this.props.handleOpenSnackbar('warning', 'ZipCode needed');
                                                        else {
                                                            // Call mutation to create a application
                                                            if (this.state.applicationId === null) {
                                                                this.insertApplicationInformation(history);
                                                            } else {
                                                                this.updateApplicationInformation();
                                                            }
                                                        }
                                                    });

                                                }}
                                            >
                                                {/* <ReactFlagsSelect 
                                                    defaultCountry="US" 
                                                    onSelect={this.handleDisplayLanguageChange}
                                                    countries={["US", "ES"]}
                                                    customLabels={{"US":"English", "ES": "Español"}}
                                                    className="ApplyForm-language"
                                                /> */}
                                                {/* {this.getStepContent(this.state.activeStep, history, steps)} */}
                                                {this.getStepContent(3, history, steps)}
                                            </form>
                                        )}
                                    />
                                </Typography>

                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

VerticalLinearStepper.propTypes = {
    classes: PropTypes.object
};

export default withStyles(styles)(withApollo(withGlobalContent(VerticalLinearStepper)));
