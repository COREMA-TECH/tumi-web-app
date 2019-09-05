import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DepartmentsTable from './DepartmentsTable';
import gql from 'graphql-tag';
import green from '@material-ui/core/colors/green';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import { withApollo } from 'react-apollo';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import InputForm from 'ui-components/InputForm/InputForm';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';

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
		width: '95%',
		display: 'flex'
		//justifyContent: 'space-around'
	},
	input: {
		display: 'none'
	},
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
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
		query getcatalogitem ($Id_Entity:Int, $Name: String){
			catalogitem(IsActive: 1, Id_Catalog: 8,  Id_Entity:$Id_Entity, Name: $Name) {
				Id
				Code: Name
				Description
				IsActive
			}
		}
	`;
	GET_DEPARTMENT_BY_CODE_QUERY = gql`
		query getcatalogitem($Id: Int, $Name: String, $Id_Entity: Int) {
			uniquecatalogitem(IsActive: 1, Id_Catalog: 8, Id: $Id,Name: $Name, Id_Entity: $Id_Entity) {
				Id
				Code: Name
				DisplayLabel
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

		codeValid: true,
		descriptionValid: true,

		codeHasValue: true,
		descriptionHasValue: true,

		formValid: true,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false,
		openSnackbar: true,
		loading: false,
		success: false,
		loadingConfirm: false,
		showCircularLoading: false
	};

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			idCompany: this.props.idCompany,
			inputEnabled: true,
			loadingData: false,
			indexView: 0, //Loading
			errorMessage: '',
			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);

		this.Login = {
			LoginId: localStorage.getItem('LoginId'),
			IsAdmin: localStorage.getItem('IsAdmin'),
			AllowEdit: localStorage.getItem('AllowEdit') === 'true',
			AllowDelete: localStorage.getItem('AllowDelete') === 'true',
			AllowInsert: localStorage.getItem('AllowInsert') === 'true',
			AllowExport: localStorage.getItem('AllowExport') === 'true'
		};
	}

	focusTextInput() {
		if (document.getElementById('code') != null) {
			document.getElementById('code').focus();
			document.getElementById('code').select();
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

	onCodeChangeHandler(value) {
		this.setState({ code: value }, this.validateField('code', value));
	}

	onDescriptionChangeHandler(value) {
		this.setState({ description: value }, this.validateField('description', value));
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

	validateAllFields(func) {
		let codeValid = this.state.code.trim().length >= 2;
		let descriptionValid = this.state.description.trim().length >= 2;
		this.setState(
			{
				codeValid,
				descriptionValid
			},
			() => {
				this.validateForm(func);
			}
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

	validateForm(func = () => { }) {
		this.setState(
			{
				formValid: this.state.codeValid && this.state.descriptionValid,
				enableCancelButton: this.state.codeHasValue || this.state.descriptionHasValue
			},
			func
		);
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

				buttonTitle: this.TITLE_EDIT,
				showCircularLoading: false
			},
			() => {
				this.focusTextInput();
			}
		);
	};

	onDeleteHandler = (idSearch) => {
		this.setState({ idToDelete: idSearch, opendialog: true, showCircularLoading: false });
	};

	componentWillMount() {
		this.loadDepartments();
	}

	loadDepartments = (func = () => { }) => {
		this.setState({ loadingData: true }, () => {
			this.props.client
				.query({
					query: this.GET_DEPARTMENTS_QUERY,
					variables: { Id_Entity: this.state.idCompany },
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.catalogitem != null) {
						this.setState(
							{
								data: data.data.catalogitem,
								loadingData: false,
								indexView: 1
							},
							() => {
								this.resetState();
							}
						);
					} else {
						this.setState({
							loadingData: false,
							indexView: 2,
							errorMessage: 'Error: Loading departments: catalogitem not exists in query data'
						});
					}
				})
				.catch((error) => {
					this.setState({
						loadingData: false,
						indexView: 2,
						errorMessage: 'Error: Loading departments: ' + error
					});
				});
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
								Value: `' '`,
								Value01: `' '`,
								Value02: `' '`,
								Value03: `' '`,
								Value04: `' '`,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-08-14 16:10:25+00'",
								Date_Updated: "'2018-08-14 16:10:25+00'",
								Id_Entity: this.props.idCompany
							}
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar(
							'success',
							isEdition ? 'Department Updated!' : 'Department Inserted!'
						);
						this.setState({ showCircularLoading: true }, () => {
							this.loadDepartments();
						});
					})
					.catch((error) => {
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
						this.setState({ showCircularLoading: true }, () => {
							this.loadDepartments();
						});
					})
					.catch((error) => {
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
				loading: true
			},
			() => {
				this.validateAllFields(() => {
					if (this.state.formValid)
						this.validateDepartmentCode(this.insertDepartment);
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

	cancelDepartmentHandler = () => {
		this.resetState();
	};

	validateDepartmentCode = (execMutation = () => { }) => {
		this.props.client
			.query({
				query: this.GET_DEPARTMENT_BY_CODE_QUERY,
				variables: { Name: this.state.code, Id: this.state.idToEdit, Id_Entity: this.props.idCompany },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.uniquecatalogitem.length > 0) {
					this.setState(() => ({ loading: false }));
					this.props.handleOpenSnackbar(
						'warning',
						'This department is duplicated'
					);
				}
				else
					execMutation();
			})
			.catch((error) => {
				this.setState(() => ({ loading: false }));
				this.props.handleOpenSnackbar(
					'warning',
					'Error validating code'
				);
			});
	};

	render() {
		const { loading } = this.state;
		const { classes } = this.props;
		const isEdititing = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;
		if (this.state.indexView == 0) {
			return <React.Fragment>{this.state.loadingData && <LinearProgress />}</React.Fragment>;
		}
		if (this.state.indexView == 2) {
			return (
				<React.Fragment>
					{this.state.loadingData && <LinearProgress />}
					<NothingToDisplay
						title="Oops!"
						message={this.state.errorMessage}
						type="Error-danger"
						icon="danger"
					/>)
				</React.Fragment>
			);
		}
		return (
			<div className="department_tab">
				{this.state.loadingData && <LinearProgress />}
				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingConfirm}
					content="Do you really want to continue whit this operation?"
				/>
				<div className="row">
					<div className="col-md-4 offset-md-4 col-xl-2 offset-xl-8 mb-2">
						<InputForm
							id="code"
							name="code"
							maxLength="10"
							error={!this.state.codeValid}
							value={this.state.code}
							change={(value) => this.onCodeChangeHandler(value)}
							className="input-enable"
							placeholder="* Department Code"
						/>
					</div>
					<div className="col-md-4 col-xl-2 mb-2">
						<InputForm
							id="description"
							name="description"
							maxLength="50"
							error={!this.state.descriptionValid}
							value={this.state.description}
							change={(value) => this.onDescriptionChangeHandler(value)}
							placeholder="* Department Name"
						/>
					</div>	
					<div className="col-md-12">
						<div className="Filter-buttons">
							<button
								disabled={this.state.loading || !this.Login.AllowEdit || !this.Login.AllowInsert}
								className="btn btn-success Filter-button"
								onClick={this.addDepartmenttHandler}
							>
								{isEdititing ? 'Save' : 'Add'}
								{isEdititing && !loading && <i class="fas fa-save ml-1" />}
								{!isEdititing && !loading && <i class="fas fa-plus ml-1" />}
								{loading && <i class="fas fa-spinner fa-spin ml-1" />}
							</button>

							<button
								disabled={this.state.loading}
								onClick={this.cancelDepartmentHandler}
								className="btn btn-danger Filter-button"
							>
								Clear<i class="fas fa-ban ml-1" />
							</button>						
						</div>		
					</div>				
				</div>							
				<div className="row">
					<div className="col-md-12">
						<DepartmentsTable
							data={this.state.data}
							loading={this.state.showCircularLoading && this.state.loadingData}
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

DepartmentsCompanyForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(DepartmentsCompanyForm));
