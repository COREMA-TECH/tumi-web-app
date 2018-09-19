import React, {Component} from 'react';
import {gql} from 'apollo-boost';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import Query from 'react-apollo/Query';
import days from '../../../data/days.json';
import withApollo from 'react-apollo/withApollo';
import InputValid from "../../ui-components/InputWithValidation/InputValid";
import InputMask from "react-input-mask";
import FileUpload from 'ui-components/FileUpload/FileUpload';
import SelectNothingToDisplay from "../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay";

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
        startWeek: '',
        endWeek: '',
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
        idProperty: null,
        validState: '',
        validCity: '',
        validStartWeek: '',
        validEndWeek: '',
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
                            Code01: `'${this.state.Code01}'`,
                            Id_Contract: 1,
                            Id_Company: parseInt(id),
                            BusinessType: 1,
                            Location: `'${this.state.address}'`,
                            Location01: `'${this.state.optionalAddress}'`,
                            Name: `'${this.state.name}'`,
                            Description: `'${this.state.description}'`,
                            Start_Week: this.state.startWeek,
                            End_Week: this.state.endWeek,
                            Legal_Name: "''",
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
                .then(({data}) => {
                    this.props.updateIdProperty(parseInt(data.insbusinesscompanies.Id));

                    this.setState({
                        linearProgress: false
                    });

                    this.props.next();

                    this.props.handleOpenSnackbar(
                        'success',
                        'Success: Property created'
                    );
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

    updateCompany = (companyId, updatedId) => {
        //Create the mutation using apollo global client
        this.setState({
            linearProgress: true
        }, () => {
            this.props.client
                .mutate({
                    // Pass the mutation structure
                    mutation: this.UPDATE_COMPANY,
                    variables: {
                        input: {
                            Id: parseInt(updatedId),
                            Code: `'${this.state.Code}'`,
                            Code01: `'${this.state.Code01}'`,
                            Id_Contract: 1,
                            Id_Company: parseInt(companyId),
                            BusinessType: 1,
                            Location: `'${this.state.address}'`,
                            Location01: `'${this.state.optionalAddress}'`,
                            Name: `'${this.state.name}'`,
                            Description: `'${this.state.description}'`,
                            Start_Week: this.state.startWeek,
                            End_Week: this.state.endWeek,
                            Legal_Name: "''",
                            Country: parseInt(this.state.country),
                            State: parseInt(this.state.state),
                            Rate: parseFloat(this.state.rate),
                            Zipcode: parseInt(this.state.zipCode),
                            Fax: `'${this.state.fax}'`,
                            Primary_Email: `'email'`,
                            Phone_Number: `'${this.state.phoneNumber}'`,
                            Phone_Prefix: `'${this.state.phonePrefix}'`,
                            City: parseInt(this.state.city),
                            Id_Parent: parseInt(companyId),
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
                    this.props.next();

                    this.props.handleOpenSnackbar(
                        'success',
                        'Success: Property updated'
                    );

                    this.setState({
                        linearProgress: false
                    });
                })
                .catch((err) => {
                    //Capture error and show a specific message

                    console.log('The error is: ' + err)
                });
        })
    };


    handleFormSubmit = (event) => {
        event.preventDefault();

        // To set error in inputs
        let invalidInputs = document.querySelectorAll("input[required]"), i, validated = true;
        for (i = 0; i < invalidInputs.length; ++i) {
            if (invalidInputs[i].value !== '') {
                invalidInputs[i].classList.remove('invalid');

            } else {
                invalidInputs[i].classList.add('invalid');

                validated = false;
            }
        }

        //To set errors in selects
        if (this.state.city === 0) {
            this.setState({
                validCity: 'valid'
            });

            validated = false;
        }

        if (this.state.state === 0) {
            this.setState({
                validState: 'valid'
            });

            validated = false;
        }

        if (this.state.startWeek === '') {
            this.setState({
                validStartWeek: 'valid'
            });

            validated = false;
        }

        if (this.state.endWeek === '') {
            this.setState({
                validEndWeek: 'valid'
            });

            validated = false;
        }

        if (validated) {
            //Show loading component
            if(this.props.idProperty === null) {
                this.insertCompany(this.props.idCompany);
            } else {
                this.updateCompany(this.props.idCompany, this.props.idProperty)
            }
        } else {
            // Show snackbar warning
            this.props.handleOpenSnackbar(
                'warning',
                'Error: Saving Information: You must fill all the required fields'
            );
        }
    };

    // To set style in required input
    changeStylesInCompletedInputs = () => {
        let invalidInputs = document.querySelectorAll("input[required]"),
            i;

        for (i = 0; i < invalidInputs.length; ++i) {
            if (invalidInputs[i].value !== '') {
                invalidInputs[i].classList.remove('invalid');
            }
        }
    };

    /**
     * Get data from property
      */
    getPropertyData = (idProperty, idParent) => {
        this.setState({
            linearProgress: true
        }, () => {
            this.props.client
                .query({
                    query: this.getCompanyQuery,
                    variables: {
                        id: idProperty,
                        Id_Parent: idParent
                    },
                    fetchPolicy: 'no-cache'
                })
                .then(({data}) => {
                    if(data.getbusinesscompanies !== null){
                        let item = data.getbusinesscompanies[0];
                        this.setState({
                            name: item.Name.trim(),
                            legalName: item.Legal_Name.trim(),
                            description: item.Description.trim(),
                            startWeek: item.Start_Week,
                            endWeek: item.End_Week,
                            address: item.Location.trim(),
                            optionalAddress: item.Location01.trim(),

                            country: item.Country,
                            state: item.State,
                            city: item.City,

                            rate: item.Rate,
                            email: item.Primary_Email.trim(),
                            phoneNumber: item.Phone_Number.trim(),

                            Code: item.Code.trim(),
                            Code01: item.Code01.trim(),
                            zipCode: item.Zipcode,
                            fax: item.Fax,
                            startDate: item.Start_Date.trim(),
                            active: item.IsActive,
                            suite: item.Suite,
                        });

                        this.setState({
                            linearProgress: false
                        });
                    } else {
                        // TODO: Show a error message
                    }
                })
                .catch();
        });
    };

    componentWillMount(){
        if(this.props.idProperty !== null) {
            this.getPropertyData(this.props.idProperty, this.props.idCompany);
        } else {
            // Show Snackbar
        }
    }


    render() {
        this.changeStylesInCompletedInputs();

        if(this.state.linearProgress) {
            return <LinearProgress />
        }

        return (
            <form onSubmit={this.handleFormSubmit} noValidate>
                <div className="container">
                    <div className="row">
                        <div className="col-6">
                            <div className="card-wrapper">
                                <div class="card-form-header grey">General Information</div>
                                <div className="row">
                                    <div className="col-6">
                                        <span className="primary card-input-label">Property Name</span>
                                    </div>
                                    <div className="col-6">
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
                                    <div className="col-6">
                                        <span className="primary card-input-label">Address</span>
                                    </div>
                                    <div className="col-6">
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
                                    <div className="col-6">
                                        <span className="primary card-input-label">Address 2</span>
                                    </div>
                                    <div className="col-6">
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
                                    <div className="col-6">
                                        <span className="primary card-input-label">Suite</span>
                                    </div>
                                    <div className="col-6">
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
                                    <div className="col-6">
                                        <span className="primary card-input-label">States</span>
                                    </div>
                                    <div className="col-6">
                                        <Query query={this.getStatesQuery} variables={{parent: 6}}>
                                            {({loading, error, data, refetch, networkStatus}) => {
                                                //if (networkStatus === 4) return <LinearProgress />;
                                                if (loading) return <LinearProgress/>;
                                                if (error) return <p>Error </p>;
                                                if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                    console.log('VALUE: ' + data.getcatalogitem);
                                                    return (
                                                        <SelectForm
                                                            name="state"
                                                            value={this.state.state}
                                                            data={data.getcatalogitem}
                                                            error={this.state.validState === '' ? false : true}
                                                            update={(value) => {
                                                                this.setState({
                                                                    state: value,
                                                                    validState: ''
                                                                })
                                                            }}
                                                        />
                                                    );
                                                }
                                                return <SelectNothingToDisplay />
                                            }}
                                        </Query>
                                    </div>
                                    <div className="col-6">
                                        <span className="primary card-input-label">City</span>
                                    </div>
                                    <div className="col-6">
                                        <Query query={this.getCitiesQuery} variables={{parent: this.state.state}}>
                                            {({loading, error, data, refetch, networkStatus}) => {
                                                //if (networkStatus === 4) return <LinearProgress />;
                                                if (loading) return <LinearProgress/>;
                                                if (error) return <p>Error </p>;
                                                if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                    console.log('Data of cities' + data.getcatalogitem);
                                                    return (
                                                        <SelectForm
                                                            name="city"
                                                            value={this.state.city}
                                                            data={data.getcatalogitem}
                                                            error={this.state.validCity === '' ? false : true}
                                                            update={(value) => {
                                                                this.setState({
                                                                    city: value,
                                                                    validCity: ''
                                                                })
                                                            }}
                                                        />
                                                    );
                                                }
                                                return <p>Nothing to display </p>;
                                            }}
                                        </Query>
                                    </div>
                                    <div className="col-6">
                                        <span className="primary card-input-label">Zip Code</span>
                                    </div>
                                    <div className="col-6">
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
                                    <div className="col-6">
                                        <span className="primary card-input-label">Phone Number</span>
                                    </div>
                                    <div className="col-6">
                                        <InputMask
                                            id="number"
                                            name="number"
                                            mask="+(999) 999-9999"
                                            maskChar=" "
                                            value={this.state.phoneNumber}
                                            className={'input-form'}
                                            onChange={(e) => {
                                                this.setState({
                                                    phoneNumber: e.target.value
                                                })
                                            }}
                                            placeholder="+(999) 999-9999"
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <span className="primary card-input-label">Fax Week</span>
                                    </div>
                                    <div className="col-6">
                                        <InputMask
                                            id="number"
                                            name="number"
                                            mask="+(999) 999-9999"
                                            maskChar=" "
                                            value={this.state.fax}
                                            className={'input-form'}
                                            onChange={(e) => {
                                                this.setState({
                                                    fax: e.target.value
                                                })
                                            }}
                                            placeholder="+(999) 999-9999"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="card-wrapper">
                                <div class="card-form-header yellow">Legal Docs</div>
                                <div className="row">
                                    <div className="col-6">
                                        <span className="primary card-input-label">Property Code</span>
                                    </div>
                                    <div className="col-6">
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
                                    <div className="col-6">
                                        <span className="primary card-input-label">Cost Center</span>
                                    </div>
                                    <div className="col-6">
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
                                    <div className="col-6">
                                        <span className="primary card-input-label">Contract Start Date</span>
                                    </div>
                                    <div className="col-6">
                                        <InputValid
                                            change={(text) => {
                                                this.setState({
                                                    startDate: text
                                                })
                                            }}
                                            value={this.state.startDate}
                                            type="date"
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <span className="primary card-input-label">Room</span>
                                    </div>
                                    <div className="col-6">
                                        <InputValid
                                            change={(text) => {
                                                this.setState({
                                                    room: text
                                                })
                                            }}
                                            value={this.state.room}
                                            type="number"
                                            required
                                        />
                                    </div>
                                    <div className="col-6">
                                        <span className="primary card-input-label">Week Start</span>
                                    </div>
                                    <div className="col-6">
                                        <div className="row">
                                            <div className="col-5">
                                                <SelectForm
                                                    data={days}
                                                    update={(value) => {
                                                        if(value === 0){
                                                            this.setState({
                                                                startWeek: value,
                                                                validStartWeek: 'valid'
                                                            })
                                                        } else {
                                                            this.setState({
                                                                startWeek: value,
                                                                validStartWeek: ''
                                                            });
                                                        }
                                                    }}
                                                    value={this.state.startWeek}
                                                    error={this.state.validStartWeek === '' ? false : true}
                                                />
                                            </div>
                                            <div className="col-2">
                                                <span>To</span>
                                            </div>
                                            <div className="col-5">
                                                <SelectForm
                                                    data={days}
                                                    update={(value) => {
                                                        if(value === 0){
                                                            this.setState({
                                                                endWeek: value,
                                                                validEndWeek: 'valid'
                                                            })
                                                        } else {
                                                            this.setState({
                                                                endWeek: value,
                                                                validEndWeek: ''
                                                            });
                                                        }
                                                    }}
                                                    value={this.state.endWeek}
                                                    error={this.state.validEndWeek === '' ? false : true}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <span className="primary card-input-label">Contract</span>
                                    </div>
                                    <div className="col-6">
                                        <FileUpload
                                            updateURL={(url) => {
                                                this.setState({
                                                    contractURL: url
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <span className="primary card-input-label">Insurance</span>
                                    </div>
                                    <div className="col-6">
                                        <FileUpload
                                            updateURL={(url) => {
                                                this.setState({
                                                    contractURL: url
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <span className="primary card-input-label">Other</span>
                                    </div>
                                    <div className="col-6">
                                        <FileUpload
                                            updateURL={(url) => {
                                                this.setState({
                                                    contractURL: url
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <span className="primary card-input-label">Other 2</span>
                                    </div>
                                    <div className="col-6">
                                        <FileUpload
                                            updateURL={(url) => {
                                                this.setState({
                                                    contractURL: url
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contract-footer--bottom">
                    <input type="submit" value="Next" className="contract-next-button"/>
                </div>
            </form>
        );
    }
}

GeneralInfoProperty.propTypes = {};

export default withApollo(GeneralInfoProperty);
