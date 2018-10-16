import React, { Component } from 'react';
import InputForm from 'ui-components/InputForm/InputForm';
import { gql } from 'apollo-boost';
import withApollo from 'react-apollo/withApollo';
import ImageUpload from 'ui-components/ImageUpload/ImageUpload';
import Query from 'react-apollo/Query';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import SelectForm from 'ui-components/SelectForm/SelectForm';
import InputMask from 'react-input-mask';
import { withStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';
import SelectNothingToDisplay from '../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
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

class GeneralInfoProperty extends Component {
	DEFAULT_STATUS = {
		nameValid: true,
		addressValid: true,
		stateValid: true,
		cityValid: true,
		zipCodeValid: true,
		phoneNumberValid: true,
		faxValid: true,
		formValid: true
	};

	constructor(props) {
		super(props);
		this.state = {
			inputEnabled: true,
			open: false,
			scroll: 'paper',
			completedInput: false,
			loaded: false,
			name: '',
			legalName: '',
			description: '',
			location: '',
			address: '',
			optionalAddress: '',
			businessType: '',
			country: 6,
			state: 0,
			region: '',
			city: 0,
			management: '',
			phoneNumber: '',
			startDate: '',
			startWeek: 0,
			endWeek: 6,
			workWeek: '',
			avatar: 'url',
			otherPhoneNumber: '',
			room: '',
			rate: 0,
			fax: '',
			zipCode: '',
			phonePrefix: '505',
			email: '',
			Code: '',
			Code01: '',
			active: 1,
			suite: 0,
			...this.DEFAULT_STATUS,
			loadingInsert: false
		};
	}
	/**
     *  QUERIES to get the countries, cities and states
     */
	getCountriesQuery = gql`
		{
			getcatalogitem(Id: null, IsActive: 1, Id_Parent: null, Id_Catalog: 2) {
				Id
				Name
				IsActive
			}
		}
	`;

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

	/**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION *
     **********************************************************/
	ADD_COMPANY = gql`
		mutation insertCompanies($input: iParamBC!) {
			insbusinesscompanies(input: $input) {
				Id
				Name
				Description
			}
		}
	`;

	insertCompany = () => {
		this.setState(
			{
				loadingInsert: true
			},
			() => {
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
					//Create the mutation using apollo global client
					this.props.client
						.mutate({
							// Pass the mutation structure
							mutation: this.ADD_COMPANY,
							variables: {
								input: {
									Id: 150,
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
									Primary_Email: `'emailssssssss'`,
									Phone_Number: `'${this.state.phoneNumber}'`,
									Phone_Prefix: `'${this.state.phonePrefix}'`,
									City: parseInt(this.state.city),
									Id_Parent: 1,
									IsActive: parseInt(this.state.active),
									User_Created: 1,
									User_Updated: 1,
									Date_Created: "'2018-08-14'",
									Date_Updated: "'2018-08-14'",
									ImageURL: `'${this.state.avatar}'`,
									Start_Date: "'2018-08-14'",
									Contract_URL: "'firebase url'",
									Insurance_URL: "'firebase url'",
									Other_URL: "'firebase url'",
									Other01_URL: "'firebase url'",
									Suite: parseInt(this.state.suite),
									Contract_Status: "'C'"
								}
							}
						})
						.then((data) => {
							this.props.handleOpenSnackbar('success', 'Company Inserted!');
							this.setState(
								{
									loadingInsert: false
								},
								() => {
									this.props.closeModal();
								}
							);
						})
						.catch((err) => {
							this.props.handleOpenSnackbar('error', 'Error: Inserting Company: ' + err);
							this.setState({
								loadingInsert: false
							});
						});
				});
			}
		);
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
		//Create the mutation using apollo global client
		this.props.client
			.mutate({
				// Pass the mutation structure
				mutation: this.UPDATE_COMPANY,
				variables: {
					input: {
						Id: companyId,
						Code: `'${this.state.Code}'`,
						Code01: `'${this.state.Code}'`,
						Id_Contract: 1,
						Id_Company: 1,
						BusinessType: 1,
						Location: `'${this.state.address}'`,
						Location01: `'${this.state.optionalAddress}'`,
						Name: `'${this.state.legalName}'`,
						Description: `'${this.state.description}'`,
						Start_Week: this.state.startWeek,
						End_Week: this.state.endWeek,
						Legal_Name: `'${this.state.legalName}'`,
						Country: parseInt(this.state.country),
						State: parseInt(this.state.state),
						Rate: parseFloat(this.state.rate),
						Zipcode: parseInt(this.state.zipCode),
						Fax: `'${this.state.fax}'`,
						Primary_Email: `'${this.state.legalName}'`,
						Phone_Number: `'${this.state.phoneNumber}'`,
						Phone_Prefix: `'${this.state.phonePrefix}'`,
						City: parseInt(this.state.city),
						Id_Parent: 1,
						IsActive: parseInt(this.state.active),
						User_Created: 1,
						User_Updated: 1,
						Date_Created: "'2018-08-14'",
						Date_Updated: "'2018-08-14'",
						ImageURL: `'${this.state.avatar}'`,
						Start_Date: "'2018-08-14'",
						Contract_URL: "'firebase url'",
						Insurance_URL: "'firebase url'",
						Other_URL: "'firebase url'",
						Other01_URL: "'firebase url'",
						Suite: parseInt(this.state.suite),
						Contract_Status: "'C'"
					}
				}
			})
			.then((data) => {
				console.log('Server data response is: ' + data);
			})
			.catch((err) => console.log('The error is: ' + err));
	};

	/**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION  *
     **********************************************************/
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
	updateCountry = (id) => {
		this.setState(
			{
				country: id,
				state: 0,
				city: 0
			},
			() => {
				this.validateField('country', id);
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
	/*Validations */
	validateAllFields(fun) {
		let nameValid = this.state.name.trim().length >= 5;
		let addressValid = this.state.address.trim().length >= 5;

		let zipCodeValid = this.state.zipCode.toString().trim().length >= 2;
		let stateValid = this.state.state !== null && this.state.state !== 0 && this.state.state !== '';

		let cityValid = this.state.city !== null && this.state.city !== 0 && this.state.city !== '';

		let phoneNumberValid =
			this.state.phoneNumber
				.replace(/-/g, '')
				.replace(/ /g, '')
				.replace('+', '')
				.replace('(', '')
				.replace(')', '').length == 10;
		let fax = this.state.fax.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '');
		let faxValid = fax.length == 10 || fax.length == 0;

		this.setState(
			{
				nameValid,
				addressValid,
				zipCodeValid,
				stateValid,
				cityValid,
				phoneNumberValid,
				faxValid
			},
			() => {
				this.validateForm(fun);
			}
		);
	}

	validateField(fieldName, value) {
		let nameValid = this.state.nameValid;
		let addressValid = this.state.addressValid;

		let zipCodeValid = this.state.zipCodeValid;
		let stateValid = this.state.stateValid;

		let cityValid = this.state.cityValid;
		let phoneNumberValid = this.state.phoneNumberValid;
		let faxValid = this.state.faxValid;
		switch (fieldName) {
			case 'name':
				nameValid = value.trim().length >= 5;

				break;
			case 'address':
				addressValid = value.trim().length >= 5;

				break;

			case 'zipCode':
				zipCodeValid = value.trim().length >= 2;

				break;
			case 'state':
				stateValid = value !== null && value !== 0 && value !== '';

				break;
			case 'city':
				cityValid = value !== null && value !== 0 && value !== '';

				break;
			case 'phoneNumber':
				phoneNumberValid =
					value.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '')
						.length == 10;
				break;
			case 'fax':
				let fax = value.replace(/-/g, '').replace(/ /g, '').replace('+', '').replace('(', '').replace(')', '');
				faxValid = fax.length == 10 || fax.length == 0;
				break;
			default:
				break;
		}
		this.setState(
			{
				nameValid,
				addressValid,
				zipCodeValid,
				stateValid,
				cityValid,
				phoneNumberValid,
				faxValid
			},
			this.validateForm
		);
	}

	validateForm(func = () => {}) {
		this.setState(
			{
				formValid:
					this.state.nameValid &&
					this.state.addressValid &&
					this.state.zipCodeValid &&
					this.state.stateValid &&
					this.state.cityValid &&
					this.state.phoneNumberValid &&
					this.state.faxValid
			},
			func
		);
	}
	/*End of Validations*/
	render() {
		const { classes } = this.props;
		return (
			<div>
				<div className="general-information__content management-content">
					<div className="dialog-row management-card">
						<div className="card-form-row">
							<ImageUpload
								updateAvatar={(url) => {
									this.setState({
										avatar: url
									});
								}}
							/>
						</div>
						<br />
						<br />
						<div className="card-form-row">
							<span className="input-label primary">* Company Name</span>
							<InputForm
								value={this.state.name}
								change={(text) => {
									this.updateInput(text, 'name');
								}}
								error={!this.state.nameValid}
								maxLength="35"
							/>
						</div>
						<div className="card-form-row">
							<span className="input-label primary">* Address</span>
							<InputForm
								value={this.state.address}
								change={(text) => {
									this.updateInput(text, 'address');
								}}
								error={!this.state.addressValid}
								maxLength="50"
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
							/>
						</div>

						<div className="card-form-row">
							<span className="input-label primary">* State</span>
							<Query query={this.getStatesQuery} variables={{ parent: this.state.country }}>
								{({ loading, error, data, refetch, networkStatus }) => {
									//if (networkStatus === 4) return <LinearProgress />;
									if (loading) return <LinearProgress />;
									if (error) return <p>Error </p>;
									if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
										return (
											<SelectForm
												name="state"
												data={data.getcatalogitem}
												update={this.updateState}
												error={!this.state.stateValid}
												value={this.state.state}
												showNone={false}
											/>
										);
									}
									return <SelectNothingToDisplay />;
								}}
							</Query>
						</div>

						<div className="card-form-row">
							<span className="input-label primary">* City</span>
							<Query query={this.getCitiesQuery} variables={{ parent: this.state.state }}>
								{({ loading, error, data, refetch, networkStatus }) => {
									//if (networkStatus === 4) return <LinearProgress />;
									if (loading) return <LinearProgress />;
									if (error) return <p>Error </p>;
									if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
										return (
											<SelectForm
												name="city"
												data={data.getcatalogitem}
												update={this.updateCity}
												error={!this.state.cityValid}
												value={this.state.city}
												showNone={false}
											/>
										);
									}
									return <SelectNothingToDisplay />;
								}}
							</Query>
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
								type="number"
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
							/>
						</div>
						<div className="card-form-row">
							<span className="input-label primary">Fax Number</span>
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
							/>
						</div>
						<br />
						<br />
						<div className="contract-footer--bottom">
							<div className={classes.wrapper}>
								<Button
									//className="contract-next-button"
									className={classes.buttonSuccess}
									onClick={() => {
										this.insertCompany();
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
		// return (
		//     <Query query={this.getCompanyQuery} variables={{id: this.props.idCompany, Id_Parent: this.props.idCompany}}>
		//         {({loading, error, data, refetch}) => {
		//             if (loading) return <LinearProgress/>;
		//             if (error) return <p>Error </p>;
		//             if (data.getbusinesscompanies != null && data.getbusinesscompanies.length > 0) {
		//                 data.getbusinesscompanies.map((item) => {
		//                     this.setState({
		//                         loaded: true,
		//                         name: item.Name.trim(),
		//                         legalName: item.Legal_Name.trim(),
		//                         description: item.Description.trim(),
		//                         startWeek: item.Start_Week,
		//                         endWeek: item.End_Week,
		//                         address: item.Location.trim(),
		//                         optionalAddress: item.Location01.trim(),
		//
		//                         country: item.Country,
		//                         state: item.State,
		//                         city: item.City,
		//
		//                         rate: item.Rate,
		//                         email: item.Primary_Email.trim(),
		//                         phoneNumber: item.Phone_Number.trim(),
		//
		//                         Code: item.Code.trim(),
		//                         Code01: item.Code01.trim(),
		//                         zipCode: item.Zipcode,
		//                         fax: item.Fax,
		//                         startDate: item.Start_Date.trim(),
		//                         active: item.IsActive
		//                     });
		//                 });
		//                 return true;
		//             }
		//             return <p>Nothing to display </p>;
		//         }}
		//     </Query>
		// )
	}
}
GeneralInfoProperty.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(GeneralInfoProperty));
