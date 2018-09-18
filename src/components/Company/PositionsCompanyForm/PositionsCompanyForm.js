import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import PositionsTable from './PositionsTable';

import gql from 'graphql-tag';
import green from '@material-ui/core/colors/green';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import { withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';

import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';

import InputForm from 'ui-components/InputForm/InputForm';
import SelectForm from 'ui-components/SelectForm/SelectForm';

import ShiftsData from '../../../data/shitfs.json';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
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
	inputControl: {},
	departmentControl: {
		width: '200px',
		paddingRight: '0px'
	},
	shiftControl: {
		width: '100px',
		paddingRight: '0px'
	},
	resize: {
		//width: '200px'
	},
	divStyle: {
		width: '95%',
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

class PositionsCompanyForm extends React.Component {
	GET_POSTIONS_QUERY = gql`
		query getposition($Id_Entity: Int) {
			getposition(IsActive: 1, Id_Entity: $Id_Entity) {
				Id
				Id_Department
				Position
				Bill_Rate
				Pay_Rate
				Shift
				IsActive
			}
		}
	`;

	GET_RATE_QUERY = gql`
		query getbusinesscompanies($Id: Int) {
			getbusinesscompanies(Id: $Id, IsActive: 1, Contract_Status: null) {
				Rate
			}
		}
	`;

	GET_DEPARTMENTS_QUERY = gql`
		{
			getcatalogitem(IsActive: 1, Id_Catalog: 8) {
				Id
				Code: Name
				Name: Description
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
		shift: '',

		idDepartmentValid: true,
		positionValid: true,
		billrateValid: true,
		payrateValid: true,
		shiftValid: true,

		idDepartmentHasValue: false,
		positionHasValue: false,
		billrateHasValue: false,
		payrateHasValue: false,
		shiftHasValue: false,

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
			departments: [ { Id: 0, Code: 'Nothing', Description: 'Nothing' } ],
			shifts: ShiftsData,

			idCompany: this.props.idCompany,
			companyRate: 0,
			inputEnabled: true,

			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);

		this.Login = {
			LoginId: sessionStorage.getItem('LoginId'),
			IsAdmin: sessionStorage.getItem('IsAdmin'),
			AllowEdit: sessionStorage.getItem('AllowEdit') === 'true',
			AllowDelete: sessionStorage.getItem('AllowDelete') === 'true',
			AllowInsert: sessionStorage.getItem('AllowInsert') === 'true',
			AllowExport: sessionStorage.getItem('AllowExport') === 'true'
		};
	}
	focusTextInput() {
		if (document.getElementById('position') != null) {
			document.getElementById('position').focus();
			document.getElementById('position').select();
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
	onNumberChangeHandler(value, name) {
		var secondName = 'payrate';
		var secondValue = 0;

		var payrateValid = this.state.payrateValid;
		var billrateValid = this.state.billrateValid;

		var payrateHasValue = this.state.payrateHasValue;
		var billrateHasValue = this.state.billrateHasValue;

		if (value == '') return;
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
	}
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
		this.setState({ [name]: value }, this.validateField(name, value));
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
		let positionHasValue = this.state.position != '';
		let billrateHasValue = this.state.billrate != 0;
		let payrateHasValue = this.state.payrate != 0;
		let shiftHasValue = this.state.shift != '';
		let idDepartmentHasValue = this.state.idDepartment !== null && this.state.idDepartment !== '';

		return positionHasValue || billrateHasValue || payrateHasValue || idDepartmentHasValue || shiftHasValue;
	};
	validateAllFields(func) {
		let positionValid = this.state.position.trim().length >= 3;
		let billrateValid = this.state.billrate != 0 && this.state.billrate != '';
		let payrateValid = this.state.payrate != 0 && this.state.payrate != '';
		let shiftValid = this.state.shift != '';

		let idDepartmentValid =
			this.state.idDepartment !== null && this.state.idDepartment !== 0 && this.state.idDepartment !== '';

		this.setState(
			{
				positionValid,
				billrateValid,
				payrateValid,
				idDepartmentValid,
				shiftValid
			},
			() => {
				this.validateForm(func);
			}
		);
	}
	validateField(fieldName, value) {
		let positionValid = this.state.positionValid;
		let payrateValid = this.state.payrateValid;
		let billrateValid = this.state.billrateValid;
		let idDepartmentValid = this.state.idDepartmentValid;
		let shiftValid = this.state.shiftValid;

		let positionHasValue = this.state.postionHasValue;
		let payrateHasValue = this.state.payrateHasValue;
		let billrateHasValue = this.state.billrateHasValue;
		let idDepartmentHasValue = this.state.departmentHasValue;
		let shiftHasValue = this.state.shiftHasValue;

		switch (fieldName) {
			case 'position':
				positionValid = value.trim().length >= 3;
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
			case 'shift':
				shiftValid = value != '';
				shiftHasValue = value != '';
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
				shiftValid,

				positionHasValue,
				payrateHasValue,
				billrateHasValue,
				idDepartmentHasValue,
				shiftHasValue
			},
			this.validateForm
		);
	}

	validateForm(func = () => {}) {
		this.setState(
			{
				formValid:
					this.state.positionValid &&
					this.state.payrateValid &&
					this.state.billrateValid &&
					this.state.idDepartmentValid &&
					this.state.shiftValid,
				enableCancelButton:
					this.state.positionHasValue ||
					this.state.payrateHasValue ||
					this.state.billrateHasValue ||
					this.state.idDepartmentHasValue ||
					this.state.shiftHasValue
			},
			func
		);
	}

	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deletePostion();
	};
	onEditHandler = ({ Id, Position, Id_Department, Bill_Rate, Pay_Rate, Shift }) => {
		this.setState(
			{
				idToEdit: Id,
				position: Position.trim(),
				idDepartment: Id_Department,
				billrate: Bill_Rate,
				payrate: Pay_Rate,
				shift: Shift,

				formValid: true,
				positionValid: true,
				idDepartmentValid: true,
				billrateValid: true,
				payrateValid: true,
				shiftValid: true,

				enableCancelButton: true,
				positionHasValue: true,
				idDepartmentHasValue: true,
				billrateHasValue: true,
				payrateHasValue: true,
				shiftHasValue: true,

				buttonTitle: this.TITLE_EDIT,
				openModal: true
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
		if (window.location.pathname === '/company/edit') {
			this.setState(
				{
					//inputEnabled: false
				}
			);
		}
		this.loadDepartments();
		this.loadPositions();
	}

	loadDepartments = () => {
		this.setState({ loadingDepartments: true }, () => {
			this.props.client
				.query({
					query: this.GET_DEPARTMENTS_QUERY,
					variables: { IdEntity: this.state.idCompany },
					fetchPolicy: 'no-cache'
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

	loadPositions = () => {
		this.setState({ loadingData: true }, () => {
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
								data: data.data.getposition,
								loadingData: false
							},
							() => {
								this.getRate();
								this.resetState();
							}
						);
					} else {
						this.props.handleOpenSnackbar(
							'error',
							'Error: Loading positions and rates: getposition not exists in query data'
						);
						this.setState({ loadingData: false });
					}
				})
				.catch((error) => {
					console.log('Error: Loading positions: ', error);
					this.props.handleOpenSnackbar('error', 'Error: Loading positions and rates: ' + error);
					this.setState({ loadingData: false });
				});
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
								Id_Contract: this.props.idContract,
								Id_Department: this.state.idDepartment,
								Position: `'${this.state.position}'`,
								Bill_Rate: this.state.billrate,
								Pay_Rate: this.state.payrate,
								Shift: `'${this.state.shift}'`,
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
				this.validateAllFields(() => {
					if (this.state.formValid) this.insertPosition();
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
	getRate = () => {
		this.props.client
			.query({
				query: this.GET_RATE_QUERY,
				variables: { Id: this.state.idCompany },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getbusinesscompanies != null) {
					this.setState({
						companyRate: data.data.getbusinesscompanies[0].Rate
					});
				} else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading Company Rate: getbusinesscompanies not exists in query data'
					);
				}
			})
			.catch((error) => {
				console.log('Error: Loading Company Rate: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading Company Rate: ' + error);
			});
	};
	cancelDepartmentHandler = () => {
		this.resetState();
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
			<div className="position_tab">
				{(this.state.loadingData || this.state.loadingDepartments) && <LinearProgress />}
				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingConfirm}
					content="Do you really want to continue whit this operation?"
				/>
				<div className="position__header">
					<button className="add-position" onClick={this.handleClickOpenModal}>
						{' '}
						Add Rates{' '}
					</button>
				</div>
				<Dialog
					fullScreen={fullScreen}
					open={this.state.openModal}
					onClose={this.cancelDepartmentHandler}
					aria-labelledby="responsive-dialog-title"
				>
					<DialogTitle style={{ padding: '0px' }}>
						<div className="card-form-header orange">
							{' '}
							{this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0 ? (
								'Edit  Position/Rate'
							) : (
								'Create Position/Rate'
							)}
						</div>
					</DialogTitle>
					<DialogContent style={{ minWidth: 550, padding: '0px' }}>
						<div className="card-form-body">
							<div className="card-form-row">
								<span className="input-label primary">Department</span>
								<SelectForm
									id="idDepartment"
									name="idDepartment"
									data={this.state.departments}
									update={(id) => {
										this.updateSelect(id, 'idDepartment');
									}}
									showNone={false}
									error={!this.state.idDepartmentValid}
									value={this.state.idDepartment}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Title</span>
								<InputForm
									id="position"
									name="position"
									maxLength="50"
									value={this.state.position}
									error={!this.state.positionValid}
									change={(value) => this.onChangeHandler(value, 'position')}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Pay Rate</span>

								<InputForm
									id="payrate"
									name="payrate"
									maxLength="10"
									error={!this.state.payrateValid}
									value={this.state.payrate}
									type="number"
									change={(text) => this.onNumberChangeHandler(text, 'payrate')}
								/>
							</div>

							<div className="card-form-row">
								<span className="input-label primary">Bill Rate</span>
								<InputForm
									id="billrate"
									name="billrate"
									maxLength="10"
									error={!this.state.billrateValid}
									value={this.state.billrate}
									type="number"
									change={(text) => this.onNumberChangeHandler(text, 'billrate')}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Shift</span>
								<SelectForm
									id="shift"
									name="shift"
									data={this.state.shifts}
									update={(id) => {
										this.updateSelect(id, 'shift');
									}}
									showNone={false}
									error={!this.state.shiftValid}
									value={this.state.shift}
								/>
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
											disabled={
												this.state.idToEdit != null &&
												this.state.idToEdit != '' &&
												this.state.idToEdit != 0 ? (
													!this.Login.AllowEdit
												) : (
													!this.Login.AllowInsert
												)
											}
											//disabled={this.state.loading}
											//	disabled={!this.state.formValid}
											variant="fab"
											color="primary"
											className={buttonClassname}
											onClick={this.addPositionHandler}
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
											//	disabled={this.state.loading || !this.state.enableCancelButton}
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
					</DialogActions>
				</Dialog>
				<div className={classes.container}>
					<div className={classes.divStyle}>
						<PositionsTable
							data={this.state.data}
							departments={this.state.departments}
							loading={this.state.loading}
							shifts={this.state.shifts}
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
							{this.props.valueTab < 3 ? 'Next' : 'Finish'}
						</span>
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}

PositionsCompanyForm.propTypes = {
	classes: PropTypes.object.isRequired,
	fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles)(withApollo(withMobileDialog()(PositionsCompanyForm)));
