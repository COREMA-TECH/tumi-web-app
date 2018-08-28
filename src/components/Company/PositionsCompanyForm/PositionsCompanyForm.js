import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import PositionsTable from './PositionsTable';
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
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';

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
	inputControl: {},
	departmentControl: {
		width: '200px',
		paddingRight: '0px'
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

function TextMaskCustom(props) {
	const { inputRef, ...other } = props;

	return (
		<MaskedInput
			{...other}
			ref={inputRef}
			mask={[ '(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/ ]}
			placeholderChar={'\u2000'}
			showMask
		/>
	);
}

TextMaskCustom.propTypes = {
	inputRef: PropTypes.func.isRequired
};

function NumberFormatCustom(props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						value: values.value
					}
				});
			}}
			thousandSeparator
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired
};

class PositionsCompanyForm extends React.Component {
	GET_POSTIONS_QUERY = gql`
		query getposition($Id_Entity: Int) {
			getposition(IsActive: 1, Id_Entity: $Id_Entity) {
				Id
				Id_Department
				Position
				Bill_Rate
				Pay_Rate
				IsActive
			}
		}
	`;

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
	INSERT_POSITION_QUERY = gql`
		mutation insposition($input: iParamPR!) {
			insposition(input: $input) {
				Id
			}
		}
	`;

	UPDATE_POSITION_QUERY = gql`
		mutation updposition($input: iParamPR!) {
			updposition(input: $input) {
				Id
			}
		}
	`;

	DELETE_POSITION_QUERY = gql`
		mutation delposition($Id: Int!) {
			delposition(Id: $Id, IsActive: 0) {
				Id
			}
		}
	`;

	TITLE_ADD = 'Add Position';
	TITLE_EDIT = 'Update Position';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		idDepartment: '',
		position: '',
		billrate: 0,
		payrate: 0,

		idDepartmentValid: false,
		positionValid: false,
		billrateValid: false,
		payrateValid: false,

		idDepartmentHasValue: false,
		positionHasValue: false,
		billrateHasValue: false,
		payrateHasValue: false,

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
			departments: [],
			idCompany: this.props.idCompany,
			companyRate: 37,
			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);
	}
	focusTextInput() {
		document.getElementById('position').focus();
		document.getElementById('position').select();
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
	onNumberChangeHandler = (name) => (event) => {
		let value = event.target.value;
		var secondName = 'payrate';
		var secondValue = 0;

		var payrateValid = this.state.payrateValid;
		var billrateValid = this.state.billrateValid;

		var payrateHasValue = this.state.payrateHasValue;
		var billrateHasValue = this.state.billrateHasValue;

		if (value == '') return;
		console.log('Passed');
		switch (name) {
			case 'payrate':
				secondName = 'billrate';
				secondValue = Math.round(value * (1 + this.state.companyRate / 100) * 100) / 100;
				break;
			case 'billrate':
				secondValue = Math.round(value / (1 + this.state.companyRate / 100) * 100) / 100;
				break;
			default:
				break;
		}

		this.setState(
			{
				[name]: value,
				[secondName]: secondValue
			},
			() => {
				payrateValid = value != 0 && value != '';
				payrateHasValue = value != 0;

				billrateValid = value != 0 && value != '';
				billrateHasValue = value != 0;

				this.setState({
					payrateValid,
					billrateValid,
					payrateHasValue,
					billrateHasValue,
					formValid:
						this.state.positionValid &&
						this.state.payrateValid &&
						this.state.billrateValid &&
						this.state.idDepartmentValid,
					enableCancelButton:
						this.state.positionHasValue ||
						this.state.payrateHasValue ||
						this.state.billrateHasValue ||
						this.state.idDepartmentHasValue
				});
			}
		);
	};
	onChangeHandler(e) {
		const name = e.target.name;
		const value = e.target.value;

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
		let positionHasValue = this.state.position != '';
		let billrateHasValue = this.state.billrate != 0;
		let payrateHasValue = this.state.payrate != 0;
		let idDepartmentHasValue = this.state.idDepartment !== null && this.state.idDepartment !== '';

		return positionHasValue || billrateHasValue || payrateHasValue || idDepartmentHasValue;
	};
	validateAllFields() {
		let positionValid = this.state.position.trim().length >= 5;
		let billrateValid = this.state.billrate != 0 && this.state.billrate != '';
		let payrateValid = this.state.payrate != 0 && this.state.payrate != '';

		let idDepartmentValid =
			this.state.idDepartment !== null && this.state.idDepartment !== 0 && this.state.idDepartment !== '';

		this.setState(
			{
				positionValid,
				billrateValid,
				payrateValid,
				idDepartmentValid
			},
			this.validateForm
		);
	}
	validateField(fieldName, value) {
		let positionValid = this.state.positionValid;
		let payrateValid = this.state.payrateValid;
		let billrateValid = this.state.billrateValid;
		let idDepartmentValid = this.state.idDepartmentValid;

		let positionHasValue = this.state.postionHasValue;
		let payrateHasValue = this.state.payrateHasValue;
		let billrateHasValue = this.state.billrateHasValue;
		let idDepartmentHasValue = this.state.departmentHasValue;

		switch (fieldName) {
			case 'position':
				positionValid = value.trim().length >= 5;
				positionHasValue = value != '';
				break;
			case 'payrate':
				payrateValid = value != 0 && value != '';
				payrateHasValue = value != 0;
				break;
			case 'billrate':
				billrateValid = value != 0 && value != '';
				billrateHasValue = value != 0;
				break;
			case 'idDepartment':
				idDepartmentValid = value !== null && value !== 0 && value !== '';
				idDepartmentHasValue = value !== null && value !== '';
				break;
			default:
				break;
		}
		this.setState(
			{
				positionValid,
				payrateValid,
				billrateValid,
				idDepartmentValid,

				positionHasValue,
				payrateHasValue,
				billrateHasValue,
				idDepartmentHasValue
			},
			this.validateForm
		);
	}

	validateForm() {
		this.setState({
			formValid:
				this.state.positionValid &&
				this.state.payrateValid &&
				this.state.billrateValid &&
				this.state.idDepartmentValid,
			enableCancelButton:
				this.state.positionHasValue ||
				this.state.payrateHasValue ||
				this.state.billrateHasValue ||
				this.state.idDepartmentHasValue
		});
	}

	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deletePostion();
	};
	onEditHandler = ({ Id, Position, Id_Department, Bill_Rate, Pay_Rate }) => {
		this.setState(
			{
				idToEdit: Id,
				position: Position.trim(),
				idDepartment: Id_Department,
				billrate: Bill_Rate,
				payrate: Pay_Rate,

				formValid: true,
				positionValid: true,
				idDepartmentValid: true,
				billrateValid: true,
				payrateValid: true,

				enableCancelButton: true,
				positionHasValue: true,
				idDepartmentHasValue: true,
				billrateHasValue: true,
				payrateHasValue: true,

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
		this.loadPositions();
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

	loadPositions = () => {
		this.props.client
			.query({
				query: this.GET_POSTIONS_QUERY,
				variables: { Id_Entity: this.state.idCompany },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getposition != null) {
					this.setState(
						{
							data: data.data.getposition
						},
						() => {
							this.resetState();
						}
					);
				} else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading positions and rates: getposition not exists in query data'
					);
				}
			})
			.catch((error) => {
				console.log('Error: Loading positions: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading positions and rates: ' + error);
			});
	};

	getObjectToInsertAndUpdate = () => {
		let id = 0;
		let query = this.INSERT_POSITION_QUERY;
		const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

		if (isEdition) {
			query = this.UPDATE_POSITION_QUERY;
		}

		return { isEdition: isEdition, query: query, id: this.state.idToEdit };
	};
	insertPosition = () => {
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
								Id_Department: this.state.idDepartment,
								Position: `'${this.state.position}'`,
								Bill_Rate: this.state.billrate,
								Pay_Rate: this.state.payrate,
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
							isEdition ? 'Positions and Rates Updated!' : 'Positions and Rates Inserted!'
						);
						this.loadPositions();
						this.resetState();
					})
					.catch((error) => {
						console.log(
							isEdition
								? 'Error: Updating Positions and Rates: '
								: 'Error: Inserting Positions and Rates: ',
							error
						);
						this.props.handleOpenSnackbar(
							'error',
							isEdition
								? 'Error: Updating Positions and Rates: ' + error
								: 'Error: Inserting Positions and Rates: ' + error
						);
						this.setState({
							success: false,
							loading: false
						});
					});
			}
		);
	};
	deletePostion = (id) => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.DELETE_POSITION_QUERY,
						variables: {
							Id: this.state.idToDelete
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Position and Rate Deleted!');
						this.loadPositions();
						this.resetState();
					})
					.catch((error) => {
						console.log('Error: Deleting Position and Rates: ', error);
						this.props.handleOpenSnackbar('error', 'Error: Deleting Position and Rates: ' + error);
						this.setState({
							loadingConfirm: false
						});
					});
			}
		);
	};

	addPositionHandler = () => {
		this.setState(
			{
				success: false,
				loading: true
			},
			() => {
				this.validateAllFields();
				if (this.state.formValid) this.insertPosition();
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
					<FormControl className={[ classes.formControl, classes.departmentControl ].join(' ')}>
						<TextField
							id="idDepartment"
							select
							name="idDepartment"
							error={!this.state.idDepartmentValid}
							value={this.state.idDepartment}
							InputProps={{
								classes: {
									input: classes.departmentControl
								}
							}}
							onChange={(event) => this.onSelectChangeHandler(event)}
							helperText="Department"
							margin="normal"
						>
							{this.state.departments.map(({ Id, Description }) => (
								<MenuItem key={Id} value={Id} name={Description}>
									{Description}
								</MenuItem>
							))}
						</TextField>
					</FormControl>
					<FormControl className={[ classes.formControl, classes.inputControl ].join(' ')}>
						<InputLabel htmlFor="position">Title</InputLabel>
						<Input
							id="position"
							name="position"
							inputProps={{
								maxLength: 50,
								classes: {
									input: classes.inputControl
								}
							}}
							className={classes.resize}
							error={!this.state.positionValid}
							value={this.state.position}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>
					<FormControl className={[ classes.formControl, classes.inputControl ].join(' ')}>
						<InputLabel htmlFor="payrate">Pay Rate</InputLabel>
						<Input
							id="payrate"
							name="payrate"
							inputProps={{
								classes: {
									input: classes.inputControl
								}
							}}
							inputComponent={NumberFormatCustom}
							className={classes.resize}
							error={!this.state.payrateValid}
							value={this.state.payrate}
							onChange={this.onNumberChangeHandler('payrate')}
						/>
					</FormControl>
					<FormControl className={[ classes.formControl, classes.inputControl ].join(' ')}>
						<InputLabel htmlFor="billrate">Bill Rate</InputLabel>
						<Input
							id="billrate"
							name="billrate"
							inputProps={{
								classes: {
									input: classes.inputControl
								}
							}}
							inputComponent={NumberFormatCustom}
							defaultValue="0"
							className={classes.resize}
							error={!this.state.billrateValid}
							value={this.state.billrate}
							onChange={this.onNumberChangeHandler('billrate')}
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
										onClick={this.addPositionHandler}
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
					<PositionsTable
						data={this.state.data}
						departments={this.state.departments}
						loading={this.state.loading}
						onEditHandler={this.onEditHandler}
						onDeleteHandler={this.onDeleteHandler}
					/>
				</div>
			</div>
		);
	}
}

PositionsCompanyForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(PositionsCompanyForm));
