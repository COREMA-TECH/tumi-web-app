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

class ApplyForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            skills: []
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
                        skillName: document.getElementById('skillName').value,
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
                        <input
                            id="skillName"
                            placeholder="Skill Description"
                            name="skillName"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                            form="skill-form"
                        />
                        <br/>
                        <InputRange getPercentSkill={(percent) => {
                            // update the percent skill
                            console.log("Percent: " + percent);
                        }}/>
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
                        <input name="firstName" type="text" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                        <span></span>
                    </div>

                    <div className="col-3">
                        <div className="row">
                            <span className="primary">Middle Name</span>
                            <input name="midleName" type="text" className="form-control" min="0" maxLength="50"
                                   minLength="3"/>
                            <span></span>
                            <i className="optional"></i>
                        </div>
                    </div>

                    <div className="col-3">
                        <span className="primary"> Last Name</span>
                        <input name="lastName" type="text" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                        <span></span>
                    </div>

                    <div className="col-3">
                        <span className="primary"> Date</span>
                        <input name="date" type="date" className="form-control" required min="0" maxLength="50"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <span className="primary"> Street Address</span>
                        <input name="streetAddress" type="text" className="form-control" required min="0" maxLength="50"
                               minLength="5"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary">Apt Number</span>
                        <input name="aptNumber" type="number" className="form-control" required min="0" maxLength="50"
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
                        <input name="city" type="text" className="form-control" required min="0" maxLength="10"
                               minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Zip Code</span>
                        <input name="zipCode" type="number" className="form-control" required maxLength="5"
                               minLength="4" min="10000" max="99999"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Home Phone</span>
                        <input name="homePhone" type="tel" className="form-control" min="999" maxLength="10"
                               minLength="10"/>
                        <span></span>
                    </div>

                    <div className="col-4">
                        <span className="primary"> Cell Phone</span>
                        <input name="cellPhone" type="tel" className="form-control" required min="0" maxLength="10"
                               minLength="10"/>
                        <span></span>
                    </div>

                    <div className="col-4">
                        <span className="primary"> Social Security Number</span>
                        <input name="socialSecurityNumber" type="number" className="form-control" required min="0"
                               maxLength="50" minLength="10"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <span className="primary"> Email Address</span>
                        <input name="emailAddress" type="email" className="form-control" required min="0"
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
                        <input name="dateAvailable" type="date" className="form-control" required min="0"
                               maxLength="50"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Do you have any schedule restrictions? </span>
                        <div className="col-12">
                            <input value="1" type="radio" name="scheduleRestrictions" className=""/>
                            <label className="radio-label"> Yes</label>
                            <input value="0" type="radio" name="scheduleRestrictions" className=""/>
                            <label className="radio-label"> No</label>
                        </div>
                        <span></span>
                    </div>
                    <div className="col-8">
                        <span className="primary"> If yes, please explain </span>
                        <textarea name="form-control" cols="30" rows="3" className="form-control"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Have you ever been convicted of a felony? </span>
                        <input value="1" type="radio" name="convicted" className=""/>
                        <label className="radio-label"> Yes</label>
                        <input value="0" type="radio" name="convicted" className=""/>
                        <label className="radio-label"> No</label>
                        <span></span>
                    </div>
                    <div className="col-8">
                        <span className="primary"> If yes, please explain </span>
                        <textarea name="form-control" cols="30" rows="3" className="form-control"/>
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <span className="primary"> How did you hear about Tumi Staffing </span>
                        <textarea name="comment" cols="20" rows="10" className="form-control"/>
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
                        <textarea name="reasonForLeavingEmployment" className="form-control"/>
                    </div>
                </div>
            </div>
        );

        let renderLenguagesSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">
                    Lenguages
                </h4>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Language</span>
                        <input name="lenguageName" type="text" className="form-control" required min="0" maxLength="50"
                               minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Conversation</span>
                        <input name="conversationLenguage" type="number" className="form-control" required min="0"
                               maxLength="50" minLength="3"/>
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Writing</span>
                        <input name="writingLenguage" type="number" className="form-control" required min="0"
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
                                            <span>Skill Percent</span>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )
                        }
                        {
                            this.state.skills.reverse().map(skillItem => (
                                <div className="skills-container">
                                    <div className="row">
                                        <div className="col-6">
                                            <span>{skillItem.skillName}</span>
                                        </div>
                                        <div className="col-6">
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>


                    {/*<div className="col-6">*/}
                    {/*<span className="primary card-input-label"> Time Period years</span>*/}
                    {/*<input name="startSkillDate" type="date" className="form-control" min="0" maxLength="50" minLength="3" />*/}
                    {/*<span></span>*/}
                    {/*<i className="optional"></i>*/}
                    {/*</div>*/}
                    {/*<div className="col-6">*/}
                    {/*<span>To: </span>*/}
                    {/*<input name="endSkillDate" type="date" className="form-control" min="0" maxLength="50" minLength="3" />*/}
                    {/*<span></span>*/}
                    {/*<i className="optional"></i>*/}
                    {/*</div>*/}
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
                        {renderLenguagesSection()}
                        {renderEducationSection()}
                        {renderMilitaryServiceSection()}
                        {renderPreviousEmploymentSection()}
                        {renderSkillsSection()}
                        <div className="row">
                            <input type="reset" className="reset" value="Reset"/>
                            <input type="submit" className="submit" value="Apply"/>
                        </div>
                    </form>
                )}
            </Mutation>
        );
    }
}


export default ApplyForm;
