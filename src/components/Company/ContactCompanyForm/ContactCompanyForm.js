import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import ContactsTable from '../ContactsTable/ContactsTable';
import FormErrors from './FormErrors';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { Query } from 'react-apollo';
import AlertDialogSlide from '../../Generic/AlertDialogSlide';
import { withApollo } from 'react-apollo';

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
	GET_CONTACTS = gql`
		query getcontacts($IdEntity: Int) {
			getcontacts(IsActive: 1, Id_Entity: $IdEntity) {
				id: Id
				username: Full_Name
				email: Electronic_Address
				number: Phone_Number
				type: Contact_Type
			}
		}
	`;
	GET_TYPES = gql`
		{
			getcatalogitem(IsActive: 1, Id_Catalog: 6) {
				Id
				Name
				IsActive
			}
		}
	`;

	INSERT_CONTACTS = gql`
		mutation inscontacts($input: iParamC!) {
			inscontacts(input: $input) {
				Id
				Full_Name
			}
		}
	`;

	UPDATE_CONTACTS = gql`
		mutation updcontacts($input: iParamC!) {
			updcontacts(input: $input) {
				Id
				Full_Name
			}
		}
	`;
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			types: [ { Id: 0, Name: 'Nothing', Description: 'Nothing' } ],
			id: '',
			dataloaded: false,
			idCompany: props.idCompany,
			idToDelete: null,
			idToEdit: null,
			username: '',
			email: '',
			number: '',
			type: '',
			usernameValid: false,
			emailValid: false,
			numberValid: false,
			typeValid: false,
			formValid: false,
			opendialog: false,
			buttonTitle: this.TITLE_ADD
		};
	}
	focusTextInput() {
		document.getElementById('username').focus();
		document.getElementById('username').select();
	}
	componentDidMount() {
		this.resetState();
	}
	TITLE_ADD = 'Add Contact';
	TITLE_EDIT = 'Update Contact';
	GENERATE_ID = () => {
		return '_' + Math.random().toString(36).substr(2, 9);
	};
	resetState = () => {
		this.setState({
			id: '',
			idToDelete: null,
			idToEdit: null,
			username: '',
			email: '',
			number: '',
			type: '',
			usernameValid: false,
			emailValid: false,
			numberValid: false,
			typeValid: false,
			formValid: false,
			opendialog: false,
			buttonTitle: this.TITLE_ADD
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
		this.validateField(name, value);
	}
	validateAllFields() {
		let fieldValidationErrors = '';
		let emailValid = false;
		let usernameValid = false;
		let numberValid = false;
		let typeValid = false;

		emailValid = this.state.email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
		usernameValid = this.state.username.length >= 6;
		numberValid = this.state.number.length >= 6;
		typeValid = this.state.type != null && this.state.type != 0;

		this.setState(
			{
				emailValid: emailValid,
				usernameValid: usernameValid,
				numberValid: numberValid,
				typeValid: typeValid
			},
			this.validateForm
		);
	}
	validateField(fieldName, value) {
		let emailValid = this.state.emailValid;
		let usernameValid = this.state.usernameValid;
		let numberValid = this.state.numberValid;
		let typeValid = this.state.typeValid;

		switch (fieldName) {
			case 'email':
				emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				break;
			case 'username':
				usernameValid = value.length >= 6;
				break;
			case 'number':
				numberValid = value.length >= 6;
				break;
			case 'type':
				typeValid = value != null && value != 0;
				break;
			default:
				break;
		}
		this.setState(
			{
				emailValid: emailValid,
				usernameValid: usernameValid,
				numberValid: numberValid,
				typeValid: typeValid
			},
			this.validateForm
		);
	}

	validateForm() {
		this.setState({
			formValid:
				this.state.emailValid && this.state.usernameValid && this.state.numberValid && this.state.typeValid
		});
	}

	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		const contacts = this.state.data.filter((row) => row.id !== this.state.idToDelete);

		this.setState({ data: contacts });

		this.resetState();
	};
	onEditHandler = ({ id, username, email, number, type }) => {
		this.setState(
			{
				idToEdit: id,
				username: username.trim(),
				email: email.trim(),
				number: number.trim(),
				type: type,
				formValid: true,
				emailValid: true,
				usernameValid: true,
				typeValid: true,
				numberValid: true,
				buttonTitle: this.TITLE_EDIT
			},
			() => {
				this.focusTextInput();
			}
		);
	};
	onDeleteHandler = (id) => {
		this.setState({ idToDelete: id });
		this.setState({ opendialog: true });
	};
	componentWillMount() {
		console.log('will mount');
		this.loadContacts();
		this.loadTypes();
	}
	loadContacts = () => {
		this.props.client
			.query({
				query: this.GET_CONTACTS,
				variables: { IdEntity: this.state.idCompany },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcontacts != null && data.data.getcontacts.length > 0) {
					this.setState({
						data: data.data.getcontacts
					});
				}
			})
			.catch((error) => console.error(error));
	};
	loadTypes = () => {
		this.props.client
			.query({
				query: this.GET_TYPES
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
	insertContactsDummy = () => {
		let id = this.GENERATE_ID();

		if (this.state.idToEdit != null) {
			id = this.state.idToEdit;
		}
		let item = {
			id: id,
			username: this.state.username,
			email: this.state.email,
			number: this.state.number,
			type: this.state.type
		};

		if (this.state.idToEdit != null) {
			const items = [ ...this.state.data ];
			const index = items.findIndex((element) => element.id == this.state.idToEdit);
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
		let id = this.GENERATE_ID();
		let query = this.INSERT_CONTACTS;

		if (this.state.idToEdit != null) {
			id = this.state.idToEdit;
			query = this.UPDATE_CONTACTS;
		}
		let item = {
			id: id,
			username: this.state.username,
			email: this.state.email,
			number: this.state.number,
			type: this.state.type
		};
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
						IsActive: 1,
						User_Created: 1,
						User_Updated: 1,
						Date_Created: "'2018-08-14 16:10:25+00'",
						Date_Updated: "'2018-08-14 16:10:25+00'"
					}
				}
			})
			.then((data) => {
				if (this.state.idToEdit != null) {
					const items = [ ...this.state.data ];
					const index = items.findIndex((element) => element.id == this.state.idToEdit);
					items[index] = { ...item };
					this.setState({ data: items });
				} else {
					this.setState((prevState) => ({
						data: prevState.data.concat(item),
						data: [ item, ...prevState.data ]
					}));
				}
				this.resetState();
			})
			.catch((error) => console.error(error));
	};
	render() {
		const { classes } = this.props;

		const addContactHandler = () => {
			this.validateAllFields();
			if (this.state.formValid) this.insertContactsDummy();
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
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="name-simple">Name</InputLabel>
						<Input
							id="username"
							name="username"
							error={!this.state.usernameValid}
							value={this.state.username}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="name-simple">Email</InputLabel>
						<Input
							id="email"
							name="email"
							error={!this.state.emailValid}
							value={this.state.email}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>

					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="name-simple">Phone Number</InputLabel>
						<Input
							id="number"
							name="number"
							error={!this.state.numberValid}
							value={this.state.number}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>

					<FormControl className={classes.formControl}>
						<form noValidate autoComplete="off">
							<TextField
								id="select-type"
								select
								name="type"
								error={!this.state.typeValid}
								value={this.state.type}
								onBlur={(event) => this.onBlurHandler(event)}
								onChange={(event) => this.onChangeHandler(event)}
								helperText="Please select the title"
								margin="normal"
							>
								{this.state.types.map(({ Id, Name }) => (
									<MenuItem key={Id} value={Id} name={Name}>
										{Name}
									</MenuItem>
								))}
							</TextField>
						</form>
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
						disabled={!this.state.formValid}
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
