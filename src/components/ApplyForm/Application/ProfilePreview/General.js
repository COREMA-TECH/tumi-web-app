import React, {Component} from 'react';
import './preview-profile.css';
import './../index.css';
import withApollo from "react-apollo/withApollo";
import {
    GET_APPLICATION_PROFILE_INFO, GET_CONTACTS_IN_USER_DIALOG,
    GET_CONTACTS_QUERY,
    GET_DEPARTMENTS_QUERY,
    GET_HOTELS_QUERY, GET_ROLES_QUERY,
    GET_TYPES_QUERY
} from "./Queries";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import InputMask from "react-input-mask";
import green from "@material-ui/core/colors/green";
import Tooltip from '@material-ui/core/Tooltip';
import InputForm from 'ui-components/InputForm/InputForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core";
import withMobileDialog from "@material-ui/core/withMobileDialog/withMobileDialog";
import ContactTypesData from '../../../../data/contactTypes';
import withGlobalContent from "../../../Generic/Global";
import {INSERT_CONTACT} from "./Mutations";
import {INSERT_DEPARTMENT} from "./Mutations";
import {GET_LANGUAGES_QUERY} from "../../../ApplyForm-Recruiter/Queries";


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
    }
});

class General extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            error: false,
            data: [],
            openModal: false,


            // Modal state
            Id: 0,
            idCompany: null,
            firstname: '',
            middlename: '',
            lastname: '',
            email: '',
            number: '',
            type: '',
            idSupervisor: null,
            IsActive: 1,
            User_Created: 1,
            User_Updated: 1,
            Date_Created: "'2018-08-14 16:10:25+00'",
            Date_Updated: "'2018-08-14 16:10:25+00'",
            hotelId: null,


            contactTypes: ContactTypesData,

            // Functional states
            titles: [{Id: 0, Name: 'Nothing', Description: 'Nothing'}],
            departments: [{Id: 0, Name: 'Nothing', Description: 'Nothing'}],
            hotels: [],
            supervisors: [],
            allSupervisors: [],
            inputEnabled: true,
            loadingData: false,
            loadingDepartments: false,
            loadingSupervisor: false,
            loadingAllSupervisors: false,
            loadingTitles: false,
            firstLoad: true,
            indexView: 0, //Loading
            errorMessage: '',
            activateTabs: true,


            // User dialog state
            contacts: [],
            regions: [],
            RegionName: '',
            loadingContacts: false,

            roles:[],
            loadingRoles: false,

            languages: [],
            loadingLanguages: false
        }
    }

    handleClickOpenModal = () => {
        this.setState({openModal: true});
    };

    handleCloseModal = () => {
        this.setState({openModal: false});
    };

    /**
     * To get the profile information for applicant
     * @param id
     */
    getProfileInformation = (id) => {
        this.props.client
            .query({
                query: GET_APPLICATION_PROFILE_INFO,
                variables: {
                    id: id
                }
            })
            .then(({data}) => {
                this.setState({
                    data: data.applications[0]
                }, () => {
                    this.fetchDepartments()
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: true
                })
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
                    this.setState({
                        loading: false
                    })
                });
            })
            .catch(error => {

            });
    };

    /**
     * To get a list od departments
     */
    fetchDepartments = () => {
        this.props.client
            .query({
                query: GET_DEPARTMENTS_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getcatalogitem != null) {
                    this.setState({
                        departments: data.data.getcatalogitem,
                    }, () => {
                        this.fetchTitles()
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
                    console.log("data.data.getcatalogitem ", data.data.getcatalogitem);
                    this.setState({
                            contacts: data.data.getsupervisor,
                            regions: data.data.getcatalogitem,
                            RegionName: data.data.getcatalogitem[0].Name,
                            loadingContacts: false
                    });
                }
            })
            .catch((error) => {

            });
    };

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
                    });
                }
            })
            .catch((error) => {

            });
    };

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
     * To fetch a list of titles
     */
    fetchTitles = () => {
        this.props.client
            .query({
                query: GET_TYPES_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getcatalogitem != null) {
                    this.setState({
                        titles: data.data.getcatalogitem,
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

    /**
     * To fetch supervisors
     */
    fetchSupervisors = () => {
        this.props.client
            .query({
                query: this.GET_SUPERVISORS_QUERY,
                variables: {Id_Entity: this.state.idCompany, Id: 0},
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getsupervisor != null) {
                    this.setState({
                        supervisors: data.data.getsupervisor,
                    }, () => {

                    });
                }
            })
            .catch((error) => {

            });
    };

    insertDepartment = () => {
        var IdDeparment = 0,
            IdTitle = 0;

        var department = this.state.departments.find((obj) => {
            return obj.Name.trim().toLowerCase() === this.state.departmentName.trim().toLowerCase();
        });

        var title = this.state.titles.find((obj) => {
            return obj.Name.trim().toLowerCase() === this.state.titleName.trim().toLowerCase();
        });

        let insdepartmentAsync = async () => {
            if (department) {
                IdDeparment = department.Id;
            } else {
                //const InsertDepartmentNew =
                await this.props.client
                    .mutate({
                        mutation: INSERT_DEPARTMENT,
                        variables: {
                            input: {
                                Id: 0,
                                Id_Catalog: 8,
                                Id_Parent: 0,
                                Name: `'${this.state.departmentName}'`,
                                DisplayLabel: `'${this.state.departmentName}'`,
                                Description: `'${this.state.departmentName}'`,
                                Value: null,
                                Value01: null,
                                Value02: null,
                                Value03: null,
                                Value04: null,
                                IsActive: 1,
                                User_Created: 1,
                                User_Updated: 1,
                                Date_Created: "'2018-09-20 08:10:25+00'",
                                Date_Updated: "'2018-09-20 08:10:25+00'"
                            }
                        }
                    })
                    .then((data) => {
                        IdDeparment = data.data.inscatalogitem.Id;
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar('error', 'Error: Inserting Department: ' + error);
                        this.setState({
                            saving: false
                        });
                        return false;
                    });
            }

            if (title) {
                IdTitle = title.Id;
            } else {
                //const InsertDepartmentNew =
                await this.props.client
                    .mutate({
                        mutation: INSERT_DEPARTMENT,
                        variables: {
                            input: {
                                Id: 0,
                                Id_Catalog: 6,
                                Id_Parent: 0,
                                Name: `'${this.state.titleName}'`,
                                DisplayLabel: `'${this.state.titleName}'`,
                                Description: `'${this.state.titleName}'`,
                                Value: null,
                                Value01: null,
                                Value02: null,
                                Value03: null,
                                Value04: null,
                                IsActive: 1,
                                User_Created: 1,
                                User_Updated: 1,
                                Date_Created: "'2018-09-20 08:10:25+00'",
                                Date_Updated: "'2018-09-20 08:10:25+00'"
                            }
                        }
                    })
                    .then((data) => {
                        IdTitle = data.data.inscatalogitem.Id;
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar('error', 'Error: Inserting Title: ' + error);
                        this.setState({
                            saving: false
                        });
                        return false;
                    });
            }

            this.insertContacts(IdDeparment, IdTitle);
        };

        insdepartmentAsync();
    };

    insertContacts = (idDepartment, idTitle) => {
        this.props.client
            .mutate({
                mutation: INSERT_CONTACT,
                variables: {
                    input: {
                        Id: null,
                        Id_Entity: this.state.hotelId,
                        First_Name: `'${this.state.firstname}'`,
                        Middle_Name: `'${this.state.middlename}'`,
                        Last_Name: `'${this.state.lastname}'`,
                        Electronic_Address: `'${this.state.email}'`,
                        Phone_Number: `'${this.state.number}'`,
                        //Contact_Title: this.state.title,
                        Contact_Title: idTitle,
                        Contact_Type: this.state.type,
                        Id_Deparment: idDepartment,
                        Id_Supervisor: this.state.idSupervisor,
                        IsActive: 1,
                        User_Created: 1,
                        User_Updated: 1,
                        Date_Created: "'2018-08-14 16:10:25+00'",
                        Date_Updated: "'2018-08-14 16:10:25+00'"
                    }
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Contact Inserted!');
                this.setState({
                    openModal: false
                });
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error: Inserting Contact: ' + error
                );
                this.setState({
                    saving: false
                });
                return false;
            });
    };

    componentWillMount() {
        this.setState({
            loading: true
        }, () => {
            this.getProfileInformation(this.props.applicationId);
        })
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
                console.log("Id de la fila ", id);
                this.validateField(name, id);
            }
        );
    };

    render() {
        const {classes} = this.props;
        const {fullScreen} = this.props;


        if (this.state.loading) {
            return <LinearProgress/>
        }


        if (this.state.error) {
            return <LinearProgress/>
        }

        /**
         * Function to render a dialog with user options
         **/
        let renderUserDialog = () => (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
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
                                            <option key={item.Id} value={item.Id}>
                                                {item.Name}
                                            </option>
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
                                    <label>* Rol</label>
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
                                </div>

                                <div className="col-md-9 col-lg-9">
                                    <label>{this.state.IsRecruiter ? '* ' : ''}Region</label>
                                    <AutosuggestInput
                                        id="IdRegion"
                                        name="IdRegion"
                                        data={this.state.regions}
                                        error={!this.state.IdRegionValid}
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
                                    </ul>
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
                                        className="btn btn-success"
                                        onClick={this.addUserHandler}
                                    >
                                        Save
                                        {/*{!isLoading && <i className="fas fa-save ml-1" />}*/}
                                        {/*{isLoading && <i className="fas fa-spinner fa-spin ml-1" />}*/}
                                    </button>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <div className={classes.root}>
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
        );

        let renderDialog = () => (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                aria-labelledby="responsive-dialog-title"
                maxWidth="lg"
            >
                <DialogTitle style={{padding: '0px'}}>
                    <div className="modal-header">
                        <h5 class="modal-title">
                            {' '}
                            {this.state.idToEdit != null &&
                            this.state.idToEdit != '' &&
                            this.state.idToEdit != 0 ? (
                                'Edit  Contact'
                            ) : (
                                'Create Contact'
                            )}
                        </h5>
                    </div>
                </DialogTitle>
                <DialogContent style={{minWidth: 600, padding: '0px'}}>
                    <form className="container">
                        <div className="">
                            <div className="row">
                                <div className="col-md-12 col-lg-4">
                                    <label>* Hotel</label>
                                    <SelectForm
                                        id="type"
                                        name="type"
                                        data={this.state.hotels}
                                        update={(value) => {
                                            this.setState({
                                                hotelId: value
                                            })
                                        }}
                                        showNone={false}
                                        //noneName="Employee"
                                        error={false}
                                        value={this.state.hotelId}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>* Contact Type</label>
                                    <SelectForm
                                        id="type"
                                        name="type"
                                        data={this.state.contactTypes}
                                        update={(value) => {
                                            this.setState({
                                                type: value
                                            })
                                        }}
                                        showNone={false}
                                        //noneName="Employee"
                                        error={false}
                                        value={this.state.type}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>* Department</label>
                                    <AutosuggestInput
                                        id="department"
                                        name="department"
                                        data={this.state.departments}
                                        error={false}
                                        value={this.state.departmentName}
                                        onChange={(value) => {
                                            this.setState({
                                                departmentName: value
                                            })
                                        }}
                                        onSelect={(value) => {
                                            this.setState({
                                                departmentName: value
                                            })
                                        }}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>* First Name</label>
                                    <InputForm
                                        id="firstname"
                                        name="firstname"
                                        required
                                        maxLength="15"
                                        value={this.state.firstname}
                                        error={false}
                                        change={(value) => {
                                            this.setState({firstname: value})
                                        }}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>Middle Name</label>
                                    <InputForm
                                        id="middlename"
                                        name="middlename"
                                        maxLength="15"
                                        error={false}
                                        value={this.state.middlename}
                                        change={(value) => {
                                            this.setState({middlename: value})
                                        }}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>* Last Name</label>
                                    <InputForm
                                        id="lastname"
                                        name="lastname"
                                        maxLength="20"
                                        error={false}
                                        value={this.state.lastname}
                                        change={(value) => {
                                            this.setState({lastname: value})
                                        }}
                                    />
                                </div>

                                <div className="col-md-12 col-lg-4">
                                    <label>* Email</label>
                                    <InputForm
                                        id="email"
                                        name="email"
                                        maxLength="50"
                                        error={false}
                                        value={this.state.email}
                                        change={(value) => {
                                            this.setState({email: value})
                                        }}
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>* Phone Number</label>
                                    <InputMask
                                        id="number"
                                        name="number"
                                        mask="+(999) 999-9999"
                                        maskChar=" "
                                        value={this.state.number}
                                        className={'form-control'}
                                        onChange={(e) => {
                                            this.setState({number: e.target.value})
                                        }}
                                        placeholder="+(999) 999-9999"
                                    />
                                </div>
                                <div className="col-md-12 col-lg-4">
                                    <label>* Contact Title</label>
                                    <AutosuggestInput
                                        id="title"
                                        name="title"
                                        data={this.state.titles}
                                        error={false}
                                        value={this.state.titleName}
                                        onChange={(value) => {
                                            this.setState({
                                                titleName: value
                                            })
                                        }}
                                        onSelect={(value) => {
                                            this.setState({
                                                titleName: value
                                            })
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
                <DialogActions style={{margin: '20px 20px'}}>
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
                                        // disabled={isLoading || !this.Login.AllowEdit || !this.Login.AllowInsert}
                                        variant="fab"
                                        className="btn btn-success"
                                        onClick={this.insertDepartment}
                                    >
                                        Save {!this.state.saving && <i class="fas fa-save"/>}
                                        {this.state.saving && <i class="fas fa-spinner fa-spin"/>}
                                    </button>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <Tooltip title={'Cancel Operation'}>
                                <div>
                                    <button
                                        //disabled={this.state.loading || !this.state.enableCancelButton}
                                        variant="fab"
                                        className="btn btn-danger"
                                        onClick={this.handleCloseModal}
                                    >
                                        Cancel <i class="fas fa-ban"/>
                                    </button>
                                </div>
                            </Tooltip>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
        );

        return (
            <div className="Apply-container--application">
                <div className="">
                    <div className="">
                        <div className="applicant-card">
                            <div className="row">
                                <div className="item col-sm-12 col-md-3">
                                    <div className="row">
                                        <span
                                            className="username col-sm-12">{this.state.data.firstName + ' ' + this.state.data.lastName}</span>
                                        <span
                                            className="username-number col-sm-12">Emp #: TM-0000{this.state.data.id}</span>
                                    </div>
                                </div>
                                <div className="item col-sm-12 col-md-2">
                                    <div className="row">
                                        <span
                                            className="col-sm-6 col-lg-12">Title: {this.state.data.position.Name.trim()}</span>
                                        <span className="col-sm-6 col-lg-12">Department: Banquet</span>
                                    </div>
                                </div>
                                <div className="item col-6 col-md-2">
                                    <div className="row">
                                        <span className="col-sm-12 font-weight-bold">Schedule Type</span>
                                        <span className="col-sm-12">Text</span>
                                    </div>
                                </div>
                                <div className="item col-sm-12  col-md-1">
                                    <div className="row">
                                        <span className="col-12 col-md-12 font-weight-bold">Active</span>
                                        <div className="col-12 col-md-12">
                                            <label className="switch">
                                                <input
                                                    id="vehicleReportRequired"
                                                    type="checkbox"
                                                    className="form-control"
                                                    min="0"
                                                    maxLength="50"
                                                    minLength="10"
                                                    form="background-check-form"
                                                    checked={this.state.data.isActive}
                                                />
                                                <p className="slider round"></p>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="item col-sm-12  col-md-2">
                                    <button className="btn btn-outline-info btn-large" onClick={() => {
                                        this.handleClickOpenModal();
                                    }}>Associate
                                    </button>
                                </div>
                                <div className="item col-6 col-md-2">
                                    {/*<div className="row">*/}
                                    {/*<span className="col-sm-12 font-weight-bold">Payroll Preference</span>*/}
                                    {/*<span className="col-sm-12">Text</span>*/}
                                    {/*</div>*/}
                                    <button className="btn btn-outline-success btn-large">Create Profile</button>
                                </div>
                            </div>
                        </div>
                        <br/>
                        <div className="applicant-card general-table-container">
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">First</th>
                                        <th scope="col">Last</th>
                                        <th scope="col">Handle</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr>
                                        <th scope="row">1</th>
                                        <td>Mark</td>
                                        <td>Otto</td>
                                        <td>@mdo</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">2</th>
                                        <td>Jacob</td>
                                        <td>Thornton</td>
                                        <td>@fat</td>
                                    </tr>
                                    <tr>
                                        <th scope="row">3</th>
                                        <td>Larry</td>
                                        <td>the Bird</td>
                                        <td>@twitter</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                            <br/>
                            <br/>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5>Titles</h5>
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">Banquet
                                            Server
                                        </div>
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">Banquet
                                            Server
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <h5>Location able to work</h5>
                                </div>
                                <div className="col-sm-12">
                                    <div className="row">
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">WJ
                                            Marriot
                                        </div>
                                        <div className="btn btn-success btn-margin col-sm-12 col-md-6 col-lg-3">Downtown
                                            Doubletree
                                        </div>
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
            </div>
        );
    }
}


General.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
};

export default withGlobalContent(withStyles(styles)(withApollo(withMobileDialog()(General))));
