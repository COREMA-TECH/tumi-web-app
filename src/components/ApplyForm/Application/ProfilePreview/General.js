import React, { Component } from 'react';
import './preview-profile.css';
import './../index.css';
import withApollo from "react-apollo/withApollo";
import {
    GET_APPLICATION_PROFILE_INFO,
    GET_CONTACTS_IN_USER_DIALOG,
    GET_DEPARTMENTS_QUERY,
    GET_APPLICATION_EMPLOYEES_QUERY,
    GET_EMAILS_USER,
    GET_HOTELS_QUERY,
    GET_ROLES_QUERY,
    GET_TYPES_QUERY,
    GET_CONTACTS_BY_APP_HOTEL_QUERY,
    GET_HOTELS_BY_APPLICATION_QUERY,
    CREATE_DOCUMENTS_PDF_QUERY,
    SEND_VERIFICATION,
} from "./Queries";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import InputMask from "react-input-mask";
import green from "@material-ui/core/colors/green";
import InputForm from 'ui-components/InputForm/InputForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { withStyles } from "@material-ui/core";
import withMobileDialog from "@material-ui/core/withMobileDialog/withMobileDialog";
import ContactTypesData from '../../../../data/contactTypes';
import withGlobalContent from "../../../Generic/Global";
import { ADD_EMPLOYEES, INSERT_CONTACT, UPDATE_APPLICANT, UPDATE_DIRECT_DEPOSIT, DISABLE_CONTACT_BY_HOTEL_APPLICATION, UPDATE_ISACTIVE } from "./Mutations";
import { GET_LANGUAGES_QUERY } from "../../../ApplyForm-Recruiter/Queries";
import gql from 'graphql-tag';
import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';
import PunchesReportDetail from '../../../PunchesReportDetail';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import Titles from './Titles';
import CircularProgress from '@material-ui/core/CircularProgress';
import renderHTML from 'react-render-html';
import moment from 'moment';

const dialogMessages = require(`../languagesJSON/${localStorage.getItem('languageForm')}/dialogMessages`);


const styles = (theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px',
        width: '100%'
    },
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    formControl: {
        margin: theme.spacing.unit
        //width: '100px'
    },
    numberControl: {
        //width: '200px'
    },
    nameControl: {
        //width: '100px'
    },
    emailControl: {
        //width: '200px'
    },
    comboControl: {
        //width: '200px'
    },
    resize: {
        //width: '200px'
    },
    divStyle: {
        width: '95%',
        display: 'flex',
        justifyContent: 'space-around'
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: 'none'
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700]
        }
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    },
    paper: { overflowY: 'unset' },
    container: { overflowY: 'unset' }
});

class General extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: false,
            data: [],
            openModal: false,
            openUserModal: false,

            insertDialogLoading: false,
            // Modal state
            Id: 0,
            idCompany: null,
            firstname: '',
            middlename: '',
            lastname: '',
            email: '',
            number: '',
            type: null,
            idSupervisor: null,
            directDeposit: 1,
            IsActive: 1,
            User_Created: 1,
            User_Updated: 1,
            Date_Created: "'2018-08-14 16:10:25+00'",
            Date_Updated: "'2018-08-14 16:10:25+00'",
            isLead: false,
            property: [],
            contactTypes: ContactTypesData,
            hireDate: '',

            // Functional states
            titles: [{ Id: 0, Name: 'Nothing', Description: 'Nothing' }],
            departments: [{ Id: 0, Name: 'Nothing', Description: 'Nothing' }],
            hotels: [],
            supervisors: [],
            allSupervisors: [],
            inputEnabled: true,
            loadingData: false,
            loadingDepartments: false,
            loadingSupervisor: false,
            loadingAllSupervisors: false,
            loadingTitles: false,
            loading: false,
            firstLoad: true,
            indexView: 0, //Loading
            errorMessage: '',
            activateTabs: true,


            // User dialog state
            contacts: [],
            regions: [],
            RegionName: '',
            loadingContacts: false,

            roles: [],
            loadingRoles: false,

            dataEmail: [],

            languages: [],
            loadingLanguages: false,
            createdProfile: false,

            ...this.DEFAULT_STATE,

            hotelValid: false,
            typeValid: false,
            departmentNameValid: false,
            titleNameValid: false,

            properties: [],

            DeparmentTitle: '',
            myHotels: [],
            locationAbletoWorkId: 0,
            openVerification:false,
            date: new Date().toISOString().substring(0, 10),
           

        }
    }

    DEFAULT_STATE = {
        id: '',
        idToDelete: null,
        idToEdit: null,

        idContact: undefined,
        username: '',
        fullname: '',
        password: 'TEMP',
        email: '',
        number: '',
        idRol: '',
        idLanguage: '',
        isAdmin: false,
        allowInsert: false,
        allowEdit: false,
        allowDelete: false,
        allowExport: false,
        IsRecruiter: false,
        IdRegionValid: true,
        RegionName: '',
        IsActive: this.props.activeUser,
        directDeposit: 1,
        IdRegion: 0,

        departmentName: '',
        titleName: '',

        idContactValid: true,
        usernameValid: true,
        //fullnameValid: false,
        passwordValid: true,
        emailValid: true,
        numberValid: true,
        idRolValid: true,
        idLanguageValid: true,
        idContactHasValue: false,
        usernameHasValue: false,
        //fullnameHasValue: false,
        passwordHasValue: false,
        emailHasValue: false,
        numberHasValue: false,
        idRolHasValue: false,
        idLanguageHasValue: false,

        formValid: true,
        opendialog: false,
        buttonTitle: this.TITLE_ADD,
        enableCancelButton: false,

        loading: false,
        loadingConfirm: false,
        openModal: false,
        showCircularLoading: false,
        titleModal: false,
        openModalEmail:false,
        sendEmail:''
    };

    /**
     * Mutations
     */
    GET_CONTACTS_QUERY_BY_ID = gql`
        query getsupervisor($Id: Int) {
            getcontacts(IsActive: 1,  Id: $Id) {
                Id
                First_Name
                Middle_Name
                Last_Name
                Electronic_Address
                Phone_Number
                Id_Entity
            }
        }
    `;

    SEND_EMAIL = gql`
        query sendemail($username: String,$password: String,$email: String,$title:String) {
            sendemail(username:$username,password:$password,email:$email,title:$title)
        }
    `;


    /**
     * To open modal updating the state
     */
    handleClickOpenModal = () => {
        this.setState({ openModal: true });
    };

    handleClickOpenModalEmail = () => {
        this.setState({ openModalEmail: true, sendEmail:'' });
    };

    handleClickCloseModalEmail = () => {
        this.setState({ openModalEmail: false });
    };

    handleClickOpenVerification = () => {
        this.setState({ openVerification: true });
     };

    handleClickCloseVerification = () => {
        this.setState({ openVerification: false });
    };

    createDocumentsPDF = () => {
        this.setState(
            {
                downloading: true
            }
        )
        this.props.client
            .query({
                query: CREATE_DOCUMENTS_PDF_QUERY,
                variables: {
                    contentHTML: document.getElementById('DocumentPDF').innerHTML,
                    Name: "Verification-" + this.state.applicantName
                },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.createdocumentspdf != null) {

                } else {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error: Loading agreement: createdocumentspdf not exists in query data'
                    );
                    this.setState({ loadingData: false, downloading: false });
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
                this.setState({ loadingData: false, downloading: false });
            });
    };


    downloadDocumentsHandler = () => {
        var url = this.context.baseUrl + '/public/Documents/' + "Anti-Harrasment-" + this.state.applicantName + '.pdf';
        window.open(url, '_blank');
        this.setState({ downloading: false });
    };

    handleClickConvertToEmployee = () => {
        this.setState(
            {
                insertDialogLoading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_APPLICANT,
                        variables: {

                            id: this.props.applicationId,
                            isLead: false

                        }
                    })
                    .then(({ data }) => {
                        var datos = []
                        datos.push({
                            firstName: this.state.firstname,
                            lastName: this.state.lastname,
                            electronicAddress: this.state.email,
                            mobileNumber: this.state.number,
                            idRole: 1,
                            isActive: true,
                            directDeposit: this.state.directDeposit,
                            userCreated: 1,
                            userUpdated: 1
                        });

                        this.insertEmployees(datos)
                        this.setState({
                            insertDialogLoading: false,
                            isLead: false
                        });

                        this.props.handleOpenSnackbar('success', 'Candidate was updated!', 'bottom', 'right');
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to update applicant information. Please, try again!',
                            'bottom',
                            'right'
                        );
                    });
            }
        );
    };


    insertEmployees = (employeesArrays) => {
        this.props.client
            .mutate({
                mutation: ADD_EMPLOYEES,
                variables: {
                    Employees: employeesArrays
                }
            })
            .then(({ data }) => {
                this.props.handleOpenSnackbar('success', 'Employees Saved!');

            })
            .catch(error => {

                this.props.handleOpenSnackbar('error', 'Error to save Employees!');

            })
    };

    updateContactByHotelApplication = () => {
        this.setState(() => ({ removingLocationAbleToWork: true }))
        this.props.client
            .mutate({
                mutation: DISABLE_CONTACT_BY_HOTEL_APPLICATION,
                variables: {
                    Id_Entity: this.state.locationAbletoWorkId,
                    ApplicationId: this.props.applicationId
                }
            })
            .then(({ data }) => {
                this.props.handleOpenSnackbar('success', 'Record deleted!');
                this.setState(() => ({ removingLocationAbleToWork: false, openConfirm: false}), this.getMyHotels)

            })
            .catch(error => {

                this.props.handleOpenSnackbar('error', 'Error deleting relation!');
                this.setState(() => ({ removingLocationAbleToWork: false }))

            })
    };
    /**
     * To hide modal and then restart modal state values
     */
    handleCloseModal = () => {
        this.setState({
            openModal: false
        }, () => {
            this.setState({
                property: [],
                type: null,
                departmentName: '',
                titleName: ''
            })
        });
    };

    handleCloseModalVerificacion = () => {
        this.setState({openVerification: false})
    };

    /**
     * To open the user modal
     */
    handleClickOpenUserModal = () => {
        this.setState({ openUserModal: true });
    };

    /**
     * To hide modal and then restart user modal state
     */
    handleCloseUserModal = () => {
        this.setState({
            openUserModal: false,
        }, () => {
            this.resetUserModalState();
        });
    };

    /**
     * To reset state user modal
     */
    resetUserModalState = () => {
        this.setState({
            idRol: null,
            idLanguage: null,
            usernameValid: true
        })
    };


    /**
     * To get the profile information for applicant
     * @param id
     */
    getProfileInformation = (id) => {

        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .query({
                        query: GET_APPLICATION_PROFILE_INFO,
                        fetchPolicy: 'no-cache',
                        variables: {
                            id: id
                        }
                    })
                    .then(({ data }) => {
                        this.setState({
                            data: data.applications[0]
                        }, () => {
                            this.setState({
                                email: this.state.data.emailAddress,
                                number: this.state.data.cellPhone,
                                firstname: this.state.data.firstName,
                                middlename: this.state.data.middleName,
                                lastname: this.state.data.lastName,
                                isLead: this.state.data.isLead,
                                loading: false,
                                directDeposit: this.state.data.directDeposit,
                                isActive:this.state.data.isActive,
                                username: this.state.data.firstName.slice(0, 1) + this.state.data.lastName + Math.floor(Math.random() * 10000),
                                EmployeeId: this.state.data.employee? this.state.data.employee.EmployeeId : 999999,
                                hireDate: (this.state.data.employee && this.state.data.employee.Employees.hireDate) ? `${moment(this.state.data.employee.Employees.hireDate).format("YYYY-MM-DD")}` : '--',
                                idealJobs: this.state.data.idealJobs,
                                applicantName: this.state.data.firstName+' '+this.state.data.lastName
                            })
                        });
                    })
                    .catch(error => {
                        this.setState({
                            loading: false,
                            error: true
                        })
                    })
            });
    };


    /**
     * To get the profile information for applicant
     * @param id
     */

    getApplicationEmployees = (id) => {
        this.props.client
            .query({
                query: GET_APPLICATION_EMPLOYEES_QUERY,
                fetchPolicy: 'no-cache',
                variables: {
                    ApplicationId: id
                }
            })
            .then(({ data }) => {
                this.setState({
                    DeparmentTitle: data.applicationEmployees[0].Employees.Deparment ? data.applicationEmployees[0].Employees.Deparment.DisplayLabel : ''
                })
            })
            .catch(error => { console.log("Informacion de las error  ", error) })
    };

    getHotels = () => {
        this.props.client
            .query({
                query: GET_HOTELS_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    hotels: data.getbusinesscompanies
                }, () => {
                    let options = [];
                    this.state.hotels.map(item => {
                        let hotel = this.state.myHotels.find(_ => { return _.Id == item.Id });
                        if (!hotel) {
                            options.push({ value: item.Id, label: `${item.Code} - ${item.Name}` });
                            this.setState(prevState => ({
                                properties: options
                            }));
                        }
                    });

                    this.fetchContacts()
                });
            })
            .catch(error => {

            });
    };

   
    fetchContacts = () => {
        this.props.client
            .query({
                query: GET_CONTACTS_IN_USER_DIALOG,
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getsupervisor != null && data.data.getcatalogitem) {
                    this.setState({
                        contacts: data.data.getsupervisor,
                        regions: data.data.getcatalogitem,
                        RegionName: data.data.getcatalogitem[0].Name,
                        loadingContacts: false
                    }, () => {
                        this.fetchRoles();
                    });
                }
            })
            .catch((error) => {

            });
    };

    /**
     * To fetch a list of roles
     */
    fetchRoles = () => {
        this.props.client
            .query({
                query: GET_ROLES_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getroles != null) {
                    this.setState({
                        roles: data.data.getroles,
                        loadingRoles: false
                    }, () => {
                        this.fetchLanguages();
                    });
                }
            })
            .catch((error) => {

            });
    };

    /**
     * To fetch a list of languages
     */
    fetchLanguages = () => {
        this.props.client
            .query({
                query: GET_LANGUAGES_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getcatalogitem != null) {
                    this.setState({
                        languages: data.data.getcatalogitem,
                        loadingLanguages: false
                    }, () => {
                        this.fetchEmails();
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loadingLanguages: false,
                    firstLoad: false,
                    indexView: 2,
                    errorMessage: 'Error: Loading languages: ' + error
                });
            });
    };

    getHotelIds = () => {
        let ids = [];
        this.state.property.map(prop => {
            ids.push(prop.value)
        });
        return ids;
    }

    /**
     * Count Contacts by Property and Application
     */
    getContacts = (execMutation = () => { }) => {
        this.setState(() => ({ saving: true }));
        this.props.client
            .query({
                query: GET_CONTACTS_BY_APP_HOTEL_QUERY,
                fetchPolicy: 'no-cache',
                variables: {
                    ApplicationId: this.props.applicationId,
                    Id_Entity: this.getHotelIds()
                }
            })
            .then(({ data: { contacts } }) => {
                if (contacts.length > 0) {
                    this.props.handleOpenSnackbar('warning', 'Contact already exists in some Hotel!');
                    this.setState(() => ({ saving: false }));
                }
                else execMutation();
            })
            .catch((error) => {
                this.setState(() => ({ saving: false }));
                this.props.handleOpenSnackbar('error', 'Error processing request!');
            });
    }

    /**
 * Get Hotels associated to application
 */
    getMyHotels = () => {
        this.setState(() => ({ loadingMyHotels: true }));
        this.props.client
            .query({
                query: GET_HOTELS_BY_APPLICATION_QUERY,
                fetchPolicy: 'no-cache',
                variables: {
                    id: this.props.applicationId
                }
            })
            .then(({ data: { companiesByApplications } }) => {
                this.setState(() => ({ myHotels: companiesByApplications }), this.getHotels);
            })
            .catch((error) => {
                this.setState(() => ({ loadingMyHotels: false }));
                this.props.handleOpenSnackbar('error', 'Error loading my hotels!');
            });
    }

    /**
   * To insert contact objects
   * @param idDepartment int value
   * @param idTitle int value
   */
    insertContacts = () => {
        if (!this.state.property.length) {
            this.props.handleOpenSnackbar('warning', 'You have to select the Property!');
            return true;
        }
        else
            this.getContacts(() => {
                this.setState(() => ({ saving: true }));
                let date = new Date().toISOString();
                let ids = this.getHotelIds();
                let contacts = [];

                ids.map(id => {
                    contacts.push({
                        Id_Entity: id,
                        ApplicationId: this.props.applicationId,
                        First_Name: this.state.firstname,
                        Middle_Name: this.state.middlename,
                        Last_Name: this.state.lastname,
                        Electronic_Address: this.state.email,
                        Phone_Number: this.state.number,
                        Contact_Type: 1,
                        IsActive: 1,
                        User_Created: 1,
                        User_Updated: 1,
                        Date_Created: date,
                        Date_Updated: date
                    })
                })
                this.props.client
                    .mutate({
                        mutation: INSERT_CONTACT,
                        variables: {
                            contacts
                        }
                    })
                    .then((data) => {
                        this.props.handleOpenSnackbar('success', 'Contact Inserted!');
                        this.setState(() => ({
                            openModal: false,
                            openVerification:false,
                            saving: false,
                            property: [],
                            type: null,
                            departmentName: '',
                            titleName: ''
                        }));
                        this.getMyHotels();
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error: Inserting Contact: ' + error
                        );
                        this.setState(() => ({
                            saving: false
                        }));
                        return false;
                    });
            })

    };

    /**
     * Before render fetch user information
     */
    componentWillMount() {
     
        this.getProfileInformation(this.props.applicationId);
        this.getApplicationEmployees(this.props.applicationId);
        this.getMyHotels();
    }

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }


    handleCheckedChange = (name) => (event) => {
        if (name == 'IsRecruiter' && !event.target.checked) this.setState({ IdRegion: 0, IdRegionValid: true });
        if (name == 'isAdmin' && event.target.checked)
            this.setState(
                {
                    [name]: event.target.checked,
                    allowEdit: true,
                    allowInsert: true,
                    allowDelete: true,
                    allowExport: true
                },
                this.validateForm
            );
        else this.setState({ [name]: event.target.checked }, this.validateForm);
    };

    updateSelect = (id, name) => {
        this.setState(
            {
                [name]: id
            },
            () => {
                this.validateField(name, id);
            }
        );
    };

    SelectContac = (id) => {
        this.props.client
            .query({
                query: this.GET_CONTACTS_QUERY_BY_ID,
                variables: {
                    Id: id
                }
            })
            .then((data) => {
                if (data.data.getcontacts != null) {
                    this.setState({
                        email: data.data.getcontacts[0].Electronic_Address,
                        number: data.data.getcontacts[0].Phone_Number,
                        fullname: data.data.getcontacts[0].First_Name.trim() + ' ' + data.data.getcontacts[0].Last_Name.trim()
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loadingContacts: false,
                    firstLoad: false,
                    indexView: 2,
                    errorMessage: 'Error: Loading contacts: ' + error
                });
            });
    };

    onChangeHandler(value, name) {
        this.setState({ [name]: value }, this.validateField(name, value));
    }

    enableCancelButton = () => {
        let idContactHasValue = this.state.idContact !== null && this.state.idContact !== '';
        let usernameHasValue = this.state.username != '';
        //let fullnameHasValue = this.state.fullname != '';
        let emailHasValue = this.state.email != '';
        let numberHasValue = this.state.number != '';
        let passwordHasValue = this.state.password != '';
        let idRolHasValue = this.state.idRol !== null && this.state.idRol !== '';
        let idLanguageHasValue = this.state.idLanguage !== null && this.state.idLanguage !== '';

        return (
            idContactHasValue ||
            usernameHasValue ||
            //fullnameHasValue ||
            emailHasValue ||
            numberHasValue ||
            passwordHasValue ||
            idRolHasValue ||
            idLanguageHasValue
        );
    };

    validateAllFields(func) {
        let idContactValid = this.state.idContact !== -1 && this.state.idContact !== '';
        let usernameValid = this.state.username.trim().length >= 3 && this.state.username.trim().indexOf(' ') < 0;
        //let fullnameValid = this.state.fullname.trim().length >= 10;
        let emailValid = this.state.email.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        let numberValid =
            this.state.number.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '')
                .length == 10;
        let passwordValid = this.state.password.trim().length >= 2;
        let idRolValid = this.state.idRol !== null && this.state.idRol !== 0 && this.state.idRol !== '';
        let idLanguageValid =
            this.state.idLanguage !== null && this.state.idLanguage !== 0 && this.state.idLanguage !== '';
        let IdRegionValid = true;
        if (this.state.IsRecruiter)
            IdRegionValid = this.state.IdRegion !== null && this.state.IdRegion !== 0 && this.state.IdRegion !== '';
        this.setState(
            {
                idContactValid,
                usernameValid,
                //fullnameValid,
                emailValid,
                numberValid,
                passwordValid,
                idRolValid,
                idLanguageValid,
                IdRegionValid
            },
            () => {
                this.validateForm(func);
            }
        );
    }

    validateField(fieldName, value) {
        let idContactValid = this.state.idContactValid;
        let usernameValid = this.state.usernameValid;
        //let fullnameValid = this.state.fullnameValid;
        let emailValid = this.state.emailValid;
        let numberValid = this.state.numberValid;
        let passwordValid = this.state.passwordValid;
        let idRolValid = this.state.idRolValid;
        let idLanguageValid = this.state.idLanguageValid;

        let idContactHasValue = this.state.idContactHasValue;
        let usernameHasValue = this.state.usernameHasValue;
        //let fullnameHasValue = this.state.fullnameHasValue;
        let emailHasValue = this.state.emailHasValue;
        let numberHasValue = this.state.numberHasValue;
        let passwordHasValue = this.state.passwordHasValue;
        let idRolHasValue = this.state.idRolHasValue;
        let idLanguageHasValue = this.state.idLanguageHasValue;
        let IdRegionValid = true;

        switch (fieldName) {
            case 'idContact':
                idContactValid = value !== -1 && value !== '';
                idContactHasValue = value !== -1 && value !== '';
                break;
            case 'username':
                usernameValid = this.state.username.trim().length >= 3 && this.state.username.trim().indexOf(' ') < 0;
                usernameHasValue = value != '';
                break;
            case 'email':
                emailValid = value.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                emailHasValue = value != '';
                break;
            case 'number':
                numberValid =
                    value.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '')
                        .length == 10;
                numberHasValue = value != '';
                break;
            case 'password':
                passwordValid = value.trim().length >= 2;
                passwordHasValue = value != '';
                break;
            case 'idRol':
                idRolValid = value !== null && value !== 0 && value !== '';
                idRolHasValue = value !== null && value !== '';
                break;
            case 'idLanguage':
                idLanguageValid = value !== null && value !== 0 && value !== '';
                idLanguageHasValue = value !== null && value !== '';
                break;
            case 'IdRegion':
                if (this.state.IsRecruiter) IdRegionValid = value !== null && value !== 0 && value !== '';

                break;
            default:
                break;
        }
        this.setState(
            {
                idContactValid,
                usernameValid,
                //fullnameValid,
                emailValid,
                numberValid,
                passwordValid,
                idRolValid,
                idLanguageValid,

                idContactHasValue,
                usernameHasValue,
                //fullnameHasValue,
                emailHasValue,
                numberHasValue,
                passwordHasValue,
                idRolHasValue,
                idLanguageHasValue,
                IdRegionValid
            },
            this.validateForm
        );
    }

    validateForm(func = () => {
    }) {
        this.setState(
            {
                formValid:
                    this.state.idContactValid &&
                    this.state.usernameValid &&
                    //this.state.fullnameValid &&
                    this.state.emailValid &&
                    this.state.numberValid &&
                    this.state.passwordValid &&
                    this.state.idRolValid &&
                    this.state.idLanguageValid &&
                    this.state.IdRegionValid,
                enableCancelButton:
                    this.state.idContactHasValue ||
                    this.state.usernameHasValue ||
                    //this.state.fullnameHasValue ||
                    this.state.emailHasValue ||
                    this.state.numberHasValue ||
                    this.state.passwordHasValue ||
                    this.state.idRolHasValue ||
                    this.state.idLanguageHasValue ||
                    this.state.isAdmin ||
                    this.state.allowInsert ||
                    this.state.allowEdit ||
                    this.state.allowDelete ||
                    this.state.allowExport
            },
            func
        );
    }

    addUserHandler = () => {
        this.setState(
            {
                loading: true
            },
            () => {
                this.validateAllFields(() => {
                    if (this.state.formValid) this.insertUser();
                    else {
                        this.props.handleOpenSnackbar(
                            'warning',
                            'Error: Saving Information: You must fill all the required fields'
                        );
                        this.setState({
                            loading: false
                        });
                    }
                });
            }
        );
    };

    /**
     * To send email with credentials after user created
     */
    sendMail = () => {
        this.setState(
            {
                loadingConfirm: true
            },
            () => {
                this.props.client
                    .query({
                        query: this.SEND_EMAIL,
                        variables: {
                            username: this.state.username,
                            password: `TEMP`,
                            email: this.state.email,
                            title: `Credential Information`
                        }
                    })
                    .then((data) => {
                        this.props.handleOpenSnackbar('success', 'Email sent with credentials!');
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar('error', 'Error: Sending Email: ' + error);
                        this.setState({
                            loadingConfirm: false
                        });
                    });
            }
        );
    };

    INSERT_USER_QUERY = gql`
        mutation insusers($input: iUsers!) {
            insusers(input: $input) {
                Id
            }
        }
    `;

    updateDirectDeposit = () => {
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_DIRECT_DEPOSIT,
                        variables: {

                            id: this.props.applicationId,
                            directDeposit: this.state.directDeposit

                        }
                    })
                    .then(({ data }) => {

                        this.setState({
                            loading: false,
                        });

                        this.props.handleOpenSnackbar('success', 'Candidate was updated!', 'bottom', 'right');
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to update applicant information. Please, try again!',
                            'bottom',
                            'right'
                        );
                    });
            }
        );
    };

    updateActive = () => {
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_ISACTIVE,
                        variables: {

                            id: this.props.applicationId,
                            isActive: this.state.isActive
                        }
                    })
                    .then(({ data }) => {

                        this.setState({
                            loading: false,
                        });

                        this.props.handleOpenSnackbar('success', 'Candidate was updated!', 'bottom', 'right');
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to update applicant information. Please, try again!',
                            'bottom',
                            'right'
                        );
                    });
            }
        );
    };

    /**
     * Insert a user with general information and permissions
     */
    insertUser = () => {
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: this.INSERT_USER_QUERY,
                        variables: {
                            input: {
                                Id: null,
                                Id_Entity: 1,
                                Id_Contact: null,
                                Id_Roles: this.state.idRol,
                                Code_User: `'${this.state.username}'`,
                                Full_Name: `'${this.state.fullname}'`,
                                Electronic_Address: `'${this.state.email}'`,
                                Phone_Number: `'${this.state.number}'`,
                                Id_Language: this.state.idLanguage,
                                IsAdmin: this.state.isAdmin ? 1 : 0,
                                AllowDelete: this.state.allowDelete ? 1 : 0,
                                AllowInsert: this.state.allowInsert ? 1 : 0,
                                AllowEdit: this.state.allowEdit ? 1 : 0,
                                AllowExport: this.state.allowExport ? 1 : 0,
                                IdSchedulesEmployees: null,
                                IdSchedulesManager: null,
                                IsRecruiter: false,
                                IdRegion: null,
                                IsActive: this.state.IsActive ? 1 : 0,
                                User_Created: 1,
                                User_Updated: 1,
                                Date_Created: "'2018-08-14 16:10:25+00'",
                                Date_Updated: "'2018-08-14 16:10:25+00'"
                            }
                        }
                    })
                    .then((data) => {
                        this.sendMail();

                        this.props.handleOpenSnackbar('success', 'User Inserted!');

                        this.setState({
                            createdProfile: true
                        }, () => {
                            this.setState({ openUserModal: false, showCircularLoading: true, loading: false });
                            this.resetUserModalState();
                        });

                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error', 'Error: Inserting User: ' + error
                        );
                        this.setState({
                            loading: false
                        });
                    });
            }
        );
    };

    /**
     * To fetch a list of applicants emails
     */
    fetchEmails = () => {
        this.props.client
            .query({
                query: GET_EMAILS_USER
            })
            .then(({ data }) => {
                this.setState({
                    dataEmail: data.getusers
                }, () => {
                    this.setState({
                        loading: false
                    });
                })
            })
            .catch(error => {
                // TODO: add snackbar message error
                this.props.handleOpenSnackbar('error', 'Error to list users!');
            })
    };

    handleChangeProperty = (property) => {
        this.setState(() => ({ property }));
    }

    hanldeOpenTitleModal = () => {
        this.setState({titleModal: !this.state.titleModal});
    }

    hanldeCloseTitleModal = () => {
        this.setState({titleModal: !this.state.titleModal});
    }

    sendVerification = () => {
        console.log("sendContract ",this.state.sendEmail, "  title: this.stat.title ", this.state.title)
        this.setState({ loadingData: true });
        this.props.client
            .query({
                query: SEND_VERIFICATION,
                variables: { email: this.state.email}
            })
            .then((data) => {
              //  console.log("envio de los contratos ", data)
                if (data.data.sendemailverification != null) {
                    this.props.handleOpenSnackbar('success', 'Email Sent!');
                    this.handleClickCloseModalEmail();
                    //this.resetState();
                } else {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error: Loading agreement: sendcontracts not exists in query data'
                    );
                   this.setState({ loadingData: false });
                }
                this.setState({ loadingData: false });
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading agreement: ' + error);
                this.setState({ loadingData: false });
            });
    };

    printDialogConfirmEmail = () => {
        //console.log("entro aquiiiiiiiii ", this.state.openModalEmail)
            return <Dialog maxWidth="xl" open={this.state.openModalEmail} onClose={this.handleClickCloseModalEmail}>
                <DialogContent>
                <label>Email:</label>
                                    <InputForm
                                        id="sendEmail"
                                        name="sendEmail"
                                        maxLength="100"
                                        value={this.state.sendEmail}
                                        //error={!this.state.usernameValid}
                                        change={(value) => this.onChangeHandler(value, 'sendEmail')}
                                        
                                    />
                </DialogContent>
                <DialogActions>
                    <button className="btn btn-info  btn-not-rounded mb-2" type="button" onClick={this.sendVerification}>
                        Send Email
                    </button>
                    <button className="btn btn-danger btn-not-rounded mr-2 mb-2" type="button" onClick={this.handleClickCloseModalEmail}>
                        Cancel
                    </button>
                </DialogActions>
            </Dialog>
        
    }

    render() {
        const { loading, success } = this.state;
        const { classes } = this.props;
        const { fullScreen } = this.props;
        let userExist = false;

        if (this.state.loading || this.state.insertDialogLoading) {
            return <LinearProgress />
        }


        if (this.state.error) {
            return <LinearProgress />
        }

        /**
         * If the emails match, the user already has a profile created
         */
        this.state.dataEmail.map(item => {
            var email = this.state.email || '';
            if (item.Electronic_Address.trim() === email.trim()) {
                userExist = true;
            }
        });


        /**
         * Function to render a dialog with user options
         **/
        let renderUserDialog = () => (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.openUserModal}
                onClose={this.handleCloseUserModal}
                aria-labelledby="responsive-dialog-title"
                maxWidth="sm"
            >
                <DialogTitle id="responsive-dialog-title" style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {this.state.idToEdit != null &&
                                this.state.idToEdit != '' &&
                                this.state.idToEdit != 0 ? (
                                    'Edit  User'
                                ) : (
                                    'Create User'
                                )}
                        </h5>
                    </div>
                </DialogTitle>
                <DialogContent style={{ minWidth: 600 }}>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="row">
                                <div className="col-md-12 col-lg-6">
                                    <label>* Username</label>
                                    <InputForm
                                        id="username"
                                        name="username"
                                        maxLength="15"
                                        value={this.state.username}
                                        error={!this.state.usernameValid}
                                        change={(value) => this.onChangeHandler(value, 'username')}
                                        disabled={true}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-6">
                                    <label>* Email</label>
                                    <InputForm
                                        id="email"
                                        name="email"
                                        maxLength="50"
                                        value={this.state.email}
                                        error={!this.state.emailValid}
                                        change={(value) => this.onChangeHandler(value, 'email')}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-6">
                                    <label>* Phone Number</label>
                                    <InputMask
                                        id="number"
                                        name="number"
                                        mask="+(999) 999-9999"
                                        maskChar=" "
                                        value={this.state.number}
                                        className={
                                            this.state.numberValid ? 'form-control' : 'form-control _invalid'
                                        }
                                        onChange={(e) => {
                                            this.onChangeHandler(e.target.value, 'number');
                                        }}
                                        placeholder="+(___) ___-____"
                                    />
                                </div>
                                <div className="col-md-12 col-lg-6">
                                    <label>* Role</label>
                                    <select
                                        name="idRol"
                                        className={['form-control', this.state.idRolValid ? '' : '_invalid'].join(
                                            ' '
                                        )}
                                        disabled={this.state.loadingRoles}
                                        onChange={(event) => {
                                            this.updateSelect(event.target.value, 'idRol');
                                        }}
                                        value={this.state.idRol}
                                    >
                                        <option value="">Select a rol</option>
                                        {this.state.roles.map((item) => (
                                            <option key={item.Id} value={item.Id}>
                                                {item.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-12 col-lg-12">
                                    <label>* Language</label>

                                    <select
                                        name="idLanguage"
                                        className={[
                                            'form-control',
                                            this.state.idLanguageValid ? '' : '_invalid'
                                        ].join(' ')}
                                        disabled={this.state.loadingLanguages}
                                        onChange={(event) => {
                                            this.updateSelect(event.target.value, 'idLanguage');
                                        }}
                                        value={this.state.idLanguage}
                                    >
                                        <option value="">Select a language</option>
                                        {this.state.languages.map((item) => (
                                            <option key={item.Id} value={item.Id}>
                                                {item.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-9 col-lg-9">
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions style={{ margin: '16px 10px', borderTop: '1px solid #eee' }}>
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <div>
                                <button
                                    className="btn btn-success"
                                    onClick={this.addUserHandler}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <div>
                                <button className="btn btn-danger" onClick={this.handleCloseUserModal}>
                                    Cancel <i className="fas fa-ban ml-1" />
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
        );

        /**
         * To render a dialog to create contacts
         **/
        let renderDialog = () => {
            const { classes } = this.props;
            return <Dialog
                fullScreen={fullScreen}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                aria-labelledby="responsive-dialog-title"
                maxWidth="lg"
                classes={{ paper: classes.paper }} s
            >
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Add to property</h5>
                    </div>
                </DialogTitle>
                <DialogContent style={{ minWidth: 600, maxWidth: 600, padding: '0px', minHeight: 200, overflowY: "unset" }}>
                    <form className="container">
                        <div className="">
                            <div className="row">
                                <div className="col-md-12 col-lg-12">
                                    <label>* Property Name</label>
                                    <Select
                                        options={this.state.properties}
                                        value={this.state.property}
                                        onChange={this.handleChangeProperty}
                                        closeMenuOnSelect={true}
                                        components={makeAnimated()}
                                        isMulti={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions style={{ margin: '20px 20px' }}>
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <div>
                                <button
                                    variant="fab"
                                    className="btn btn-success"
                                    onClick={this.insertContacts}
                                >
                                    Save {!this.state.saving && <i className="fas fa-save" />}
                                    {this.state.saving && <i className="fas fa-spinner fa-spin" />}
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <div>
                                <button
                                    variant="fab"
                                    className="btn btn-danger"
                                    onClick={this.handleCloseModal}
                                >
                                    Cancel <i className="fas fa-ban" />
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
        }

        return (
            <div className="Apply-container--application">
                <Titles getProfileInformation={this.getProfileInformation} ApplicationId={this.props.applicationId} titleModal={this.state.titleModal} hanldeOpenTitleModal={this.hanldeOpenTitleModal} hanldeCloseTitleModal={this.hanldeCloseTitleModal} />
                <ConfirmDialog
                    open={this.state.openConfirm}
                    closeAction={() => {
                        this.setState({ openConfirm: false, locationAbletoWorkId: 0 });
                    }}
                    confirmAction={() => {
                        this.updateContactByHotelApplication();
                    }}
                    title={dialogMessages[0].label}
                    loading={this.props.removingLocationAbleToWork}
                />


                <Dialog
                    fullScreen={true}
                    open={this.state.openVerification}
                    onClose={this.handleCloseModalVerificacion}
                    aria-labelledby="responsive-dialog-title"
                    style={{ width: '90%', padding: '0px', margin: '0 auto' }}
                >
                    <DialogTitle style={{ padding: '0px' }}>
                        <div className="modal-header">
                            {' '}
                            {this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0 ? (
                                'Edit  Position/Rate'
                            ) : (
                                    <h5 className="modal-title">Employment Verification</h5>
                                )}
                        </div>
                    </DialogTitle>
                    <DialogContent style={{ minWidth: 750, padding: '0px' }}>
                        <div className="row">
                            <div className="col-md-12">
                                <button
                                    //	disabled={this.state.loading || !this.state.enableCancelButton}
                                    variant="fab"
                                    color="secondary"
                                    className={'btn btn-danger pull-right'}
                                    onClick={this.handleCloseModalVerificacion}
                                >
                                    Close <i class="fas fa-times"></i>
                                </button>
                                <button
                                    //	disabled={this.state.loading || !this.state.enableCancelButton}
                                    variant="fab"
                                    color="primary"
                                    className={'btn btn-info mr-1 pull-right'}
                                    onClick={this.handleClickOpenModalEmail}
                                >
                                    Send <i class="fas fa-envelope"></i>
                                </button>

                                <button
                                    //	disabled={this.state.loading || !this.state.enableCancelButton}
                                    variant="fab"
                                    color="primary"
                                    className={'btn btn-info mr-1 pull-right'}
                                    onClick={() => {

                                        this.createDocumentsPDF();
                                        this.sleep().then(() => {
                                            this.downloadDocumentsHandler();
                                        }).catch(error => {
                                            this.setState({ downloading: false })
                                        })
                                    }
                                }
                                >
                                    {this.state.downloading && (
                                            <React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>)}
                                            {!this.state.downloading && (
                                                <React.Fragment>Download <i
                                                    className="fas fa-file-download" /></React.Fragment>)}
                                </button>
                            </div>
                        </div>
                        <div className="row pdf-container">
                                <div id="DocumentPDF" className="signature-information">
                        {renderHTML(`<!DOCTYPE html>
<html>
<head>
</head>
<body>
<p><strong><img style="display: block; margin-left: auto; margin-right: auto;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAGJCAIAAABaZiHiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFRDBCQ0YxQ0JCNTMxMUU4QUI5RTkyNjREMDAzMDg4MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFRDBCQ0YxREJCNTMxMUU4QUI5RTkyNjREMDAzMDg4MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkVEMEJDRjFBQkI1MzExRThBQjlFOTI2NEQwMDMwODgyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVEMEJDRjFCQkI1MzExRThBQjlFOTI2NEQwMDMwODgyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+D8DOXwAAD39JREFUeNrs3UuyG0UQ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" alt="" width="504" height="auto" /></strong></p>
<p style="text-align: center; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;" align="center"><strong><u><span style="font-size: 12.0pt;">Po Box 592715, San Antonio, TX 78259</span></u></strong></p>
<p style="text-align: center; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;" align="center"><strong><u><span style="font-size: 12.0pt;"> </span></u></strong></p>
<p style="text-align: center; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;" align="center"><strong><u><span style="font-size: 12.0pt;">VERIFICATION OF EMPLOYMENT</span></u></strong></p>
<p style="text-align: center; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;" align="center"><strong><u><span style="font-size: 12.0pt;">&nbsp;</span></u></strong></p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">` + this.state.date.substring(0, 10) + `</p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;"><strong>Tumi Staffing</strong></p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;"><strong>Po Box 592715</strong></p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;"><strong>San Antonio, TX 78259</strong></p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">RE: Verification of Employment for <u>` + this.state.applicantName + `</u> </p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">To whom it may concern:</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">Please accept this letter as confirmation that <u>` + this.state.applicantName + `</u> has been employed with <strong>Tumi Staffing</strong> since ` +  this.state.hireDate+ ` .</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">Currently, <u>` + this.state.applicantName + `</u> holds the Title of <u>` + this.state.DeparmentTitle + `</u> and works on a ___________________ [Full time / Part time] basis.</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;"><a name="_GoBack"></a>&nbsp;</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">If you have any questions or require further information, please don&rsquo;t hesitate to contact me at 210-853-2099.</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">Sincerely yours,</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;"><strong>Claudia Robbins</strong></p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;"><strong>Owner</strong></p>
<p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
</body>
</html>`)}
                        </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className="exhibit-button-right">
                            {loading && <CircularProgress size={68} className={classes.fabProgress} />}
                        </div>
                    </DialogActions>
                </Dialog>

                <div className="">
                    <div className="">
                        <div className="applicant-card">
                            <div className="row">
                                <div className="item col-sm-12 col-md-2 col-user-info">
                                    <div className="row">
                                        <span
                                            className="username col-sm-12">{this.state.data.firstName + ' ' + this.state.data.lastName}</span>
                                        <span
                                            className="username-number col-sm-12">Emp #: TM-0000{this.state.data.id}</span>
                                    </div>
                                </div>
                                <div className="item col-12 col-md-2">
                                    <div className="row">
                                        <span className="col-sm-12 font-weight-bold">Hire Date</span>
                                        <span className="col-sm-12">{this.state.hireDate}</span>
                                    </div>
                                </div>
                                <div className="item col-12 col-md-2">
                                    <div className="row">
                                        <span className="col-sm-12 font-weight-bold">Department</span>
                                        <span className="col-sm-12">{this.state.DeparmentTitle == '' ? '--' : this.state.DeparmentTitle}</span>
                                    </div>
                                </div>
                                <div className="item col-12 col-md-2">
                                    <div className="row">
                                        <span className="col-sm-12 font-weight-bold">Schedule Type</span>
                                        <span className="col-sm-12">Text</span>
                                    </div>
                                </div>
                                <div className="item col-sm-12 col-md-1">
                                    <div className="row">
                                        <span className="col-12 col-md-12 font-weight-bold">Active</span>
                                        <div className="col-12 col-md-12">
                                            <div className="onoffswitch">
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.isActive}
                                                    name="IsActive"
                                                    className="onoffswitch-checkbox"
                                                    id="IsActive"
                                                    value={ this.state.isActive}
                                                    disabled={!this.props.hasEmployee ? true : false}
                                                    onChange={(event) => {   
                                                        this.setState({
                                                            isActive: event.target.checked
                                                        }, () => {
                                                            this.updateActive()
                                                        });
                                                    }}
                                                />
                                                <label className="onoffswitch-label" htmlFor="IsActive">
                                                    <span className="onoffswitch-inner" />
                                                    <span className="onoffswitch-switch" />
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="item col-sm-12 col-md-1">
                                    <div className="row">
                                        <span className="col-12 col-md-12 font-weight-bold">Direct Deposit</span>
                                        <div className="col-12 col-md-12">
                                            <div className="onoffswitch">
                                                <input
                                                    id="directDepositInput"
                                                    onChange={(event) => {
                                                        this.setState({
                                                            directDeposit: event.target.checked
                                                        }, () => {
                                                            this.updateDirectDeposit()
                                                        })
                                                    }}

                                                    checked={this.state.directDeposit}
                                                    value={this.state.directDeposit}
                                                    name="directDeposit"
                                                    type="checkbox"
                                                    min="0"
                                                    maxLength="50"
                                                    minLength="10"
                                                    className="onoffswitch-checkbox"
                                                />
                                                <label className="onoffswitch-label" htmlFor="directDepositInput">
                                                    <span className="onoffswitch-inner" />
                                                    <span className="onoffswitch-switch" />
                                                </label>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <div className="row">
                                        <div className="item col-sm-12  col-md-12">
                                            <div className="dropdown">
                                                <button className="btn btn-success dropdown-toggle" type="button"
                                                    id="dropdownMenuButton" data-toggle="dropdown"
                                                    aria-haspopup="true" aria-expanded="false">
                                                    Options
                                                </button>
                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                    {
                                                        this.state.isLead ? (
                                                            <button className="dropdown-item" onClick={() => {
                                                                this.handleClickConvertToEmployee();
                                                            }}>Convert to Employee
                                                            </button>
                                                        ) : ('')

                                                    }
                                                    <button className="dropdown-item" onClick={() => {
                                                        this.handleClickOpenModal();
                                                    }}>Add to hotel
                                                    </button>
                                                      <button className="dropdown-item" onClick={() => {
                                                        this.handleClickOpenVerification();
                                                    }}>Employment Verification
                                                    </button>
                                                    {
                                                        userExist || this.state.createdProfile ? (
                                                            ''
                                                        ) : (
                                                                <button className="dropdown-item" onClick={() => {
                                                                    this.handleClickOpenUserModal();
                                                                }}>Create Profile
                                                            </button>
                                                            )
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="applicant-card general-table-container">
                            <div className="table-responsive">
                                <PunchesReportDetail EmployeeId={this.state.EmployeeId} />
                            </div>
                            <br />
                            <br />
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5 className="float-left">Titles</h5>
                                    <button className="btn btn-link float-left m-0 p-0 ml-2" type="button" onClick={this.hanldeOpenTitleModal}>
                                        <i class="far fa-plus-square"></i>
                                    </button>
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        {
                                            this.state.idealJobs ? 
                                                this.state.idealJobs.map(idealJob => {
                                                    return <div className="col-sm-12 col-md-6 col-lg-3">
                                                        <div className="bg-success p-2 text-white text-center rounded m-1 col text-truncate">
                                                            {idealJob.description}
                                                        </div>
                                                    </div>
                                                })
                                            : {}
                                        }
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5>Location able to work</h5>
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        {this.state.myHotels.map(hotel => {
                                            return <div className="col-sm-12 col-md-6 col-lg-3">

                                                <div className="bg-success p-2 text-white text-center rounded m-1 col text-truncate">
                                                    {hotel.Name}
                                                    <button type="button" className="btn btn-link float-right p-0" onClick={() => {
                                                        this.setState(() => ({ openConfirm: true, locationAbletoWorkId: hotel.Id }))
                                                    }} >
                                                        <i className="fas fa-trash text-white"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    renderDialog()
                }
                {
                    renderUserDialog()
                }
                 {this.printDialogConfirmEmail()}
            </div >
        );
    }
   static  contextTypes = {
        baseUrl: PropTypes.string
    };
}


General.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
};



export default withGlobalContent(withStyles(styles)(withApollo(withMobileDialog()(General))));
