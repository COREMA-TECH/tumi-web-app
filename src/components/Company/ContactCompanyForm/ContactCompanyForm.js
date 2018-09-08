import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ContactsTable from './ContactsTable';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import gql from 'graphql-tag';
import green from '@material-ui/core/colors/green';
import AlertDialogSlide from '../../Generic/AlertDialogSlide';
import { withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import InputForm from '../../ui-components/InputForm/InputForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import InputFile from '../../ui-components/InputFile/InputFile';
import days from '../../../data/days.json';
import SelectForm from '../../ui-components/SelectForm/SelectForm';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';

import './index.css';
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

class ContactcontactForm extends React.Component {
	GET_CONTACTS_QUERY = gql`
		query getcontacts($IdEntity: Int) {
			getcontacts(IsActive: 1, Id_Entity: $IdEntity) {
				id: Id
				idSearch: Id
				firstname: First_Name
				middlename: Middle_Name
				lastname: Last_Name
				email: Electronic_Address
				number: Phone_Number
				type: Contact_Type
				idSupervisor: Id_Supervisor
				idDepartment: Id_Deparment
			}
		}
	`;
	GET_TYPES_QUERY = gql`
		{
			getcatalogitem(IsActive: 1, Id_Catalog: 6) {
				Id
				Name
				IsActive
			}
		}
	`;
	GET_SUPERVISORS_QUERY = gql`
		query getsupervisor($Id: Int, $Id_Entity: Int) {
			getsupervisor(IsActive: 1, Id_Entity: $Id_Entity, Id: $Id) {
				Id: Id
				Name: Full_Name
			}
		}
	`;
	GET_DEPARTMENTS_QUERY = gql`
		{
			getcatalogitem(IsActive: 1, Id_Catalog: 8) {
				Id
				Name: DisplayLabel
				IsActive
			}
		}
	`;
	INSERT_CONTACTS_QUERY = gql`
		mutation inscontacts($input: iParamC!) {
			inscontacts(input: $input) {
				Id
			}
		}
	`;

	UPDATE_CONTACTS_QUERY = gql`
		mutation updcontacts($input: iParamC!) {
			updcontacts(input: $input) {
				Id
			}
		}
	`;

	DELETE_CONTACTS_QUERY = gql`
		mutation delcontacts($Id: Int!) {
			delcontacts(Id: $Id, IsActive: 0) {
				Id
			}
		}
	`;

	TITLE_ADD = 'Add Contact';
	TITLE_EDIT = 'Update Contact';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		firstname: '',
		middlename: '',
		lastname: '',
		email: '',
		number: '',
		type: '',
		idSupervisor: '',
		idDepartment: 0,

		firstnameValid: true,
		middlenameValid: true,
		lastnameValid: true,
		emailValid: true,
		numberValid: true,
		typeValid: true,
		idDepartmentValid: true,
		idSupervisorValid: true,

		firstnameHasValue: false,
		middlenameHasValue: false,
		lastnameHasValue: false,
		emailHasValue: false,
		numberHasValue: false,
		typeHasValue: false,
		idSupervisorHasValue: false,
		idDepartmentHasValue: false,

		formValid: true,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false,
		openSnackbar: true,
		loading: false,
		success: false,
		loadingConfirm: false,
		openModal: false
	};

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			idCompany: this.props.idCompany,
			types: [ { Id: 0, Name: 'Nothing', Description: 'Nothing' } ],
			departments: [ { Id: 0, Name: 'Nothing', Description: 'Nothing' } ],
			supervisors: [],
			allSupervisors: [],
			inputEnabled: true,
			loadingData: false,
			loadingDepartments: false,
			loadingSupervisor: false,
			loadingAllSupervisors: false,
			loadingTypes: false,

			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);
	}

	focusTextInput() {
		if (document.getElementById('firstname') != null) {
			document.getElementById('firstname').focus();
			document.getElementById('firstname').select();
		}
	}
	componentDidMount() {
		this.resetState();
	}

	GENERATE_ID = () => {
		return '_' + Math.random().toString(36).substr(2, 9);
	};
	resetState = () => {
		this.setState(
			{
				...this.DEFAULT_STATE
			},
			() => {
				this.loadSupervisors();
				this.loadAllSupervisors();
				this.focusTextInput();
			}
		);
	};
	handleClose = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ open: false });
	};
	onFirstNameChangeHandler(value) {
		this.setState({ firstname: value }, this.validateField('firstname', value));
	}
	onMiddleNameChangeHandler(value) {
		this.setState({ middlename: value }, this.validateField('middlename', value));
	}
	onLastNameChangeHandler(value) {
		this.setState({ lastname: value }, this.validateField('lastname', value));
	}
	onEmailChangeHandler(value) {
		this.setState({ email: value }, this.validateField('email', value));
	}
	onNumberChangeHandler(value) {
		this.setState({ number: value }, this.validateField('number', value));
	}
	onBlurHandler(e) {
		//const name = e.target.name;
		//const value = e.target.value;
		//this.setState({ [name]: value.trim() }, this.validateField(name, value));
	}
	onSelectChangeHandler(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value }, this.validateField(name, value));
	}
	enableCancelButton = () => {
		let emailHasValue = this.state.email != '';
		let firstnameHasValue = this.state.firstname != '';
		let middlenameHasValue = this.state.middlename != '';
		let lastnameHasValue = this.state.lastname != '';
		let numberHasValue = this.state.number != '';
		let typeHasValue = this.state.type !== null && this.state.type !== 0 && this.state.type !== '';
		let idDepartmentHasValue =
			this.state.idDepartment !== null && this.state.idDepartment !== 0 && !this.state.idDepartment !== '';
		let idSupervisorHasValue =
			this.state.idSupervisor !== null && this.state.idSupervisor !== -1 && this.state.idSupervisor !== '';
		return (
			emailHasValue ||
			firstnameHasValue ||
			middlenameHasValue ||
			lastnameHasValue ||
			numberHasValue ||
			typeHasValue ||
			idDepartmentHasValue ||
			idSupervisorHasValue
		);
	};
	validateAllFields(fun) {
		let emailValid = this.state.email.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
		let firstnameValid = this.state.firstname.trim().length >= 2;
		let middlenameValid = this.state.middlename.trim().length >= 2;
		let lastnameValid = this.state.lastname.trim().length >= 2;
		let numberValid = this.state.number.trim().length >= 2;
		let typeValid = this.state.type !== null && this.state.type !== 0 && this.state.type !== '';
		let idDepartmentValid =
			this.state.idDepartment !== null && this.state.idDepartment !== 0 && this.state.idDepartment !== '';
		let idSupervisorValid =
			this.state.idSupervisor !== null && this.state.idSupervisor !== -1 && this.state.idSupervisor !== '';
		this.setState(
			{
				emailValid,
				firstnameValid,
				middlenameValid,
				lastnameValid,
				numberValid,
				typeValid,
				idDepartmentValid,
				idSupervisorValid
			},
			() => {
				this.validateForm(fun);
			}
		);
	}
	validateField(fieldName, value) {
		let emailValid = this.state.emailValid;
		let firstnameValid = this.state.firstnameValid;
		let middlenameValid = this.state.middlenameValid;
		let lastnameValid = this.state.lastnameValid;
		let numberValid = this.state.numberValid;
		let typeValid = this.state.typeValid;
		let idDepartmentValid = this.state.idDepartmentValid;
		let idSupervisorValid = this.state.idSupervisorValid;

		let emailHasValue = this.state.emailHasValue;
		let firstnameHasValue = this.state.firstnameHasValue;
		let middlenameHasValue = this.state.middlenameHasValue;
		let lastnameHasValue = this.state.lastnameHasValue;
		let numberHasValue = this.state.numberHasValue;
		let typeHasValue = this.state.typeHasValue;
		let idDepartmentHasValue = this.state.idDepartmentHasValue;
		let idSupervisorHasValue = this.state.idSupervisorHasValue;

		switch (fieldName) {
			case 'email':
				emailValid = value.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				emailHasValue = value != '';
				break;
			case 'firstname':
				firstnameValid = value.trim().length >= 2;
				firstnameHasValue = value != '';
				break;
			case 'middlename':
				middlenameValid = value.trim().length >= 2;
				middlenameHasValue = value != '';
				break;
			case 'lastname':
				lastnameValid = value.trim().length >= 2;
				lastnameHasValue = value != '';
				break;
			case 'number':
				numberValid = value.trim().length >= 2;
				numberHasValue = value != '';
				break;
			case 'type':
				typeValid = value !== null && value !== 0 && value !== '';
				typeHasValue = value !== null && value !== 0 && value !== '';
				break;
			case 'idDepartment':
				idDepartmentValid = value !== null && value !== 0 && value !== '';
				idDepartmentHasValue = value !== null && value !== 0 && value !== '';
				break;
			case 'idSupervisor':
				idSupervisorValid = value !== null && value !== -1 && value !== '';
				idSupervisorHasValue = value !== null && value !== -1 && value !== '';
				break;
			default:
				break;
		}
		this.setState(
			{
				emailValid,
				firstnameValid,
				middlenameValid,
				lastnameValid,
				numberValid,
				typeValid,
				idDepartmentValid,
				idSupervisorValid,
				emailHasValue,
				firstnameHasValue,
				middlenameHasValue,
				lastnameHasValue,
				numberHasValue,
				typeHasValue,
				idDepartmentHasValue,
				idSupervisorHasValue
			},
			this.validateForm
		);
	}

	validateForm(func = () => {}) {
		this.setState(
			{
				formValid:
					this.state.emailValid &&
					this.state.firstnameValid &&
					this.state.middlenameValid &&
					this.state.lastnameValid &&
					this.state.numberValid &&
					this.state.typeValid &&
					this.state.idDepartmentValid &&
					this.state.idSupervisorValid,
				enableCancelButton:
					this.state.emailHasValue ||
					this.state.firstnameHasValue ||
					this.state.middlenameHasValue ||
					this.state.lastnameHasValue ||
					this.state.numberHasValue ||
					this.state.typeHasValue ||
					this.state.idDepartmentHasValue ||
					this.state.idSupervisorHasValue
			},
			func
		);
	}

	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteContacts();
	};
	onEditHandler = ({
		idSearch,
		idSupervisor,
		idDepartment,
		firstname,
		middlename,
		lastname,
		email,
		number,
		type
	}) => {
		this.setState(
			{
				idToEdit: idSearch,
				firstname: firstname.trim(),
				middlename: middlename.trim(),
				lastname: lastname.trim(),
				email: email.trim(),
				number: number.trim(),
				idSupervisor: idSupervisor,
				idDepartment: idDepartment,
				type: type,
				formValid: true,
				emailValid: true,
				firstnameValid: true,
				middlenameValid: true,
				lastnameValid: true,
				typeValid: true,
				idDepartmentValid: true,
				idSupervisorValid: true,
				enableCancelButton: true,
				emailHasValue: true,
				firstnameHasValue: true,
				middlenameHasValue: true,
				lastnameHasValue: true,
				typeHasValue: true,
				idDepartmentHasValue: true,
				idSupervisorHasValue: true,

				numberValid: true,
				buttonTitle: this.TITLE_EDIT,
				openModal: true
			},
			() => {
				this.loadSupervisors(idSearch);
				this.focusTextInput();
			}
		);
	};

	onDeleteHandler = (idSearch) => {
		this.setState({ idToDelete: idSearch, opendialog: true });
	};
	componentWillMount() {
		if (window.location.pathname === '/company/edit') {
			this.setState(
				{
					//inputEnabled: false
				}
			);
		}
		this.loadContacts();
		this.loadTypes();
		this.loadDepartments();
		this.loadSupervisors();
		this.loadAllSupervisors();
	}
	getObjectToInsertAndUpdate = () => {
		let id = 0;
		let query = this.INSERT_CONTACTS_QUERY;
		const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

		if (isEdition) {
			query = this.UPDATE_CONTACTS_QUERY;
		}

		return { isEdition: isEdition, query: query, id: this.state.idToEdit };
	};
	loadContacts = () => {
		this.setState({ loadingData: true }, () => {
			this.props.client
				.query({
					query: this.GET_CONTACTS_QUERY,
					variables: { IdEntity: this.state.idCompany },
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getcontacts != null) {
						this.setState(
							{
								data: data.data.getcontacts,
								loadingData: false
							},
							() => {
								this.resetState();
							}
						);
					} else {
						this.props.handleOpenSnackbar(
							'error',
							'Error: Loading contacts: getcontacts not exists in query data'
						);
						this.setState({ loadingData: false });
					}
				})
				.catch((error) => {
					console.log('Error: Loading contacts: ', error);
					this.props.handleOpenSnackbar('error', 'Error: Loading contacts: ' + error);
					this.setState({ loadingData: false });
				});
		});
	};
	loadSupervisors = (idContact = 0) => {
		this.setState({ loadingSupervisor: true }, () => {
			this.props.client
				.query({
					query: this.GET_SUPERVISORS_QUERY,
					variables: { Id_Entity: this.state.idCompany, Id: idContact },
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getsupervisor != null) {
						this.setState({
							supervisors: data.data.getsupervisor,
							loadingSupervisor: false
						});
					} else {
						this.props.handleOpenSnackbar(
							'error',
							'Error: Loading supervisors: getsupervisor not exists in query data'
						);
						this.setState({ loadingSupervisor: false });
					}
				})
				.catch((error) => {
					console.log('Error: Loading supervisors: ', error);
					this.props.handleOpenSnackbar('error', 'Error: Loading supervisors: ' + error);
					this.setState({ loadingSupervisor: false });
				});
		});
	};

	loadAllSupervisors = () => {
		this.setState({ loadingAllSupervisors: true }, () => {
			this.props.client
				.query({
					query: this.GET_SUPERVISORS_QUERY,
					variables: { Id_Entity: this.state.idCompany, Id: 0 },
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getsupervisor != null) {
						this.setState({
							allSupervisors: data.data.getsupervisor,
							loadingAllSupervisors: false
						});
					} else {
						this.props.handleOpenSnackbar(
							'error',
							'Error: Loading [all] supervisors: getsupervisor not exists in query data'
						);
						this.setState({ loadingAllSupervisors: false });
					}
				})
				.catch((error) => {
					console.log('Error: Loading [all] supervisors: ', error);
					this.props.handleOpenSnackbar('error', 'Error: Loading [all] supervisors: ' + error);
					this.setState({ loadingAllSupervisors: false });
				});
		});
	};

	loadTypes = () => {
		this.setState({ loadingTypes: true }, () => {
			this.props.client
				.query({
					query: this.GET_TYPES_QUERY
				})
				.then((data) => {
					if (data.data.getcatalogitem != null) {
						this.setState({
							types: data.data.getcatalogitem,
							loadingTypes: false
						});
					} else {
						this.props.handleOpenSnackbar(
							'error',
							'Error: Loading types: getcatalogitem not exists in query data'
						);
						this.setState({ loadingTypes: false });
					}
				})
				.catch((error) => {
					console.log('Error: Loading types: ', error);
					this.props.handleOpenSnackbar('error', 'Error: Loading types: ' + error);
					this.setState({ loadingTypes: false });
				});
		});
	};
	loadDepartments = () => {
		this.setState({ loadingDepartments: true }, () => {
			this.props.client
				.query({
					query: this.GET_DEPARTMENTS_QUERY
				})
				.then((data) => {
					if (data.data.getcatalogitem != null) {
						this.setState({
							departments: data.data.getcatalogitem,
							loadingDepartments: false
						});
					} else {
						this.props.handleOpenSnackbar(
							'error',
							'Error: Loading departments: getcatalogitem not exists in query data'
						);
						this.setState({ loadingDepartments: false });
					}
				})
				.catch((error) => {
					console.log('Error: Loading departments: ', error);
					this.props.handleOpenSnackbar('error', 'Error: Loading departments: ' + error);
					this.setState({ loadingDepartments: false });
				});
		});
	};

	insertContacts = () => {
		const { isEdition, query, id } = this.getObjectToInsertAndUpdate();

		this.setState(
			{
				success: false,
				loading: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: query,
						variables: {
							input: {
								Id: id,
								Id_Entity: this.props.idCompany,
								First_Name: `'${this.state.firstname}'`,
								Middle_Name: `'${this.state.middlename}'`,
								Last_Name: `'${this.state.lastname}'`,
								Electronic_Address: `'${this.state.email}'`,
								Phone_Number: `'${this.state.number}'`,
								Contact_Type: this.state.type,
								Id_Deparment: this.state.idDepartment,
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
						this.props.handleOpenSnackbar('success', isEdition ? 'Contact Updated!' : 'Contact Inserted!');
						this.loadContacts();
						this.loadAllSupervisors();
						this.loadSupervisors();
						this.resetState();
					})
					.catch((error) => {
						console.log(isEdition ? 'Error: Updating Contact: ' : 'Error: Inserting Contact: ', error);
						this.props.handleOpenSnackbar(
							'error',
							isEdition ? 'Error: Updating Contact: ' + error : 'Error: Inserting Contact: ' + error
						);
						this.setState({
							success: false,
							loading: false
						});
					});
			}
		);
	};
	deleteContacts = (id) => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.DELETE_CONTACTS_QUERY,
						variables: {
							Id: this.state.idToDelete
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Contact Deleted!');
						this.loadContacts();
						this.loadAllSupervisors();
						this.loadSupervisors();
						this.resetState();
					})
					.catch((error) => {
						console.log('Error: Deleting Contact: ', error);
						this.props.handleOpenSnackbar('error', 'Error: Deleting Contact: ' + error);
						this.setState({
							loadingConfirm: false
						});
					});
			}
		);
	};

	addContactHandler = () => {
		this.setState(
			{
				success: false,
				loading: true
			},
			() => {
				this.validateAllFields(() => {
					if (this.state.formValid) this.insertContacts();
					else {
						this.props.handleOpenSnackbar(
							'error',
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

	cancelContactHandler = () => {
		this.resetState();
	};
	handleClickOpenModal = () => {
		this.setState({ openModal: true });
	};
	handleCloseModal = () => {
		this.setState({ openModal: false });
	};
	updateSupervisor = (id) => {
		this.setState(
			{
				idSupervisor: id
			},
			() => {
				this.validateField('idSupervisor', id);
			}
		);
	};
	updateDepartment = (id) => {
		this.setState(
			{
				idDepartment: id
			},
			() => {
				this.validateField('idDepartment', id);
			}
		);
	};
	updateType = (id) => {
		this.setState(
			{
				type: id
			},
			() => {
				this.validateField('type', id);
			}
		);
	};
	render() {
		const { loading, success } = this.state;
		const { classes } = this.props;
		const { fullScreen } = this.props;
		const buttonClassname = classNames({
			[classes.buttonSuccess]: success
		});

		return (
			<div className="contact-tab">
				{(this.state.loadingData ||
					this.state.loadingDepartments ||
					this.state.loadingSupervisor ||
					this.state.loadingAllSupervisors ||
					this.state.loadingTypes) && <LinearProgress />}

				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingConfirm}
					content="Do you really want to continue whit this operation?"
				/>
				<div className="contact__header">
					<button className="add-contact" onClick={this.handleClickOpenModal}>
						{' '}
						Add Contact{' '}
					</button>
				</div>
				<Dialog
					fullScreen={fullScreen}
					open={this.state.openModal}
					onClose={this.cancelContactHandler}
					aria-labelledby="responsive-dialog-title"
				>
					<DialogTitle style={{ padding: '0px' }}>
						<div className="card-form-header orange">
							{' '}
							{this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0 ? (
								'Edit  Contact'
							) : (
								'Create Contact'
							)}
						</div>
					</DialogTitle>
					<DialogContent style={{ minWidth: 600, padding: '0px' }}>
						<div className="">
							<div className="card-form-body">
								<div className="card-form-row">
									<span className="input-label primary">First Name</span>
									<InputForm
										id="firstname"
										name="firstname"
										maxLength="15"
										value={this.state.firstname}
										error={!this.state.firstnameValid}
										change={(value) => this.onFirstNameChangeHandler(value)}
									/>
								</div>
								<div className="card-form-row">
									<span className="input-label primary">Middle Name</span>
									<InputForm
										id="middlename"
										name="middlename"
										maxLength="15"
										error={!this.state.middlenameValid}
										value={this.state.middlename}
										change={(value) => this.onMiddleNameChangeHandler(value)}
									/>
								</div>

								<div className="card-form-row">
									<span className="input-label primary">Last Name</span>
									<InputForm
										id="lastname"
										name="lastname"
										maxLength="20"
										error={!this.state.lastnameValid}
										value={this.state.lastname}
										change={(value) => this.onLastNameChangeHandler(value)}
									/>
								</div>
								<div className="card-form-row">
									<span className="input-label primary">Department</span>
									<SelectForm
										name="department"
										data={this.state.departments}
										error={!this.state.idDepartmentValid}
										update={this.updateDepartment}
										showNone={false}
										value={this.state.idDepartment}
									/>
								</div>

								<div className="card-form-row">
									<span className="input-label primary">Supervisor</span>
									<SelectForm
										name="supervisor"
										data={this.state.supervisors}
										update={this.updateSupervisor}
										value={this.state.idSupervisor}
										error={!this.state.idSupervisorValid}
									/>
								</div>
								<div className="card-form-row">
									<span className="input-label primary">Email</span>
									<InputForm
										id="email"
										name="email"
										maxLength="30"
										error={!this.state.emailValid}
										value={this.state.email}
										change={(value) => this.onEmailChangeHandler(value)}
									/>
								</div>
								<div className="card-form-row">
									<span className="input-label primary">Phone Number</span>
									<InputForm
										id="number"
										name="number"
										maxLength="15"
										error={!this.state.numberValid}
										value={this.state.number}
										change={(value) => this.onNumberChangeHandler(value)}
									/>
								</div>
								<div className="card-form-row">
									<span className="input-label primary">Title</span>
									<SelectForm
										name="title"
										data={this.state.types}
										update={this.updateType}
										showNone={false}
										value={this.state.type}
										error={!this.state.typeValid}
									/>
								</div>
							</div>
						</div>
					</DialogContent>
					<DialogActions style={{ margin: '20px 20px' }}>
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
										<Button
											disabled={this.state.loading}
											//	disabled={!this.state.formValid}
											variant="fab"
											color="primary"
											className={buttonClassname}
											onClick={this.addContactHandler}
										>
											{success ? <CheckIcon /> : <SaveIcon />}
										</Button>
									</div>
								</Tooltip>
								{loading && <CircularProgress size={68} className={classes.fabProgress} />}
							</div>
						</div>
						<div className={classes.root}>
							<div className={classes.wrapper}>
								<Tooltip title={'Cancel Operation'}>
									<div>
										<Button
											//disabled={this.state.loading || !this.state.enableCancelButton}
											variant="fab"
											color="secondary"
											className={buttonClassname}
											onClick={this.cancelContactHandler}
										>
											<ClearIcon />
										</Button>
									</div>
								</Tooltip>
							</div>
						</div>
					</DialogActions>
				</Dialog>
				<div className={classes.container}>
					<div className={classes.divStyle}>
						<ContactsTable
							data={this.state.data}
							types={this.state.types}
							loading={this.state.loading}
							supervisors={this.state.allSupervisors}
							departments={this.state.departments}
							onEditHandler={this.onEditHandler}
							onDeleteHandler={this.onDeleteHandler}
						/>
					</div>
				</div>
				{this.props.showStepper ? (
					<div className="advanced-tab-options">
						<span
							className="options-button options-button--back"
							onClick={() => {
								this.props.back();
							}}
						>
							Back
						</span>
						<span
							className="options-button options-button--next"
							onClick={() => {
								// When the user click Next button, open second tab
								this.props.next();
							}}
						>
							{this.props.valueTab < 2 ? 'Next' : 'Finish'}
						</span>
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}

ContactcontactForm.propTypes = {
	classes: PropTypes.object.isRequired,
	fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles)(withApollo(withMobileDialog()(ContactcontactForm)));
