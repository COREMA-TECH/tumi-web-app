import React, {Component} from 'react';
import './index.css';
import status from '../../../data/statusContract.json';
import intervalDays from '../../../data/ownerExpirationNotice.json';
import SelectForm from '../../ui-components/SelectForm/SelectForm';
import {gql} from 'apollo-boost';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import InputForm from "../../ui-components/InputForm/InputForm";
import AccountDialog from "../../ui-components/AccountDialog/AccountDialog";
import ContactDialog from "../../ui-components/AccountDialog/ContactDialog";
import InputDateForm from "../../ui-components/InputForm/InputDateForm";
import Query from "react-apollo/Query";
import withApollo from "react-apollo/withApollo";
import TextAreaForm from "../../ui-components/InputForm/TextAreaForm";

class NewContract extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: true,
            scroll: 'paper',
            Id: '',
            Id_Company: '',
            Contract_Name: '',
            Contrat_Owner: '',
            Id_Entity: '',
            Id_User_Signed: '',
            User_Signed_Title: '',
            Signed_Date: '',
            Contract_Status: '',
            Contract_Start_Date: '',
            Contract_Term: '',
            Owner_Expiration_Notification: '',
            Company_Signed: '',
            Company_Signed_Date: '',
            Id_User_Billing_Contact: '',
            Billing_Street: '',
            Billing_City: 0,
            Billing_State: 0,
            Billing_Zip_Code: '',
            Billing_Country: 6,
            Contract_Terms: '',
            Exhibit_B: '',
            Exhibit_C: '',
            Exhibit_D: '',
            Exhibit_E: '',
            Exhibit_F: '',
            IsActive: '',
            User_Created: '',
            User_Updated: '',
            Date_Created: '',
            Date_Updated: ''
        };
    }

    componentWillMount() {
    }

    updateStatus = (id) => {
        this.setState({
            IsActive: id
        });
    };

    updateCountry = (id) => {
        this.setState({
            Billing_Country: id
        });
    };

    updateProvidence = (id) => {
        this.setState({
            Billing_State: id
        });
    };

    updateCity = (id) => {
        this.setState({
            Billing_City: id
        });
    };

    updateCompany = (id) => {
    };

    updateOwnerExpirationNotification = (id) => {
        this.setState({
            Owner_Expiration_Notification: id
        });
    };

    updateIdCompany = (id) => {
        this.setState({
            Id_Entity: id
        });

        this.props.updateCompanyId(id);
    };

    updateId_User_Billing_Contact = (id) => {
        this.setState({
            Id_User_Billing_Contact: id
        });

        alert(this.state.Id_User_Billing_Contact);
    };

    updateIdContact = (id) => {
        this.setState({
            Id_User_Signed: id
        });
    };

    /**
     * Events of the component
     */
    handleClickOpen = (scroll) => () => {
        this.setState({open: true, scroll});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    /**
     * End of the events
     */

    /**************************************
     *   MUTATION TO CREATE NEW CONTRACT  *
     *************************************/
    ADD_CONTRACT = gql`
        mutation inscontracts($input: iContracts!) {
            inscontracts(input: $input) {
                Id
            }
        }
    `;

    insertContract = () => {
        //Create the mutation using apollo global client
        this.props.client
            .mutate({
                // Pass the mutation structure
                mutation: this.ADD_CONTRACT,
                variables: {
                    input: {
                        Id: 1,
                        Id_Company: 1,
                        Contract_Name: `'${this.state.Contract_Name}'`,
                        Contrat_Owner: `'${this.state.Contrat_Owner}'`,
                        Id_Entity: parseInt(this.state.Id_Entity),
                        Id_User_Signed: parseInt(this.state.Id_User_Signed),
                        User_Signed_Title: `'${this.state.User_Signed_Title}'`,
                        Signed_Date: `'${this.state.Signed_Date}'`,
                        Contract_Status: `'${this.state.Contract_Status}'`,
                        Contract_Start_Date: `'${this.state.Contract_Start_Date}'`,
                        Contract_Term: 1,
                        Owner_Expiration_Notification: parseInt(this.state.Owner_Expiration_Notification),
                        Company_Signed: `'${this.state.Company_Signed}'`,
                        Company_Signed_Date: `'${this.state.Company_Signed_Date}'`,
                        Id_User_Billing_Contact: 1,
                        Billing_Street: `'${this.state.Billing_Street}'`,
                        Billing_City: 1,
                        Billing_State: 1,
                        Billing_Zip_Code: 1,
                        Billing_Country: 1,
                        Contract_Terms: `'${this.state.Contract_Terms}'`,
                        Exhibit_B: "''",
                        Exhibit_C: "''",
                        Exhibit_D: "''",
                        Exhibit_E: "''",
                        Exhibit_F: "''",
                        IsActive: parseInt(this.state.IsActive),
                        User_Created: 1,
                        User_Updated: 1,
                        Date_Created: "'2018-08-14'",
                        Date_Updated: "'2018-08-14'"
                    }
                }
            })
            .then(({data}) => {
                console.log('Server data response is: ' + data.inscontracts);
                this.props.update(data.inscontracts.Id);
            })
            .catch((err) => console.log('The error is: ' + err));
    };

    /**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION  *
     **********************************************************/

    /**
     * QUERY to get companies
     */

    getCompaniesQuery = gql`
        {
            getcompanies(Id: null, IsActive: 1) {
                Id
                Name
                LegalName
            }
        }
    `;

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

    render() {
        return (
            <div className="contract-container">
                <div className="contract-body">
                    <div className="contract-body__content">
                        <div className="contract-body-row">
                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                    <span className="contract-body__subtitle">Contact Information</span>
                                </div>
                                <div className="contract-body-row__form">
                                    <div className="card-form-body">
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Name</span>
                                            <InputForm
                                                value={this.state.Contract_Name}
                                                change={(text) => {
                                                    this.setState({
                                                        Contract_Name: text
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Owner</span>
                                            <InputForm
                                                value={this.state.Contract_Owner}
                                                change={(text) => {
                                                    this.setState({
                                                        Contract_Owner: text
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Account Name</span>
                                            <AccountDialog
                                                update={this.updateIdCompany}
                                                updateCompanySignedBy={(value) => {
                                                    this.setState({
                                                        Company_Signed: value.trim()
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Customer Signed By</span>
                                            <ContactDialog
                                                idContact={this.state.Id_Entity}
                                                update={this.updateIdContact}
                                            />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Customer Signed Title</span>
                                            <InputForm
                                                value={this.state.User_Signed_Title}
                                                change={(text) => {
                                                    this.setState({
                                                        User_Signed_Title: text
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Customer Signed Date</span>
                                            <InputDateForm
                                                value={this.state.Signed_Date}
                                                change={(text) => {
                                                    this.setState({
                                                        Signed_Date: text
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="contract-body-row__form">
                                    <div className="card-form-body">
                                        <div className="card-form-row">
                                            <span className="input-label primary">Status</span>
                                            <SelectForm
                                                data={status}
                                                update={this.updateStatus}
                                                value={this.state.IsActive}
                                            />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Start Date</span>
                                            <InputDateForm
                                                value={this.state.Contract_Start_Date}
                                                change={(text) => {
                                                    this.setState({
                                                        Contract_Start_Date: text
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Term (months)</span>
                                            <InputForm
                                                value={this.state.Contract_Term}
                                                change={(text) => {
                                                    this.setState({
                                                        Contract_Term: text
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Owner Expiration Notice</span>
                                            <SelectForm
                                                data={intervalDays}
                                                update={this.updateOwnerExpirationNotification}
                                                value={this.state.Owner_Expiration_Notification}
                                            />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Company Signed By</span>
                                            <InputForm value={this.state.Company_Signed} change={(text) => {
                                            }}/>
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Company Signed Date</span>
                                            <InputDateForm
                                                value={this.state.Company_Signed_Date}
                                                change={(text) => {
                                                    this.setState({
                                                        Company_Signed_Date: text
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                    <span className="contract-body__subtitle">Billing Information</span>
                                </div>
                                <div className="contract-body-row__form">
                                    <div className="card-form-body">
                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing Name</span>
                                            <InputForm
                                                value={this.state.Id_User_Billing_Contact}
                                                change={(text) => {
                                                    this.setState({
                                                        Id_User_Billing_Contact: text
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing Street</span>
                                            <InputForm
                                                value={this.state.Billing_Street}
                                                change={(text) => {
                                                    this.setState({
                                                        Billing_Street: text
                                                    });
                                                }}
                                            />
                                        </div>

                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing Country</span>
                                            <Query query={this.getCountriesQuery}>
                                                {({loading, error, data, refetch, networkStatus}) => {
                                                    //if (networkStatus === 4) return <LinearProgress />;
                                                    if (loading) return <LinearProgress/>;
                                                    if (error) return <p>Error </p>;
                                                    if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                        console.log('Data of cities' + data.getcatalogitem);
                                                        return (
                                                            <SelectForm
                                                                data={data.getcatalogitem}
                                                                update={this.updateCountry}
                                                                value={this.state.Billing_Country}
                                                            />
                                                        );
                                                    }
                                                    return <p>Nothing to display </p>;
                                                }}
                                            </Query>
                                        </div>

                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing State / Providence</span>

                                            <Query
                                                query={this.getStatesQuery}
                                                variables={{parent: this.state.Billing_Country}}
                                            >
                                                {({loading, error, data, refetch, networkStatus}) => {
                                                    //if (networkStatus === 4) return <LinearProgress />;
                                                    if (loading) return <LinearProgress/>;
                                                    if (error) return <p>Error </p>;
                                                    if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                        console.log('Data of cities' + data.getcatalogitem);
                                                        return (
                                                            <SelectForm
                                                                data={data.getcatalogitem}
                                                                update={this.updateProvidence}
                                                                value={this.state.Billing_State}
                                                            />
                                                        );
                                                    }
                                                    return <p>Nothing to display </p>;
                                                }}
                                            </Query>
                                        </div>

                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing City</span>
                                            <Query
                                                query={this.getCitiesQuery}
                                                variables={{parent: this.state.Billing_State}}
                                            >
                                                {({loading, error, data, refetch, networkStatus}) => {
                                                    //if (networkStatus === 4) return <LinearProgress />;
                                                    if (loading) return <LinearProgress/>;
                                                    if (error) return <p>Error </p>;
                                                    if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                                        console.log('Data of cities' + data.getcatalogitem);
                                                        return (
                                                            <SelectForm
                                                                data={data.getcatalogitem}
                                                                update={this.updateCity}
                                                                value={this.state.Billing_City}
                                                            />
                                                        );
                                                    }
                                                    return <p>Nothing to display </p>;
                                                }}
                                            </Query>
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing Zip Code / Postal Code</span>
                                            <InputForm
                                                value={this.state.Billing_Zip_Code}
                                                change={(text) => {
                                                    this.setState({
                                                        Billing_Zip_Code: text
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                    <span className="contract-body__subtitle">Contract Information</span>
                                </div>
                                <div className="contract-body-row__form">
                                    <div className="card-form-body">
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Terms</span>
                                            <TextAreaForm
                                                value={this.state.Contract_Terms}
                                                change={(text) => {
                                                    this.setState({
                                                        Contract_Terms: text
                                                    });
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contract-footer">
                            <div
                                className="contract-next-button"
                                onClick={() => {
                                    // alert("Alert")
                                    this.insertContract();
                                }}
                            >
                                Save
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withApollo(NewContract);
