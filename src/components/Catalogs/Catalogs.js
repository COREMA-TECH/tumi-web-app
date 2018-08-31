import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CatalogsTable from './CatalogsTable';
import gql from 'graphql-tag';
import green from '@material-ui/core/colors/green';
import AlertDialogSlide from '../Generic/AlertDialogSlide';
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
import { Snackbar } from '@material-ui/core';
import { MySnackbarContentWrapper } from '../Generic/SnackBar';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';

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
	parentControl: { width: '200px', paddingRight: '0px' },
	catalogControl: { width: '200px', paddingRight: '0px' },
	nameControl: {
		width: '150px'
	},
	displayLabelControl: {
		width: '150px'
	},
	descriptionControl: {
		width: '200px'
	},
	valueControl: { width: '100px' },

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

class Catalogs extends React.Component {
	GET_PARENTS_QUERY = gql`
		query getparentcatalogitem($Id: Int, $Id_Catalog: Int) {
			getparentcatalogitem(IsActive: 1, Id_Catalog: $Id_Catalog, Id: $Id) {
				Id
				Name
				DisplayLabel
			}
		}
	`;
	GET_CATALOGS_QUERY = gql`
		{
			getcatalog(IsActive: 1) {
				Id
				Id_Company
				Code
				Description
				IsActive
			}
		}
	`;
	GET_CATALOG_ITEMS_QUERY = gql`
		query getcatalogitem($Id_Catalog: Int) {
			getcatalogitem(IsActive: 1, Id_Catalog: $Id_Catalog) {
				Id
				Id_Catalog
				Id_Parent
				Name
				DisplayLabel
				Description
				Value
				Value01
				Value02
				Value03
				Value04
			}
		}
	`;
	INSERT_CATALOG_ITEM_QUERY = gql`
		mutation inscatalogitem($input: iParamCI!) {
			inscatalogitem(input: $input) {
				Id
			}
		}
	`;

	UPDATE_CATALOG_ITEM_QUERY = gql`
		mutation updcatalogitem($input: iParamCI!) {
			updcatalogitem(input: $input) {
				Id
			}
		}
	`;

	DELETE_CATALOG_ITEM_QUERY = gql`
		mutation delcatalogitem($Id: Int!) {
			delcatalogitem(Id: $Id, IsActive: 0) {
				Id
			}
		}
	`;

	TITLE_ADD = 'Add Catalog Item';
	TITLE_EDIT = 'Update Catalog Item';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,

		idParent: '',
		name: '',
		displayLabel: '',
		description: '',
		value: '',

		idParentValid: false,
		nameValid: false,
		displayLabelValid: false,
		descriptionValid: false,

		idParentHasValue: false,
		nameHasValue: false,
		displayLabelHasValue: false,
		descriptionHasValue: false,
		valueHasValue: false,

		formValid: false,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false,

		loading: false,
		success: false,
		loadingConfirm: false
	};

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			catalogs: [ { Id: 0, Code: 'Nothing', Description: 'Nothing' } ],
			idCatalog: 0,
			idCatalogHasValue: true,
			idCatalogValid: true,
			parents: [],
			allparents: [],
			openSnackbar: false,
			variantSnackbar: '',
			messageSnackbar: '',
			loadingData: true,
			loadingCatalogs: true,
			loadingParents: true,
			loadingAllParents: true,
			idCompany: this.props.idCompany,

			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);
	}
	focusTextInput() {
		document.getElementById('name').focus();
		document.getElementById('name').select();
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
				this.loadAllParents();
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
		if (name == 'idCatalog') {
			this.loadParents(value, 0), this.loadCatalogsItems(value);
		}
	}
	enableCancelButton = () => {
		let idCatalogHasValue = this.state.idCatalog !== null && this.state.idCatalog !== '';
		let nameHasValue = this.state.name != '';
		let displayLabelHasValue = this.state.displayLabel != '';
		let descriptionHasValue = this.state.description != '';
		let valueHasValue = this.state.value != '';
		let idParentHasValue = this.state.idParent !== null && this.state.idParent !== '';

		return (
			idCatalogHasValue ||
			nameHasValue ||
			displayLabelHasValue ||
			descriptionHasValue ||
			valueHasValue ||
			idParentHasValue
		);
	};
	validateAllFields() {
		let idCatalogValid = this.state.idCatalog !== null && this.state.idCatalog !== 0 && this.state.idCatalog !== '';
		let idParentValid = this.state.idParent !== null && this.state.idParent !== -1 && this.state.idParent !== '';
		let nameValid = this.state.name.trim().length >= 2;
		let displayLabelValid = this.state.displayLabel.trim().length >= 2;
		let descriptionValid = this.state.description.trim().length >= 2;

		this.setState(
			{
				idCatalogValid,
				idParentValid,
				nameValid,
				displayLabelValid,
				descriptionValid
			},
			this.validateForm
		);
	}
	validateField(fieldName, value) {
		let idCatalogValid = this.state.idCatalogValid;
		let idParentValid = this.state.idParentValid;
		let nameValid = this.state.nameValid;
		let displayLabelValid = this.state.displayLabelValid;
		let descriptionValid = this.state.descriptionValid;

		let idCatalogHasValue = this.state.idCatalogHasValue;
		let idParentHasValue = this.state.idParentHasValue;
		let nameHasValue = this.state.nameHasValue;
		let displayLabelHasValue = this.state.displayLabelHasValue;
		let descriptionHasValue = this.state.descriptionHasValue;
		let valueHasValue = this.state.valueHasValue;

		switch (fieldName) {
			case 'idCatalog':
				idCatalogValid = value !== null && value !== 0 && value !== '';
				idCatalogHasValue = value !== null && value !== '';
				break;
			case 'idParent':
				idParentValid = value !== null && value !== -1 && value !== '';
				idParentHasValue = value !== null && value !== -1 && value !== '';
				break;
			case 'name':
				nameValid = value.trim().length >= 2;
				nameHasValue = value != '';
				break;
			case 'displayLabel':
				displayLabelValid = value.trim().length >= 2;
				displayLabelHasValue = value != '';
				break;
			case 'description':
				descriptionValid = value.trim().length >= 2;
				descriptionHasValue = value != '';
				break;
			case 'value':
				valueHasValue = value != '';
				break;
			default:
				break;
		}
		this.setState(
			{
				idCatalogValid,
				idParentValid,
				nameValid,
				displayLabelValid,
				descriptionValid,

				idCatalogHasValue,
				idParentHasValue,
				nameHasValue,
				displayLabelHasValue,
				descriptionHasValue,
				valueHasValue
			},
			this.validateForm
		);
	}

	validateForm() {
		this.setState({
			formValid:
				this.state.idCatalogValid &&
				this.state.idParentValid &&
				this.state.nameValid &&
				this.state.displayLabelValid &&
				this.state.descriptionValid,
			enableCancelButton:
				this.state.idCatalogHasValue ||
				this.state.idParentHasValue ||
				this.state.nameHasValue ||
				this.state.displayLabelHasValue ||
				this.state.descriptionHasValue ||
				this.state.valueHasValue
		});
	}

	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteCatalogItem();
	};
	onEditHandler = ({ Id, Id_Catalog, Id_Parent, Name, DisplayLabel, Description, Value }) => {
		console.log(Id_Parent);
		this.setState(
			{
				idToEdit: Id,
				idCatalog: Id_Catalog,
				idParent: Id_Parent,
				name: Name.trim(),
				displayLabel: DisplayLabel.trim(),
				description: Description.trim(),
				value: Value == null ? '' : Value.trim(),

				formValid: true,
				idCatalogValid: true,
				idParentValid: true,
				nameValid: true,
				displayLabelValid: true,
				descriptionValid: true,

				enableCancelButton: true,
				idCatalogHasValue: true,
				idParentHasValue: true,
				nameHasValue: true,
				displayHasValue: true,
				descriptionHasValue: true,
				valueHasValue: true,

				buttonTitle: this.TITLE_EDIT
			},
			() => {
				this.loadParents(Id_Catalog, Id, Id_Parent);
				this.focusTextInput();
			}
		);
	};

	onDeleteHandler = (idSearch) => {
		this.setState({ idToDelete: idSearch, opendialog: true });
	};
	componentWillMount() {
		this.loadCatalogs();
		this.loadCatalogsItems();
		this.loadAllParents();
	}

	loadCatalogs = () => {
		this.setState({ loadingData: true });
		this.props.client
			.query({
				query: this.GET_CATALOGS_QUERY,
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				console.log(data.data.getcatalog.length > 0 ? data.data.getcatalog[0].Id : 0);
				let idCatalog = data.data.getcatalog.length > 0 ? data.data.getcatalog[0].Id : 0;
				if (data.data.getcatalog != null) {
					this.setState(
						{
							catalogs: data.data.getcatalog.length > 0 ? data.data.getcatalog : this.state.catalogs,
							idCatalog: idCatalog,
							idCatalogHasValue: data.data.getcatalog.length > 0 ? true : false,
							idCatalogValid: data.data.getcatalog.length > 0 ? true : false
						},
						() => {
							this.loadParents(idCatalog);
							this.loadCatalogsItems(data.data.getcatalog.length > 0 ? data.data.getcatalog[0].Id : 0);
							this.setState({ loadingData: false }, this.resetState());
						}
					);
				} else {
					this.handleOpenSnackbar('error', 'Error: Loading catalogs: getcatalog not exists in query data');
					this.setState({ loadingData: false });
				}
			})
			.catch((error) => {
				console.log('Error: Loading catalogs: ', error);
				this.handleOpenSnackbar('error', 'Error: Loading catalogs: ' + error);
				this.setState({ loadingData: false });
			});
	};

	loadCatalogsItems = (idCatalog = 0) => {
		console.log(idCatalog);
		this.setState({ loadingCatalogs: true });
		this.props.client
			.query({
				query: this.GET_CATALOG_ITEMS_QUERY,
				variables: { Id_Catalog: idCatalog },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcatalogitem != null) {
					this.setState(
						{
							data: data.data.getcatalogitem
						},
						() => {
							this.setState({ loadingCatalogs: false }, this.resetState());
						}
					);
				} else {
					this.handleOpenSnackbar(
						'error',
						'Error: Loading catalogs items: getcatalogitem not exists in query data'
					);
					this.setState({ loadingCatalogs: false });
				}
			})
			.catch((error) => {
				console.log('Error: Loading catalogs items: ', error);
				this.handleOpenSnackbar('error', 'Error: Loading catalogs items: ' + error);
				this.setState({ loadingCatalogs: false });
			});
	};
	loadParents = (idCatalog = -1, id = 0, idParent = -1) => {
		this.setState({ loadingParents: true });
		this.props.client
			.query({
				query: this.GET_PARENTS_QUERY,
				variables: { Id_Catalog: idCatalog, Id: id },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				console.log(data.data.getparentcatalogitem);
				if (data.data.getparentcatalogitem != null) {
					this.setState({
						parents: data.data.getparentcatalogitem,
						loadingParents: false,
						idParent: idParent,
						idParentHasValue: idParent > -1,
						idParentValid: idParent > -1
					});
				} else {
					this.handleOpenSnackbar(
						'error',
						'Error: Loading parents: getparentcatalogitem not exists in query data'
					);
					this.setState({ loadingParents: false });
				}
			})
			.catch((error) => {
				console.log('Error: Loading parents: ', error);
				this.handleOpenSnackbar('error', 'Error: Loading parents: ' + error);
				this.setState({ loadingParents: false });
			});
	};

	loadAllParents = () => {
		this.setState({ loadingAllParents: true });
		this.props.client
			.query({
				query: this.GET_PARENTS_QUERY,
				variables: { Id_Catalog: null, Id: 0 },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getparentcatalogitem != null) {
					this.setState({
						allparents: data.data.getparentcatalogitem,
						loadingAllParents: false
					});
				} else {
					this.handleOpenSnackbar(
						'error',
						'Error: Loading all parents: getparentcatalogitem not exists in query data'
					);
					this.setState({ loadingAllParents: false });
				}
			})
			.catch((error) => {
				console.log('Error: Loading all parents: ', error);
				this.handleOpenSnackbar('error', 'Error: Loading all parents: ' + error);
				this.setState({ loadingAllParents: false });
			});
	};

	getObjectToInsertAndUpdate = () => {
		let id = 0;
		let query = this.INSERT_CATALOG_ITEM_QUERY;
		const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

		if (isEdition) {
			query = this.UPDATE_CATALOG_ITEM_QUERY;
		}

		return { isEdition: isEdition, query: query, id: this.state.idToEdit };
	};
	insertCatalogItem = () => {
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
								Id_Catalog: this.state.idCatalog,
								Id_Parent: this.state.idParent,
								Name: `'${this.state.name}'`,
								DisplayLabel: `'${this.state.displayLabel}'`,
								Description: `'${this.state.description}'`,
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
						this.handleOpenSnackbar(
							'success',
							isEdition ? 'Catalog Item Updated!' : 'Catalog Item Inserted!'
						);
						this.loadCatalogsItems(this.state.idCatalog);
						this.resetState();
					})
					.catch((error) => {
						console.log(
							isEdition ? 'Error: Updating Catalog Item: ' : 'Error: Inserting Catalog Item: ',
							error
						);
						this.handleOpenSnackbar(
							'error',
							isEdition
								? 'Error: Updating Catalog Item: ' + error
								: 'Error: Inserting Catalog Item: ' + error
						);
						this.setState({
							success: false,
							loading: false
						});
					});
			}
		);
	};
	deleteCatalogItem = () => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.DELETE_CATALOG_ITEM_QUERY,
						variables: {
							Id: this.state.idToDelete
						}
					})
					.then((data) => {
						this.handleOpenSnackbar('success', 'Catalog Item Deleted!');
						this.loadCatalogsItems(this.state.idCatalog);
						this.resetState();
					})
					.catch((error) => {
						console.log('Error: Deleting Catalog Item: ', error);
						this.handleOpenSnackbar('error', 'Error: Deleting Catalog Item: ' + error);
						this.setState({
							loadingConfirm: false
						});
					});
			}
		);
	};

	addCatalogItemHandler = () => {
		this.setState(
			{
				success: false,
				loading: true
			},
			() => {
				this.validateAllFields();
				if (this.state.formValid) this.insertCatalogItem();
				else {
					this.handleOpenSnackbar('error', 'Error: Saving Information: You must fill all the required fields');
					this.setState({
						loading: false
					});
				}
			}
		);
	};

	cancelCatalogItemHandler = () => {
		this.resetState();
	};
	handleOpenSnackbar = (variant, message) => {
		this.setState({
			openSnackbar: true,
			variantSnackbar: variant,
			messageSnackbar: message
		});
	};
	handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ openSnackbar: false });
	};
	render() {
		const { loading, success } = this.state;
		const { classes } = this.props;

		const buttonClassname = classNames({
			[classes.buttonSuccess]: success
		});

		return (
			<React.Fragment>
				{(this.state.loadingData ||
					this.state.loadingParents ||
					this.state.loadingAllParents ||
					this.state.loadingCatalogs) && <LinearProgress />}
				<div className={classes.container}>
					<AlertDialogSlide
						handleClose={this.handleCloseAlertDialog}
						handleConfirm={this.handleConfirmAlertDialog}
						open={this.state.opendialog}
						loadingConfirm={this.state.loadingConfirm}
						content="Do you really want to continue whit this operation?"
					/>
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
					<div className={classes.divStyle}>
						<FormControl
							className={[ classes.formControl, classes.catalogControl ].join(' ')}
							disabled={this.state.loadingCatalogs}
						>
							<TextField
								id="idCatalog"
								disabled={this.state.loadingCatalogs}
								select
								name="idCatalog"
								error={!this.state.idCatalogValid}
								value={this.state.idCatalog}
								InputProps={{
									classes: {
										input: classes.catalogControl
									}
								}}
								onChange={(event) => this.onSelectChangeHandler(event)}
								helperText="Catalog"
								margin="normal"
							>
								{this.state.catalogs.map(({ Id, Description }) => (
									<MenuItem key={Id} value={Id} name={Description}>
										{Description}
									</MenuItem>
								))}
							</TextField>
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
						<FormControl className={[ classes.formControl, classes.displayLabelControl ].join(' ')}>
							<InputLabel htmlFor="displayLabel">Display Label</InputLabel>
							<Input
								id="displayLabel"
								name="displayLabel"
								inputProps={{
									maxLength: 15,
									classes: {
										input: classes.displayLabelControl
									}
								}}
								className={classes.resize}
								error={!this.state.displayLabelValid}
								value={this.state.displayLabel}
								onBlur={(event) => this.onBlurHandler(event)}
								onChange={(event) => this.onChangeHandler(event)}
							/>
						</FormControl>
						<FormControl className={[ classes.formControl, classes.descriptionControl ].join(' ')}>
							<InputLabel htmlFor="description">Description</InputLabel>
							<Input
								id="description"
								name="description"
								inputProps={{
									maxLength: 25,
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
						<FormControl
							className={[ classes.formControl, classes.parentControl ].join(' ')}
							disabled={this.state.loadingParents}
						>
							<TextField
								disabled={this.state.loadingParents}
								id="idParent"
								select
								name="idParent"
								error={!this.state.idParentValid}
								value={this.state.idParent}
								InputProps={{
									classes: {
										input: classes.parentControl
									}
								}}
								onChange={(event) => this.onSelectChangeHandler(event)}
								helperText="Parent"
								margin="normal"
							>
								{' '}
								<MenuItem key={0} value={0} name="None">
									<em>None</em>
								</MenuItem>
								{this.state.parents.map(({ Id, DisplayLabel }) => (
									<MenuItem key={Id} value={Id} name={DisplayLabel}>
										{DisplayLabel}
									</MenuItem>
								))}
							</TextField>
						</FormControl>
						<FormControl className={[ classes.formControl, classes.valueControl ].join(' ')}>
							<InputLabel htmlFor="value">Value</InputLabel>
							<Input
								id="value"
								name="value"
								inputProps={{
									maxLength: 25,
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
											onClick={this.addCatalogItemHandler}
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
											onClick={this.cancelCatalogItemHandler}
										>
											<ClearIcon />
										</Button>
									</div>
								</Tooltip>
							</div>
						</div>
					</div>
					<div className={classes.divStyle}>
						<CatalogsTable
							data={this.state.data}
							catalogs={this.state.catalogs}
							parents={this.state.allparents}
							loading={this.state.loading}
							onEditHandler={this.onEditHandler}
							onDeleteHandler={this.onDeleteHandler}
						/>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

Catalogs.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(Catalogs));
