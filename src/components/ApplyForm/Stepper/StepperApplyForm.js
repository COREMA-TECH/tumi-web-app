import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ApplyForm from "../ApplyForm";
import './index.css';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import CircularProgressLoading from "../../material-ui/CircularProgressLoading";
import InputRange from "../ui/InputRange/InputRange";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import studyTypes from "../data/studyTypes";
import InputMask from "react-input-mask";
import languageLevelsJSON from "../data/languagesLevels";
import InputRangeDisabled from "../ui/InputRange/InputRangeDisabled";
import {GET_LANGUAGES_QUERY} from '../Queries.js';
import withApollo from "react-apollo/withApollo";

const uuidv4 = require('uuid/v4');

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex'
    },
    button: {
        marginTop: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        backgroundColor: '#41afd7',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#3d93b9'
        }
    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
    stepper: {
        color: '#41afd7'
    }
});

function getSteps() {
    return ['Applicant Information', 'Languages', 'Education', 'Military Service', 'Previous Employment', 'Skills', 'Disclaimer'];
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

    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    // To get a list of languages from API
    getLanguagesList = () => {
        this.props.client
            .query({
                query: GET_LANGUAGES_QUERY
            })
            .then(({data}) => {
                this.setState({
                    languagesLoaded: data.getcatalogitem
                })
            })
            .catch();
    };

    componentWillMount() {
        // Get languages list from catalogs
        this.getLanguagesList();
    }

    render() {
        const {classes} = this.props;
        const steps = getSteps();
        const {activeStep} = this.state;

        let renderInsertDialogLoading = () => (
            <Dialog
                open={this.state.insertDialogLoading}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Sending Application</DialogTitle>
                <DialogContent>
                    <div className="center-progress-dialog">
                        <CircularProgressLoading/>
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
                    <h1 className="title-skill-dialog" id="form-dialog-title" style={{textAlign: 'center'}}>
                        New Skill
                    </h1>
                    <br/>
                    <DialogContent style={{width: '450px'}}>
                        <div className="row">
                            <div className="col-12">
                                <span className="primary">Skill Name</span>
                                <br/>
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
                        <br/>
                        <div className="row">
                            <div className="col-12">
                                <span className="primary">Skill Level</span>
                                <br/>
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
                        <br/>
                        <br/>
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
                            <div className="col-2">
                                <span>Field of Study</span>
                            </div>
                            <div className="col-2">
                                <span>Institution</span>
                            </div>
                            <div className="col-2">
                                <span>Address</span>
                            </div>
                            <div className="col-2">
                                <span>Start Date</span>
                            </div>
                            <div className="col-1">
                                <span>End Date</span>
                            </div>
                            <div className="col-1">
                                <span>Graduated</span>
                            </div>
                            <div className="col-1">
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
                            <div className="col-2">
                                <span>{schoolItem.schoolType}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.educationName}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.educationAddress}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.startDate}</span>
                            </div>
                            <div className="col-1">
                                <span>{schoolItem.endDate}</span>
                            </div>
                            <div className="col-1">
                                <span>{schoolItem.graduated ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="col-1">
                                <span>
                                    {
                                        studyTypes.map(item => {
                                            if (item.Id == schoolItem.degree) {
                                                return item.Name + "";
                                            }
                                        })
                                    }
                                </span>
                            </div>
                            <div className="col-1">
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
                <hr className="separator"/>
                <div className="row">
                    <div className="col-3">
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
                            <span className="check-icon"></span>
                        </div>
                    </div>
                    <div className="col-3">
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
                            <span className="check-icon"></span>
                        </div>
                    </div>
                    <div className="col-6">
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
                            <span className="check-icon"></span>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
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
                            <span className="check-icon"></span>
                        </div>
                    </div>
                    <div className="col-3">
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
                            <span className="check-icon"></span>
                        </div>
                    </div>
                    <div className="col-2">
                        <label className="primary">Graduated</label> <br/>
                        <input
                            onChange={(e) => {
                                this.setState({
                                    graduated: document.getElementById('graduated').checked
                                });
                            }}
                            form="education-form" type="checkbox" value="graduated" name="graduated" id="graduated"
                        />
                    </div>
                    <div className="col-4">
                        <label className="primary">Degree</label>
                        {
                            this.state.graduated ? (
                                <div className="input-container--validated">
                                    <select form="education-form" name="degree" id="degree"
                                            className="form-control">
                                        <option value="">Select an option</option>
                                        {studyTypes.map((item) => <option value={item.Id}>{item.Name}</option>)}
                                    </select>
                                </div>

                            ) : (
                                <div className="input-container--validated">
                                    <select form="education-form" name="degree" id="degree" disabled
                                            className="form-control">
                                        <option value="">Select an option</option>
                                        {studyTypes.map((item) => <option value={item.Id}>{item.Name}</option>)}
                                    </select>
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
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
                    <div className="col-6">
                        <span className="primary"> Branch</span>
                        <input
                            name="militaryBranch"
                            type="text"
                            className="form-control"
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                        <span className="check-icon"/>
                    </div>
                    <div className="col-6">
                        <span className="primary"> Rank at Discharge</span>
                        <input
                            name="militaryRankDischarge"
                            type="text"
                            className="form-control"
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                        <span className="check-icon"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
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
                    <div className="col-3">
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
                    <div className="col-6">
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
                        <span className="check-icon"/>
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
                            })
                        }
                    );
                }}
            >
                <h4 className="ApplyBlock-title">Previous Employment</h4>
                <div className="row">
                    {this.state.previousEmployment.length > 0 ? (
                        <div key={uuidv4()} className="skills-container skills-container--header">
                            <div className="row">
                                <div className="col-2">
                                    <span>Company</span>
                                </div>
                                <div className="col-2">
                                    <span>Address</span>
                                </div>
                                <div className="col-2">
                                    <span>Job Title</span>
                                </div>
                                <div className="col-1">
                                    <span>Phone</span>
                                </div>
                                <div className="col-1">
                                    <span>Supervisor</span>
                                </div>
                                <div className="col-1">
                                    <span>Pay Rate</span>
                                </div>
                                <div className="col-1">
                                    <span>Start Date</span>
                                </div>
                                <div className="col-1">
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
                                <div className="col-2">
                                    <span>{employmentItem.companyName}</span>
                                </div>
                                <div className="col-2">
                                    <span>{employmentItem.address}</span>
                                </div>
                                <div className="col-2">
                                    <span>{employmentItem.jobTitle}</span>
                                </div>
                                <div className="col-1">
                                    <span>{employmentItem.phone}</span>
                                </div>
                                <div className="col-1">
                                    <span>{employmentItem.supervisor}</span>
                                </div>
                                <div className="col-1">
                                    <span>{employmentItem.payRate}</span>
                                </div>
                                <div className="col-1">
                                    <span>{employmentItem.startDate}</span>
                                </div>
                                <div className="col-1">
                                    <span>{employmentItem.endDate}</span>
                                </div>
                                <div className="col-1">
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
                    <hr className="separator"/>
                </div>
                <div className="row">
                    <div className="col-8">
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
                            <span className="check-icon"/>
                        </div>
                    </div>
                    <div className="col-4">
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
                            <span className="check-icon"/>
                        </div>
                    </div>
                    <div className="col-8">
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
                            <span className="check-icon"/>
                        </div>
                    </div>
                    <div className="col-4">
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
                            <span className="check-icon"/>
                        </div>
                    </div>
                    <div className="col-8">
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
                            <span className="check-icon"/>
                        </div>
                    </div>
                    <div className="col-4">
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
                            <span className="check-icon"/>
                        </div>
                    </div>
                    <div className="col-3">
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
                            <span className="check-icon"/>
                        </div>
                    </div>
                    <div className="col-3">
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
                            <span className="check-icon"/>
                        </div>
                    </div>
                    <div className="col-6">
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
                    <div className="col-12">
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
                            <div className="col-3">
                                <span>Language Name</span>
                            </div>
                            <div className="col-4">
                                <span>Conversation</span>
                            </div>
                            <div className="col-4">
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
                            <div className="col-3">
                                <span>
                                    {this.state.languagesLoaded.map((item) => {

                                        if (item.Id == languageItem.language) {
                                            return item.Name.trim();
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="col-4">
                                <span>
                                    {languageLevelsJSON.map((item) => {
                                        if (item.Id == languageItem.conversation) {
                                            return item.Name;
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="col-4">
                                <span>
                                    {languageLevelsJSON.map((item) => {
                                        if (item.Id == languageItem.writing) {
                                            return item.Name;
                                        }
                                    })}
                                </span>
                            </div>
                            <div className="col-1">
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
                <br/>
                <br/>
                {this.state.languages.length > 0 ? <hr/> : ''}
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
                    <div className="col-4">
                        <span className="primary"> Languages</span>
                        <select
                            id="nameLanguage"
                            name="languageName"
                            required
                            className="form-control"
                            form="form-language">
                            <option value="">Select an option</option>
                            {this.state.languagesLoaded.map((item) => (
                                <option value={item.Id}>{item.Name}</option>
                            ))}
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
                        <span className="check-icon"/>
                    </div>
                    <div className="col-3">
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
                        <span className="check-icon"/>
                    </div>
                    <div className="col-3">
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
                        <span className="check-icon"/>
                    </div>
                    <div className="col-2">
                        <br/>
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
                    <div className="col-9"/>
                    <div className="col-3">
                        <Button onClick={this.handleClickOpen} className="save-skill-button">
                            New Skill
                        </Button>
                        {renderSkillsDialog()}
                    </div>
                    <div className="col-12">
                        {this.state.skills.length > 0 ? (
                            <div className="skills-container skills-container--header">
                                <div className="row">
                                    <div className="col-6">
                                        <span>Skill Name</span>
                                    </div>
                                    <div className="col-6">
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
                                    <div className="col-6">
                                        <span>{skillItem.description}</span>
                                    </div>
                                    <div className="col-5">
                                        <InputRangeDisabled percent={skillItem.level}/>
                                    </div>
                                    <div className="col-1">
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

        let getStepContent = (step) => {
            switch (step) {
                case 0:
                    return <ApplyForm/>;
                case 1:
                    return renderlanguagesSection();
                case 2:
                    return renderEducationSection();
                case 3:
                    return renderMilitaryServiceSection();
                case 4:
                    return renderPreviousEmploymentSection();
                case 5:
                    return renderSkillsSection();
                default:
                    return 'Unknown step';
            }
        };

        return (
            <div className="main-stepper-container">
                <Stepper activeStep={activeStep} orientation="vertical" className="main-stepper-nav">
                    {steps.map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepLabel className={classes.stepper}>
                                        {label}
                                </StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>
                {activeStep === steps.length && (
                    <Paper square elevation={0} className={classes.resetContainer}>
                        <Typography>All steps completed - you&quot;re finished</Typography>
                        <Button onClick={this.handleReset} className={classes.button}>
                            Reset
                        </Button>
                    </Paper>
                )}

                <Typography className="main-stepper-content">
                    {getStepContent(this.state.activeStep)}
                    <div className="bottom-container-stepper">
                        <Button
                            disabled={activeStep === 0}
                            onClick={this.handleBack}
                            className={classes.button}
                        >
                            Back
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleNext}
                            className={classes.button}
                        >
                            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                    </div>
                </Typography>
            </div>
        );
    }
}

VerticalLinearStepper.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(withApollo(VerticalLinearStepper));