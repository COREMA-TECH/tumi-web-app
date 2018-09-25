import React, { Component } from 'react';
import { Mutation } from "react-apollo";
import { CREATE_APPLICATION } from "./Mutations";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import SelectNothingToDisplay from "../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay";
import Query from "react-apollo/Query";
import { GET_CITIES_QUERY, GET_POSITIONS_QUERY, GET_STATES_QUERY } from "./Queries";
import './index.css';

class ApplyForm extends Component {
    constructor(props) {
        super(props);
    }

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


        // To render the Applicant Information Section
        let renderApplicantInformationSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Applicant Information</h4>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> First Name</span>
                        <input name="firstName" type="text" className="form-control" required min="0" maxLength="50" minLength="3" />
                        <span></span>
                    </div>

                    <div className="col-3">
                        <div className="row">
                            <span className="primary">Middle Name</span>
                            <input name="midleName" type="text" className="form-control" min="0" maxLength="50" minLength="3" />
                            <span></span>
                        </div>
                        <div className="row">
                            <i className="optional"></i><i></i>
                        </div>
                    </div>

                    <div className="col-3">
                        <span className="primary"> Last Name</span>
                        <input name="lastName" type="text" className="form-control" required min="0" maxLength="50" minLength="3" />
                        <span></span>
                    </div>

                    <div className="col-3">
                        <span className="primary"> Date</span>
                        <input name="date" type="date" className="form-control" required min="0" maxLength="50" />
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <span className="primary"> Street Address</span>
                        <input name="streetAddress" type="text" className="form-control" required min="0" maxLength="50" minLength="5" />
                        <span></span>
                    </div>
                    <div className="col-4">
                        <span className="primary">Apt Number</span>
                        <input name="aptNumber" type="number" className="form-control" required min="0" maxLength="50" minLength="5" />
                        <span></span>
                        <div className="row">
                            <i className="optional"></i>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> State</span>
                        <Query query={GET_STATES_QUERY} variables={{ parent: 6 }}>
                            {({ loading, error, data, refetch, networkStatus }) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress />;
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
                                return <SelectNothingToDisplay />
                            }}
                        </Query>
                    </div>
                    <div className="col-4">
                        <span className="primary"> City</span>
                        <Query query={GET_CITIES_QUERY} variables={{ parent: 0 }}>
                            {({ loading, error, data, refetch, networkStatus }) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress />;
                                if (error) return <p>Error </p>;
                                if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                    return <select name="city" id="city" required
                                        className="form-control">
                                        <option value="">Select a city</option>
                                        {
                                            data.getcatalogitem.map(item => (
                                                <option value={item.Id}>{item.Name}</option>
                                            ))
                                        }
                                    </select>

                                }
                                return <SelectNothingToDisplay />
                            }}
                        </Query>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Zip Code</span>
                        <input name="zipCode" type="number" className="form-control" required maxLength="5" minLength="4" min="10000" max="99999" />
                        <span></span>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Home Phone</span>
                        <input name="homePhone" type="tel" className="form-control" min="999" maxLength="10" minLength="10" />
                        <span></span>
                    </div>

                    <div className="col-4">
                        <span className="primary"> Cell Phone</span>
                        <input name="cellPhone" type="tel" className="form-control" required min="0" maxLength="10" minLength="10" />
                        <span></span>
                    </div>

                    <div className="col-4">
                        <span className="primary"> Social Security Number</span>
                        <input name="socialSecurityNumber" type="number" className="form-control" required min="0" maxLength="50" minLength="10" />
                        <span></span>
                    </div>
                </div>
                <div className="row">

                    <div className="col-6">
                        <div className="row">



                            <div className="col-6">
                                <span className="primary card-input-label"> Email Address</span>
                            </div>
                            <div className="col-6">
                                <input
                                    name="emailAddress"
                                    type="email"
                                    className="form-control"
                                    required
                                    min="0"
                                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                                    maxLength="50"
                                    minLength="8"
                                />
                                <span></span>
                            </div>

                        </div>
                    </div>
                    <div className="col-6">
                        <div className="row">
                            <div className="col-6">
                                <span className="primary card-input-label"> Position Applying for</span>
                            </div>
                            <div className="col-6">
                                <Query query={GET_POSITIONS_QUERY}>
                                    {({ loading, error, data, refetch, networkStatus }) => {
                                        //if (networkStatus === 4) return <LinearProgress />;
                                        if (loading) return <LinearProgress />;
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
                                        return <SelectNothingToDisplay />
                                    }}
                                </Query>
                            </div>

                            <div className="col-6">
                                <span className="primary card-input-label"> Date Available</span>
                            </div>
                            <div className="col-6">
                                <input
                                    name="dateAvailable"
                                    type="date"
                                    className="form-control"
                                    required
                                    min="0"
                                    maxLength="50"
                                />
                                <span></span>
                            </div>

                            <div className="col-6">
                                <span
                                    className="primary card-input-label"> Do you have any schedule restrictions? </span>
                            </div>
                            <div className="col-6">
                                <input
                                    value="1"
                                    type="radio"
                                    name="scheduleRestrictions"
                                    className="form-control"
                                />
                                <input
                                    value="0"
                                    type="radio"
                                    name="scheduleRestrictions"
                                    className="form-control"
                                />
                                <span></span>
                            </div>

                            <div className="col-6">
                                <span className="primary card-input-label"> If yes, please explain </span>
                            </div>
                            <div className="col-6">
                                <textarea name="scheduleExplain" cols="30" rows="10" className="form-control" />
                                <span></span>
                            </div>

                            <div className="col-6">
                                <span
                                    className="primary card-input-label"> Have you ever been convicted of a felony? </span>
                            </div>
                            <div className="col-6">
                                <input
                                    value="1"
                                    type="radio"
                                    name="convicted"
                                    className="form-control"
                                />

                                <input
                                    value="0"
                                    type="radio"
                                    name="convicted"
                                    className="form-control"
                                />
                                <span></span>
                            </div>

                            <div className="col-6">
                                <span className="primary card-input-label"> If yes, please explain </span>
                            </div>
                            <div className="col-6">
                                <textarea name="convictedExplain" cols="30" rows="10" className="form-control" />
                                <span></span>
                            </div>

                            <div className="col-6">
                                <span
                                    className="primary card-input-label"> How did you hear about Tumi Staffing </span>
                            </div>
                            <div className="col-6">
                                <textarea name="comment" cols="30" rows="10" className="form-control" />
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        // To render the Education Service Section
        let renderEducationSection = () => (
            <div className="row">
                <h4>Education</h4>
                <div className="row">
                    <div className="col-3">
                        <span className="primary card-input-label"> Time Period</span>
                    </div>
                    <div className="col-6">
                        <div className="row">
                            <div className="col-5">
                                <input
                                    name="startPeriod"
                                    type="date"
                                    className="form-control"
                                    required
                                    min="0"
                                    maxLength="50"
                                    minLength="3"
                                />
                            </div>
                            <div className="col-2">
                                <span className="card-input-label">To</span>
                            </div>
                            <div className="col-5">
                                <input
                                    name="endPeriod"
                                    type="date"
                                    className="form-control"
                                    required
                                    min="0"
                                    maxLength="50"
                                    minLength="3"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-6">
                        <span
                            className="primary card-input-label"> Graduated </span>
                    </div>
                    <div className="col-6">
                        <div className="row">
                            <div className="col-6">
                                <span className="col-12">Yes</span>
                                <input
                                    value="1"
                                    type="radio"
                                    name="graduated"
                                    className="form-control"
                                    required
                                    checked
                                />
                            </div>
                            <div className="col-6">
                                <span className="col-12">No</span>
                                <input
                                    value="0"
                                    type="radio"
                                    name="graduated"
                                    className="form-control"
                                    required
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <div className="row">
                            <div className="col-6">
                                <span className="primary card-input-label"> Type </span>
                            </div>
                            <div className="col-6">
                                <select name="typeStudy" id="typeStudy" required
                                    className="form-control">
                                    <option value="">Select a option</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="row">
                            <div className="col-6">
                                <span className="primary card-input-label"> Institution</span>
                            </div>
                            <div className="col-6">
                                <input
                                    name="institutionName"
                                    type="text"
                                    className="form-control"
                                    required
                                    min="0"
                                    maxLength="50"
                                    minLength="3"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-3">
                        <div className="row">
                            <div className="col-6">
                                <span className="primary card-input-label"> Address</span>
                            </div>
                            <div className="col-6">
                                <input
                                    name="addressInstitution"
                                    type="text"
                                    className="form-control"
                                    required
                                    min="0"
                                    maxLength="50"
                                    minLength="3"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        // To render the Military Service Section
        let renderMilitaryServiceSection = () => (
            <div className="row">
                <h4>Military Service</h4>
                <div className="col-3">
                    <div className="row">
                        <div className="col-6">
                            <span className="primary card-input-label"> Branch</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="militaryBranch"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span></span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <span className="primary card-input-label"> Rank at Discharge</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="militaryRankDischarge"
                                type="text"
                                className="form-control"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span></span>
                        </div>
                    </div>
                </div>
                <div className="col-9">
                    <div className="row">
                        <div className="col-3">
                            <span className="primary card-input-label"> Dates</span>
                        </div>
                        <div className="col-9">
                            <div className="row">
                                <div className="col-6">
                                    <input
                                        name="militaryStartDate"
                                        type="date"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                </div>
                                <span className="col-1">To: </span>
                                <div className="col-5">
                                    <input
                                        name="militaryEndDate"
                                        type="date"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <span className="primary card-input-label"> Type of Discharge</span>
                            </div>
                            <div className="col-6">
                                <select name="dischargeType" id="dischargeType" required
                                    className="form-control">
                                    <option value="">Select a type</option>
                                </select>
                                <span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        let renderPreviousEmploymentSection = () => (
            <div className="row">
                <h4>Previous Employment</h4>
                <div className="col-12">
                    <div className="row">
                        <div className="col-9">
                            <div className="row">
                                <div className="col-3">
                                    <span className="primary card-input-label"> Company</span>
                                </div>
                                <div className="col-9">
                                    <input
                                        name="companyNameEmployment"
                                        type="text"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="row">
                                <div className="col-3">
                                    <span className="primary card-input-label"> Phone</span>
                                </div>
                                <div className="col-9">
                                    <input
                                        name="phoneEmployment"
                                        type="number"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="row">
                                <div className="col-3">
                                    <span className="primary card-input-label"> Address</span>
                                </div>
                                <div className="col-9">
                                    <input
                                        name="addressEmployment"
                                        type="text"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="row">
                                <div className="col-3">
                                    <span className="primary card-input-label"> Supervisor</span>
                                </div>
                                <div className="col-9">
                                    <input
                                        name="supervisorEmployment"
                                        type="text"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="col-9">
                            <div className="row">
                                <div className="col-3">
                                    <span className="primary card-input-label"> Job Title</span>
                                </div>
                                <div className="col-9">
                                    <input
                                        name="jobTitleEmployment"
                                        type="text"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                    <span></span>
                                </div>
                            </div>
                        </div>
                        <div className="col-3">
                            <div className="row">
                                <div className="col-3">
                                    <span className="primary card-input-label"> Pay Rate</span>
                                </div>
                                <div className="col-9">
                                    <input
                                        name="payRateEmployment"
                                        type="number"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                    <span></span>
                                </div>
                            </div>
                        </div>

                        <div className="col-6">
                            <div className="row">
                                <div className="col-3">
                                    <span className="primary card-input-label"> Dates</span>
                                </div>
                                <div className="col-9">
                                    <div className="row">
                                        <div className="col-6">
                                            <input
                                                name="startPreviousEmployment"
                                                type="date"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="3"
                                            />
                                            <span></span>
                                        </div>
                                        <div className="col-1">
                                            <span>To: </span>
                                        </div>
                                        <div className="col-5">
                                            <input
                                                name="endPreviousEmployment"
                                                type="date"
                                                className="form-control"
                                                required
                                                min="0"
                                                maxLength="50"
                                                minLength="3"
                                            />
                                            <span></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <div className="col-3">
                                    <span className="primary card-input-label"> Reason for leaving</span>
                                </div>
                                <div className="col-9">
                                    <textarea
                                        name="reasonForLeavingEmployment"
                                        className="form-control"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        let renderLenguagesSection = () => (
            <div className="row">
                <h4>Lenguages</h4>
                <div className="col-1">
                    <span className="primary card-input-label"> Lenguage</span>
                </div>
                <div className="col-3">
                    <input
                        name="lenguageName"
                        type="text"
                        className="form-control"
                        required
                        min="0"
                        maxLength="50"
                        minLength="3"
                    />
                    <span></span>
                </div>
                <div className="col-1">
                    <span className="primary card-input-label"> Conversation</span>
                </div>
                <div className="col-3">
                    <input
                        name="conversationLenguage"
                        type="number"
                        className="form-control"
                        required
                        min="0"
                        maxLength="50"
                        minLength="3"
                    />
                    <span></span>
                </div>
                <div className="col-1">
                    <span className="primary card-input-label"> Writing</span>
                </div>
                <div className="col-3">
                    <input
                        name="writingLenguage"
                        type="number"
                        className="form-control"
                        required
                        min="0"
                        maxLength="50"
                        minLength="3"
                    />
                    <span></span>
                </div>
            </div>
        );

        let renderSkillsSection = () => (
            <div className="row">
                <h4>Skills</h4>
                <div className="col-12">
                    <span>What skill do you have?</span>
                </div>
                <div className="col-12">
                    <input
                        name="skillName"
                        type="text"
                        className="form-control"
                        required
                        min="0"
                        maxLength="50"
                        minLength="3"
                    />
                    <span></span>
                </div>
                <div className="col-2">
                    <span className="primary card-input-label"> Time Period years</span>
                </div>
                <div className="col-12">
                    <div className="row">
                        <div className="col-6">
                            <input
                                name="startSkillDate"
                                type="date"
                                className="form-control"
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span></span>
                            <i className="optional"></i>
                        </div>
                        <div className="col-1">
                            <span>To: </span>
                        </div>
                        <div className="col-5">
                            <input
                                name="endSkillDate"
                                type="date"
                                className="form-control"
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span></span>
                            <i className="optional"></i>
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <Mutation mutation={CREATE_APPLICATION}>
                {(createApplication, { data }) => (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            let formSubmitted = e.target.classList.add('form-submitted');
                            // createApplication({variables: {type: input.value}});
                            //input.value = "";
                        }}
                    >
                        {renderApplicantInformationSection()}
                        {renderLenguagesSection()}*/}
                        {renderEducationSection()}*/}
                        {renderMilitaryServiceSection()}*/}
                        {renderPreviousEmploymentSection()}*/}
                        {renderSkillsSection()}*/}
                        <div className="row">
                            <input type="reset" className="reset" value="Reset" />
                            <input type="submit" className="submit" value="Apply" />
                        </div>
                    </form>
                )}
            </Mutation>
        );
    }
}


export default ApplyForm;