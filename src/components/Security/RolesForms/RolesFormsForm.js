import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import RolesTable from './RolesFormsTable';
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

import withGlobalContent from 'Generic/Global';
import RolesDropdown from "../DropdownForm/RolesDropdown";
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

class RolesForm extends React.Component {
	GET_COMPANY_QUERY = gql`
		query getcompanies {
			getcompanies(IsActive: 1) {
				Id
				Name
			}
		}
	`;

	GET_ROLES_QUERY = gql`
		query getroles {
			getroles(IsActive: 1) {
				Id
				Id_Company
				Description
				IsActive
			}
		}
	`;
	INSERT_ROLES_QUERY = gql`
		mutation insroles($input: iRoles!) {
			insroles(input: $input) {
				Id
			}
		}
	`;

	UPDATE_ROLES_QUERY = gql`
		mutation updroles($input: iRoles!) {
			updroles(input: $input) {
				Id
			}
		}
	`;

	DELETE_ROLES_QUERY = gql`
		mutation delroles($Id: Int!) {
			delroles(Id: $Id, IsActive: 0) {
				Id
			}
		}
	`;

	TITLE_ADD = 'Add Roles';
	TITLE_EDIT = 'Update Roles';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		id_company: '',
		description: '',

		id_companyValid: false,
		descriptionValid: false,

		id_companyHasValue: false,
		descriptionHasValue: false,

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
			company: [],

			//idCompany: this.props.idCompany,
			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);
	}
	focusTextInput() {
		document.getElementById('id_company').focus();
		document.getElementById('id_company').select();
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
		let id_companyHasValue = this.state.code.trim() != '';
		let descriptionHasValue = this.state.description.trim() != '';

		return descriptionHasValue;
	};
	validateAllFields() {
		let id_companyValid = this.state.id_company;
		let descriptionValid = this.state.description.trim().length >= 2;
		this.setState(
			{
				id_companyValid,
				descriptionValid
			},
			this.validateForm
		);
	}
	validateField(fieldName, value) {
		let id_companyValid = this.state.id_companyValid;
		let descriptionValid = this.state.descriptionValid;

		let id_companyHasValue = this.state.id_companyHasValue;
		let descriptionHasValue = this.state.descriptionHasValue;

		switch (fieldName) {
			case 'id_company':
				id_companyValid = value !== null && value !== 0 && value !== '';
				id_companyHasValue = value !== null && value !== '';
				break;
			case 'description':
				descriptionValid = value.trim().length >= 2;
				descriptionHasValue = value.trim() != '';
				break;
			default:
				break;
		}
		this.setState(
			{
				id_companyValid,
				descriptionValid,
				id_companyHasValue,
				descriptionHasValue
			},
			this.validateForm
		);
	}

	validateForm() {
		this.setState({
			formValid: this.state.descriptionValid,
			enableCancelButton: this.state.descriptionHasValue
		});
	}

	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteRoles();
	};
	onEditHandler = ({ Id, Id_Company, Description }) => {
		this.setState(
			{
				idToEdit: Id,
				id_company: Id_Company,
				description: Description.trim(),
				formValid: true,
				id_companyValid: true,
				descriptionValid: true,

				enableCancelButton: true,
				id_companyHasValue: true,
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
		this.loadRoles();
		this.loadCompanies();
	}

	loadRoles = () => {
		this.props.client
			.query({
				query: this.GET_ROLES_QUERY,
				variables: {},
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getroles != null) {
					this.setState(
						{
							data: data.data.getroles
						},
						() => {
							this.resetState();
						}
					);
				} else {
					this.props.handleOpenSnackbar('error', 'Error: Loading roles: getroles not exists in query data');
				}
			})
			.catch((error) => {
				this.props.handleOpenSnackbar('error', 'Error: Loading roles: ' + error);
			});
	};

	loadCompanies = () => {
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
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading Companies: getCompany not exists in query data'
					);
				}
			})
			.catch((error) => {
				this.props.handleOpenSnackbar('error', 'Error: Loading Companies: ' + error);
			});
	};

	getObjectToInsertAndUpdate = () => {
		let id = 0;
		let query = this.INSERT_ROLES_QUERY;
		const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

		if (isEdition) {
			query = this.UPDATE_ROLES_QUERY;
		}

		return { isEdition: isEdition, query: query, id: this.state.idToEdit };
	};
	insertRoles = () => {
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
								Id_Company: this.state.id_company,
								Description: `'${this.state.description}'`,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-08-14 16:10:25+00'",
								Date_Updated: "'2018-08-14 16:10:25+00'"
							}
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', isEdition ? 'Roles Updated!' : 'Roles Inserted!');
						this.loadRoles();
						this.resetState();
					})
					.catch((error) => {
						this.props.handleOpenSnackbar(
							'error',
							isEdition ? 'Error: Updating Roles: ' + error : 'Error: Inserting Roles: ' + error
						);
						this.setState({
							success: false,
							loading: false
						});
					});
			}
		);
	};
	deleteRoles = (id) => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.DELETE_ROLES_QUERY,
						variables: {
							Id: this.state.idToDelete
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Role Deleted!');
						this.loadRoles();
						this.resetState();
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Deleting Role: ' + error);
						this.setState({
							loadingConfirm: false
						});
					});
			}
		);
	};

	addRolesHandler = () => {
		this.setState(
			{
				success: false,
				loading: true
			},
			() => {
				this.validateAllFields();
				if (this.state.formValid) this.insertRoles();
				else {
					this.props.handleOpenSnackbar(
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

	cancelRolesHandler = () => {
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
					<FormControl className={[ classes.formControl, classes.inputControl ].join(' ')}>
						<TextField
							id="id_company"
							select
							name="id_company"
							error={!this.state.id_companyValid}
							value={this.state.id_company}
							InputProps={{
								classes: {
									input: classes.inputControl
								}
							}}
							onChange={(event) => this.onSelectChangeHandler(event)}
							helperText="Company"
							margin="normal"
						>
							{this.state.company.map(({ Id, Name }) => (
								<MenuItem key={Id} value={Id} name={Name}>
									{Name}
								</MenuItem>
							))}
						</TextField>
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
										onClick={this.addRolesHandler}
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
										onClick={this.cancelRolesHandler}
									>
										<ClearIcon />
									</Button>
								</div>
							</Tooltip>
						</div>
					</div>
				</div>
				<div className={classes.divStyle}>
					<RolesDropdown
                        data={this.state.data}
					/>

					{/*<RolesTable*/}
						{/*data={this.state.data}*/}
						{/*company={this.state.company}*/}
						{/*loading={this.state.loading}*/}
						{/*onEditHandler={this.onEditHandler}*/}
						{/*onDeleteHandler={this.onDeleteHandler}*/}
					{/*/>*/}
				</div>
			</div>
		);
	}
}

RolesForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(withGlobalContent(RolesForm)));
