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
import Query from 'react-apollo/Query';
import { GET_CITIES_QUERY, GET_POSITIONS_QUERY, GET_POSITIONS_CATALOG, GET_STATES_QUERY } from '../Queries';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import SelectNothingToDisplay from '../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import {
    ADD_APLICANT_EDUCATION,
    ADD_APLICANT_PREVIOUS_EMPLOYMENT,
    ADD_LANGUAGES,
    ADD_MILITARY_SERVICES,
    ADD_SKILL,
    CREATE_APPLICATION, RECREATE_IDEAL_JOB_LIST,
    UPDATE_APPLICATION
} from '../Mutations';
import Route from 'react-router-dom/es/Route';
import withGlobalContent from "../../Generic/Global";
import SignatureForm from "../SignatureForm/SignatureForm";
import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import axios from 'axios';


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
        };
    }

    handleChangePositionTag = (positionsTags) => {
        this.setState({ positionsTags });
        console.log(`Option selected:`, positionsTags);
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
                console.log("DEBUG");
            })
            .catch(error => {
                console.log("DEBUG ERROR");
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
    }

    findByZipCode = (zipCode = null, cityFinal = null) => {
        if (!zipCode) {
            return false;
        }

        this.props.client.query({
            query: GET_STATES_QUERY,
            variables: { parent: -1, value: `'${zipCode}'` },
            fetchPolicy: 'no-cache'
        }).then((data) => {
            this.setState({
                state: data.data.getcatalogitem[0].Id,
                cityFinal: cityFinal
            });
        });

    }

    render() {
        const { classes } = this.props;
        const steps = getSteps();
        const { activeStep } = this.state;
        this.validateInvalidInput();

        // To render the applicant information section
        let renderApplicantInformationSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Applicant Information</h4>
                <div className="row">
                    <div className="col-md-3">
                        <span className="primary">* First Name</span>
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
                        </div>
                    </div>
                    <div className="col-md-3">
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
                    </div>
                    <div className="col-md-3">
                        <span className="primary">* Last Name</span>
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
                        </div>
                    </div>
                    <div className="col-md-3">
                        <span className="primary">Second Last Name</span>
                        <div className="input-container--validated">
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
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                    </div>
                </div>
                <div className="row form-section">
                    <div className="col-md-9">
                        <span className="primary">* Street Address</span>
                        <div className="input-container--validated">
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
                    </div>
                    <div className="col-md-3">
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
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-3">
                        <span className="primary">* Zip Code</span>
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
                                    }, () => {
                                        const zipCode = this.state.zipCode.trim().replace('-', '').substring(0, 5)
                                        if (zipCode)
                                            axios.get(`https://ziptasticapi.com/${zipCode}`)
                                                .then(res => {
                                                    const cities = res.data;
                                                    if (!cities.error) {
                                                        this.findByZipCode(cities.state, cities.city.toLowerCase());
                                                    }
                                                })
                                    });
                                }}
                                value={this.state.zipCode}
                                placeholder="99999-99999"
                                required
                                minLength="15"
                            />

                        </div>
                    </div>
                    <div className="col-md-3">
                        <span className="primary">* State</span>
                        <Query query={GET_STATES_QUERY} variables={{ parent: 6 }}>
                            {({ loading, error, data, refetch, networkStatus }) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress />;
                                if (error) return <p>Nothing To Display</p>;
                                if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                    return (
                                        <select
                                            name="state"
                                            id="state"
                                            required
                                            className="form-control"
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
                                return <SelectNothingToDisplay />;
                            }}
                        </Query>
                    </div>
                    <div className="col-md-3">
                        <span className="primary">* City</span>
                        <Query query={GET_CITIES_QUERY} variables={{ parent: this.state.state }}>
                            {({ loading, error, data, refetch, networkStatus }) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (error) return <p>Nothing To Display </p>;
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
                                            onChange={(e) => {
                                                this.setState({
                                                    city: e.target.value
                                                })
                                            }}
                                            value={this.state.city}>
                                            <option value="">Select a city</option>
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

                    <div className="col-md-3">
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
                    </div>
                </div>
                <div className="row">

                    <div className="col-md-3">
                        <span className="primary">* Cell Phone</span>
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
                        </div>
                    </div>

                    <div className="col-md-3">
                        <span className="primary">* Social Security Number</span>
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
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="col-md-12">
                            <span className="primary"> Do you own transportation?</span>
                        </div>
                        <div className="col-md-12">
                            <div className="onoffswitch">
                                <input
                                    id="carSwitch"
                                    className="onoffswitch-checkbox"
                                    onChange={(event) => {
                                        this.setState({
                                            car: event.target.checked
                                        });
                                    }}
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
                        <span className="primary">* Type Of ID</span>
                        <select
                            name="typeOfID"
                            id="typeOfID"
                            required
                            className="form-control"
                            onChange={(e) => {
                                this.setState({
                                    typeOfId: e.target.value
                                });
                            }}
                            value={this.state.typeOfId}
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
                </div>
                <div className="row">
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <span className="primary">* Expire Date ID</span>
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
                        </div>
                    </div>
                    <div className="col-md-6">
                        <span className="primary">* Email Address</span>
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
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <span className="primary"> * Position Applying For</span>
                        {/*<Query query={GET_POSITIONS_CATALOG}>*/}
                            {/*{({ loading, error, data, refetch, networkStatus }) => {*/}
                                {/*//if (networkStatus === 4) return <LinearProgress />;*/}
                                {/*if (error) return <p>Error </p>;*/}
                                {/*if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {*/}
                                    {/*return (*/}
                                        {/*<select*/}
                                            {/*name="positionApply"*/}
                                            {/*id="positionApply"*/}
                                            {/*onChange={(event) => {*/}
                                                {/*this.setState({*/}
                                                    {/*idealJob: event.target.value*/}
                                                {/*});*/}
                                            {/*}}*/}
                                            {/*value={this.state.idealJob}*/}
                                            {/*className="form-control"*/}
                                            {/*required*/}
                                        {/*>*/}
                                            {/*<option value="">Select a position</option>*/}
                                            {/*<option value="0">Open Position</option>*/}
                                            {/*{data.getcatalogitem.map((item) => (*/}
                                                {/*<option*/}
                                                    {/*value={item.Id}>{item.Description}</option>*/}
                                            {/*))}*/}
                                        {/*</select>*/}
                                    {/*);*/}
                                {/*}*/}
                                {/*return <SelectNothingToDisplay />;*/}
                            {/*}}*/}
                        {/*</Query>*/}
                        <Query query={GET_POSITIONS_QUERY}>
                            {({ loading, error, data, refetch, networkStatus }) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (error) return <p>Error </p>;
                                if (data.workOrder != null && data.workOrder.length > 0) {
                                    return (
                                        <select
                                            name="positionApply"
                                            id="positionApply"
                                            onChange={(event) => {
                                                this.setState({
                                                    idealJob: event.target.value
                                                });
                                            }}
                                            value={this.state.idealJob}
                                            className="form-control"
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
                        <span className="primary">Willing to work as</span>
                        {/*<Query query={GET_POSITIONS_QUERY}>*/}
                            {/*{({ loading, error, data, refetch, networkStatus }) => {*/}
                                {/*//if (networkStatus === 4) return <LinearProgress />;*/}
                                {/*if (error) return <p>Error </p>;*/}
                                {/*if (data.workOrder != null && data.workOrder.length > 0) {*/}
                                    {/*let options = [];*/}
                                    {/*data.workOrder.map((item) => (*/}
                                        {/*options.push({ value: item.id, label: item.position.Position + (item.BusinessCompany.Code.trim()) })*/}
                                    {/*));*/}

                                    {/*return (*/}
                                        {/*<div style={{*/}
                                            {/*paddingTop: '0px',*/}
                                            {/*paddingBottom: '2px',*/}
                                        {/*}}>*/}
                                            {/*<Select*/}
                                                {/*options={options}*/}
                                                {/*value={this.state.positionsTags}*/}
                                                {/*onChange={this.handleChangePositionTag}*/}
                                                {/*closeMenuOnSelect={false}*/}
                                                {/*components={makeAnimated()}*/}
                                                {/*isMulti*/}
                                            {/*/>*/}
                                        {/*</div>*/}
                                    {/*);*/}
                                {/*}*/}
                                {/*return <SelectNothingToDisplay />;*/}
                            {/*}}*/}
                        {/*</Query>*/}
                        <Query query={GET_POSITIONS_CATALOG}>
                            {({ loading, error, data, refetch, networkStatus }) => {
                                //if (networkStatus === 4) return <LinearProgress />;
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
                    <div className="col-md-6">
                        <span className="primary">* Date Available</span>
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
                        </div>
                    </div>
                    {/*<form*/}
                    {/*id="ideal-job-form"*/}
                    {/*className="col-md-12 ideal-job-form"*/}
                    {/*onSubmit={(e) => {*/}
                    {/*e.stopPropagation();*/}
                    {/*e.preventDefault();*/}

                    {/*let item = {*/}
                    {/*description: document.getElementById('idealJob').value,*/}
                    {/*uuid: uuidv4()*/}
                    {/*};*/}

                    {/*this.setState(*/}
                    {/*(prevState) => ({*/}
                    {/*idealJobs: [...prevState.idealJobs, item]*/}
                    {/*}),*/}
                    {/*() => {*/}
                    {/*document.getElementById('idealJob').value = '';*/}
                    {/*}*/}
                    {/*);*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*<span className="primary">Ideal Job</span>*/}
                    {/*<div className="row">*/}
                    {/*<div className="col-md-12">*/}
                    {/*<div className="input-container--validated input-container--ideal-job">*/}
                    {/*<input*/}
                    {/*id="idealJob"*/}
                    {/*name="idealJob"*/}
                    {/*type="text"*/}
                    {/*className="form-control ideal-job-form-input"*/}
                    {/*min="0"*/}
                    {/*minLength="3"*/}
                    {/*maxLength="50"*/}
                    {/*/>*/}
                    {/*<button type="submit" form="ideal-job-form" className="add-ideal-job">*/}
                    {/*Add*/}
                    {/*</button>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</div>*/}
                    {/*</form>*/}
                    <div className="col-md-12">
                        {this.state.idealJobs.map((idealJobItem) => (
                            <span className="idealJobItem">
                                <span>{idealJobItem.description}</span>{' '}
                                <i
                                    className="far fa-times-circle"
                                    onClick={() => {
                                        this.setState((prevState) => ({
                                            idealJobs: this.state.idealJobs.filter((_, i) => {
                                                return _.uuid !== idealJobItem.uuid;
                                            })
                                        }));
                                    }}
                                />
                            </span>
                        ))}
                    </div>
                </div>
                <hr className="separator" />
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
                                checked={this.state.scheduleRestrictions === '0'}
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
                                checked={this.state.convicted === '0'}
                            />
                            <label className="radio-label"> No</label>
                        </div>
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
                            value={this.state.socialNetwork}
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
                <div className="bottom-container-stepper">
                    <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                        Back
                    </Button>
                    <Button type="submit" variant="contained" color="primary" className={classes.button}>
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </div>
        );

        // To render a dialog loading when the mutation is loading
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
                    <span className="primary">* Skill Name</span>
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
                    <span className="primary">Skill Level</span>
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
                        <label className="primary">* Field of Study</label>
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
                        <label className="primary">* Name (Institution)</label>
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
                        <label className="primary">* Address</label>
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
                        <span className="primary">* Time Period</span>
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
                        <span className="primary">* To</span>
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

                        {/*<label className="switch">*/}
                        {/*<input*/}
                        {/*onChange={(e) => {*/}
                        {/*this.setState({*/}
                        {/*graduated: document.getElementById('graduated').checked*/}
                        {/*});*/}
                        {/*}}*/}
                        {/*form="education-form"*/}
                        {/*type="checkbox"*/}
                        {/*value="graduated"*/}
                        {/*name="graduated"*/}
                        {/*id="graduated"*/}
                        {/*/>*/}
                        {/*<p className="slider round" />*/}
                        {/*</label>*/}
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
                <div className="bottom-container-stepper">
                    <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            this.insertEducationApplication();
                        }}
                        className={classes.button}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
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
                        <span className="primary"> Rank at Discharge</span>
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
                        <span className="primary"> Dates</span>
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
                        <span className="primary">To: </span>
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
                        <span className="primary"> Type of Discharge</span>
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
                    <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            this.insertMilitaryServicesApplication();
                        }}
                        className={classes.button}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </div>
        );

        // To render the Previous Employment Section
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
                        <span className="primary">* Company</span>
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
                        <span className="primary">* Phone</span>
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
                        <span className="primary">* Address</span>
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
                        <span className="primary">* Supervisor</span>
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
                        <span className="primary">* Job Title</span>
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
                        <span className="primary">* Pay Rate</span>
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
                        <span className="primary">* Dates</span>
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
                        <span className="primary">* To: </span>
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
                <div className="bottom-container-stepper">
                    <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            this.insertPreviousEmploymentApplication();
                        }}
                        className={classes.button}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </form>
        );

        // To render the Languages Section
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
                        <span className="primary">* Languages</span>
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
                        <span className="primary">* Conversation</span>
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
                        <span className="primary">* Writing</span>
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
                    <div className="bottom-container-stepper">
                        <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                this.insertLanguagesApplication();
                            }}
                            className={classes.button}
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </form>
            </div>
        );

        // To render the skills section
        let renderSkillsSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Skills</h4>
                <div className="row">
                    <div className="col-md-12">
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
                <div className="bottom-container-stepper">
                    <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                        Back
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            this.insertSkillsApplication();
                        }}
                        className={classes.button}
                    >
                        {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                    </Button>
                </div>
            </div>
        );

        // To render the disclaimer section
        let renderDisclaimerSection = (history) => (
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
                            <span className="primary"> Accept and Sign</span>
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
                    <Button disabled={activeStep === 0} onClick={this.handleBack} className={classes.button}>
                        Back
                    </Button>
                </div>
            </div>
        );

        let getStepContent = (step, history) => {
            switch (step) {
                case 0:
                    return renderApplicantInformationSection();
                case 1:
                    return renderlanguagesSection();
                case 2:
                    return renderEducationSection();
                case 3:
                    return renderPreviousEmploymentSection();
                case 4:
                    return renderMilitaryServiceSection();
                case 5:
                    return renderSkillsSection();
                case 6:
                    return renderDisclaimerSection(history);
                default:
                    return 'Unknown step';
            }
        };

        return (
            <div className="main-stepper-container">
                <header className="Header">Application Form</header>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-2">
                            <div className="Stepper-wrapper p-3 ">
                                <Stepper activeStep={activeStep} orientation="vertical" className="main-stepper-nav">
                                    {steps.map((label, index) => {
                                        return (
                                            <Step key={label}>
                                                <StepLabel className={classes.stepper}>{label}</StepLabel>
                                                <StepContent>
                                                    <Typography
                                                        variant="caption">{index === 0 ? 'Required' : 'Optional'}</Typography>
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
                        <div className="col-md-10">
                            <Typography className="">
                                <Route
                                    render={({ history }) => (
                                        <form
                                            className="ApplyForm apply-form"
                                            onSubmit={(e) => {
                                                // To cancel the default submit event
                                                e.preventDefault();
                                                // Call mutation to create a application
                                                if (this.state.applicationId === null) {
                                                    this.insertApplicationInformation(history);
                                                } else {
                                                    this.updateApplicationInformation();
                                                }
                                            }}
                                        >
                                            {getStepContent(this.state.activeStep, history)}
                                        </form>
                                    )}
                                />
                            </Typography>

                        </div>
                    </div>
                </div>

            </div>
        );
    }

}

VerticalLinearStepper.propTypes = {
    classes: PropTypes.object
};

export default withStyles(styles)(withApollo(withGlobalContent(VerticalLinearStepper)));

