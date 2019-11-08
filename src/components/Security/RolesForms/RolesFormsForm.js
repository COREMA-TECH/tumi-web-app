import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
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
import InputForm from 'ui-components/InputForm/InputForm';

import withGlobalContent from 'Generic/Global';
import RolesDropdown from "../DropdownForm/RolesDropdown";

import { GET_ROLES_QUERY } from './queries';
import { UPDATE_ROLES_QUERY, INSERT_ROLES_QUERY, DELETE_ROLES_QUERY } from './mutations';

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


	TITLE_ADD = 'Add Roles';
	TITLE_EDIT = 'Update Roles';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		description: '',

		descriptionValid: false,
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
		//this.setState({ [name]: value });
		this.setState({ [name]: value }, this.validateField(name, value));
	}
	onBlurHandler() {
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
		let descriptionHasValue = this.state.description.trim() != '';
		return descriptionHasValue;
	};
	validateAllFields() {
		let descriptionValid = this.state.description.trim().length >= 2;
		this.setState(
			{
				descriptionValid
			},
			this.validateForm
		);
	}
	validateField(fieldName, value) {
		let descriptionValid = this.state.descriptionValid;
		let descriptionHasValue = this.state.descriptionHasValue;

		switch (fieldName) {
			case 'description':
				descriptionValid = value.trim().length >= 2;
				descriptionHasValue = value.trim() != '';
				break;
			default:
				break;
		}
		this.setState(
			{
				descriptionValid,
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
	onEditHandler = ({ Id, Description }) => {
		this.setState(
			{
				idToEdit: Id,
				description: Description.trim(),
				formValid: true,
				descriptionValid: true,

				enableCancelButton: true,
				descriptionHasValue: true,

				buttonTitle: this.TITLE_EDIT
			});
	};

	onDeleteHandler = (idSearch) => {
		this.setState({ idToDelete: idSearch, opendialog: true });
	};
	componentWillMount() {
		this.loadRoles();
	}

	loadRoles = () => {
		this.props.client
			.query({
				query: GET_ROLES_QUERY,
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

	getObjectToInsertAndUpdate = () => {
		let query = INSERT_ROLES_QUERY;
		const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

		if (isEdition) {
			query = UPDATE_ROLES_QUERY;
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
								Description: `'${this.state.description}'`,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-08-14 16:10:25+00'",
								Date_Updated: "'2018-08-14 16:10:25+00'"
							}
						}
					})
					.then(() => {
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
	deleteRoles = () => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: DELETE_ROLES_QUERY,
						variables: {
							Id: this.state.idToDelete
						}
					})
					.then(() => {
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
				<div className="col-12">
					<div className="card w-100">	
						<div className="card-body">		
							<div className="row">
								<div className="col-md-3">
									<div className="input-group mb-2">									
										<input
											id="description"
											name="description"
											error={!this.state.descriptionValid}
											value={this.state.description}
											onBlur={(event) => this.onBlurHandler()}
											onChange={(event) => this.onChangeHandler(event)}
											type="text"
											placeholder="Description"
											className="form-control"
											style={{flexBasis: "200px"}}
										/>
									</div>							
								</div>
								<div className="col-md-2">
									<button
										className="btn btn-success"
										disabled={this.state.loading}
										onClick={this.addRolesHandler}
									>
										Save
									</button>
									{loading && <CircularProgress size={68} className={classes.fabProgress} />}
									<button
										className="btn btn-danger ml-1"
										disabled={this.state.loading || !this.state.enableCancelButton}
										onClick={this.cancelRolesHandler}
									>
										Cancel
									</button>								
								</div>							
							</div>											
						</div>				
					</div>
				</div>
				<div className={classes.divStyle}>
					<RolesDropdown
						data={this.state.data}
					/>
				</div>
			</div>
		);
	}
}

RolesForm.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(withGlobalContent(RolesForm)));
