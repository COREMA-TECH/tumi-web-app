import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import UsersTable from './UsersTable';
import gql from 'graphql-tag';
import green from '@material-ui/core/colors/green';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import { withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import SelectForm from 'ui-components/SelectForm/SelectForm';
import InputForm from 'ui-components/InputForm/InputForm';
import InputMask from 'react-input-mask';
import 'ui-components/InputForm/index.css';

import './index.css';

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
			getsupervisor(IsActive: 1, Id_Entity: 0, Id: 0) {
				Id
				Name: Full_Name
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

	UPDATE_USER_QUERY = gql`
		mutation updusers($input: iUsers!) {
			updusers(input: $input) {
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

		idContact: '',
		username: '',
		//fullname: '',
		password: 'ADMIN',
		email: '',
		number: '',
		idRol: '',
		idLanguage: '',
		isAdmin: false,
		allowInsert: false,
		allowEdit: false,
		allowDelete: false,
		allowExport: false,

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
		success: false,
		loadingConfirm: false,
		openModal: false
	};

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			contacts: [],
			roles: [ { Id: 0, Name: 'Nothing' } ],
			languages: [ { Id: 0, Name: 'Nothing' } ],

			loadingData: true,
			loadingContacts: true,
			loadingRoles: true,
			loadingLanguages: true,

			idCompany: this.props.idCompany,

			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);
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
	resetState = () => {
		this.setState(
			{
				...this.DEFAULT_STATE
			},
			() => {
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
		let idContactValid =
			this.state.idContact !== null && this.state.idContact !== -1 && this.state.idContact !== '';
		let usernameValid = this.state.username.trim().length >= 5 && this.state.username.trim().indexOf(' ') < 0;
		//let fullnameValid = this.state.fullname.trim().length >= 10;
		let emailValid = this.state.email.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
		let numberValid =
			this.state.number.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '')
				.length == 10;
		let passwordValid = this.state.password.trim().length >= 2;
		let idRolValid = this.state.idRol !== null && this.state.idRol !== 0 && this.state.idRol !== '';
		let idLanguageValid =
			this.state.idLanguage !== null && this.state.idLanguage !== 0 && this.state.idLanguage !== '';
		this.setState(
			{
				idContactValid,
				usernameValid,
				//fullnameValid,
				emailValid,
				numberValid,
				passwordValid,
				idRolValid,
				idLanguageValid
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

		switch (fieldName) {
			case 'idContact':
				idContactValid = value !== null && value !== -1 && value !== '';
				idContactHasValue = value !== null && value !== -1 && value !== '';
				break;
			case 'username':
				usernameValid = this.state.username.trim().length >= 5 && this.state.username.trim().indexOf(' ') < 0;
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
				idLanguageHasValue
			},
			this.validateForm
		);
	}

	validateForm(func = () => {}) {
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
					this.state.idLanguageValid,
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
		AllowEdit
	}) => {
		this.setState(
			{
				idToEdit: Id,
				idContact: Id_Contact,
				idRol: Id_Roles,
				username: Code_User.trim(),
				//fullname: Full_Name.trim(),
				email: Electronic_Address.trim(),
				number: Phone_Number.trim(),
				password: Password.trim(),
				idLanguage: Id_Language,
				isAdmin: IsAdmin == 1,
				allowDelete: AllowDelete == 1,
				allowInsert: AllowInsert == 1,
				allowExport: AllowExport == 1,
				allowEdit: AllowEdit == 1,

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
			() => {
				this.focusTextInput();
			}
		);
	};

	onDeleteHandler = (idSearch) => {
		this.setState({ idToDelete: idSearch, opendialog: true });
	};
	componentWillMount() {
		this.loadUsers();
		this.loadContacts();
		this.loadRoles();
		this.loadLanguages();
	}

	loadUsers = () => {
		this.setState({ loadingData: true });
		this.props.client
			.query({
				query: this.GET_USERS_QUERY,
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getusers != null) {
					this.setState(
						{
							data: data.data.getusers
						},
						() => {
							this.setState({ loadingData: false }, this.resetState);
						}
					);
				} else {
					this.props.handleOpenSnackbar('error', 'Error: Loading users: getusers not exists in query data');
					this.setState({ loadingData: false });
				}
			})
			.catch((error) => {
				console.log('Error: Loading users: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading users: ' + error);
				this.setState({ loadingData: false });
			});
	};

	loadContacts = () => {
		this.setState({ loadingContacts: true });
		this.props.client
			.query({
				query: this.GET_CONTACTS_QUERY,
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getsupervisor != null) {
					this.setState(
						{
							contacts: data.data.getsupervisor
						},
						() => {
							this.setState({ loadingContacts: false }, this.resetState);
						}
					);
				} else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading contacts: getsupervisor not exists in query data'
					);
					this.setState({ loadingContacts: false });
				}
			})
			.catch((error) => {
				console.log('Error: Loading contacts: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading contacts: ' + error);
				this.setState({ loadingContacts: false });
			});
	};
	loadRoles = () => {
		this.setState({ loadingRoles: true });
		this.props.client
			.query({
				query: this.GET_ROLES_QUERY,
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getroles != null) {
					this.setState(
						{
							roles: data.data.getroles
						},
						() => {
							this.setState({ loadingRoles: false }, this.resetState);
						}
					);
				} else {
					this.props.handleOpenSnackbar('error', 'Error: Loading roles: getroles not exists in query data');
					this.setState({ loadingRoles: false });
				}
			})
			.catch((error) => {
				console.log('Error: Loading roles: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading roles: ' + error);
				this.setState({ loadingRoles: false });
			});
	};

	loadLanguages = () => {
		this.setState({ loadingLanguages: true });
		this.props.client
			.query({
				query: this.GET_LANGUAGES_QUERY,
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcatalogitem != null) {
					this.setState(
						{
							languages: data.data.getcatalogitem
						},
						() => {
							this.setState({ loadingLanguages: false }, this.resetState);
						}
					);
				} else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading languages: getcatalogitem not exists in query data'
					);
					this.setState({ loadingLanguages: false });
				}
			})
			.catch((error) => {
				console.log('Error: Loading languages: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading languages: ' + error);
				this.setState({ loadingLanguages: false });
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
								Id_Entity: 1,
								Id_Contact: this.state.idContact,
								Id_Roles: this.state.idRol,
								Code_User: `'${this.state.username}'`,
								Full_Name: `'${this.state.fullname}'`,
								Electronic_Address: `'${this.state.email}'`,
								Phone_Number: `'${this.state.number}'`,
								Password: `'${this.state.password}','AES_KEY'`,
								Id_Language: this.state.idLanguage,
								IsAdmin: this.state.isAdmin,
								AllowDelete: this.state.allowDelete,
								AllowInsert: this.state.allowInsert,
								AllowEdit: this.state.allowEdit,
								AllowExport: this.state.allowExport,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-08-14 16:10:25+00'",
								Date_Updated: "'2018-08-14 16:10:25+00'"
							}
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', isEdition ? 'User Updated!' : 'User Inserted!');
						this.loadUsers();
						this.resetState();
					})
					.catch((error) => {
						console.log(isEdition ? 'Error: Updating User: ' : 'Error: Inserting User: ', error);
						this.props.handleOpenSnackbar(
							'error',
							isEdition ? 'Error: Updating User: ' + error : 'Error: Inserting User: ' + error
						);
						this.setState({
							success: false,
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
						this.loadUsers();
						this.resetState();
					})
					.catch((error) => {
						console.log('Error: Deleting User: ', error);
						this.props.handleOpenSnackbar('error', 'Error: Deleting User: ' + error);
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
				success: false,
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

	handleCheckedChange = (name) => (event) => {
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
		const buttonClassname = classNames({
			[classes.buttonSuccess]: success
		});

		return (
			<div className="users_tab">
				{(this.state.loadingData ||
					this.state.loadingContacts ||
					this.state.loadingRoles ||
					this.state.loadingLanguages) && <LinearProgress />}

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
				>
					<DialogTitle id="responsive-dialog-title">
						<div className="card-form-header orange">
							{this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0 ? (
								'Edit  User'
							) : (
								'Create User'
							)}
						</div>
					</DialogTitle>
					<DialogContent style={{ width: 600 }}>
						<div className="card-form-body">
							<div className="card-form-row">
								<span className="input-label primary">Contact</span>
								<SelectForm
									id="idContact"
									name="idContact"
									data={this.state.contacts}
									update={(id) => {
										this.updateSelect(id, 'idContact');
									}}
									showNone={true}
									error={!this.state.idContactValid}
									value={this.state.idContact}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">User</span>
								<InputForm
									id="username"
									name="username"
									maxLength="10"
									value={this.state.username}
									error={!this.state.usernameValid}
									change={(value) => this.onChangeHandler(value, 'username')}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Email</span>
								<InputForm
									id="email"
									name="email"
									maxLength="50"
									value={this.state.email}
									error={!this.state.emailValid}
									change={(value) => this.onChangeHandler(value, 'email')}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Phone Number</span>
								<InputMask
									id="number"
									name="number"
									mask="+(999) 999-9999"
									maskChar=" "
									value={this.state.number}
									className={this.state.numberValid ? 'input-form' : 'input-form _invalid'}
									onChange={(e) => {
										this.onChangeHandler(e.target.value, 'number');
									}}
									placeholder="+(999) 999-9999"
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Rol</span>
								<SelectForm
									id="idRol"
									name="idRol"
									data={this.state.roles}
									update={(id) => {
										this.updateSelect(id, 'idRol');
									}}
									showNone={false}
									error={!this.state.idRolValid}
									value={this.state.idRol}
									disabled={this.state.loadingRoles}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Language</span>
								<SelectForm
									id="idRol"
									name="idRol"
									data={this.state.languages}
									update={(id) => {
										this.updateSelect(id, 'idLanguage');
									}}
									showNone={false}
									error={!this.state.idLanguageValid}
									value={this.state.idLanguage}
									disabled={this.state.loadingLanguages}
								/>
							</div>
						</div>
						<div className={classes.divStyleColumns}>
							<div className={classes.divStyle}>
								<FormControlLabel
									control={
										<Switch
											id="isAdmin"
											checked={this.state.isAdmin}
											onChange={this.handleCheckedChange('isAdmin')}
											value="isAdmin"
										/>
									}
									label="Is Admin"
								/>
								<FormControlLabel
									control={
										<Switch
											id="allowInsert"
											checked={this.state.allowInsert}
											onChange={this.handleCheckedChange('allowInsert')}
											value="allowInsert"
										/>
									}
									label="Allow Create"
								/>
								<FormControlLabel
									control={
										<Switch
											id="allowEdit"
											checked={this.state.allowEdit}
											onChange={this.handleCheckedChange('allowEdit')}
											value="allowEdit"
										/>
									}
									label="Allow Edit"
								/>
								<FormControlLabel
									control={
										<Switch
											id="allowDelete"
											checked={this.state.allowDelete}
											onChange={this.handleCheckedChange('allowDelete')}
											value="allowDelete"
										/>
									}
									label="Allow Delete"
								/>
							</div>
							<FormControlLabel
								style={{ width: 'fit-content' }}
								control={
									<Switch
										id="allowExport"
										checked={this.state.allowExport}
										onChange={this.handleCheckedChange('allowExport')}
										value="allowExport"
									/>
								}
								label="Allow Export"
							/>
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
										<Button
											disabled={this.state.loading}
											//	disabled={!this.state.formValid}
											variant="fab"
											color="primary"
											className={buttonClassname}
											onClick={this.addUserHandler}
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
											onClick={this.cancelUserHandler}
										>
											<ClearIcon />
										</Button>
									</div>
								</Tooltip>
							</div>
						</div>
					</DialogActions>
				</Dialog>

				<div className="users__header">
					<button
						className="add-users"
						onClick={this.handleClickOpenModal}
						disabled={
							this.state.loadingData ||
							this.state.loadingContacts ||
							this.state.loadingRoles ||
							this.state.loadingLanguages
						}
					>
						{' '}
						Add User{' '}
					</button>
				</div>
				<div className={classes.container}>
					<div className={classes.divStyle}>
						<UsersTable
							data={this.state.data}
							contacts={this.state.contacts}
							roles={this.state.roles}
							languages={this.state.languages}
							loading={this.state.loading}
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
