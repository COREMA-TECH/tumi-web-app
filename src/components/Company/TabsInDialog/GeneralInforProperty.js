import React, { Component } from 'react';
import { gql } from 'apollo-boost';
import { Route } from 'react-router-dom';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import Query from 'react-apollo/Query';
import days from '../../../data/days.json';
import withApollo from 'react-apollo/withApollo';
import InputValid from '../../ui-components/InputWithValidation/InputValid';
import InputMask from 'react-input-mask';
import FileUpload from 'ui-components/FileUpload/FileUpload';
import SelectNothingToDisplay from '../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import ImageUpload from 'ui-components/ImageUpload/ImageUpload';
import PropTypes from 'prop-types';
import './valid.css';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
import InputForm from 'ui-components/InputForm/InputForm';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import axios from 'axios';

class GeneralInfoProperty extends Component {
	constructor(props) {
		super(props);
		this.state = {
			inputEnabled: true,
			open: false,
			scroll: 'paper',
			completedInput: false,
			loaded: false,
			//rate: 0,
			name: '',
			legalName: '',
			description: '',
			location: '',
			address: '',
			optionalAddress: '',
			businessType: '',
			RegionName: '',
			IdRegion: 0,
			country: 6,
			state: 0,
			region: 0,
			regions: [],
			city: 0,
			management: '',
			phoneNumber: '',
			startDate: '',
			startWeek: '',
			endWeek: '',
			workWeek: '',
			otherPhoneNumber: '',
			room: '',
			rate: this.props.Markup == 0 ? '' : this.props.Markup,
			fax: '',
			zipCode: '',
			phonePrefix: '505',
			email: '',
			Code: '',
			Code01: '',
			active: 1,
			suite: '',
			linearProgress: false,
			idProperty: null,
			Markup: null,
			validRegion: '',
			validState: '',
			validCity: '',
			validStartWeek: '',
			validEndWeek: '',
			zipCodeValid: true,
			rateValid: true,
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

			phoneNumberValid: true,
			faxValid: true,
			faxNumberValid: true,
			cityFinal: '',
			loadingData: false,

			nextButton: false,
			isCorrectCity: true
		};
	}
	/**
     *  QUERIES to get the countries, cities and states
     */
	getCountriesQuery = gql`
		{
			getcatalogitem(IsActive: 1, Id_Catalog: 2) {
				Id
				Name
				IsActive
			}
		}
	`;

	getStatesQuery = gql`
		query States($parent: Int!, $value: String) {
			getcatalogitem( IsActive: 1, Id_Parent: $parent, Id_Catalog: 3, Value: $value) {
				Id
				Name
				IsActive
			}
		}
	`;

	getRegionsQuery = gql`
	query Regions {
		getcatalogitem( IsActive: 1, Id_Catalog:4) {
			Id
			Name: DisplayLabel
			IsActive
		}
	}
`;

	getCitiesQuery = gql`
		query Cities($parent: Int!) {
			getcatalogitem( IsActive: 1, Id_Parent: $parent, Id_Catalog: 5) {
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
	getCompanyQuery = gql`
		query getCompany($id: Int!, $Id_Parent: Int!) {
			getbusinesscompanies(Id: $id, IsActive: 1, Contract_Status: "'C'", Id_Parent: $Id_Parent) {
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
				Region
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
				Rooms
			}
		}
	`;

	/**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION *
     **********************************************************/
	ADD_COMPANY = gql`
		mutation insertCompanies($input: iParamBC!) {
			insbusinesscompanies(input: $input) {
				Id
				Name
				Description
				Id_Parent
			}
		}
	`;

	GET_TYPES_QUERY = gql`
	{
		getcatalogitem(IsActive: 1, Id_Catalog: 4) {
			Id
			Name
			IsActive
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

	/*loadRegion = (func = () => { }) => {
		this.props.client.query({ query: this.getRegionsQuery, variables: {} }).then(({ data }) => {
			this.setState({
				regions: data.data.getcatalogitem
			},
				func);
		}).catch(error => { })
	};*/

	loadRegion = (func = () => { }) => {
		this.setState({ loadingData: true }, () => {
			this.props.client
				.query({
					query: this.getRegionsQuery,
					variables: {},
					fetchPolicy: 'no-cache'
				})
				.then((data) => {
					if (data.data.getcatalogitem != null) {
						this.setState(
							{
								regions: data.data.getcatalogitem,
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

	insertCompany = (id) => {
		var NewIdRegion = 0;
		// Show a Circular progress

		var vRegion = this.state.regions.find((obj) => {
			return obj.Name.trim().toLowerCase() === this.state.RegionName.trim().toLowerCase();
		});
		let insregionAsync = async () => {
			if (vRegion) {
				NewIdRegion = vRegion.Id;
			} else {
				//const InsertDepartmentNew =
				await this.props.client
					.mutate({
						mutation: this.INSERT_DEPARTMENTS_QUERY,
						variables: {
							input: {
								Id: 0,
								Id_Catalog: 4,
								Id_Parent: 0,
								Name: `'${this.state.RegionName}'`,
								DisplayLabel: `'${this.state.RegionName}'`,
								Description: `'${this.state.RegionName}'`,
								Value: `' '`,
								Value01: `' '`,
								Value02: `' '`,
								Value03: `' '`,
								Value04: `' '`,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-09-20 08:10:25+00'",
								Date_Updated: "'2018-09-20 08:10:25+00'"
							}
						}
					})
					.then((data) => {
						NewIdRegion = data.data.inscatalogitem.Id;

					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Inserting Department: ' + error);
						this.setState({
							saving: false
						});
						return false;
					});
			}
			this.setState(
				{
					linearProgress: true
				},
				() => {
					console.log("Id Parent:::", id)
					this.props.client
						.mutate({
							// Pass the mutation structure
							mutation: this.ADD_COMPANY,
							variables: {
								input: {
									Id: 150,
									Code: `'${this.state.Code}'`,
									Code01: `'${this.state.Code01}'`,
									Id_Contract: 1,
									Id_Company: 1,
									BusinessType: 1,
									Location: `'${this.state.address}'`,
									Location01: `'${this.state.optionalAddress}'`,
									Name: `'${this.state.name}'`,
									Description: `'${this.state.description}'`,
									Start_Week: this.state.startWeek,
									End_Week: this.state.endWeek,
									Legal_Name: "''",
									Region: parseInt(NewIdRegion),
									Country: parseInt(this.state.country),
									State: parseInt(this.state.state),
									Rate: parseFloat(this.state.rate),
									Zipcode: `'${this.state.zipCode.trim()}'`,
									Fax: `'${this.state.fax}'`,
									Primary_Email: `'email'`,
									Phone_Number: `'${this.state.phoneNumber}'`,
									Phone_Prefix: `'${this.state.phonePrefix}'`,
									City: parseInt(this.state.city),
									Id_Parent: !id ? 99999 : parseInt(id),
									IsActive: parseInt(this.state.active),
									User_Created: 1,
									User_Updated: 1,
									Date_Created: "'2018-08-14'",
									Date_Updated: "'2018-08-14'",
									ImageURL: `'${this.state.avatar}'`,
									Start_Date: "'2018-08-14'",

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

									Rooms: parseInt(this.state.room),
									Suite: `'${this.state.suite}'`,
									Contract_Status: "'C'"
								}
							}
						})
						.then(({ data }) => {
							console.log("data::::", data)
							this.props.updateIdProperty(parseInt(data.insbusinesscompanies.Id), parseInt(data.insbusinesscompanies.Id_Parent));

							this.setState({
								linearProgress: false
							});

							// this.props.next();
							this.setState({
								nextButton: true
							});

							this.props.handleOpenSnackbar('success', 'Success: Property created');
						})
						.catch((err) => this.props.handleOpenSnackbar('error', 'The error is: ' + err));
				}
			);
		};

		insregionAsync();
	};
	/**********************************************************
     *  MUTATION TO DELETE COMPANIES WITH GENERAL INFORMATION  *
     **********************************************************/
	DELETE_COMPANY = gql`
		mutation DeleteCompany($Id: Int!, $IsActive: Int!) {
			delbusinesscompanies(Id: $Id, IsActive: $IsActive) {
				Code
				Name
			}
		}
	`;

	deleteCompany = (updatedId) => {
		//Create the mutation using apollo global client

		this.setState(
			{

				removing: true
			},
			() => {
				this.props.client
					.mutate({
						// Pass the mutation structure
						mutation: this.DELETE_COMPANY,
						variables: {
							Id: parseInt(updatedId),
							IsActive: 0
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Success: Property Deleted');

						this.props.handleClose();
						/*history.push({
							pathname: '/company/edit',
							state: { idManagement: this.props.idManagement, idContract: this.props.idContract }
						});*/
						this.setState({
							removing: false,
							openConfirm: false
						})
					})
					.catch((err) => {
						//Capture error and show a specific message
						this.props.handleOpenSnackbar('error', 'The error is: ' + err);
						this.setState({ removing: false })
					});
			}
		);
	};

	/**********************************************************
     *  MUTATION TO UPDATE COMPANIES WITH GENERAL INFORMATION *
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

	updateCompany = (companyId, updatedId, buttonName) => {
		console.log({ companyId, updatedId, buttonName })
		var NewIdRegion = 0;
		// Show a Circular progress

		var vRegion = this.state.regions.find((obj) => {
			return obj.Name.trim().toLowerCase() === this.state.RegionName.trim().toLowerCase();
		});
		let updateRegionAsync = async () => {
			if (vRegion) {
				NewIdRegion = vRegion.Id;
			} else {
				//const InsertDepartmentNew =
				await this.props.client
					.mutate({
						mutation: this.INSERT_DEPARTMENTS_QUERY,
						variables: {
							input: {
								Id: 0,
								Id_Catalog: 4,
								Id_Parent: 0,
								Name: `'${this.state.RegionName}'`,
								DisplayLabel: `'${this.state.RegionName}'`,
								Description: `'${this.state.RegionName}'`,
								Value: `' '`,
								Value01: `' '`,
								Value02: `' '`,
								Value03: `' '`,
								Value04: `' '`,
								IsActive: 1,
								User_Created: 1,
								User_Updated: 1,
								Date_Created: "'2018-09-20 08:10:25+00'",
								Date_Updated: "'2018-09-20 08:10:25+00'"
							}
						}
					})
					.then((data) => {
						NewIdRegion = data.data.inscatalogitem.Id;
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Inserting Department: ' + error);
						this.setState({
							saving: false
						});
						return false;
					});
			}
			this.setState(
				{
					linearProgress: true
				},
				() => {

					//Create the mutation using apollo global client

					this.props.client
						.mutate({
							// Pass the mutation structure
							mutation: this.UPDATE_COMPANY,
							variables: {
								input: {
									Id: parseInt(updatedId),
									Code: `'${this.state.Code}'`,
									Code01: `'${this.state.Code01}'`,
									Id_Contract: 1,
									Id_Company: 1,
									BusinessType: 1,
									Location: `'${this.state.address}'`,
									Location01: `'${this.state.optionalAddress}'`,
									Name: `'${this.state.name}'`,
									Description: `'${this.state.description}'`,
									Start_Week: this.state.startWeek,
									End_Week: this.state.endWeek,
									Legal_Name: "''",
									Region: parseInt(NewIdRegion),
									Country: parseInt(this.state.country),
									State: parseInt(this.state.state),
									Rate: parseFloat(this.state.rate),
									//Rate: parseFloat(companyId),
									Zipcode: `'${this.state.zipCode.trim()}'`,
									Fax: `'${this.state.fax}'`,
									Primary_Email: `'email'`,
									Phone_Number: `'${this.state.phoneNumber}'`,
									Phone_Prefix: `'${this.state.phonePrefix}'`,
									City: parseInt(this.state.city),
									Id_Parent: parseInt(companyId),
									IsActive: parseInt(this.state.active),
									User_Created: 1,
									User_Updated: 1,
									Date_Created: "'2018-08-14'",
									Date_Updated: "'2018-08-14'",
									ImageURL: `'${this.state.avatar}'`,
									Start_Date: "'2018-08-14'",

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

									Rooms: parseInt(this.state.room),
									Suite: `'${this.state.suite}'`,
									Contract_Status: "'C'"
								}
							}
						})
						.then((data) => {
							// this.props.next();
							this.setState({
								nextButton: true
							});

							this.props.handleOpenSnackbar('success', 'Success: Property updated');

							this.setState({
								linearProgress: false
							});

							if (buttonName == "next")
								this.props.next();
						})
						.catch((err) => {
							//Capture error and show a specific message
							this.props.handleOpenSnackbar('error', 'The error is: ' + err);
						});
				}
			);
		};
		updateRegionAsync();

	};

	updateInput = (text, name) => {
		this.setState(
			{
				[name]: text
			}, () => {

				this.setState(
					{
						zipCodeValid: true
					})
				this.validateField(name, text);
				if (name == "zipCode") {
					const zipCode = this.state.zipCode.trim().replace('-', '').substring(0, 5);
					if (zipCode) {
						axios.get(`https://ziptasticapi.com/${zipCode}`).then(res => {
							const cities = res.data;
							if (!cities.error) {
								this.findByZipCode(cities.state, cities.city.toLowerCase());
							}
						})
					}
				}
			}
		);
	};

	handleFormSubmit = (buttonName) => (event) => {
		console.log("Props:::", this.props)
		event.preventDefault();
		let invalidInputs = document.querySelectorAll('input[required]'),
			i,
			validated = true;
		let fax = this.state.fax.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '');

		this.setState(
			{
				phoneNumberValid:
					this.state.phoneNumber
						.replace(/-/g, '')
						.replace(/ /g, '')
						.replace('+', '')
						.replace('(', '')
						.replace(')', '').length === 10,
				faxValid: fax.length === 10 || fax.length === 0
				//faxNumberValid: fax.length === 10 || fax.length === 0
			},
			() => {
				if (!this.state.phoneNumberValid || !this.state.faxValid) {
					validated = false;
				}

				// To set error in inputs
				for (i = 0; i < invalidInputs.length; ++i) {
					if (invalidInputs[i].value !== '') {
						invalidInputs[i].classList.remove('invalid');
					} else {
						invalidInputs[i].classList.add('invalid');

						validated = false;
					}
				}

				if (this.state.city === 0) {
					this.setState({
						validCity: 'valid'
					});

					validated = false;
				}

				if (this.state.state === 0) {
					this.setState({
						validState: 'valid'
					});

					validated = false;
				}

				if (this.state.startWeek === '') {
					this.setState({
						validStartWeek: 'valid'
					});

					validated = false;
				}

				if (this.state.endWeek === '') {
					this.setState({
						validEndWeek: 'valid'
					});

					validated = false;
				}

				if (this.state.rate === 0) {
					this.setState({
						validrate: 'valid'
					});

					validated = false;
				}

				if (validated) {
					//Show loading component
					if (this.props.idProperty === null) {
						this.insertCompany(this.props.idManagement);
					} else {
						this.updateCompany(this.props.idManagement, this.props.idProperty, buttonName);
					}
				} else {
					// Show snackbar warning
					this.props.handleOpenSnackbar(
						'warning',
						'Warning: Saving Information: You must fill all the required fields'
					);
				}
			}
		);
	};

	// To set style in required input
	changeStylesInCompletedInputs = () => {
		let invalidInputs = document.querySelectorAll('input[required]'),
			i;

		for (i = 0; i < invalidInputs.length; ++i) {
			if (invalidInputs[i].value !== '') {
				invalidInputs[i].classList.remove('invalid');
			}
		}
	};

	/**
	 * Get data from property
	 */
	getPropertyData = (idProperty, idParent) => {

		this.setState(
			{
				linearProgress: true
			},
			() => {
				this.props.client
					.query({
						query: this.getCompanyQuery,
						variables: {
							id: idProperty,
							Id_Parent: idParent
						},
						fetchPolicy: 'no-cache'
					})
					.then(({ data }) => {
						if (data.getbusinesscompanies !== null) {
							let item = data.getbusinesscompanies[0];
							var Region = this.state.regions.find(function (obj) {
								return obj.Id === item.Region;
							});
							this.setState({
								RegionName: Region ? Region.Name.trim() : '',
								name: item.Name.trim(),
								legalName: item.Legal_Name.trim(),
								description: item.Description.trim(),
								startWeek: item.Start_Week,
								endWeek: item.End_Week,
								address: item.Location.trim(),
								optionalAddress: item.Location01.trim(),
								region: item.Region,
								country: item.Country,
								state: item.State,
								city: item.City,

								rate: item.Rate,
								email: item.Primary_Email.trim(),
								phoneNumber: item.Phone_Number.trim(),

								Code: item.Code.trim(),
								Code01: item.Code01.trim(),
								zipCode: item.Zipcode.trim(),
								fax: item.Fax,
								startDate: item.Start_Date.trim(),
								active: item.IsActive,
								suite: item.Suite,
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
								room: item.Rooms,
								avatar: item.ImageURL
							});

							this.setState({
								linearProgress: false
							});
						} else {
							// TODO: Show a error message
						}
					})
					.catch();
			}
		);
	};

	componentWillMount() {

		this.setState({ avatar: this.context.avatarURL });
		this.loadRegion(() => { });
		if (this.props.idProperty !== null) {
			this.loadRegion(() => {
				this.getPropertyData(this.props.idProperty, this.props.idManagement);
			});

		} else {
			this.loadRegion(() => { });
		}
	}
	renderFileNameControls = (property, enableEdit) => {
		return (
			<input
				type="text"
				className={'form-control input-file-name'}
				max="120"
				placeholder="Name File"
				value={this.state[property]}
				onChange={(e) => {
					this.setState({
						[property]: e.target.value
					});
				}}
			/>
		);
	};
	renderEditControl = (property, enableEdit) => {
		return (
			<div className="input-group input-group-file">
				{this.renderFileNameControls(property, enableEdit)}
				{this.renderEditButtons(property, enableEdit)}
			</div>
		);
	};
	renderEditButtons = (property, enableEdit) => {
		if (!this.state[enableEdit]) {
			return (
				<div className="input-group-append">
					<button
						type="button"
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
					<button
						class="btn btn-success"
						id={`${property}_edit`}
						type="button"
						onClick={(e) => {
							this.setState({ [enableEdit]: false });
						}}
					>
						<i className="far fa-save" />
					</button>
					<button
						class="btn btn-danger"
						id={`${property}_edit`}
						type="button"
						onClick={() => {
							this.setState({ [enableEdit]: false, [`${property}`]: this.state[`${property}Original`] });
						}}
					>
						<i className="fas fa-ban" />
					</button>
				</div>
			);
		}
	};

	updateRegionName = (value) => {
		this.setState(
			{
				RegionName: value
				//validRegion: false
			},
			() => {

				//			let validRegion = true;
				//	this.validateField('RegionName', value);
			}
		);
	};

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
		//let regionValid = this.state.regionValid;

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
				endWeekValid = startWeekValid;
				break;
			case 'endWeek':
				endWeekValid = value !== null && value !== 0 && value !== '';
				startWeekValid = endWeekValid;
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

				// case 'region':
				// 	regionValid = value !== null && value !== 0 && value !== '';

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
				// regionValid,
				//	suiteValid,
				phoneNumberValid,
				faxValid,
				startDateValid
			},
			this.validateForm
		);
	}

	findByZipCode = (zipCode = null, cityFinal = null) => {
		if (!zipCode) {
			return false;
		}

		this.props.client.query({
			query: this.getStatesQuery,
			variables: { parent: -1, value: `'${zipCode}'` },
			fetchPolicy: 'no-cache'
		}).then((data) => {
			this.setState({
				state: data.data.getcatalogitem[0].Id,
				cityFinal: cityFinal,
				byZipCode: true
			});
		});

	}

	render() {
		this.changeStylesInCompletedInputs();

		if (this.state.linearProgress) {
			return <LinearProgress />;
		}

		return (
			<Route
				render={({ history }) => (
					<form >
						<div className="row">
							<ConfirmDialog
								open={this.state.openConfirm}
								closeAction={() => {
									this.setState({ openConfirm: false });
								}}
								confirmAction={() => {
									this.deleteCompany(this.props.idProperty);
								}}
								title="Do you really want to delete this property?"
								loading={this.state.removing}
							/>
							<div className="col-md-12">
								<div className="form-actions float-right">
									{this.props.idProperty != null ? (
										<button
											disabled={false}
											className="btn btn-danger"
											onClick={() => {
												this.setState({ openConfirm: true })
											}}
											type="button"
										>
											Delete Property<i class="fas fa-ban ml-1" />
										</button>
									) : (
											''
										)}


									{
										!this.state.nextButton ? (
											<button type="submit" className="btn btn-success" name="save" id="save" onClick={this.handleFormSubmit('save')}>
												Save<i className="fas fa-save ml-2" />
											</button>
										) : (
												<button type="submit" onClick={this.handleFormSubmit('next')} className="btn btn-success" name="next" id="next">
													Next <i className="fas fa-chevron-right"></i>
												</button>
											)
									}
								</div>
							</div>
						</div>
						<div className="row">
							<div className="col-md-12">
								<div class="card">
									<div class="card-header">General Information</div>
									<div class="card-body">
										<div className="row">
											<div className="col-md-12 col-lg-1">
												<div className="GeneralInformation-wrapper">
													<ImageUpload
														id="avatarFilePI"
														updateAvatar={(url) => {
															this.setState({
																avatar: url
															});
														}}
														fileURL={this.state.avatar}
														disabled={false}
														handleOpenSnackbar={this.props.handleOpenSnackbar}
													/>
												</div>
											</div>
											<div className="col-md-12 col-lg-11">
												<div className="row">

													<div className="col-md-6 col-lg-1">
														<label>* Markup</label>
														<InputValid
															change={(text) => {
																this.setState({
																	rate: text
																});
															}}
															value={this.state.rate}
															type="number"
															maxLength="10"
															required
															placeholder='0'
														/>
													</div>
													<div className="col-md-6 col-lg-2">
														<label>* Hotel Name</label>
														<InputValid
															change={(text) => {
																this.setState({
																	name: text
																});
															}}
															value={this.state.name}
															type="text"
															maxLength="35"
															required
														/>
													</div>
													<div className="col-md-6 col-lg-4">
														<label>* Address</label>
														<InputValid
															change={(text) => {
																this.setState({
																	address: text
																});
															}}
															value={this.state.address}
															type="text"
															maxLength="50"
															required
														/>
													</div>
													<div className="col-md-6 col-lg-3">
														<label>Address 2</label>
														<input
															className={'form-control'}
															onChange={(e) => {
																this.setState({
																	optionalAddress: e.target.value
																});
															}}
															value={this.state.optionalAddress}
															type="text"
															maxLength="50"
														/>
													</div>
													<div className="col-md-6 col-lg-2">
														<label>Suite</label>
														<input
															onChange={(e) => {
																this.setState({
																	suite: e.target.value
																});
															}}
															value={this.state.suite}
															type="text"
															maxLength="10"
															className={'form-control'}
														/>
													</div>

													<div className="col-md-6 col-lg-3">
														<label>City</label>
														<span className="float-right">
															<input type="checkbox" name="isCorrectCity" onChange={() => { this.setState({ isCorrectCity: !this.state.isCorrectCity }) }} />
															<label htmlFor="">Change selected city by zip code?</label>
														</span>
														<Query
															query={this.getCitiesQuery}
															variables={{ parent: this.state.state }}
														>
															{({ loading, error, data, refetch, networkStatus }) => {
																//if (networkStatus === 4) return <LinearProgress />;
																if (loading) return <LinearProgress />;
																if (error) return <p>Error </p>;
																if (
																	data.getcatalogitem != null &&
																	data.getcatalogitem.length > 0
																) {
																	var citySelected = 0;
																	citySelected = data.getcatalogitem.filter(city => {
																		return city.Name.toLowerCase().includes(this.state.cityFinal);
																	});
																	if (citySelected[0].Id != this.state.city && this.state.byZipCode) {
																		this.setState({
																			city: citySelected[0].Id,
																			byZipCode: false
																		});
																	}

																	return (
																		<select
																			name="city"
																			className={'form-control'}
																			onChange={(event) => {
																				this.setState({
																					city: event.target.value,
																					validCity: ''
																				});
																			}}
																			error={this.state.validCity === '' ? false : true}
																			value={this.state.city}
																			showNone={false}
																			disabled={this.state.isCorrectCity}
																		>
																			<option value="">Select a city</option>
																			{data.getcatalogitem.map((item) => (
																				<option key={item.Id} value={item.Id}>{item.Name}</option>
																			))}
																		</select>
																	);
																}
																return <SelectNothingToDisplay />;
															}}
														</Query>
													</div>

													<div className="col-md-6 col-lg-2">
														<label>* States</label>
														<Query query={this.getStatesQuery} variables={{ parent: 6 }}>
															{({ loading, error, data, refetch, networkStatus }) => {
																//if (networkStatus === 4) return <LinearProgress />;
																if (loading) return <LinearProgress />;
																if (error) return <p>Error </p>;
																if (
																	data.getcatalogitem != null &&
																	data.getcatalogitem.length > 0
																) {
																	return (
																		<select
																			name="state"
																			className={'form-control'}
																			onChange={(event) => {
																				this.setState({
																					state: event.target.value,
																					validState: ''
																				});
																			}}
																			error={this.state.validState === '' ? false : true}
																			value={this.state.state}
																			showNone={false}
																			disabled={true}
																		>
																			<option value="">Select a state</option>
																			{data.getcatalogitem.map((item) => (
																				<option value={item.Id}>{item.Name}</option>
																			))}
																		</select>
																	);
																}
																return <SelectNothingToDisplay />;
															}}
														</Query>
													</div>
													<div className="col-md-6 col-lg-2">

														<label>* Zip Code</label>
														<InputValid
															value={this.state.zipCode.trim()}
															change={(text) => {
																this.updateInput(text, 'zipCode');
															}}
															error={!this.state.zipCodeValid}
															maxLength="10"
															min={0}
															type="text"
														/>

													</div>
													<div className="col-md-12 col-lg-3">
														<label> Region</label>
														<AutosuggestInput
															id="Region"
															name="Region"
															data={this.state.regions}
															//error={this.state.validRegion === '' ? false : true}
															value={this.state.RegionName}
															onChange={this.updateRegionName}
															onSelect={this.updateRegionName}
														/>
													</div>
													<div className="col-md-6 col-lg-2">
														<label>* Phone Number</label>
														<InputMask
															id="prop-number"
															name="number"
															mask="+(999) 999-9999"
															maskChar=" "
															value={this.state.phoneNumber}
															className={
																this.state.phoneNumberValid ? (
																	'form-control'
																) : (
																		'form-control _invalid'
																	)
															}
															onChange={(e) => {
																this.setState({
																	phoneNumber: e.target.value,
																	phoneNumberValid: true
																});
															}}
															placeholder="+(999) 999-9999"
															required
															minLength="15"
														/>
													</div>
													<div className="col-md-6 col-lg-2">
														<label>Fax</label>
														<InputMask
															id="prop-fax"
															name="number"
															mask="+(999) 999-9999"
															maskChar=" "
															value={this.state.fax}
															className={
																this.state.faxValid ? (
																	'form-control'
																) : (
																		'form-control _invalid'
																	)
															}
															onChange={(e) => {
																this.setState({
																	fax: e.target.value,
																	faxValid: true
																});
															}}
															placeholder="+(999) 999-9999"
															minLength="15"
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div class="card">
									<div class="card-header">Legal Docs</div>
									<div class="card-body">
										<div className="row">
											<div className="col-md-6 col-lg-4">
												<label>* Hotel Code</label>
												<InputValid
													change={(text) => {
														this.setState({
															Code: text
														});
													}}
													value={this.state.Code}
													type="text"
													maxLength="10"
													required
												/>
											</div>
											<div className="col-md-6 col-lg-4">
												<label>Cost Center</label>
												<input
													type="text"
													value={this.state.Code01}
													onChange={(e) => {
														this.setState({
															Code01: e.target.value
														});
													}}
													maxLength="10"
													className={'form-control'}
												/>
											</div>
											<div className="col-md-6 col-lg-4">
												<label>* Contract Start Date</label>
												<InputValid
													change={(text) => {
														this.setState({
															startDate: text
														});
													}}
													value={this.state.startDate}
													type="date"
													required
												/>
											</div>
											<div className="col-md-6 col-lg-4">
												<label>* Number of Rooms</label>
												<InputValid
													change={(text) => {
														this.setState({
															room: text
														});
													}}
													value={this.state.room}
													type="number"
													required
												/>
											</div>
											<div className="col-md-6 col-lg-4">
												<label>* Week Start</label>
												<SelectForm
													data={days}
													update={(value) => {
														//Calculate End Week
														var idEndWeek = value - 1;
														if (idEndWeek <= 0) idEndWeek = 7;

														if (value === 0) {
															this.setState({
																startWeek: value,
																validStartWeek: 'valid',
																validEndWeek: 'valid',
																endWeek: idEndWeek
															});
														} else {
															this.setState({
																startWeek: value,
																validStartWeek: '',
																validEndWeek: '',
																endWeek: idEndWeek
															});
														}
													}}
													value={this.state.startWeek}
													error={this.state.validStartWeek === '' ? false : true}
													showNone={false}
												/>
											</div>
											<div className="col-md-6 col-lg-4">
												<label>To</label>
												<SelectForm
													data={days}
													update={(value) => {
														//Calculate Start Week
														var idStartWeek = value + 1;
														if (idStartWeek >= 8) idStartWeek = 1;
														if (value === 0) {
															this.setState({
																endWeek: value,
																validEndWeek: 'valid',
																validStartWeek: 'valid',
																startWeek: idStartWeek
															});
														} else {
															this.setState({
																endWeek: value,
																validEndWeek: '',
																validStartWeek: '',
																startWeek: idStartWeek
															});
														}
													}}
													value={this.state.endWeek}
													error={this.state.validEndWeek === '' ? false : true}
													showNone={false}
												/>
											</div>
											<div className="col-md-6 col-lg-6">
												<label>Contract</label>
												<FileUpload
													updateURL={(url, fileName) => {
														this.setState({
															contractURL: url,
															contractFile: fileName
														});
													}}
													url={this.state.contractURL}
													fileName={this.state.contractFile}
													handleOpenSnackbar={this.props.handleOpenSnackbar}
												/>
											</div>
											<div className="col-md-6 col-lg-6">
												<label>Insurance</label>
												<FileUpload
													updateURL={(url, fileName) => {
														this.setState({
															insuranceURL: url,
															insuranceFile: fileName
														});
													}}
													url={this.state.insuranceURL}
													fileName={this.state.insuranceFile}
													handleOpenSnackbar={this.props.handleOpenSnackbar}
												/>
											</div>
											<div className="col-md-6 col-lg-6">
												{this.renderEditControl('otherName', 'otherNameEdit')}
												<FileUpload
													updateURL={(url, fileName) => {
														this.setState({
															otherURL: url,
															otherFile: fileName
														});
													}}
													url={this.state.otherURL}
													fileName={this.state.otherFile}
													handleOpenSnackbar={this.props.handleOpenSnackbar}
												/>
											</div>
											<div className="col-md-6 col-lg-6">
												{this.renderEditControl('other01Name', 'other01NameEdit')}
												<FileUpload
													updateURL={(url, fileName) => {
														this.setState({
															other01URL: url,
															other01File: fileName
														});
													}}
													url={this.state.other01URL}
													fileName={this.state.other01File}
													handleOpenSnackbar={this.props.handleOpenSnackbar}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</ form>
				)
				}
			/>
		);
	}
	static contextTypes = {
		avatarURL: PropTypes.string
	};
}

GeneralInfoProperty.propTypes = {};

export default withApollo(GeneralInfoProperty);
