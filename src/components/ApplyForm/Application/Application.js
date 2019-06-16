import React, { Component } from 'react';
import './index.css';
import InputMask from 'react-input-mask';
import withApollo from 'react-apollo/withApollo';
import { GET_APPLICANT_IDEAL_JOBS, GET_APPLICATION_BY_ID, GET_POSITIONS_CATALOG, GET_POSITIONS_QUERY } from '../Queries';
import { RECREATE_IDEAL_JOB_LIST, UPDATE_APPLICATION, CREATE_APPLICATION, ADD_INDEPENDENT_CONTRACT } from '../Mutations';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import withGlobalContent from '../../Generic/Global';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import LocationForm from '../../ui-components/LocationForm'
import { withRouter } from "react-router-dom";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import ShiftRestrictionModal from './ShiftRestrictionModal';
import IndependentContractDialog from './IndependentContract/Modal';


if (localStorage.getItem('languageForm') === undefined || localStorage.getItem('languageForm') == null) {
    localStorage.setItem('languageForm', 'en');
}

const menuSpanish = require(`./languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`./languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const formSpanish = require(`./languagesJSON/${localStorage.getItem('languageForm')}/formSpanish`);

const KeyCodes = {
    comma: 188,
    enter: 13,
};

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
            state: 0,
            zipCode: '',
            homePhone: '',
            cellPhone: '',
            socialSecurityNumber: '',
            birthDay: Date.now(),
            car: false,
            typeOfId: '',
            expireDateId: null,
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
            isLead: '',
            dateCreation: new Date().toISOString().substring(0, 10),
            immediately: 0,
            optionHearTumi: 0,
            nameReferences: '',

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


            // Validation
            homePhoneNumberValid: true,
            cellPhoneNumberValid: true,
            isCorrectCity: true,

            positionCatalog: [],
            positionCatalogTag: [],
            dataWorkOrder: [],


            openSSNDialog: false,
            //Open/Close schedule restrictions modal
            openRestrictionsModal: false,
            applicationIdForIndependent: 0,
            hasIndependentContract: false
        };
    }


    handleChangePositionTag = (positionsTags) => {
        this.setState({ positionsTags });
    };

    handleChange = (positionsTags) => {
        this.setState({ positionsTags });
    };

    handleRestrictionModalClose = () => {
        this.setState({ openRestrictionsModal: false });
    };




    /**<
     * To update a application by id
     */
    InsertUpdateApplicationInformation = (id, saveIndependentContract = () => { }) => {
        this.setState(
            {
                insertDialogLoading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: id == 0 ? CREATE_APPLICATION : UPDATE_APPLICATION,
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
                                birthDay: Date.now(),
                                car: this.state.car,
                                typeOfId: parseInt(this.state.typeOfId),
                                expireDateId: this.state.expireDateId,
                                emailAddress: this.state.emailAddress,
                                positionApplyingFor: parseInt(this.state.positionApplyingFor),
                                dateAvailable: this.state.immediately ? Date.now() : this.state.dateAvailable,
                                scheduleRestrictions: this.state.scheduleRestrictions,
                                scheduleExplain: this.state.scheduleExplain,
                                convicted: this.state.convicted,
                                convictedExplain: this.state.convictedExplain,
                                comment: this.state.comment,
                                idealJob: this.state.idealJob,
                                isLead: id == 0 ? false : this.state.isLead,
                                dateCreation: new Date().toISOString().substring(0, 10),
                                immediately: this.state.immediately,
                                optionHearTumi: this.state.optionHearTumi,
                                nameReferences: this.state.nameReferences
                            },
                            codeuser: localStorage.getItem('LoginId'),
                            nameUser: localStorage.getItem('FullName')
                        }
                    })
                    .then(({ data }) => {
                        let applicationId;
                        if (id == 0) {
                            this.props.setApplicantId(data.addApplication.id);
                            applicationId = data.addApplication.id;
                        } else 
                            applicationId = data.updateApplication.id;
                        this.setState({
                            editing: false,
                            insertDialogLoading: false
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
                            saveIndependentContract(applicationId)
                        });

                        this.props.handleOpenSnackbar('success', 'Successfully updated', 'bottom', 'right');
                    })
                    .catch((error) => {
                        this.setState(() => ({ insertDialogLoading: false }));
                        if (error = 'Error: "GraphQL error: Validation error') {
                            this.props.handleOpenSnackbar(
                                'error',
                                'The record could not be saved. Could some field be missing',
                                'bottom',
                                'right'
                            );
                        } else {
                            this.props.handleOpenSnackbar(
                                'error',
                                'Error to update applicant information. Please, try again!',
                                'bottom',
                                'right'
                            );
                        }

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
            .then(({ data }) => {
            })
            .catch(error => {
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
                    .then(({ data }) => {
                        let applicantData = data.applications[0];
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
                                homePhoneNumberValid: this.state.homePhone.length > 0,
                                cellPhone: applicantData.cellPhone,
                                cellPhoneNumberValid: applicantData.cellPhone.length > 0,
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
                                idealJob: applicantData.idealJob,
                                isLead: applicantData.isLead,
                                dateCreation: applicantData.dateCreation,
                                immediately: applicantData.immediately,
                                optionHearTumi: applicantData.optionHearTumi,
                                nameReferences: applicantData.nameReferences,
                                hasIndependentContract: applicantData.independentContract != null
                            },
                            () => {
                                this.getIdealJobsByApplicationId();
                                this.getPositionCatalog();


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
                dataAPI.map(item => {
                    this.setState(prevState => ({
                        positionsTags: [...prevState.positionsTags, {
                            value: item.id,
                            label: item.description
                        }]
                    }))
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

    // get ideal jobs
    getPositionCatalog = () => {
        this.props.client
            .query({
                query: GET_POSITIONS_CATALOG,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                let dataAPI = data.getcatalogitem;
                dataAPI.map(item => {
                    this.setState(prevState => ({
                        positionCatalogTag: [...prevState.positionCatalogTag, {
                            value: item.Id, label: item.Description.trim(), key: item.Id
                        }]
                    }))
                });

                this.removeSkeletonAnimation();
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

    getPositions = () => {
        this.props.client
            .query({
                query: GET_POSITIONS_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    positionApplyingFor: data.workOrder
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

    componentWillMount() {
        //this.getApplicationById(this.props.applicationId);
        if (this.props.applicationId > 0) {

            this.getApplicationById(this.props.applicationId);
            if (this.state.socialSecurityNumber.length === 0) {
                this.props.handleContract();
            }
        }

        if (this.props.applicationId == 0) {
            this.setState({
                editing: true
            });
        }
        this.getPositions();
        this.getPositionCatalog();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.editing !== nextProps.editing) {
            return true;
        }
    }

    updateCity = (city) => {
        this.setState(() => { return { city } });
    };
    updateState = (state) => {
        this.setState(() => { return { state } });
    };

    updateZipCode = (zipCode) => {
        this.setState(() => { return { zipCode } });
    }

    submitForm = () => {
        if (!this.state.zipCode.trim().replace("-", ""))
            this.props.handleOpenSnackbar(
                'warning',
                'ZipCode needed!',
                'bottom',
                'right'
            );
        else if (!this.state.city)
            this.props.handleOpenSnackbar(
                'warning',
                'City needed!',
                'bottom',
                'right'
            );
        else if (!this.state.state)
            this.props.handleOpenSnackbar(
                'warning',
                'State needed!',
                'bottom',
                'right'
            );
        else {
            if (this.state.homePhoneNumberValid || this.state.cellPhoneNumberValid) {
                let socialSecurityNumber = this.state.socialSecurityNumber || '';
                if (!this.state.hasIndependentContract && socialSecurityNumber.length === 0)
                    this.setState(() => ({
                        openSSNDialog: true
                    }))
                else this.InsertUpdateApplicationInformation(this.props.applicationId);
            } else {
                this.props.handleOpenSnackbar(
                    'warning',
                    'Complete all the fields and try again!',
                    'bottom',
                    'right'
                );
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.submitForm()

    }

    updateSearchingZipCodeProgress = (searchigZipcode) => {
        this.setState(() => {
            return { searchigZipcode }
        })
    }

    handleCloseSSNDialog = () => {
        this.setState({
            openSSNDialog: false
        })
    };

    handleVisivilityIndependentContractDialog = (status) => (e) => {

        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        this.setState({
            openIndependentContractDialog: status
        })
    };

    saveIndependentContract = (id) => {
        let html = document.getElementById('independenContractContainer');

        if (!html)
            this.props.handleOpenSnackbar(
                'error',
                'This document can not be processed , please try again!',
                'bottom',
                'right'
            );
        else {
            let inputs = html.getElementsByTagName('input');

            //Disable elements before save html into database
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
            }

            //Insert record into database
            this.props.client
                .mutate({
                    mutation: ADD_INDEPENDENT_CONTRACT,
                    variables: {
                        html: html.outerHTML,
                        ApplicantId: id
                    }
                })
                .then(({ data }) => {
                    this.props.handleOpenSnackbar(
                        'success',
                        'Created successfully',
                        'bottom',
                        'right'
                    );
                    this.handleVisivilityIndependentContractDialog(false)();
                    this.getApplicationById(id);
                })
                .catch(error => {
                    // If there's an error show a snackbar with a error message
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to save Independet Contract. Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        }
    }

    onHanldeSave = (hasSign) => {
        if (hasSign)
            this.InsertUpdateApplicationInformation(this.props.applicationId, this.saveIndependentContract);
        else this.props.handleOpenSnackbar('warning', 'You must sign the document to continue!', 'bottom', 'right');
    }
    render() {
        //this.validateInvalidInput();
        const { tags, suggestions } = this.state;

        let renderSSNDialog = () => (
            <Dialog maxWidth="md" open={this.state.openSSNDialog} onClose={this.handleCloseSSNDialog}>
                <DialogTitle>
                    <h5 className="modal-title">INDEPENDENT CONTRACT RECOGNITION</h5>
                </DialogTitle>
                <DialogContent>
                    You must sign an Independent Contract Recognition
                </DialogContent>
                <DialogActions>
                    <div className="applicant-card__footer">
                        <button
                            className="applicant-card__cancel-button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.handleCloseSSNDialog();
                            }}
                        >
                            {spanishActions[2].label}
                        </button>
                        <button type="submit"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                this.setState(() => ({ openIndependentContractDialog: true, openSSNDialog: false }));
                            }}
                            className="applicant-card__save-button">
                            Accept
                        </button>
                    </div>
                </DialogActions>
            </Dialog>
        );

        return (
            <div className="Apply-container--application">
                {
                    renderSSNDialog()
                }
                <IndependentContractDialog
                    open={this.state.openIndependentContractDialog}
                    handleVisibility={this.handleVisivilityIndependentContractDialog}
                    handleOpenSnackbar={this.props.handleOpenSnackbar}
                    onHandleSave={this.onHanldeSave}
                />

                <form
                    className="general-info-apply-form"
                    id="general-info-form"
                    autoComplete="off"
                    onSubmit={this.handleSubmit}
                >
                    <div className="">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{menuSpanish[0].label}</span>
                                {!this.state.editing &&
                                    <button
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
                                                stateTitle={`* ${formSpanish[6].label}`}
                                                cityTitle={`* ${formSpanish[7].label}`}
                                                cssTitle={"text-primary-application"}
                                                placeholder="99999-99999"
                                                mask="99999-99999"
                                                requiredZipCode={true}
                                                requiredCity={true}
                                                requiredState={true}
                                                updateSearchingZipCodeProgress={this.updateSearchingZipCodeProgress} />

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
                                                    className={'form-control'}
                                                    disabled={!this.state.editing}
                                                    onChange={(event) => {
                                                        this.setState({
                                                            homePhone: event.target.value
                                                        });
                                                    }}
                                                    placeholder="+(___) ___-____"
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
                                                    className={
                                                        this.state.cellPhoneNumberValid ? 'form-control' : 'form-control _invalid'
                                                    }
                                                    disabled={!this.state.editing}
                                                    onChange={(event) => {
                                                        this.setState({
                                                            cellPhone: event.target.value
                                                        });
                                                    }}
                                                    placeholder="+(___) ___-____"
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
                                                    onChange={(event) => {
                                                        this.setState({
                                                            socialSecurityNumber: event.target.value
                                                        });
                                                    }}
                                                    value={this.state.socialSecurityNumber}
                                                    placeholder="___-__-____"
                                                    minLength="11"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-6 form-section-2">
                                        <div className="row">
                                            {/*<div className="col-md-6">
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
                                                </div>*/}
                                            <div className="col-md-6">
                                                <span className="primary applicant-card__label skeleton">
                                                    * {formSpanish[25].label}
                                                </span>
                                                <input
                                                    onChange={(event) => {
                                                        this.setState({
                                                            dateCreation: event.target.value
                                                        });
                                                    }}
                                                    value={this.state.dateCreation}
                                                    name="dateCreation"
                                                    type="date"
                                                    className="form-control"
                                                    disabled={true}
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
                                                        <span className="onoffswitch-inner" />
                                                        <span className="onoffswitch-switch" />
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
                                                    {formSpanish[27].label}
                                                </span>
                                                <select
                                                    name="optionHearTumi"
                                                    id="optionHearTumi"
                                                    className="form-control"
                                                    disabled={!this.state.editing}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            optionHearTumi: e.target.value
                                                        });
                                                    }}
                                                >
                                                    <option value="">Select an option</option>
                                                    <option value="1">facebook</option>
                                                    <option value="2">newspaper</option>
                                                    <option value="3">employee</option>
                                                    <option value="4">recruiter</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 ">
                                                <span className="primary applicant-card__label skeleton">
                                                    {formSpanish[28].label}
                                                </span>
                                                <input
                                                    onChange={(event) => {
                                                        this.setState({
                                                            nameReferences: event.target.value
                                                        });
                                                    }}
                                                    value={this.state.nameReferences}
                                                    name="nameReferences"
                                                    type="text"
                                                    className="form-control"

                                                    disabled={!this.state.editing || (this.state.optionHearTumi == 3 ? false : (this.state.optionHearTumi == 4 ? false : true))}
                                                    min="0"
                                                    maxLength="50"
                                                    minLength="3"
                                                />
                                            </div>
                                            {/* <div className="col-md-6">
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
                                                    {formSpanish[15].label}
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
                                               
                                             <Select
                                                    isDisabled={!this.state.editing}
                                                    options={this.state.positionCatalogTag}
                                                    value={this.state.positionsTags}
                                                    onChange={this.handleChange}
                                                    closeMenuOnSelect={false}
                                                    components={makeAnimated()}
                                                    isMulti
                                                />
                                            
                                            </div>
                                       */}
                                            <div className="col-md-12">
                                                <span className="primary applicant-card__label skeleton">
                                                    {formSpanish[17].label}
                                                </span>
                                                <select
                                                    name="positionApply"
                                                    id="positionApply"
                                                    onChange={(event) => {
                                                        this.setState({
                                                            // Fixme: repair this
                                                            positionApplyingFor: event.target.value
                                                        });
                                                    }}
                                                    value={this.state.positionApplyingFor}
                                                    className="form-control"
                                                    disabled={!this.state.editing}
                                                >
                                                    <option value="">Select a position</option>
                                                    <option value="0">Open Position</option>
                                                    {this.state.dataWorkOrder.map((item) => (
                                                        <option
                                                            value={item.id} key={item.id}>{item.position.Position} ({item.BusinessCompany.Code.trim()})</option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div className="col-md-6">
                                                <span className="primary applicant-card__label skeleton">
                                                    {formSpanish[26].label}
                                                </span>
                                                <div className="onoffswitch">
                                                    <input
                                                        id="immediately"
                                                        onChange={(event) => {
                                                            this.setState({
                                                                immediately: event.target.checked
                                                            });
                                                        }}
                                                        checked={this.state.immediately}
                                                        value={this.state.immediately}
                                                        name="immediately"
                                                        type="checkbox"
                                                        disabled={!this.state.editing}
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="10"
                                                        className="onoffswitch-checkbox"
                                                    />
                                                    <label className="onoffswitch-label" htmlFor="immediately">
                                                        <span className="onoffswitch-inner" />
                                                        <span className="onoffswitch-switch" />
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="col-md-6">
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
                                                    disabled={!this.state.editing || this.state.immediately}
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
                                                                    scheduleRestrictions: event.target.checked,
                                                                    openRestrictionsModal: event.target.checked
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
                                                        <span className="onoffswitch-inner" />
                                                        <span className="onoffswitch-switch" />
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
                                                        <span className="onoffswitch-inner" />
                                                        <span className="onoffswitch-switch" />
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
                                    <button type="submit" className="applicant-card__save-button" disabled={this.state.searchigZipcode || this.state.insertDialogLoading}>
                                        {spanishActions[4].label}
                                        {this.state.insertDialogLoading && <i class="fas fa-spinner fa-spin ml-1" />}
                                    </button>
                                </div>
                            ) : (
                                    ''
                                )}
                        </div>
                    </div>
                </form>
                <ShiftRestrictionModal
                    openModal={this.state.openRestrictionsModal}
                    handleCloseModal={this.handleRestrictionModalClose}
                />
            </div >
        );
    }
}

export default withApollo(withGlobalContent(withRouter(Application)));
