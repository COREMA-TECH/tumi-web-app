import React, {Component} from 'react';
import {CREATE_APPLICATION} from "./Mutations";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import SelectNothingToDisplay from "../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay";
import Query from "react-apollo/Query";
import {GET_POSITIONS_QUERY, GET_STATES_QUERY} from "./Queries";
import './index.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputRange from "./ui/InputRange/InputRange";
import InputRangeDisabled from "./ui/InputRange/InputRangeDisabled";
import withApollo from "react-apollo/withApollo";
import studyTypes from "./data/studyTypes";

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
            emailAddress: '',
            positionApplyingFor: '',
            dateAvailable: '',
            scheduleRestrictions: '',
            scheduleExplain: '',
            convicted: '',
            convictedExplain: '',
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
            companyName: '',
            companyPhone: '',
            companyAddress: '',
            companySupervisor: '',
            companyJobTitle: '',
            companyPayRate: '',
            companyStartDate: '',
            companyEndDate: '',
            companyReasonForLeaving: '',

            percent: 50
        };
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    // To validate all the inputs and set a red border when the input is invalid
    validateInvalidInput = () => {
        if (document.addEventListener) {
            document.addEventListener('invalid', (e) => {
                e.target.className += ' invalid-apply-form';
            }, true);
        }
    };

    insertApplicationInformation = () => {
        this.props.client
            .mutate({
                mutation: CREATE_APPLICATION,
                variables: {
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
                    emailAddress: this.state.emailAddress,
                    positionApplyingFor: parseInt(this.state.positionApplyingFor),
                    dateAvailable: this.state.dateAvailable,
                    scheduleRestrictions: this.state.scheduleRestrictions,
                    scheduleExplain: this.state.scheduleExplain,
                    convicted: this.state.convicted,
                    convictedExplain: this.state.convictedExplain,
                    comment: this.state.comment,
                }
            })
    };


    render() {
        this.validateInvalidInput();

        // To render the Skills Dialog
        let renderSkillsDialog = () => (
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title"
            >
                <form autoComplete="off" id="skill-form" onSubmit={() => {
                    let item = {
                        description: document.getElementById('description').value,
                        level: this.state.percent
                    };

                    this.setState(prevState => ({
                        open: false,
                        skills: [...prevState.skills, item]
                    }), () => {
                        this.setState({
                            percent: 50
                        })
                    })
                }} className="apply-form">
                    <h1 className="title-skill-dialog" id="form-dialog-title" style={{textAlign: 'center'}}>New
                        Skill</h1>
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
                                <InputRange getPercentSkill={(percent) => {
                                    // update the percent skill
                                    this.setState({
                                        percent: percent
                                    })
                                }}/>
                            </div>
                        </div>
                        <br/><br/>
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

        // To render the Applicant Information Section
        let renderApplicantInformationSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Applicant Information</h4>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> First Name</span>
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
                            required min="0"
                            maxLength="50"
                            minLength="3"/>
                        <span></span>
                    </div>

                    <div className="col-3">
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
                                min="0" maxLength="50"
                                minLength="3"
                            />
                            <span></span>
                            <i className="optional"></i>
                        </div>
                    </div>

                    <div className="col-3">
                        <span className="primary"> Last Name</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    lastName: event.target.value
                                });
                            }}
                            value={this.state.lastName}
                            name="lastName" type="text" className="form-control" required min="0" maxLength="50"
                            minLength="3"/>
                        <span></span>
                    </div>

                    <div className="col-3">
                        <span className="primary"> Date</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    date: event.target.value
                                });
                            }}
                            value={this.state.date}
                            name="date" type="date" className="form-control" required min="0" maxLength="50"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <span className="primary"> Street Address</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    streetAddress: event.target.value
                                });
                            }}
                            value={this.state.streetAddress}
                            name="streetAddress" type="text" className="form-control" required min="0" maxLength="50"
                            minLength="5"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary">Apt Number</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    aptNumber: event.target.value
                                });
                            }}
                            value={this.state.aptNumber}
                            name="aptNumber" type="number" className="form-control" required min="0" maxLength="50"
                            minLength="5"/>
                        <span></span>
                        <div className="row">
                            <i className="optional"></i>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> State</span>
                        <Query query={GET_STATES_QUERY} variables={{parent: 6}}>
                            {({loading, error, data, refetch, networkStatus}) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress/>;
                                if (error) return <p>Error </p>;
                                if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                    return <select name="state" id="state" required
                                                   className="form-control">
                                        <option value="">Select a state</option>
                                        {
                                            data.getcatalogitem.map(item => (
                                                <option value={item.Id}>{item.Name}</option>
                                            ))
                                        }
                                    </select>
                                }
                                return <SelectNothingToDisplay/>
                            }}
                        </Query>
                    </div>
                    <div className="col-4">
                        <span className="primary"> City</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    city: event.target.value
                                });
                            }}
                            value={this.state.city}
                            name="city" type="text" className="form-control" required min="0" maxLength="10"
                            minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Zip Code</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    zipCode: event.target.value
                                });
                            }}
                            value={this.state.zipCode}
                            name="zipCode" type="number" className="form-control" required maxLength="5"
                            minLength="4" min="10000" max="99999"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Home Phone</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    homePhone: event.target.value
                                });
                            }}
                            value={this.state.homePhone}
                            name="homePhone" type="tel" className="form-control" min="999" maxLength="10"
                            minLength="10"/>
                        <span></span>
                    </div>

                    <div className="col-4">
                        <span className="primary"> Cell Phone</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    cellPhone: event.target.value
                                });
                            }}
                            value={this.state.cellPhone}
                            name="cellPhone" type="tel" className="form-control" required min="0" maxLength="10"
                            minLength="10"/>
                        <span></span>
                    </div>

                    <div className="col-4">
                        <span className="primary"> Social Security Number</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    socialSecurityNumber: event.target.value
                                });
                            }}
                            value={this.state.socialSecurityNumber}
                            name="socialSecurityNumber" type="number" className="form-control" required min="0"
                            maxLength="50" minLength="10"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <span className="primary"> Email Address</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    emailAddress: event.target.value
                                });
                            }}
                            value={this.state.emailAddress}
                            name="emailAddress" type="email" className="form-control" required min="0"
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" maxLength="50" minLength="8"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-6">
                        <span className="primary"> Position Applying for</span>
                        <Query query={GET_POSITIONS_QUERY}>
                            {({loading, error, data, refetch, networkStatus}) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress/>;
                                if (error) return <p>Error </p>;
                                if (data.getposition != null && data.getposition.length > 0) {
                                    return <select name="city" id="city" required
                                                   onChange={(event) => {
                                                       this.setState({
                                                           positionApplyingFor: event.target.value
                                                       });
                                                   }}
                                                   className="form-control">
                                        <option value="">Select a position</option>
                                        {
                                            data.getposition.map(item => (
                                                <option value={item.Id}>{item.Position}</option>
                                            ))
                                        }
                                    </select>

                                }
                                return <SelectNothingToDisplay/>
                            }}
                        </Query>
                    </div>
                    <div className="col-6">
                        <span className="primary"> Date Available</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    dateAvailable: event.target.value
                                });
                            }}
                            value={this.state.dateAvailable}
                            name="dateAvailable" type="date" className="form-control" required min="0"
                            maxLength="50"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Do you have any schedule restrictions? </span>
                        <div className="col-12">
                            <input
                                onChange={(event) => {
                                    this.setState({
                                        scheduleRestrictions: event.target.value
                                    });
                                }}
                                value="1" type="radio" name="scheduleRestrictions" className=""/>
                            <label className="radio-label"> Yes</label>
                            <input
                                onChange={(event) => {
                                    this.setState({
                                        scheduleRestrictions: event.target.value
                                    });
                                }}
                                value="0" type="radio" name="scheduleRestrictions" className=""/>
                            <label className="radio-label"> No</label>
                        </div>
                        <span></span>
                    </div>
                    <div className="col-8">
                        <span className="primary"> If yes, please explain </span>
                        <textarea
                            onChange={(event) => {
                                this.setState({
                                    scheduleExplain: event.target.value
                                });
                            }}
                            value={this.state.scheduleExplain}
                            name="form-control" cols="30" rows="3" required
                            className="form-control textarea-apply-form"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Have you ever been convicted of a felony? </span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    convicted: event.target.value
                                });
                            }}
                            value="1" type="radio" name="convicted" className=""/>
                        <label className="radio-label"> Yes</label>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    convicted: event.target.value
                                });
                            }}
                            value="0" type="radio" name="convicted" className=""/>
                        <label className="radio-label"> No</label>
                        <span></span>
                    </div>
                    <div className="col-8">
                        <span className="primary"> If yes, please explain </span>
                        <textarea
                            onChange={(event) => {
                                this.setState({
                                    convictedExplain: event.target.value
                                });
                            }}
                            value={this.state.convictedExplain}
                            name="form-control" cols="30" required rows="3"
                            className="form-control textarea-apply-form"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <span className="primary"> How did you hear about Tumi Staffing </span>
                        <textarea
                            onChange={(event) => {
                                this.setState({
                                    comment: event.target.value
                                })
                            }}
                            value={this.state.comment}
                            name="comment" cols="20" rows="10" className="form-control textarea-apply-form"/>
                        <span></span>
                    </div>
                </div>
            </div>
        );

        // To render the Education Service Section
        let renderEducationSection = () => (
            <form id="education-form" className="ApplyBlock" onSubmit={(e) => {
                e.preventDefault();

                let item = {
                    schoolType: parseInt(document.getElementById('studyType').value),
                    educationName: document.getElementById('institutionName').value,
                    educationAddress: document.getElementById('addressInstitution').value,
                    startDate: document.getElementById('startPeriod').value,
                    endDate: document.getElementById('endPeriod').value,
                    graduated: document.getElementById('graduated').checked,
                    degree: document.getElementById('degree').value,
                    ApplicationId: 1 // Static application id
                };

                console.log(item);

                this.setState(prevState => ({
                    open: false,
                    schools: [...prevState.schools, item]
                }), () => {
                    document.getElementById('education-form').reset();
                    document.getElementById('studyType').classList.remove('invalid-apply-form');
                    document.getElementById('institutionName').classList.remove('invalid-apply-form');
                    document.getElementById('addressInstitution').classList.remove('invalid-apply-form');
                    document.getElementById('startPeriod').classList.remove('invalid-apply-form');
                    document.getElementById('endPeriod').classList.remove('invalid-apply-form');
                    document.getElementById('graduated').classList.remove('invalid-apply-form');
                    document.getElementById('degree').classList.remove('invalid-apply-form');
                })
            }}>
                <h4 className="ApplyBlock-title">Education</h4>
                {
                    this.state.schools.length > 0 ? (
                        <div key={uuidv4()} className="skills-container skills-container--header">
                            <div className="row">
                                <div className="col-2">
                                    <span>Study</span>
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
                                <div className="col-2">
                                    <span>End Date</span>
                                </div>
                                <div className="col-1">
                                    <span>Graduated</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ''
                    )
                }
                {
                    this.state.schools.map(schoolItem => (
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
                                <div className="col-2">
                                    <span>{schoolItem.endDate}</span>
                                </div>
                                <div className="col-1">
                                    <span>{schoolItem.graduated ? 'Yes' : 'No'}</span>
                                </div>
                                <div className="col-1">
                                    <Button className="deleteSkillSection" onClick={() => {
                                        this.setState(prevState => ({
                                            schools: this.state.schools.filter((_, i) => {
                                                console.log(this.state.languages);
                                                return _.schoolType !== schoolItem.schoolType
                                            })
                                        }))
                                    }}>x</Button>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <hr className="separator"/>
                <div className="row">
                    <div className="col-3">
                        <label className="primary">Study</label>
                        <select form="education-form" name="studyType" id="studyType" required className="form-control">
                            <option value="">Select an option</option>
                            {
                                studyTypes.map(item => (
                                    <option value={item.Id}>{item.Name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="col-3">
                        <label className="primary">Name (Institution)</label>
                        <input
                            form="education-form"
                            name="institutionName"
                            id="institutionName"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"/>
                    </div>
                    <div className="col-6">
                        <label className="primary">Address</label>
                        <input
                            form="education-form"
                            name="addressInstitution"
                            id="addressInstitution"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> Time Period</span>
                        <input
                            form="education-form" name="startPeriod" id="startPeriod" type="date"
                            className="form-control" required min="0" maxLength="50"
                            minLength="3"/>
                    </div>
                    <div className="col-3">
                        <span className="primary">To</span>
                        <input form="education-form" name="endPeriod" id="endPeriod" type="date"
                               className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                    </div>
                    <div className="col-2">
                        <label className="primary">Graduated</label> <br/>
                        <input form="education-form" type="checkbox" name="graduated" id="graduated" className=""/>
                    </div>
                    <div className="col-4">
                        <label className="primary">Degree</label>
                        <input form="education-form" name="degree" id="degree" type="text" className="form-control"
                               required min="0"
                               maxLength="50"
                               minLength="3"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Button type="submit" form="education-form" className="save-skill-button">Add</Button>
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
                        <input name="militaryBranch" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-6">
                        <span className="primary"> Rank at Discharge</span>
                        <input name="militaryRankDischarge" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> Dates</span>
                        <input name="militaryStartDate" type="date" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                    </div>
                    <div className="col-3">
                        <span className="primary">To: </span>
                        <input name="militaryEndDate" type="date" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                    </div>
                    <div className="col-6">
                        <span className="primary"> Type of Discharge</span>
                        <select name="dischargeType" id="dischargeType" required
                                className="form-control">
                            <option value="">Select a type</option>
                            <option value="typeOne">Example</option>
                        </select>
                        <span></span>
                    </div>
                </div>
            </div>
        );

        let renderPreviousEmploymentSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Previous Employment</h4>

                <div className="row">
                    <div className="col-8">
                        <span className="primary"> Company</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    companyName: event.target.value
                                });
                            }}
                            value={this.state.companyName}
                            name="companyNameEmployment" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Phone</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    companyPhone: event.target.value
                                });
                            }}
                            value={this.state.companyPhone}
                            name="phoneEmployment" type="number" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-8">
                        <span className="primary"> Address</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    companyAddress: event.target.value
                                });
                            }}
                            value={this.state.companyAddress}
                            name="addressEmployment" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Supervisor</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    companySupervisor: event.target.value
                                });
                            }}
                            value={this.state.companySupervisor}
                            name="supervisorEmployment" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-8">
                        <span className="primary"> Job Title</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    companyJobTitle: event.target.value
                                });
                            }}
                            value={this.state.companyJobTitle}
                            name="jobTitleEmployment" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Pay Rate</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    companyPayRate: event.target.value
                                });
                            }}
                            value={this.state.companyPayRate}
                            name="payRateEmployment" type="number" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-3">
                        <span className="primary"> Dates</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    companyStartDate: event.target.value
                                });
                            }}
                            value={this.state.companyStartDate}
                            name="startPreviousEmployment" type="date" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-3">
                        <span className="primary">To: </span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    companyEndDate: event.target.value
                                });
                            }}
                            value={this.state.companyEndDate}
                            name="endPreviousEmployment" type="date" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-6">
                        <span className="primary"> Reason for leaving</span>
                        <textarea
                            onChange={(event) => {
                                this.setState({
                                    companyReasonForLeaving: event.target.value
                                });
                            }}
                            value={this.state.companyReasonForLeaving}
                            name="reasonForLeavingEmployment" className="form-control textarea-apply-form"/>
                    </div>
                </div>
            </div>
        );

        let renderlanguagesSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">
                    Languages
                </h4>
                {
                    this.state.languages.length > 0 ? (
                        <div className="skills-container skills-container--header">
                            <div className="row">
                                <div className="col-3">
                                    <span>Language Name</span>
                                </div>
                                <div className="col-4">
                                    <span>Conversation %</span>
                                </div>
                                <div className="col-4">
                                    <span>Writing %</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ''
                    )
                }
                {
                    this.state.languages.map(languageItem => (
                        <div key={uuidv4()} className="skills-container">
                            <div className="row">
                                <div className="col-3">
                                    <span>{languageItem.idLanguage}</span>
                                </div>
                                <div className="col-4">
                                    <span>{languageItem.conversation}</span>
                                </div>
                                <div className="col-4">
                                    <span>{languageItem.writing}</span>
                                </div>
                                <div className="col-1">
                                    <Button className="deleteSkillSection" onClick={() => {
                                        this.setState(prevState => ({
                                            languages: this.state.languages.filter((_, i) => {
                                                console.log(this.state.languages);
                                                return _.idLanguage !== languageItem.idLanguage
                                            })
                                        }))
                                    }}>x</Button>
                                </div>
                            </div>
                        </div>
                    ))
                }
                <br/><br/>
                {
                    this.state.languages.length > 0 ? (
                        <hr/>
                    ) : (
                        ''
                    )
                }
                <form className="row" id="form-language" autoComplete="off" onSubmit={(e) => {
                    e.preventDefault();

                    let item = {
                        ApplicationId: 1,
                        idLanguage: 1,
                        writing: document.getElementById('writingLanguage').value,
                        conversation: document.getElementById('conversationLanguage').value
                    };

                    this.setState(prevState => ({
                        open: false,
                        languages: [...prevState.languages, item]
                    }), () => {
                        document.getElementById("form-language").reset();
                        document.getElementById('writingLanguage').classList.remove('invalid-apply-form');
                        document.getElementById('conversationLanguage').classList.remove('invalid-apply-form');
                        document.getElementById('nameLanguage').classList.remove('invalid-apply-form');
                    })
                }}>
                    <div className="col-3">
                        <span className="primary"> Language</span>
                        <input
                            id="nameLanguage"
                            form="form-language"
                            name="languageName"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-3">
                        <span className="primary"> Conversation</span>
                        <input
                            id="conversationLanguage"
                            form="form-language"
                            name="conversationLanguage"
                            type="number"
                            className="form-control"
                            required
                            min="0"
                            max="100"
                            maxLength="50"
                            minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-3">
                        <span className="primary"> Writing</span>
                        <input
                            id="writingLanguage"
                            form="form-language"
                            name="writingLanguage"
                            type="number"
                            className="form-control"
                            required
                            max="100"
                            min="0"
                            maxLength="50"
                            minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-3">
                        <br/>
                        <Button type="submit" form="form-language" className="save-skill-button">Add</Button>
                    </div>
                </form>
            </div>
        );


        let renderSkillsSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Skills</h4>
                <div className="row">
                    <div className="col-9">
                    </div>
                    <div className="col-3">
                        <Button onClick={this.handleClickOpen} className="save-skill-button">New Skill</Button>
                        {renderSkillsDialog()}
                    </div>
                    <div className="col-12">
                        {
                            this.state.skills.length > 0 ? (
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
                            )
                        }
                        {
                            this.state.skills.map(skillItem => (
                                <div key={uuidv4()} className="skills-container">
                                    <div className="row">
                                        <div className="col-6">
                                            <span>{skillItem.description}</span>
                                        </div>
                                        <div className="col-5">
                                            <InputRangeDisabled percent={skillItem.level}/>
                                        </div>
                                        <div className="col-1">
                                            <Button className="deleteSkillSection" onClick={() => {
                                                this.setState(prevState => ({
                                                    skills: this.state.skills.filter((_, i) => {
                                                        console.log(this.state.skills);
                                                        return _.description !== skillItem.description
                                                    })
                                                }))
                                            }}>x</Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        );

        return (
            <form className="ApplyForm apply-form"
                  onSubmit={e => {
                      // To cancel the default submit event
                      e.preventDefault();

                      // Call mutation to create a application
                      this.insertApplicationInformation();
                  }}
            >
                {/*{renderApplicantInformationSection()}*/}
                {/*{renderlanguagesSection()}*/}
                {/*{renderEducationSection()}*/}
                {/*{renderMilitaryServiceSection()}*/}
                {renderPreviousEmploymentSection()}
                {/*{renderSkillsSection()}*/}

                <div className="Apply-container">
                    <div className="row">
                        <div className="col-12 buttons-group-right">
                            <button type="reset" className="btn-circle btn-lg red">
                                <i className="fas fa-eraser"></i>
                            </button>
                            <button type="submit" className="btn-circle btn-lg">
                                <i className="fas fa-save"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }
}


export default withApollo(ApplyForm);
