import React, {Component} from 'react';
import {gql} from 'apollo-boost';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import Query from 'react-apollo/Query';
import days from '../../../data/days.json';
import withApollo from 'react-apollo/withApollo';
import InputDateForm from 'ui-components/InputForm/InputDateForm';
import InputValid from "../../ui-components/InputWithValidation/InputValid";

class GeneralInfoProperty extends Component {
    state = {
        inputEnabled: true,
        open: false,
        scroll: 'paper',
        completedInput: false,
        loaded: false,
        name: '',
        legalName: '',
        description: '',
        location: '',
        address: '',
        optionalAddress: '',
        businessType: '',
        country: 6,
        state: 0,
        region: '',
        city: 0,
        management: '',
        phoneNumber: '',
        startDate: '',
        startWeek: 0,
        endWeek: 6,
        workWeek: '',
        avatar: 'url',
        otherPhoneNumber: '',
        room: '',
        rate: 0,
        fax: '',
        zipCode: '',
        phonePrefix: '505',
        email: '',
        Code: '',
        Code01: '',
        active: 1,
        suite: '',
        linearProgress: false,
        idProperty: null
    };


    /**
     *  QUERIES to get the countries, cities and states
     */
    getCountriesQuery = gql`
		{
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: null, Id_Catalog: 2) {
				Id
				Name
				IsActive
			}
		}
	`;

    getStatesQuery = gql`
		query States($parent: Int!) {
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
				Id
				Name
				IsActive
			}
		}
	`;

    getCitiesQuery = gql`
		query Cities($parent: Int!) {
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 5) {
				Id
				Name
				IsActive
			}
		}
	`;
    /**
     *  End of the countries, cities and states queries
     */

    /*****************************************************************
     *             QUERY to get the company information              *
     ****************************************************************/
    getCompanyQuery = gql`
		query getCompany($id: Int!, $Id_Parent: Int!) {
			getbusinesscompanies(Id: $id, IsActive: 1, Contract_Status: "'C'", Id_Parent: $Id_Parent) {
				Id
				Code
				Code01
				Id_Company
				BusinessType
				Name
				Description
				Start_Week
				End_Week
				Start_Date
				Legal_Name
				Country
				State
				Zipcode
				Fax
				City
				Id_Parent
				IsActive
				User_Created
				User_Updated
				Date_Created
				Date_Updated
				ImageURL
				Rate
				Location
				Location01
				Primary_Email
				Phone_Number
				Suite
			}
		}
	`;

    /**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION *
     **********************************************************/
    ADD_COMPANY = gql`
		mutation insertCompanies($input: iParamBC!) {
			insbusinesscompanies(input: $input) {
				Id
				Name
				Description
			}
		}
	`;

    insertCompany = (id) => {
        // Show a Circular progress
        this.setState({
            linearProgress: true
        }, () => {

            //Create the mutation using apollo global client
            this.props.client
                .mutate({
                    // Pass the mutation structure
                    mutation: this.ADD_COMPANY,
                    variables: {
                        input: {
                            Id: 150,
                            Code: `'${this.state.Code}'`,
                            Code01: `'${this.state.Code}'`,
                            Id_Contract: 1,
                            Id_Company: parseInt(id),
                            BusinessType: 1,
                            Location: `'${this.state.address}'`,
                            Location01: `'${this.state.optionalAddress}'`,
                            Name: `'${this.state.name}'`,
                            Description: `'${this.state.description}'`,
                            Start_Week: this.state.startWeek,
                            End_Week: this.state.endWeek,
                            Legal_Name: `'${this.state.legalName}'`,
                            Country: parseInt(this.state.country),
                            State: parseInt(this.state.state),
                            Rate: parseFloat(this.state.rate),
                            Zipcode: parseInt(this.state.zipCode),
                            Fax: `'${this.state.fax}'`,
                            Primary_Email: `'email'`,
                            Phone_Number: `'${this.state.phoneNumber}'`,
                            Phone_Prefix: `'${this.state.phonePrefix}'`,
                            City: parseInt(this.state.city),
                            Id_Parent: parseInt(id),
                            IsActive: parseInt(this.state.active),
                            User_Created: 1,
                            User_Updated: 1,
                            Date_Created: "'2018-08-14'",
                            Date_Updated: "'2018-08-14'",
                            ImageURL: `'${this.state.avatar}'`,
                            Start_Date: "'2018-08-14'",
                            Contract_URL: "'firebase url'",
                            Insurace_URL: "'firebase url'",
                            Other_URL: "'firebase url'",
                            Other01_URL: "'firebase url'",
                            Suite: parseInt(this.state.suite),
                            Contract_Status: "'C'"
                        }
                    }
                })
                .then((data) => {
                    this.setState({
                        linearProgress: false
                    })
                })
                .catch((err) => console.log('The error is: ' + err));

        });
    };
    /**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION  *
     **********************************************************/

    /**********************************************************
     *  MUTATION TO UPDATE COMPANIES WITH GENERAL INFORMATION *
     **********************************************************/
    UPDATE_COMPANY = gql`
		mutation updateCompanies($input: iParamBC!) {
			updbusinesscompanies(input: $input) {
				Id
				Name
				Description
			}
		}
	`;

    updateCompany = (companyId) => {
        //Create the mutation using apollo global client
        this.props.client
            .mutate({
                // Pass the mutation structure
                mutation: this.UPDATE_COMPANY,
                variables: {
                    input: {
                        Id: companyId,
                        Code: `'${this.state.Code}'`,
                        Code01: `'${this.state.Code}'`,
                        Id_Contract: 1,
                        Id_Company: 1,
                        BusinessType: 1,
                        Location: `'${this.state.address}'`,
                        Location01: `'${this.state.optionalAddress}'`,
                        Name: `'${this.state.legalName}'`,
                        Description: `'${this.state.description}'`,
                        Start_Week: this.state.startWeek,
                        End_Week: this.state.endWeek,
                        Legal_Name: `'${this.state.legalName}'`,
                        Country: parseInt(this.state.country),
                        State: parseInt(this.state.state),
                        Rate: parseFloat(this.state.rate),
                        Zipcode: parseInt(this.state.zipCode),
                        Fax: `'${this.state.fax}'`,
                        Primary_Email: `'${this.state.legalName}'`,
                        Phone_Number: `'${this.state.phoneNumber}'`,
                        Phone_Prefix: `'${this.state.phonePrefix}'`,
                        City: parseInt(this.state.city),
                        Id_Parent: 1,
                        IsActive: parseInt(this.state.active),
                        User_Created: 1,
                        User_Updated: 1,
                        Date_Created: "'2018-08-14'",
                        Date_Updated: "'2018-08-14'",
                        ImageURL: `'${this.state.avatar}'`,
                        Start_Date: "'2018-08-14'",
                        Contract_URL: "'firebase url'",
                        Insurace_URL: "'firebase url'",
                        Other_URL: "'firebase url'",
                        Other01_URL: "'firebase url'",
                        Suite: parseInt(this.state.suite),
                        Contract_Status: "'C'"
                    }
                }
            })
            .then((data) => {
                console.log('Server data response is: ' + data);
            })
            .catch((err) => {
                //Capture error and show a specific message

                console.log('The error is: ' + err)
            });
    };


    handleFormSubmit = (event) => {
        event.preventDefault();

        let invalidInputs = document.querySelectorAll("input[required]");

        let i;
        for (i = 0; i < invalidInputs.length; ++i) {
            invalidInputs[i].classList.add('invalid');
        }
    };

    /**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION  *
     **********************************************************/

    render() {
        if (this.state.linearProgress) {
            return <LinearProgress/>
        }

        let invalidInputs = document.querySelectorAll("input[required]"),
            i;

        for (i = 0; i < invalidInputs.length; ++i) {
            if (invalidInputs[i].value !== '') {
                invalidInputs[i].classList.remove('invalid');
            }
        }

        return (
            <form onSubmit={this.handleFormSubmit} noValidate>
                <div className="general-information__content">
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Property Name</span>
                            <InputValid
                                change={(text) => {
                                    this.setState({
                                        name: text
                                    })
                                }}
                                value={this.state.name}
                                type="text"
                                required
                            />
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Address</span>
                            <InputValid
                                change={(text) => {
                                    this.setState({
                                        address: text
                                    })
                                }}
                                value={this.state.address}
                                type="text"
                                required
                            />

                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Address 2</span>
                            <InputValid
                                change={(text) => {
                                    this.setState({
                                        optionalAddress: text
                                    })
                                }}
                                value={this.state.optionalAddress}
                                type="text"
                                required
                            />
                        </div>
                    </div>
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Suite</span>
                            <InputValid
                                change={(text) => {
                                    this.setState({
                                        suite: text
                                    })
                                }}
                                value={this.state.suite}
                                type="number"
                                required
                            />
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">States</span>
                            <Query query={this.getStatesQuery} variables={{parent: 6}}>
                                {({loading, error, data, refetch, networkStatus}) => {
                                    //if (networkStatus === 4) return <LinearProgress />;
                                    if (loading) return <LinearProgress/>;
                                    if (error) return <p>Error </p>;
                                    if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                        console.log('VALUE: ' + data.getcatalogitem);
                                        return (
                                            <SelectForm
                                                data={data.getcatalogitem}
                                                update={(value) => {
                                                }}
                                                value={this.state.IsActive}
                                            />
                                        );
                                    }
                                    return <p>Nothing to display </p>;
                                }}
                            </Query>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">City</span>
                            <Query query={this.getCitiesQuery} variables={{parent: 140}}>
                                {({loading, error, data, refetch, networkStatus}) => {
                                    //if (networkStatus === 4) return <LinearProgress />;
                                    if (loading) return <LinearProgress/>;
                                    if (error) return <p>Error </p>;
                                    if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                        console.log('Data of cities' + data.getcatalogitem);
                                        return (
                                            <SelectForm
                                                data={data.getcatalogitem}
                                                update={(value) => {
                                                }}
                                                value={this.state.IsActive}
                                            />
                                        );
                                    }
                                    return <p>Nothing to display </p>;
                                }}
                            </Query>
                        </div>
                    </div>
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Zip Code</span>
                            <InputValid
                                change={(text) => {
                                    this.setState({
                                        zipCode: text
                                    })
                                }}
                                value={this.state.zipCode}
                                type="number"
                                required
                            />
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Phone Number</span>
                            <InputValid
                                change={(text) => {
                                    this.setState({
                                        phoneNumber: text
                                    })
                                }}
                                value={this.state.phoneNumber}
                                type="number"
                                required
                            />
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Fax Week</span>
                            <InputValid
                                change={(text) => {
                                    this.setState({
                                        fax: text
                                    })
                                }}
                                value={this.state.fax}
                                type="number"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="general-information__content">
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Property Code</span>
                            <InputValid
                                change={(text) => {
                                    this.setState({
                                        Code: text
                                    })
                                }}
                                value={this.state.Code}
                                type="text"
                                required
                            />
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Cost Center</span>
                            <InputValid
                                type="number"
                                required
                                value={this.state.Code01}
                                change={(text) => {
                                    this.setState({
                                        Code01: text
                                    });
                                }}
                            />
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Contract Start Date</span>
                            <InputDateForm
                                value={this.state.startDate}
                                change={(text) => {
                                    this.setState({
                                        startDate: text
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Room</span>
                            <InputValid
                                change={(text) => {
                                    this.setState({
                                        room: text
                                    })
                                }}
                                type="number"
                                required
                            />
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Week Start</span>
                            <SelectForm data={days} update={(value) => {
                            }} value={this.state.IsActive}/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Contract</span>
                            <InputValid
                                change={(text) => {
                                    this.setState({
                                        legalName: text
                                    })
                                }}
                                type="text"
                                required/>
                        </div>
                    </div>
                </div>

                <div className="contract-footer--bottom">
                    {/*<div*/}
                    {/*className="contract-next-button"*/}
                    {/*onClick={() => {*/}
                    {/*//this.insertCompany(this.props.idCompany);*/}
                    {/*this.props.next();*/}
                    {/*}}*/}
                    {/*>*/}
                    {/*Next*/}
                    {/*</div>*/}
                    <input type="submit" value="Next" className="contract-next-button"/>
                </div>
            </form>
        );
    }
}

GeneralInfoProperty.propTypes = {};

export default withApollo(GeneralInfoProperty);
