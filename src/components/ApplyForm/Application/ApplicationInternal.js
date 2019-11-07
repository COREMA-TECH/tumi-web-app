import React, { Component } from 'react';
import './index.css';
import withApollo from 'react-apollo/withApollo';
import { GET_APPLICATION_BY_ID, } from '../Queries';
import { UPDATE_INTERNAL_APPLICATION } from '../Mutations';
import withGlobalContent from '../../Generic/Global';
import 'react-tagsinput/react-tagsinput.css'; // If using WebPack and style-loader.
import { withRouter } from "react-router-dom";
import InputForm from 'ui-components/InputForm/InputForm';
import Skills from "./skills/Skills";
import DatePicker from "react-datepicker";


if (!localStorage.getItem('languageForm')) {
	localStorage.setItem('languageForm', 'en');
}

const applyTabs = require(`./languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const spanishActions = require(`./languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const formSpanish = require(`./languagesJSON/${localStorage.getItem('languageForm')}/formSpanish`);


class ApplicationInternal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            insertDialogLoading: false,
            // Application id property state is used to save languages, education, mulitary services, skills
            applicationId: null,
            // Editing state properties - To edit general info
            editing: false,
            loading: false,
            birthDay: null,
            gender: null,
            EEOC: 0,
            marital: null,
            Exemptions: '',
            area: '',
            HireType: '',
            typeOfId: null,
            expireDateId: null,
            hireDate: null,
            startDate: null,
            employeeId: null,
            hasEmployee: false,

            numberId: null,
            employmentType: null,
            comment: null
        };
    }


    /**<
     * To update a application by id
     */
    updateApplication = (id) => {
        this.setState(
            {
                insertDialogLoading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_INTERNAL_APPLICATION,
                        variables: {
                            codeuser: localStorage.getItem('LoginId'),
                            nameUser: localStorage.getItem('FullName'),
                            id: this.state.employeeId,
                            hireDate: this.state.hireDate || null,
                            startDate: this.state.startDate || null,
                            ApplicationId: id,
                            application: {
                                id: id,
                                birthDay: this.state.birthDay || null,
                                gender: this.state.gender,
                                eeoc: this.state.EEOC,
                                marital: this.state.marital,
                                exemptions: this.state.Exemptions,
                                area: this.state.area,
                                hireType: this.state.HireType,
                                typeOfId: this.state.typeOfId,
                                expireDateId: this.state.expireDateId || null,
                                numberId: this.state.numberId || null,
                                employmentType: this.state.employmentType || null,
                                comment: this.state.comment || null
                            }
                        }
                    })
                    .then(({ data }) => {
                        this.setState({
                            editing: false,
                            insertDialogLoading: false
                        }, () => {
                            this.getApplicationById(this.props.applicationId);
                        });

                        this.props.handleOpenSnackbar('success', 'Successfully updated', 'bottom', 'right');
                    })
                    .catch((error) => {
                        this.setState(() => ({ insertDialogLoading: false }));
                        if (error = 'Error: "GraphQL error: Validation error') {
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
                                birthDay:
                                    applicantData.birthDay ? applicantData.birthDay.substring(0, 10) : null,
                                gender: applicantData.gender,
                                EEOC: applicantData.eeoc,
                                marital: applicantData.marital,
                                Exemptions: applicantData.exemptions,
                                area: applicantData.area,
                                HireType: applicantData.hireType,
                                typeOfId: applicantData.typeOfId,
                                expireDateId:
                                    applicantData.expireDateId !== null
                                        ? applicantData.expireDateId.substring(0, 10)
                                        : applicantData.expireDateId,
                                hasEmployee: applicantData.employee ? (applicantData.employee.Employees ? true : false) : false,
                                numberId: applicantData.numberId,
                                employmentType: applicantData.employmentType,
                                comment: applicantData.comment,
                                editing: false
                            }, _ => {
                                if (this.state.hasEmployee) {
                                    let employee = applicantData.employee.Employees;
                                    this.setState(() => ({
                                        hireDate: employee.hireDate,
                                        startDate: employee.startDate,
                                        employeeId: employee.id
                                    }))
                                }
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
        this.updateApplication(this.props.applicationId);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.submitForm();
    }


    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleDatePickerChange = (name, date) => {
        this.setState({
            [name]: date
        });
    }

    render() {

        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-12">
                        <div className="Apply-container--application">
                            <div className="applicant-card">
                                <div className="applicant-card__header">
                                    <span className="applicant-card__title">
                                        {applyTabs[1].label}
                                    </span>
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
                                        <div className="col-12 col-md-6">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <span className="primary applicant-card__label skeleton">
                                                        {formSpanish[12].label}
                                                    </span>
                                                    <div class="input-group flex-nowrap">
                                                        <DatePicker
                                                            selected={this.state.birthDay}
                                                            onChange={(date) => this.handleDatePickerChange('birthDay', date)}
                                                            placeholderText={formSpanish[12].label}
                                                            name="birthDay"
                                                            id="birthDay"
                                                            disabled={!this.state.editing}
                                                        />
                                                        <div class="input-group-append">
                                                            <label class="input-group-text" id="addon-wrapping" for="birthDay">
                                                                <i class="far fa-calendar"></i>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <span className="primary applicant-card__label skeleton">
                                                        {formSpanish[34].label}
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
                                                        {formSpanish[33].label}
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
                                                        {formSpanish[14].label}
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
                                                        {formSpanish[39].label}
                                                    </span>
                                                    <input
                                                        onChange={this.handleInputChange}
                                                        value={this.state.numberId}
                                                        name="numberId"
                                                        type="text"
                                                        className="form-control"
                                                        disabled={!this.state.editing}
                                                    />
                                                </div>

                                                <div className="col-md-6">
                                                    <span className="primary applicant-card__label skeleton">
                                                        {formSpanish[15].label}
                                                    </span>
                                                    <div class="input-group flex-nowrap">
                                                        <DatePicker
                                                            selected={this.state.expireDateId}
                                                            onChange={(date) => this.handleDatePickerChange('expireDateId', date)}
                                                            placeholderText={formSpanish[15].label}
                                                            name="expireDateId"
                                                            id="expireDateId"
                                                            disabled={!this.state.editing}
                                                        />
                                                        <div class="input-group-append">
                                                            <label class="input-group-text" id="addon-wrapping" for="expireDateId">
                                                                <i class="far fa-calendar"></i>
                                                            </label>
                                                        </div>
                                                    </div>
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
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <form
                                                id="general-info-form"
                                                autoComplete="off"
                                                onSubmit={this.handleSubmit}
                                            >
                                                <div className="row">
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
                                                            <option value="1">New Hire</option>
                                                            <option value="2">Rehire</option>
                                                            <option value="3">Transfer</option>
                                                            <option value="4">Promotion</option>
                                                        </select>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <span className="primary applicant-card__label skeleton">
                                                            {formSpanish[37].label}
                                                        </span>
                                                        <select
                                                            name="employmentType"
                                                            id="employmentType"
                                                            className="form-control"
                                                            disabled={!this.state.editing}
                                                            value={this.state.employmentType}
                                                            onChange={this.handleInputChange}
                                                        >
                                                            <option value="">Select an option</option>
                                                            <option value="Part-Time">PT</option>
                                                            <option value="Full-Time">FT</option>
                                                        </select>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <span className="primary applicant-card__label skeleton">
                                                            {formSpanish[35].label}
                                                        </span>
                                                        <div class="input-group flex-nowrap">
                                                            <DatePicker
                                                                selected={this.state.hireDate}
                                                                onChange={(date) => this.handleDatePickerChange('hireDate', date)}
                                                                placeholderText={formSpanish[35].label}
                                                                name="hireDate"
                                                                id="hireDate"
                                                                disabled={!this.state.editing}
                                                            />
                                                            <div class="input-group-append">
                                                                <label class="input-group-text" id="addon-wrapping" for="hireDate">
                                                                    <i class="far fa-calendar"></i>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-12">
                                                        <span className="primary applicant-card__label skeleton">
                                                            {formSpanish[38].label}
                                                        </span>
                                                        <textarea
                                                            onChange={this.handleInputChange}
                                                            value={this.state.comment}
                                                            name="comment"
                                                            type="text"
                                                            rows="4"
                                                            style={{ resize: 'none' }}
                                                            className="form-control"
                                                            disabled={!this.state.editing}
                                                        />
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
                                                    ) : ('')}
                                                </div>
                                            </form>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="col-md-6">
                        <div className="Apply-container--application">
                        </div>
                    </div> */}
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="applicant-card">
                            <div className="card-body">
                                <div className="row">

                                </div>
                                <Skills applicationId={this.props.applicationId} />
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default withApollo(withGlobalContent(withRouter(ApplicationInternal)));
