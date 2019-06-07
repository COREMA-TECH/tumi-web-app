import React, { Component } from "react";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";
import green from "@material-ui/core/colors/green";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core";
import withApollo from "react-apollo/withApollo";
import { ADD_EMPLOYEES, DELETE_EMPLOYEE, UPDATE_EMPLOYEE, INSERT_USER_QUERY, INSERT_CONTACT } from "./Mutations";
import EmployeeInputRow from "./EmployeeInputRow";
import EmployeesTable from "./EmployeesTable";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import ErrorMessageComponent from "../ui-components/ErrorMessageComponent/ErrorMessageComponent";
import { Query } from "react-apollo";
import NothingToDisplay from "ui-components/NothingToDisplay/NothingToDisplay";
import { GET_ALL_DEPARTMENTS_QUERY, GET_ALL_POSITIONS_QUERY, LIST_EMPLOYEES, SEND_EMAIL,GET_APPLICATION_EMPLOYEES } from "./Queries";
import AlertDialogSlide from "Generic/AlertDialogSlide";
import withGlobalContent from "Generic/Global";
import InputMask from "react-input-mask";
import InputForm from "../ui-components/InputForm/InputForm";
import {
    GET_CONTACTS_IN_USER_DIALOG,
    GET_DEPARTMENTS_QUERY,
    GET_EMAILS_USER,
    GET_HOTELS_QUERY,
    GET_ROLES_QUERY,
} from "../ApplyForm/Application/ProfilePreview/Queries";
import { GET_LANGUAGES_QUERY } from "../ApplyForm-Recruiter/Queries";

const styles = theme => ({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "30px",
        width: "100%"
    },
    root: {
        display: "flex",
        alignItems: "center"
    },
    formControl: {
        margin: theme.spacing.unit
        //width: '100px'
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: "none"
    },
    wrapper: {
        position: "relative"
    },
    buttonSuccess: {
        backgroundColor: green[500],
        "&:hover": {
            backgroundColor: green[700]
        }
    },
    fabProgress: {
        color: green[500],
        position: "absolute",
        top: -6,
        left: -6,
        zIndex: 1
    },
    buttonProgress: {
        color: green[500],
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12
    }
});

class Employees extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openModal: false,
            openModalEdit: false,
            openUserModal: false,
            employeesRegisters: [],
            allDepartments: [],
            allTitles: [],
            rowsInput: [1],
            inputs: 1,
            filterText: "",

            firstNameEdit: "",
            lastNameEdit: "",
            emailEdit: "",
            numberEdit: "",
            idEntity:0,

            emailToCreateUser: "",
            phoneNumberToCreateUser: "",

            progressNewEmployee: false,
            finishLoading: false,
            progressEditEmployee: false,

            ...this.DEFAULT_STATE
        };
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
        idRol: 13,
        idLanguage: 194,
        isAdmin: false,
        allowInsert: false,
        allowEdit: false,
        allowDelete: false,
        allowExport: false,
        IsRecruiter: false,
        IdRegionValid: true,
        RegionName: '',
        IsActive: 1,
        IdRegion: 0,
        employeeId: null,

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
        showCircularLoading: false
    };

    /**
     * To open modal updating the state
     */
    handleClickOpenModal = () => {
        this.setState({ ...this.DEFAULT_STATE, openModal: true });
    };

    /**
     * To hide modal and then restart modal state values
     */
    handleCloseModal = () => {
        this.setState(
            {
                openModal: false
            },
            () => {
                this.setState({
                    rowsInput: [1]
                });
            }
        );
    };

    /**
     * To open modal updating the state
     */
    handleClickOpenModalEdit = () => {
        this.setState({ openModalEdit: true });
    };

    /**
     * To hide modal and then restart modal state values
     */
    handleCloseModalEdit = () => {
        this.setState({
            openModalEdit: false,
            firstNameEdit: "",
            lastNameEdit: "",
            emailEdit: "",
            numberEdit: "",
            departmentEdit: "",
            contactTitleEdit: "",
            idEntityEdit: ""
        });
    };

    /**
     * Manage submit form
     * @param e - event submit of the form
     */
    handleSubmit = e => {
        // Stop submit propagation and prevent even default
        e.preventDefault();
        e.stopPropagation();

        // Build the employee object
        const datos = this.state.rowsInput.map((item, index) => {
            return {
                firstName: this.state[`firstName${index}`],
                lastName: this.state[`lastName${index}`],
                electronicAddress: this.state[`email${index}`],
                mobileNumber: this.state[`phoneNumber${index}`],
                Id_Deparment: parseInt(this.state[`department${index}`]),
                Contact_Title: parseInt(this.state[`contactTitle${index}`]),
                idRole: 1,
                isActive: true,
                userCreated: 1,
                userUpdated: 1,
                idEntity: parseInt(this.state[`idEntity${index}`]),
            };
        });

        // Remove undefined last element
        datos.pop();

        // Insert employees with array of employees
        this.insertEmployees(datos);
    };

    handleSubmitEmployeeEdit = e => {
        // Stop submit propagation and prevent even default
        e.preventDefault();
        e.stopPropagation();


        let form = document.getElementById("employee-edit-form");

        this.setState({
            progressEditEmployee: true,
            finishLoading: false,
            progressNewEmployee: true
        }, () => {
            this.props.client
                .mutate({
                    mutation: UPDATE_EMPLOYEE,
                    variables: {
                        employees: {
                            id: this.state.idToEdit,
                            firstName: form.elements[0].value,
                            lastName: form.elements[1].value,
                            electronicAddress: form.elements[2].value,
                            mobileNumber: form.elements[3].value,
                            Id_Deparment: parseInt(this.state.departmentEdit),
                            Contact_Title: parseInt(this.state.contactTitleEdit),
                            idEntity: parseInt(this.state.hotelEdit),
                            idRole: 1,
                            isActive: true,
                            userCreated: 1,
                            userUpdated: 1
                        },
                        codeuser: localStorage.getItem('LoginId'),
                        nameUser: localStorage.getItem('FullName')
                    }
                })
                .then(() => {
                    this.props.handleOpenSnackbar("success", "Employee Updated!");
                    this.handleCloseModalEdit();

                    this.setState({
                        filterText: ""
                    }, () => {
                        this.setState({
                            progressNewEmployee: false,
                            finishLoading: true,
                            progressEditEmployee: false,
                        });
                    });
                })
                .catch(error => {
                    this.props.handleOpenSnackbar("error", "Error updating Employee!");
                    this.setState({
                        filterText: ""
                    }, () => {
                        this.setState({
                            progressNewEmployee: false,
                            finishLoading: true,
                            progressEditEmployee: false,
                        });
                    });
                });
        });

    };

    insertEmployees = employeesArrays => {
        this.setState(
            {
                progressNewEmployee: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: ADD_EMPLOYEES,
                        variables: {
                            Employees: employeesArrays,
                            codeuser: localStorage.getItem('LoginId'),
                            nameUser: localStorage.getItem('FullName')
                        }
                    })
                    .then(({ data }) => {
                        this.props.handleOpenSnackbar("success", "Employees Saved!");
                        // Hide dialog
                        this.handleCloseModal();

                        this.setState({
                            progressNewEmployee: false,
                            finishLoading: true
                        });
                    })
                    .catch(error => {
                        // Hide dialog
                        this.props.handleOpenSnackbar("error", "Error to save Employees!");
                        this.handleCloseModal();
                        this.setState({
                            progressNewEmployee: false,
                            finishLoading: true
                        });
                    });
            }
        );
    };

    deleteEmployeeById = id => {
        this.setState(
            {
                idToDelete: id
            },
            () => {
                this.setState({
                    opendialog: true,
                    loadingRemoving: false,
                    loadingContracts: false
                });
            }
        );
    };

    deleteEmployee = () => {
        this.setState(
            {
                loadingRemoving: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: DELETE_EMPLOYEE,
                        variables: {
                            id: this.state.idToDelete,
                            codeuser: localStorage.getItem('LoginId'),
                            nameUser: localStorage.getItem('FullName')
                        }
                    })
                    .then(data => {
                        this.setState(
                            {
                                opendialog: false,
                                loadingRemoving: false,
                                finishLoading: true
                            },
                            () => {
                                this.props.handleOpenSnackbar("success", "Employee Deleted!");
                            }
                        );
                    })
                    .catch(error => {
                        this.setState(
                            {
                                opendialog: false,
                                loadingRemoving: false,
                                finishLoading: true
                            },
                            () => {
                                this.props.handleOpenSnackbar(
                                    "error",
                                    "Error: Deleting Employee: " + error
                                );
                            }
                        );
                    });
            }
        );
    };

    /**
     * To create a new row form
     */
    addNewRow = () => {
        this.setState(prevState => ({
            rowsInput: [...prevState.rowsInput, 1]
        }));
    };

    handleChange = (name, value) => {
        this.setState({
            [name]: value
        });
    };

    handleCloseAlertDialog = () => {
        this.setState({ opendialog: false });
    };
    handleConfirmAlertDialog = () => {
        this.deleteEmployee();
    };

    updateEmployeeById = id => {
        this.setState(
            {
                idToEdit: id
            },
            () => {
                this.handleClickOpenModalEdit();
            }
        );
    };

    /****************************************************************************************/

    /**
     * To open the user modal
     */
    handleClickOpenUserModal = (idEntity,email, phoneNumber, idEmployee, fullName, firstName, lastName) => {
        this.setState({ openUserModal: true });
        this.setState({
            idEntity:idEntity || 1,
            email: email,
            number: phoneNumber,
            employeeId: idEmployee,
            fullName: fullName,
            username: firstName.slice(0, 1) + lastName + Math.floor(Math.random() * 10000),
            firstNameEdit: firstName,
            lastNameEdit:lastName
        });
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
            username: '',
            idRol: null,
            idLanguage: null,
            usernameValid: true,
            email: "",
            number: "",
            employeeId: null,
            isAdmin: false,
            allowInsert: false,
            allowEdit: false,
            allowDelete: false,
            allowExport: false,
        })
    };

    /**
     * Fetch hotels
     */
    getHotels = () => {
        this.props.client
            .query({
                query: GET_HOTELS_QUERY
            })
            .then(({ data }) => {
                this.setState({
                    hotels: data.getbusinesscompanies
                }, () => {
                    this.fetchContacts()
                });
            })
            .catch(error => {

            });
    };

    /**
     * To get a list od departments
     */
    fetchDepartments = (id) => {
        this.props.client
            .query({
                query: GET_DEPARTMENTS_QUERY,
                variables: { Id_Entity: id },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getcatalogitem != null) {
                    this.setState({
                        departments: data.data.getcatalogitem,
                    }, () => {
                        this.fetchTitles(id)
                    });
                }
            })
            .catch((error) => {
                // TODO: show a SnackBar with error message

                this.setState({
                    loading: false
                })
            });
    };

    fetchAllDepartments = () => {
        this.props.client
            .query({
                query: GET_ALL_DEPARTMENTS_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.catalogitem != null) {
                    this.setState({
                        allDepartments: data.data.catalogitem,
                    }, () => {
                        this.fetchAllTitles()
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false
                })
            });
    };

    fetchAllTitles = () => {
        this.props.client
            .query({
                query: GET_ALL_POSITIONS_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getposition != null) {
                    this.setState({
                        allTitles: data.data.getposition,
                    }, () => {
                        this.fetchDepartments()
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    loading: false
                })
            });
    };

    /**
     * To fetch a list of contacts
     */
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

    /**
     * To fetch a list of titles
     */
    fetchTitles = (id) => {
        this.props.client
            .query({
                query: GET_ALL_POSITIONS_QUERY,
                variables: { Id_Entity: id },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getposition != null) {
                    this.setState({
                        titles: data.data.getposition,
                    }, () => {
                        this.getHotels()
                    });
                }
            })
            .catch((error) => {
                // TODO: show a SnackBar with error message
                this.setState({
                    loading: false
                })
            });
    };

    getApplicationId = () => {
        this.props.client
            .query({
                query: GET_APPLICATION_EMPLOYEES,
                variables: { EmployeeId: this.state.employeeId }
            })
            .then((data) => {
                this.insertContacts(  data.data.applicationEmployees[0].ApplicationId);
            })
            .catch((error) => {
                console.log("error getApplicationId: ", error)
                // TODO: show a SnackBar with error message
                this.setState({
                    loading: false
                })
            });
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

    onChangeHandler(value, name) {
        this.setState({ [name]: value }, this.validateField(name, value));
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


    addUserHandler = () => {
        this.insertUser();
        /*this.validateAllFields(() => {
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
        });*/
    };


    /**
     * Insert a user with general information and permissions
     */
    insertUser = () => {
        this.setState(
            {
                finishLoading: false,
                savingUser: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: INSERT_USER_QUERY,
                        variables: {
                            input: {
                                Id_Entity: 1,
                                Id_Roles: this.state.idRol,
                                Code_User: this.state.username,
                                Full_Name: this.state.fullname,
                                Electronic_Address: this.state.email,
                                Phone_Number: this.state.number,
                                Id_Language: this.state.idLanguage,
                                IsAdmin: this.state.isAdmin ? 1 : 0,
                                AllowDelete: this.state.allowDelete ? 1 : 0,
                                AllowInsert: this.state.allowInsert ? 1 : 0,
                                AllowEdit: this.state.allowEdit ? 1 : 0,
                                AllowExport: this.state.allowExport ? 1 : 0,
                                IsRecruiter: false,
                                IsActive: this.state.IsActive ? 1 : 0,
                                User_Created: 1,
                                User_Updated: 1,
                                Date_Created: new Date().toISOString(),
                                Date_Updated: new Date().toISOString(),
                                isEmployee: true,
                                firstName: this.state.firstNameEdit,
                                lastName: this.state.lastNameEdit,
                                Full_Name: this.state.firstNameEdit + " " + this.state.lastNameEdit
                            },
                            idEmployee: this.state.employeeId
                        }
                    })
                    .then(({ data }) => {
                        var user = data.addUser;

                        this.sendMail(user.Code_User, user.Electronic_Address);

                        this.getApplicationId();

                        this.props.handleOpenSnackbar('success', 'User Inserted!');

                        this.setState({
                            finishLoading: true,
                            savingUser: false
                        });
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
                            loading: false,
                            savingUser: false
                        });
                    });
            }
        );
    };

    insertContacts=(IdApplication) =>{
       // let form = document.getElementById("employee-edit-form");

        this.props.client
        .mutate({
            mutation: INSERT_CONTACT,
            variables: {
                contacts:{
                Id_Entity:this.state.idEntity,
                ApplicationId: IdApplication,
                First_Name:this.state.firstNameEdit,
                Last_Name: this.state.lastNameEdit,
                Middle_Name: '',
                Electronic_Address: this.state.email,
                Phone_Number: this.state.number,
                Contact_Type: 1,
                IsActive: 1,
                User_Created: 1,
                User_Updated: 1,
                Date_Created:  "2019-05-09T19:42:38.355Z",
                Date_Updated:  "2019-05-09T19:42:38.355Z"
            }
        }
        })
        .then((data) => {
            this.props.handleOpenSnackbar('success', 'Contact Inserted!');
        })
        .catch((error) => {
            this.props.handleOpenSnackbar(
                'error',
                'Error: Inserting Contact: ' + error
            );
      
            return false;
        });
    }

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

    /****************************************************************************************/

    componentWillMount() {
        this.setState({
            loading: true
        }, () => {
            this.fetchAllDepartments()
        })
    }

    render() {

        const { classes } = this.props;
        const { fullScreen } = this.props;

        if (this.state.loading) return <LinearProgress />;

        let renderHeaderContent = () => (
            <div className="row">
                <div className="col-md-4 col-xl-2">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">
                                <i className="fa fa-search icon" />
                            </span>
                        </div>
                        <input
                            onChange={text => {
                                this.setState({
                                    filterText: text.target.value
                                });
                            }}
                            value={this.state.filterText}
                            type="text"
                            placeholder="Search employees"
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-md-8 col-xl-10">
                    <button
                        className="btn btn-success float-right"
                        onClick={this.handleClickOpenModal}
                    >
                        Add Employees
                    </button>
                </div>
            </div>
        );

        /**
         * Function to render a dialog with user options
         **/
        let renderUserDialog = () => (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.openUserModal}
                onClose={this.handleCloseUserModal}
                aria-labelledby="responsive-dialog-title"
                maxWidth={"sm"}
                fullWidth
            >
                <DialogTitle id="responsive-dialog-title">
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
                <DialogContent >
                    <h3 className="text-success">{this.state.fullName}</h3>
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
                                        value={13}
                                        disabled
                                    >
                                        <option value="">Select role</option>
                                        {this.state.roles.map((item) => (
                                            <option key={item.Id} value={item.Id}>
                                                {item.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 col-lg-6">
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
                                        <option value="">Select language</option>
                                        {this.state.languages.map((item) => (
                                            <option key={item.Id} value={item.Id} disabled={item.Id == 199 ? "disabled" : ""}>
                                                {item.Name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-6 col-lg-6">
                                    <label htmlFor="">First Name</label>
                                    <input disabled type="text" className="form-control" value={this.state.firstNameEdit}/>
                                </div>
                                <div className="col-md-6 col-lg-6">
                                    <label htmlFor="">Last Name</label>
                                    <input disabled type="text" className="form-control" value={this.state.lastNameEdit}/>
                                </div>

                            </div>

                        </div>

                    </div>
                </DialogContent>
                <DialogActions style={{ paddingTop: "10px", margin: '16px 10px', borderTop: '1px solid #eee' }}>
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <div>
                                <button
                                    className="btn btn-success"
                                    onClick={this.addUserHandler}
                                >
                                    Save  {this.state.savingUser && <i class="fas fa-spinner fa-spin" />}
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
            </Dialog >
        );

        let renderNewEmployeeDialog = () => (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                aria-labelledby="responsive-dialog-title"
                maxWidth="xl"
                disableBackdropClick={true}
            >
                <form id="employee-form" onSubmit={this.handleSubmit}>
                    <DialogTitle style={{ padding: "0px" }}>
                        <div className="modal-header">
                            <h5 class="modal-title">New Employees</h5>
                            <button type="button" className="float-right btn btn-link" onClick={this.handleCloseModal}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <div className="container EmployeeModal-container">
                            {this.state.rowsInput.map((item, index) => {
                                return (
                                    <EmployeeInputRow
                                        newRow={this.addNewRow}
                                        index={index}
                                        onchange={this.handleChange}
                                        departments={this.state.departments}
                                        titles={this.state.titles}
                                        hotels={this.state.hotels}
                                        phoneRequired={this.state.rowsInput.length - 1 == index ? false : true}
                                    />
                                );
                            })}
                        </div>
                    </DialogContent>
                    <DialogActions style={{ margin: "20px 20px" }}>
                        <div className={[classes.root]}>
                            <div className={classes.wrapper}>
                                {this.state.rowsInput.length > 1 && <button
                                    type="submit"
                                    variant="fab"
                                    className="btn btn-success"
                                >
                                    Save {!this.state.progressNewEmployee && <i class="fas fa-save" />}
                                    {this.state.progressNewEmployee && <i class="fas fa-spinner fa-spin" />}
                                </button>}
                            </div>
                        </div>
                        <div className={classes.root}>
                            <div className={classes.wrapper}>
                                <button
                                    type="reset"
                                    className="btn btn-danger"
                                    onClick={() => {
                                        this.setState({
                                            openModal: false
                                        }, () => {
                                            this.setState({
                                                rowsInput: [1]
                                            });
                                        });
                                    }}
                                >
                                    Cancel <i class="fas fa-ban" />
                                </button>
                            </div>
                        </div>
                    </DialogActions>
                </form>
            </Dialog>
        );
        var loading = this.state.progressEditEmployee || this.state.progressNewEmployee;

        return (

            <div>
                <AlertDialogSlide
                    handleClose={this.handleCloseAlertDialog}
                    handleConfirm={this.handleConfirmAlertDialog}
                    open={this.state.opendialog}
                    loadingConfirm={this.state.loadingRemoving}
                    content="Do you really want to continue whit this operation?"
                />
                {renderHeaderContent()}
                <Dialog
                    open={this.state.openModalEdit}
                    onClose={this.handleCloseModalEdit}
                    maxWidth="xl"
                >
                    <form
                        id="employee-edit-form"
                        onSubmit={this.handleSubmitEmployeeEdit}
                    >
                        <DialogTitle style={{ padding: "0px" }}>
                            <div className="modal-header">
                                <h5 class="modal-title">Edit Employee</h5>
                            </div>
                        </DialogTitle>
                        <DialogContent>
                            <div className="container EmployeeModal-container">

                                <div className="row Employees-row">
                                    <div className="col">
                                        <label htmlFor="" >* First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            className="form-control"
                                            onChange={e => {
                                                this.setState({
                                                    firstNameEdit: e.target.value
                                                });
                                            }}
                                            value={this.state.firstNameEdit}
                                            minLength="3"
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="" >* Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            className="form-control"
                                            onChange={e => {
                                                this.setState({
                                                    lastNameEdit: e.target.value
                                                });
                                            }}
                                            value={this.state.lastNameEdit}
                                            minLength="3"
                                            maxLength={50}
                                            required
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="" >Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            className="form-control"
                                            onChange={e => {
                                                this.setState({
                                                    emailEdit: e.target.value
                                                });
                                            }}
                                            value={this.state.emailEdit}
                                            minLength="3"
                                            maxLength={100}
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="" >* Phone Number</label>
                                        <InputMask
                                            name="number"
                                            mask="+(999) 999-9999"
                                            maskChar=" "
                                            className="form-control"
                                            onChange={e => {
                                                this.setState({
                                                    numberEdit: e.target.value
                                                });
                                            }}
                                            required
                                            value={this.state.numberEdit}
                                            placeholder="+(___) ___-____"
                                            pattern="^(\+\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$"
                                        />
                                    </div>
                                    <div className="col">
                                        <label htmlFor="">Hotel</label>
                                        <select
                                            className="form-control"
                                            onChange={(e) => {
                                                this.setState({
                                                    hotelEdit: e.target.value
                                                });
                                                this.setState({
                                                    departmentEdit: "",
                                                    contactTitleEdit: "",
                                                });

                                                if (e.target.value == "null") {
                                                    this.fetchDepartments();
                                                } else {
                                                    this.fetchDepartments(e.target.value);
                                                }
                                            }}
                                            value={this.state.hotelEdit}
                                        >
                                            <option value="">Select option</option>
                                            {
                                                this.state.hotels.map(item => {
                                                    return (
                                                        <option value={item.Id}>{item.Name.trim()}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="">Department</label>
                                        <select
                                            name="departmentEmployee"
                                            className="form-control"
                                            onChange={(e) => {
                                                this.setState({
                                                    departmentEdit: e.target.value
                                                })

                                            }}
                                            value={this.state.departmentEdit}
                                        >
                                            <option value="">Select option</option>
                                            {

                                                this.state.departments.map(item => {
                                                    return (
                                                        <option value={item.Id}>{item.Name.trim()}</option>
                                                    )
                                                })
                                            }
                                        </select>
                                    </div>
                                    <div className="col">
                                        <label htmlFor="">Position</label>
                                        <select
                                            className="form-control"
                                            onChange={(e) => {
                                                this.setState({
                                                    contactTitleEdit: e.target.value
                                                })
                                            }}
                                            value={this.state.contactTitleEdit}
                                        >
                                            <option value="">Select option</option>
                                            {
                                                this.state.titles.map(item => {
                                                    if (this.state.hotelEdit == item.Id_Entity) {
                                                        return (
                                                            <option value={item.Id}>{item.Position.trim()}</option>
                                                        )
                                                    }
                                                })
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                        <DialogActions style={{ margin: "20px 20px" }}>
                            <div className={[classes.root]}>
                                <div className={classes.wrapper}>
                                    <button
                                        type="submit"
                                        variant="fab"
                                        className="btn btn-success"
                                        disabled={loading}
                                    >
                                        Save {!this.state.progressEditEmployee && <i class="fas fa-save" />}
                                        {this.state.progressEditEmployee && <i class="fas fa-spinner fa-spin" />}
                                    </button>
                                </div>
                            </div>
                            <div className={classes.root}>
                                <div className={classes.wrapper}>
                                    <button
                                        type="reset"
                                        className="btn btn-danger"
                                        onClick={this.handleCloseModalEdit}
                                    >
                                        Cancel <i class="fas fa-ban" />
                                    </button>
                                </div>
                            </div>
                        </DialogActions>
                    </form>
                </Dialog>
                {renderNewEmployeeDialog()}
                {renderUserDialog()}
                <Query query={LIST_EMPLOYEES}>
                    {({ loading, error, data, refetch, networkStatus }) => {
                        if (this.state.finishLoading) {
                            refetch();
                            this.setState(prevState => ({
                                finishLoading: false
                            }));
                        }


                        if (this.state.filterText === "") {
                            if (loading) return <LinearProgress />;
                        }

                        if (error)
                            return (
                                <ErrorMessageComponent
                                    title="Oops!"
                                    message={"Error loading contracts"}
                                    type="Error-danger"
                                    icon="danger"
                                />
                            );
                        if (data.employees != null && data.employees.length > 0) {
                            // this.setState({ data: data.employees });
                           
                            let dataEmployees = data.employees.filter((_, i) => {
                                console.log("data.employees ", _.firstName + _.lastName)
                                if (this.state.filterText === "") {
                                    return true;
                                }
                                if ((_.firstName + _.lastName)
                                    .toLocaleLowerCase().indexOf(this.state.filterText.toLocaleLowerCase()) > -1) {
                                    return true;
                                }
                            });

                            return (
                                <div className="">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="card">
                                                <div className="card-body tumi-forcedResponsiveTable">
                                                    <EmployeesTable
                                                        data={dataEmployees}
                                                        delete={id => {
                                                            this.deleteEmployeeById(id);
                                                        }}
                                                        update={(id, row) => {
                                                            this.updateEmployeeById(id);
                                                            this.setState({
                                                                firstNameEdit: row.firstName,
                                                                lastNameEdit: row.lastName,
                                                                emailEdit: row.electronicAddress,
                                                                numberEdit: row.mobileNumber,
                                                                departmentEdit: row.Id_Deparment,
                                                                contactTitleEdit: row.Contact_Title,
                                                                hotelEdit: row.idEntity
                                                            }, () => {
                                                                if (this.state.hotelEdit == null) {
                                                                    this.fetchDepartments()
                                                                } else {
                                                                    this.fetchDepartments(parseInt(this.state.hotelEdit))
                                                                }
                                                            });

                                                        }}
                                                        handleClickOpenUserModal={this.handleClickOpenUserModal}
                                                        departments={this.state.allDepartments}
                                                        titles={this.state.allTitles}
                                                    />                                                
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                        return (
                            <NothingToDisplay
                                title="Oops!"
                                message={"There are no employees"}
                                type="Error-success"
                                icon="wow"
                            />
                        );
                    }}
                </Query>
            </div>
        );
    }
}

Employees.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles)(withApollo(withGlobalContent(Employees)));
