import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import DepartmentsTable from './DepartmentsTable';
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
	codeControl: {
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

class DepartmentsCompanyForm extends React.Component {
	GET_DEPARTMENTS_QUERY = gql`
		{
			getcatalogitem(IsActive: 1, Id_Catalog: 8) {
				Id
				Code: Name
				Description
				IsActive
			}
		}
	`;
	INSERT_DEPARTMENTS_QUERY = gql`
		mutation inscatalogitem($input: iParamCI!) {
			inscatalogitem(input: $input) {
				Id
			}
		}
	`;

	UPDATE_DEPARTMENTS_QUERY = gql`
		mutation updcatalogitem($input: iParamCI!) {
			updcatalogitem(input: $input) {
				Id
			}
		}
	`;

	DELETE_DEPARTMENTS_QUERY = gql`
		mutation delcatalogitem($Id: Int!) {
			delcatalogitem(Id: $Id, IsActive: 0) {
				Id
			}
		}
	`;

	TITLE_ADD = 'Add Department';
	TITLE_EDIT = 'Update Department';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		code: '',
		description: '',

		codeValid: false,
		descriptionValid: false,

		codeHasValue: false,
		descriptionHasValue: false,

		formValid: false,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false,
		openSnackbar: true,
		loading: false,
		success: false,
		loadingConfirm: false
	};

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			idCompany: this.props.idCompany,
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
		this.setState({ [name]: value }, this.validateField(name, value));
	}
	enableCancelButton = () => {
		let codeHasValue = this.state.code != '';
		let descriptionHasValue = this.state.description != '';

		return codeHasValue || descriptionHasValue;
	};
	validateAllFields() {
		let codeValid = this.state.code.trim().length >= 2;
		let descriptionValid = this.state.description.trim().length >= 2;
		this.setState(
			{
				codeValid,
				descriptionValid
			},
			this.validateForm
		);
	}
	validateField(fieldName, value) {
		let codeValid = this.state.codeValid;
		let descriptionValid = this.state.descriptionValid;

		let codeHasValue = this.state.codeHasValue;
		let descriptionHasValue = this.state.descriptionHasValue;

		switch (fieldName) {
			case 'code':
				codeValid = value.trim().length >= 2;
				codeHasValue = value != '';
				break;
			case 'description':
				descriptionValid = value.trim().length >= 2;
				descriptionHasValue = value != '';
				break;
			default:
				break;
		}
		this.setState(
			{
				codeValid,
				descriptionValid,
				codeHasValue,
				descriptionHasValue
			},
			this.validateForm
		);
	}

	validateForm() {
		this.setState({
			formValid: this.state.codeValid && this.state.descriptionValid,
			enableCancelButton: this.state.codeHasValue || this.state.descriptionHasValue
		});
	}

	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteDepartment();
	};
	onEditHandler = ({ Id, Code, Description }) => {
		this.setState(
			{
				idToEdit: Id,
				code: Code.trim(),
				description: Description.trim(),
				formValid: true,
				codeValid: true,
				descriptionValid: true,

				enableCancelButton: true,
				codeHasValue: true,
				descriptionHasValue: true,

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
		this.loadDepartments();
	}

	loadDepartments = () => {
		this.props.client
			.query({
				query: this.GET_DEPARTMENTS_QUERY,
				variables: { IdEntity: this.state.idCompany },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcatalogitem != null) {
					this.setState(
						{
							data: data.data.getcatalogitem
						},
						() => {
							this.resetState();
						}
					);
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
	getObjectToInsertAndUpdate = () => {
		let id = 0;
		let query = this.INSERT_DEPARTMENTS_QUERY;
		const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

		if (isEdition) {
			query = this.UPDATE_DEPARTMENTS_QUERY;
		}

		return { isEdition: isEdition, query: query, id: this.state.idToEdit };
	};
	insertDepartment = () => {
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
								Id_Catalog: 8,
								Id_Parent: 0,
								Name: `'${this.state.code}'`,
								DisplayLabel: `'${this.state.description}'`,
								Description: `'${this.state.description}'`,
								Value: null,
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
						this.props.handleOpenSnackbar(
							'success',
							isEdition ? 'Department Updated!' : 'Department Inserted!'
						);
						this.loadDepartments();
						this.resetState();
					})
					.catch((error) => {
						console.log(
							isEdition ? 'Error: Updating Department: ' : 'Error: Inserting Department: ',
							error
						);
						this.props.handleOpenSnackbar(
							'error',
							isEdition ? 'Error: Updating Department: ' + error : 'Error: Inserting Department: ' + error
						);
						this.setState({
							success: false,
							loading: false
						});
					});
			}
		);
	};
	deleteDepartment = (id) => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.DELETE_DEPARTMENTS_QUERY,
						variables: {
							Id: this.state.idToDelete
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Department Deleted!');
						this.loadDepartments();
						this.resetState();
					})
					.catch((error) => {
						console.log('Error: Deleting Department: ', error);
						this.props.handleOpenSnackbar('error', 'Error: Deleting Department: ' + error);
						this.setState({
							loadingConfirm: false
						});
					});
			}
		);
	};

	addDepartmenttHandler = () => {
		this.setState(
			{
				success: false,
				loading: true
			},
			() => {
				this.validateAllFields();
				if (this.state.formValid) this.insertDepartment();
				else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Saving Information: You must to fill all required fields'
					);
					this.setState({
						loading: false
					});
				}
			}
		);
	};

	cancelDepartmentHandler = () => {
		this.resetState();
	};
	render() {
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
								maxLength: 10,
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
						<InputLabel htmlFor="description">Description</InputLabel>
						<Input
							id="description"
							name="description"
							inputProps={{
								maxLength: 15,
								classes: {
									input: classes.descriptionControl
								}
							}}
							className={classes.resize}
							error={!this.state.descriptionValid}
							value={this.state.description}
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
										onClick={this.addDepartmenttHandler}
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
										onClick={this.cancelDepartmentHandler}
									>
										<ClearIcon />
									</Button>
								</div>
							</Tooltip>
						</div>
					</div>
				</div>
				<div className={classes.divStyle}>
					<DepartmentsTable
						data={this.state.data}
						loading={this.state.loading}
						onEditHandler={this.onEditHandler}
						onDeleteHandler={this.onDeleteHandler}
					/>
				</div>
			</div>
		);
	}
}

DepartmentsCompanyForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(DepartmentsCompanyForm));
