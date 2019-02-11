import React, { Component } from 'react';
import './index.css';
import InputForm from 'ui-components/InputForm/InputForm';
import status from '../../../data/statusContract.json';
import intervalDays from '../../../data/ownerExpirationNotice.json';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import { gql } from 'apollo-boost';
import withApollo from 'react-apollo/withApollo';
import InputDateForm from 'ui-components/InputForm/InputDateForm';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Query from 'react-apollo/Query';
import AccountDialog from 'ui-components/AccountDialog/AccountDialog';
import ContactDialog from 'ui-components/AccountDialog/ContactDialog';
import SelectFormContractTemplate from 'ui-components/SelectForm/SelectFormContractTemplate';
import withGlobalContent from 'Generic/Global';

import PropTypes from 'prop-types';
import 'ui-components/InputForm/index.css';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import SelectNothingToDisplay from '../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import { Route } from "react-router-dom";
import axios from 'axios';
import LocationForm from '../../ui-components/LocationForm';

const styles = (theme) => ({
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    buttonSuccess: {
        background: ' #3da2c7',
        borderRadius: '5px',
        padding: '.5em 1em',

        fontWeight: '300',
        fontFamily: 'Segoe UI',
        fontSize: '1.1em',
        color: '#fff',
        textTransform: 'none',
        //cursor: pointer;
        margin: '2px',

        //	backgroundColor: '#357a38',
        color: 'white',
        '&:hover': {
            background: ' #3da2c7'
        }
    },

    buttonProgress: {
        //color: ,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    }
});

class NewContract extends Component {
    DEFAULT_STATE = {
        Contract_NameValid: true,
        Legal_NameValid: true,
        Contrat_OwnerValid: true,
        Id_Contract_TemplateValid: true,
        Id_EntityValid: true,
        Id_User_SignedValid: true,
        User_Signed_TitleValid: true,
        Signed_DateValid: true,
        IsActiveValid: true,
        Contract_StatusValid: true,
        Contract_Start_DateValid: true,
        Contract_TermValid: true,
        contractExpirationValid: true,
        Owner_Expiration_NotificationValid: true,
        CompanySignedNameValid: true,
        Company_Signed_DateValid: true,
        Id_User_Billing_ContactValid: true,
        Billing_StreetValid: true,
        Billing_StateValid: true,
        Billing_CityValid: true,
        Billing_Zip_CodeValid: true,
        Id_ManagementValid: true,
        Id_HotelValid: true,
        validForm: true
    };

    constructor(props) {
        super(props);
        this.state = {
            Id: '',
            Id_Company: '',
            Contract_Name: '',
            Contrat_Owner: localStorage.getItem('FullName'),
            contractTemplateId: 1,

            Id_Contract_Template: 1,
            Id_Entity: props.Id_Entity,
            Id_User_Signed: '',
            User_Signed_Title: '',
            Signed_Date: this.getNewDate(),
            Contract_Status: 0,

            Contract_Start_Date: this.getNewDate(),
            contractExpiration: this.getNewDate(),

            Contract_Term: 222,
            NewContract_Term: '',
            Display_Contract_Term: '',
            Owner_Expiration_Notification: '',
            Company_Signed: 0,
            Company_Signed_Date: this.getNewDate(),

            Legal_Name: '',
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
            IsActive: 1,
            IdManagement: props.Id_Parent != null ? props.Id_Parent : 0,
            Management: '',
            User_Created: '',
            User_Updated: '',
            Date_Created: '',
            Date_Updated: '',
            CompanySignedName: 'Stephen A. Robbins',
            open: false,
            scroll: 'paper',
            managementDialog: false,
            Electronic_Address: '',
            loaded: false,
            loading: false,
            loadingCompanies: false,
            loadingInsert: false,
            loadingUpdate: false,
            cityFinal: 0,
            address: '',
            zipCode: '',
            state: 0,
            city: 0,
            Disable_Billing_Zip_Code: false,
            Disable_Billing_Street: false,
            Old_Billing_City: 0,
            Old_Billing_State: 0,
            Old_Billing_Street: '',
            Old_Billing_Zip_Code: '',
            ...this.DEFAULT_STATE
        };
    }

    updateStatus = (id) => {
        this.setState(
            {
                Contract_Status: id

            },
            () => {
                this.validateField('Contract_Status', id);
            }
        );
    };

    updateProvidence = (Billing_State) => {
        this.setState(
            {
                Billing_State
            },
            () => {
                this.validateField('Billing_State', Billing_State);
            }
        );
    };

    updateCity = (Billing_City) => {
        this.setState(
            {
                Billing_City
            },
            () => {
                this.validateField('Billing_City', Billing_City);
            }
        );
    };

    updateZipCode = (Billing_Zip_Code) => {
        this.setState(
            {
                Billing_Zip_Code
            },
            () => {
                this.validateField('Billing_Zip_Code', Billing_Zip_Code);
            }
        );
    };

    updateOwnerExpirationNotification = (id) => {
        this.setState(
            {
                Owner_Expiration_Notification: id
            },
            () => {
                this.validateField('Owner_Expiration_Notification', id);
            }
        );
    };

    //aqui esta el id
    updateIdCompany = (id) => {
        this.setState(
            {
                Id_Entity: id == 0 ? this.state.Id_Entity : id,
                loadingCompanies: true
            },
            () => {
                this.setState(
                    {
                        Id_User_Signed: null,
                        Id_User_Billing_Contact: null,
                        User_Signed_Title: ''
                    },
                    () => {
                        this.setState(
                            {
                                loadingCompanies: false
                            },
                            () => {
                                this.validateField('Id_Entity', id);
                            }
                        );
                    }
                );
            }
        );

        this.props.updateCompanyId(id);
    };

    updateIdContact = (id) => {
        this.setState(
            {
                Id_User_Signed: id
            },
            () => {
                this.validateField('Id_User_Signed', id);
            }
        );
    };

    handleClose = () => {
        this.setState({ open: false });
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

    UPDATE_CONTRACT = gql`
        mutation updcontracts($input: iContracts!) {
            updcontracts(input: $input) {
                Id
            }
        }
    `;

    GET_CONTRACT = gql`
        {
            getcontracttemplate(Id: null, IsActive: 1) {
                Id
                Name
                Contract_Template
            }
        }
    `;

    GET_CONTRACT_BY_ID = gql`
        query getContractById($Id: Int!) {
            getcontracts(Id: $Id, IsActive: null) {
                Id
                Id_Company
                Contract_Name
                Contrat_Owner
                IdManagement
                Id_Entity
                Id_User_Signed
                User_Signed_Title
                Signed_Date
                Contract_Status
                Contract_Start_Date
                Contract_Term
                Owner_Expiration_Notification
                Company_Signed
                Company_Signed_Date
                Id_User_Billing_Contact
                Billing_Street
                Billing_City
                Billing_State
                Billing_Zip_Code
                Billing_Country
                Contract_Terms
                Id_Contract_Template
                Exhibit_B
                Exhibit_C
                Exhibit_D
                Exhibit_E
                Exhibit_F
                IsActive
                User_Created
                User_Updated
                Date_Created
                Date_Updated
                Client_Signature
                Company_Signature
                Contract_Expiration_Date
                legalName
            }
        }
    `;

    getString = (value) => {
        if (value) return value.trim();
        else return '';
    };
    // To get the data by a specific contact using the ID
    getContractData = (id) => {
        this.setState({
            loading: true
        });

        this.props.client
            .query({
                query: this.GET_CONTRACT_BY_ID,
                fetchPolicy: 'no-cache',
                variables: {
                    Id: id
                }
            })
            .then(({ data }) => {
                this.setState(
                    {

                        Contract_Name: this.getString(data.getcontracts[0].Contract_Name),
                        Contrat_Owner: this.getString(data.getcontracts[0].Contrat_Owner),
                        IdManagement: data.getcontracts[0].IdManagement,
                        Id_Entity: data.getcontracts[0].Id_Entity,
                        Id_User_Signed: data.getcontracts[0].Id_User_Signed,
                        Contract_Status: data.getcontracts[0].Contract_Status,
                        User_Signed_Title: this.getString(data.getcontracts[0].User_Signed_Title),
                        Id_User_Billing_Contact: data.getcontracts[0].Id_User_Billing_Contact,
                        Signed_Date: data.getcontracts[0].Signed_Date,
                        Contract_Start_Date: data.getcontracts[0].Contract_Start_Date,
                        Contract_Term: data.getcontracts[0].Contract_Term,
                        Id_Contract_Template: data.getcontracts[0].Id_Contract_Template,
                        contractExpiration: data.getcontracts[0].Contract_Expiration_Date,
                        Owner_Expiration_Notification: data.getcontracts[0].Owner_Expiration_Notification,
                        Company_Signed: this.getString(data.getcontracts[0].Company_Signed),
                        Company_Signed_Date: data.getcontracts[0].Company_Signed_Date,
                        Billing_Street: this.getString(data.getcontracts[0].Billing_Street),
                        Billing_City: data.getcontracts[0].Billing_City,
                        Billing_State: data.getcontracts[0].Billing_State,
                        Billing_Country: data.getcontracts[0].Billing_Country,
                        Billing_Zip_Code: data.getcontracts[0].Billing_Zip_Code,
                        Contract_Terms: data.getcontracts[0].Contract_Terms,
                        IsActive: data.getcontracts[0].IsActive,
                        Date_Created: data.getcontracts[0].Date_Created,
                        Date_Updated: data.getcontracts[0].Date_Updated,
                        CompanySignedName: this.getString(data.getcontracts[0].Company_Signed),
                        Legal_Name: data.getcontracts[0].legalName,
                        loaded: false
                    },
                    () => {
                        this.getBusinessCompaniesbyId(this.state.Id_Entity);

                        this.props.getContractName(this.state.Contract_Name);
                        this.setState(
                            {
                                loading: false
                            },
                            () => {
                                this.props.updateCompanyId(this.state.Id_Entity);
                            }
                        );
                    }
                );
            })
            .catch((err) => console.log(err));
    };

    insertContract = () => {
        this.setState(
            {
                loadingInsert: true
            },
            () => {
                //Create the mutation using apollo global client
                this.validateAllFields(() => {
                    if (!this.state.formValid) {
                        this.props.handleOpenSnackbar(
                            'warning',
                            'Error: Saving Information: You must fill all the required fields'
                        );
                        this.setState({
                            loadingInsert: false
                        });
                        return true;
                    }
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
                                    IdManagement: parseInt(this.state.IdManagement),
                                    Id_Entity: parseInt(this.state.Id_Entity),
                                    Id_User_Signed: parseInt(this.state.Id_User_Signed),
                                    User_Signed_Title: `'${this.state.User_Signed_Title}'`,
                                    Signed_Date: `'${this.state.Signed_Date}'`,
                                    Contract_Status: `'${this.state.Contract_Status}'`,
                                    Contract_Start_Date: `'${this.state.Contract_Start_Date}'`,
                                    Contract_Term: parseInt(this.state.Contract_Term),
                                    Contract_Expiration_Date: `'${this.state.contractExpiration}'`,
                                    Owner_Expiration_Notification: parseInt(this.state.Owner_Expiration_Notification),
                                    Company_Signed: `'${this.state.CompanySignedName}'`,
                                    Company_Signed_Date: `'${this.state.Company_Signed_Date}'`,
                                    Id_User_Billing_Contact: parseInt(this.state.Id_User_Billing_Contact),
                                    Billing_Street: `'${this.state.Billing_Street}'`,
                                    Billing_City: parseInt(this.state.Billing_City),
                                    Billing_State: parseInt(this.state.Billing_State),
                                    Billing_Zip_Code: `'${this.state.Billing_Zip_Code}'`,
                                    Billing_Country: 6,
                                    Contract_Terms: "''",
                                    Id_Contract_Template: parseInt(this.state.Id_Contract_Template),
                                    Exhibit_B: "''",
                                    Exhibit_C: "''",
                                    Exhibit_D: "''",
                                    Exhibit_E: "''",
                                    Exhibit_F: "''",
                                    IsActive: parseInt(this.state.IsActive),
                                    User_Created: 1,
                                    User_Updated: 1,
                                    Date_Created: "'2018-08-14'",
                                    Date_Updated: "'2018-08-14'",
                                    Electronic_Address: `'${this.state.Electronic_Address}'`,
                                    Primary_Email: `'${this.state.Primary_Email}'`,
                                    legalName: `'${this.state.Legal_Name}'`

                                }
                            }
                        })
                        .then(({ data }) => {
                            this.props.getContractName(this.state.Contract_Name);
                            this.props.handleOpenSnackbar('success', 'Contract Inserted!');
                            this.setState({
                                loadingInsert: false
                            });
                            this.props.update(data.inscontracts.Id);
                        })
                        .catch((err) => {
                            this.props.handleOpenSnackbar('error', 'Error: Inserting Contract: ' + err);
                            this.setState({
                                loadingUpdate: false
                            });
                        });
                });
            }
        );
    };

    updateContract = (id) => {
        this.setState(
            {
                loadingUpdate: true
            },
            () => {
                this.validateAllFields(() => {
                    if (!this.state.formValid) {
                        this.props.handleOpenSnackbar(
                            'warning',
                            'Error: Saving Information: You must fill all the required fields'
                        );
                        this.setState({
                            loadingUpdate: false
                        });
                        return true;
                    }
                    //Create the mutation using apollo global client
                    this.props.client
                        .mutate({
                            // Pass the mutation structure
                            mutation: this.UPDATE_CONTRACT,
                            variables: {
                                input: {
                                    Id: id,
                                    Id_Company: 1,
                                    Contract_Name: `'${this.state.Contract_Name}'`,
                                    Contrat_Owner: `'${this.state.Contrat_Owner}'`,
                                    IdManagement: parseInt(this.state.IdManagement),
                                    Id_Entity: parseInt(this.state.Id_Entity),
                                    Id_User_Signed: parseInt(this.state.Id_User_Signed),
                                    User_Signed_Title: `'${this.state.User_Signed_Title}'`,
                                    Signed_Date: `'${this.state.Signed_Date}'`,
                                    Contract_Status: `'${this.state.Contract_Status}'`,
                                    Contract_Start_Date: `'${this.state.Contract_Start_Date}'`,
                                    Contract_Term: parseInt(this.state.Contract_Term),
                                    Contract_Expiration_Date: `'${this.state.contractExpiration}'`,
                                    Owner_Expiration_Notification: parseInt(this.state.Owner_Expiration_Notification),
                                    Company_Signed: `'${this.state.CompanySignedName}'`,
                                    Company_Signed_Date: `'${this.state.Company_Signed_Date}'`,
                                    Id_User_Billing_Contact: parseInt(this.state.Id_User_Billing_Contact),
                                    Billing_Street: `'${this.state.Billing_Street}'`,
                                    Billing_City: parseInt(this.state.Billing_City),
                                    Billing_State: parseInt(this.state.Billing_State),
                                    Billing_Zip_Code: `'${this.state.Billing_Zip_Code}'`,
                                    Billing_Country: 6,
                                    Contract_Terms: `'${this.state.Contract_Terms}'`,
                                    Id_Contract_Template: parseInt(this.state.Id_Contract_Template),
                                    Exhibit_B: "''",
                                    Exhibit_C: "''",
                                    Exhibit_D: "''",
                                    Exhibit_E: "''",
                                    Exhibit_F: "''",
                                    IsActive: parseInt(this.state.IsActive),
                                    User_Created: 1,
                                    User_Updated: 1,
                                    Date_Created: "'2018-08-14'",
                                    Date_Updated: "'2018-08-14'",
                                    Electronic_Address: `'${this.state.Electronic_Address}'`,
                                    Primary_Email: `'${this.state.Primary_Email}'`,
                                    legalName: `'${this.state.Legal_Name}'`
                                }
                            }
                        })
                        .then(({ data }) => {
                            this.props.getContractName(this.state.Contract_Name);
                            this.props.handleOpenSnackbar('success', 'Contract Updated!');
                            this.setState({
                                loadingUpdate: false
                            });
                            this.props.update(id);
                        })
                        .catch((err) => {
                            this.props.handleOpenSnackbar('error', 'Error: Updating Contract: ' + err);
                            this.setState({
                                loadingUpdate: false
                            });
                        });
                });
            }
        );
    };

    renewalContract = () => {
        this.setState(
            {
                loadingInsert: true
            },
            () => {
                //Create the mutation using apollo global client
                this.validateAllFields(() => {
                    if (!this.state.formValid) {
                        this.props.handleOpenSnackbar(
                            'warning',
                            'Error: Saving Information: You must fill all the required fields'
                        );
                        this.setState({
                            loadingInsert: false
                        });
                        return true;
                    }
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
                                    Signed_Date: `'${this.getNewDate()}'`,
                                    Contract_Status: `'0'`,
                                    Contract_Start_Date: `'${this.state.Contract_Start_Date}'`,
                                    Contract_Term: parseInt(this.state.Contract_Term),
                                    Contract_Expiration_Date: `'${this.state.contractExpiration}'`,
                                    Owner_Expiration_Notification: parseInt(this.state.Owner_Expiration_Notification),
                                    Company_Signed: `'${this.state.CompanySignedName}'`,
                                    Company_Signed_Date: `'${this.getNewDate()}'`,
                                    Id_User_Billing_Contact: parseInt(this.state.Id_User_Billing_Contact),
                                    Billing_Street: `'${this.state.Billing_Street}'`,
                                    Billing_City: parseInt(this.state.Billing_City),
                                    Billing_State: parseInt(this.state.Billing_State),
                                    Billing_Zip_Code: parseInt(this.state.Billing_Zip_Code),
                                    Billing_Country: 6,
                                    Contract_Terms: "''",
                                    Id_Contract_Template: parseInt(this.state.Id_Contract_Template),
                                    Exhibit_B: "''",
                                    Exhibit_C: "''",
                                    Exhibit_D: "''",
                                    Exhibit_E: "''",
                                    Exhibit_F: "''",
                                    IsActive: parseInt(this.state.IsActive),
                                    User_Created: 1,
                                    User_Updated: 1,
                                    Date_Created: "'2018-08-14'",
                                    Date_Updated: "'2018-08-14'",
                                    Electronic_Address: `'${this.state.Electronic_Address}'`,
                                    Primary_Email: `'${this.state.Primary_Email}'`
                                }
                            }
                        })
                        .then(({ data }) => {
                            this.props.getContractName(this.state.Contract_Name);
                            this.props.handleOpenSnackbar('success', 'Contract Inserted!');
                            this.setState({
                                loadingInsert: false
                            });
                            this.props.update(data.inscontracts.Id);
                        })
                        .catch((err) => {
                            this.props.handleOpenSnackbar('error', 'Error: Inserting Contract: ' + err);
                            this.setState({
                                loadingUpdate: false
                            });
                        });
                });
            }
        );
    };

    /**
     * QUERY to get companies
     */
    getCompaniesQuery = gql`
        query getcompanies($Id: Int!) {
            getcompanies(Id: $Id, IsActive: 1) {
                Id
                Name
                LegalName
                Primary_Email
            }
        }
    `;

    getbusinesscompaniesQuery = gql`
        query getbusinesscompanies($Id_Parent: Int) {
            getbusinesscompanies(Id_Parent: $Id_Parent, IsActive: 1, Contract_Status: "'C'") {
                Id
                Name
                Id_Parent
                Parent
                Zipcode
                Location
            }
        }
    `;

    getmanagementcompaniesQuery = gql`
        query getbusinesscompanies{
            getbusinesscompanies( Id_Parent: 0, IsActive: 1, Contract_Status: "'C'") {
                Id
                Name
                Id_Parent
                Parent
                Zipcode
                Location
            }
        }
    `;

    getbusinesscompaniesbyIdQuery = gql`
    query getbusinesscompanies($Id: Int) {
        getbusinesscompanies(Id: $Id, IsActive: 1, Contract_Status: "'C'") {
            Id
            Name
            Id_Parent
            Parent
            Zipcode
            Location
            State
            City
        }
    }
`;

    getNewDate = () => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!

        var yyyy = today.getFullYear();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        var today = yyyy + '-' + mm + '-' + dd;

        return today;
    };

    getcatalogitem = (id) => {
        this.props.client
            .query({
                query: this.getcatalogcontractterm,
                variables: {
                    Id: id
                }
            })
            .then(({ data }) => {
                this.state.Display_Contract_Term = this.getString(data.getcatalogitem[0].Name);

                var today = new Date();
                today.setMonth(today.getMonth() + parseInt(this.state.Display_Contract_Term) + 1);

                var dd = today.getDate();
                var mm = today.getMonth(); //January is 0!

                var yyyy = today.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var today = yyyy + '-' + mm + '-' + dd;

                var todayExpiration = new Date();
                todayExpiration.setMonth(
                    todayExpiration.getMonth() + parseInt(this.state.Display_Contract_Term) * 2 + 1
                );

                var dd = todayExpiration.getDate();
                var mm = todayExpiration.getMonth(); //January is 0!

                var yyyy = todayExpiration.getFullYear();
                if (dd < 10) {
                    dd = '0' + dd;
                }
                if (mm < 10) {
                    mm = '0' + mm;
                }
                var todayExpiration = yyyy + '-' + mm + '-' + dd;

                this.state.Contract_Start_Date = today;
                this.state.contractExpiration = todayExpiration;


                this.renewalContract();
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getCompanies = (id) => {
        this.props.client
            .query({
                query: this.getCompaniesQuery,
                variables: {
                    Id: id
                }
            })
            .then(({ data }) => {
                this.setState({
                    CompanySignedName: this.getString(data.getcompanies[0].LegalName),
                    CompanySignedNameValid: true,
                    Primary_Email: this.getString(data.getcompanies[0].Primary_Email)
                });
            })
            .catch((error) => {
                console.log(error);

            });
    };

    getBusinessCompanies = (id) => {
        this.props.client
            .query({
                query: this.getbusinesscompaniesQuery,
                variables: {
                    Id: id
                }
            })
            .then(({ data }) => {

                this.setState({
                    IdManagement: this.getString(data.getbusinesscompanies[0].Id_Parent),
                    Management: this.getString(data.getbusinesscompanies[0].Parent)
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getBusinessCompaniesbyId = (id) => {
        this.props.client
            .query({
                query: this.getbusinesscompaniesbyIdQuery,
                variables: {
                    Id: id
                }
            })
            .then(({ data }) => {

                this.setState({
                    // IdManagement: (data.getbusinesscompanies[0].Id_Parent),
                    // Management: this.getString(data.getbusinesscompanies[0].Parent),
                    address: this.getString(data.getbusinesscompanies[0].Location),
                    zipCode: this.getString(data.getbusinesscompanies[0].Zipcode),
                    state: data.getbusinesscompanies[0].State,
                    city: data.getbusinesscompanies[0].City,

                }, () => { });
            })
            .catch((error) => {
                console.log(error);
            });


    };

    getManagementCompanies = () => {
        this.props.client
            .query({
                query: this.getmanagementcompaniesQuery,
                variables: {

                }
            })
            .then(({ data }) => {
                this.setState({
                    IdManagement: this.getString(data.getbusinesscompanies[0].Id_Parent),
                    Management: this.getString(data.getbusinesscompanies[0].Parent)
                });
            })
            .catch((error) => {
                console.log(error);
            });
    };

    getStatesQuery = gql`
        query States($parent: Int!, $value: String) {
            getcatalogitem(IsActive: 1, Id_Parent: $parent, Id_Catalog: 3, Value: $value) {
                Id
                Name
                IsActive
            }
        }
    `;

    getCitiesQuery = gql`
        query States($parent: Int!, $value: String) {
            getcatalogitem(IsActive: 1, Id_Parent: $parent, Id_Catalog: 5, Value: $value) {
                Id
                Name
                IsActive
            }
        }
    `;
    /**
     *  End of the countries, cities and states queries
     */

    getcatalogcontractterm = gql`
        query getcatalogitemQuery($Id: Int!) {
            getcatalogitem(Id: $Id, IsActive: 1,  Id_Catalog: 10) {
                Id
                Name
                IsActive
            }
        }
    `;

    getContractTermsQuery = gql`
        {
            getcatalogitem( IsActive: 1,  Id_Catalog: 10) {
                Id
                Name
                IsActive
            }
        }
    `;

    /***
     * Events fo the dialog
     *
     */
    /**
     * Events of the component
     */

    handleClose = () => {
        this.setState({ open: false });
    };

    componentWillMount() {

        if (this.props.contractId !== 0) {
            // this.setState({ idManagement: this.props.Id_Parent })
            this.getContractData(this.props.contractId);
        } else {
            let expireDate = new Date(new Date(this.state.Contract_Start_Date).setMonth(new Date(this.state.Contract_Start_Date).getMonth() + parseInt(12)));

            this.setState({
                contractExpiration: expireDate.toISOString().substring(0, 10)
            })
        }

        if (this.props.Id_Parent !== undefined) {
            this.state.editing = false;
        }
        else {
            this.state.editing = true;
        }
    }


    validateField(fieldName, value) {
        let Contract_NameValid = this.state.Contract_NameValid;
        let Legal_NameValid = this.state.Legal_NameValid;
        let Contrat_OwnerValid = this.state.Contrat_OwnerValid;
        let Id_Contract_TemplateValid = this.state.Id_Contract_TemplateValid;
        let Id_EntityValid = this.state.Id_EntityValid;
        let Id_User_SignedValid = this.state.Id_User_SignedValid;
        let User_Signed_TitleValid = this.state.User_Signed_TitleValid;
        let Signed_DateValid = this.state.Signed_DateValid;
        let IsActiveValid = this.state.IsActiveValid;
        let Contract_StatusValid = this.state.Contract_StatusValid;
        let Contract_Start_DateValid = this.state.Contract_Start_DateValid;
        let Contract_TermValid = this.state.Contract_TermValid;
        let contractExpirationValid = this.state.contractExpirationValid;
        let Owner_Expiration_NotificationValid = this.state.Owner_Expiration_NotificationValid;
        let CompanySignedNameValid = this.state.CompanySignedNameValid;
        let Company_Signed_DateValid = this.state.Company_Signed_DateValid;
        let Id_User_Billing_ContactValid = this.state.Id_User_Billing_ContactValid;
        let Billing_StreetValid = this.state.Billing_StreetValid;
        let Billing_StateValid = this.state.Billing_StateValid;
        let Billing_CityValid = this.state.Billing_CityValid;
        let Billing_Zip_CodeValid = this.state.Billing_Zip_CodeValid;

        let Id_ManagementValid = this.state.Id_ManagementValid;
        let Id_HotelValid = this.state.Id_HotelValid;

        switch (fieldName) {
            case 'Contract_Name':
                Contract_NameValid = value.trim().length >= 5;
                break;
            case 'Legal_Name':
                Legal_NameValid = value.trim().length >= 5;
                break;
            case 'Contrat_Owner':
                Contrat_OwnerValid = value.trim().length >= 5;
                break;
            case 'Id_Contract_Template':
                Id_Contract_TemplateValid = value !== null && value !== 0 && value !== '';
                break;
            case 'Id_Entity':
                Id_EntityValid = value !== null && value !== 0 && value !== '';
                break;
            case 'Id_User_Signed':
                Id_User_SignedValid = value !== null && value !== 0 && value !== '';

                break;
            case 'User_Signed_Title':
                User_Signed_TitleValid = value.trim().length >= 3;
                Id_User_SignedValid = true;
                break;
            case 'Signed_Date':
                Signed_DateValid = value.trim().length == 10;
                break;
            case 'IsActive':
                IsActiveValid = value !== null && value !== '';
                break;
            case 'Contract_Status':
                Contract_StatusValid = value !== null && value !== '';
                break;
            case 'Contract_Start_Date':
                Contract_Start_DateValid = value.trim().length == 10;
                break;
            case 'Contract_Term':
                Contract_TermValid = value !== null && value !== 0 && value !== '';
                break;
            case 'contractExpiration':
                contractExpirationValid = value.trim().length == 10;
                break;
            case 'Owner_Expiration_Notification':
                Owner_Expiration_NotificationValid = value !== null && value !== 0 && value !== '';
                break;
            case 'CompanySignedName':
                CompanySignedNameValid = value.trim().length >= 5;
                break;
            case 'Company_Signed_Date':
                Company_Signed_DateValid = value.trim().length == 10;
                break;
            case 'Id_User_Billing_Contact':
                Id_User_Billing_ContactValid = value !== null && value !== 0 && value !== '';
                break;
            case 'Billing_Street':
                Billing_StreetValid = value !== null && value !== 0 && value !== '';
                break;
            case 'Billing_State':
                Billing_StateValid = value !== null && value !== 0 && value !== '';
                break;
            case 'Billing_City':
                Billing_CityValid = value !== null && value !== 0 && value !== '';
                break;
            case 'IdManagement':
                Id_ManagementValid = value !== null && value !== 0 && value !== '';
                break;
            case 'Id_Entity':
                Id_HotelValid = value !== null && value !== 0 && value !== '';
                break;

            case 'Billing_Zip_Code':
                Billing_Zip_CodeValid = value.toString().trim().length >= 2;
            default:
                break;
        }
        this.setState(
            {
                Contract_NameValid,
                Legal_NameValid,
                Contrat_OwnerValid,
                Id_Contract_TemplateValid,
                Id_EntityValid,
                Id_User_SignedValid,
                User_Signed_TitleValid,
                Signed_DateValid,
                IsActiveValid,
                Contract_StatusValid,
                Contract_Start_DateValid,
                Contract_TermValid,
                contractExpirationValid,
                Owner_Expiration_NotificationValid,
                CompanySignedNameValid,
                Company_Signed_DateValid,
                Id_User_Billing_ContactValid,
                Billing_StreetValid,
                Billing_StateValid,
                Billing_CityValid,
                Billing_Zip_CodeValid
            },
            this.validateForm
        );
    }

    /*Validations */
    validateAllFields(fun) {
        let Contract_NameValid = this.state.Contract_Name.trim().length >= 5;
        let Legal_NameValid = this.state.Legal_Name.trim().length >= 5;
        let Contrat_OwnerValid = this.state.Contrat_Owner.trim().length >= 5;
        let Id_Contract_TemplateValid =
            this.state.Id_Contract_Template !== null &&
            this.state.Id_Contract_Template !== 0 &&
            this.state.Id_Contract_Template !== '';

        let Id_EntityValid = this.state.Id_Entity !== null && this.state.Id_Entity !== 0 && this.state.Id_Entity !== '';
        let Id_User_SignedValid =
            this.state.Id_User_Signed !== null && this.state.Id_User_Signed !== 0 && this.state.Id_User_Signed !== '';
        let User_Signed_TitleValid = this.state.User_Signed_Title.trim().length >= 5;
        let Signed_DateValid = this.state.Signed_Date.trim().length == 10;
        let IsActiveValid = this.state.IsActive !== null && this.state.IsActive !== '';
        let Contract_StatusValid = this.state.Contract_StatusValid !== null && this.state.Contract_StatusValid !== '';
        let Contract_Start_DateValid = this.state.Contract_Start_Date.trim().length == 10;
        let Contract_TermValid =
            this.state.Contract_Term !== null && this.state.Contract_Term !== 0 && this.state.Contract_Term !== '';
        let contractExpirationValid = this.state.contractExpiration.trim().length == 10;
        let Owner_Expiration_NotificationValid =
            this.state.Owner_Expiration_Notification !== null &&
            this.state.Owner_Expiration_Notification !== 0 &&
            this.state.Owner_Expiration_Notification !== '';
        let CompanySignedNameValid = this.state.CompanySignedName.trim().length >= 3;
        let Company_Signed_DateValid = this.state.Company_Signed_Date.trim().length == 10;

        let Id_User_Billing_ContactValid =
            this.state.Id_User_Billing_Contact !== null &&
            this.state.Id_User_Billing_Contact !== 0 &&
            this.state.Id_User_Billing_Contact !== '';
        let Billing_StreetValid =
            this.state.Billing_Street !== null && this.state.Billing_Street !== 0 && this.state.Billing_Street !== '';
        let Billing_StateValid =
            this.state.Billing_State !== null && this.state.Billing_State !== 0 && this.state.Billing_State !== '';
        let Billing_CityValid =
            this.state.Billing_City !== null && this.state.Billing_City !== 0 && this.state.Billing_City !== '';
        let Billing_Zip_CodeValid = this.state.Billing_Zip_Code.toString().trim().length == 5;

        this.setState(
            {
                Contract_NameValid,
                Legal_NameValid,
                Contrat_OwnerValid,
                Id_Contract_TemplateValid,
                Id_EntityValid,
                Id_User_SignedValid,
                User_Signed_TitleValid,
                Signed_DateValid,
                IsActiveValid,
                Contract_StatusValid,
                Contract_Start_DateValid,
                Contract_TermValid,
                contractExpirationValid,
                Owner_Expiration_NotificationValid,
                CompanySignedNameValid,
                Company_Signed_DateValid,
                Id_User_Billing_ContactValid,
                Billing_StreetValid,
                Billing_StateValid,
                Billing_CityValid,
                Billing_Zip_CodeValid
            },
            () => {
                this.validateForm(fun);
            }
        );
    }

    validateForm(func = () => {
    }) {
        this.setState(
            {
                formValid:
                    this.state.Contract_NameValid &&
                    this.state.Legal_NameValid &&
                    this.state.Contrat_OwnerValid &&
                    this.state.Id_Contract_TemplateValid &&
                    this.state.Id_EntityValid &&
                    this.state.Id_User_SignedValid &&
                    this.state.User_Signed_TitleValid &&
                    this.state.Signed_DateValid &&
                    this.state.IsActiveValid &&
                    this.state.Contract_StatusValid &&
                    this.state.Contract_Start_DateValid &&
                    this.state.Contract_TermValid &&
                    this.state.contractExpirationValid &&
                    this.state.Owner_Expiration_NotificationValid &&
                    this.state.CompanySignedNameValid &&
                    this.state.Company_Signed_DateValid &&
                    this.state.Id_User_Billing_ContactValid &&
                    this.state.Billing_StreetValid &&
                    this.state.Billing_StateValid &&
                    this.state.Billing_CityValid &&
                    this.state.Billing_Zip_CodeValid
            },
            func
        );
    }

    findByZipCode = (zipCode = null, cityFinal = null) => {
        if (!zipCode) {
            return false;
        }
        this.props.client.query({
            query: this.getStatesQuery,
            variables: { parent: -1, value: `'${zipCode}'` },
            fetchPolicy: 'no-cache'
        }).then((data) => {
            this.setState({
                Billing_State: data.data.getcatalogitem[0].Id,
                cityFinal: cityFinal
            });
        });

    }

    updateEntity = (id) => {
        this.getBusinessCompaniesbyId(id);
    }

    updateAddress = () => {
        if (document.getElementById("correctAddress").checked) {
            this.setState({
                Old_Billing_City: this.state.city,
                Old_Billing_State: this.state.state,
                Old_Billing_Street: this.state.address,
                Old_Billing_Zip_Code: this.state.zipCode,

                Billing_City: this.state.city,
                Billing_State: this.state.state,
                Billing_Street: this.state.address,
                Billing_Zip_Code: this.state.zipCode,
                Disable_Billing_Street: true,
                Disable_Billing_Zip_Code: true

            });
        } else {
            this.setState({
                Billing_City: this.state.Old_Billing_City,
                Billing_State: this.state.Old_Billing_State,
                Billing_Street: this.state.Old_Billing_Street,
                Billing_Zip_Code: this.state.Old_Billing_Zip_Code,
                Disable_Billing_Street: false,
                Disable_Billing_Zip_Code: false

            });
        }
    }

    updateSearchingZipCodeProgress = (searchigZipcode) => {
        this.setState(() => {
            return { searchigZipcode }
        })
    }
    /*End of Validations*/

    render() {
        const { classes } = this.props;
        if (this.state.loadingCompanies) {
            return <LinearProgress />;
        }

        if (this.state.loading) {
            return <LinearProgress />;
        }

        return (
            <div className="TabSelected-container">
                <div className="row">
                    <div className="col-md-12">
                        <Route
                            render={({ history }) => (
                                <button
                                    style={{
                                        margin: '5px'
                                    }}
                                    className={'btn btn-danger float-right'}
                                    onClick={() => {
                                        if (this.props.href === undefined) {
                                            window.location.href = "/home/Contracts";
                                        } else if (this.props.href == '/home/company/edit') {
                                            history.push({
                                                pathname: '/home/company/edit',
                                                state: { idCompany: this.props.Id_Entity, idContract: this.props.contractId, tabSelected: 3 }
                                            });
                                        } else if (this.props.href == '/home/Properties') {
                                            history.push({
                                                pathname: '/home/Properties',
                                                state: { idCompany: this.props.Id_Entity, idContract: this.props.contractId, tabSelected: 2 }
                                            });
                                        }
                                    }}
                                >
                                    Cancel <i className="fas fa-ban" />
                                </button>
                            )}
                        />

                   { !this.state.searchigZipcode &&    <button
                            style={{
                                margin: '5px'
                            }}
                            //className="contract-next-button"
                            className={'btn btn-success float-right'}
                            onClick={() => {
                                if (this.props.contractId !== 0) {
                                    this.updateContract(this.props.contractId);
                                } else {
                                    this.insertContract();
                                }
                            }}
                            disabled={this.state.loadingInsert || this.state.loadingUpdate}
                        >
                            Save <i className="fas fa-save" />
                        </button>}



                        {parseInt(this.state.Contract_Status) == 2 ? (
                            <Button
                                className={classes.buttonSuccess}
                                onClick={() => {
                                    this.getcatalogitem(this.state.Contract_Term);
                                }}
                                disabled={parseInt(this.state.Contract_Status) == 2 ? false : true}
                            >
                                Renewal Contract
                            </Button>
                        ) : (
                                ''
                            )}
                        {(this.state.loadingInsert || this.state.loadingUpdate) && (
                            <CircularProgress size={24} className={classes.buttonProgress} />
                        )}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">Contract Information</div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12 col-lg-6">
                                        <div className="row">
                                            <div className="col-md-6 col-lg-6">
                                                <label>* Contract Name</label>
                                                <InputForm
                                                    value={this.state.Contract_Name}
                                                    change={(text) => {
                                                        this.setState(
                                                            {
                                                                Contract_Name: text
                                                            },
                                                            () => {
                                                                this.validateField('Contract_Name', text);
                                                            }
                                                        );
                                                    }}
                                                    error={!this.state.Contract_NameValid}
                                                />
                                            </div>
                                            <div className="col-md-6 col-lg-6">
                                                <label>* Legal Name</label>
                                                <InputForm
                                                    value={this.state.Legal_Name}
                                                    change={(text) => {
                                                        this.setState(
                                                            {
                                                                Legal_Name: text
                                                            },
                                                            () => {
                                                                this.validateField('Legal_Name', text);
                                                            }
                                                        );
                                                    }}
                                                    error={!this.state.Legal_NameValid}
                                                />
                                            </div>
                                            <div className="col-md-6 col-lg-6">
                                                <label>* Contract Owner</label>
                                                <InputForm
                                                    value={this.state.Contrat_Owner}
                                                    change={(text) => {
                                                        this.setState(
                                                            {
                                                                Contrat_Owner: text
                                                            },
                                                            () => {
                                                                this.validateField('Contrat_Owner', text);
                                                            }
                                                        );
                                                    }}
                                                    error={!this.state.Contrat_OwnerValid}
                                                />
                                            </div>
                                            <div className="col-md-6 col-lg-6">
                                                <label>* Contract Template</label>
                                                <Query query={this.GET_CONTRACT}>
                                                    {({ loading, error, data, refetch, networkStatus }) => {
                                                        //if (networkStatus === 4) return <LinearProgress />;
                                                        if (loading) return <LinearProgress />;
                                                        if (error) return <p> </p>;
                                                        if (
                                                            data.getcontracttemplate != null &&
                                                            data.getcontracttemplate.length > 0
                                                        ) {
                                                            return (
                                                                <SelectFormContractTemplate
                                                                    name="template"
                                                                    data={data.getcontracttemplate}
                                                                    showNone={false}
                                                                    update={(value) => {
                                                                        this.setState(
                                                                            {
                                                                                Id_Contract_Template: value
                                                                            },
                                                                            () => {
                                                                                this.validateField(
                                                                                    'Id_Contract_Template',
                                                                                    value
                                                                                );
                                                                            }
                                                                        );
                                                                    }}
                                                                    value={this.state.Id_Contract_Template}
                                                                    error={!this.state.Id_Contract_TemplateValid}
                                                                />
                                                            );
                                                        }
                                                        return <p>Nothing to display </p>;
                                                    }}
                                                </Query>
                                            </div>
                                            <div className="col-md-6">
                                                <label>* Management Company</label>
                                                <Query
                                                    query={this.getmanagementcompaniesQuery}

                                                >
                                                    {({ loading, error, data, refetch, networkStatus }) => {
                                                        //if (networkStatus === 4) return <LinearProgress />;
                                                        if (error) return <p>Nothing To Display </p>;
                                                        if (
                                                            data.getbusinesscompanies != null &&
                                                            data.getbusinesscompanies.length > 0
                                                        ) {
                                                            return (
                                                                <select
                                                                    name="management"
                                                                    id="management"
                                                                    required
                                                                    className="form-control"
                                                                    error={!this.state.Id_ManagementValid}
                                                                    disabled={!this.state.editing}
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            IdManagement: e.target.value
                                                                        });
                                                                    }}
                                                                    value={this.props.Id_Parent !== undefined ? this.props.Id_Parent : this.state.IdManagement}
                                                                >
                                                                    <option value="0">Select a Management</option>
                                                                    {data.getbusinesscompanies.map((item) => (
                                                                        <option value={item.Id}>{item.Name}</option>
                                                                    ))}
                                                                </select>
                                                            );
                                                        }
                                                        return <SelectNothingToDisplay />;
                                                    }}
                                                </Query>
                                            </div>
                                            <div className="col-md-6">
                                                <label>* Hotel</label>
                                                <Query
                                                    query={this.getbusinesscompaniesQuery}
                                                    variables={{ Id_Parent: (this.state.IdManagement === 0 ? 919191 : this.state.IdManagement) }}
                                                >
                                                    {({ loading, error, data, refetch, networkStatus }) => {
                                                        if (loading) return <LinearProgress />;
                                                        if (error) return <p> Select a Hotel </p>;
                                                        return (
                                                            <select
                                                                name="hotel"
                                                                id="hotel"
                                                                required
                                                                className="form-control"
                                                                onChange={(e) => {
                                                                    this.setState({
                                                                        Id_Entity: e.target.value
                                                                    });
                                                                    this.updateEntity(e.target.value);
                                                                }}
                                                                error={this.state.Id_HotelValid}
                                                                value={this.state.Id_Entity}
                                                            >
                                                                <option value="0">Select a Hotel</option>
                                                                {data.getbusinesscompanies.map((item) => (
                                                                    <option value={item.Id}>{item.Name}</option>
                                                                ))}
                                                            </select>
                                                        );
                                                        //}
                                                        // return  <option value="">Select a Hotel</option>;
                                                    }}
                                                </Query>
                                            </div>
                                            <div className="col-md-6 col-lg-6">
                                                <label>* Customer Signed By</label>

                                                <ContactDialog
                                                    defaultValue=""
                                                    valueSelected={this.state.Id_User_Signed}
                                                    handleOpenSnackbar={this.props.handleOpenSnackbar}
                                                    error={!this.state.Id_User_SignedValid}
                                                    idCompany={this.state.Id_Entity}
                                                    update={this.updateIdContact}
                                                    updateEmailContact={(email) => {
                                                        this.setState(
                                                            {
                                                                Electronic_Address: email
                                                            },
                                                            () => {
                                                                this.validateField('Electronic_Address', email);
                                                            }
                                                        );
                                                    }}
                                                    updateTypeContact={(value) => {
                                                        this.setState(
                                                            {
                                                                User_Signed_Title: value
                                                            },
                                                            () => {
                                                                this.validateField('User_Signed_Title', value);
                                                            }
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div className="col-md-6 col-lg-6">
                                                <label>* Customer Signed Title</label>
                                                <InputForm
                                                    value={this.state.User_Signed_Title}
                                                    change={(text) => {
                                                    }}
                                                    error={!this.state.User_Signed_TitleValid}
                                                />
                                            </div>
                                            <div className="col-md-6 col-lg-6">
                                                <label>* Customer Signed Date</label>
                                                <InputDateForm
                                                    value={this.state.Signed_Date}
                                                    placeholder={this.state.Signed_Date}
                                                    change={(text) => {
                                                        this.setState(
                                                            {
                                                                Signed_Date: text
                                                            },
                                                            () => {
                                                                this.validateField('Signed_Date', text);
                                                            }
                                                        );
                                                    }}
                                                    error={!this.state.Signed_DateValid}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-12 col-lg-6">
                                        <div className="row SubCard">
                                            <div className="SubCard-body bg-light">
                                                <div className="row">
                                                    <div className="col-md-6 col-lg-6">
                                                        <label>* Status</label>
                                                        <SelectForm
                                                            data={status}
                                                            update={this.updateStatus}
                                                            value={parseInt(this.state.Contract_Status)}
                                                            //error={!this.state.IsActiveValid}
                                                            error={!this.state.Contract_StatusValid}
                                                            showNone={false}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 col-lg-6">
                                                        <label>* Contract Start Date</label>
                                                        <InputDateForm
                                                            placeholder={this.state.Contract_Start_Date}
                                                            value={this.state.Contract_Start_Date}
                                                            error={!this.state.Contract_Start_DateValid}
                                                            onClick={(event) => {
                                                                event.target.setSelectionRange(0, 0);
                                                            }}
                                                            change={(text) => {
                                                                this.setState(
                                                                    {
                                                                        Contract_Start_Date: text
                                                                    },
                                                                    () => {
                                                                        this.validateField('Contract_Start_Date', text);

                                                                        let contractTerm = document.getElementById('contract-terms-month');
                                                                        let contractTermText = contractTerm.options[contractTerm.selectedIndex].text;
                                                                        let expireDate = new Date(new Date(this.state.Contract_Start_Date).setMonth(new Date(this.state.Contract_Start_Date).getMonth() + parseInt(contractTermText)));

                                                                        this.setState({
                                                                            contractExpiration: expireDate.toISOString().substring(0, 10)
                                                                        })
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 col-lg-6">
                                                        <label>* Contract Term (months)</label>

                                                        <Query query={this.getContractTermsQuery}>
                                                            {({ loading, error, data, refetch, networkStatus }) => {
                                                                //if (networkStatus === 4) return <LinearProgress />;
                                                                if (loading) return <LinearProgress />;
                                                                if (error) return <p> </p>;
                                                                if (
                                                                    data.getcatalogitem != null &&
                                                                    data.getcatalogitem.length > 0
                                                                ) {
                                                                    return (
                                                                        <select
                                                                            id="contract-terms-month"
                                                                            className={'form-control'}
                                                                            disabled={this.state.loadingCities}
                                                                            onChange={(event) => {
                                                                                this.setState({
                                                                                    Contract_Term: event.target.value
                                                                                }, () => {
                                                                                    let contractTerm = document.getElementById('contract-terms-month');
                                                                                    let contractTermText = contractTerm.options[contractTerm.selectedIndex].text;
                                                                                    let expireDate = new Date(new Date(this.state.Contract_Start_Date).setMonth(new Date(this.state.Contract_Start_Date).getMonth() + parseInt(contractTermText)));

                                                                                    this.setState({
                                                                                        contractExpiration: expireDate.toISOString().substring(0, 10)
                                                                                    })
                                                                                });
                                                                            }}
                                                                            value={this.state.Contract_Term}
                                                                            error={!this.state.Contract_TermValid}
                                                                        >

                                                                            {data.getcatalogitem.map((item) => (
                                                                                <option
                                                                                    value={item.Id}>{item.Name}</option>
                                                                            ))}
                                                                        </select>
                                                                    );
                                                                }
                                                                return <p>Nothing to display </p>;
                                                            }}
                                                        </Query>
                                                    </div>
                                                    <div className="col-md-6 col-lg-6">
                                                        <label>* Contract Expiration Date</label>
                                                        <InputDateForm
                                                            disabled={true}
                                                            placeholder={this.state.contractExpiration}
                                                            value={this.state.contractExpiration}
                                                            error={!this.state.contractExpirationValid}
                                                            change={(text) => {
                                                                this.setState(
                                                                    {
                                                                        contractExpiration: text
                                                                    },
                                                                    () => {
                                                                        this.validateField('contractExpiration', text);
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 col-lg-6">
                                                        <label>* Owner Expiration Notice</label>
                                                        <SelectForm
                                                            data={intervalDays}
                                                            update={this.updateOwnerExpirationNotification}
                                                            value={this.state.Owner_Expiration_Notification}
                                                            error={!this.state.Owner_Expiration_NotificationValid}
                                                            showNone={false}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 col-lg-6">
                                                        <label>* Company Signed By</label>

                                                        <InputForm
                                                            value={this.state.CompanySignedName}
                                                            change={(text) => {
                                                                this.setState({
                                                                    CompanySignedName: text
                                                                }, () => {
                                                                    this.validateField('CompanySignedName', text);
                                                                });
                                                            }}
                                                            error={!this.state.CompanySignedNameValid}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 col-lg-6">
                                                        <label>* Company Signed Date</label>
                                                        <InputDateForm
                                                            value={this.state.Company_Signed_Date}
                                                            error={!this.state.Company_Signed_DateValid}
                                                            change={(text) => {
                                                                this.setState(
                                                                    {
                                                                        Company_Signed_Date: text
                                                                    },
                                                                    () => {
                                                                        this.validateField('Company_Signed_Date', text);
                                                                    }
                                                                );
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6" />
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">Billing Information</div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-6 col-lg-4">
                                        <label>* Billing Name</label>
                                        <ContactDialog
                                            defaultValue=""
                                            valueSelected={this.state.Id_User_Billing_Contact}
                                            error={!this.state.Id_User_Billing_ContactValid}
                                            idCompany={this.state.Id_Entity}
                                            update={(id) => {
                                                this.setState(
                                                    {
                                                        Id_User_Billing_Contact: id
                                                    },
                                                    () => {
                                                        this.validateField('Id_User_Billing_Contact', id);
                                                    }
                                                );
                                            }}
                                            updateEmailContact={(email) => {
                                            }}
                                            updateTypeContact={(type) => {
                                            }}
                                            handleOpenSnackbar={this.props.handleOpenSnackbar}
                                        />
                                    </div>
                                    <div className="col-md-6 col-lg-4">
                                        <label>* Billing Street</label>
                                        <span className="float-right">
                                            <input type="checkbox" id="correctAddress" name="correctAddress" onChange={() => { this.updateAddress() }} />
                                            <label htmlFor="">&nbsp; Same as mailing address?</label>
                                        </span>
                                        <InputForm
                                            value={this.state.Billing_Street}
                                            disabled={this.state.Disable_Billing_Street}
                                            error={!this.state.Billing_StreetValid}
                                            change={(text) => {
                                                this.setState(
                                                    {
                                                        Billing_Street: text
                                                    },
                                                    () => {
                                                        this.validateField('Billing_Street', text);
                                                    }
                                                );
                                            }}
                                        />
                                    </div>
                                    <LocationForm
                                        onChangeCity={this.updateCity}
                                        onChangeState={this.updateProvidence}
                                        onChageZipCode={this.updateZipCode}
                                        city={this.state.Billing_City}
                                        state={this.state.Billing_State}
                                        zipCode={this.state.Billing_Zip_Code} changeCity={this.state.changeCity}
                                        cityClass={`form-control ${!this.state.Billing_CityValid && ' _invalid'}`}
                                        stateClass={`form-control ${!this.state.Billing_StateValid && ' _invalid'}`}
                                        zipCodeClass={`form-control ${!this.state.Billing_Zip_CodeValid && ' _invalid'}`}
                                        cityColClass="col-md-6 col-lg-4"
                                        stateColClass="col-md-6 col-lg-4"
                                        zipCodeColClass="col-md-6 col-lg-4"
                                        zipCodeTitle="* Billing Zip Code"
                                        stateTitle="* Billing State / Providence"
                                        cityTitle="* Billing City"
                                        requiredCity={true}
                                        requiredState={true}
                                        requiredZipCode={true}
                                        updateSearchingZipCodeProgress={this.updateSearchingZipCodeProgress}
                                    />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

NewContract.propTypes = {
    classes: PropTypes.object.isRequired
};
export default withStyles(styles)(withApollo(withGlobalContent(NewContract)));
