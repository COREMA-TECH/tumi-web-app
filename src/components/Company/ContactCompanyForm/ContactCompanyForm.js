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
import InputAdornment from '@material-ui/core/InputAdornment';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import LinearProgress from '@material-ui/core/LinearProgress';
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
const currencies = [
	{
		label: 'USD',
		value: 1
	},
	{
		label: 'EUR',
		value: 2
	},
	{
		label: 'BTC',
		value: 3
	},
	{
		label: 'JPY',
		value: 4
	}
];

class ContactCompanyForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			data: [],
			email: '',
			number: '',
			kind: '',
			formErrors: { username: '', email: '', number: '', kind: '' },
			usernameValid: false,
			emailValid: false,
			numberValid: false,
			kindValid: false,
			formValid: false
		};
	}

	handleChange = (name) => (event) => {
		this.setState({
			[name]: event.target.value
		});
	};
	handleUserInput(e) {
		const name = e.target.name;
		const value = e.target.value;
		this.setState({ [name]: value }, () => {
			this.validateField(name, value);
		});
	}
	validateField(fieldName, value) {
		let fieldValidationErrors = this.state.formErrors;
		let emailValid = this.state.emailValid;
		let usernameValid = this.state.usernameValid;
		let numberValid = this.state.numberValid;
		let kindValid = this.state.kindValid;

		switch (fieldName) {
			case 'email':
				emailValid = value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				fieldValidationErrors.email = emailValid ? '' : ' is invalid';
				break;
			case 'username':
				usernameValid = value.length >= 6;
				fieldValidationErrors.name = usernameValid ? '' : ' is too short';
				break;
			case 'number':
				numberValid = value.length >= 6;
				fieldValidationErrors.name = numberValid ? '' : ' is too short';
				break;
			case 'kind':
				kindValid = value != null;
				fieldValidationErrors.name = kindValid ? '' : ' must select type';
				break;
			default:
				break;
		}
		this.setState(
			{
				formErrors: fieldValidationErrors,
				emailValid: emailValid,
				usernameValid: usernameValid,
				numberValid: numberValid,
				kindValid: kindValid
			},
			this.validateForm
		);
	}

	validateForm() {
		this.setState({
			formValid:
				this.state.emailValid && this.state.usernameValid && this.state.numberValid && this.state.kindValid
		});
	}

	render() {
		const { classes } = this.props;

		const INSERT_CONTACTS = gql`
			mutation inscontactscompany($input: iParamC!) {
				inscontactscompany(input: $input) {
					Id
					Full_Name
				}
			}
		`;

		return (
			<div className={classes.container}>
				<div className={classes.divStyle}>
					<div className="panel panel-default">
						<FormErrors formErrors={this.state.formErrors} />
					</div>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="name-simple">Name</InputLabel>
						<Input
							id="name-simple"
							name="username"
							value={this.state.username}
							onChange={(event) => this.handleUserInput(event)}
						/>
					</FormControl>
					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="name-simple">Email</InputLabel>
						<Input
							id="name-simple"
							name="email"
							value={this.state.email}
							onChange={(event) => this.handleUserInput(event)}
						/>
					</FormControl>

					<FormControl className={classes.formControl}>
						<InputLabel htmlFor="name-simple">Phone Number</InputLabel>
						<Input
							id="name-simple"
							name="number"
							value={this.state.number}
							onChange={(event) => this.handleUserInput(event)}
						/>
					</FormControl>
					<FormControl className={classes.formControl}>
						<form noValidate autoComplete="off">
							<TextField
								id="select-currency"
								select
								name="kind"
								value={this.state.kind}
								onChange={(event) => this.handleUserInput(event)}
								helperText="Please select the type"
								margin="normal"
							>
								{currencies.map((option) => (
									<MenuItem key={option.value} value={option.value} name={'option.name'}>
										{option.label}
									</MenuItem>
								))}
							</TextField>
						</form>
					</FormControl>
					<Mutation mutation={INSERT_CONTACTS}>
						{(inscontactscompany, { loading, error }) => (
							<Button
								disabled={!this.state.formValid}
								variant="contained"
								color="primary"
								className={classes.button}
								onClick={() => {
									var item = {
										username: this.state.username,
										email: this.state.email,
										number: this.state.number,
										kind: this.state.kind
									};

									inscontactscompany({
										variables: {
											input: {
												Id: 0,
												Id_Company: 1,
												Full_Name: `'${this.state.username}'`,
												Electronic_Address: `'${this.state.email}'`,
												Phone_Number: `'${this.state.number}'`,
												Contact_Type: this.state.kind,
												IsActive: 1,
												User_Created: 1,
												User_Updated: 1,
												Date_Created: "'2018-08-14 16:10:25+00'",
												Date_Updated: "'2018-08-14 16:10:25+00'"
											}
										}
									});
									this.setState((prevState) => ({
										data: prevState.data.concat(item),
										data: [ item, ...prevState.data ]
									}));

									this.setState({
										username: '',
										email: '',
										number: '',
										kind: '',
										formErrors: { name: '', email: '', number: '', kind: '' },
										nameValid: false,
										emailValid: false,
										numberValid: false,
										kindValid: false,
										formValid: false
									});
								}}
							>
								Add Contact
								{loading && alert('loading')}
								{error && <p>Error :( Please try again</p>}
							</Button>
						)}
					</Mutation>
				</div>
				<div className={classes.divStyle}>
					<ContactsTable data={this.state.data} />
				</div>
			</div>
		);
	}
}

ContactCompanyForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContactCompanyForm);
