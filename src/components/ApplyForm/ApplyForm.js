import React, {Component} from 'react';
import {Mutation} from "react-apollo";
import {CREATE_APPLICATION} from "./Mutations";
import LinearProgress from "@material-ui/core/es/LinearProgress/LinearProgress";
import SelectNothingToDisplay from "../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay";
import Query from "react-apollo/Query";
import SelectForm from "../ui-components/SelectForm/SelectForm";
import {GET_CITIES_QUERY, GET_STATES_QUERY} from "./Queries";

class ApplyForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {

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
                                            name="firstName"
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
                                            name="midleName"
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
                                            name="lastName"
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
                                            name="date"
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
                                            name="streetAddress"
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
                                            name="aptNumber"
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
                                        <Query query={GET_STATES_QUERY} variables={{parent: 6}}>
                                            {({loading, error, data, refetch, networkStatus}) => {
                                                //if (networkStatus === 4) return <LinearProgress />;
                                                if (loading) return <LinearProgress/>;
                                                if (error) return <p>Error </p>;
                                                if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                    console.log('VALUE: ' + data.getcatalogitem);
                                                    return (
                                                        <SelectForm
                                                            name="state"
                                                            data={data.getcatalogitem}
                                                            update={(value) => {

                                                            }}
                                                        />
                                                    );
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
                                                    console.log('Data of cities' + data.getcatalogitem);
                                                    return (
                                                        <SelectForm
                                                            name="city"
                                                            data={data.getcatalogitem}
                                                            error={this.state.validCity === '' ? false : true}
                                                            update={(value) => {

                                                            }}
                                                        />
                                                    );
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
                                            min="0"
                                            maxLength="50"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* Home Phone</span>
                                    </div>
                                    <div className="col-6">
                                        <input
                                            name="homePhone"
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
                                            name="cellPhone"
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
                                            name="socialSecurityNumber"
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
                                            name="emailAddress"
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
                                            name="positionApplyingFor"
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
                                            name="dateAvailable"
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
                                            name="scheduleRestrictions"
                                            className="input-form"
                                            checked
                                        />

                                        <input
                                            value="0"
                                            type="radio"
                                            name="scheduleRestrictions"
                                            className="input-form"
                                        />
                                    </div>

                                    <div className="col-6">
                                        <span className="primary card-input-label">* If yes, please explain </span>
                                    </div>
                                    <div className="col-6">
                                        <textarea name="scheduleExplain" cols="30" rows="10" className="input-form"/>
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
                                        <textarea name="convictedExplain" cols="30" rows="10" className="input-form"/>
                                    </div>

                                    <div className="col-6">
                                <span
                                    className="primary card-input-label">* How did you hear about Tumi Staffing </span>
                                    </div>
                                    <div className="col-6">
                                        <textarea name="comment" cols="30" rows="10" className="input-form"/>
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