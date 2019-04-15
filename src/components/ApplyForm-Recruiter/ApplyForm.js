import React, { Component } from 'react';
import {
	ADD_APLICANT_EDUCATION,
	ADD_APLICANT_PREVIOUS_EMPLOYMENT,
	ADD_LANGUAGES,
	CREATE_APPLICATION
} from './Mutations';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import Query from 'react-apollo/Query';
import { GET_LANGUAGES_QUERY, GET_POSITIONS_QUERY, GET_STATES_QUERY } from './Queries';
import './index.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputRange from './ui/InputRange/InputRange';
import InputRangeDisabled from './ui/InputRange/InputRangeDisabled';
import withApollo from 'react-apollo/withApollo';
import studyTypes from './data/studyTypes';
import languageLevelsJSON from './data/languagesLevels';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import CircularProgressLoading from '../material-ui/CircularProgressLoading';
import Route from 'react-router-dom/es/Route';
import InputMask from 'react-input-mask';

const uuidv4 = require('uuid/v4');

class ApplyForm extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
			firstName: '',
			middleName: '',
			lastName: '',
			date: '',
			streetAddress: '',
			aptNumber: '',
			city: '',
			state: '',
			zipCode: '',
			homePhone: '',
			cellPhone: '',
			socialSecurityNumber: '',
			birthDay: '',
			car: '',
			typeOfId: '',
			expireDateId: '',
			emailAddress: '',
			positionApplyingFor: 1,
			idealJob: '',
			dateAvailable: '',
			scheduleRestrictions: '',
			scheduleExplain: '',
			convicted: '',
			convictedExplain: '',
			socialNetwork: '',
			comment: '',

			// Languages array
			languages: [],

			// Skills array
			skills: [],

			// Schools array
			schools: [],

			// Military Service state fields
			branch: '',
			startDateMilitaryService: '',
			endDateMilitaryService: '',
			rankAtDischarge: '',
			typeOfDischarge: '',

			// Previous Employment
			previousEmployment: [],
			companyName: '',
			companyPhone: '',
			companyAddress: '',
			companySupervisor: '',
			companyJobTitle: '',
			companyPayRate: '',
			companyStartDate: '',
			companyEndDate: '',
			companyReasonForLeaving: '',

			percent: 50,
			insertDialogLoading: false,
			graduated: false,
			previousEmploymentPhone: '',

			// Application id property state is used to save languages, education, mulitary services, skills
			applicationId: 0,

			// Languages catalog
			languagesLoaded: []
		};
	}

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	// To validate all the inputs and set a red border when the input is invalid
	validateInvalidInput = () => {
		if (document.addEventListener) {
			document.addEventListener(
				'invalid',
				(e) => {
					e.target.className += ' invalid-apply-form';
				},
				true
			);
		}
	};

	insertApplicationInformation = (history) => {
		this.setState(
			{
				insertDialogLoading: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: CREATE_APPLICATION,
						variables: {
							application: {
								firstName: this.state.firstName,
								middleName: this.state.middleName,
								lastName: this.state.lastName,
								date: this.state.date,
								streetAddress: this.state.applicantAddress,
								aptNumber: this.state.aptNumber,
								city: this.state.city,
								state: this.state.state,
								zipCode: this.state.zipCode,
								homePhone: this.state.homePhone,
								cellPhone: this.state.cellPhone,
								socialSecurityNumber: this.state.socialSecurityNumber,
								birthDay: this.state.birthDay,
								car: this.state.car,
								typeOfId: parseInt(this.state.typeOfId),
								expireDateId: this.state.expireDateId,
								emailAddress: this.state.emailAddress,
								positionApplyingFor: parseInt(this.state.positionApplyingFor),
								dateAvailable: this.state.dateAvailable,
								scheduleRestrictions: this.state.scheduleRestrictions,
								scheduleExplain: this.state.scheduleExplain,
								convicted: this.state.convicted,
								convictedExplain: this.state.convictedExplain,
								comment: this.state.comment
							}
						}
					})
					.then(({ data }) => {
						let idApplication = data.addApplication.id;

						this.setState(
							{
								applicationId: idApplication
							},
							() => {
								// When the application id state property is updated, insert the other form sections

								// to remove all the uuid properties in the object
								this.state.languages.forEach((item) => {
									delete item.uuid;
								});

								this.state.languages.forEach((item) => {
									item.ApplicationId = idApplication;
								});

								this.props.client
									.mutate({
										mutation: ADD_LANGUAGES,
										variables: {
											application: this.state.languages
										}
									})
									.then(() => {
										// to remove all the uuid properties in the object
										this.state.schools.forEach((item) => {
											delete item.uuid;
										});

										this.state.schools.forEach((item) => {
											item.ApplicationId = idApplication;
										});

										// Then insert education list
										this.props.client
											.mutate({
												mutation: ADD_APLICANT_EDUCATION,
												variables: {
													application: this.state.schools
												}
											})
											.then(() => {
												// to remove all the uuid properties in the object
												this.state.previousEmployment.forEach((item) => {
													delete item.uuid;
												});

												this.state.previousEmployment.forEach((item) => {
													item.ApplicationId = idApplication;
												});

												// Then insert previous employment
												this.props.client
													.mutate({
														mutation: ADD_APLICANT_PREVIOUS_EMPLOYMENT,
														variables: {
															application: this.state.previousEmployment
														}
													})
													.then(() => {
														// Hide the loading dialog and redirect to component with success message
														this.setState(
															{
																insertDialogLoading: false
															},
															() => {
																// Insert Languages

																history.push({
																	pathname: '/employment-application-message'
																});
															}
														);
													})
													.catch();
											})
											.catch();
									})
									.catch();
							}
						);
					})
					.catch(() => {
						this.setState(
							{
								insertDialogLoading: false
							},
							() => {
								// Show a error message
								alert('Error saving information');
							}
						);
					});
			}
		);
	};

	// To get a list of languages from API
	getLanguagesList = () => {
		this.props.client
			.query({
				query: GET_LANGUAGES_QUERY
			})
			.then(({ data }) => {
				this.setState({
					languagesLoaded: data.getcatalogitem
				});
			})
			.catch();
	};

	componentWillMount() {
		// Get languages list from catalogs
		this.getLanguagesList();
	}

	render() {
		//this.validateInvalidInput();
		return (
			<Route
				render={({ history }) => (
					<div>
						<header className="Header">Application Form</header>
						<form
							className="ApplyForm apply-form"
							onSubmit={(e) => {
								// To cancel the default submit event
								e.preventDefault();
								// Call mutation to create a application
								this.insertApplicationInformation(history);
							}}
						>

							<div className="ApplyBlock">
								<h4 className="ApplyBlock-title">Applicant Information</h4>
								<div className="row">
									<div className="col-md-3">
										<span className="primary">* First Name</span>
										<div className="input-container--validated">
											<input
												/*onChange={(event) => {
													this.setState({
														firstName: event.target.value
													});
												}}*/
												value={this.state.firstName}
												name="firstName"
												type="text"
												className="form-control"
												required
												min="0"
												maxLength="50"
												minLength="3"
											/>
											<span className="check-icon" />
										</div>
									</div>

									<div className="col-md-3">
										<div className="row">
											<span className="primary">Middle Name</span>
											<input
												/*onChange={(event) => {
													this.setState({
														middleName: event.target.value
													});
												}}*/
												value={this.state.middleName}
												name="midleName"
												type="text"
												className="form-control"
												min="0"
												maxLength="50"
												minLength="1"
											/>
											<span className="check-icon" />
											<i className="optional" />
										</div>
									</div>
									<div className="col-md-3">
										<label htmlFor="">* Region's Code</label>
										<input
											required
											type="text"
											className="form-control"
											name="code"
											onChange={this.handleChange}
											value={this.state.code}
											maxLength="10"
											onBlur={this.handleValidate}
										/>
									</div>
									<div className="col-md-3">
										<span className="primary">* Last Name</span>
										<div className="input-container--validated">
											<input
												onChange={(event) => {
													this.setState({
														lastName: event.target.value
													});
												}}
												value={this.state.lastName}
												name="lastName"
												type="text"
												className="form-control"
												required
												min="0"
												maxLength="50"
												minLength="3"
											/>
											<span className="check-icon" />
										</div>
									</div>

									<div className="col-md-3">
										<span className="primary"> * Date</span>
										<div className="input-container--validated">
											<input
												onChange={(event) => {
													this.setState({
														date: event.target.value
													});
												}}
												value={this.state.date}
												name="date"
												type="date"
												className="form-control"
												required
												min="0"
												maxLength="50"
											/>
											<span className="check-icon" />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-8">
										<span className="primary"> * Street Address</span>
										<div className="input-container--validated">
											<input
												onChange={(event) => {
													this.setState({
														applicantAddress: event.target.value
													});
												}}
												value={this.state.applicantAddress}
												name="streetAddress"
												type="text"
												className="form-control"
												required
												min="0"
												maxLength="50"
												minLength="5"
											/>
											<span className="check-icon" />
										</div>
									</div>
									<div className="col-md-4">
										<span className="primary">Apt Number</span>
										<input
											onChange={(event) => {
												this.setState({
													aptNumber: event.target.value
												});
											}}
											value={this.state.aptNumber}
											name="aptNumber"
											type="number"
											className="form-control"
											min="0"
											maxLength="50"
											minLength="5"
										/>
										<span className="check-icon" />
										<i className="optional" />
									</div>
								</div>
								<div className="row">
									<div className="col-md-4">
										<span className="primary"> State</span>
										<Query query={GET_STATES_QUERY} variables={{ parent: 6 }}>
											{({ loading, error, data, refetch, networkStatus }) => {
												//if (networkStatus === 4) return <LinearProgress />;
												if (loading) return <LinearProgress />;
												if (error) return <p>Error </p>;
												if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
													return (
														<select name="state" id="state" required className="form-control">
															<option value="">* Select a state</option>
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
									<div className="col-md-4">
										<span className="primary"> * City</span>
										<div className="input-container--validated">
											<input
												onChange={(event) => {
													this.setState({
														city: event.target.value
													});
												}}
												value={this.state.city}
												name="city"
												type="text"
												className="form-control"
												required
												min="0"
												maxLength="30"
												minLength="3"
											/>
											<span className="check-icon" />
										</div>
									</div>
									<div className="col-md-4">
										<span className="primary"> * Zip Code</span>
										<div className="input-container--validated">
											<InputMask
												id="zipCode"
												name="zipCode"
												mask="99999-99999"
												maskChar=" "
												className="form-control"
												onChange={(event) => {
													this.setState({
														zipCode: event.target.value
													});
												}}
												value={this.state.zipCode}
												placeholder="99999-99999"
												required
												minLength="15"
											/>

											<span className="check-icon" />
										</div>

										{/*<input*/}
										{/*onChange={(event) => {*/}
										{/*this.setState({*/}
										{/*zipCode: event.target.value*/}
										{/*});*/}
										{/*}}*/}
										{/*value={this.state.zipCode}*/}
										{/*name="zipCode"*/}
										{/*type="number"*/}
										{/*className="form-control"*/}
										{/*required*/}
										{/*maxLength="5"*/}
										{/*minLength="4"*/}
										{/*min="10000"*/}
										{/*max="99999"*/}
										{/*/>*/}
									</div>
								</div>
								<div className="row">
									<div className="col-md-4">
										<span className="primary"> Home Phone</span>
										<InputMask
											id="home-number"
											name="homePhone"
											mask="+(999) 999-9999"
											maskChar=" "
											value={this.state.homePhone}
											className="form-control"
											onChange={(event) => {
												this.setState({
													homePhone: event.target.value
												});
											}}
                                            placeholder="+(___) ___-____"
											minLength="15"
										/>
										<i className="optional" />
									</div>

									<div className="col-md-4">
										<span className="primary"> * Cell Phone</span>
										<div className="input-container--validated">
											<InputMask
												id="cell-number"
												name="cellPhone"
												mask="+(999) 999-9999"
												maskChar=" "
												value={this.state.cellPhone}
												className="form-control"
												onChange={(event) => {
													this.setState({
														cellPhone: event.target.value
													});
												}}
                                                placeholder="+(___) ___-____"
												required
												minLength="15"
											/>
											<span className="check-icon" />
										</div>

										{/*<input*/}
										{/*onChange={(event) => {*/}
										{/*this.setState({*/}
										{/*cellPhone: event.target.value*/}
										{/*});*/}
										{/*}}*/}
										{/*value={this.state.cellPhone}*/}
										{/*name="cellPhone"*/}
										{/*type="tel"*/}
										{/*className="form-control"*/}
										{/*required*/}
										{/*min="0"*/}
										{/*maxLength="10"*/}
										{/*minLength="10"*/}
										{/*/>*/}
									</div>

									<div className="col-md-4">
										<span className="primary"> * Social Security Number</span>
										<div className="input-container--validated">
											<InputMask
												id="socialSecurityNumber"
												name="socialSecurityNumber"
												mask="999-99-9999"
												maskChar=" "
												className="form-control"
												onChange={(event) => {
													this.setState({
														socialSecurityNumber: event.target.value
													});
												}}
												value={this.state.socialSecurityNumber}
												placeholder="999-99-9999"
												required
												minLength="15"
											/>
											<span className="check-icon" />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6">
										<span className="primary"> Birth Day</span>
										<div className="input-container--validated">
											<input
												onChange={(event) => {
													this.setState({
														birthDay: event.target.value
													});
												}}
												value={this.state.birthDay}
												name="birthDay"
												type="date"
												className="form-control"
												required
												min="0"
												maxLength="50"
												minLength="10"
											/>
											<span className="check-icon" />
										</div>
									</div>
									<div className="col-md-6">
										<span className="primary"> Do you own transportation?</span>
										<input
											onChange={(event) => {
												this.setState({
													car: event.target.value
												});
											}}
											value={this.state.car}
											name="car"
											type="checkbox"
											className="form-control"
											required
											min="0"
											maxLength="50"
											minLength="10"
										/>
									</div>
								</div>
								<div className="row">
									<div className="col-md-6">
										<span className="primary"> Type Of ID</span>
										<select
											name="typeOfID"
											id="typeOfID"
											className="form-control"
											onChange={(e) => {
												this.setState({
													typeOfId: e.target.value
												});
											}}
										>
											<option value="">Select an option</option>
											<option value="1">Birth certificate</option>
											<option value="2">Social Security card</option>
											<option value="3">State-issued driver's license</option>
											<option value="4">State-issued ID</option>
											<option value="5">Passport</option>
											<option value="6">Department of Defense Identification Card</option>
											<option value="7">Green Card</option>
										</select>
									</div>
									<div className="col-md-6">
										<span className="primary"> Expire Date ID</span>
										<div className="input-container--validated">
											<input
												onChange={(event) => {
													this.setState({
														expireDateId: event.target.value
													});
												}}
												value={this.state.expireDateId}
												name="expireDateId"
												type="date"
												className="form-control"
												required
												min="0"
												maxLength="50"
												minLength="10"
											/>
											<span className="check-icon" />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-12">
										<span className="primary"> Email Address</span>
										<div className="input-container--validated">
											<input
												onChange={(event) => {
													this.setState({
														emailAddress: event.target.value
													});
												}}
												value={this.state.emailAddress}
												name="emailAddress"
												type="email"
												className="form-control"
												required
												min="0"
												pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
												maxLength="50"
												minLength="8"
											/>
											<span className="check-icon" />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-4">
										<span className="primary"> Position Applying for</span>
										<Query query={GET_POSITIONS_QUERY}>
											{({ loading, error, data, refetch, networkStatus }) => {
												console.log("data del position 0 ", data);
												if (loading) return <LinearProgress />;
												if (error) return <p>Error </p>;
												console.log("data del position1 ", data.getposition);
												if (data.getposition != null && data.getposition.length > 0) {
													console.log("data del position2 ", data.getposition);
													return (
														<select
															name="city"
															id="city"
															onChange={(event) => {
																this.setState({
																	positionApplyingFor: event.target.value
																});
															}}
															className="form-control"
														>
															<option value="">Select a position</option>

															{data.getposition.map((item) => (
																<option value={item.Id}>{item.Position}</option>
															))}
														</select>
													);
												}
												return <SelectNothingToDisplay />;
											}}
										</Query>
										<i className="optional" />
									</div>
									<div className="col-md-4">
										<span className="primary"> Ideal Job</span>
										<div className="input-container--validated">
											<input
												onChange={(event) => {
													this.setState({
														idealJob: event.target.value
													});
												}}
												value={this.state.idealJob}
												name="idealJob"
												type="text"
												className="form-control"
												required
												min="0"
												minLength="3"
												maxLength="50"
											/>
											<span className="check-icon" />
										</div>
									</div>
									<div className="col-md-4">
										<span className="primary"> Date Available</span>
										<div className="input-container--validated">
											<input
												onChange={(event) => {
													this.setState({
														dateAvailable: event.target.value
													});
												}}
												value={this.state.dateAvailable}
												name="dateAvailable"
												type="date"
												className="form-control"
												required
												min="0"
												maxLength="50"
											/>
											<span className="check-icon" />
										</div>
									</div>
								</div>
								<div className="row">
									<div className="col-md-4">
										<span className="primary"> Do you have any schedule restrictions? </span>
										<div className="col-md-12">
											<input
												onChange={(event) => {
													this.setState({
														scheduleRestrictions: event.target.value
													});
												}}
												value="1"
												type="radio"
												name="scheduleRestrictions"
												className=""
											/>
											<label className="radio-label"> Yes</label>
											<input
												onChange={(event) => {
													this.setState({
														scheduleRestrictions: event.target.value,
														scheduleExplain: ''
													});
												}}
												value="0"
												type="radio"
												name="scheduleRestrictions"
												className=""
											/>
											<label className="radio-label"> No</label>
										</div>
										<span className="check-icon" />
									</div>
									<div className="col-md-8">
										<span className="primary"> If yes, please explain </span>
										{this.state.scheduleRestrictions === '0' ? (
											<textarea
												onChange={(event) => {
													this.setState({
														scheduleExplain: event.target.value
													});
												}}
												value={this.state.scheduleExplain}
												name="form-control"
												cols="30"
												rows="3"
												disabled
												className="form-control textarea-apply-form"
											/>
										) : (
												<textarea
													onChange={(event) => {
														this.setState({
															scheduleExplain: event.target.value
														});
													}}
													value={this.state.scheduleExplain}
													name="form-control"
													cols="30"
													rows="3"
													required
													className="form-control textarea-apply-form"
												/>
											)}
									</div>
								</div>
								<div className="row">
									<div className="col-md-4">
										<span className="primary"> Have you ever been convicted of a felony? </span>
										<input
											onChange={(event) => {
												this.setState({
													convicted: event.target.value
												});
											}}
											value="1"
											type="radio"
											name="convicted"
											className=""
										/>
										<label className="radio-label"> Yes</label>
										<input
											onChange={(event) => {
												this.setState({
													convicted: event.target.value,
													convictedExplain: ''
												});
											}}
											value="0"
											type="radio"
											name="convicted"
											className=""
										/>
										<label className="radio-label"> No</label>
										<span className="check-icon" />
									</div>
									<div className="col-md-8">
										<span className="primary"> If yes, please explain </span>
										{this.state.convicted === '0' ? (
											<textarea
												onChange={(event) => {
													this.setState({
														convictedExplain: event.target.value
													});
												}}
												value={this.state.convictedExplain}
												name="form-control"
												cols="30"
												disabled
												rows="3"
												className="form-control textarea-apply-form"
											/>
										) : (
												<textarea
													onChange={(event) => {
														this.setState({
															convictedExplain: event.target.value
														});
													}}
													value={this.state.convictedExplain}
													name="form-control"
													cols="30"
													required
													rows="3"
													className="form-control textarea-apply-form"
												/>
											)}
									</div>
								</div>
								<div className="row">
									<div className="col-md-12">
										<span className="primary"> How did you hear about Tumi Staffing </span>
									</div>
									<div className="col-md-12">
										<select
											name="networks"
											id="networks"
											onChange={(event) => {
												this.setState({
													socialNetwork: event.target.value
												});
											}}
											required
											className="form-control"
										>
											<option value="">Select a option</option>
											<option value="facebook">Facebook</option>
											<option value="linkedin">Linkedin</option>
											<option value="instagram">Instagram</option>
											<option value="newspaper">News Paper</option>
											<option value="journals">Journals</option>
											<option value="others">Other</option>
										</select>
										<div className="row">
											<div className="col-md-12">
												{this.state.socialNetwork === 'others' ? (
													<textarea
														onChange={(event) => {
															this.setState({
																comment: event.target.value
															});
														}}
														placeholder="Explain how did you hear about Tumi Staffing"
														value={this.state.comment}
														required
														name="comment"
														cols="20"
														rows="4"
														className="form-control textarea-apply-form"
													/>
												) : (
														''
													)}
											</div>
										</div>
									</div>
								</div>
							</div>
							{/*renderApplicantInformationSection()*/}
							{/*{renderlanguagesSection()}*/}
							{/*{renderEducationSection()}*/}
							{/*/!*{renderMilitaryServiceSection()}*!/*/}
							{/*{renderPreviousEmploymentSection()}*/}
							{/*{renderSkillsSection()}*/}
							{/*{renderInsertDialogLoading()}*/}
							<div className="Apply-container">
								<div className="row">
									<div className="col-md-12 buttons-group-right">
										<button type="reset" className="btn-circle btn-lg red">
											<i className="fas fa-eraser" />
										</button>
										<button type="submit" className="btn-circle btn-lg">
											<i className="fas fa-save" />
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
				)}
			/>
		);
	}
}
export default withApollo(ApplyForm);
