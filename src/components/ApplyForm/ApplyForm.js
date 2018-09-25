import React, {Component} from 'react';
import {Mutation} from "react-apollo";
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
            skills: [],
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
                    }))
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
                            name="form-control" cols="30" required rows="3" className="form-control textarea-apply-form"/>
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
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Education</h4>
                <div className="row">
                    <div className="col-12">
                        <h3 className="ApplyBlock-subtitle">High School</h3>
                    </div>
                    <div className="col-4">
                        <label className="primary">Name (Institution)</label>
                        <input name="institutionName" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                    </div>
                    <div className="col-8">
                        <label className="primary">Address</label>
                        <input name="addressInstitution" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> Time Period</span>
                        <input name="startPeriod" type="date" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                    </div>
                    <div className="col-3">
                        <span className="primary">To</span>
                        <input name="endPeriod" type="date" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                    </div>
                    <div className="col-2">
                        <label className="primary">Graduated</label> <br/>
                        <input type="checkbox" name="graduated" className=""/>
                    </div>
                    <div className="col-4">
                        <label className="primary">Degree</label>
                        <input name="degree" type="text" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                    </div>
                </div>
                <hr className="separator"/>
                <div className="row">
                    <div className="col-12">
                        <h3 className="ApplyBlock-subtitle">Collage</h3>
                    </div>
                    <div className="col-4">
                        <label className="primary">Name (Institution)</label>
                        <input name="institutionName" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                    </div>
                    <div className="col-8">
                        <label className="primary">Address</label>
                        <input name="addressInstitution" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> Time Period</span>
                        <input name="startPeriod" type="date" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                    </div>
                    <div className="col-3">
                        <span className="primary">To</span>
                        <input name="endPeriod" type="date" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                    </div>
                    <div className="col-2">
                        <label className="primary">Graduated</label> <br/>
                        <input type="checkbox" name="graduated" className=""/>
                    </div>
                    <div className="col-4">
                        <label className="primary">Degree</label>
                        <input name="degree" type="text" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                    </div>
                </div>
                <hr className="separator"/>
                <div className="row">
                    <div className="col-12">
                        <h3 className="ApplyBlock-subtitle">Other</h3>
                    </div>
                    <div className="col-4">
                        <label className="primary">Name (Institution)</label>
                        <input name="institutionName" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                    </div>
                    <div className="col-8">
                        <label className="primary">Address</label>
                        <input name="addressInstitution" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> Time Period</span>
                        <input name="startPeriod" type="date" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                    </div>
                    <div className="col-3">
                        <span className="primary">To</span>
                        <input name="endPeriod" type="date" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                    </div>
                    <div className="col-2">
                        <label className="primary">Graduated</label> <br/>
                        <input type="checkbox" name="graduated" className=""/>
                    </div>
                    <div className="col-4">
                        <label className="primary">Degree</label>
                        <input name="degree" type="text" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                    </div>
                </div>
            </div>
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
                        <input name="companyNameEmployment" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Phone</span>
                        <input name="phoneEmployment" type="number" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-8">
                        <span className="primary"> Address</span>
                        <input name="addressEmployment" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Supervisor</span>
                        <input name="supervisorEmployment" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-8">
                        <span className="primary"> Job Title</span>
                        <input name="jobTitleEmployment" type="text" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Pay Rate</span>
                        <input name="payRateEmployment" type="number" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-3">
                        <span className="primary"> Dates</span>
                        <input name="startPreviousEmployment" type="date" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-3">
                        <span className="primary">To: </span>
                        <input name="endPreviousEmployment" type="date" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-6">
                        <span className="primary"> Reason for leaving</span>
                        <textarea name="reasonForLeavingEmployment" className="form-control textarea-apply-form"/>
                    </div>
                </div>
            </div>
        );

        let renderlanguagesSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">
                    Languages
                </h4>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Language</span>
                        <input name="languageName" type="text" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Conversation</span>
                        <input name="conversationlanguage" type="number" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Writing</span>
                        <input name="writinglanguage" type="number" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                </div>
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
            <Mutation mutation={CREATE_APPLICATION}>
                {(createApplication, {data}) => (
                    <form className="ApplyForm apply-form"
                          onSubmit={e => {
                              e.preventDefault();
                              let formSubmitted = e.target.classList.add('form-submitted');
                              // createApplication({variables: {type: input.value}});
                              //input.value = "";
                          }}
                    >
                        {renderApplicantInformationSection()}
                        {renderlanguagesSection()}
                        {renderEducationSection()}
                        {renderMilitaryServiceSection()}
                        {renderPreviousEmploymentSection()}
                        {renderSkillsSection()}

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
                )}
            </Mutation>
        );
    }
}


export default ApplyForm;
