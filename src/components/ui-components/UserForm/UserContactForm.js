import React, { Component } from 'react';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';
import Content from './Content';
import withGlobalContent from "Generic/Global";
import { GET_ROLES_QUERY, GET_LANGUAGES_QUERY, SEND_EMAIL, GET_USER_INFORMATION } from './queries';
import { INSERT_USER_QUERY, UPDATE_USER_QUERY } from './mutation';

class UserContactForm extends Component {
    DEFAULT_STATE = {
        idUser: null,
        fullName: '',
        usernameValid: true,
        emailValid: true,
        numberValid: true,
        idRolValid: true,
        idRol: 5,//Hotel Manager
        loadingRoles: false,
        idLanguage: "",
        firstNameValid: true,
        lastNameValid: true,
        idLanguageValid: true,
        loadingLanguages: false,
        password: 'TEMP',
        idEntity: null
    };
    RESET_VALUES = {
        firstName: '',
        lastName: '',
        email: '',
        number: '',
        username: ''
    }
    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            roles: [],
            languages: [],
            ...this.RESET_VALUES,
            ...this.DEFAULT_STATE
        };
    }
    onChangeHandler = (value, name) => {
        this.setState(() => {
            if ("firstName|lastName".includes(name))
                return { [name]: value, username: this.state.firstName.slice(0, 1) + this.state.lastName + Math.floor(Math.random() * 10000) }
            else return { [name]: value }
        }, this.validateField(name, value));
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

    getDefaultLaguage = () => {
        let english = this.state.languages.find(_ => { return _.Name.trim().toUpperCase() == "ENGLISH" })
        if (english)
            return english.Id;
        return '';
    }

    /**
* To fetch user information
*/
    fetchUserInformation = (Id_Contact) => {
        this.props.client
            .query({
                query: GET_USER_INFORMATION,
                fetchPolicy: 'no-cache',
                variables: {
                    Id_Contact
                }
            })
            .then(({ data: { user } }) => {
                if (user.length > 0) {
                    let record = user[0];
                    let { Id, Id_Entity, Code_User, Electronic_Address, Phone_Number, Id_Roles, Id_Language, firstName, lastName } = record;
                    this.setState(() => ({
                        idUser: Id,
                        username: Code_User,
                        email: Electronic_Address,
                        number: Phone_Number,
                        idRol: Id_Roles,
                        idLanguage: Id_Language,
                        firstName: firstName || '',
                        lastName: lastName || '',
                        idEntity: Id_Entity
                    }))
                } else this.setState(() => ({ ...this.DEFAULT_STATE, idLanguage: this.getDefaultLaguage() }))

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
            .then(({ data: { getroles } }) => {
                this.setState(() => ({
                    roles: getroles,
                    loadingRoles: false
                }), () => {
                    this.fetchLanguages();
                });

            })
            .catch((error) => {

            });
    };

    handleOnClose = () => {
        this.props.handleCloseModal();
        this.setState(() => ({ ...this.DEFAULT_STATE, firstName: '', lastName: '', username: '' }))
    }
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
                    this.setState(() => ({
                        languages: data.data.getcatalogitem,
                        loadingLanguages: false
                    }), () => {
                        this.setState(() => ({
                            idLanguage: this.getDefaultLaguage()
                        }))
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

    validateField = (fieldName, value) => {
        let emailValid = this.state.emailValid;
        let firstNameValid = this.state.firstNameValid;
        let lastNameValid = this.state.lastNameValid;
        let numberValid = this.state.numberValid;
        let idRolValid = this.state.idRolValid;
        let idLanguageValid = this.state.idLanguageValid;


        switch (fieldName) {
            case 'email':
                emailValid = value.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
                break;
            case 'firstName':
                firstNameValid = value.trim().length >= 2;
                break;
            case 'lastName':
                lastNameValid = value.trim().length >= 2;
                break;
            case 'number':
                numberValid =
                    value.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '')
                        .length == 10;
                break;
            case 'idRol':
                idRolValid = this.state.idRol !== null && this.state.idRol !== 0 && this.state.idRol !== '';
                break;
            case 'idLanguage':
                idLanguageValid = this.state.idLanguage !== null && this.state.idLanguage !== 0 && this.state.idLanguage !== '';
                break;
            default:
                break;
        }
        this.setState(
            {
                emailValid,
                firstNameValid,
                lastNameValid,
                numberValid,
                idRolValid,
                idLanguageValid
            },
            this.validateForm
        );
    }

    validateForm = (func = () => { }) => {
        this.setState(
            {
                formValid:
                    this.state.emailValid &&
                    this.state.firstNameValid &&
                    this.state.lastNameValid &&
                    this.state.numberValid &&
                    this.state.idRolValid &&
                    this.state.idLanguageValid
            },
            func
        );
    }

    validateAllFields = (func) => {
        let emailValid = this.state.email.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
        let numberValid =
            this.state.number.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '')
                .length == 10;
        let idRolValid = this.state.idRol !== null && this.state.idRol !== 0 && this.state.idRol !== '';
        let idLanguageValid =
            this.state.idLanguage !== null && this.state.idLanguage !== 0 && this.state.idLanguage !== '';
        let firstNameValid = this.state.firstName.trim().length >= 2;
        let lastNameValid = this.state.lastName.trim().length >= 2
        this.setState(
            {
                emailValid,
                firstNameValid,
                lastNameValid,
                numberValid,
                idRolValid,
                idLanguageValid,
            },
            () => {
                this.validateForm(func);
            }
        );
    }

    addUserHandler = () => {
        this.validateAllFields(() => {
            if (this.state.formValid) {
                if (!this.state.idUser)
                    this.insertUser();
                else this.updateUser();
            }
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
    };

    /**
    * Insert a user with general information and permissions
    */
    insertUser = () => {
        this.setState(
            {
                savingUser: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: INSERT_USER_QUERY,
                        variables: {
                            input: {
                                Id_Entity: this.state.idUser ? this.state.idEntity : this.props.idEntity,
                                Id_Roles: this.state.idRol,
                                Code_User: this.state.username,
                                Full_Name: `${this.state.firstName} ${this.state.lastName}`,
                                Electronic_Address: this.state.email,
                                Phone_Number: this.state.number,
                                Id_Language: this.state.idLanguage,
                                IsAdmin: false,
                                AllowDelete: false,
                                AllowInsert: false,
                                AllowEdit: false,
                                AllowExport: false,
                                IsRecruiter: false,
                                IsActive: true,
                                User_Created: localStorage.getItem("LoginId"),
                                User_Updated: localStorage.getItem("LoginId"),
                                Date_Created: new Date().toISOString(),
                                Date_Updated: new Date().toISOString(),
                                isEmployee: true,
                                firstName: this.state.firstName,
                                lastName: this.state.lastName,
                                Id_Contact: this.state.idContact
                            },
                            idEmployee: 0 //this is to avoid to create a new application and relations , only user record is created
                        }
                    })
                    .then(({ data }) => {
                        var user = data.addUser;

                        this.sendMail(user.Code_User, user.Electronic_Address);

                        this.props.handleOpenSnackbar('success', 'User Created!');

                        this.setState({
                            savingUser: false
                        });
                        this.props.handleCloseModal();

                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error', 'Error: Inserting User: ' + error
                        );
                        this.setState({
                            savingUser: false
                        });
                    });
            }
        );
    };

    /**
    * Insert a user with general information and permissions
    */
    updateUser = () => {
        this.setState(
            {
                savingUser: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_USER_QUERY,
                        variables: {
                            input: {
                                Full_Name: `${this.state.firstName} ${this.state.lastName}`,
                                Electronic_Address: this.state.email,
                                Phone_Number: this.state.number,
                                Id_Language: this.state.idLanguage,
                                User_Updated: localStorage.getItem("LoginId"),
                                Date_Updated: new Date().toISOString(),
                                firstName: this.state.firstName,
                                lastName: this.state.lastName,
                                Id: this.state.idUser
                            }
                        }
                    })
                    .then(({ data }) => {
                        var user = data.udpdateUser;
                        this.props.handleOpenSnackbar('success', 'User Updated!');

                        this.setState({
                            savingUser: false
                        });

                        this.props.handleCloseModal();

                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error', 'Error: Updating User: ' + error
                        );
                        this.setState({
                            savingUser: false
                        });
                    });
            }
        );
    };

    sendMail = (username, email) => {
        this.props.client
            .query({
                query: SEND_EMAIL,
                variables: {
                    username,
                    password: `TEMP`,
                    email,
                    title: `Credential Information`
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Credential has been sent to this employee!');
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Sending Credentials: ' + error);
            });

    };

    componentWillMount() {
        this.fetchRoles();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.contact) {
            if (JSON.stringify(nextProps.contact) != JSON.stringify(this.props.contact)) {
                let { firstname, lastname, email, number, id } = nextProps.contact;
                let username = firstname.trim().slice(0, 1) + lastname.trim() + Math.floor(Math.random() * 10000)
                this.setState(() => ({
                    firstName: firstname.trim(),
                    lastName: lastname.trim(),
                    email,
                    number,
                    username,
                    idContact: id
                }), () => {
                    this.fetchUserInformation(id);
                })
            }
        } else {
            this.setState(() => ({ ...this.RESET_VALUES }))
        }
    }

    render() {
        return <React.Fragment>
            <Dialog
                fullScreen={this.props.fullScreen}
                open={this.props.openModal}
                onClose={this.handleOnClose}
                aria-labelledby="responsive-dialog-title"
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {this.state.idUser ? 'Edit  User' : 'Create User'}
                        </h5>
                    </div>
                </DialogTitle>
                <DialogContent >
                    <h3 className="text-success">{this.state.fullName}</h3>
                    <Content {...this.state} onChangeHandler={this.onChangeHandler} updateSelect={this.updateSelect} />
                </DialogContent>
                <DialogActions style={{ paddingTop: "10px", margin: '16px 10px', borderTop: '1px solid #eee' }}>
                    <div >
                        <button
                            className="btn btn-success"
                            onClick={this.addUserHandler}
                        >
                            Save
                            {!this.state.savingUser && <i className="fas fa-save ml-2" />}
                            {this.state.savingUser && <i class="fas fa-spinner fa-spin ml-2" />}
                        </button>
                    </div>
                    <div >
                        <button className="btn btn-danger" onClick={this.handleOnClose}>
                            Cancel <i className="fas fa-ban ml-1" />
                        </button>
                    </div>
                </DialogActions>
            </Dialog >
        </React.Fragment>
    }
}

UserContactForm.protoTypes = {
    openModal: PropTypes.object.isRequired,
    idEntity: PropTypes.object.isRequired
}

export default withApollo(withGlobalContent(UserContactForm));