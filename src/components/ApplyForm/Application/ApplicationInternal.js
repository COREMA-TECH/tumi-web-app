    import React, { Component } from 'react';
import './index.css';
import InputMask from 'react-input-mask';
import withApollo from 'react-apollo/withApollo';
import { GET_APPLICANT_IDEAL_JOBS, GET_APPLICATION_BY_ID, GET_POSITIONS_CATALOG, GET_POSITIONS_QUERY } from '../Queries';
import { RECREATE_IDEAL_JOB_LIST, UPDATE_APPLICATION, CREATE_APPLICATION } from '../Mutations';
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
import InputForm from 'ui-components/InputForm/InputForm';

if (localStorage.getItem('languageForm') === undefined || localStorage.getItem('languageForm') == null) {
    localStorage.setItem('languageForm', 'en');
}

const applyTabs = require(`./languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const menuSpanish = require(`./languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`./languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const formSpanish = require(`./languagesJSON/${localStorage.getItem('languageForm')}/formSpanish`);

const KeyCodes = {
    comma: 188,
    enter: 13,
};

class ApplicationInternal extends Component {
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
            birthDay: '',
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
            optionHearTumi: '',
            nameReferences:'',
            EEOC:0,
            Exemptions:'',
            area:'',
            HireType:'',
            gender:'',
            marital:'',
            hireDate: '',
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
            openRestrictionsModal: false
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
    InsertUpdateApplicationInformation = (id) => {
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
                                isLead: id==0 ? false:this.state.isLead,
                                dateCreation: new Date().toISOString().substring(0, 10),
                                immediately: this.state.immediately,
                                optionHearTumi: this.state.optionHearTumi,
                                nameReferences:this.state.nameReferences,
                                eeoc:this.state.EEOC,
                                exemptions:this.state.Exemptions,
                                area:this.state.area,
                                hireType:this.state.HireType,
                                gender:this.state.gender,
                                marital:this.state.marital
                            }
                        }
                    })
                    .then(({ data }) => {
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
                            this.getApplicationById(this.props.applicationId);
                        });

                        this.props.handleOpenSnackbar('success', 'Successfully updated', 'bottom', 'right');
                    })
                    .catch((error) => {
                        console.log("App error ", error)
                        this.setState(() => ({ insertDialogLoading: false }));
                        if (error = 'Error: "GraphQL error: Validation error') {
                            this.setState({
                                socialSecurityNumber: ''
                            });
                            this.props.handleOpenSnackbar(
                                'error',
                                'Something went wrong!',
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
                                dateCreation:  applicantData.dateCreation,
                                immediately: applicantData.immediately,
                                optionHearTumi: applicantData.optionHearTumi,
                                nameReferences: applicantData.nameReferences,
                                EEOC:applicantData.eeoc,
                                Exemptions:applicantData.exemptions,
                                area:applicantData.area,
                                HireType:applicantData.hireType,
                                gender:applicantData.gender,
                                marital:applicantData.marital,
                                hireDate: applicantData.hireDate
                            }, _ => {
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
                    });
            }
        );
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
        //this.getApplicationById(this.props.applicationId);
        if (this.props.applicationId > 0) {

            this.getApplicationById(this.props.applicationId);
            if ((this.state.socialSecurityNumber || '').length === 0) {
                this.props.handleContract();
            }
        }

        if (this.props.applicationId == 0) {
            this.setState({
                editing: true
            });
        }

        
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.applicationId != this.props.applicationId) {
            this.setState({
                applicationId: nextProps.applicationId
            }, _ => {
                this.getApplicationById(this.props.applicationId);
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.editing !== nextProps.editing) {
            return true;
        }
    }

    submitForm = () => {
        if (!this.state.typeOfId) {  
                this.props.handleOpenSnackbar(
                    'warning',
                    'some fields are required',
                    'bottom',
                    'right'
                ); 
             }else{this.InsertUpdateApplicationInformation(this.props.applicationId);}
        
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

    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        //this.validateInvalidInput();
        const { tags, suggestions } = this.state;

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-6">
                
                        <div className="Apply-container--application">
                            <form
                                className="general-info-apply-form"
                                id="general-info-form"
                                autoComplete="off"
                                onSubmit={this.handleSubmit}
                            >
                                    <div className="applicant-card">
                                        <div className="applicant-card__header">
                                            <span className="applicant-card__title">{applyTabs[1].label}</span>
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
                                                <div className="col-md-12 form-section-1">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <span className="primary applicant-card__label skeleton">
                                                                * {formSpanish[12].label}
                                                            </span>
                                                            <input
                                                                onChange={this.handleInputChange}
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
                                                                * {formSpanish[33].label}
                                                                </span>
                                                                <select
                                                                    name="gender"
                                                                    id="gender"
                                                                    className="form-control"
                                                                    disabled={!this.state.editing}
                                                                    value={this.state.gender}
                                                                    onChange={this.handleInputChange}
                                                                >
                                                                    <option value="">Select an option</option>
                                                                    <option value="1">Male</option>
                                                                    <option value="2">Female</option>
                                                                </select>
                                                            </div>

                                                        <div className="col-md-6">
                                                            <span className="primary applicant-card__label skeleton">
                                                                {formSpanish[29].label}
                                                            </span>
                                                            <select
                                                                name="EEOC"
                                                                id="EEOC"
                                                                className="form-control"
                                                                disabled={!this.state.editing}
                                                                value={this.state.EEOC}
                                                                onChange={this.handleInputChange}
                                                            >
                                                                <option value="">Select an option</option>
                                                                <option value="1">White</option>
                                                                <option value="2">Black or African American</option>
                                                                <option value="3">Hispanic or Latino</option>
                                                                <option value="4">Asian</option>
                                                                <option value="5">American Indian or Alaska Native</option>
                                                                <option value="6">Native Hawaiian or Other Pacific Islander</option>
                                                                <option value="7">Two or more races</option>
                                                            </select>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <span className="primary applicant-card__label skeleton">
                                                            * {formSpanish[34].label}
                                                            </span>
                                                            <select
                                                                name="marital"
                                                                id="marital"
                                                                className="form-control"
                                                                disabled={!this.state.editing}
                                                                onChange={this.handleInputChange}
                                                                value={this.state.marital}
                                                            >
                                                                <option value="">Select an option</option>
                                                                <option value="1">Single</option>
                                                                <option value="2">Married</option>
                                                            </select>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <span className="primary applicant-card__label skeleton">
                                                                {formSpanish[30].label}
                                                            </span>
                                                            <input
                                                                type="number"
                                                                step="0.01"
                                                                onChange={this.handleInputChange}
                                                                value={this.state.Exemptions}
                                                                name="Exemptions"
                                                                className="form-control"
                                                                disabled={!this.state.editing}
                                                                maxLength="50"
                                                            
                                                            />
                                                        </div>

                                                        

                                                        <div className="col-md-6">
                                                            <span className="primary applicant-card__label skeleton">
                                                                {formSpanish[31].label}
                                                            </span>
                                                            <InputForm
                                                                change={(event) => {
                                                                    this.setState({
                                                                        area: event
                                                                    });
                                                                }}
                                                                value={this.state.area}
                                                                name="area"
                                                                className="form-control"
                                                                disabled={!this.state.editing}
                                                                maxLength="50"
                                                            />
                                                        </div>
                                                            


                                                        <div className="col-md-6">
                                                            <span className="primary applicant-card__label skeleton">
                                                                {formSpanish[32].label}
                                                            </span>
                                                            <select
                                                                name="HireType"
                                                                id="HireType"
                                                                className="form-control"
                                                                disabled={!this.state.editing}
                                                                value={this.state.HireType}
                                                                onChange={this.handleInputChange}
                                                            >
                                                                <option value="">Select an option</option>
                                                                <option value="1">New hire</option>
                                                                <option value="2">Rehire</option>
                                                                <option value="3">Transfer</option>
                                                                <option value="4">Promotion</option>
                                                            </select>
                                                        </div>

                                                        <div className="col-md-6">
                                                            <span className="primary applicant-card__label skeleton">
                                                            * {formSpanish[14].label}
                                                            </span>
                                                            <select
                                                                name="typeOfId"
                                                                id="typeOfId"
                                                                className="form-control"
                                                                disabled={!this.state.editing}
                                                                value={this.state.typeOfId}
                                                                onChange={this.handleInputChange}
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
                                                                onChange={this.handleInputChange}
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
                            </form>
                            <ShiftRestrictionModal
                                openModal={this.state.openRestrictionsModal}
                                handleCloseModal={this.handleRestrictionModalClose}
                            />
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withApollo(withGlobalContent(withRouter(ApplicationInternal)));
