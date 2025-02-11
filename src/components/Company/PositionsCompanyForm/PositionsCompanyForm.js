import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import PositionsTable from './PositionsTable';
import green from '@material-ui/core/colors/green';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import { withApollo } from 'react-apollo';
import InputForm from 'ui-components/InputForm/InputForm';
import ShiftsData from '../../../data/shitfs.json';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import withGlobalContent from 'Generic/Global';
import './index.css';
import { Route } from 'react-router-dom';
import makeAnimated from 'react-select/lib/animated';
import Select from 'react-select';
import { GET_DEPARTMENTS_QUERY, GET_POSTIONS_QUERY, GET_RATE_QUERY, GET_POSITIONS_QUERY, GET_UNIQUEPOSITION_QUERY } from './queries';
import { INSERT_POSITION_QUERY, UPDATE_POSITION_QUERY, DELETE_POSITION_QUERY, INSERT_DEPARTMENTS_QUERY } from './mutations';

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

	TITLE_ADD = 'Add Position';
	TITLE_EDIT = 'Update Position';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		idDepartment: '',
		departmentName: '',
		position: '',
		billrate: 0,
		payrate: 0,
		shift: '',
		Comment: '',
		idDepartmentValid: true,
		departmentNameValid: true,
		positionValid: true,
		billrateValid: true,
		payrateValid: true,
		//shiftValid: true,

		idDepartmentHasValue: false,
		departmentNameHasValue: false,
		positionHasValue: false,
		billrateHasValue: false,
		payrateHasValue: false,
		//shiftHasValue: false,

		formValid: true,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false,
		openSnackbar: true,
		loading: false,
		loadingConfirm: false,
		openModal: false,
		showCircularLoading: false,
		saving: false,
		positionApplyingFor: 1,
		userId: localStorage.getItem('LoginId')
	};

	constructor(props) {
		super(props);

		this.state = {
			data: [],
			departments: [{ Id: 0, Code: 'Nothing', Description: 'Nothing' }],
			shifts: ShiftsData,

			idCompany: this.props.idCompany,
			idManagement: this.props.idManagement,
			companyRate: 0,
			inputEnabled: true,
			indexView: 0, //Loading
			errorMessage: '',
			firstLoad: true,

			...this.DEFAULT_STATE
		};

		this.onEditHandler = this.onEditHandler.bind(this);
		this.addPositionHandler = this.addPositionHandler.bind(this);

		this.Login = {
			LoginId: localStorage.getItem('LoginId'),
			IsAdmin: localStorage.getItem('IsAdmin'),
			AllowEdit: localStorage.getItem('AllowEdit') === 'true',
			AllowDelete: localStorage.getItem('AllowDelete') === 'true',
			AllowInsert: localStorage.getItem('AllowInsert') === 'true',
			AllowExport: localStorage.getItem('AllowExport') === 'true'
		};
	}

	handleChange = (event) => {
		const target = event.target;
		const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});


	};

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
	resetState = (func = () => { }) => {
		this.setState(
			{
				...this.DEFAULT_STATE
			},
			func
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

		//if (value == '') return;
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

	updateDepartmentName = ({ value }) => {
		this.setState(
			{
				departmentName: value
			},
			() => {
				this.validateField('departmentName', value);
			}
		);
	};

	enableCancelButton = () => {
		let positionHasValue = this.state.position != '';
		let billrateHasValue = this.state.billrate != 0;
		let payrateHasValue = this.state.payrate != 0;
		//let shiftHasValue = this.state.shift != '';
		let idDepartmentHasValue = this.state.idDepartment !== null && this.state.idDepartment !== '';

		return positionHasValue || billrateHasValue || payrateHasValue || idDepartmentHasValue;//|| shiftHasValue;
	};

	validateAllFields(func) {
		let positionValid = this.state.position.trim().length >= 0;
		let billrateValid = this.state.billrate != 0 && this.state.billrate != '';
		let payrateValid = this.state.payrate != 0 && this.state.payrate != '';
		//let shiftValid = this.state.shift != '';
		let departmentNameValid = this.state.departmentName.trim().length >= 2;
		let idDepartmentValid =
			this.state.idDepartment !== null && this.state.idDepartment !== 0 && this.state.idDepartment !== '';

		this.setState(
			{
				positionValid,
				billrateValid,
				payrateValid,
				//idDepartmentValid,
				//shiftValid,
				departmentNameValid
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
		//	let shiftValid = this.state.shiftValid;
		let departmentNameValid = this.state.departmentNameValid;

		let positionHasValue = this.state.postionHasValue;
		let payrateHasValue = this.state.payrateHasValue;
		let billrateHasValue = this.state.billrateHasValue;
		let idDepartmentHasValue = this.state.departmentHasValue;
		//	let shiftHasValue = this.state.shiftHasValue;
		let departmentNameHasValue = this.state.departmentName;

		switch (fieldName) {
			case 'position':
				positionValid = value.trim().length >= 0;
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
			case 'departmentName':
				departmentNameValid = value.trim().length >= 2;
				departmentNameHasValue = value != '';
				break;
			/*case 'shift':
				shiftValid = value != '';
				shiftHasValue = value != '';
				break;*/
			default:
				break;
		}
		this.setState(
			{
				positionValid,
				payrateValid,
				billrateValid,
				//	idDepartmentValid,
				//shiftValid,
				departmentNameValid,
				positionHasValue,
				payrateHasValue,
				billrateHasValue,
				idDepartmentHasValue,
				departmentNameHasValue,
				//shiftHasValue
			},
			this.validateForm
		);
	}

	validateForm(func = () => { }) {
		this.setState(
			{
				formValid:
					this.state.positionValid &&
					this.state.payrateValid &&
					this.state.billrateValid &&
					//	this.state.idDepartmentValid &&
					this.state.departmentNameValid,
				//this.state.shiftValid,
				enableCancelButton:
					this.state.positionHasValue ||
					this.state.payrateHasValue ||
					this.state.billrateHasValue ||
					//	this.state.idDepartmentHasValue ||
					this.state.departmentName
				//this.state.shiftHasValue
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
	onEditHandler = ({ Id, Position, Id_Department, Bill_Rate, Pay_Rate, Shift, Comment, Id_positionApplying, catalogItem_id }) => {
		this.setState({ showCircularLoading: false }, () => {
			var department = this.state.departments.find(function (obj) {
				return obj.Id === Id_Department;
			});
			this.setState(
				{
					idToEdit: Id,
					position: Position.trim(),
					idDepartment: Id_Department,
					positionApplyingFor: Id_positionApplying,
					departmentName: department ? department.Name.trim() : '',
					billrate: Bill_Rate,
					payrate: Pay_Rate,
					//shift: Shift,
					Comment: Comment,
					formValid: true,
					positionValid: true,
					idDepartmentValid: true,
					departmentNameValid: true,
					billrateValid: true,
					payrateValid: true,
					//shiftValid: true,

					enableCancelButton: true,
					positionHasValue: true,
					idDepartmentHasValue: true,
					billrateHasValue: true,
					payrateHasValue: true,
					//	shiftHasValue: true,
					departmentNameHasValue: true,
					buttonTitle: this.TITLE_EDIT,
					openModal: true,
					showCircularLoading: false,
					catalogItem_id: catalogItem_id
				},
				() => {
					this.focusTextInput();
				}
			);
		});
	};

	onDeleteHandler = (idSearch) => {
		this.setState({ idToDelete: idSearch, opendialog: true, showCircularLoading: false });
	};

	redirectToCreateContract = () => {
		this.props.history.push({
			pathname: '/home/contract/add',
			state: { contract: 0 }
		});
	};

	componentWillMount() {
		this.setState({ firstLoad: true }, () => {
			this.loadPositions(() => {
				this.loadDepartments(() => {
					this.setState({ indexView: 1, firstLoad: false });
				});
			});
		});
	}

	loadDepartments = (func = () => { }) => {
		this.setState({ loadingDepartments: true }, () => {
			this.props.client
				.query({
					query: GET_DEPARTMENTS_QUERY,
					variables: { Id_Entity: this.props.idCompany },
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getcatalogitem != null) {
						this.setState(
							{
								departments: data.data.getcatalogitem,
								loadingDepartments: false,
								indexView: 1
							},
							func
						);
					} else {
						this.setState({
							loadingDepartments: false,
							indexView: 2,
							firstLoad: false,
							errorMessage: 'Error: Loading departments: getcatalogitem not exists in query data'
						});
					}
				})
				.catch((error) => {
					this.setState({
						loadingDepartments: false,
						indexView: 2,
						firstLoad: false,
						errorMessage: 'Error: Loading departments: ' + error
					});
				});
		});
	};

	loadPositionRates = () => {
		this.setState({ loadingData: true }, () => {
			this.props.client
				.query({
					query: GET_POSITIONS_QUERY,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
					let dataAPI = data.getcatalogitem;
					let positionCatalogTag = [];

					dataAPI.map(item => {
						positionCatalogTag.push({
							value: item.Id, label: item.Description ? item.Description.trim() : '', key: item.Id
						})
					});

					this.setState(prevState => ({
						positionCatalog: positionCatalogTag,
						loadingData: false,
					}));
				})
				.catch((error) => {
					this.setState({
						loadingData: false,
						indexView: 2,
						firstLoad: false,
						errorMessage: 'Error: Loading positions and rates: ' + error
					});
				});
		});
	}

	loadPositions = (func = () => { }) => {
		this.setState({ loadingData: true }, () => {
			this.props.client
				.query({
					query: GET_POSTIONS_QUERY,
					variables: { Id_Entity: this.props.idCompany },
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
								this.getRate(this.resetState);
								this.loadPositionRates();
								func();
							}
						);

					} else {
						this.setState({
							loadingData: false,
							indexView: 2,
							firstLoad: false,
							errorMessage: 'Error: Loading positions and rates: getposition not exists in query data'
						});
					}
				})
				.catch((error) => {
					this.setState({
						loadingData: false,
						indexView: 2,
						firstLoad: false,
						errorMessage: 'Error: Loading positions and rates: ' + error
					});
				});
		});
	};

	getObjectToInsertAndUpdate = () => {
		let id = 0;
		let query = INSERT_POSITION_QUERY;
		const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

		if (isEdition) {
			query = UPDATE_POSITION_QUERY;
		}

		return { isEdition: isEdition, query: query, id: this.state.idToEdit };
	};


	insertPosition = (idDepartment) => {
		const { isEdition, query, id } = this.getObjectToInsertAndUpdate();
		this.props.client
			.mutate({
				mutation: query,
				variables: {
					input: {
						Id: id,
						Id_Entity: this.props.idCompany,
						Id_Contract: this.props.idContract,
						Id_Department: idDepartment,
						Id_positionApplying: this.state.positionApplyingFor,
						Position: `'${this.state.position}'`,
						Bill_Rate: this.state.billrate,
						Pay_Rate: this.state.payrate,
						Shift: `'A'`,
						Comment: `'${this.state.Comment}'`,
						IsActive: 1,
						User_Created: this.state.userId,
						User_Updated: this.state.userId,
						Date_Created: "'2018-08-14 16:10:25+00'",
						Date_Updated: "'2018-08-14 16:10:25+00'",
						catalogItem_id: this.state.catalogItem_id
					}
				}
			})
			.then((data) => {
				this.props.handleOpenSnackbar(
					'success',
					isEdition ? 'Positions and Rates Updated!' : 'Positions and Rates Inserted!'
				);

				this.setState({ showCircularLoading: true, loading: true, openModal: false }, () => {
					this.loadPositions(() => {
						this.loadDepartments(() => {
							this.resetState(() => {
								this.setState({ indexView: 1, showCircularLoading: false, loading: false });
							});
						});
					});
				});
			})
			.catch((error) => {
				this.props.handleOpenSnackbar(
					'error',
					isEdition
						? 'Error: Updating Positions and Rates: ' + error
						: 'Error: Inserting Positions and Rates: ' + error
				);
				this.setState({
					saving: false
				});
			});
	};
	insertDepartment = () => {
		var department = this.state.departments.find((obj) => {
			return obj.Name.trim().toLowerCase() === this.state.departmentName.trim().toLowerCase();
		});

		let insdepartmentAsync = async () => {
			if (department) {
				this.insertPosition(department.Id);
			} else {
				await this.props.client
					.mutate({
						mutation: INSERT_DEPARTMENTS_QUERY,
						variables: {
							input: {
								Id: 0,
								Id_Catalog: 8,
								Id_Parent: 0,

								Name: `''`,
								DisplayLabel: `'${this.state.departmentName}'`,
								Description: `'${this.state.departmentName}'`,
								Value: null,
								Value01: null,
								Value02: null,
								Value03: null,
								Value04: null,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-09-20 08:10:25+00'",
								Date_Updated: "'2018-09-20 08:10:25+00'",
								Id_Entity: this.props.idCompany
							}
						}
					})
					.then((data) => {
						this.insertPosition(data.data.inscatalogitem.Id);
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Inserting Department: ' + error);
						this.setState({
							saving: false
						});
					});
			}

		};

		insdepartmentAsync();
	};

	deletePostion = (id) => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: DELETE_POSITION_QUERY,
						variables: {
							Id: this.state.idToDelete
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Position and Rate Deleted!');
						this.setState({ opendialog: false, showCircularLoading: true, loadingConfirm: false }, () => {
							this.loadPositions(() => {
								this.loadDepartments(() => {
									this.setState({
										indexView: 1,
										showCircularLoading: false,
										loadingConfirm: false
									});
								});
							});
						});
					})
					.catch((error) => {
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
				saving: true
			},
			() => {
				this.validateAllFields(async () => {
					if (this.state.formValid) {
						this.validateUniquePosition(this.insertDepartment);
					}
					else {
						this.props.handleOpenSnackbar(
							'warning',
							'Error: Saving Information: You must fill all the required fields'
						);
						this.setState({
							saving: false
						});
					}
				});
			}
		);
	};
	getRate = (func = () => { }) => {
		this.props.client
			.query({
				query: GET_RATE_QUERY,
				variables: { Id: this.props.idCompany },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getbusinesscompanies != null) {
					this.setState({
						companyRate: data.data.getbusinesscompanies[0].Rate
					}),
						func;
				} else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading Company Rate: getbusinesscompanies not exists in query data'
					);
				}
			})
			.catch((error) => {
				this.props.handleOpenSnackbar('error', 'Error: Loading Company Rate: ' + error);
			});
	};

	validateUniquePosition = (callbackFunction = () => { }) => {
		this.props.client
			.query({
				query: GET_UNIQUEPOSITION_QUERY,
				variables: {
					Id_Entity: this.props.idCompany,
					Position: this.state.position.trim(),
					IdToExclude: this.state.idToEdit || 0
				},
				fetchPolicy: 'no-cache'
			})
			.then(({ data: { uniquePosition } }) => {
				if (uniquePosition) {
					this.props.handleOpenSnackbar("warning", "This Position already exists");
					this.setState(() => ({ saving: false }));
				}
				else callbackFunction();
			}).catch(error => {
				this.props.handleOpenSnackbar("error", "Error validating information");
				this.setState(() => ({ saving: false }));
			})
	};

	cancelDepartmentHandler = () => {
		this.setState({ firstLoad: true }, () => {
			this.resetState(() => {
				this.loadPositions(() => {
					this.loadDepartments(() => {
						this.setState({ indexView: 1, firstLoad: false });
					});
				});
			});
		});
	};

	handleChangePositionTag = (positionsTags) => {
		this.setState({ positionsTags, position: positionsTags.label, catalogItem_id: positionsTags.key, positionValid: true });
	};

	handleClickOpenModal = () => {
		this.setState({ openModal: true });
	};
	handleCloseModal = () => {
		this.setState({ openModal: false });
	};

	render() {
		const { loading } = this.state;
		const { classes } = this.props;
		const { fullScreen } = this.props;

		var isLoading =
			this.state.loadingData || this.state.loadingDepartments || this.state.firstLoad || this.state.loading;

		if (this.state.indexView == 0) {
			return <React.Fragment>{isLoading && <LinearProgress />}</React.Fragment>;
		}
		if (this.state.indexView == 2) {
			return (
				<React.Fragment>
					{isLoading && <LinearProgress />}
					<NothingToDisplay
						title="Oops!"
						message={this.state.errorMessage}
						type="Error-danger"
						icon="danger"
					/>)
				</React.Fragment>
			);
		}

		const selectDepartments = this.state.departments.map(item => {
			return { value: item.Name, label: item.Name }
		});

		return (
			<div className="position_tab">
				{isLoading && <LinearProgress />}
				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingConfirm}
					content="Do you really want to continue whit this operation?"
				/>
				<div className="row">
					<div className="col-md-12">
						{this.props.showStepper ? (
							<div className="advanced-tab-options">
								{localStorage.getItem('ShowMarkup') == 'true' ? (
									<div>
										{this.state.data.length > 0 ? (
											<Route
												render={({ history }) => (
													<button
														className="btn btn-info float-right add-contract-btn"
														onClick={() => {
															// When the user click Next button, open second tab
															let hrefValue = '/home/company/edit';

															if (this.props.href !== null) {
																hrefValue = this.props.href;
															}

															history.push({
																pathname: '/home/contract/add',
																state: {
																	contract: 0,
																	Id_Entity: this.props.idCompany,
																	Id_Parent: this.props.idManagement,
																	idContract: this.props.idContract,
																	href: hrefValue
																}
															});

														}}
													>
														{this.props.valueTab < 3 ? (
															'Next'
														) : (
																<React.Fragment>
																	Add Contract <i class="fas fa-file-contract ml-1" />
																</React.Fragment>
															)}
													</button>
												)}
											/>
										) : (
												''
											)}
									</div>
								) : ('')}
							</div>
						) : (
								''
							)}
						<button className="btn btn-success float-right add-rates-btn" onClick={this.handleClickOpenModal}>
							Add Rates<i class="fas fa-plus ml-1" />
						</button>
					</div>
				</div>
				<Dialog
					fullScreen={fullScreen}
					open={this.state.openModal}
					onClose={this.cancelDepartmentHandler}
					aria-labelledby="responsive-dialog-title"
				>
					<DialogTitle style={{ padding: '0px' }}>
						<div className="modal-header">
							{' '}
							{this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0 ? (
								'Edit  Position/Rate'
							) : (
									<h5 className="modal-title">Create Position/Rate</h5>
								)}
						</div>
					</DialogTitle>
					<DialogContent style={{ minWidth: 550, overflowY: 'unset' }}>
						<div className="row">
							<div className="col-md-12 col-lg-6">
								<label>* Department</label>
								<Select
									options={selectDepartments}
									value={{ value: this.state.departmentName, label: this.state.departmentName }}
									onChange={this.updateDepartmentName}
									closeMenuOnSelect={true}
									components={makeAnimated()}
									isMulti={false}
								/>
							</div>

							<div className="col-md-12 col-lg-6">
								<label>* Title</label>
								<Select
									options={this.state.positionCatalog}
									value={{ value: this.state.catalogItem_id, label: this.state.position }}
									onChange={this.handleChangePositionTag}
									closeMenuOnSelect={true}
									components={makeAnimated()}
								/>
							</div>
							{this.props.showPayRate && (
								<div className="col-md-12 col-lg-6">
									<label>* Pay Rate</label>
									<InputForm
										id="payrate"
										name="payrate"
										maxLength="10"
										error={!this.state.payrateValid}
										value={this.state.payrate}
										placeholder={"$"}
										type="number"
										step="0.01"
										allowZero={true}
										change={(text) => this.onNumberChangeHandler(text, 'payrate')}
									/>
								</div>
							)}
							{localStorage.getItem('ShowMarkup') == 'true' ?
								<div className="col-md-12 col-lg-6">
									<label>* Bill Rate</label>
									<InputForm
										id="billrate"
										name="billrate"
										maxLength="10"
										error={!this.state.billrateValid}
										value={this.state.billrate}
										type="number"
										step="0.01"
										placeholder={"$"}
										allowZero={true}
										change={(text) => this.onNumberChangeHandler(text, 'billrate')}
									/>
								</div>
								: ''}
							<div className="col-md-12 col-lg-12">
								<label htmlFor="">Special Comments</label>
								<textarea
									onChange={this.handleChange}
									name="Comment"
									className="form-control"
									id=""
									cols="30"
									rows="5"
									value={this.state.Comment}
									maxLength="255"
								/>
							</div>
						</div>
					</DialogContent>
					<DialogActions style={{ margin: '20px 20px' }}>
						<div className="row">
							<div className="col-12">
								<button
									// disabled={isLoading || !this.Login.AllowEdit || !this.Login.AllowInsert}
									variant="fab"
									onClick={this.addPositionHandler}
									className="btn btn-success tumi-button float-right"
								>
									Save {!this.state.saving && <i class="fas fa-save ml-1" />}
									{this.state.saving && <i class="fas fa-spinner fa-spin ml-1" />}
								</button>

								<button
									//	disabled={this.state.loading || !this.state.enableCancelButton}
									variant="fab"
									onClick={this.cancelDepartmentHandler}
									className="btn btn-danger tumi-button float-right"
								>
									Cancel <i class="fas fa-ban" />
								</button>
							</div>
						</div>
					</DialogActions>
				</Dialog>
				<div className="row">
					<div className="col-md-12">
						<div className="card">
							<div className="card-body p-3 tumi-forcedResponsiveTable">
								<PositionsTable
									data={this.state.data}
									departments={this.state.departments}
									loading={this.state.showCircularLoading && isLoading}
									shifts={this.state.shifts}
									onEditHandler={this.onEditHandler}
									onDeleteHandler={this.onDeleteHandler}
									showPayRate={this.props.showPayRate}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

PositionsCompanyForm.propTypes = {
	classes: PropTypes.object.isRequired,
	fullScreen: PropTypes.bool.isRequired
};

//export default withStyles(styles)(withApollo(withMobileDialog()(PositionsCompanyForm)));
export default withStyles(styles)(withApollo(withGlobalContent(PositionsCompanyForm)));
