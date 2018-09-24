import React, {Component} from 'react';
import {Mutation} from "react-apollo";
import {CREATE_APPLICATION} from "./Mutations";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import SelectNothingToDisplay from "../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay";
import Query from "react-apollo/Query";
import {GET_CITIES_QUERY, GET_POSITIONS_QUERY, GET_STATES_QUERY} from "./Queries";
import './index.css';

class ApplyForm extends Component {
    constructor(props) {
        super(props);
    }

    // To validate all the inputs and set a red border when the input is invalid
    validateInvalidInput = () => {
        if(document.addEventListener){
            document.addEventListener('invalid', function(e){
                e.target.className += ' invalid-apply-form';
            }, true);
        }
    };

    render() {
        this.validateInvalidInput();


        // To render the Applicant Information Section
        let renderApplicantInformationSection = () => (
            <div className="row">
                <h3>Applicant Information</h3>
                <div className="col-6">
                    <div className="row">
                        <div className="col-6">
                            <span className="primary card-input-label">* First Name</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="firstName"
                                type="text"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">Middle Name</span>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <input
                                    name="midleName"
                                    type="text"
                                    className="input-form"
                                    min="0"
                                    maxLength="50"
                                    minLength="3"
                                />
                                <span></span>
                            </div>
                            <div className="row">
                                <i></i>
                            </div>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">* Last Name</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="lastName"
                                type="text"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">* Date</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="date"
                                type="date"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">* Street Address</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="streetAddress"
                                type="text"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                                minLength="5"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">Apt Number</span>
                        </div>
                        <div className="col-6">
                            <div className="row">
                                <input
                                    name="aptNumber"
                                    type="number"
                                    className="input-form"
                                    required
                                    min="0"
                                    maxLength="50"
                                    minLength="5"
                                />
                                <span></span>
                            </div>
                            <div className="row">
                                <i></i>
                            </div>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">* State</span>
                        </div>
                        <div className="col-6">
                            <Query query={GET_STATES_QUERY} variables={{parent: 6}}>
                                {({loading, error, data, refetch, networkStatus}) => {
                                    //if (networkStatus === 4) return <LinearProgress />;
                                    if (loading) return <LinearProgress/>;
                                    if (error) return <p>Error </p>;
                                    if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                        return <select name="state" id="state" required
                                                       className="input-form">
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

                        <div className="col-6">
                            <span className="primary card-input-label">* City</span>
                        </div>
                        <div className="col-6">
                            <Query query={GET_CITIES_QUERY} variables={{parent: 0}}>
                                {({loading, error, data, refetch, networkStatus}) => {
                                    //if (networkStatus === 4) return <LinearProgress />;
                                    if (loading) return <LinearProgress/>;
                                    if (error) return <p>Error </p>;
                                    if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                        return <select name="city" id="city" required
                                                       className="input-form">
                                            <option value="">Select a city</option>
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

                        <div className="col-6">
                            <span className="primary card-input-label">* Zip Code</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="zipCode"
                                type="number"
                                className="input-form"
                                required
                                maxLength="5"
                                minLength="4"
                                min="10000"
                                max="99999"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">* Home Phone</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="homePhone"
                                type="tel"
                                className="input-form"
                                min="999"
                                maxLength="10"
                                minLength="10"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">* Cell Phone</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="cellPhone"
                                type="tel"
                                className="input-form"
                                required
                                min="0"
                                maxLength="10"
                                minLength="10"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">* Social Security Number</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="socialSecurityNumber"
                                type="number"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                                minLength="10"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">* Email Address</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="emailAddress"
                                type="email"
                                className="input-form"
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
                            <span className="primary card-input-label">* Position Applying for</span>
                        </div>
                        <div className="col-6">
                            <Query query={GET_POSITIONS_QUERY}>
                                {({loading, error, data, refetch, networkStatus}) => {
                                    //if (networkStatus === 4) return <LinearProgress />;
                                    if (loading) return <LinearProgress/>;
                                    if (error) return <p>Error </p>;
                                    if (data.getposition != null && data.getposition.length > 0) {
                                        return <select name="city" id="city" required
                                                       className="input-form">
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
                            <span className="primary card-input-label">* Date Available</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="dateAvailable"
                                type="date"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                                <span
                                    className="primary card-input-label">* Do you have any schedule restrictions? </span>
                        </div>
                        <div className="col-6">
                            <input
                                value="1"
                                type="radio"
                                name="scheduleRestrictions"
                                className="input-form"
                            />
                            <input
                                value="0"
                                type="radio"
                                name="scheduleRestrictions"
                                className="input-form"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">* If yes, please explain </span>
                        </div>
                        <div className="col-6">
                            <textarea name="scheduleExplain" cols="30" rows="10" className="input-form"/>
                            <span></span>
                        </div>

                        <div className="col-6">
                                <span
                                    className="primary card-input-label">* Have you ever been convicted of a felony? </span>
                        </div>
                        <div className="col-6">
                            <input
                                value="1"
                                type="radio"
                                name="convicted"
                                className="input-form"
                            />

                            <input
                                value="0"
                                type="radio"
                                name="convicted"
                                className="input-form"
                            />
                            <span></span>
                        </div>

                        <div className="col-6">
                            <span className="primary card-input-label">* If yes, please explain </span>
                        </div>
                        <div className="col-6">
                            <textarea name="convictedExplain" cols="30" rows="10" className="input-form"/>
                            <span></span>
                        </div>

                        <div className="col-6">
                                <span
                                    className="primary card-input-label">* How did you hear about Tumi Staffing </span>
                        </div>
                        <div className="col-6">
                            <textarea name="comment" cols="30" rows="10" className="input-form"/>
                            <span></span>
                        </div>
                    </div>
                </div>
            </div>
        );

        // To render the Education Service Section
        let renderEducationSection = () => (
            <div className="row">
                <h3>Education</h3>
                <div className="col-12">
                    <h5>High School</h5>
                    <div className="row">
                        <div className="col-3">
                            <span className="primary card-input-label">* Name </span>
                        </div>
                        <div className="col-3">
                            <input
                                name="highSchoolName"
                                type="text"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <span className="primary card-input-label">* Address </span>
                        </div>
                        <div className="col-3">
                            <input
                                name="highSchoolAddress"
                                type="text"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <span className="primary card-input-label">* Time Period </span>
                        </div>
                        <div className="col-3">
                            <div className="row">
                                <div className="col-6">
                                    <span className="primary card-input-label">* Start </span>
                                </div>
                                <div className="col-6">
                                    <input
                                        name="startTimePeriod"
                                        type="date"
                                        className="input-form"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                </div>
                                <div className="col-6">
                                    <div className="col-6">
                                        <span className="primary card-input-label">* End </span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            name="endTimePeriod"
                                            type="date"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                            minLength="3"
                                        />
                                    </div>
                                </div>
                                <div className="col-6"></div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );

        // To render the Military Service Section
        let renderMilitaryServiceSection = () => (
            <div className="row">
                <h3>Military Service</h3>
                <div className="col-6">
                    <div className="row">
                        <div className="col-6">
                            <span className="primary card-input-label">* Branch</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="militaryBranch"
                                type="text"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <span className="primary card-input-label">* Rank at Discharge</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="militaryRankDischarge"
                                type="text"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                    </div>
                </div>
                <div className="col-6">
                    <div className="row">
                        <div className="col-6">
                            <span className="primary card-input-label">* Dates</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="militaryDates"
                                type="date"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <span className="primary card-input-label">* Type of Discharge</span>
                        </div>
                        <div className="col-6">
                            <input
                                name="militaryTypeDischarge"
                                type="text"
                                className="input-form"
                                required
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <Mutation mutation={CREATE_APPLICATION}>
                {(createApplication, {data}) => (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            let formSubmitted = e.target.classList.add('form-submitted');
                            // createApplication({variables: {type: input.value}});
                            //input.value = "";
                        }}
                    >
                        {renderApplicantInformationSection()}
                        {renderEducationSection()}
                        {renderMilitaryServiceSection()}
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