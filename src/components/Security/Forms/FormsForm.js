import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormsTable from './FormsTable';
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
import { Snackbar } from '@material-ui/core';
import { MySnackbarContentWrapper } from '../../Generic/SnackBar';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';

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
	id_companyControl: {
		//width: '200px'
	},
	descriptionControl: {
		//width: '100px'
	},

	resize: {
		//width: '200px'
	},
	divStyle: {
		width: '80%',
		display: 'flex'
		//justifyContent: 'space-around'
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

class FormsForm extends React.Component {
	GET_FORMS_QUERY = gql`
		query getforms {
			getforms(IsActive: 1) {
				Id
				Code
				Name
				Value
				Value01
				Value02
				Value03
				Value04
				IsActive
			}
		}
	`;
	INSERT_FORMS_QUERY = gql`
		mutation insforms($input: iForms!) {
			insforms(input: $input) {
				Id
			}
		}
	`;

	UPDATE_FORMS_QUERY = gql`
		mutation updforms($input: iForms!) {
			updforms(input: $input) {
				Id
			}
		}
	`;

	DELETE_FORMS_QUERY = gql`
		mutation delforms($Id: Int!) {
			delforms(Id: $Id, IsActive: 0) {
				Id
			}
		}
	`;

	TITLE_ADD = 'Add Forms';
	TITLE_EDIT = 'Update Forms';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		Code: '',
		Name: '',

		codeValid: false,
		nameValid: false,

		codeHasValue: false,
		nameHasValue: false,

		formValid: false,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false,
		//openSnackbar: false,
		loading: false,
		success: false,
		loadingConfirm: false
	};

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			forms: [],
			openSnackbar: false,
			variantSnackbar: 'info',
			messageSnackbar: 'Dummy text!',

			//idCompany: this.props.idCompany,
			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);
	}
	focusTextInput() {
		document.getElementById('code').focus();
		document.getElementById('code').select();
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
		console.log('onSelectChangeHandler', name, value);
		this.setState({ [name]: value }, this.validateField(name, value));
	}
	enableCancelButton = () => {
		let codeHasValue = this.state.code.trim() != '';
		let nameHasValue = this.state.name.trim() != '';

		return nameHasValue;
	};
	validateAllFields() {
		let codeValid = this.state.code;
		let nameValid = this.state.name.trim().length >= 2;
		this.setState(
			{
				codeValid,
				nameValid
			},
			this.validateForm
		);
	}
	validateField(fieldName, value) {
		let codeValid = this.state.codeValid;
		let nameValid = this.state.nameValid;

		let codeHasValue = this.state.codeHasValue;
		let nameHasValue = this.state.nameHasValue;

		switch (fieldName) {
			case 'code':
				codeValid = value.trim().length >= 2;
				codeHasValue = value.trim() != '';
				break;
			case 'name':
				nameValid = value.trim().length >= 2;
				nameHasValue = value.trim() != '';
				break;
			default:
				break;
		}
		this.setState(
			{
				codeValid,
				nameValid,
				codeHasValue,
				nameHasValue
			},
			this.validateForm
		);
	}

	validateForm() {
		this.setState({
			formValid: this.state.name,
			enableCancelButton: this.state.nameHasValue
		});
	}

	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteForms();
	};
	onEditHandler = ({ Id, Code, Name }) => {
		this.setState(
			{
				idToEdit: Id,
				code: Code.trim(),
				name: Name.trim(),
				formValid: true,
				codeValid: true,
				nameValid: true,

				enableCancelButton: true,
				codeHasValue: true,
				nameHasValue: true,

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
		this.loadForms();
		//this.loadCompanies();
	}

	loadForms = () => {
		this.props.client
			.query({
				query: this.GET_FORMS_QUERY,
				variables: {},
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getforms != null) {
					this.setState(
						{
							data: data.data.getforms
						},
						() => {
							this.resetState();
						}
					);
				} else {
					this.handleOpenSnackbar('error', 'Error: Loading forms: getforms not exists in query data');
				}
			})
			.catch((error) => {
				console.log('Error: Loading forms: ', error);
				this.handleOpenSnackbar('error', 'Error: Loading forms: ' + error);
			});
	};

	/*	loadCompanies = () => {
			this.props.client
				.query({
					query: this.GET_COMPANY_QUERY,
					variables: {},
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getcompanies != null) {
						this.setState(
							{
								company: data.data.getcompanies
							},
							() => {
								this.resetState();
							}
						);
					} else {
						this.handleOpenSnackbar(
							'error',
							'Error: Loading Companies: getCompany not exists in query data'
						);
					}
				})
				.catch((error) => {
					console.log('Error: Loading Companies: ', error);
					this.handleOpenSnackbar('error', 'Error: Loading Companies: ' + error);
				});
		};*/

	getObjectToInsertAndUpdate = () => {
		let id = 0;
		let query = this.INSERT_FORMS_QUERY;
		const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

		if (isEdition) {
			query = this.UPDATE_FORMS_QUERY;
		}

		return { isEdition: isEdition, query: query, id: this.state.idToEdit };
	};
	insertForms = () => {
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
								Code: `'${this.state.code}'`,
								Name: `'${this.state.name}'`,
								Value: `'${this.state.value}'`,
								Value01: null,
								Value02: null,
								Value03: null,
								Value04: null,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-08-14 16:10:25+00'",
								Date_Updated: "'2018-08-14 16:10:25+00'"
							}
						}
					})
					.then((data) => {
						console.log('Guardando');
						this.handleOpenSnackbar('success', isEdition ? 'Forms Updated!' : 'Forms Inserted!');
						this.loadForms();
						this.resetState();
					})
					.catch((error) => {
						console.log(isEdition ? 'Error: Updating Forms: ' : 'Error: Inserting Forms: ', error);
						this.handleOpenSnackbar(
							'error',
							isEdition ? 'Error: Updating Forms: ' + error : 'Error: Inserting Forms: ' + error
						);
						this.setState({
							success: false,
							loading: false
						});
					});
			}
		);
	};
	deleteForms = (id) => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.DELETE_FORMS_QUERY,
						variables: {
							Id: this.state.idToDelete
						}
					})
					.then((data) => {
						this.handleOpenSnackbar('success', 'Form Deleted!');
						this.loadForms();
						this.resetState();
					})
					.catch((error) => {
						console.log('Error: Deleting Forms: ', error);
						this.handleOpenSnackbar('error', 'Error: Deleting Form: ' + error);
						this.setState({
							loadingConfirm: false
						});
					});
			}
		);
	};

	addFormsHandler = () => {
		this.setState(
			{
				success: false,
				loading: true
			},
			() => {
				this.validateAllFields();
				if (this.state.formValid) this.insertForms();
				else {
					this.handleOpenSnackbar(
						'warning',
						'Error: Saving Information: You must fill all the required fields'
					);
					this.setState({
						loading: false
					});
				}
			}
		);
	};

	cancelFormsHandler = () => {
		this.resetState();
	};
	handleOpenSnackbar = (variant, message) => {
		this.setState({
			openSnackbar: true,
			variantSnackbar: variant,
			messageSnackbar: message
		});
	};
	render() {
		const { loading, success } = this.state;
		const { classes } = this.props;

		const buttonClassname = classNames({
			[classes.buttonSuccess]: success
		});

		console.log(this.state.openSnackbar);
		return (
			<div className={classes.container}>
				<Snackbar
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center'
					}}
					open={this.state.openSnackbar}
					autoHideDuration={3000}
					onClose={this.handleCloseSnackbar}
				>
					<MySnackbarContentWrapper
						onClose={this.handleCloseSnackbar}
						variant={this.state.variantSnackbar}
						message={this.state.messageSnackbar}
					/>
				</Snackbar>
				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingConfirm}
					content="Do you really want to continue whit this operation?"
				/>
				<div className={classes.divStyle}>
					<FormControl className={[ classes.formControl, classes.nameControl ].join(' ')}>
						<InputLabel htmlFor="code">Code</InputLabel>
						<Input
							id="code"
							name="code"
							inputProps={{
								maxLength: 15,
								classes: {
									input: classes.codeControl
								}
							}}
							className={classes.resize}
							error={!this.state.codeValid}
							value={this.state.code}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>
					<FormControl className={[ classes.formControl, classes.nameControl ].join(' ')}>
						<InputLabel htmlFor="name">Name</InputLabel>
						<Input
							id="name"
							name="name"
							inputProps={{
								maxLength: 15,
								classes: {
									input: classes.nameControl
								}
							}}
							className={classes.resize}
							error={!this.state.nameValid}
							value={this.state.name}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>
					<FormControl className={[ classes.formControl, classes.nameControl ].join(' ')}>
						<InputLabel htmlFor="value">Value</InputLabel>
						<Input
							id="value"
							name="value"
							inputProps={{
								maxLength: 15,
								classes: {
									input: classes.valueControl
								}
							}}
							className={classes.resize}
							error={!this.state.valueValid}
							value={this.state.value}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
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
										disabled={this.state.loading}
										//	disabled={!this.state.formValid}
										variant="fab"
										color="primary"
										className={buttonClassname}
										onClick={this.addFormsHandler}
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
										disabled={this.state.loading || !this.state.enableCancelButton}
										variant="fab"
										color="secondary"
										className={buttonClassname}
										onClick={this.cancelFormsHandler}
									>
										<ClearIcon />
									</Button>
								</div>
							</Tooltip>
						</div>
					</div>
				</div>
				<div className={classes.divStyle}>
					<FormsTable
						data={this.state.data}
						//company={this.state.company}
						loading={this.state.loading}
						onEditHandler={this.onEditHandler}
						onDeleteHandler={this.onDeleteHandler}
					/>
				</div>
			</div>
		);
	}
}

FormsForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(FormsForm));
