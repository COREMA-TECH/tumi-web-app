import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormsTable from './FormsTable';
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
import withGlobalContent from 'Generic/Global';
import Select from 'react-select';
import makeAnimated from "react-select/lib/animated";
import Switch from '@material-ui/core/Switch';

import { GET_FORMS_QUERY } from './queries';
import { INSERT_FORMS_QUERY, UPDATE_FORMS_QUERY } from './mutations';

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
	resizeCombo: {
		width: '200px',
		top: '15px'
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


	TITLE_ADD = 'Add Forms';
	TITLE_EDIT = 'Update Forms';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		code: '',
		name: '',
		value: '',
		sort: '',
		show: true,
		ParentId: null,
		parentName: '',

		codeValid: true,
		nameValid: true,

		codeHasValue: false,
		nameHasValue: false,
		valueHasValue: false,

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
			parents: [],

			//idCompany: this.props.idCompany,
			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);
	}
	focusTextInput() {
		// document.getElementById('code').focus();
		// document.getElementById('code').select();
	}
	componentDidMount() {
		this.resetState();
	}

	GENERATE_ID = () => {
		return '_' + Math.random().toString(36).substr(2, 9);
	};
	resetState = () => {
		this.setState(() => ({ ...this.DEFAULT_STATE }), this.focusTextInput);
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
		if (name === "sort" && value.length > 4) {
			return true;
		}
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
		this.deleteForm(this.state.idToDelete);
	};
	onEditHandler = ({ Id, Code, Name, Value, sort, ParentId, show }) => {
		this.setState(
			{
				idToEdit: Id,
				code: Code.trim(),
				name: Name.trim(),
				value: Value,
				sort,
				show,
				formValid: true,
				codeValid: true,
				nameValid: true,

				enableCancelButton: true,
				codeHasValue: true,
				nameHasValue: true,

				buttonTitle: this.TITLE_EDIT,
				ParentId,
				parentName: this.state.parents.find(_ => _.value == ParentId).label
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
	}

	loadForms = () => {
		this.props.client
			.query({
				query: GET_FORMS_QUERY,
				variables: {},
				fetchPolicy: 'no-cache'
			})
			.then(({ data: { forms } }) => {
				if (forms != null)
					this.setState(() => {
						let parents = [];
						parents = forms.map(_ => ({ value: _.Id, label: _.Name }));
						return { data: forms, parents: [{ value: 0, label: 'Parent' }, ...parents] }
					}, this.resetState);
				else this.props.handleOpenSnackbar('error', 'Error: Loading forms: getforms not exists in query data');
			})
			.catch((error) => {
				this.props.handleOpenSnackbar('error', 'Error: Loading forms: ' + error);
			});
	};

	getObjectToInsertAndUpdate = () => {
		let query = INSERT_FORMS_QUERY;
		const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

		if (isEdition) {
			query = UPDATE_FORMS_QUERY;
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
				let date = new Date();
				let input = {
					Code: this.state.code,
					Name: this.state.name,
					Value: this.state.value,
					sort: this.state.sort || 0,
					ParentId: this.state.ParentId || 0,
					show: this.state.show,
					IsActive: 1,
					User_Updated: localStorage.getItem('LoginId'),
					Date_Updated: date
				};

				if (!id)//New Record
					input = { ...input, User_Created: localStorage.getItem('LoginId'), Date_Created: date };
				else//Update Record
					input = { ...input, Id: id };
				this.props.client
					.mutate({
						mutation: query,
						variables: {
							input
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', isEdition ? 'Forms Updated!' : 'Forms Inserted!');
						this.loadForms();
					})
					.catch((error) => {
						this.props.handleOpenSnackbar(
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
	deleteForm = (id) => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: UPDATE_FORMS_QUERY,
						variables: {
							input: {
								Id: id,
								IsActive: 0
							}
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Form Deleted!');
						this.loadForms();
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Deleting Form: ' + error);
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

	cancelFormsHandler = () => {
		this.resetState();
	};

	updateParent = ({ value: id, label }) => {
		this.setState(() => ({ ParentId: id, parentName: label }));
	};

	getSelectedParent = () => {
		if (this.state.ParentId !== null)
			return { value: this.state.ParentId, label: this.state.parentName }
		return null;
	}

	handleShowChange = name => event => {
		let element = event.target;
		this.setState(() => ({ [name]: element.checked }));
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
					<FormControl className={[classes.formControl, classes.nameControl].join(' ')}>
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
					<FormControl className={[classes.formControl, classes.nameControl].join(' ')}>
						<InputLabel htmlFor="name">Name</InputLabel>
						<Input
							id="name"
							name="name"
							inputProps={{
								maxLength: 50,
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
					<FormControl className={[classes.formControl, classes.nameControl].join(' ')}>
						<InputLabel htmlFor="value">Value</InputLabel>
						<Input
							id="value"
							name="value"
							inputProps={{
								maxLength: 40,
								classes: {
									input: classes.valueControl
								}
							}}
							className={classes.resize}
							value={this.state.value}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
						/>
					</FormControl>
					<FormControl className={[classes.formControl, classes.nameControl].join(' ')}>
						<InputLabel htmlFor="sort">Sort</InputLabel>
						<Input
							type="number"
							id="sort"
							name="sort"
							value={this.state.sort}
							onBlur={(event) => this.onBlurHandler(event)}
							onChange={(event) => this.onChangeHandler(event)}
							className={classes.resize}
							inputProps={{
								max: 999,
								classes: {
									input: classes.valueControl
								}
							}}
						/>
					</FormControl>
					<FormControl className={[classes.formControl, classes.nameControl].join(' ')}>
						<InputLabel htmlFor="sort">Show In Menu</InputLabel>
						<Select
							options={this.state.parents}
							value={this.getSelectedParent()}
							onChange={this.updateParent}
							closeMenuOnSelect={true}
							components={makeAnimated()}
							isMulti={false}
							className={classes.resizeCombo}
							placeholder="Parent"

						/>
					</FormControl>
					<FormControl className={[classes.formControl, classes.nameControl].join(' ')}>
						<Switch
							name="show"
							checked={this.state.show}
							onChange={this.handleShowChange('show')}
							color="primary"
							inputProps={{ 'aria-label': 'primary checkbox' }}
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

export default withStyles(styles)(withApollo(withGlobalContent(FormsForm)));
