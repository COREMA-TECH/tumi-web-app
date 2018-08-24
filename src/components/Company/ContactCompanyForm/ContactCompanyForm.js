import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import ContactsTable from '../ContactsTable/ContactsTable';
import FormErrors from './FormErrors';
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
const styles = (theme) => ({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginBottom: '30px'
	},
	root: {
		display: 'flex',
		alignItems: 'center'
	},
	formControl: {
		margin: theme.spacing.unit,
		width: '18%'
	},
	numberControl: {
		//width: '10%'
	},
	firstnameControl: {
		//width: '12%'
	},
	emailControl: {
		//width: '12%'
	},
	typeControl: {
		//width: '12%'
	},
	resize: {
		//fontSize: 14
	},
	divStyle: {
		width: '80%',
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

class ContactCompanyForm extends React.Component {
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
				id: Id
				firstname: Full_Name
			}
		}
	`;
	GET_DEPARTMENTS_QUERY = gql`
		{
			getcatalogitem(IsActive: 1, Id_Catalog: 8) {
				Id
				Name
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
		firstnameValid: false,
		middlenameValid: false,
		lastnameValid: false,
		emailValid: false,
		numberValid: false,
		typeValid: false,
		idDepartmentValid: false,
		idSupervisorValid: false,
		firstnameHasValue: false,
		middlenameHasValue: false,
		lastnameHasValue: false,
		emailHasValue: false,
		numberHasValue: false,
		typeHasValue: false,
		idSupervisorHasValue: false,
		idDepartmentHasValue: false,
		formValid: false,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false,
		openSnackbar: true,
		loading: false,
		success: false
	};

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			idCompany: this.props.idCompany,
			types: [ { Id: 0, Name: 'Nothing', Description: 'Nothing' } ],
			departments: [ { Id: 0, Name: 'Nothing', Description: 'Nothing' } ],
			supervisors: [],
			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);
	}
	focusTextInput() {
		document.getElementById('firstname').focus();
		document.getElementById('firstname').select();
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
	onChangeHandler(e) {
		const name = e.target.name;
		const value = e.target.value;
		//this.setState({ [name]: value });
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
		this.setState({ [name]: value }, this.validateField(name, value));
	}
	enableCancelButton = () => {
		let emailHasValue = this.state.email.trim() == '';
		let firstnameHasValue = this.state.firstname.trim() == '';
		let middlenameHasValue = this.state.middlename.trim() == '';
		let lastnameHasValue = this.state.lastname.trim() == '';
		let numberHasValue = this.state.number.trim() == '';
		let typeHasValue = this.state.type !== null && this.state.type !== 0 && this.state.type !== '';
		let idDepartmentHasValue =
			this.state.idDepartment !== null && this.state.idDepartment !== 0 && !this.state.idDepartment !== '';
		let idSupervisorHasValue =
			this.state.idSupervisor !== null && this.state.idSupervisor !== -1 && this.state.idSupervisor !== '';
		return (
			emailHasValue &&
			firstnameHasValue &&
			middlenameHasValue &&
			lastnameHasValue &&
			numberHasValue &&
			typeHasValue &&
			idDepartmentHasValue &&
			idSupervisorHasValue
		);
	};
	validateAllFields() {
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
			this.validateForm
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
				emailHasValue = value.trim() != '';
				break;
			case 'firstname':
				firstnameValid = value.trim().length >= 2;
				firstnameHasValue = value.trim() != '';
				break;
			case 'middlename':
				middlenameValid = value.trim().length >= 2;
				middlenameHasValue = value.trim() != '';
				break;
			case 'lastname':
				lastnameValid = value.trim().length >= 2;
				lastnameHasValue = value.trim() != '';
				break;
			case 'number':
				numberValid = value.trim().length >= 2;
				numberHasValue = value.trim() != '';
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

	validateForm() {
		this.setState({
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
		});
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
		console.log('editando: ');
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
				buttonTitle: this.TITLE_EDIT
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
		this.loadContacts();
		this.loadTypes();
		this.loadDepartments();
		this.loadSupervisors();
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
							data: data.data.getcontacts
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
				}
			})
			.catch((error) => {
				console.log('Error: Loading contacts: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading contacts: ' + error);
			});
	};
	loadSupervisors = (idContact = 0) => {
		this.props.client
			.query({
				query: this.GET_SUPERVISORS_QUERY,
				variables: { Id_Entity: this.state.idCompany, Id: idContact },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getsupervisor != null) {
					this.setState({
						supervisors: data.data.getsupervisor
					});
				} else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading supervisors: getsupervisor not exists in query data'
					);
				}
			})
			.catch((error) => {
				console.log('Error: Loading supervisors: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading supervisors: ' + error);
			});
	};
	loadTypes = () => {
		this.props.client
			.query({
				query: this.GET_TYPES_QUERY
			})
			.then((data) => {
				if (data.data.getcatalogitem != null) {
					this.setState({
						types: data.data.getcatalogitem
					});
				} else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading types: getcatalogitem not exists in query data'
					);
				}
			})
			.catch((error) => {
				console.log('Error: Loading types: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading types: ' + error);
			});
	};
	loadDepartments = () => {
		this.props.client
			.query({
				query: this.GET_DEPARTMENTS_QUERY
			})
			.then((data) => {
				if (data.data.getcatalogitem != null) {
					this.setState({
						departments: data.data.getcatalogitem
					});
				} else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading departments: getcatalogitem not exists in query data'
					);
				}
			})
			.catch((error) => {
				console.log('Error: Loading departments: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading departments: ' + error);
			});
	};

	insertContacts = () => {
		const { isEdition, query, id } = this.getObjectToInsertAndUpdate();

		this.setState({
			success: false,
			loading: true
		});

		this.props.client
			.mutate({
				mutation: query,
				variables: {
					input: {
						Id: id,
						Id_Entity: this.state.idCompany,
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
	};
	deleteContacts = (id) => {
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
				this.resetState();
			})
			.catch((error) => {
				console.log('Error: Deleting Contact: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Deleting Contact: ' + error);
			});
	};

	addContactHandler = () => {
		this.setState(
			{
				success: false,
				loading: true
			},
			() => {
				this.validateAllFields();
				if (this.state.formValid) this.insertContacts();
			}
		);
	};

	cancelContactHandler = () => {
		this.resetState();
	};
	render() {
		console.log('render');
		const { loading, success } = this.state;
		const { classes } = this.props;

		const buttonClassname = classNames({
			[classes.buttonSuccess]: success
		});

		return (
			<div className={classes.container}>
				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					content="Do you really want to continue whit this operation?"
				/>
				<div className={classes.divStyle}>
					<FormControl className={[ classes.formControl, classes.firstnameControl ].join(' ')}>
						<InputLabel htmlFor="firstname">First Name</InputLabel>
						<Input
							id="firstname"
							name="firstname"
							inputProps={{ maxLength: 15 }}
							className={classes.resize}
							error={!this.state.firstnameValid}
							value={this.state.firstname}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>
					<FormControl className={[ classes.formControl, classes.firstnameControl ].join(' ')}>
						<InputLabel htmlFor="middlename">Middle Name</InputLabel>
						<Input
							id="middlename"
							name="middlename"
							inputProps={{ maxLength: 15 }}
							className={classes.resize}
							error={!this.state.middlenameValid}
							value={this.state.middlename}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>
					<FormControl className={[ classes.formControl, classes.firstnameControl ].join(' ')}>
						<InputLabel htmlFor="lastname">Last Name</InputLabel>
						<Input
							id="lastname"
							name="lastname"
							inputProps={{ maxLength: 20 }}
							className={classes.resize}
							error={!this.state.lastnameValid}
							value={this.state.lastname}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>
					<FormControl className={[ classes.formControl, classes.typeControl ].join(' ')}>
						<TextField
							id="idDepartment"
							select
							name="idDepartment"
							error={!this.state.idDepartmentValid}
							value={this.state.idDepartment}
							InputProps={{
								classes: {
									input: classes.resize
								}
							}}
							onChange={(event) => this.onSelectChangeHandler(event)}
							helperText="Department"
							margin="normal"
						>
							{this.state.departments.map(({ Id, Name }) => (
								<MenuItem key={Id} value={Id} name={Name}>
									{Name}
								</MenuItem>
							))}
						</TextField>
					</FormControl>
					<FormControl className={[ classes.formControl, classes.typeControl ].join(' ')}>
						<TextField
							id="idSupervisor"
							select
							name="idSupervisor"
							error={!this.state.idSupervisorValid}
							value={this.state.idSupervisor}
							InputProps={{
								classes: {
									input: classes.resize
								}
							}}
							onChange={(event) => this.onSelectChangeHandler(event)}
							helperText="Supervisor"
							margin="normal"
						>
							{' '}
							<MenuItem key={0} value={0} name="None">
								None
							</MenuItem>
							{this.state.supervisors.map(({ id, firstname }) => (
								<MenuItem key={id} value={id} name={firstname}>
									{firstname}
								</MenuItem>
							))}
						</TextField>
					</FormControl>

					<FormControl className={[ classes.formControl, classes.emailControl ].join(' ')}>
						<InputLabel htmlFor="email">Email</InputLabel>
						<Input
							id="email"
							name="email"
							inputProps={{ maxLength: 30 }}
							className={classes.resize}
							error={!this.state.emailValid}
							value={this.state.email}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>

					<FormControl className={[ classes.formControl, classes.numberControl ].join(' ')}>
						<InputLabel htmlFor="number">Phone</InputLabel>
						<Input
							id="number"
							name="number"
							inputProps={{ maxLength: 15 }}
							className={classes.resize}
							error={!this.state.numberValid}
							value={this.state.number}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>

					<FormControl className={[ classes.formControl, classes.typeControl ].join(' ')}>
						<TextField
							id="type"
							select
							name="type"
							error={!this.state.typeValid}
							value={this.state.type}
							InputProps={{
								classes: {
									input: classes.resize
								}
							}}
							onChange={(event) => this.onSelectChangeHandler(event)}
							helperText="Title"
							margin="normal"
						>
							{this.state.types.map(({ Id, Name }) => (
								<MenuItem key={Id} value={Id} name={Name}>
									{Name}
								</MenuItem>
							))}
						</TextField>
					</FormControl>
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
										disabled={!this.state.formValid}
										variant="fab"
										color="primary"
										className={buttonClassname}
										onClick={this.addContactHandler}
									>
										{success ? (
											<CheckIcon />
										) : this.state.idToEdit != null &&
										this.state.idToEdit != '' &&
										this.state.idToEdit != 0 ? (
											<SaveIcon />
										) : (
											<AddIcon />
										)}
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
										disabled={!this.state.enableCancelButton}
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
				</div>
				<div className={classes.divStyle}>
					<ContactsTable
						data={this.state.data}
						types={this.state.types}
						supervisors={this.state.supervisors}
						departments={this.state.departments}
						onEditHandler={this.onEditHandler}
						onDeleteHandler={this.onDeleteHandler}
					/>
				</div>
			</div>
		);
	}
}

ContactCompanyForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(ContactCompanyForm));
