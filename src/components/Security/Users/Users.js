import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import UsersTable from './UsersTable';
import gql from 'graphql-tag';
import green from '@material-ui/core/colors/green';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import { withApollo } from 'react-apollo';
import Tooltip from '@material-ui/core/Tooltip';

import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import InputForm from 'ui-components/InputForm/InputForm';
import InputMask from 'react-input-mask';
import 'ui-components/InputForm/index.css';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import './index.css';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
import withGlobalContent from 'Generic/Global';

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
    contactControl: { width: '535px', paddingRight: '0px' },
    rolControl: { width: '260px', paddingRight: '0px' },
    languageControl: { width: '260px', paddingRight: '0px' },
    usernameControl: {
        width: '150px'
    },
    fullnameControl: {
        width: '300px'
    },
    emailControl: {
        width: '350px'
    },
    numberControl: {
        //width: '150px'
    },
    passwordControl: {
        width: '120px'
    },

    resize: {
        //width: '200px'
    },
    divStyle: {
        width: '95%',
        display: 'flex'
        //justifyContent: 'space-around'
    },
    divStyleColumns: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingLeft: '40px'
    },
    divAddButton: {
        display: 'flex',
        justifyContent: 'end',
        width: '95%',
        heigth: '60px'
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
    }
});

class Catalogs extends React.Component {

    GET_CONTACTS_QUERY = gql`
        {
            catalogitem(Id_Catalog:8,IsActive:1){
                Id
                Name
                DisplayLabel
                contacts{
                  First_Name
                  Middle_Name
                }
            }
            getcatalogitem(Id_Catalog: 4) {
                Id
                Name
                DisplayLabel
            }
        }
    `;

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

    GET_ROLES_QUERY = gql`
        {
            getroles(IsActive: 1) {
                Id
                Name: Description
            }
        }
    `;
    GET_LANGUAGES_QUERY = gql`
        {
            getcatalogitem(IsActive: 1, Id_Catalog: 9) {
                Id
                Name
                IsActive
            }
        }
    `;
    GET_USERS_QUERY = gql`
        {
            getusers(IsActive: 1) {
                Id
                Id_Contact
                Id_Roles
                Code_User
                Full_Name
                Electronic_Address
                Phone_Number
                Password
                Id_Language
                IsAdmin
                AllowDelete
                AllowInsert
                AllowExport
                AllowEdit
                IsRecruiter
                isEmployee
                IdRegion
                IsActive
                IdSchedulesEmployees
                IdSchedulesManager
            }
        }
    `;
    INSERT_USER_QUERY = gql`
        mutation insusers($input: iUsers!) {
            insusers(input: $input) {
                Id
            }
        }
    `;

    SEND_EMAIL = gql`
        query sendemail($username: String,$password: String,$email: String,$title:String) {
            sendemail(username:$username,password:$password,email:$email,title:$title)
        }
    `;

    UPDATE_USER_QUERY = gql`
        mutation updusers($input: iUsers!) {
            updusers(input: $input) {
                Id
            }
        }
    `;


    UPDATE_PASSWORD_USER_QUERY = gql`
        mutation UpdUsersPassword($Id: Int!,$Password: String!) {
            upduserspassword(Id: $Id,Password: $Password) {
                Id
            }
        }
    `;

    DELETE_USER_QUERY = gql`
        mutation delusers($Id: Int!) {
            delusers(Id: $Id, IsActive: 0) {
                Id
            }
        }
    `;

    TITLE_ADD = 'Add User';
    TITLE_EDIT = 'Update User';

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
        isEmployee: false,
        IdRegionValid: true,
        RegionName: '',
        IsActive: 1,
        IdRegion: 0,

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
        resetPassword: false,
        showCircularLoading: false
    };

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            contacts: [],
            roles: [{ Id: 0, Name: 'Nothing' }],
            languages: [{ Id: 0, Name: 'Nothing' }],
            regions: [{ Id: 0, Name: 'Nothing' }],
            loadingData: false,
            loadingContacts: false,
            loadingRoles: false,
            loadingLanguages: false,
            firstLoad: true,
            indexView: 0, //Loading
            errorMessage: '',
            idCompany: this.props.idCompany,
            IdSchedulesEmployees: "",
            IdSchedulesManager: "",

            ...this.DEFAULT_STATE
        };
        this.onEditHandler = this.onEditHandler.bind(this);
        this.Login = {
            LoginId: localStorage.getItem('LoginId'),
            IsAdmin: localStorage.getItem('IsAdmin'),
            AllowEdit: localStorage.getItem('AllowEdit') === 'true',
            AllowDelete: localStorage.getItem('AllowDelete') === 'true',
            AllowInsert: localStorage.getItem('AllowInsert') === 'true',
            AllowExport: localStorage.getItem('AllowExport') === 'true'
        };
    }

    focusTextInput() {
        if (document.getElementById('username') != null) {
            document.getElementById('username').focus();
            document.getElementById('username').select();
        }
    }

    componentDidMount() {
        this.resetState();
    }

    GENERATE_ID = () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    resetState = (func = () => {
    }) => {
        this.setState(
            {
                ...this.DEFAULT_STATE
            },
            func
        );
    };
    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
    };

    onChangeHandler(value, name) {
        this.setState({ [name]: value }, this.validateField(name, value));
    }

    onBlurHandler(e) {
        //const name = e.target.name;
        //const value = e.target.value;
        //this.setState({ [name]: value.trim() }, this.validateField(name, value));
    }

    onSelectChangeHandler(e) {
        const name = e.target.name;
        const value = e.target.value;
        this.setState({ [name]: value }, () => {
            this.validateField(name, value);
        });
    }

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
                    },
                    );
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
        //if (this.state.IsRecruiter)
        //	IdRegionValid = this.state.IdRegion !== null && this.state.IdRegion !== 0 && this.state.IdRegion !== '';
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
            //case 'fullname':
            //	fullnameValid = value.trim().length >= 10;
            //	fullnameHasValue = value != '';
            //	break;
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

    handleCloseAlertDialog = () => {
        this.setState({ opendialog: false });
    };
    handleConfirmAlertDialog = () => {
        this.deleteUser();
    };
    onEditHandler = ({
        Id,
        Id_Contact,
        Id_Roles,
        Code_User,
        Full_Name,
        Electronic_Address,
        Phone_Number,
        Password,
        Id_Language,
        IsAdmin,
        AllowDelete,
        AllowInsert,
        AllowExport,
        AllowEdit,
        IsRecruiter,
        IdRegion,
        IsActive,
        IdSchedulesEmployees,
        IdSchedulesManager,
    }) => {
        this.setState({ showCircularLoading: false }, () => {
            this.setState(
                {
                    idToEdit: Id,
                    idContact: Id_Contact == null ? undefined : Id_Contact,
                    idRol: Id_Roles,
                    username: Code_User.trim(),
                    fullname: Full_Name.trim(),
                    email: Electronic_Address.trim(),
                    number: Phone_Number.trim(),
                    password: Password.trim(),
                    idLanguage: Id_Language,
                    isAdmin: IsAdmin == 1,
                    allowDelete: AllowDelete == 1,
                    allowInsert: AllowInsert == 1,
                    allowExport: AllowExport == 1,
                    allowEdit: AllowEdit == 1,
                    IsRecruiter: IsRecruiter,
                    IdRegion: IdRegion,
                    IsActive: IsActive == 1,
                    IdSchedulesEmployees: IdSchedulesEmployees != null ? IdSchedulesEmployees.toString() : null,
                    IdSchedulesManager: IdSchedulesManager != null ? IdSchedulesManager.toString() : null,
                    formValid: true,
                    idContactValid: true,
                    idRolValid: true,
                    usernameValid: true,
                    //fullnameValid: true,
                    emailValid: true,
                    numberValid: true,
                    passwordValid: true,
                    idLanguageValid: true,

                    enableCancelButton: true,
                    idContactHasValue: true,
                    idRolHasValue: true,
                    usernameHasValue: true,
                    //fullnameHasValue: true,
                    emailHasValue: true,
                    numberHasValue: true,
                    passwordHasValue: true,
                    idLanguageHasValue: true,
                    openModal: true,
                    buttonTitle: this.TITLE_EDIT
                },
                this.focusTextInput,
            );
        });
    };

    onDeleteHandler = (idSearch) => {
        this.setState({ idToDelete: idSearch, opendialog: true, showCircularLoading: false });
    };

    componentWillMount() {
        this.setState({ firstLoad: true }, () => {
            this.loadUsers(() => {
                this.loadContacts(() => {
                    this.loadRoles(() => {
                        this.loadLanguages(() => {
                            this.setState({ indexView: 1, firstLoad: false });
                        });
                    });
                });
            });
        });
    }

    loadUsers = (func = () => {
    }) => {
        this.setState({ loadingData: true }, () => {
            this.props.client
                .query({
                    query: this.GET_USERS_QUERY,
                    fetchPolicy: 'no-cache'
                })
                .then((data) => {
                    if (data.data.getusers != null) {
                        this.setState(
                            {
                                data: data.data.getusers,
                                loadingData: false
                            },
                            func
                        );
                    } else {
                        this.setState({
                            loadingData: false,
                            firstLoad: false,
                            indexView: 2,
                            errorMessage: 'Error: Loading users: getusers not exists in query data'
                        });
                    }
                })
                .catch((error) => {
                    this.setState({
                        loadingData: false,
                        firstLoad: false,
                        indexView: 2,
                        errorMessage: 'Error: Loading users: ' + error
                    });
                });
        });
    };

    loadContacts = (func = () => {
    }) => {
        this.setState({ loadingContacts: true }, () => {
            this.props.client
                .query({
                    query: this.GET_CONTACTS_QUERY,
                    fetchPolicy: 'no-cache'
                })
                .then((data) => {
                    if (data.data.catalogitem != null && data.data.getcatalogitem) {
                        console.log(data.data.catalogitem)
                        this.setState(
                            {
                                contacts: data.data.catalogitem,
                                regions: data.data.getcatalogitem,
                                RegionName: data.data.getcatalogitem[0].Name,
                                //email: data.data.Electronic_Address,
                                //number: data.data.Phone_Number,
                                loadingContacts: false
                            },
                            func
                        );
                    } else {
                        this.setState({
                            loadingContacts: false,
                            firstLoad: false,
                            indexView: 2,
                            errorMessage: 'Error: Loading contacts: object doesn´t exists in query'
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
        });
    };
    loadRoles = (func = () => {
    }) => {
        this.setState({ loadingRoles: true }, () => {
            this.props.client
                .query({
                    query: this.GET_ROLES_QUERY,
                    fetchPolicy: 'no-cache'
                })
                .then((data) => {
                    if (data.data.getroles != null) {
                        this.setState(
                            {
                                roles: data.data.getroles,
                                loadingRoles: false
                            },
                            func
                        );
                    } else {
                        this.setState({
                            loadingRoles: false,
                            firstLoad: false,
                            indexView: 2,
                            errorMessage: 'Error: Loading roles: getroles not exists in query data'
                        });
                    }
                })
                .catch((error) => {
                    this.setState({
                        loadingRoles: false,
                        firstLoad: false,
                        indexView: 2,
                        errorMessage: 'Error: Loading roles: ' + error
                    });
                });
        });
    };

    loadLanguages = (func = () => {
    }) => {
        this.setState({ loadingLanguages: true }, () => {
            this.props.client
                .query({
                    query: this.GET_LANGUAGES_QUERY,
                    fetchPolicy: 'no-cache'
                })
                .then((data) => {
                    if (data.data.getcatalogitem != null) {
                        this.setState(
                            {
                                languages: data.data.getcatalogitem,
                                loadingLanguages: false
                            },
                            func
                        );
                    } else {
                        this.setState({
                            loadingLanguages: false,
                            firstLoad: false,
                            indexView: 2,
                            errorMessage: 'Error: Loading languages: getcatalogitem not exists in query data'
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
        });
    };

    getObjectToInsertAndUpdate = () => {
        let id = 0;
        let query = this.INSERT_USER_QUERY;
        const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

        if (isEdition) {
            query = this.UPDATE_USER_QUERY;
        }

        return { isEdition: isEdition, query: query, id: this.state.idToEdit };
    };
    insertUser = () => {
        const { isEdition, query, id } = this.getObjectToInsertAndUpdate();
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: query,
                        variables: {
                            input: {
                                Id: id,
                                Id_Entity: 1,
                                Id_Contact: this.state.idContact == undefined ? null : this.state.idContact,
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
                                IsRecruiter: this.state.IsRecruiter,
                                isEmployee: this.state.isEmployee,
                                IdRegion: this.state.IdRegion,
                                IsActive: this.state.IsActive ? 1 : 0,
                                User_Created: 1,
                                User_Updated: 1,
                                Date_Created: "'2018-08-14 16:10:25+00'",
                                Date_Updated: "'2018-08-14 16:10:25+00'",
                                IdSchedulesEmployees: parseInt(this.state.IdSchedulesEmployees),
                                IdSchedulesManager: parseInt(this.state.IdSchedulesManager),
                            }
                        }
                    })
                    .then((data) => {
                        if (this.state.idToEdit == null) {
                            this.sendMail();
                        }
                        this.props.handleOpenSnackbar('success', isEdition ? 'User Updated!' : 'User Inserted!');

                        this.setState({ openModal: false, showCircularLoading: true }, () => {
                            this.loadUsers(() => {
                                this.loadContacts(() => {
                                    this.loadRoles(() => {
                                        this.loadLanguages(this.resetState);
                                    });
                                });
                            });
                        });
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error',
                            isEdition ? 'Error: Updating User: ' + error : 'Error: Inserting User: ' + error
                        );
                        this.setState({
                            loading: false
                        });
                    });
            }
        );
    };
    deleteUser = () => {
        this.setState(
            {
                loadingConfirm: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: this.DELETE_USER_QUERY,
                        variables: {
                            Id: this.state.idToDelete
                        }
                    })
                    .then((data) => {
                        this.props.handleOpenSnackbar('success', 'user Deleted!');
                        this.setState(
                            { openModal: false, firstLoad: true, showCircularLoading: true, opendialog: false },
                            () => {
                                this.loadUsers(() => {
                                    this.loadContacts(() => {
                                        this.loadRoles(() => {
                                            this.loadLanguages(() => {
                                                this.resetState(() => {
                                                    this.setState({ indexView: 1, firstLoad: false });
                                                });
                                            });
                                        });
                                    });
                                });
                            }
                        );
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar('error', 'Error: Deleting User: ' + error);
                        this.setState({
                            loadingConfirm: false
                        });
                    });
            }
        );
    };

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
                        this.props.handleOpenSnackbar('success', 'Email Send!');
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

    cancelUserHandler = () => {
        this.resetState();
    };

    resetPasswordHandler = () => {
        this.setState(
            {
                resetPassword: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: this.UPDATE_PASSWORD_USER_QUERY,
                        variables: {
                            Id: this.state.idToEdit,
                            Password: `'TEMP','AES_KEY'`
                        }
                    })
                    .then((data) => {
                        this.props.handleOpenSnackbar('success', 'Password Changed Successfully!');
                        this.setState({
                            resetPassword: false, openModal: false
                        });

                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error', 'Error: Updating password: ' + error
                        );
                        this.setState({
                            resetPassword: false
                        });
                    });
            }
        );
    };

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
    handleClickOpenModal = () => {
        this.setState({ openModal: true });
    };

    handleCloseModal = () => {
        this.setState({ openModal: false });
    };

    render() {
        const { loading, success } = this.state;
        const { classes } = this.props;
        const { fullScreen } = this.props;

        const isLoading =
            this.state.loadingData ||
            this.state.loadingContacts ||
            this.state.loadingRoles ||
            this.state.loadingLanguages ||
            this.state.loading ||
            this.state.firstLoad;

        if (this.state.indexView == 0) {
            return <React.Fragment>{isLoading && <LinearProgress />}</React.Fragment>;
        }
        if (this.state.indexView == 2) {
            return (
                <React.Fragment>
                    {isLoading && <LinearProgress />}
                    <NothingToDisplay
                        title="Oops!"
                        message={this.state.errorMessage}
                        type="Error-danger"
                        icon="danger"
                    />
                </React.Fragment>
            );
        }
        return (
            <div className="users_tab">
                {isLoading && <LinearProgress />}

                <AlertDialogSlide
                    handleClose={this.handleCloseAlertDialog}
                    handleConfirm={this.handleConfirmAlertDialog}
                    open={this.state.opendialog}
                    loadingConfirm={this.state.loadingConfirm}
                    content="Do you really want to continue whit this operation?"
                />
                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.openModal}
                    onClose={this.cancelUserHandler}
                    aria-labelledby="responsive-dialog-title"
                    maxWidth="md"
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
                    <DialogContent style={{ minWidth: 600, padding: '0px' }}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="row">
                                        <div className="col-md-12 col-lg-6">
                                            <label>* Contact</label>
                                            <select
                                                name="idContact"
                                                className={[
                                                    'form-control',
                                                    this.state.idContactValid ? '' : '_invalid'
                                                ].join(' ')}
                                                disabled={this.state.loadingContacts}
                                                onChange={(event) => {
                                                    this.updateSelect(event.target.value, 'idContact');
                                                    this.SelectContac(event.target.value);
                                                }}
                                                value={this.state.idContact}

                                            >
                                                <option value={undefined}>Select a contact</option>
                                                {this.state.contacts.map((item) => (
                                                    <optgroup label={item.DisplayLabel}>
                                                        {item.contacts.map((contact) => (
                                                            <option key={contact.Id} value={contact.Id}>
                                                                {contact.First_Name + ' ' + contact.Middle_Name}
                                                            </option>
                                                        ))}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-12 col-lg-6">
                                            <label>* Username</label>
                                            <InputForm
                                                id="username"
                                                name="username"
                                                maxLength="15"
                                                value={this.state.username}
                                                error={!this.state.usernameValid}
                                                change={(value) => this.onChangeHandler(value, 'username')}
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
                                                placeholder="+(999) 999-9999"
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
                                                <option value="">Select a role</option>
                                                {this.state.roles.map((item) => (
                                                    <option key={item.Id} value={item.Id}>
                                                        {item.Name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-12 col-lg-6">
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

                                        <div className="col-md-3 col-lg-3">
                                            <label>Recruiter?</label>

                                            <div className="onoffswitch">
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.IsRecruiter}
                                                    name="IsRecruiter"
                                                    onChange={this.handleCheckedChange('IsRecruiter')}
                                                    className="onoffswitch-checkbox"
                                                    id="IsRecruiter"
                                                />
                                                <label className="onoffswitch-label" htmlFor="IsRecruiter">
                                                    <span className="onoffswitch-inner" />
                                                    <span className="onoffswitch-switch" />
                                                </label>
                                            </div>

                                            <label>Manage app?</label>

                                            <div className="onoffswitch">
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.isEmployee}
                                                    name="manageApp"
                                                    onChange={this.handleCheckedChange('manageApp')}
                                                    className="onoffswitch-checkbox"
                                                    id="manageApp"
                                                />
                                                <label className="onoffswitch-label" htmlFor="manageApp">
                                                    <span className="onoffswitch-inner" />
                                                    <span className="onoffswitch-switch" />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-md-3 col-lg-3">
                                            <label>Is Field Employees?</label>

                                            <div className="onoffswitch">
                                                <input
                                                    type="checkbox"
                                                    checked={this.state.isEmployee}
                                                    name="isEmployee"
                                                    onChange={this.handleCheckedChange('isEmployee')}
                                                    className="onoffswitch-checkbox"
                                                    id="isEmployee"
                                                />
                                                <label className="onoffswitch-label" htmlFor="isEmployee">
                                                    <span className="onoffswitch-inner" />
                                                    <span className="onoffswitch-switch" />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-md-9 col-lg-6">
                                            <label>{this.state.IsRecruiter ? '* ' : ''}Region</label>
                                            <AutosuggestInput
                                                id="IdRegion"
                                                name="IdRegion"
                                                data={this.state.regions}
                                                //error={!this.state.IdRegionValid}
                                                disabled={!this.state.IsRecruiter}
                                                value={this.state.RegionName}
                                                onChange={(value) => {
                                                    this.updateSelect(value, 'RegionName');
                                                }}
                                                onSelect={(value) => {
                                                    this.updateSelect(value, 'RegionName');
                                                }}
                                            />
                                            {/*
										<select
											name="IdRegion"
											className={[
												'form-control',
												this.state.IdRegionValid ? '' : '_invalid'
											].join(' ')}
											disabled={!this.state.IsRecruiter}
											onChange={(event) => {
												this.updateSelect(event.target.value, 'IdRegion');
											}}
											value={this.state.IdRegion}
										>
											<option value="">Select a region</option>
											{this.state.regions.map((item) => (
												<option key={item.Id} value={item.Id}>
													{item.Name}
												</option>
											))}
										</select>
										*/}
                                        </div>
                                    </div>
                                </div>
                                <div className="col-lg-4">
                                    <div className="card">
                                        <div className="card-header info">Permissions</div>
                                        <div className="card-body p-0">
                                            <ul className="row w-100 bg-light CardPermissions">
                                                <li className="col-md-4 col-sm-4 col-lg-6">
                                                    <label>Active?</label>

                                                    <div className="onoffswitch">
                                                        <input
                                                            type="checkbox"
                                                            checked={this.state.IsActive}
                                                            name="IsActive"
                                                            onChange={this.handleCheckedChange('IsActive')}
                                                            className="onoffswitch-checkbox"
                                                            id="IsActive"
                                                        />
                                                        <label className="onoffswitch-label" htmlFor="IsActive">
                                                            <span className="onoffswitch-inner" />
                                                            <span className="onoffswitch-switch" />
                                                        </label>
                                                    </div>
                                                </li>
                                                <li className="col-md-4 col-sm-4 col-lg-6">
                                                    <label>Admin?</label>

                                                    <div className="onoffswitch">
                                                        <input
                                                            type="checkbox"
                                                            checked={this.state.isAdmin}
                                                            name="isAdmin"
                                                            onChange={this.handleCheckedChange('isAdmin')}
                                                            className="onoffswitch-checkbox"
                                                            id="isAdmin"
                                                        />
                                                        <label className="onoffswitch-label" htmlFor="isAdmin">
                                                            <span className="onoffswitch-inner" />
                                                            <span className="onoffswitch-switch" />
                                                        </label>
                                                    </div>
                                                </li>
                                                <li className="col-md-4 col-sm-4 col-lg-6">
                                                    <label>Insert?</label>

                                                    <div className="onoffswitch">
                                                        <input
                                                            type="checkbox"
                                                            checked={this.state.allowInsert}
                                                            name="allowInsert"
                                                            onChange={this.handleCheckedChange('allowInsert')}
                                                            className="onoffswitch-checkbox"
                                                            id="allowInsert"
                                                        />
                                                        <label className="onoffswitch-label" htmlFor="allowInsert">
                                                            <span className="onoffswitch-inner" />
                                                            <span className="onoffswitch-switch" />
                                                        </label>
                                                    </div>
                                                </li>
                                                <li className="col-md-4 col-sm-4 col-lg-6">
                                                    <label>Edit?</label>

                                                    <div className="onoffswitch">
                                                        <input
                                                            type="checkbox"
                                                            checked={this.state.allowEdit}
                                                            name="allowEdit"
                                                            onChange={this.handleCheckedChange('allowEdit')}
                                                            className="onoffswitch-checkbox"
                                                            id="allowEdit"
                                                        />
                                                        <label className="onoffswitch-label" htmlFor="allowEdit">
                                                            <span className="onoffswitch-inner" />
                                                            <span className="onoffswitch-switch" />
                                                        </label>
                                                    </div>
                                                </li>
                                                <li className="col-md-4 col-sm-4 col-lg-6">
                                                    <label>Delete?</label>

                                                    <div className="onoffswitch">
                                                        <input
                                                            type="checkbox"
                                                            checked={this.state.allowDelete}
                                                            name="allowDelete"
                                                            onChange={this.handleCheckedChange('allowDelete')}
                                                            className="onoffswitch-checkbox"
                                                            id="allowDelete"
                                                        />
                                                        <label className="onoffswitch-label" htmlFor="allowDelete">
                                                            <span className="onoffswitch-inner" />
                                                            <span className="onoffswitch-switch" />
                                                        </label>
                                                    </div>
                                                </li>
                                                <li className="col-md-4 col-sm-4 col-lg-6">
                                                    <label>Export?</label>

                                                    <div className="onoffswitch">
                                                        <input
                                                            type="checkbox"
                                                            checked={this.state.allowExport}
                                                            name="allowExport"
                                                            onChange={this.handleCheckedChange('allowExport')}
                                                            className="onoffswitch-checkbox"
                                                            id="allowExport"
                                                        />
                                                        <label className="onoffswitch-label" htmlFor="allowExport">
                                                            <span className="onoffswitch-inner" />
                                                            <span className="onoffswitch-switch" />
                                                        </label>
                                                    </div>
                                                </li>
                                                <br /><br />
                                                <li className="col-md-4 col-sm-12 col-lg-12">
                                                    <label>Employees can see schedules for:</label>
                                                    <br />
                                                    <select
                                                        value={this.state.IdSchedulesEmployees}
                                                        onChange={e => {
                                                            this.setState({
                                                                IdSchedulesEmployees: e.target.value
                                                            })
                                                        }}
                                                        className="form-control">
                                                        <option value="">Select a option</option>
                                                        <option value="0">The company</option>
                                                        <option value="1">Their group</option>
                                                        <option value="2">Just themselves</option>
                                                    </select>
                                                </li>
                                                <li className="col-md-6 col-sm-12 col-lg-12">
                                                    <label>Managers can add, edit or delete shifts for:</label>
                                                    <br />
                                                    <select
                                                        value={this.state.IdSchedulesManager}
                                                        onChange={e => {
                                                            this.setState({
                                                                IdSchedulesManager: e.target.value
                                                            })
                                                        }}
                                                        className="form-control">
                                                        <option value="">Select a option</option>
                                                        <option value="0">The company</option>
                                                        <option value="1">Their employees</option>
                                                    </select>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions style={{ margin: '16px 10px' }}>
                        <div className={classes.root}>
                            <div className={classes.wrapper}>
                                <Tooltip
                                    title={
                                        this.state.idToEdit != null &&
                                            this.state.idToEdit != '' &&
                                            this.state.idToEdit != 0 ? (
                                                'Save Changes'
                                            ) : (
                                                'Insert Record'
                                            )
                                    }
                                >
                                    <div>
                                        <button
                                            disabled={isLoading || !this.Login.AllowEdit || !this.Login.AllowInsert}
                                            className="btn btn-success"
                                            onClick={this.addUserHandler}
                                        >
                                            Save {!isLoading && <i className="fas fa-save ml-1" />}
                                            {isLoading && <i className="fas fa-spinner fa-spin ml-1" />}
                                        </button>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>

                        <div className={classes.root}>
                            {this.state.idToEdit ?
                                <div className={classes.wrapper}>
                                    <Tooltip title={'Cancel Operation'}>
                                        <div>
                                            <button className="btn btn-warning" onClick={this.resetPasswordHandler}>
                                                Reset Password {!this.state.resetPassword && <i className="fas fa-sync-alt" />}
                                                {this.state.resetPassword && <i className="fas fa-spinner fa-spin ml-1" />}
                                            </button>
                                        </div>
                                    </Tooltip>
                                </div> : ''}


                            <div className={classes.wrapper}>
                                <Tooltip title={'Cancel Operation'}>
                                    <div>
                                        <button className="btn btn-danger" onClick={this.cancelUserHandler}>
                                            Cancel <i className="fas fa-ban ml-1" />
                                        </button>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </DialogActions>
                </Dialog>

                <div className="users__header">
                    <button className="btn btn-success mr-1" onClick={this.handleClickOpenModal} disabled={isLoading}>
                        Add User<i className="fas fa-plus ml-2" />
                    </button>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <UsersTable
                            data={this.state.data}
                            contacts={this.state.contacts}
                            roles={this.state.roles}
                            languages={this.state.languages}
                            loading={this.state.showCircularLoading && isLoading}
                            onEditHandler={this.onEditHandler}
                            onDeleteHandler={this.onDeleteHandler}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

Catalogs.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(withMobileDialog()(withGlobalContent(Catalogs))));
