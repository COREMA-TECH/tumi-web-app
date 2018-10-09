import React, { Component } from 'react';
import './index.css';
import InputForm from 'ui-components/InputForm/InputForm';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TabsInDialog from '../TabsInDialog/TabsInDialog';
import PropTypes from 'prop-types';
import DialogTitle from '@material-ui/core/DialogTitle';
import { gql } from 'apollo-boost';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import days from '../../../data/days.json';
import withApollo from 'react-apollo/withApollo';
import InputDateForm from 'ui-components/InputForm/InputDateForm';
import FileUpload from 'ui-components/FileUpload/FileUpload';
import InputMask from 'react-input-mask';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import 'ui-components/InputForm/index.css';
import Slide from '@material-ui/core/Slide/Slide';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';

const styles = (theme) => ({
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},
	buttonSuccess: {
		background: ' #3da2c7',
		borderRadius: '5px',
		padding: '.5em 1em',

		fontWeight: '300',
		fontFamily: 'Segoe UI',
		fontSize: '1.1em',
		color: '#fff',
		textTransform: 'none',
		//cursor: pointer;
		margin: '2px',

		//	backgroundColor: '#357a38',
		color: 'white',
		'&:hover': {
			background: ' #3da2c7'
		}
	},

	buttonProgress: {
		//color: ,
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	}
});

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class GeneralInformation extends Component {
	DEFAULT_STATUS = {
		codeValid: true,
		addressValid: true,
		nameValid: true,
		descriptionValid: true,
		startWeekValid: true,
		endWeekValid: true,
		countryValid: true,
		stateValid: true,
		rateValid: true,
		zipCodeValid: true,
		cityValid: true,
		suiteValid: true,
		phoneNumberValid: true,
		faxValid: true,
		startDateValid: true,
		formValid: true
	};
	/**
     *  QUERIES to get the countries, cities and states
     */
	GET_COUNTRIES_QUERY = gql`
		{
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: null, Id_Catalog: 2) {
				Id
				Name
				IsActive
			}
		}
	`;

	GET_STATES_QUERY = gql`
		query States($parent: Int!) {
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
				Id
				Name
				IsActive
			}
		}
	`;

	GET_CITIES_QUERY = gql`
		query Cities($parent: Int!) {
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 5) {
				Id
				Name
				IsActive
			}
		}
	`;
	/**
     *  End of the countries, cities and states queries
     */

	/*****************************************************************
     *             QUERY to get the company information              *
     ****************************************************************/
	GET_COMPANY_QUERY = gql`
		query getCompany($id: Int!) {
			getbusinesscompanies(Id: $id, IsActive: 1, Contract_Status: "'C'", Id_Parent: null) {
				Id
				Code
				Code01
				Id_Company
				BusinessType
				Name
				Other_Name
				Other01_Name
				Rooms
				Description
				Start_Week
				End_Week
				Start_Date
				Legal_Name
				Country
				State
				Zipcode
				Fax
				City
				Id_Parent
				IsActive
				User_Created
				User_Updated
				Date_Created
				Date_Updated
				ImageURL
				Rate
				Location
				Location01
				Primary_Email
				Phone_Number
				Suite
			}
		}
	`;

	loadCompany = (func = () => { }) => {
		this.setState(
			{
				loading: true
			},
			() => {
				this.props.client
					.query({
						query: this.GET_COMPANY_QUERY,
						variables: { id: this.props.idCompany },
						fetchPolicy: 'no-cache'
					})
					.then((data) => {
						if (data.data.getbusinesscompanies != null) {
							var item = data.data.getbusinesscompanies[0];

							this.setState(
								{
									name: item.Name.trim(),
									legalName: item.Legal_Name.trim(),
									description: item.Description.trim(),
									startWeek: item.Start_Week,
									endWeek: item.End_Week,
									address: item.Location.trim(),
									optionalAddress: item.Location01.trim(),
									otherName: item.Other_Name ? item.Other_Name.trim() : '',
									otherName1: item.Other01_Name ? item.Other01_Name.trim() : '',
									rooms: item.Rooms ? item.Rooms.toString().trim() : '',
									country: item.Country,
									state: item.State,
									city: item.City,
									Id_Parent: item.Id_Parent,
									rate: item.Rate,
									email: item.Primary_Email.trim(),
									phoneNumber: item.Phone_Number.trim(),

									Code: item.Code.trim(),
									Code01: item.Code01.trim(),
									zipCode: item.Zipcode,
									fax: item.Fax,
									startDate: item.Start_Date.trim(),
									active: item.IsActive,
									suite: item.Suite ? item.Suite.trim() : '',
									indexView: 1,
									...this.DEFAULT_STATUS,
									loading: false
								},
								func
							);
						} else {
							this.setState({
								loading: false,
								indexView: 2,
								errorMessage:
									'Error: Loading company information: getbusinesscompanies not exists in query data',
								firstLoad: false
							});
						}
					})
					.catch((error) => {
						this.setState({
							loading: false,
							indexView: 2,
							errorMessage: 'Error: Loading company information: ' + error,
							firstLoad: false
						});
					});
			}
		);
	};

	loadCompanyProperties = (func = () => { }) => {
		this.setState(
			{
				loadingCompanyProperties: true
			},
			() => {
				this.props.client
					.query({
						query: this.GET_COMPANY_PROPERTY_QUERY,
						variables: { Id_Parent: parseInt(this.props.idCompany == 0 ? -1 : this.props.idCompany) },
						fetchPolicy: 'no-cache'
					})
					.then((data) => {
						if (data.data.getbusinesscompanies != null) {
							this.setState(
								{
									companyProperties: data.data.getbusinesscompanies,
									loadingCompanyProperties: false,
									indexView: 1
								},
								func
							);
						} else {
							this.setState({
								loadingCompanyProperties: false,
								loading: false,
								indexView: 2,
								errorMessage:
									'Error: Loading company properties: getbusinesscompanies not exists in query data',
								firstLoad: false
							});
						}
					})
					.catch((error) => {
						this.setState({
							loadingCompanyProperties: false,
							loading: false,
							indexView: 2,
							errorMessage: 'Error: Loading company properties: ' + error,
							firstLoad: false
						});
					});
			}
		);
	};

	/**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION *
     **********************************************************/
	ADD_COMPANY_QUERY = gql`
		mutation insertCompanies($input: iParamBC!) {
			insbusinesscompanies(input: $input) {
				Id
				Name
				Description
			}
		}
	`;

	GET_COMPANY_PROPERTY_QUERY = gql`
		query getCompany($Id_Parent: Int!) {
			getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: "'C'", Id_Parent: $Id_Parent) {
				Id
				Code
				Code01
				Id_Company
				BusinessType
				Name
				Description
				Start_Week
				End_Week
				Start_Date
				Legal_Name
				Country
				State
				Zipcode
				Fax
				City
				Id_Parent
				IsActive
				User_Created
				User_Updated
				Date_Created
				Date_Updated
				ImageURL
				Rate
				Location
				Location01
				Primary_Email
				Phone_Number
				Suite
			}
		}
	`;

	insertCompany = () => {
		this.setState({ loadingUpdate: true }, () => {
			this.validateAllFields(() => {
				if (!this.state.formValid) {
					this.props.handleOpenSnackbar(
						'warning',
						'Error: Saving Information: You must fill all the required fields'
					);
					this.setState({ loadingUpdate: false });
					return true;
				}
				//Create the mutation using apollo global client
				this.props.client
					.mutate({
						// Pass the mutation structure
						mutation: this.ADD_COMPANY_QUERY,
						variables: {
							input: {
								Id: 0,
								Other_Name: `'${this.state.otherName}'`,
								Other01_Name: `'${this.state.otherName1}'`,
								Rooms: 0,
								Code: `'${this.state.Code}'`,
								Code01: `'${this.state.Code}'`,
								Id_Contract: 1,
								Id_Company: 1,
								BusinessType: 1,
								Location: `'${this.state.address}'`,
								Location01: `'${this.state.optionalAddress}'`,
								Name: `'${this.state.name}'`,
								Description: `'${this.state.description}'`,
								Start_Week: this.state.startWeek,
								End_Week: this.state.endWeek,
								Legal_Name: `'${this.state.legalName}'`,
								Country: parseInt(this.state.country),
								State: parseInt(this.state.state),
								Rate: parseFloat(this.state.rate),
								Zipcode: parseInt(this.state.zipCode),
								Fax: `'${this.state.fax}'`,
								Primary_Email: `'correo@gmail.com'`,
								Phone_Number: `'${this.state.phoneNumber}'`,
								Phone_Prefix: "''", //`'${this.state.phonePrefix}'`,
								City: 0,
								Id_Parent: this.state.idCompany == 0 ? 0 : this.state.Id_Parent,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-08-14'",
								Date_Updated: "'2018-08-14'",
								ImageURL: `'${this.state.avatar}'`,
								Start_Date: `'2018-08-14'`,
								Contract_URL: `'${this.state.contractURL}'`,
								Insurace_URL: `'${this.state.insuranceURL}'`,
								Other_URL: `'${this.state.otherURL}'`,
								Other01_URL: `'${this.state.other01URL}'`,
								Suite: `'${this.state.suite}'`,
								Contract_Status: "'C'"
							}
						}
					})
					.then((data) => {
						var id = data.data.insbusinesscompanies.Id;
						this.props.updateCompany(id);
						this.setState({ loadingUpdate: false });
						this.props.handleOpenSnackbar('success', 'General Information Inserted!');
						// When the user click Next button, open second tab
						this.props.toggleStepper();
						this.props.next();
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Inserting General Information: ' + error);
						this.setState({
							loadingUpdate: false
						});
					});
			});
		});
	};
	/**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION  *
     **********************************************************/

	/**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION *
     **********************************************************/
	UPDATE_COMPANY = gql`
		mutation updateCompanies($input: iParamBC!) {
			updbusinesscompanies(input: $input) {
				Id
				Name
				Description
			}
		}
	`;

	updateCompany = (companyId) => {
		this.setState({ loadingUpdate: true }, () => {
			this.validateAllFields(() => {
				if (!this.state.formValid) {
					this.props.handleOpenSnackbar(
						'warning',
						'Error: Saving Information: You must fill all the required fields'
					);
					this.setState({ loadingUpdate: false });
					return true;
				}

				//Create the mutation using apollo global client
				this.props.client
					.mutate({
						// Pass the mutation structure
						mutation: this.UPDATE_COMPANY,
						variables: {
							input: {
								Id: companyId,
								Other_Name: `'${this.state.otherName}'`,
								Other01_Name: `'${this.state.otherName1}'`,
								Rooms: 0,
								Code: `'${this.state.Code}'`,
								Code01: `'${this.state.Code}'`,
								Id_Contract: 1,
								Id_Company: 1,
								BusinessType: 1,
								Location: `'${this.state.address}'`,
								Location01: `'${this.state.optionalAddress}'`,
								Name: `'${this.state.name}'`,
								Description: `'${this.state.description}'`,
								Start_Week: this.state.startWeek,
								End_Week: this.state.endWeek,
								Legal_Name: `'${this.state.legalName}'`,
								Country: parseInt(this.state.country),
								State: parseInt(this.state.state),
								Rate: parseFloat(this.state.rate),
								Zipcode: parseInt(this.state.zipCode),
								Fax: `'${this.state.fax}'`,
								//Primary_Email: `'${this.state.email}'`,
								Primary_Email: `'coreo@gmail.com'`,
								Phone_Number: `'${this.state.phoneNumber}'`,
								Phone_Prefix: "''", //`'${this.state.phonePrefix}'`,
								City: 0,
								Id_Parent: parseInt(this.state.Id_Parent),
								IsActive: parseInt(this.state.active),
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-08-14'",
								Date_Updated: "'2018-08-14'",
								ImageURL: `'${this.state.avatar}'`,
								Start_Date: `'2018-08-14'`,
								Contract_URL: `'${this.state.contractURL}'`,
								Insurace_URL: `'${this.state.insuranceURL}'`,
								Other_URL: `'${this.state.otherURL}'`,
								Other01_URL: `'${this.state.other01URL}'`,
								Suite: `'${this.state.suite}'`,
								Contract_Status: "'C'"
							}
						}
					})
					.then((data) => {
						this.setState({ loadingUpdate: false });
						this.props.handleOpenSnackbar('success', 'General Information Updated!');
						// When the user click Next button, open second tab
						this.props.toggleStepper();
						this.props.next();
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Updating General Information: ' + error);
						this.setState({
							loadingUpdate: false
						});
					});
			});
		});
	};
	/**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION  *
     **********************************************************/

	loadCountries = (func = () => { }) => {
		this.setState({
			loadingCountries: true
		});
		this.props.client
			.query({
				query: this.GET_COUNTRIES_QUERY,
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcatalogitem != null) {
					this.setState(
						{
							countries: data.data.getcatalogitem,
							loadingCountries: false,
							indexView: 1
						},
						func
					);
				} else {
					this.setState({
						loadingCountries: false,
						indexView: 2,
						errorMessage: 'Error: Loading countries: getcatalogitem not exists in query data',
						firstLoad: false
					});
				}
			})
			.catch((error) => {
				this.setState({
					loadingCountries: false,
					indexView: 2,
					errorMessage: 'Error: Loading countries: ' + error,
					firstLoad: false
				});
			});
	};

	loadStates = (func = () => { }) => {
		this.setState({
			loadingStates: true
		});
		this.props.client
			.query({
				query: this.GET_STATES_QUERY,
				variables: { parent: this.state.country },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcatalogitem != null) {
					this.setState(
						{
							states: data.data.getcatalogitem,
							loadingStates: false,
							loading: false,
							indexView: 1
						},
						func
					);
				} else {
					this.setState({
						loadingStates: false,
						loading: false,
						indexView: 2,
						errorMessage: 'Error: Loading states: getcatalogitem not exists in query data',
						firstLoad: false
					});
				}
			})
			.catch((error) => {
				this.setState({
					loadingStates: false,
					loading: false,
					indexView: 2,
					errorMessage: 'Error: Loading states: ' + error,
					firstLoad: false
				});
			});
	};

	loadCities = (func = () => { }) => {
		this.setState({
			loadingCities: true
		});
		this.props.client
			.query({
				query: this.GET_CITIES_QUERY,
				variables: { parent: this.state.state },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcatalogitem != null) {
					this.setState(
						{
							cities: data.data.getcatalogitem,
							loadingCities: false,
							indexView: 1
						},
						func
					);
				} else {
					this.setState({
						loadingCities: false,
						indexView: 2,
						errorMessage: 'Error: Loading cities: getcatalogitem not exists in query data',
						firstLoad: false
					});
				}
			})
			.catch((error) => {
				this.setState({
					loadingCities: false,
					indexView: 2,
					errorMessage: 'Error: Loading cities: ' + error,
					firstLoad: false
				});
			});
	};
	/**
     * Events of the component
     */
	handleClickOpen = (scroll, boolValue, id, rate) => () => {
		//if (!this.props.showStepper) return false;
		this.setState(
			{
				propertyClick: boolValue,
				idProperty: id,
				Markup: rate
			},
			() => {
				this.setState({ open: true, scroll });
			}
		);
	};

	handleClose = () => {
		this.setState({ open: false });

		this.loadCompanyProperties(() => {
			this.setState({ indexView: 1, firstLoad: false });
		});
	};

	/**
     * End of the events
     */
	componentWillMount() {
		if (this.props.idCompany == 0) {
			this.props.toggleStepper();
			this.setState({ firstLoad: true }, () => {
				this.loadCountries(() => {
					this.loadCities(() => {
						this.loadStates(() => {
							this.loadCompanyProperties(() => {
								this.setState({ indexView: 1, firstLoad: false });
							});
						});
					});
				});
			});
		} else {
			this.setState(
				{
					inputEnabled: false
				},
				() => {
					this.setState({ firstLoad: true }, () => {
						this.loadCompany(() => {
							this.loadCountries(() => {
								this.loadCities(() => {
									this.loadStates(() => {
										this.loadCompanyProperties(() => {
											this.setState({ indexView: 1, firstLoad: false });
										});
									});
								});
							});
						});
					});
				}
			);
		}
	}

	constructor(props) {
		super(props);
		this.state = {
			inputEnabled: true,
			open: false,
			scroll: 'paper',
			completedInput: false,
			loading: false,
			name: '',
			otherName: '',
			otherName1: '',
			legalName: '',
			description: '',
			location: '',
			address: '',
			optionalAddress: '',
			businessType: '',
			region: '',
			Id_Parent: 0,
			management: '',
			phoneNumber: '',
			startDate: '',
			startWeek: '',
			endWeek: '',
			workWeek: '',
			avatar: 'url',
			otherPhoneNumber: '',
			rooms: '',
			rate: '',
			fax: '',
			zipCode: '',

			phonePrefix: '505',
			email: '',
			Code: '',
			Code01: '',
			active: 0,
			suite: '',
			dialogTabValue: 1,
			propertyClick: false,
			idProperty: 0,
			Markup: 0,
			openSnackbar: false,
			variantSnackbar: 'info',
			messageSnackbar: 'Dummy text!',
			...this.DEFAULT_STATUS,
			countries: [],
			states: [],
			cities: [],
			companyProperties: [],
			country: 6,
			state: 0,
			city: 0,
			loadingCountries: false,
			loadingCities: false,
			loadingStates: false,
			loadingCompanyProperties: false,

			contractURL: '',
			insuranceURL: '',
			otherURL: '',
			other01URL: '',
			loadingUpdate: false,
			indexView: 0, //Loading
			errorMessage: ''
		};
	}

	updateCountry = (id) => {
		this.setState(
			{
				country: id,
				state: 0,
				city: 0
			},
			() => {
				this.validateField('country', id);
				this.loadStates();
				this.loadCities();
			}
		);
	};
	updateState = (id) => {
		this.setState(
			{
				state: id,
				city: 0
			},
			() => {
				this.validateField('state', id);
				this.loadCities();
			}
		);
	};

	updateCity = (id) => {
		this.setState(
			{
				city: id
			},
			() => {
				this.validateField('city', id);
			}
		);
	};

	updateStartWeek = (id) => {
		this.setState(
			{
				startWeek: id
			},
			() => {
				this.validateField('startWeek', id);
			}
		);
	};

	updateEndWeek = (id) => {
		this.setState(
			{
				endWeek: id
			},
			() => {
				this.validateField('endWeek', id);
			}
		);
	};
	updateInput = (text, name) => {
		this.setState(
			{
				[name]: text
			},
			() => {
				this.validateField(name, text);
			}
		);
	};

	validateAllFields(fun) {
		let codeValid = this.state.Code.trim().length >= 2;
		let nameValid = this.state.name.trim().length >= 5;
		//	let descriptionValid = this.state.description.trim().length >= 10;
		let addressValid = this.state.address.trim().length >= 5;

		let startWeekValid = this.state.startWeek !== null && this.state.startWeek !== 0 && this.state.startWeek !== '';
		let endWeekValid = this.state.endWeek !== null && this.state.endWeek !== 0 && this.state.endWeek !== '';
		let rateValid = parseInt(this.state.rate) >= 0;
		let zipCodeValid = this.state.zipCode.toString().trim().length >= 2;
		let countryValid = this.state.country !== null && this.state.country !== 0 && this.state.country !== '';
		let stateValid = this.state.state !== null && this.state.state !== 0 && this.state.state !== '';

		//let cityValid = this.state.city !== null && this.state.city !== 0 && this.state.city !== '';
		//let suiteValid = parseInt(this.state.suite) >= 0;

		let phoneNumberValid =
			this.state.phoneNumber
				.replace(/-/g, '')
				.replace(/ /g, '')
				.replace('+', '')
				.replace('(', '')
				.replace(')', '').length == 10;

		let fax = this.state.fax.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '');
		let faxValid = fax.length == 10 || fax.length == 0;

		let startDateValid = this.state.startDate.trim().length == 10;

		this.setState(
			{
				codeValid,
				nameValid,
				//descriptionValid,
				addressValid,
				startWeekValid,
				endWeekValid,
				rateValid,
				zipCodeValid,
				countryValid,
				stateValid,
				//cityValid,
				//suiteValid,
				phoneNumberValid,
				faxValid
				//startDateValid
			},
			() => {
				this.validateForm(fun);
			}
		);
	}

	validateField(fieldName, value) {
		let codeValid = this.state.codeValid;
		let nameValid = this.state.nameValid;
		//let descriptionValid = this.state.descriptionValid;
		let addressValid = this.state.addressValid;

		let startWeekValid = this.state.startWeekValid;
		let endWeekValid = this.state.endWeekValid;
		let rateValid = this.state.rateValid;
		let zipCodeValid = this.state.zipCodeValid;
		let countryValid = this.state.countryValid;
		let stateValid = this.state.stateValid;

		let cityValid = this.state.cityValid;
		let suiteValid = this.state.suiteValid;
		let phoneNumberValid = this.state.phoneNumberValid;
		let faxValid = this.state.faxValid;
		let startDateValid = this.state.startDateValid;

		switch (fieldName) {
			case 'Code':
				codeValid = value.trim().length >= 2;

				break;
			case 'name':
				nameValid = value.trim().length >= 5;

				break;
			//	case 'description':
			//	descriptionValid = value.trim().length >= 10;

			//	break;
			case 'address':
				addressValid = value.trim().length >= 5;

				break;
			case 'startWeek':
				startWeekValid = value !== null && value !== 0 && value !== '';

				break;
			case 'endWeek':
				endWeekValid = value !== null && value !== 0 && value !== '';

				break;
			case 'rate':
				rateValid = parseInt(value) >= 0;

				break;
			case 'zipCode':
				zipCodeValid = value.trim().length >= 2;

				break;
			case 'country':
				countryValid = value !== null && value !== 0 && value !== '';

				break;
			case 'state':
				stateValid = value !== null && value !== 0 && value !== '';

				break;
			case 'city':
				cityValid = value !== null && value !== 0 && value !== '';

				break;
			//case 'suite':
			//suiteValid = value.trim()!='';

			//	break;
			case 'phoneNumber':
				phoneNumberValid =
					value.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '')
						.length == 10;
				break;
			case 'fax':
				let fax = value.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '');
				faxValid = fax.length == 10 || fax.length == 0;
				break;
			case 'startDate':
				startDateValid = value.trim().length == 10;
				break;
			default:
				break;
		}
		this.setState(
			{
				codeValid,
				nameValid,
				//descriptionValid,
				addressValid,
				startWeekValid,
				endWeekValid,
				rateValid,
				zipCodeValid,
				countryValid,
				stateValid,
				cityValid,
				//	suiteValid,
				phoneNumberValid,
				faxValid,
				startDateValid
			},
			this.validateForm
		);
	}

	validateForm(func = () => { }) {
		this.setState(
			{
				formValid:
					this.state.codeValid &&
					this.state.nameValid &&
					this.state.descriptionValid &&
					this.state.addressValid &&
					this.state.startWeekValid &&
					this.state.endWeekValid &&
					this.state.rateValid &&
					this.state.zipCodeValid &&
					this.state.countryValid &&
					this.state.stateValid &&
					//this.state.cityValid &&
					//this.state.suiteValid &&
					this.state.phoneNumberValid &&
					this.state.faxValid
				//this.state.startDateValid
			},
			func
		);
	}

	/**
     * Return the component
     *
     * @returns {XML} component
     */
	render() {
		const { classes } = this.props;

		let isLoading =
			this.state.loading ||
			this.state.loadingCities ||
			this.state.loadingCountries ||
			this.state.loadingStates ||
			this.state.loadingCompanyProperties ||
			this.state.firstLoad;

		/**
         * If the data is ready render the component
         */
		if (this.state.indexView == 2) {
			return (
				<React.Fragment>
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
			<div className="general-information-tab">
				{isLoading && <LinearProgress />}

				<div className="general-information__header">
					<div className="input-container">
						<span className="input-label">* Markup</span>
						<InputForm
							type="number"
							value={this.state.rate}
							change={(text) => {
								this.updateInput(text, 'rate');
							}}
							error={!this.state.rateValid}
							maxLength="10"
							disabled={!this.props.showStepper}
						/>
					</div>
					<div className="input-container">
						<span className="input-label">* Company Code</span>
						<InputForm
							value={this.state.Code}
							change={(text) => {
								this.updateInput(text, 'Code');
							}}
							error={!this.state.codeValid}
							maxLength="10"
							disabled={!this.props.showStepper}
						/>
					</div>
				</div>
				{this.props.idCompany != 0 ? (
					<div className="options-company">
						{!this.props.showStepper && (
							<button
								disabled={isLoading}
								className="edit-company-button"
								onClick={() => {
									this.setState({ firstLoad: true }, () => {
										this.loadCompany(() => {
											this.loadCountries(() => {
												this.loadCities(() => {
													this.loadStates(() => {
														this.loadCompanyProperties(() => {
															this.props.toggleStepper();
															this.setState({ indexView: 1, firstLoad: false });
														});
													});
												});
											});
										});
									});
								}}
							>
								Edit Company
							</button>
						)}
					</div>
				) : (
						''
					)}
				<div className="general-information__content">
					<div className="card-form-company">
						<div className="card-form-header grey">General Information</div>
						<div className="card-form-body">
							<div className="card-form-row">
								<span className="input-label primary">* Company Name</span>
								<InputForm
									value={this.state.name}
									change={(text) => {
										this.updateInput(text, 'name');
									}}
									error={!this.state.nameValid}
									maxLength="35"
									disabled={!this.props.showStepper}
								/>
							</div>
							{/*<div className="card-form-row">
								<span className="input-label primary">* Email</span>
								<InputForm

									value={this.state.email}
									change={(text) => {
										this.updateInput(text, 'email');
									}}
									error={!this.state.email}
									maxLength="35"
									disabled={!this.props.showStepper}
								/>
								</div>*/}
							<div className="card-form-row">
								<span className="input-label primary">* Address</span>
								<InputForm
									value={this.state.address}
									change={(text) => {
										this.updateInput(text, 'address');
									}}
									error={!this.state.addressValid}
									maxLength="50"
									disabled={!this.props.showStepper}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Address 2</span>
								<InputForm
									value={this.state.optionalAddress}
									change={(text) => {
										this.updateInput(text, 'optionalAddress');
									}}
									maxLength="50"
									disabled={!this.props.showStepper}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Suite</span>
								<input
									value={this.state.suite}
									onChange={(e) => {
										this.updateInput(e.target.value, 'suite');
									}}
									error={!this.state.suiteValid}
									maxLength="10"
									disabled={!this.props.showStepper}
									className={'input-form'}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">* Countries</span>

								<SelectForm
									name="country"
									disabled={this.state.loadingCountries}
									data={this.state.countries}
									update={this.updateCountry}
									error={!this.state.countryValid}
									value={this.state.country}
									disabled={!this.props.showStepper}
									showNone={false}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">* State</span>
								<SelectForm
									name="state"
									disabled={this.state.loadingStates}
									data={this.state.states}
									update={this.updateState}
									error={!this.state.stateValid}
									value={this.state.state}
									disabled={!this.props.showStepper}
									showNone={false}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">* City</span>
								<SelectForm
									name="city"
									disabled={this.state.loadingCities}
									data={this.state.cities}
									update={this.updateCity}
									error={!this.state.cityValid}
									value={this.state.city}
									disabled={!this.props.showStepper}
									showNone={false}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">* Zip Code</span>
								<InputForm
									value={this.state.zipCode}
									change={(text) => {
										this.updateInput(text, 'zipCode');
									}}
									error={!this.state.zipCodeValid}
									maxLength="10"
									min={0}
									type="number"
									disabled={!this.props.showStepper}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">* Phone Number</span>
								<InputMask
									id="number"
									name="number"
									mask="+(999) 999-9999"
									maskChar=" "
									value={this.state.phoneNumber}
									className={this.state.phoneNumberValid ? 'input-form' : 'input-form _invalid'}
									onChange={(e) => {
										this.updateInput(e.target.value, 'phoneNumber');
									}}
									placeholder="+(999) 999-9999"
									disabled={!this.props.showStepper}
								/>
							</div>
							<div className="card-form-row">
								<span className="input-label primary">Fax</span>
								<InputMask
									id="fax"
									name="fax"
									mask="+(999) 999-9999"
									maskChar=" "
									value={this.state.fax}
									className={this.state.faxValid ? 'input-form' : 'input-form _invalid'}
									onChange={(e) => {
										this.updateInput(e.target.value, 'fax');
									}}
									placeholder="+(999) 999-9999"
									disabled={!this.props.showStepper}
								/>
							</div>
						</div>
					</div>
					<div className="card-form-company">
						<div className="card-form-header yellow">Legal Docs</div>
						<div className="card-form-body">
							{/*<div className="card-form-row">
								<span className="input-label primary">* Contract Start Date</span>
								<InputDateForm
									value={this.state.startDate}
									change={(text) => {
										this.updateInput(text, 'startDate');
									}}
									error={!this.state.startDateValid}
									disabled={!this.props.showStepper}
								/>
							</div>*/}
							<div className="card-form-row">
								<span className="input-label primary">* Week Start</span>
								<SelectForm
									name="startWeek"
									data={days}
									error={!this.state.startWeekValid}
									update={this.updateStartWeek}
									value={this.state.startWeek}
									disabled={!this.props.showStepper}
									showNone={false}
								/>
							</div>

							<div className="card-form-row">
								<span className="input-label  primary">* Week End</span>
								<SelectForm
									name="endWeek"
									data={days}
									error={!this.state.endWeekValid}
									update={this.updateEndWeek}
									value={this.state.endWeek}
									disabled={!this.props.showStepper}
									showNone={false}
								/>
							</div>

							<div className="divider-text">Documents</div>
							<div className="card-form-row card-form-row--center">
								<span className="primary">Contract</span>
								<FileUpload
									updateURL={(url) => {
										this.setState({
											contractURL: url
										});
									}}
									disabled={!this.props.showStepper}
								/>
							</div>
							<div className="card-form-row card-form-row--center">
								<span className="primary">Insurance</span>
								<FileUpload
									updateURL={(url) => {
										this.setState({
											insuranceURL: url
										});
									}}
									disabled={!this.props.showStepper}
								/>
							</div>
							<div className="card-form-row card-form-row--center">
								<input
									type="text"
									className="input-file-name"
									max="120"
									placeholder="Name File"
									value={this.state.otherName}
									onChange={(e) => {
										this.updateInput(e.target.value, 'otherName');
									}}
									disabled={!this.props.showStepper}
								/>
								<FileUpload
									updateURL={(url) => {
										this.setState({
											otherURL: url
										});
									}}
									disabled={!this.props.showStepper}
								/>
							</div>
							<div className="card-form-row card-form-row--center">
								<input
									type="text"
									className="input-file-name"
									max="120"
									placeholder="Name File"
									value={this.state.otherName1}
									onChange={(e) => {
										this.updateInput(e.target.value, 'otherName1');
									}}
									disabled={!this.props.showStepper}
								/>
								<FileUpload
									updateURL={(url) => {
										this.setState({
											other01URL: url
										});
									}}
									disabled={!this.props.showStepper}
								/>
							</div>
						</div>
					</div>
					<div className="card-form-company card-form-overflow">
						<div className="card-form-header orange">Properties</div>
						<div className="card-form-body">
							<div className="table-elements">
								<li className="header-elements">Delete</li>
								<li className="header-elements">Property Code</li>
								<li className="header-elements">Property Name</li>
							</div>
							{this.state.companyProperties.map((item) => (
								<div className="table-elements" key={item.Id}>
									<div
										title="Watch Property"
										className="table__item"
										onClick={this.handleClickOpen('paper', true, item.Id, item.rate)}
									>
										<li>{item.Code}</li>
										<li>{item.Code}</li>
										<li>{item.Name}</li>
									</div>
								</div>
							))}
						</div>
						<div className="card-form-footer">
							<button
								className={
									this.props.idCompany == 0 ? (
										'add-property__disabled'
									) : (
											'add-property'
										)
								}
								disabled={this.props.idCompany == 0}
								onClick={this.handleClickOpen('paper', false, 0, 0)}
							>
								+ Add Property
							</button>
						</div>
					</div>
				</div>
				{this.props.showStepper ? (
					<div className="advanced-tab-options">
						<div className={classes.wrapper}>
							<Button
								className={classes.buttonSuccess}
								onClick={() => {
									this.props.idCompany != 0
										? this.updateCompany(this.props.idCompany)
										: this.insertCompany();
									//	window.location.pathname === '/home/company/edit' ? this.updateCompany(this.props.idCompany) : this.insertCompany();
								}}
								disabled={isLoading}
							>
								Save
							</Button>
							{this.state.loadingUpdate && (
								<CircularProgress size={24} className={classes.buttonProgress} />
							)}
						</div>
						{this.props.showStepper && (
							<div className={classes.wrapper}>
								<Button
									className={classes.buttonSuccess}
									disabled={isLoading}
									onClick={() => {
										if (this.props.idCompany == 0) {
											window.location.href = '/home/company';
											return true;
										}
										this.setState({ firstLoad: true }, () => {
											this.loadCompany(() => {
												this.loadCountries(() => {
													this.loadCities(() => {
														this.loadStates(() => {
															this.loadCompanyProperties(() => {
																this.props.toggleStepper();
																this.setState({ indexView: 1, firstLoad: false });
															});
														});
													});
												});
											});
										});
									}}
								>
									Cancel
								</Button>
								{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
							</div>
						)}
					</div>
				) : (
						''
					)}

				<Dialog
					open={this.state.open}
					onClose={this.handleClose}
					scroll={this.state.scroll}
					aria-labelledby="scroll-dialog-title"
					fullScreen
				>
					<DialogTitle id="alert-dialog-title dialog-header">{'Property Information'}</DialogTitle>
					<AppBar style={{ background: '#0092BD' }}>
						<Toolbar>
							<IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
								<CloseIcon />
							</IconButton>
							<Typography variant="title" color="inherit">
								Management Company
							</Typography>
						</Toolbar>
					</AppBar>
					<DialogContent>
						{this.state.propertyClick ? (
							//Si el click es en una property : pasar el id de esa property
							<TabsInDialog
								idCompany={this.props.idCompany}
								idProperty={this.state.idProperty}
								Markup={this.props.Markup}
								handleClose={this.handleClose}
								handleOpenSnackbar={this.props.handleOpenSnackbar}
							/>
						) : (
								//Si el click no es en esa property : pasar el Id en nulo
								//para que no cargue niguna información relacionada con ese Id
								<TabsInDialog
									idCompany={this.props.idCompany}
									Markup={this.state.rate}
									handleClose={this.handleClose}
									handleOpenSnackbar={this.props.handleOpenSnackbar}
								/>
							)}
					</DialogContent>
				</Dialog>
			</div>
		);
	}
}

GeneralInformation.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(GeneralInformation));
