import React, {Component} from 'react';
import gql from "graphql-tag";
import {Mutation} from "react-apollo";

class ApplyForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {

        // Mutation to create a employment application
        const CREATE_APPLICATION = gql`
              mutation createApplication(
                    $firstName: String!, 
                    $middleName: String!,
                    $lastName: String!,
                    $date: String!,
                    $streetAddress: String!,
                    $aptNumber: Int!,
                    $city: Int!,
                    $state: Int!,
                    $zipCode: Int!,
                    $homePhone: String!,
                    $cellPhone: String!,
                    $socialSecurityNumber: String!,
                    $emailAddress: String!,
                    $positionApplyingFor: Int!,
                    $dateAvailable: String!,
                    $scheduleRestrictions: Int!,
                    $scheduleExplain: String,
                    $convicted: Int!,
                    $convictedExplain: String,
                    $comment: String!
              ) {
                    createApplication(type: $type) {
                          id
                    }
              }
        `;


        return (
            <Mutation mutation={CREATE_APPLICATION}>
                {(createApplication, {data}) => (
                    <form
                        onSubmit={e => {
                            e.preventDefault();
                            // createApplication({variables: {type: input.value}});
                            //input.value = "";
                        }}
                    >
                        <div className="row">
                            <h3>Applicant Information</h3>
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-6">
                                        <span className="primary card-input-label">* First Name</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Middle Name</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Last Name</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Date</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="date"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Street Address</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Apt Number</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* State</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* City</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="text"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Zip Code</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Home Phone</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Cell Phone</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Social Security Number</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="number"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Email Address</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="email"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                </div>
                            </div>
                            <div className="col-6">
                                <div className="row">
                                    <div className="col-6">
                                        <span className="primary card-input-label">* Position Applying for</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="email"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Date Available</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            type="date"
                                            className="input-form"
                                            required
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                <span
                                    className="primary card-input-label">* Do you have any schedule restrictions? </span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            value="1"
                                            type="radio"
                                            name="schedule-restrictions"
                                            className="input-form"
                                            checked
                                        />

                                        <input
                                            value="0"
                                            type="radio"
                                            name="schedule-restrictions"
                                            className="input-form"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* If yes, please explain </span>
                                    </div>
                                    <div className="col-6">
                                        <textarea name="schedule-explain" cols="30" rows="10" className="input-form"/>
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
                                            checked
                                        />

                                        <input
                                            value="0"
                                            type="radio"
                                            name="convicted"
                                            className="input-form"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* If yes, please explain </span>
                                    </div>
                                    <div className="col-6">
                                        <textarea name="convicted-explain" cols="30" rows="10" className="input-form"/>
                                    </div>

                                    <div className="col-6">
                                <span
                                    className="primary card-input-label">* How did you hear about Tumi Staffing </span>
                                    </div>
                                    <div className="col-6">
                                        <textarea name="convicted-explain" cols="30" rows="10" className="input-form"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <input type="submit" value="Apply"/>
                        </div>
                    </form>
                )}
            </Mutation>
        );
    }
}


export default ApplyForm;