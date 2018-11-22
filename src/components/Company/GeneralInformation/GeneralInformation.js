import React, { Component } from 'react';
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
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import ImageUpload from 'ui-components/ImageUpload/ImageUpload';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Hotels from './hotels';


const styles = (theme) => ({
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},
	buttonSuccess: {},
	buttonProgress: {
		//color: ,
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	},
	row: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default
		},
		'&:hover': {
			cursor: 'pointer'
		}
	}
});

const CustomTableCell = withStyles((theme) => ({
	head: {
		color: theme.palette.common.white
	},
	body: {
		fontSize: 14
	}
}))(TableCell);

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
		otherNameEdit: false,
		other01NameEdit: false,
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
		query States($parent: Int!, $Value: String) {
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3, Value: $Value) {
				Id
				Name
				IsActive
			}
		}
	`;
	GET_REGIONS_QUERY = gql`
		query Regions {
			getcatalogitem(Id: null, IsActive: 1, Id_Catalog:4) {
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
				Rooms
				Description
				Start_Week
				End_Week
				Start_Date
				Legal_Name
				Region
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
				Phone_Prefix
				Suite
				Contract_URL
				Contract_File
				Insurance_URL
				Insurance_File
				Other_URL
				Other_Name
				Other_File
				Other01_URL
				Other01_Name
				Other01_File
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

									contractURL: item.Contract_URL ? item.Contract_URL.trim() : '',
									contractFile: item.Contract_File ? item.Contract_File.trim() : '',

									insuranceURL: item.Insurance_URL ? item.Insurance_URL.trim() : '',
									insuranceFile: item.Insurance_File ? item.Insurance_File.trim() : '',

									otherURL: item.Other_URL ? item.Other_URL.trim() : '',
									otherName: item.Other_Name ? item.Other_Name.trim() : '',
									otherNameOriginal: item.Other_Name ? item.Other_Name.trim() : '',
									otherFile: item.Other_File ? item.Other_File.trim() : '',

									other01URL: item.Other01_URL ? item.Other01_URL.trim() : '',
									other01Name: item.Other01_Name ? item.Other01_Name.trim() : '',
									other01NameOriginal: item.Other01_Name ? item.Other01_Name.trim() : '',
									other01File: item.Other01_File ? item.Other01_File.trim() : '',

									rooms: item.Rooms ? item.Rooms.toString().trim() : '',
									country: item.Country,
									region: item.Region,
									state: item.State,
									city: item.City,
									Id_Parent: item.Id_Parent,
									rate: item.Rate,
									email: item.Primary_Email.trim(),
									phoneNumber: item.Phone_Number.trim(),
									phonePrefix: item.Phone_Prefix.trim(),
									avatar: item.ImageURL,
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

	handleOpenHotels = () => {
		this.setState({
			hotelModal: true
		});
	}

	handleCloseHotels = () => {
		this.setState({ hotelModal: false }, this.loadCompanyProperties);
	};

	loadCompanyProperties = (func = () => { }) => {
		this.setState({
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
				Region
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
								Region: parseInt(this.state.region),
								Country: parseInt(this.state.country),
								State: parseInt(this.state.state),
								City: parseInt(this.state.city),
								Rate: parseFloat(this.state.rate),
								Zipcode: parseInt(this.state.zipCode),
								Fax: `'${this.state.fax}'`,
								Primary_Email: `'correo@gmail.com'`,
								Phone_Number: `'${this.state.phoneNumber}'`,
								Phone_Prefix: `'${this.state.phonePrefix}'`,
								Id_Parent: this.state.idCompany == 0 ? 0 : this.state.Id_Parent,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-08-14'",
								Date_Updated: "'2018-08-14'",
								ImageURL: `'${this.state.avatar}'`,
								Start_Date: `'2018-08-14'`,

								Contract_URL: `'${this.state.contractURL}'`,
								Contract_File: `'${this.state.contractFile}'`,

								Insurance_URL: `'${this.state.insuranceURL}'`,
								Insurance_File: `'${this.state.insuranceFile}'`,

								Other_URL: `'${this.state.otherURL}'`,
								Other_Name: `'${this.state.otherName}'`,
								Other_File: `'${this.state.otherFile}'`,

								Other01_URL: `'${this.state.other01URL}'`,
								Other01_Name: `'${this.state.other01Name}'`,
								Other01_File: `'${this.state.other01File}'`,

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
								Region: parseInt(this.state.region),
								Country: parseInt(this.state.country),
								State: parseInt(this.state.state),
								City: parseInt(this.state.city),
								Rate: parseFloat(this.state.rate),
								Zipcode: parseInt(this.state.zipCode),
								Fax: `'${this.state.fax}'`,
								//Primary_Email: `'${this.state.email}'`,
								Primary_Email: `'coreo@gmail.com'`,
								Phone_Number: `'${this.state.phoneNumber}'`,
								Phone_Prefix: `'${this.state.phonePrefix}'`,
								Id_Parent: parseInt(this.state.Id_Parent),
								IsActive: parseInt(this.state.active),
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-08-14'",
								Date_Updated: "'2018-08-14'",
								ImageURL: `'${this.state.avatar}'`,
								Start_Date: `'2018-08-14'`,

								Suite: `'${this.state.suite}'`,
								Contract_Status: "'C'",

								Contract_URL: `'${this.state.contractURL}'`,
								Contract_File: `'${this.state.contractFile}'`,

								Insurance_URL: `'${this.state.insuranceURL}'`,
								Insurance_File: `'${this.state.insuranceFile}'`,

								Other_URL: `'${this.state.otherURL}'`,
								Other_Name: `'${this.state.otherName}'`,
								Other_File: `'${this.state.otherFile}'`,

								Other01_URL: `'${this.state.other01URL}'`,
								Other01_Name: `'${this.state.other01Name}'`,
								Other01_File: `'${this.state.other01File}'`
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

	loadRegions = (func = () => { }) => {
		this.setState({
			loadingRegions: true
		});
		this.props.client
			.query({
				query: this.GET_REGIONS_QUERY,
				//variables: { parent: this.state.country },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcatalogitem != null) {
					this.setState(
						{
							regions: data.data.getcatalogitem,
							loadingRegions: false,
							loading: false,
							indexView: 1
						},
						func
					);
				} else {
					this.setState({
						loadingRegions: false,
						loading: false,
						indexView: 2,
						errorMessage: 'Error: Loading regions: getcatalogitem not exists in query data',
						firstLoad: false
					});
				}
			})
			.catch((error) => {
				this.setState({
					loadingRegions: false,
					loading: false,
					indexView: 2,
					errorMessage: 'Error: Loading regions: ' + error,
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
		this.setState({ avatar: this.context.avatarURL });
		if (this.props.idCompany == 0) {
			this.props.toggleStepper();
			this.setState({ firstLoad: true }, () => {
				this.loadCountries(() => {
					this.loadCities(() => {
						this.loadStates(() => {
							this.loadRegions(() => {
								//this.loadCompanyProperties(() => {
								this.setState({ indexView: 1, firstLoad: false });
								//});
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
										this.loadRegions(() => {
											this.loadCompanyProperties(() => {
												this.setState({ indexView: 1, firstLoad: false });
											});
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

			legalName: '',
			description: '',
			location: '',
			address: '',
			optionalAddress: '',
			businessType: '',
			Id_Parent: 0,
			management: '',
			phoneNumber: '',
			startDate: '',
			startWeek: '',
			endWeek: '',
			workWeek: '',
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
			regions: [],
			companyProperties: [],
			country: 6,
			state: 0,
			city: 0,
			region: 0,
			loadingCountries: false,
			loadingCities: false,
			loadingStates: false,
			loadingRegions: false,
			loadingCompanyProperties: false,

			contractURL: '',
			contractFile: '',

			insuranceURL: '',
			insuranceFile: '',

			otherURL: '',
			otherName: '',
			otherFile: '',

			other01URL: '',
			other01Name: '',
			other01File: '',

			loadingUpdate: false,
			indexView: 0, //Loading
			errorMessage: '',
			hotelModal: false
		};
	}

	updateCountry = (id) => {
		this.setState(
			{
				country: id,
				state: 0,
				city: 0,
				region: 0
			},
			() => {
				this.validateField('country', id);
				this.loadRegions();
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

	updateRegion = (id) => {
		this.setState(
			{
				region: id
			},
			() => {
				this.validateField('region', id);
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
		//Calculate End Week
		var idEndWeek = id - 1;
		if (idEndWeek <= 0) idEndWeek = 7;

		this.setState(
			{
				startWeek: id,
				endWeek: idEndWeek
			},
			() => {
				this.validateField('startWeek', id);
			}
		);
	};

	updateEndWeek = (id) => {
		//Calculate Start Week
		var idStartWeek = id + 1;
		if (idStartWeek >= 8) idStartWeek = 1;

		this.setState(
			{
				endWeek: id,
				startWeek: idStartWeek
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
			}, () => {
				this.validateField(name, text);
				if (name == "zipCode") {
					fetch('https://ziptasticapi.com/' + text).then((response) => {
						return response.json()
					}).then((cities) => {
						if (!cities.error)
							this.findByZipCode(cities.state, cities.city.toLowerCase());
					});
				}
			}
		);
	};

	findByZipCode = (zipCode = null, cityFinal = null) => {
		if (!zipCode) {
			return false;
		}

		this.props.client.query({
			query: this.GET_STATES_QUERY,
			variables: { parent: -1, Value: `'${zipCode}'` },
			fetchPolicy: 'no-cache'
		}).then((data) => {
			this.updateState(data.data.getcatalogitem[0].Id);
		}).then(() => {
			this.loadCities(() => {
				let citySelected = this.state.cities.filter(city => {
					return city.Name.toLowerCase().includes(cityFinal);
				});
				this.updateCity(citySelected[0].Id);
			});
		});

	}

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
		let regionValid = this.state.region !== null && this.state.region !== 0 && this.state.region !== '';

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
				regionValid,
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
		let regionValid = this.state.regionValid;

		let cityValid = this.state.cityValid;
		let suiteValid = this.state.suiteValid;
		let phoneNumberValid = this.state.phoneNumberValid;
		let phoneNumber2Valid = this.state.phoneNumber2Valid;
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

			case 'region':
				regionValid = value !== null && value !== 0 && value !== '';

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
				regionValid,
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
					this.state.regionValid &&
					//this.state.suiteValid &&
					this.state.phoneNumberValid &&
					this.state.faxValid
				//this.state.startDateValid
			},
			func
		);
	}
	renderFileNameControls = (property, enableEdit) => {
		return (
			<input
				type="text"
				className="form-control input-file-name"
				max="120"
				placeholder="Name File"
				value={this.state[property]}
				onChange={(e) => {
					this.updateInput(e.target.value, property);
				}}
				disabled={!this.props.showStepper || !this.state[enableEdit]}
			/>
		);
	};
	renderEditControl = (property, enableEdit) => {
		return (
			<div className="input-group input-group-file">
				{this.renderFileNameControls(property, enableEdit)}
				{this.props.showStepper && this.renderEditButtons(property, enableEdit)}
			</div>
		);
	};
	renderEditButtons = (property, enableEdit) => {
		if (!this.state[enableEdit]) {
			return (
				<div className="input-group-append">
					<button
						id={`${property}_edit`}
						className="btn btn-default"
						onClick={() => {
							this.setState({
								[enableEdit]: true
							});
						}}
					>
						<i className="far fa-edit" />
					</button>
				</div>
			);
		} else {
			return (
				<div className="input-group-append">
					<button class="btn btn-success" id={`${property}_edit`} type="button" onClick={(e) => { this.setState({ [enableEdit]: false }); }}>
						<i className="far fa-save" />
					</button>
					<button class="btn btn-danger" id={`${property}_edit`} type="button" onClick={() => { this.setState({ [enableEdit]: false, [`${property}`]: this.state[`${property}Original`] }); }}>
						<i className="fas fa-ban" />
					</button>
				</div>
			);
		}
	};
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
			this.state.loadingRegions ||
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
					/>
				</React.Fragment>
			);
		}
		return (
			<div className="TabSelected-container">
				{isLoading && <LinearProgress />}

				<div className="row buttonsGroup">
					<div className="col-md-12">
						{this.props.idCompany != 0 ? (
							<div className="options-company">
								{!this.props.showStepper && (
									<button
										disabled={isLoading}
										className="btn btn-success float-right"
										onClick={() => {
											this.setState({ firstLoad: true }, () => {
												this.loadCompany(() => {
													this.loadCountries(() => {
														this.loadCities(() => {
															this.loadStates(() => {
																this.loadRegions(() => {
																	this.loadCompanyProperties(() => {
																		this.props.toggleStepper();
																		this.setState({ indexView: 1, firstLoad: false });
																	});
																});
															});
														});
													});
												});
											});
										}}
									>
										Edit Company <i class="fas fa-edit" />
									</button>
								)}
							</div>
						) : (
								''
							)}
						{this.props.showStepper ? (
							<div className="form-actions float-right">
								<button
									className="btn btn-success"
									onClick={() => {
										this.props.idCompany != 0
											? this.updateCompany(this.props.idCompany)
											: this.insertCompany();
										//	window.location.pathname === '/home/company/edit' ? this.updateCompany(this.props.idCompany) : this.insertCompany();
									}}
									disabled={isLoading}
								>
									Save <i class="fas fa-save" />
								</button>
								{this.state.loadingUpdate && (
									<CircularProgress size={24} className={classes.buttonProgress} />
								)}
								<button
									className="btn btn-danger"
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
															this.loadRegions(() => {
																this.loadCompanyProperties(() => {
																	this.props.toggleStepper();
																	this.setState({ indexView: 1, firstLoad: false });
																});
															});
														});
													});
												});
											});
										});
									}}
								>
									Cancel <i class="fas fa-ban" />
								</button>
								{isLoading && <CircularProgress size={24} className={classes.buttonProgress} />}
							</div>
						) : (
								''
							)}
					</div>
				</div>

				<div className="row">
					<div className="col-md-12 col-lg-8">
						<div class="card">
							<div class="card-body">
								<div className="row">
									<div className="col-md-6 col-lg-2">
										<ImageUpload
											id="avatarFileGI"
											updateAvatar={(url) => {
												this.setState({
													avatar: url
												});
											}}
											handleOpenSnackbar={this.props.handleOpenSnackbar}
											fileURL={this.state.avatar}
											disabled={!this.props.showStepper}
										/>
									</div>
									<div className="col-md-6 col-lg-3">
										<label className="">* Markup</label>
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
									<div className="col-md-6 col-lg-3">
										<label className="">* Company Code</label>
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
									<div className="col-md-6 col-lg-4">
										<label>* Company Name</label>
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
								</div>
							</div>
						</div>

						<div class="card">
							<div class="card-header info">General Information</div>
							<div class="card-body">
								<div className="row">
									<div className="col-md-5">
										<label className="">* Address</label>
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
									<div className="col-md-5">
										<label className="">Address 2</label>
										<InputForm
											value={this.state.optionalAddress}
											change={(text) => {
												this.updateInput(text, 'optionalAddress');
											}}
											maxLength="50"
											disabled={!this.props.showStepper}
										/>
									</div>
									<div className="col-md-2">
										<label>Suite</label>
										<input
											value={this.state.suite}
											onChange={(e) => {
												this.updateInput(e.target.value, 'suite');
											}}
											error={!this.state.suiteValid}
											maxLength="10"
											disabled={!this.props.showStepper}
											className={'form-control'}
										/>
									</div>
									<div className="col-md-5">
										<label>* Countries</label>
										<select
											name="country"
											className={'form-control'}
											disabled={this.state.loadingCountries}
											onChange={(event) => {
												this.updateCountry(event.target.value);
											}}
											error={!this.state.countryValid}
											value={this.state.country}
											disabled={!this.props.showStepper}
										>
											<option value="">Select a country</option>
											{this.state.countries.map((item) => (
												<option value={item.Id}>{item.Name}</option>
											))}
										</select>
									</div>
									<div className="col-md-5">
										<label>* Region</label>
										<select
											name="region"
											className={'form-control'}
											disabled={this.state.loadingRegion}
											onChange={(event) => {
												this.updateRegion(event.target.value);
											}}
											error={!this.state.regionValid}
											value={this.state.region}
											disabled={!this.props.showStepper}
											showNone={false}
										>
											<option value="">Select a region</option>
											{this.state.regions.map((item) => (
												<option value={item.Id}>{item.Name}</option>
											))}
										</select>
									</div>
									<div className="col-md-3 col-lg-2">
										<label>* Zip Code</label>
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
									<div className="col-md-6">
										<label>* State</label>
										<select
											name="state"
											className={'form-control'}
											disabled={this.state.loadingStates}
											onChange={(event) => {
												this.updateState(event.target.value);
											}}
											error={!this.state.stateValid}
											value={this.state.state}
											disabled={!this.props.showStepper}
											showNone={false}
										>
											<option value="">Select a state</option>
											{this.state.states.map((item) => (
												<option value={item.Id}>{item.Name}</option>
											))}
										</select>
									</div>
									<div className="col-md-6">
										<label>* City</label>
										<select
											name="city"
											className={'form-control'}
											disabled={this.state.loadingCities}
											onChange={(event) => {
												this.updateCity(event.target.value);
											}}
											error={!this.state.cityValid}
											value={this.state.city}
											disabled={!this.props.showStepper}
											showNone={false}
										>
											<option value="">Select a city</option>
											{this.state.cities.map((item) => (
												<option value={item.Id}>{item.Name}</option>
											))}
										</select>
									</div>

									<div className="col-md-5">
										<label>* Phone Number</label>
										<InputMask
											id="number"
											name="number"
											mask="+(999) 999-9999"
											maskChar=" "
											value={this.state.phoneNumber}
											className={
												this.state.phoneNumberValid ? 'form-control' : 'form-control _invalid'
											}
											onChange={(e) => {
												this.updateInput(e.target.value, 'phoneNumber');
											}}
											placeholder="+(999) 999-9999"
											disabled={!this.props.showStepper}
										/>
									</div>
									<div className="col-md-5">
										<label>Second Phone Number</label>
										<InputMask
											id="number"
											name="number"
											mask="+(999) 999-9999"
											maskChar=" "
											value={this.state.phonePrefix}
											className={'form-control'}
											onChange={(e) => {
												this.updateInput(e.target.value, 'phonePrefix');
											}}
											placeholder="+(999) 999-9999"
											disabled={!this.props.showStepper}
										/>
									</div>
									<div className="col-md-4 col-lg-5">
										<label>Fax</label>
										<InputMask
											id="fax"
											name="fax"
											mask="+(999) 999-9999"
											maskChar=" "
											value={this.state.fax}
											className={this.state.faxValid ? 'form-control' : 'form-control _invalid'}
											onChange={(e) => {
												this.updateInput(e.target.value, 'fax');
											}}
											placeholder="+(999) 999-9999"
											disabled={!this.props.showStepper}
										/>
									</div>
								</div>
							</div>
						</div>
						<div class="card">
							<div class="card-header warning">Legal Docs</div>
							<div class="card-body">
								<div className="row">
									<div className="col-md-6">
										<label>* Week Start</label>
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
									<div className="col-md-6">
										<label>* Week End</label>
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
									<div className="col-md-12">
										<div className="form-separator">Documents</div>
									</div>
									<div className="col-md-6">
										<label>Contract</label>
										<FileUpload
											updateURL={(url, fileName) => {
												this.setState({
													contractURL: url,
													contractFile: fileName
												});
											}}
											disabled={!this.props.showStepper}
											url={this.state.contractURL}
											fileName={this.state.contractFile}
											handleOpenSnackbar={this.props.handleOpenSnackbar}
										/>
									</div>
									<div className="col-md-6">
										<label>Insurance</label>
										<FileUpload
											updateURL={(url, fileName) => {
												this.setState({
													insuranceURL: url,
													insuranceFile: fileName
												});
											}}
											disabled={!this.props.showStepper}
											url={this.state.insuranceURL}
											fileName={this.state.insuranceFile}
											handleOpenSnackbar={this.props.handleOpenSnackbar}
										/>
									</div>
									<div className="col-md-6">
										{this.renderEditControl('otherName', 'otherNameEdit')}

										<FileUpload
											updateURL={(url, fileName) => {
												this.setState({
													otherURL: url,
													otherFile: fileName
												});
											}}
											disabled={!this.props.showStepper}
											url={this.state.otherURL}
											fileName={this.state.otherFile}
											handleOpenSnackbar={this.props.handleOpenSnackbar}
										/>
									</div>
									<div className="col-md-6">
										{this.renderEditControl('other01Name', 'other01NameEdit')}
										<FileUpload
											updateURL={(url, fileName) => {
												this.setState({
													other01URL: url,
													other01File: fileName
												});
											}}
											disabled={!this.props.showStepper}
											url={this.state.other01URL}
											fileName={this.state.other01File}
											handleOpenSnackbar={this.props.handleOpenSnackbar}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-12 col-lg-4">
						<div class="card">
							<div class="card-header danger">Properties</div>
							<div class="card-body">
								<Table className="Table">
									<TableHead>
										<TableRow>
											<CustomTableCell className={'Table-head'}>Property Code</CustomTableCell>
											<CustomTableCell className={'Table-head'}>Property Name</CustomTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{this.state.companyProperties.map((item) => {
											return (
												<TableRow
													hover
													className={classes.row}
													key={item.Id}
													onClick={this.handleClickOpen('paper', true, item.Id, item.rate)}
												>
													<CustomTableCell>{item.Code}</CustomTableCell>
													<CustomTableCell>{item.Code}</CustomTableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
								<div className="card-form-footer">
									<button className="btn btn-success mr-1" onClick={this.handleOpenHotels}>
										Add Hotel <i class="fas fa-plus" />
									</button>
									<button
										className={
											this.props.idCompany == 0 ? (
												'add-property__disabled btn btn-info'
											) : (
													'btn btn-info'
												)
										}
										disabled={this.props.idCompany == 0}
										onClick={this.handleClickOpen('paper', false, 0, 0)}
									>
										Add Property <i class="fas fa-plus" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Hotels handleOpenSnackbar={this.props.handleOpenSnackbar} ManagmentId={this.props.idCompany} open={this.state.hotelModal} handleClose={this.handleCloseHotels} />

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

	static contextTypes = {
		avatarURL: PropTypes.string
	};
}

GeneralInformation.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(GeneralInformation));
