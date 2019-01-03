import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import CatalogsTable from './CatalogsTable';
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

import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Select from '@material-ui/core/Select';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

import SelectForm from 'ui-components/SelectForm/SelectForm';
import InputForm from 'ui-components/InputForm/InputForm';
import withGlobalContent from 'Generic/Global';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';

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

class Catalogs extends React.Component {
	GET_PARENTS_QUERY = gql`
		query getparentcatalogitem($Id: Int, $Id_Catalog: Int) {
			getparentcatalogitem(IsActive: 1, Id_Catalog: $Id_Catalog, Id: $Id) {
				Id
				Name: DisplayLabel
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
				Name: Description
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
		idCatalog: '',
		name: '',
		displayLabel: '',
		description: '',
		value: '',

		idParentValid: true,

		nameValid: true,
		displayLabelValid: true,
		descriptionValid: true,

		idParentHasValue: false,
		nameHasValue: false,
		displayLabelHasValue: false,
		descriptionHasValue: false,
		valueHasValue: false,

		formValid: true,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false,

		loading: false,
		loadingConfirm: false,
		loadingData: false,
		loadingParents: false,
		loadingAllParents: false,
		loadingCatalogs: false,
		loadingConfirm: false,

		openModal: false,
		firstLoad: false,
		showCircularLoading: false
	};

	constructor(props) {
		super(props);
		this.state = {
			data: [],
			catalogs: [{ Id: 0, Code: 'Nothing', Description: 'Nothing' }],
			idCatalogFilter: 0,
			idCatalogHasValue: true,
			idCatalogValid: true,
			parents: [],
			allparents: [],

			loadingData: false,
			loadingCatalogs: false,
			loadingParents: false,
			loadingAllParents: false,
			idCompany: this.props.idCompany,
			indexView: 0, //Loading
			errorMessage: '',
			...this.DEFAULT_STATE
		};
		this.onEditHandler = this.onEditHandler.bind(this);
	}
	focusTextInput() {
		if (document.getElementById('name')) {
			document.getElementById('name').focus();
			document.getElementById('name').select();
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
	onChangeHandler(value, name) {
		this.setState({ [name]: value }, this.validateField(name, value));
	}
	onBlurHandler(e) {
		//const name = e.target.name;
		//const value = e.target.value;
		//this.setState({ [name]: value.trim() }, this.validateField(name, value));
	}
	updateSelect = (id, name) => {
		var parent = id;
		switch (id) {
			case 5: //City
				parent = 3; //State
				break;
			case 3: //State
				parent = 2; //Country
				break;
			case 2: //Country
				parent = -1; //No Parent
				break;
		}
		this.setState({ [name]: id }, this.validateField(name, id));
		if (name == 'idCatalogFilter') {
			this.loadCatalogsItems(id);
		}
		if (name == 'idCatalog') {
			this.loadParents(parent, 0, 0);
		}
	};

	onSelectChangeHandler(e) { }
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
	validateAllFields(func) {
		let idCatalogValid = this.state.idCatalog !== null && this.state.idCatalog !== 0 && this.state.idCatalog !== '';
		let idParentValid = this.state.idParent !== null && this.state.idParent !== -1 && this.state.idParent !== '';
		let nameValid = this.state.name.trim().length >= 1;
		let displayLabelValid = this.state.displayLabel.trim().length >= 1;
		let descriptionValid = this.state.description.trim().length >= 1;

		this.setState(
			{
				idCatalogValid,
				idParentValid,
				nameValid,
				displayLabelValid,
				descriptionValid
			},
			() => {
				this.validateForm(func);
			}
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
				nameValid = value.trim().length >= 1;
				nameHasValue = value != '';
				break;
			case 'displayLabel':
				displayLabelValid = value.trim().length >= 1;
				displayLabelHasValue = value != '';
				break;
			case 'description':
				descriptionValid = value.trim().length >= 1;
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

	validateForm(func = () => { }) {
		this.setState(
			{
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
			},
			func
		);
	}

	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteCatalogItem();
	};
	onEditHandler = ({ Id, Id_Catalog, Id_Parent, Name, DisplayLabel, Description, Value }) => {
		this.setState({ showCircularLoading: false }, () => {
			var parent = Id_Catalog;
			switch (Id_Catalog) {
				case 5: //City
					parent = 3; //State
					break;
				case 3: //State
					parent = 2; //Country
					break;
				case 2: //Country
					parent = -1; //No Parent
					break;
			}
			this.loadParents(parent, Id, Id_Parent, () => {
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

						buttonTitle: this.TITLE_EDIT,
						openModal: true
					},
					this.focusTextInput
				);
			});
		});
	};

	onDeleteHandler = (idSearch) => {
		this.setState({ idToDelete: idSearch, showCircularLoading: false, opendialog: true });
	};
	componentWillMount() {
		this.setState({ firstLoad: true }, () => {
			this.loadCatalogs(() => {
				this.setState({ indexView: 1, firstLoad: false });
			});
		});
	}

	loadCatalogs = (func = () => { }) => {
		this.setState({ loadingData: true }, () => {
			this.props.client
				.query({
					query: this.GET_CATALOGS_QUERY,
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					let idCatalog = data.data.getcatalog.length > 0 ? data.data.getcatalog[0].Id : 0;
					if (data.data.getcatalog != null) {
						this.setState(
							{
								catalogs: data.data.getcatalog.length > 0 ? data.data.getcatalog : this.state.catalogs,
								idCatalogFilter: idCatalog,

								loadingData: false,
								firstLoad: false
								//	idCatalogHasValue: data.data.getcatalog.length > 0 ? true : false,
								//	idCatalogValid: data.data.getcatalog.length > 0 ? true : false
							},
							() => {
								this.loadParents(idCatalog, 0, 0, () => {
									this.loadCatalogsItems(
										data.data.getcatalog.length > 0 ? data.data.getcatalog[0].Id : 0,
										() => {
											this.setState(
												{
													loadingData: false,
													firstLoad: false
												},
												() => {
													this.resetState(func());
												}
											);
										}
									);
								});
							}
						);
					} else {
						this.setState({
							loadingData: false,
							indexView: 2,
							errorMessage: 'Error: Loading catalogs: getcatalog not exists in query data',
							firstLoad: false
						});
					}
				})
				.catch((error) => {
					this.setState({
						loadingData: false,
						indexView: 2,
						errorMessage: 'Error: Loading catalogs: ' + error,
						firstLoad: false
					});
				});
		});
	};

	loadCatalogsItems = (idCatalog = 0, func = () => { }) => {
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
							data: data.data.getcatalogitem,
							firstLoad: false,
							loadingCatalogs: false
						},
						func
					);
				} else {
					this.setState({
						loadingCatalogs: false,
						indexView: 2,
						errorMessage: 'Error: Loading catalogs items: getcatalogitem not exists in query data',
						firstLoad: false
					});
				}
			})
			.catch((error) => {
				this.setState({
					loadingCatalogs: false,
					indexView: 2,
					errorMessage: 'Error: Loading catalogs items: ' + error,
					firstLoad: false
				});
			});
	};
	loadParents = (idCatalog = -1, id = 0, idParent = -1, func = () => { }) => {
		this.setState({ loadingParents: true });
		this.props.client
			.query({
				query: this.GET_PARENTS_QUERY,
				variables: { Id_Catalog: idCatalog, Id: id },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getparentcatalogitem != null) {
					this.setState(
						{
							parents: data.data.getparentcatalogitem,
							loadingParents: false,
							idParent: idParent,
							idParentHasValue: idParent > -1,
							idParentValid: idParent > -1,
							firstLoad: false
						},
						func
					);
				} else {
					this.setState({
						loadingParents: false,
						indexView: 2,
						errorMessage: 'Error: Loading parents: getparentcatalogitem not exists in query data',
						firstLoad: false
					});
				}
			})
			.catch((error) => {
				this.setState({
					loadingParents: false,
					indexView: 2,
					errorMessage: 'Error: Loading parents: ' + error,
					firstLoad: false
				});
			});
	};

	loadAllParents = (func = () => { }) => {
		this.setState({ loadingAllParents: true });
		this.props.client
			.query({
				query: this.GET_PARENTS_QUERY,
				variables: { Id_Catalog: null, Id: 0 },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getparentcatalogitem != null) {
					this.setState(
						{
							allparents: data.data.getparentcatalogitem,
							loadingAllParents: false,
							firstLoad: false
						},
						func
					);
				} else {
					this.setState({
						loadingAllParents: false,
						indexView: 2,
						errorMessage: 'Error: Loading all parents: getparentcatalogitem not exists in query data',
						firstLoad: false
					});
				}
			})
			.catch((error) => {
				this.setState({
					loadingAllParents: false,
					indexView: 2,
					errorMessage: 'Error: Loading all parents: ' + error,
					firstLoad: false
				});
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
						this.props.handleOpenSnackbar(
							'success',
							isEdition ? 'Catalog Item Updated!' : 'Catalog Item Inserted!'
						);
						this.setState(
							{
								openModal: false,
								showCircularLoading: true,
								loading: false
							},
							() => {
								this.loadCatalogsItems(this.state.idCatalog, () => {
									this.loadParents(this.state.idCatalog, 0, 0, () => {
										this.resetState();
									});
								});
							}
						);
					})
					.catch((error) => {
						this.props.handleOpenSnackbar(
							'error',
							isEdition
								? 'Error: Updating Catalog Item: ' + error
								: 'Error: Inserting Catalog Item: ' + error
						);
						this.setState({
							loading: false
						});
					});
			}
		);
	};
	deleteCatalogItem = () => {
		this.setState(
			{
				loadingConfirm: true,
				showCircularLoading: true
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
						this.props.handleOpenSnackbar('success', 'Catalog Item Deleted!');
						this.loadCatalogsItems(
							this.state.idCatalogFilter,
							this.resetState(() => {
								this.setState({ showCircularLoading: false });
							})
						);
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Deleting Catalog Item: ' + error);
						this.setState({
							loadingConfirm: false,
							showCircularLoading: false
						});
					});
			}
		);
	};

	addCatalogItemHandler = () => {
		console.log("Hola Milton")
		this.setState(
			{
				loading: true,
				openModal: true
			},
			() => {
				this.validateAllFields(() => {
					if (this.state.formValid) this.insertCatalogItem();
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

	cancelCatalogItemHandler = () => {
		this.resetState();
	};

	handleClickOpenModal = () => {
		this.setState({ openModal: true, idCatalog: this.state.idCatalogFilter }, () => {
			var parent = this.state.idCatalogFilter;
			switch (parent) {
				case 5: //City
					parent = 3; //State
					break;
				case 3: //State
					parent = 2; //Country
					break;
				case 2: //Country
					parent = -1; //No Parent
					break;
			}
			this.loadParents(parent, 0, 0);
		});
	};

	handleCloseModal = () => {
		this.setState({ openModal: false });
	};
	render() {
		const { loading } = this.state;
		const { classes } = this.props;
		const { fullScreen } = this.props;
		const isLoading =
			this.state.loadingData ||
			this.state.loadingParents ||
			this.state.loadingAllParents ||
			this.state.loadingCatalogs ||
			this.state.loadingConfirm ||
			this.state.showCircularLoading;

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
		return (
			<div className="catalog_tab">
				{isLoading && <LinearProgress />}

				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingConfirm}
					content="Do you really want to continue whit this operation?"
				/>

				<Dialog
					fullScreen={fullScreen}
					open={this.state.openModal}
					onClose={this.cancelCatalogItemHandler}
					aria-labelledby="responsive-dialog-title"
				>
					<DialogTitle id="responsive-dialog-title">
						<div className="card-form-header orange">
							{this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0 ? (
								'Edit  Catalog'
							) : (
									'Create Catalog'
								)}
						</div>
					</DialogTitle>

					<DialogContent style={{ width: 600 }}>
						<div className="card-form-body">
							<div className="card-form-row">
								<span className="input-label primary">* Catalog</span>
								<SelectForm
									id="idCatalog"
									name="idCatalog"
									data={this.state.catalogs}
									disabled={this.state.loadingCatalogs}
									update={(id) => {
										this.updateSelect(id, 'idCatalog');
									}}
									showNone={false}
									error={!this.state.idCatalogValid}
									value={this.state.idCatalog}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">* Name</span>
								<InputForm
									id="name"
									name="name"
									maxLength="150"
									error={!this.state.nameValid}
									value={this.state.name}
									change={(value) => this.onChangeHandler(value, 'name')}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">* Display Label</span>
								<InputForm
									id="displayLabel"
									name="displayLabel"
									maxLength="150"
									error={!this.state.displayLabelValid}
									value={this.state.displayLabel}
									change={(value) => this.onChangeHandler(value, 'displayLabel')}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">* Description</span>
								<InputForm
									id="description"
									name="description"
									maxLength="150"
									error={!this.state.descriptionValid}
									value={this.state.description}
									change={(value) => this.onChangeHandler(value, 'description')}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">* Parent</span>
								<SelectForm
									disabled={this.state.loadingParents}
									id="idParent"
									name="idParent"
									error={!this.state.idParentValid}
									value={this.state.idParent}
									data={this.state.parents}
									update={(id) => {
										this.updateSelect(id, 'idParent');
									}}
									showNone={true}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Value</span>
								<InputForm
									id="value"
									name="value"
									maxLength="500"
									value={this.state.value}
									change={(value) => this.onChangeHandler(value, 'value')}
								/>
							</div>
						</div>
					</DialogContent>
					<DialogActions style={{ margin: '16px 10px' }}>
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
											//	className={buttonClassname}
											onClick={this.addCatalogItemHandler}
										>
											<SaveIcon />
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
											variant="fab"
											color="secondary"
											//className={buttonClassname}
											onClick={this.cancelCatalogItemHandler}
										>
											<ClearIcon />
										</Button>
									</div>
								</Tooltip>
							</div>
						</div>
					</DialogActions>
				</Dialog>

				<div className="catalog__header">
					<div className="input-container-catalog">
						<span className="input-label-catalog">Filtro</span>

						<SelectForm
							id="idCatalogFilter"
							name="idCatalogFilter"
							data={this.state.catalogs}
							disabled={this.state.loadingCatalogs}
							update={(id) => {
								this.updateSelect(id, 'idCatalogFilter');
							}}
							showNone={false}
							//error={!this.state.idCatalogValid}
							value={this.state.idCatalogFilter}
						/>
					</div>
					<button className="add-catalog" onClick={this.handleClickOpenModal} disabled={isLoading}>
						{' '}
						Add Catalog{' '}
					</button>
				</div>

				<div className={classes.container}>
					<div className={classes.divStyle}>
						<CatalogsTable
							data={this.state.data}
							catalogs={this.state.catalogs}
							parents={this.state.parents}
							loading={this.state.showCircularLoading && isLoading}
							onEditHandler={this.onEditHandler}
							onDeleteHandler={this.onDeleteHandler}
						/>
					</div>
				</div>
			</div>
		);
	}
}

Catalogs.propTypes = {
	fullScreen: PropTypes.bool.isRequired,
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(withMobileDialog()(withGlobalContent(Catalogs))));
