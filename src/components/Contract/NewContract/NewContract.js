import React, { Component } from 'react';
import './index.css';
import InputForm from '../../ui-components/InputForm/InputForm';
import TextAreaForm from '../../ui-components/InputForm/TextAreaForm';
import status from '../../../data/statusContract.json';
import intervalDays from '../../../data/ownerExpirationNotice.json';
import SelectForm from '../../ui-components/SelectForm/SelectForm';
import { gql } from 'apollo-boost';
import withApollo from 'react-apollo/withApollo';
import InputDateForm from '../../ui-components/InputForm/InputDateForm';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Query from 'react-apollo/Query';
import AccountDialog from '../../ui-components/AccountDialog/AccountDialog';
import ContactDialog from '../../ui-components/AccountDialog/ContactDialog';
import SelectFormContractTemplate from '../../ui-components/SelectForm/SelectFormContractTemplate';
import { MySnackbarContentWrapper } from '../../Generic/SnackBar';
import { Snackbar } from '@material-ui/core';

class NewContract extends Component {
	constructor(props) {
		super(props);

		console.log("aqui esta la fecha", this.getNewDate());
		this.state = {
			Id: '',
			Id_Company: '',
			Contract_Name: '',
			Contrat_Owner: '',
			contractTemplateId: 1,
			contractExpiration: this.getNewDate(),
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
			IsActive: 0,
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
			openSnackbar: false,
			variantSnackbar: 'info',
			messageSnackbar: 'Dummy text!'
		};
	}

	/**
     * Snackbar methods
     */
	handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ openSnackbar: false });
	};

	handleOpenSnackbar = (variant, message) => {
		this.setState({
			openSnackbar: true,
			variantSnackbar: variant,
			messageSnackbar: message
		});
	};
	/**
     * End of SnackBars methods
     */

	updateStatus = (id) => {
		this.setState({
			IsActive: id
		});
	};

	updateProvidence = (id) => {
		this.setState({
			Billing_State: id
		});
	};

	updateCity = (id) => {
		this.setState({
			Billing_City: id
		});
	};

	updateOwnerExpirationNotification = (id) => {
		this.setState({
			Owner_Expiration_Notification: id
		});
	};

	updateIdCompany = (id) => {
		this.setState({
			Id_Entity: id
		});

		this.props.updateCompanyId(id);
	};

	updateIdContact = (id) => {
		this.setState({
			Id_User_Signed: id
		});
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
						Signed_Date: data.getcontracts[0].Signed_Date,
						Contract_Start_Date: data.getcontracts[0].Contract_Start_Date,
						Contract_Term: data.getcontracts[0].Contract_Term,
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
						this.setState({
							loading: false
						});
					}
				);
			})
			.catch((err) => console.log(err));
	};

	insertContract = () => {
		//Create the mutation using apollo global client
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
						Company_Signed: `'${this.state.Company_Signed}'`,
						Company_Signed_Date: `'${this.state.Company_Signed_Date}'`,
						Id_User_Billing_Contact: parseInt(this.state.Id_User_Billing_Contact),
						Billing_Street: `'${this.state.Billing_Street}'`,
						Billing_City: parseInt(this.state.Billing_City),
						Billing_State: parseInt(this.state.Billing_State),
						Billing_Zip_Code: parseInt(this.state.Billing_Zip_Code),
						Billing_Country: 6,
						Contract_Terms: `'${this.state.Contract_Terms}'`,
						Exhibit_B: "''",
						Exhibit_C: "''",
						Exhibit_D: "''",
						Exhibit_E: "''",
						Exhibit_F: "''",
						IsActive: 1,
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
				console.log('Server data response is: ' + data.inscontracts);
				this.props.update(data.inscontracts.Id);
			})
			.catch((err) => {
				this.handleOpenSnackbar('warning', 'Complete all inputs and try again');
			});
	};

	/**********************************************************
     *  MUTATION TO CREATE COMPANIES WITH GENERAL INFORMATION  *
     **********************************************************/

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

	render() {
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
													this.setState({
														Contract_Name: text
													});
												}}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Contract Owner</span>
											<InputForm
												value={this.state.Contrat_Owner}
												change={(text) => {
													this.setState({
														Contrat_Owner: text
													});
												}}
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
																update={(value) => {
																	this.setState({
																		Contract_Terms: value
																	});
																}}
																updateIdTemplate={(id) => {
																	this.setState({
																		contractTemplateId: id
																	});
																}}
																value={3}
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
												update={this.updateIdCompany}
												updateCompanySignedBy={(value) => {
													this.setState(
														{
															Company_Signed: value
														},
														() => {
															this.getCompanies(this.state.Company_Signed);
														}
													);
												}}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Customer Signed By</span>
											<ContactDialog
												valueSelected={this.state.Id_User_Signed}
												idContact={this.state.Id_Entity}
												update={this.updateIdContact}
												updateEmailContact={(email) => {
													this.setState({
														Electronic_Address: email
													});
												}}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Customer Signed Title</span>
											<InputForm
												value={this.state.User_Signed_Title}
												change={(text) => {
													this.setState({
														User_Signed_Title: text
													});
												}}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Customer Signed Date</span>
											<InputDateForm
												value={this.state.Signed_Date}
												placeholder={this.state.Signed_Date}
												change={(text) => {
													this.setState({
														Signed_Date: text
													});
												}}
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
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Contract Start Date</span>
											<InputDateForm
												placeholder={this.state.Contract_Start_Date}
												value={this.state.Contract_Start_Date}
												change={(text) => {
													this.setState({
														Contract_Start_Date: text
													});
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
														console.log('Data of cities' + data.getcatalogitem);
														return (
															<SelectForm
																data={data.getcatalogitem}
																update={(text) => {
																	this.setState({
																		Contract_Term: text
																	});
																}}
																value={this.state.Contract_Term}
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
												change={(text) => {
													this.setState({
														contractExpiration: text
													});
												}}
											/>
										</div>

										<div className="card-form-row">
											<span className="input-label primary">Owner Expiration Notice</span>
											<SelectForm
												data={intervalDays}
												update={this.updateOwnerExpirationNotification}
												value={this.state.Owner_Expiration_Notification}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Company Signed By</span>

											<InputForm value={this.state.CompanySignedName} change={(text) => { }} />
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Company Signed Date</span>
											<InputDateForm
												value={this.state.Company_Signed_Date}
												change={(text) => {
													this.setState({
														Company_Signed_Date: text
													});
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
											<ContactDialog
												idContact={this.state.Id_Entity}
												update={(id) => {
													this.setState({
														Id_User_Billing_Contact: id
													});
												}}
												updateEmailContact={(email) => { }}
											/>
										</div>
										<div className="card-form-row">
											<span className="input-label primary">Billing Street</span>
											<InputForm
												value={this.state.Billing_Street}
												change={(text) => {
													this.setState({
														Billing_Street: text
													});
												}}
											/>
										</div>

										{/*<div className="card-form-row">*/}
										{/*<span className="input-label primary">Billing Country</span>*/}
										{/*<Query query={this.getCountriesQuery}>*/}
										{/*{({loading, error, data, refetch, networkStatus}) => {*/}
										{/*//if (networkStatus === 4) return <LinearProgress />;*/}
										{/*if (loading) return <LinearProgress/>;*/}
										{/*if (error) return <p>Error </p>;*/}
										{/*if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {*/}
										{/*console.log('Data of cities' + data.getcatalogitem);*/}
										{/*return (*/}
										{/*<SelectForm*/}
										{/*data={data.getcatalogitem}*/}
										{/*update={this.updateCountry}*/}
										{/*value={this.state.Billing_Country}*/}
										{/*/>*/}
										{/*);*/}
										{/*}*/}
										{/*return <p>Nothing to display </p>;*/}
										{/*}}*/}
										{/*</Query>*/}
										{/*</div>*/}

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
														console.log('Data of cities' + data.getcatalogitem);
														return (
															<SelectForm
																data={data.getcatalogitem}
																update={this.updateProvidence}
																value={this.state.Billing_State}
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
														console.log('Data of cities' + data.getcatalogitem);
														return (
															<SelectForm
																data={data.getcatalogitem}
																update={this.updateCity}
																value={this.state.Billing_City}
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
													this.setState({
														Billing_Zip_Code: text
													});
												}}
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
													this.setState({
														Contract_Terms: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="contract-footer">
							<div
								className="contract-next-button"
								onClick={() => {
									//alert(this.getNewDate());
									this.insertContract();
								}}
							>
								Save
							</div>
						</div>
					</div>
				</div>
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
			</div>
		);
	}
}

export default withApollo(NewContract);
