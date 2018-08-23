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

import AlertDialogSlide from '../../Generic/AlertDialogSlide';
import { withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';
const styles = (theme) => ({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginBottom: '30px'
	},
	formControl: {
		margin: theme.spacing.unit,
		width: '18%'
	},
	numberControl: {
		//width: '10%'
	},
	usernameControl: {
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
	}
});

class ContactCompanyForm extends React.Component {
	GET_CONTACTS_QUERY = gql`
		query getcontacts($IdEntity: Int) {
			getcontacts(IsActive: 1, Id_Entity: $IdEntity) {
				id: Id
				idSearch: Id
				username: Full_Name
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
				username: Full_Name
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
				Full_Name
			}
		}
	`;

	UPDATE_CONTACTS_QUERY = gql`
		mutation updcontacts($input: iParamC!) {
			updcontacts(input: $input) {
				Id
				Full_Name
			}
		}
	`;

	DELETE_CONTACTS_QUERY = gql`
		mutation delcontacts($Id: Int!) {
			delcontacts(Id: $Id, IsActive: 0) {
				Id
				Full_Name
			}
		}
	`;

	TITLE_ADD = 'Add Contact';
	TITLE_EDIT = 'Update Contact';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		username: '',
		email: '',
		number: '',
		type: '',
		idSupervisor: 0,
		idDepartment: 0,
		usernameValid: false,
		emailValid: false,
		numberValid: false,
		typeValid: false,
		idDepartmentValid: false,
		idSupervisorValid: true,
		usernameHasValue: false,
		emailHasValue: false,
		numberHasValue: false,
		typeHasValue: false,
		idSupervisorHasValue: false,
		idDepartmentHasValue: false,
		formValid: false,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false
	};
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			idCompany: this.props.idCompany,
			types: [ { Id: 0, Name: 'Nothing', Description: 'Nothing' } ],
			departments: [ { Id: 0, Name: 'Nothing', Description: 'Nothing' } ],
			supervisors: [ { id: -1, username: 'Nothing' } ],
			...this.DEFAULT_STATE
		};
	}
	focusTextInput() {
		//document.getElementById('username').focus();
		//document.getElementById('username').select();
	}
	componentDidMount() {
		this.resetState();
	}

	GENERATE_ID = () => {
		return '_' + Math.random().toString(36).substr(2, 9);
	};
	resetState = () => {
		this.setState({
			...this.DEFAULT_STATE
		});
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
		this.setState({ [name]: value });
	}
	onBlurHandler(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value.trim() }, this.validateField(name, value));
	}
	onSelectChangeHandler(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value });
		this.validateField(name, value);
	}
	enableCancelButton = () => {
		let emailHasValue = this.state.email.trim() == '';
		let usernameHasValue = this.state.username.trim() == '';
		let numberHasValue = this.state.number.trim() == '';
		let typeHasValue = this.state.type == null || (this.state.type == 0 && this.state.type == '');
		let idDepartmentHasValue =
			this.state.idDepartment == null || (this.state.idDepartment == 0 && this.state.idDepartment == '');
		let idSupervisorHasValue =
			this.state.idSupervisor == null || (this.state.idSupervisor == 0 && this.state.idSupervisor == '');
		return (
			emailHasValue &&
			usernameHasValue &&
			numberHasValue &&
			typeHasValue &&
			idDepartmentHasValue &&
			idSupervisorHasValue
		);
	};
	validateAllFields() {
		let emailValid = this.state.email.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
		let usernameValid = this.state.username.trim().length >= 6;
		let numberValid = this.state.number.trim().length >= 6;
		let typeValid = this.state.type != null && this.state.type != 0;
		let idDepartmentValid = this.state.idDepartment != null && this.state.idDepartment != 0;
		let idSupervisorValid = this.state.idSupervisor != null && this.state.idSupervisor != -1;
		this.setState(
			{
				emailValid: emailValid,
				usernameValid: usernameValid,
				numberValid: numberValid,
				typeValid: typeValid,
				idDepartmentValid: idDepartmentValid,
				idSupervisorValid: idSupervisorValid
			},
			this.validateForm
		);
	}
	validateField(fieldName, value) {
		let emailValid = this.state.emailValid;
		let usernameValid = this.state.usernameValid;
		let numberValid = this.state.numberValid;
		let typeValid = this.state.typeValid;
		let idDepartmentValid = this.state.idDepartmentValid;
		let idSupervisorValid = this.state.idSupervisorValid;

		let emailHasValue = this.state.emailHasValue;
		let usernameHasValue = this.state.usernameHasValue;
		let numberHasValue = this.state.numberHasValue;
		let typeHasValue = this.state.typeHasValue;
		let idDepartmentHasValue = this.state.idDepartmentHasValue;
		let idSupervisorHasValue = this.state.idSupervisor;

		switch (fieldName) {
			case 'email':
				emailValid = value.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				emailHasValue = !this.state.email.trim() == '';
				break;
			case 'username':
				usernameValid = value.trim().length >= 6;
				usernameHasValue = !this.state.username.trim() == '';
				break;
			case 'number':
				numberValid = value.trim().length >= 6;
				numberHasValue = !this.state.number.trim() == '';
				break;
			case 'type':
				typeValid = value != null && value != 0;
				typeHasValue = !(this.state.type == null || (this.state.type == 0 && this.state.type == ''));
				console.log('type:', value);
				console.log('Type has value: ', typeHasValue);
				break;
			case 'idDepartment':
				idDepartmentValid = value != null && value != 0;
				idDepartmentHasValue = !(
					this.state.idDepartment == null ||
					(this.state.idDepartment == 0 && this.state.idDepartment == '')
				);

				break;
			case 'idSupervisor':
				idSupervisorValid = value != null && value != -1;
				idSupervisorHasValue = !(
					this.state.idSupervisor == null ||
					(this.state.idSupervisor == 0 && this.state.idSupervisor == '')
				);

				break;
			default:
				break;
		}
		this.setState(
			{
				emailValid: emailValid,
				usernameValid: usernameValid,
				numberValid: numberValid,
				typeValid: typeValid,
				idDepartmentValid: idDepartmentValid,
				idSupervisorValid: idSupervisorValid,
				emailHasValue: emailHasValue,
				usernameHasValue: usernameHasValue,
				numberHasValue: numberHasValue,
				typeHasValue: typeHasValue,
				idDepartmentHasValue: idDepartmentHasValue,
				idSupervisorHasValue: idSupervisorHasValue
			},
			this.validateForm
		);
	}

	validateForm() {
		this.setState({
			formValid:
				this.state.emailValid &&
				this.state.usernameValid &&
				this.state.numberValid &&
				this.state.typeValid &&
				this.state.idDepartmentValid &&
				this.state.idSupervisorValid,
			enableCancelButton:
				this.state.emailHasValue ||
				this.state.usernameHasValue ||
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
	onEditHandler = ({ idSearch, idSupervisor, idDepartment, username, email, number, type }) => {
		this.setState(
			{
				idToEdit: idSearch,
				username: username.trim(),
				email: email.trim(),
				number: number.trim(),
				idSupervisor: idSupervisor,
				idDepartment: idDepartment,
				type: type,
				formValid: true,
				emailValid: true,
				usernameValid: true,
				typeValid: true,
				idDepartmentValid: true,
				idSupervisorValid: true,

				enableCancelButton: true,
				emailHasValue: true,
				usernameHasValue: true,
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
	loadContacts = () => {
		this.props.client
			.query({
				query: this.GET_CONTACTS_QUERY,
				variables: { IdEntity: this.state.idCompany },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcontacts != null && data.data.getcontacts.length > 0) {
					this.setState({
						data: data.data.getcontacts
					});
				}
				this.resetState();
			})
			.catch((error) => console.error(error));
	};
	loadSupervisors = (idContact = 0) => {
		this.props.client
			.query({
				query: this.GET_SUPERVISORS_QUERY,
				variables: { Id_Entity: this.state.idCompany, Id: idContact },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getsupervisor != null && data.data.getsupervisor.length > 0) {
					this.setState({
						supervisors: data.data.getsupervisor
					});
				}
			})
			.catch((error) => console.error(error));
	};
	loadTypes = () => {
		this.props.client
			.query({
				query: this.GET_TYPES_QUERY
			})
			.then((data) => {
				if (data.data.getcatalogitem != null && data.data.getcatalogitem.length > 0) {
					this.setState({
						types: data.data.getcatalogitem
					});
				}
			})
			.catch((error) => console.error(error));
	};
	loadDepartments = () => {
		this.props.client
			.query({
				query: this.GET_DEPARTMENTS_QUERY
			})
			.then((data) => {
				if (data.data.getcatalogitem != null && data.data.getcatalogitem.length > 0) {
					this.setState({
						departments: data.data.getcatalogitem
					});
				}
			})
			.catch((error) => console.error(error));
	};
	getObjectToInsertAndUpdate = () => {
		let id = 0;
		let idSearch = this.GENERATE_ID();
		let query = this.INSERT_CONTACTS_QUERY;

		if (this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0) {
			const items = [ ...this.state.data ];
			const index = items.findIndex((element) => element.idSearch == this.state.idToEdit);
			id = items[index].id;
			query = this.UPDATE_CONTACTS_QUERY;
		}
		let item = {
			id: id,
			idSearch: idSearch,
			username: this.state.username,
			email: this.state.email,
			number: this.state.number,
			type: this.state.type,
			idSupervisor: this.state.idSupervisor,
			idDepartment: this.state.idDepartment
		};
		return { item: item, query: query, id: id };
	};

	insertContactsDummy = () => {
		const { item } = this.getObjectToInsertAndUpdate();

		if (this.state.idToEdit != null) {
			const items = [ ...this.state.data ];
			const index = items.findIndex((element) => element.idSearch == this.state.idToEdit);
			items[index] = { ...item };
			this.setState({ data: items });
		} else {
			this.setState((prevState) => ({
				data: prevState.data.concat(item),
				data: [ item, ...prevState.data ]
			}));
		}
		this.resetState();
	};

	insertContacts = () => {
		const { query, item, id } = this.getObjectToInsertAndUpdate();

		this.props.client
			.mutate({
				mutation: query,
				variables: {
					input: {
						Id: id,
						Id_Entity: this.state.idCompany,
						Full_Name: `'${this.state.username}'`,
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
				const items = [ ...this.state.data ];
				const index = items.findIndex((element) => element.idSearch == this.state.idToEdit);

				//Only Editing current record
				if (this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0) {
					items[index] = { ...item };
					this.setState({ data: items });
				} else {
					//Inserting new record and update cache record with id from database

					item.id = data.data.inscontacts.Id;
					item.idSearch = data.data.inscontacts.Id;
					items[index] = { ...item };

					this.setState((prevState) => ({
						data: prevState.data.concat(item),
						data: [ item, ...prevState.data ]
					}));
				}
				this.resetState();
			})
			.catch((error) => console.error(error));
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
				const contacts = this.state.data.filter((row) => row.id !== this.state.idToDelete);

				this.setState({ data: contacts });

				this.resetState();
			})
			.catch((error) => console.error(error));
	};
	render() {
		const { classes } = this.props;

		const addContactHandler = () => {
			this.validateAllFields();
			if (this.state.formValid) this.insertContacts();
		};

		const cancelContactHandler = () => {
			this.resetState();
		};
		return (
			<div className={classes.container}>
				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					content="Do you really want to continue whit this operation?"
				/>
				<div className={classes.divStyle}>
					<FormControl className={[ classes.formControl, classes.usernameControl ].join(' ')}>
						<InputLabel htmlFor="name-simple">Name</InputLabel>
						<Input
							id="username"
							name="username"
							className={classes.resize}
							error={!this.state.usernameValid}
							value={this.state.username}
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
							{this.state.supervisors.map(({ id, username }) => (
								<MenuItem key={id} value={id} name={username}>
									{username}
								</MenuItem>
							))}
						</TextField>
					</FormControl>

					<FormControl className={[ classes.formControl, classes.emailControl ].join(' ')}>
						<InputLabel htmlFor="name-simple">Email</InputLabel>
						<Input
							id="email"
							name="email"
							className={classes.resize}
							error={!this.state.emailValid}
							value={this.state.email}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>

					<FormControl className={[ classes.formControl, classes.numberControl ].join(' ')}>
						<InputLabel htmlFor="name-simple">Phone</InputLabel>
						<Input
							id="number"
							name="number"
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
					<Button
						disabled={!this.state.formValid}
						variant="contained"
						color="primary"
						className={classes.button}
						onClick={addContactHandler}
					>
						{this.state.buttonTitle}
					</Button>
					<Button
						disabled={!this.state.enableCancelButton}
						variant="contained"
						color="secondary"
						className={classes.button}
						onClick={cancelContactHandler}
					>
						Cancel
					</Button>
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
