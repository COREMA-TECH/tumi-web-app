import React, { Component } from 'react';
import './index.css';
import InputForm from 'ui-components/InputForm/InputForm';
import TextAreaForm from 'ui-components/InputForm/TextAreaForm';
import status from '../../../data/statusContract.json';
import intervalDays from '../../../data/ownerExpirationNotice.json';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import { gql } from 'apollo-boost';
import withApollo from 'react-apollo/withApollo';
import InputDateForm from 'ui-components/InputForm/InputDateForm';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Query from 'react-apollo/Query';
import AccountDialog from 'ui-components/AccountDialog/AccountDialog';
import ContactDialog from 'ui-components/AccountDialog/ContactDialog';
import SelectFormContractTemplate from 'ui-components/SelectForm/SelectFormContractTemplate';

import PropTypes from 'prop-types';
import 'ui-components/InputForm/index.css';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import withGlobalContent from 'Generic/Global';
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
class NewContract extends Component {
	DEFAULT_STATE = {
		Contract_NameValid: true,
		Contrat_OwnerValid: true,
		Id_Contract_TemplateValid: true,
		Id_EntityValid: true,
		Id_User_SignedValid: true,
		User_Signed_TitleValid: true,
		Signed_DateValid: true,
		IsActiveValid: true,
		Contract_Start_DateValid: true,
		Contract_TermValid: true,
		contractExpirationValid: true,
		Owner_Expiration_NotificationValid: true,
		CompanySignedNameValid: true,
		Company_Signed_DateValid: true,
		Id_User_Billing_ContactValid: true,
		Billing_StreetValid: true,
		Billing_StateValid: true,
		Billing_CityValid: true,
		Billing_Zip_CodeValid: true,
		validForm: true
	};
	constructor(props) {
		super(props);

		this.state = {
			Id: '',
			Id_Company: '',
			Contract_Name: '',
			Contrat_Owner: '',
			contractTemplateId: 0,
			contractExpiration: this.getNewDate(),
			Id_Contract_Template: '',

			Id_Entity: 0,
			Id_User_Signed: '',
			User_Signed_Title: '',
			Signed_Date: this.getNewDate(),
			Contract_Status: '',
			Contract_Start_Date: this.getNewDate(),
			Contract_Term: '',
			Owner_Expiration_Notification: '',
			Company_Signed: 0,
			Company_Signed_Date: this.getNewDate(),
			Id_User_Billing_Contact: '',
			Billing_Street: '',
			Billing_City: 0,
			Billing_State: 0,
			Billing_Zip_Code: '',
			Billing_Country: 6,
			Contract_Terms: '',
			Exhibit_B: '',
			Exhibit_C: '',
			Exhibit_D: '',
			Exhibit_E: '',
			Exhibit_F: '',
			IsActive: 1,
			User_Created: '',
			User_Updated: '',
			Date_Created: '',
			Date_Updated: '',
			CompanySignedName: '',
			open: false,
			scroll: 'paper',
			managementDialog: false,
			Electronic_Address: '',
			loaded: false,
			loading: false,
			loadingCompanies: false,
			loadingInsert: false,
			loadingUpdate: false,
			...this.DEFAULT_STATE
		};
	}

	updateStatus = (id) => {
		this.setState(
			{
				IsActive: id
			},
			() => {
				this.validateField('IsActive', id);
			}
		);
	};

	updateProvidence = (id) => {
		this.setState(
			{
				Billing_State: id
			},
			() => {
				this.validateField('Billing_State', id);
			}
		);
	};

	updateCity = (id) => {
		this.setState(
			{
				Billing_City: id
			},
			() => {
				this.validateField('Billing_City', id);
			}
		);
	};

	updateOwnerExpirationNotification = (id) => {
		this.setState(
			{
				Owner_Expiration_Notification: id
			},
			() => {
				this.validateField('Owner_Expiration_Notification', id);
			}
		);
	};

	updateIdCompany = (id) => {
		this.setState(
			{
				Id_Entity: id,
				loadingCompanies: true
			},
			() => {
				this.setState(
					{
						Id_User_Signed: null,
						Id_User_Billing_Contact: null,
						User_Signed_Title: ''
					},
					() => {
						this.setState(
							{
								loadingCompanies: false
							},
							() => {
								this.validateField('Id_Entity', id);
							}
						);
					}
				);
			}
		);

		this.props.updateCompanyId(id);
	};

	updateIdContact = (id) => {
		this.setState(
			{
				Id_User_Signed: id
			},
			() => {
				this.validateField('Id_User_Signed', id);
			}
		);
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	/**
     * End of the events
     */

	/**************************************
     *   MUTATION TO CREATE NEW CONTRACT  *
     *************************************/
	ADD_CONTRACT = gql`
		mutation inscontracts($input: iContracts!) {
			inscontracts(input: $input) {
				Id
			}
		}
	`;

	UPDATE_CONTRACT = gql`
		mutation updcontracts($input: iContracts!) {
			updcontracts(input: $input) {
				Id
			}
		}
	`;

	GET_CONTRACT = gql`
		{
			getcontracttemplate(Id: null, IsActive: 1) {
				Id
				Name
				Contract_Template
			}
		}
	`;

	GET_CONTRACT_BY_ID = gql`
		query getContractById($Id: Int!) {
			getcontracts(Id: $Id, IsActive: null) {
				Id
				Id_Company
				Contract_Name
				Contrat_Owner
				Id_Entity
				Id_User_Signed
				User_Signed_Title
				Signed_Date
				Contract_Status
				Contract_Start_Date
				Contract_Term
				Owner_Expiration_Notification
				Company_Signed
				Company_Signed_Date
				Id_User_Billing_Contact
				Billing_Street
				Billing_City
				Billing_State
				Billing_Zip_Code
				Billing_Country
				Contract_Terms
				Id_Contract_Template
				Exhibit_B
				Exhibit_C
				Exhibit_D
				Exhibit_E
				Exhibit_F
				IsActive
				User_Created
				User_Updated
				Date_Created
				Date_Updated
				Client_Signature
				Company_Signature
				Contract_Expiration_Date
			}
		}
	`;

	// To get the data by a specific contact using the ID
	getContractData = (id) => {
		this.setState({
			loading: true
		});

		this.props.client
			.query({
				query: this.GET_CONTRACT_BY_ID,
				fetchPolicy: 'no-cache',
				variables: {
					Id: id
				}
			})
			.then(({ data }) => {
				this.setState(
					{
						Contract_Name: data.getcontracts[0].Contract_Name,
						Contrat_Owner: data.getcontracts[0].Contrat_Owner,
						Id_Entity: data.getcontracts[0].Id_Entity,
						Id_User_Signed: data.getcontracts[0].Id_User_Signed,
						User_Signed_Title: data.getcontracts[0].User_Signed_Title.trim(),
						Id_User_Billing_Contact: data.getcontracts[0].Id_User_Billing_Contact,
						Signed_Date: data.getcontracts[0].Signed_Date,
						Contract_Start_Date: data.getcontracts[0].Contract_Start_Date,
						Contract_Term: data.getcontracts[0].Contract_Term,
						Id_Contract_Template: data.getcontracts[0].Id_Contract_Template,
						contractExpiration: data.getcontracts[0].Contract_Expiration_Date,
						Owner_Expiration_Notification: data.getcontracts[0].Owner_Expiration_Notification,
						Company_Signed: data.getcontracts[0].Company_Signed,
						Company_Signed_Date: data.getcontracts[0].Company_Signed_Date,
						Billing_Street: data.getcontracts[0].Billing_Street,
						Billing_City: data.getcontracts[0].Billing_City,
						Billing_State: data.getcontracts[0].Billing_State,
						Billing_Country: data.getcontracts[0].Billing_Country,
						Billing_Zip_Code: data.getcontracts[0].Billing_Zip_Code,
						Contract_Terms: data.getcontracts[0].Contract_Terms,
						IsActive: data.getcontracts[0].IsActive,
						Date_Created: data.getcontracts[0].Date_Created,
						Date_Updated: data.getcontracts[0].Date_Updated,
						loaded: false
					},
					() => {
						this.setState(
							{
								loading: false
							},
							() => {
								this.props.updateCompanyId(this.state.Id_Entity);
							}
						);
					}
				);
			})
			.catch((err) => console.log(err));
	};

	insertContract = () => {
		this.setState(
			{
				loadingInsert: true
			},
			() => {
				//Create the mutation using apollo global client
				this.validateAllFields(() => {
					if (!this.state.formValid) {
						this.props.handleOpenSnackbar(
							'warning',
							'Error: Saving Information: You must fill all the required fields'
						);
						this.setState({
							loadingInsert: false
						});
						return true;
					}
					this.props.client
						.mutate({
							// Pass the mutation structure
							mutation: this.ADD_CONTRACT,
							variables: {
								input: {
									Id: 1,
									Id_Company: 1,
									Contract_Name: `'${this.state.Contract_Name}'`,
									Contrat_Owner: `'${this.state.Contrat_Owner}'`,
									Id_Entity: parseInt(this.state.Id_Entity),
									Id_User_Signed: parseInt(this.state.Id_User_Signed),
									User_Signed_Title: `'${this.state.User_Signed_Title}'`,
									Signed_Date: `'${this.state.Signed_Date}'`,
									Contract_Status: `'${this.state.Contract_Status}'`,
									Contract_Start_Date: `'${this.state.Contract_Start_Date}'`,
									Contract_Term: parseInt(this.state.Contract_Term),
									Contract_Expiration_Date: `'${this.state.contractExpiration}'`,
									Owner_Expiration_Notification: parseInt(this.state.Owner_Expiration_Notification),
									Company_Signed: `'${this.state.CompanySignedName}'`,
									Company_Signed_Date: `'${this.state.Company_Signed_Date}'`,
									Id_User_Billing_Contact: parseInt(this.state.Id_User_Billing_Contact),
									Billing_Street: `'${this.state.Billing_Street}'`,
									Billing_City: parseInt(this.state.Billing_City),
									Billing_State: parseInt(this.state.Billing_State),
									Billing_Zip_Code: parseInt(this.state.Billing_Zip_Code),
									Billing_Country: 6,
									Contract_Terms: "''",
									Id_Contract_Template: parseInt(this.state.Id_Contract_Template),
									Exhibit_B: "''",
									Exhibit_C: "''",
									Exhibit_D: "''",
									Exhibit_E: "''",
									Exhibit_F: "''",
									IsActive: parseInt(this.state.IsActive),
									User_Created: 1,
									User_Updated: 1,
									Date_Created: "'2018-08-14'",
									Date_Updated: "'2018-08-14'",
									Electronic_Address: `'${this.state.Electronic_Address}'`,
									Primary_Email: `'${this.state.Primary_Email}'`
								}
							}
						})
						.then(({ data }) => {
							this.props.handleOpenSnackbar('success', 'Contract Inserted!');
							this.setState({
								loadingInsert: false
							});
							this.props.update(data.inscontracts.Id);
						})
						.catch((err) => {
							console.log('Error: Inserting Contract: ', err);
							this.props.handleOpenSnackbar('error', 'Error: Inserting Contract: ' + err);
							this.setState({
								loadingUpdate: false
							});
						});
				});
			}
		);
	};

	updateContract = (id) => {
		this.setState(
			{
				loadingUpdate: true
			},
			() => {
				this.validateAllFields(() => {
					if (!this.state.formValid) {
						this.props.handleOpenSnackbar(
							'warning',
							'Error: Saving Information: You must fill all the required fields'
						);
						this.setState({
							loadingUpdate: false
						});
						return true;
					}
					//Create the mutation using apollo global client
					this.props.client
						.mutate({
							// Pass the mutation structure
							mutation: this.UPDATE_CONTRACT,
							variables: {
								input: {
									Id: id,
									Id_Company: 1,
									Contract_Name: `'${this.state.Contract_Name}'`,
									Contrat_Owner: `'${this.state.Contrat_Owner}'`,
									Id_Entity: parseInt(this.state.Id_Entity),
									Id_User_Signed: parseInt(this.state.Id_User_Signed),
									User_Signed_Title: `'${this.state.User_Signed_Title}'`,
									Signed_Date: `'${this.state.Signed_Date}'`,
									Contract_Status: `'${this.state.Contract_Status}'`,
									Contract_Start_Date: `'${this.state.Contract_Start_Date}'`,
									Contract_Term: parseInt(this.state.Contract_Term),
									Contract_Expiration_Date: `'${this.state.contractExpiration}'`,
									Owner_Expiration_Notification: parseInt(this.state.Owner_Expiration_Notification),
									Company_Signed: `'${this.state.CompanySignedName}'`,
									Company_Signed_Date: `'${this.state.Company_Signed_Date}'`,
									Id_User_Billing_Contact: parseInt(this.state.Id_User_Billing_Contact),
									Billing_Street: `'${this.state.Billing_Street}'`,
									Billing_City: parseInt(this.state.Billing_City),
									Billing_State: parseInt(this.state.Billing_State),
									Billing_Zip_Code: parseInt(this.state.Billing_Zip_Code),
									Billing_Country: 6,
									Contract_Terms: "''",
									Id_Contract_Template: parseInt(this.state.Id_Contract_Template),
									Exhibit_B: "''",
									Exhibit_C: "''",
									Exhibit_D: "''",
									Exhibit_E: "''",
									Exhibit_F: "''",
									IsActive: parseInt(this.state.IsActive),
									User_Created: 1,
									User_Updated: 1,
									Date_Created: "'2018-08-14'",
									Date_Updated: "'2018-08-14'",
									Electronic_Address: `'${this.state.Electronic_Address}'`,
									Primary_Email: `'${this.state.Primary_Email}'`
								}
							}
						})
						.then(({ data }) => {
							this.props.handleOpenSnackbar('success', 'Contract Updated!');
							this.setState({
								loadingUpdate: false
							});
							this.props.update(id);
						})
						.catch((err) => {
							console.log('Error: Updating Contract: ', err);
							this.props.handleOpenSnackbar('error', 'Error: Updating Contract: ' + err);
							this.setState({
								loadingUpdate: false
							});
						});
				});
			}
		);
	};

	/**
     * QUERY to get companies
     */
	getCompaniesQuery = gql`
		query getcompanies($Id: Int!) {
			getcompanies(Id: $Id, IsActive: 1) {
				Id
				Name
				LegalName
				Primary_Email
			}
		}
	`;

	getNewDate = () => {
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!

		var yyyy = today.getFullYear();
		if (dd < 10) {
			dd = '0' + dd;
		}
		if (mm < 10) {
			mm = '0' + mm;
		}
		var today = yyyy + '-' + mm + '-' + dd;

		return today;
	};

	getCompanies = (id) => {
		this.props.client
			.query({
				query: this.getCompaniesQuery,
				variables: {
					Id: id
				}
			})
			.then(({ data }) => {
				this.setState({
					CompanySignedName: data.getcompanies[0].LegalName,
					CompanySignedNameValid: true,
					Primary_Email: data.getcompanies[0].Primary_Email
				});
			})
			.catch((error) => {
				console.log(error);
			});
	};

	getStatesQuery = gql`
		query States($parent: Int!) {
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: $parent, Id_Catalog: 3) {
				Id
				Name
				IsActive
			}
		}
	`;

	getCitiesQuery = gql`
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

	getContractTermsQuery = gql`
		{
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: null, Id_Catalog: 10) {
				Id
				Name
				IsActive
			}
		}
	`;

	/***
     * Events fo the dialog
     *
     */
	/**
     * Events of the component
     */

	handleClose = () => {
		this.setState({ open: false });
	};

	componentWillMount() {
		if (this.props.contractId !== 0) {
			this.getContractData(this.props.contractId);
		}
	}

	validateField(fieldName, value) {
		let Contract_NameValid = this.state.Contract_NameValid;
		let Contrat_OwnerValid = this.state.Contrat_OwnerValid;
		let Id_Contract_TemplateValid = this.state.Id_Contract_TemplateValid;
		let Id_EntityValid = this.state.Id_EntityValid;
		let Id_User_SignedValid = this.state.Id_User_SignedValid;
		let User_Signed_TitleValid = this.state.User_Signed_TitleValid;
		let Signed_DateValid = this.state.Signed_DateValid;
		let IsActiveValid = this.state.IsActiveValid;
		let Contract_Start_DateValid = this.state.Contract_Start_DateValid;
		let Contract_TermValid = this.state.Contract_TermValid;
		let contractExpirationValid = this.state.contractExpirationValid;
		let Owner_Expiration_NotificationValid = this.state.Owner_Expiration_NotificationValid;
		let CompanySignedNameValid = this.state.CompanySignedNameValid;
		let Company_Signed_DateValid = this.state.Company_Signed_DateValid;
		let Id_User_Billing_ContactValid = this.state.Id_User_Billing_ContactValid;
		let Billing_StreetValid = this.state.Billing_StreetValid;
		let Billing_StateValid = this.state.Billing_StateValid;
		let Billing_CityValid = this.state.Billing_CityValid;
		let Billing_Zip_CodeValid = this.state.Billing_Zip_CodeValid;

		switch (fieldName) {
			case 'Contract_Name':
				Contract_NameValid = value.trim().length >= 5;
				break;
			case 'Contrat_Owner':
				Contrat_OwnerValid = value.trim().length >= 5;
				break;
			case 'Id_Contract_Template':
				Id_Contract_TemplateValid = value !== null && value !== 0 && value !== '';
				break;
			case 'Id_Entity':
				Id_EntityValid = value !== null && value !== 0 && value !== '';
				break;
			case 'Id_User_Signed':
				Id_User_SignedValid = value !== null && value !== 0 && value !== '';

				break;
			case 'User_Signed_Title':
				User_Signed_TitleValid = value.trim().length >= 5;
				Id_User_SignedValid = true;
				break;
			case 'Signed_Date':
				Signed_DateValid = value.trim().length == 10;
				break;
			case 'IsActive':
				IsActiveValid = value !== null && value !== 0 && value !== '';
				break;
			case 'Contract_Start_Date':
				Contract_Start_DateValid = value.trim().length == 10;
				break;
			case 'Contract_Term':
				Contract_TermValid = value !== null && value !== 0 && value !== '';
				break;
			case 'contractExpiration':
				contractExpirationValid = value.trim().length == 10;
				break;
			case 'Owner_Expiration_Notification':
				Owner_Expiration_NotificationValid = value !== null && value !== 0 && value !== '';
				break;
			case 'CompanySignedName':
				CompanySignedNameValid = value.trim().length >= 5;
				break;
			case 'Company_Signed_Date':
				Company_Signed_DateValid = value.trim().length == 10;
				break;
			case 'Id_User_Billing_Contact':
				Id_User_Billing_ContactValid = value !== null && value !== 0 && value !== '';
				break;
			case 'Billing_Street':
				Billing_StreetValid = value !== null && value !== 0 && value !== '';
				break;
			case 'Billing_State':
				Billing_StateValid = value !== null && value !== 0 && value !== '';
				break;
			case 'Billing_City':
				Billing_CityValid = value !== null && value !== 0 && value !== '';
				break;
			case 'Billing_Zip_Code':
				Billing_Zip_CodeValid = value.toString().trim().length >= 2;
			default:
				break;
		}
		this.setState(
			{
				Contract_NameValid,
				Contrat_OwnerValid,
				Id_Contract_TemplateValid,
				Id_EntityValid,
				Id_User_SignedValid,
				User_Signed_TitleValid,
				Signed_DateValid,
				IsActiveValid,
				Contract_Start_DateValid,
				Contract_TermValid,
				contractExpirationValid,
				Owner_Expiration_NotificationValid,
				CompanySignedNameValid,
				Company_Signed_DateValid,
				Id_User_Billing_ContactValid,
				Billing_StreetValid,
				Billing_StateValid,
				Billing_CityValid,
				Billing_Zip_CodeValid
			},
			this.validateForm
		);
	}
	/*Validations */
	validateAllFields(fun) {
		console.log('Id_Contract_Template', this.state.Id_Contract_Template);
		let Contract_NameValid = this.state.Contract_Name.trim().length >= 5;
		let Contrat_OwnerValid = this.state.Contrat_Owner.trim().length >= 5;
		let Id_Contract_TemplateValid =
			this.state.Id_Contract_Template !== null &&
			this.state.Id_Contract_Template !== 0 &&
			this.state.Id_Contract_Template !== '';

		let Id_EntityValid = this.state.Id_Entity !== null && this.state.Id_Entity !== 0 && this.state.Id_Entity !== '';
		let Id_User_SignedValid =
			this.state.Id_User_Signed !== null && this.state.Id_User_Signed !== 0 && this.state.Id_User_Signed !== '';
		let User_Signed_TitleValid = this.state.User_Signed_Title.trim().length >= 5;
		let Signed_DateValid = this.state.Signed_Date.trim().length == 10;
		let IsActiveValid = this.state.IsActive !== null && this.state.IsActive !== 0 && this.state.IsActive !== '';
		let Contract_Start_DateValid = this.state.Contract_Start_Date.trim().length == 10;
		let Contract_TermValid =
			this.state.Contract_Term !== null && this.state.Contract_Term !== 0 && this.state.Contract_Term !== '';
		let contractExpirationValid = this.state.contractExpiration.trim().length == 10;
		let Owner_Expiration_NotificationValid =
			this.state.Owner_Expiration_Notification !== null &&
			this.state.Owner_Expiration_Notification !== 0 &&
			this.state.Owner_Expiration_Notification !== '';
		let CompanySignedNameValid = this.state.CompanySignedName.trim().length >= 5;
		let Company_Signed_DateValid = this.state.Company_Signed_Date.trim().length == 10;

		let Id_User_Billing_ContactValid =
			this.state.Id_User_Billing_Contact !== null &&
			this.state.Id_User_Billing_Contact !== 0 &&
			this.state.Id_User_Billing_Contact !== '';
		let Billing_StreetValid =
			this.state.Billing_Street !== null && this.state.Billing_Street !== 0 && this.state.Billing_Street !== '';
		let Billing_StateValid =
			this.state.Billing_State !== null && this.state.Billing_State !== 0 && this.state.Billing_State !== '';
		let Billing_CityValid =
			this.state.Billing_City !== null && this.state.Billing_City !== 0 && this.state.Billing_City !== '';
		let Billing_Zip_CodeValid = this.state.Billing_Zip_Code.toString().trim().length >= 2;

		this.setState(
			{
				Contract_NameValid,
				Contrat_OwnerValid,
				Id_Contract_TemplateValid,
				Id_EntityValid,
				Id_User_SignedValid,
				User_Signed_TitleValid,
				Signed_DateValid,
				IsActiveValid,
				Contract_Start_DateValid,
				Contract_TermValid,
				contractExpirationValid,
				Owner_Expiration_NotificationValid,
				CompanySignedNameValid,
				Company_Signed_DateValid,
				Id_User_Billing_ContactValid,
				Billing_StreetValid,
				Billing_StateValid,
				Billing_CityValid,
				Billing_Zip_CodeValid
			},
			() => {
				this.validateForm(fun);
			}
		);
	}

	validateForm(func = () => {}) {
		this.setState(
			{
				formValid:
					this.state.Contract_NameValid &&
					this.state.Contrat_OwnerValid &&
					this.state.Id_Contract_TemplateValid &&
					this.state.Id_EntityValid &&
					this.state.Id_User_SignedValid &&
					this.state.User_Signed_TitleValid &&
					this.state.Signed_DateValid &&
					this.state.IsActiveValid &&
					this.state.Contract_Start_DateValid &&
					this.state.Contract_TermValid &&
					this.state.contractExpirationValid &&
					this.state.Owner_Expiration_NotificationValid &&
					this.state.CompanySignedNameValid &&
					this.state.Company_Signed_DateValid &&
					this.state.Id_User_Billing_ContactValid &&
					this.state.Billing_StreetValid &&
					this.state.Billing_StateValid &&
					this.state.Billing_CityValid &&
					this.state.Billing_Zip_CodeValid
			},
			func
		);
	}
	/*End of Validations*/

	render() {
		const { classes } = this.props;

		if (this.state.loadingCompanies) {
			return <LinearProgress />;
		}

		if (this.state.loading) {
			return <LinearProgress />;
		}

		return (
			<div className="contract-container">
				<div className="contract-body">
					<div className="contract-body__content">
						<div className="contract-body-row">
							<div className="contract-body-row__content">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Contact Information</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Name</span>

											<InputForm
												value={this.state.Contract_Name}
												change={(text) => {
													this.setState(
														{
															Contract_Name: text
														},
														() => {
															this.validateField('Contract_Name', text);
														}
													);
												}}
												error={!this.state.Contract_NameValid}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Contract Owner</span>
											<InputForm
												value={this.state.Contrat_Owner}
												change={(text) => {
													this.setState(
														{
															Contrat_Owner: text
														},
														() => {
															this.validateField('Contrat_Owner', text);
														}
													);
												}}
												error={!this.state.Contrat_OwnerValid}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Contract Template</span>
											<Query query={this.GET_CONTRACT}>
												{({ loading, error, data, refetch, networkStatus }) => {
													//if (networkStatus === 4) return <LinearProgress />;
													if (loading) return <LinearProgress />;
													if (error) return <p>Error </p>;
													if (
														data.getcontracttemplate != null &&
														data.getcontracttemplate.length > 0
													) {
														return (
															<SelectFormContractTemplate
																name="template"
																data={data.getcontracttemplate}
																showNone={false}
																update={(value) => {
																	this.setState(
																		{
																			Id_Contract_Template: value
																		},
																		() => {
																			this.validateField(
																				'Id_Contract_Template',
																				value
																			);
																		}
																	);
																}}
																value={this.state.Id_Contract_Template}
																error={!this.state.Id_Contract_TemplateValid}
															/>
														);
													}
													return <p>Nothing to display </p>;
												}}
											</Query>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Management Company</span>
											<AccountDialog
												valueSelected={this.state.Id_Entity}
												error={!this.state.Id_EntityValid}
												update={this.updateIdCompany}
												updateCompanySignedBy={(value) => {
													this.setState(
														{
															Company_Signed: value
														},
														() => {
															this.validateField('Company_Signed', value);
															this.getCompanies(this.state.Company_Signed);
														}
													);
												}}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Customer Signed By</span>

											<ContactDialog
												defaultValue=""
												valueSelected={this.state.Id_User_Signed}
												handleOpenSnackbar={this.props.handleOpenSnackbar}
												error={!this.state.Id_User_SignedValid}
												idCompany={this.state.Id_Entity}
												update={this.updateIdContact}
												updateEmailContact={(email) => {
													this.setState(
														{
															Electronic_Address: email
														},
														() => {
															this.validateField('Electronic_Address', email);
														}
													);
												}}
												updateTypeContact={(value) => {
													this.setState(
														{
															User_Signed_Title: value
														},
														() => {
															this.validateField('User_Signed_Title', value);
														}
													);
												}}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Customer Signed Title</span>
											<InputForm
												value={this.state.User_Signed_Title}
												change={(text) => {}}
												error={!this.state.User_Signed_TitleValid}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Customer Signed Date</span>
											<InputDateForm
												value={this.state.Signed_Date}
												placeholder={this.state.Signed_Date}
												change={(text) => {
													this.setState(
														{
															Signed_Date: text
														},
														() => {
															this.validateField('Signed_Date', text);
														}
													);
												}}
												error={!this.state.Signed_DateValid}
											/>
										</div>
									</div>
								</div>

								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Status</span>
											<SelectForm
												data={status}
												update={this.updateStatus}
												value={this.state.IsActive}
												error={!this.state.IsActiveValid}
												showNone={false}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Contract Start Date</span>
											<InputDateForm
												placeholder={this.state.Contract_Start_Date}
												value={this.state.Contract_Start_Date}
												error={!this.state.Contract_Start_DateValid}
												change={(text) => {
													this.setState(
														{
															Contract_Start_Date: text
														},
														() => {
															this.validateField('Contract_Start_Date', text);
														}
													);
												}}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Contract Term (months)</span>

											<Query query={this.getContractTermsQuery}>
												{({ loading, error, data, refetch, networkStatus }) => {
													//if (networkStatus === 4) return <LinearProgress />;
													if (loading) return <LinearProgress />;
													if (error) return <p>Error </p>;
													if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
														return (
															<SelectForm
																data={data.getcatalogitem}
																update={(text) => {
																	this.setState(
																		{
																			Contract_Term: text
																		},
																		() => {
																			this.validateField('Contract_Term', text);
																		}
																	);
																}}
																showNone={false}
																value={this.state.Contract_Term}
																error={!this.state.Contract_TermValid}
															/>
														);
													}
													return <p>Nothing to display </p>;
												}}
											</Query>
										</div>

										<div className="card-form-row">
											<span className="input-label primary">Contract Expiration Date</span>
											<InputDateForm
												placeholder={this.state.contractExpiration}
												value={this.state.contractExpiration}
												error={!this.state.contractExpirationValid}
												change={(text) => {
													this.setState(
														{
															contractExpiration: text
														},
														() => {
															this.validateField('contractExpiration', text);
														}
													);
												}}
											/>
										</div>

										<div className="card-form-row">
											<span className="input-label primary">Owner Expiration Notice</span>
											<SelectForm
												data={intervalDays}
												update={this.updateOwnerExpirationNotification}
												value={this.state.Owner_Expiration_Notification}
												error={!this.state.Owner_Expiration_NotificationValid}
												showNone={false}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Company Signed By</span>

											<InputForm
												value={this.state.CompanySignedName}
												change={(text) => {}}
												error={!this.state.CompanySignedNameValid}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Company Signed Date</span>
											<InputDateForm
												value={this.state.Company_Signed_Date}
												error={!this.state.Company_Signed_DateValid}
												change={(text) => {
													this.setState(
														{
															Company_Signed_Date: text
														},
														() => {
															this.validateField('Company_Signed_Date', text);
														}
													);
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="contract-body-row__content">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Billing Information</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Billing Name</span>
											{this.state.loadingCompanies ? (
												<ContactDialog
													defaultValue=""
													valueSelected={this.state.Id_User_Billing_Contact}
													error={!this.state.Id_User_Billing_ContactValid}
													idContact={this.state.Id_Entity}
													update={(id) => {
														this.setState(
															{
																Id_User_Billing_Contact: id
															},
															() => {
																this.validateField('Id_User_Billing_Contact', id);
															}
														);
													}}
													updateEmailContact={(email) => {}}
													updateTypeContact={(type) => {}}
													handleOpenSnackbar={this.props.handleOpenSnackbar}
												/>
											) : (
												<ContactDialog
													defaultValue=""
													valueSelected={this.state.Id_User_Billing_Contact}
													error={!this.state.Id_User_Billing_ContactValid}
													idContact={this.state.Id_Entity}
													update={(id) => {
														this.setState(
															{
																Id_User_Billing_Contact: id
															},
															() => {
																this.validateField('Id_User_Billing_Contact', id);
															}
														);
													}}
													updateEmailContact={(email) => {}}
													updateTypeContact={(type) => {}}
													handleOpenSnackbar={this.props.handleOpenSnackbar}
												/>
											)}
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Billing Street</span>
											<InputForm
												value={this.state.Billing_Street}
												error={!this.state.Billing_StreetValid}
												change={(text) => {
													this.setState(
														{
															Billing_Street: text
														},
														() => {
															this.validateField('Billing_Street', text);
														}
													);
												}}
											/>
										</div>

										<div className="card-form-row">
											<span className="input-label primary">Billing State / Providence</span>

											<Query
												query={this.getStatesQuery}
												variables={{ parent: this.state.Billing_Country }}
											>
												{({ loading, error, data, refetch, networkStatus }) => {
													//if (networkStatus === 4) return <LinearProgress />;
													if (loading) return <LinearProgress />;
													if (error) return <p>Error </p>;
													if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
														return (
															<SelectForm
																data={data.getcatalogitem}
																showNone={false}
																update={this.updateProvidence}
																value={this.state.Billing_State}
																error={!this.state.Billing_StateValid}
															/>
														);
													}
													return <p>Nothing to display </p>;
												}}
											</Query>
										</div>

										<div className="card-form-row">
											<span className="input-label primary">Billing City</span>
											<Query
												query={this.getCitiesQuery}
												variables={{ parent: this.state.Billing_State }}
											>
												{({ loading, error, data, refetch, networkStatus }) => {
													//if (networkStatus === 4) return <LinearProgress />;
													if (loading) return <LinearProgress />;
													if (error) return <p>Error </p>;
													if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
														return (
															<SelectForm
																data={data.getcatalogitem}
																update={this.updateCity}
																showNone={false}
																value={this.state.Billing_City}
																error={!this.state.Billing_CityValid}
															/>
														);
													}
													return <p>Nothing to display </p>;
												}}
											</Query>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Billing Zip Code / Postal Code</span>
											<InputForm
												value={this.state.Billing_Zip_Code}
												change={(text) => {
													this.setState(
														{
															Billing_Zip_Code: text
														},
														() => {
															this.validateField('Billing_Zip_Code', text);
														}
													);
												}}
												type="number"
												error={!this.state.Billing_Zip_CodeValid}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="contract-body-row__content hidden">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Contract Information</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.Contract_Terms}
												change={(text) => {
													this.setState(
														{
															Contract_Terms: text
														},
														() => {
															this.validateField('Contract_Terms', text);
														}
													);
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="contract-footer">
							<div className={classes.wrapper}>
								<Button
									//className="contract-next-button"
									className={classes.buttonSuccess}
									onClick={() => {
										if (this.props.contractId !== 0) {
											this.updateContract(this.props.contractId);
										} else {
											this.insertContract();
										}
									}}
									disabled={this.state.loadingInsert || this.state.loadingUpdate}
								>
									Save
								</Button>
								{(this.state.loadingInsert || this.state.loadingUpdate) && (
									<CircularProgress size={24} className={classes.buttonProgress} />
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
NewContract.propTypes = {
	classes: PropTypes.object.isRequired
};
export default withStyles(styles)(withApollo(withGlobalContent(NewContract)));
