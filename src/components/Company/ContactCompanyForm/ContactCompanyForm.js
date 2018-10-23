import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ContactsTable from './ContactsTable';
import gql from 'graphql-tag';
import green from '@material-ui/core/colors/green';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import { withApollo } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Tooltip from '@material-ui/core/Tooltip';
import InputForm from 'ui-components/InputForm/InputForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import ContactTypesData from '../../../data/contactTypes.json';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import InputMask from 'react-input-mask';
import 'ui-components/InputForm/index.css';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
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
	numberControl: {
		//width: '200px'
	},
	nameControl: {
		//width: '100px'
	},
	emailControl: {
		//width: '200px'
	},
	comboControl: {
		//width: '200px'
	},
	resize: {
		//width: '200px'
	},
	divStyle: {
		width: '95%',
		display: 'flex',
		justifyContent: 'space-around'
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

class ContactcontactForm extends React.Component {
	GET_CONTACTS_QUERY = gql`
		query getcontacts($IdEntity: Int) {
			getcontacts(IsActive: 1, Id_Entity: $IdEntity) {
				id: Id
				idSearch: Id
				firstname: First_Name
				middlename: Middle_Name
				lastname: Last_Name
				email: Electronic_Address
				number: Phone_Number
				title: Contact_Title
				idSupervisor: Id_Supervisor
				idDepartment: Id_Deparment
				type: Contact_Type
			}
		}
	`;
	GET_TYPES_QUERY = gql`
		{
			getcatalogitem(IsActive: 1, Id_Catalog: 6) {
				Id
				Name
				IsActive
			}
		}
	`;
	GET_SUPERVISORS_QUERY = gql`
		query getsupervisor($Id: Int, $Id_Entity: Int) {
			getsupervisor(IsActive: 1, Id_Entity: $Id_Entity, Id: $Id) {
				Id: Id
				Name: Full_Name
			}
		}
	`;
	GET_DEPARTMENTS_QUERY = gql`
		{
			getcatalogitem(IsActive: 1, Id_Catalog: 8) {
				Id
				Name: DisplayLabel
				IsActive
			}
		}
	`;
	INSERT_CONTACTS_QUERY = gql`
		mutation inscontacts($input: iParamC!) {
			inscontacts(input: $input) {
				Id
			}
		}
	`;

	UPDATE_CONTACTS_QUERY = gql`
		mutation updcontacts($input: iParamC!) {
			updcontacts(input: $input) {
				Id
			}
		}
	`;

	DELETE_CONTACTS_QUERY = gql`
		mutation delcontacts($Id: Int!) {
			delcontacts(Id: $Id, IsActive: 0) {
				Id
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

	TITLE_ADD = 'Add Contact';
	TITLE_EDIT = 'Update Contact';

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		firstname: '',
		middlename: '',
		lastname: '',
		email: '',
		number: '',
		title: '',
		idSupervisor: 0,
		idDepartment: 0,
		departmentName: '',
		titleName: '',
		type: 1,

		firstnameValid: true,
		middlenameValid: true,
		lastnameValid: true,
		emailValid: true,
		numberValid: true,
		//titleValid: true,
		typeValid: true,
		idDepartmentValid: true,
		departmentNameValid: true,
		titleNameValid: true,
		idSupervisorValid: true,

		firstnameHasValue: false,
		middlenameHasValue: false,
		lastnameHasValue: false,
		emailHasValue: false,
		numberHasValue: false,
		titleHasValue: false,
		typeHasValue: false,
		idSupervisorHasValue: false,
		idDepartmentHasValue: false,
		departmentNameHasValue: false,
		titleNameHasValue: false,

		formValid: true,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false,
		openSnackbar: true,
		loading: false,
		loadingConfirm: false,
		openModal: false,
		showCircularLoading: false,
		saving: false
	};

	constructor(props) {
		super(props);

		this.state = {
			data: [],
			idCompany: this.props.idCompany,
			titles: [ { Id: 0, Name: 'Nothing', Description: 'Nothing' } ],
			departments: [ { Id: 0, Name: 'Nothing', Description: 'Nothing' } ],
			supervisors: [],
			allSupervisors: [],
			inputEnabled: true,
			loadingData: false,
			loadingDepartments: false,
			loadingSupervisor: false,
			loadingAllSupervisors: false,
			loadingTitles: false,
			contactTypes: ContactTypesData,
			firstLoad: true,
			indexView: 0, //Loading
			errorMessage: '',
			activateTabs: true,

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
		if (document.getElementById('firstname') != null) {
			document.getElementById('firstname').focus();
			document.getElementById('firstname').select();
		}
	}

	componentDidMount() {
		this.resetState();
	}

	GENERATE_ID = () => {
		return '_' + Math.random().toString(36).substr(2, 9);
	};
	resetState = (func = () => {}) => {
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

	onFirstNameChangeHandler(value) {
		this.setState({ firstname: value }, this.validateField('firstname', value));
	}

	onMiddleNameChangeHandler(value) {
		this.setState({ middlename: value }, this.validateField('middlename', value));
	}

	onLastNameChangeHandler(value) {
		this.setState({ lastname: value }, this.validateField('lastname', value));
	}

	onEmailChangeHandler(value) {
		this.setState({ email: value }, this.validateField('email', value));
	}

	onNumberChangeHandler(value) {
		this.setState({ number: value }, this.validateField('number', value));
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
		let emailHasValue = this.state.email != '';
		let firstnameHasValue = this.state.firstname != '';
		let middlenameHasValue = this.state.middlename != '';
		let lastnameHasValue = this.state.lastname != '';
		let numberHasValue = this.state.number != '';
		let titleHasValue = this.state.title !== null && this.state.title !== 0 && this.state.title !== '';
		let typeHasValue = this.state.type !== null && this.state.type !== 0 && this.state.type !== '';
		let idDepartmentHasValue =
			this.state.idDepartment !== null && this.state.idDepartment !== 0 && !this.state.idDepartment !== '';
		let idSupervisorHasValue =
			this.state.idSupervisor !== null && this.state.idSupervisor !== -1 && this.state.idSupervisor !== '';
		return (
			emailHasValue ||
			firstnameHasValue ||
			middlenameHasValue ||
			lastnameHasValue ||
			numberHasValue ||
			titleHasValue ||
			idDepartmentHasValue ||
			idSupervisorHasValue ||
			typeHasValue
		);
	};

	validateAllFields(fun) {
		let emailValid = this.state.email.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
		let firstnameValid = this.state.firstname.trim().length >= 2;
		//let middlenameValid = this.state.middlename.trim().length >= 2;
		let lastnameValid = this.state.lastname.trim().length >= 2;
		let numberValid =
			this.state.number.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '')
				.length == 10; //this.state.number.trim().length >= 2;
		//let titleValid = this.state.title !== null && this.state.title !== 0 && this.state.title !== '';
		let typeValid = this.state.type !== null && this.state.type !== '';
		let idDepartmentValid =
			this.state.idDepartment !== null && this.state.idDepartment !== 0 && this.state.idDepartment !== '';
		let idSupervisorValid =
			this.state.idSupervisor !== null && this.state.idSupervisor !== -1 && this.state.idSupervisor !== '';
		let departmentNameValid = this.state.departmentName.trim().length >= 2;
		let titleNameValid = this.state.titleName.trim().length >= 2;

		this.setState(
			{
				emailValid,
				firstnameValid,
				//	middlenameValid,
				lastnameValid,
				numberValid,
				//titleValid,
				//idDepartmentValid,
				idSupervisorValid,
				typeValid,
				departmentNameValid,
				titleNameValid
			},
			() => {
				this.validateForm(fun);
			}
		);
	}

	validateField(fieldName, value) {
		let emailValid = this.state.emailValid;
		let firstnameValid = this.state.firstnameValid;
		//	let middlenameValid = this.state.middlenameValid;
		let lastnameValid = this.state.lastnameValid;
		let numberValid = this.state.numberValid;
		//let titleValid = this.state.titleValid;
		let typeValid = this.state.typeValid;
		let idDepartmentValid = this.state.idDepartmentValid;
		let departmentNameValid = this.state.departmentNameValid;
		let titleNameValid = this.state.titleNameValid;
		let idSupervisorValid = this.state.idSupervisorValid;

		let emailHasValue = this.state.emailHasValue;
		let firstnameHasValue = this.state.firstnameHasValue;
		let middlenameHasValue = this.state.middlenameHasValue;
		let lastnameHasValue = this.state.lastnameHasValue;
		let numberHasValue = this.state.numberHasValue;
		let titleHasValue = this.state.titleHasValue;
		let typeHasValue = this.state.typeHasValue;
		let idDepartmentHasValue = this.state.idDepartmentHasValue;
		let departmentNameHasValue = this.state.departmentName;
		let titleNameHasValue = this.state.titleName;
		let idSupervisorHasValue = this.state.idSupervisorHasValue;

		switch (fieldName) {
			case 'email':
				emailValid = value.trim().match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
				emailHasValue = value != '';
				break;
			case 'firstname':
				firstnameValid = value.trim().length >= 2;
				firstnameHasValue = value != '';
				break;
			case 'middlename':
				//	middlenameValid = value.trim().length >= 2;
				middlenameHasValue = value != '';
				break;
			case 'lastname':
				lastnameValid = value.trim().length >= 2;
				lastnameHasValue = value != '';
				break;
			case 'number':
				numberValid =
					value.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '')
						.length == 10;
				numberHasValue = value != '';
				break;
			/*case 'title':
                titleValid = value !== null && value !== 0 && value !== '';
                titleHasValue = value !== null && value !== 0 && value !== '';
                break;*/
			case 'type':
				typeValid = value !== null && value !== '';
				typeHasValue = value !== null && value !== '';
				break;
			case 'idDepartment':
				idDepartmentValid = value !== null && value !== 0 && value !== '';
				idDepartmentHasValue = value !== null && value !== 0 && value !== '';
				break;
			case 'departmentName':
				departmentNameValid = value.trim().length >= 2;
				departmentNameHasValue = value != '';
				break;
			case 'titleName':
				titleNameValid = value.trim().length >= 2;
				titleNameHasValue = value != '';
				break;
			case 'idSupervisor':
				idSupervisorValid = value !== null && value !== -1 && value !== '';
				idSupervisorHasValue = value !== null && value !== -1 && value !== '';
				break;
			default:
				break;
		}
		this.setState(
			{
				emailValid,
				firstnameValid,
				//	middlenameValid,
				lastnameValid,
				numberValid,
				//titleValid,
				typeValid,
				//idDepartmentValid,
				departmentNameValid,
				titleNameValid,
				idSupervisorValid,
				emailHasValue,
				firstnameHasValue,
				middlenameHasValue,
				lastnameHasValue,
				numberHasValue,
				titleHasValue,
				typeHasValue,
				idDepartmentHasValue,
				departmentNameHasValue,
				titleNameHasValue,
				idSupervisorHasValue
			},
			this.validateForm
		);
	}

	validateForm(func = () => {}) {
		this.setState(
			{
				formValid:
					this.state.emailValid &&
					this.state.firstnameValid &&
					//		this.state.middlenameValid &&
					this.state.lastnameValid &&
					this.state.numberValid &&
					//this.state.titleValid &&
					this.state.typeValid &&
					//this.state.idDepartmentValid &&
					this.state.departmentNameValid &&
					this.state.titleNameValid &&
					this.state.idSupervisorValid,
				enableCancelButton:
					this.state.emailHasValue ||
					this.state.firstnameHasValue ||
					this.state.middlenameHasValue ||
					this.state.lastnameHasValue ||
					this.state.numberHasValue ||
					this.state.titleHasValue ||
					this.state.typeHasValue ||
					//	this.state.idDepartmentHasValue ||
					this.state.departmentName ||
					this.state.titleName ||
					this.state.idSupervisorHasValue
			},
			func
		);
	}

	handleColseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteContacts();
	};

	onEditHandler = ({
		idSearch,
		idSupervisor,
		idDepartment,
		firstname,
		middlename,
		lastname,
		email,
		number,
		title,
		type
	}) => {
		this.setState({ showCircularLoading: false }, () => {
			var department = this.state.departments.find(function(obj) {
				return obj.Id === idDepartment;
			});
			var titleRecord = this.state.titles.find(function(obj) {
				return obj.Id === title;
			});

			this.loadSupervisors(idSearch, () => {
				this.setState(
					{
						idToEdit: idSearch,
						firstname: firstname.trim(),
						middlename: middlename.trim(),
						lastname: lastname.trim(),
						email: email.trim(),
						number: number.trim(),
						idSupervisor: idSupervisor,
						idDepartment: idDepartment,
						departmentName: department ? department.Name.trim() : '',
						titleName: titleRecord ? titleRecord.Name.trim() : '',
						title: title,
						type: type,
						formValid: true,
						emailValid: true,
						firstnameValid: true,
						//	middlenameValid: true,
						lastnameValid: true,
						//titleValid: true,
						typeValid: true,
						idDepartmentValid: true,
						departmentNameValid: true,
						titleNameValid: true,
						idSupervisorValid: true,
						enableCancelButton: true,
						emailHasValue: true,
						firstnameHasValue: true,
						middlenameHasValue: true,
						lastnameHasValue: true,
						titleHasValue: true,
						typeHasValue: true,
						idDepartmentHasValue: true,
						idSupervisorHasValue: true,
						departmentNameHasValue: true,
						titleNameHasValue: true,

						numberValid: true,
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
			this.loadContacts(() => {
				this.loadTitles(() => {
					this.loadDepartments(() => {
						this.loadSupervisors(0, () => {
							this.loadAllSupervisors(() => {
								this.setState({ indexView: 1, firstLoad: false });
							});
						});
					});
				});
			});
		});
	}

	getObjectToInsertAndUpdate = () => {
		let id = 0;
		let query = this.INSERT_CONTACTS_QUERY;
		const isEdition = this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0;

		if (isEdition) {
			query = this.UPDATE_CONTACTS_QUERY;
		}

		return { isEdition: isEdition, query: query, id: this.state.idToEdit };
	};
	loadContacts = (func = () => {}) => {
		this.setState({ loadingData: true }, () => {
			this.props.client
				.query({
					query: this.GET_CONTACTS_QUERY,
					variables: { IdEntity: this.state.idCompany },
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getcontacts != null) {
						this.setState(
							{
								data: data.data.getcontacts,
								loadingData: false
							},
							func
						);
					} else {
						this.setState({
							loadingData: false,
							firstLoad: false,
							indexView: 2,
							errorMessage: 'Error: Loading contacts: getcontacts not exists in query data'
						});
					}
				})
				.catch((error) => {
					this.setState({
						loadingData: false,
						firstLoad: false,
						indexView: 2,
						errorMessage: 'Error: Loading contacts: ' + error
					});
				});
		});
	};
	loadSupervisors = (idContact = 0, func = () => {}) => {
		this.setState({ loadingSupervisor: true }, () => {
			this.props.client
				.query({
					query: this.GET_SUPERVISORS_QUERY,
					variables: { Id_Entity: this.state.idCompany, Id: idContact },
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getsupervisor != null) {
						this.setState(
							{
								supervisors: data.data.getsupervisor,
								loadingSupervisor: false
							},
							func
						);
					} else {
						this.setState({
							loadingSupervisor: false,
							firstLoad: false,
							indexView: 2,
							errorMessage: 'Error: Loading supervisors: getsupervisor not exists in query data'
						});
					}
				})
				.catch((error) => {
					this.setState({
						loadingSupervisor: false,
						firstLoad: false,
						indexView: 2,
						errorMessage: 'Error: Loading supervisors: ' + error
					});
				});
		});
	};

	loadAllSupervisors = (func = () => {}) => {
		this.setState({ loadingAllSupervisors: true }, () => {
			this.props.client
				.query({
					query: this.GET_SUPERVISORS_QUERY,
					variables: { Id_Entity: this.state.idCompany, Id: 0 },
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getsupervisor != null) {
						this.setState(
							{
								allSupervisors: data.data.getsupervisor,
								loadingAllSupervisors: false
							},
							func
						);
					} else {
						this.setState({
							loadingAllSupervisors: false,
							firstLoad: false,
							indexView: 2,
							errorMessage: 'Error: Loading [all] supervisors: getsupervisor not exists in query data'
						});
					}
				})
				.catch((error) => {
					this.setState({
						loadingAllSupervisors: false,
						firstLoad: false,
						indexView: 2,
						errorMessage: 'Error: Loading [all] supervisors: ' + error
					});
				});
		});
	};

	loadTitles = (func = () => {}) => {
		this.setState({ loadingTitles: true }, () => {
			this.props.client
				.query({
					query: this.GET_TYPES_QUERY,
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getcatalogitem != null) {
						this.setState(
							{
								titles: data.data.getcatalogitem,
								loadingTitles: false
							},
							func
						);
					} else {
						this.setState({
							loadingTitles: false,
							firstLoad: false,
							indexView: 2,
							errorMessage: 'Error: Loading titles: getcatalogitem not exists in query data'
						});
					}
				})
				.catch((error) => {
					this.setState({
						loadingTitles: false,
						firstLoad: false,
						indexView: 2,
						errorMessage: 'Error: Loading titles: ' + error
					});
				});
		});
	};
	loadDepartments = (func = () => {}) => {
		this.setState({ loadingDepartments: true }, () => {
			this.props.client
				.query({
					query: this.GET_DEPARTMENTS_QUERY,
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getcatalogitem != null) {
						this.setState(
							{
								departments: data.data.getcatalogitem,
								loadingDepartments: false
							},
							func
						);
					} else {
						this.setState({
							loadingDepartments: false,
							firstLoad: false,
							indexView: 2,
							errorMessage: 'Error: Loading departments: getcatalogitem not exists in query data'
						});
					}
				})
				.catch((error) => {
					this.setState({
						loadingDepartments: false,
						firstLoad: false,
						indexView: 2,
						errorMessage: 'Error: Loading departments: ' + error
					});
				});
		});
	};

	insertContacts = (idDepartment, idTitle) => {
		const { isEdition, query, id } = this.getObjectToInsertAndUpdate();

		this.props.client
			.mutate({
				mutation: query,
				variables: {
					input: {
						Id: id,
						Id_Entity: this.props.idCompany,
						First_Name: `'${this.state.firstname}'`,
						Middle_Name: `'${this.state.middlename}'`,
						Last_Name: `'${this.state.lastname}'`,
						Electronic_Address: `'${this.state.email}'`,
						Phone_Number: `'${this.state.number}'`,
						//Contact_Title: this.state.title,
						Contact_Title: idTitle,
						Contact_Type: this.state.type,
						Id_Deparment: idDepartment,
						Id_Supervisor: this.state.idSupervisor,
						IsActive: 1,
						User_Created: 1,
						User_Updated: 1,
						Date_Created: "'2018-08-14 16:10:25+00'",
						Date_Updated: "'2018-08-14 16:10:25+00'"
					}
				}
			})
			.then((data) => {
				this.props.handleOpenSnackbar('success', isEdition ? 'Contact Updated!' : 'Contact Inserted!');
				this.setState({ openModal: false, loading: true, showCircularLoading: true }, () => {
					this.loadContacts(() => {
						this.loadDepartments(() => {
							this.loadTitles(() => {
								this.loadAllSupervisors(() => {
									this.loadSupervisors(0, () => {
										this.resetState();
									});
								});
							});
						});
					});
				});
			})
			.catch((error) => {
				this.props.handleOpenSnackbar(
					'error',
					isEdition ? 'Error: Updating Contact: ' + error : 'Error: Inserting Contact: ' + error
				);
				this.setState({
					saving: false
				});
				return false;
			});
	};

	insertDepartment = () => {
		var IdDeparment = 0,
			IdTitle = 0;

		var department = this.state.departments.find((obj) => {
			return obj.Name.trim().toLowerCase() === this.state.departmentName.trim().toLowerCase();
		});

		var title = this.state.titles.find((obj) => {
			return obj.Name.trim().toLowerCase() === this.state.titleName.trim().toLowerCase();
		});

		let insdepartmentAsync = async () => {
			if (department) {
				IdDeparment = department.Id;
			} else {
				//const InsertDepartmentNew =
				await this.props.client
					.mutate({
						mutation: this.INSERT_DEPARTMENTS_QUERY,
						variables: {
							input: {
								Id: 0,
								Id_Catalog: 8,
								Id_Parent: 0,
								Name: `'${this.state.departmentName}'`,
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
								Date_Updated: "'2018-09-20 08:10:25+00'"
							}
						}
					})
					.then((data) => {
						IdDeparment = data.data.inscatalogitem.Id;
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Inserting Department: ' + error);
						this.setState({
							saving: false
						});
						return false;
					});
			}

			if (title) {
				IdTitle = title.Id;
			} else {
				//const InsertDepartmentNew =
				await this.props.client
					.mutate({
						mutation: this.INSERT_DEPARTMENTS_QUERY,
						variables: {
							input: {
								Id: 0,
								Id_Catalog: 6,
								Id_Parent: 0,
								Name: `'${this.state.titleName}'`,
								DisplayLabel: `'${this.state.titleName}'`,
								Description: `'${this.state.titleName}'`,
								Value: null,
								Value01: null,
								Value02: null,
								Value03: null,
								Value04: null,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-09-20 08:10:25+00'",
								Date_Updated: "'2018-09-20 08:10:25+00'"
							}
						}
					})
					.then((data) => {
						IdTitle = data.data.inscatalogitem.Id;
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Inserting Title: ' + error);
						this.setState({
							saving: false
						});
						return false;
					});
			}

			this.insertContacts(IdDeparment, IdTitle);
		};

		insdepartmentAsync();
	};
	deleteContacts = (id) => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.DELETE_CONTACTS_QUERY,
						variables: {
							Id: this.state.idToDelete
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Contact Deleted!');

						this.setState({ opendialog: false, firstLoad: true, showCircularLoading: true }, () => {
							this.loadContacts(() => {
								this.loadTitles(() => {
									this.loadDepartments(() => {
										this.loadSupervisors(0, () => {
											this.loadAllSupervisors(() => {
												this.setState({
													indexView: 1,
													firstLoad: false,
													loadingConfirm: false
												});
											});
										});
									});
								});
							});
						});
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Deleting Contact: ' + error);
						this.setState({
							loadingConfirm: false
						});
					});
			}
		);
	};

	addContactHandler = () => {
		this.setState({ saving: true }, () => {
			this.validateAllFields(() => {
				if (this.state.formValid) this.insertDepartment();
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
		});
	};

	cancelContactHandler = () => {
		this.resetState(() => {
			this.loadAllSupervisors(this.loadSupervisors);
		});
	};
	handleClickOpenModal = () => {
		this.setState({ openModal: true });
	};
	handleCloseModal = () => {
		this.setState({ openModal: false });
	};
	updateSupervisor = (id) => {
		this.setState(
			{
				idSupervisor: id
			},
			() => {
				this.validateField('idSupervisor', id);
			}
		);
	};
	updateDepartment = (id) => {
		this.setState(
			{
				idDepartment: id
			},
			() => {
				this.validateField('idDepartment', id);
			}
		);
	};
	updateDepartmentName = (value) => {
		this.setState(
			{
				departmentName: value
			},
			() => {
				this.validateField('departmentName', value);
			}
		);
	};

	updateTitleName = (value) => {
		this.setState(
			{
				titleName: value
			},
			() => {
				this.validateField('titleName', value);
			}
		);
	};

	updateTitle = (id) => {
		this.setState(
			{
				title: id
			},
			() => {
				this.validateField('title', id);
			}
		);
	};
	updateType = (id) => {
		this.setState(
			{
				type: id
			},
			() => {
				this.validateField('type', id);
			}
		);
	};

	render() {
		const { loading } = this.state;
		const { classes } = this.props;
		const { fullScreen } = this.props;

		const isLoading =
			this.state.loadingData ||
			this.state.loadingDepartments ||
			this.state.loadingSupervisor ||
			this.state.loadingAllSupervisors ||
			this.state.loadingTitles ||
			this.state.loading ||
			this.state.firstLoad;

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
			<div className="TabSelected-container">
				{isLoading && <LinearProgress />}

				<AlertDialogSlide
					handleClose={this.handleColseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingConfirm}
					content="Do you really want to continue whit this operation?"
				/>
				<div className="row">
					<div className="col-md-12">
						<button className="btn btn-success float-right" onClick={this.handleClickOpenModal}>
							{' '}
							Add Contact{' '}
						</button>
					</div>
				</div>
				<Dialog
					fullScreen={fullScreen}
					open={this.state.openModal}
					onClose={this.cancelContactHandler}
					aria-labelledby="responsive-dialog-title"
					maxWidth="lg"
				>
					<DialogTitle style={{ padding: '0px' }}>
						<div className="modal-header">
							<h5 class="modal-title">
								{' '}
								{this.state.idToEdit != null &&
								this.state.idToEdit != '' &&
								this.state.idToEdit != 0 ? (
									'Edit  Contact'
								) : (
									'Create Contact'
								)}
							</h5>
						</div>
					</DialogTitle>
					<DialogContent style={{ minWidth: 600, padding: '0px' }}>
						<div className="container">
							<div className="">
								<div className="row">
									<div className="col-md-12 col-lg-6">
										<label>* Contact Type</label>
										<SelectForm
											id="type"
											name="type"
											data={this.state.contactTypes}
											update={this.updateType}
											showNone={false}
											//noneName="Employee"
											error={!this.state.typeValid}
											value={this.state.type}
										/>
									</div>
									<div className="col-md-12 col-lg-6">
										<label>* Department</label>
										<AutosuggestInput
											id="department"
											name="department"
											data={this.state.departments}
											error={!this.state.departmentNameValid}
											value={this.state.departmentName}
											onChange={this.updateDepartmentName}
											onSelect={this.updateDepartmentName}
										/>
									</div>
									<div className="col-md-12 col-lg-4">
										<label>* First Name</label>
										<InputForm
											id="firstname"
											name="firstname"
											maxLength="15"
											value={this.state.firstname}
											error={!this.state.firstnameValid}
											change={(value) => this.onFirstNameChangeHandler(value)}
										/>
									</div>
									<div className="col-md-12 col-lg-4">
										<label>Middle Name</label>
										<InputForm
											id="middlename"
											name="middlename"
											maxLength="15"
											//error={!this.state.middlenameValid}
											value={this.state.middlename}
											change={(value) => this.onMiddleNameChangeHandler(value)}
										/>
									</div>
									<div className="col-md-12 col-lg-4">
										<label>* Last Name</label>
										<InputForm
											id="lastname"
											name="lastname"
											maxLength="20"
											error={!this.state.lastnameValid}
											value={this.state.lastname}
											change={(value) => this.onLastNameChangeHandler(value)}
										/>
									</div>

									<div className="col-md-12 col-lg-4">
										<label>* Email</label>
										<InputForm
											id="email"
											name="email"
											maxLength="50"
											error={!this.state.emailValid}
											value={this.state.email}
											change={(value) => this.onEmailChangeHandler(value)}
										/>
									</div>
									<div className="col-md-12 col-lg-4">
										<label>* Phone Number</label>
										<InputMask
											id="number"
											name="number"
											mask="+(999) 999-9999"
											maskChar=" "
											value={this.state.number}
											className={
												this.state.numberValid ? 'form-control' : 'form-control _invalid'
											}
											onChange={(e) => {
												this.onNumberChangeHandler(e.target.value);
											}}
											placeholder="+(999) 999-9999"
										/>
									</div>
									<div className="col-md-12 col-lg-4">
										<label>* Contact Title</label>
										<AutosuggestInput
											id="title"
											name="title"
											data={this.state.titles}
											error={!this.state.titleNameValid}
											value={this.state.titleName}
											onChange={this.updateTitleName}
											onSelect={this.updateTitleName}
										/>
									</div>
								</div>
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
										<button
											disabled={isLoading || !this.Login.AllowEdit || !this.Login.AllowInsert}
											variant="fab"
											className="btn btn-success"
											onClick={this.addContactHandler}
										>
											Save {!this.state.saving && <i class="fas fa-save" />}
											{this.state.saving && <i class="fas fa-spinner fa-spin" />}
										</button>
									</div>
								</Tooltip>
							</div>
						</div>
						<div className={classes.root}>
							<div className={classes.wrapper}>
								<Tooltip title={'Cancel Operation'}>
									<div>
										<button
											//disabled={this.state.loading || !this.state.enableCancelButton}
											variant="fab"
											className="btn btn-danger"
											onClick={this.cancelContactHandler}
										>
											Cancel <i class="fas fa-ban" />
										</button>
									</div>
								</Tooltip>
							</div>
						</div>
					</DialogActions>
				</Dialog>
				<div className="row">
					<div className="col-md-12">
						<ContactsTable
							data={this.state.data}
							titles={this.state.titles}
							types={this.state.contactTypes}
							loading={this.state.showCircularLoading && isLoading}
							supervisors={this.state.allSupervisors}
							departments={this.state.departments}
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
							{this.props.valueTab < 2 ? 'Next' : 'Finish'}
						</span>
					</div>
				) : (
					''
				)}
			</div>
		);
	}
}

ContactcontactForm.propTypes = {
	classes: PropTypes.object.isRequired,
	fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles)(withApollo(withMobileDialog()(ContactcontactForm)));
