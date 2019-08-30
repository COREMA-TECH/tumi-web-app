import React, { Component } from 'react';
import { ADD_APLICANT_PREVIOUS_EMPLOYMENT, REMOVE_APPLICANT_PREVIOUS_EMPLOYMENT, UPDATE_APLICANT_PREVIOUS_EMPLOYMENT } from '../../Mutations';
import withApollo from 'react-apollo/withApollo';
import { GET_APPLICATION_PREVIOUS_EMPLOYMENT_BY_ID } from '../../Queries';
import CircularProgressLoading from '../../../material-ui/CircularProgressLoading';
import withGlobalContent from '../../../Generic/Global';
import PreviousEmploymentCard from '../../../ui-components/PreviousEmploymentCard/PreviousEmploymentCard';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import InputMask from 'react-input-mask';

const menuSpanish = require(`../languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const previousEmploymentLabels = require(`../languagesJSON/${localStorage.getItem('languageForm')}/previousEmployment`);

const uuidv4 = require('uuid/v4');

class PreviousEmployment extends Component {
	constructor(props) {
		super(props);

		this.state = {
			editing: false,
			applicationId: null,
			previousEmployment: [],
			newPreviousEmployment: [],
			loading: false,
			open: false
		};
	}

	// To open the skill dialog
	handleClickOpen = () => {
		this.setState({ open: true });
	};

	// To close the skill dialog
	handleClose = () => {
		this.setState({
			open: false,
			editing: false,
			previousEmploymentPhone: ''
		});
	};

	insertPreviousEmploymentApplication = (item) => {
		//Remove uuid property in the item
		delete item.uuid;
		if (isNaN(item.payRate)) {
			item.payRate = 0;
		}

		this.props.client
			.mutate({
				mutation: ADD_APLICANT_PREVIOUS_EMPLOYMENT,
				variables: {
					application: item
				}
			})
			.then(() => {
				this.setState({
					editing: false
				});

				document.getElementById('form-previous-employment').reset();
				this.handleClose();

				this.props.handleOpenSnackbar('success', 'Successfully created', 'bottom', 'right');

				this.getPreviousEmploymentList(this.state.applicationId);
			})
			.catch((error) => {
				// Replace this alert with a Snackbar message error
				this.props.handleOpenSnackbar(
					'error',
					'Error: error to save previous employment. Please, try again!',
					'bottom',
					'right'
				);
			});
	};


	updatePreviousEmploymentApplication = (item) => {
		//Remove uuid property in the item
		delete item.uuid;
		if (isNaN(item.payRate)) {
			item.payRate = 0;
		}

		this.props.client
			.mutate({
				mutation: UPDATE_APLICANT_PREVIOUS_EMPLOYMENT,
				variables: {
					application: item
				}
			})
			.then(() => {
				this.setState({
					editing: false,
					id: 0
				});

				document.getElementById('form-previous-employment').reset();
				this.handleClose();

				this.props.handleOpenSnackbar('success', 'Successfully updated', 'bottom', 'right');

				this.getPreviousEmploymentList(this.state.applicationId);
			})
			.catch((error) => {
				// Replace this alert with a Snackbar message error
				this.props.handleOpenSnackbar(
					'error',
					'Error: error to save previous employment. Please, try again!',
					'bottom',
					'right'
				);
			});
	};

	// To get a list of previous employments saved from API
	getPreviousEmploymentList = (id) => {
		this.setState(
			{
				loading: true
			},
			() => {
				this.props.client
					.query({
						query: GET_APPLICATION_PREVIOUS_EMPLOYMENT_BY_ID,
						variables: {
							id: id
						},
						fetchPolicy: 'no-cache'
					})
					.then(({ data }) => {
						this.setState({
							previousEmployment: data.applications[0].employments,
							loading: false
						});
					})
					.catch((error) => {
						this.props.handleOpenSnackbar(
							'error',
							'Error to show previous employment. Please, try again!',
							'bottom',
							'right'
						);
					});
			}
		);
	};

	removePreviousEmploymentById = (id) => {
		this.props.client
			.mutate({
				mutation: REMOVE_APPLICANT_PREVIOUS_EMPLOYMENT,
				variables: {
					id: id
				}
			})
			.then(({ data }) => {
				this.props.handleOpenSnackbar('success', 'Successfully removed', 'bottom', 'right');
				this.getPreviousEmploymentList(this.state.applicationId);
			})
			.catch((error) => {
				this.props.handleOpenSnackbar(
					'error',
					'Error to remove previous employment. Please, try again!',
					'bottom',
					'right'
				);
			});
	};

	handleOpenNewModal = () => {
		this.setState({
			open: true,
			editing: true,
			id: 0,
			previousEmploymentPhone: '',
			startPreviousEmployment: null,
			endPreviousEmployment: null,
			companyNameEmployment: '',
			companyAddressEmployment: '',
			companySupervisor: '',
			companyJobTitle: '',
			companyPayRate: null,
			companyReasonForLeaving: ''
		});
	}

	handleOpenEditModal = ({ companyName, address, jobTitle, phone, supervisor, payRate, startDate, endDate, id, reasonForLeaving }) => {
		this.setState({
			open: true,
			editing: true,
			id,
			previousEmploymentPhone: phone,
			startPreviousEmployment: startDate ? startDate.substring(0, 10) : null,
			endPreviousEmployment: endDate ? endDate.substring(0, 10) : null,
			companyNameEmployment: companyName,
			companyAddressEmployment: address,
			companySupervisor: supervisor,
			companyJobTitle: jobTitle,
			companyPayRate: payRate,
			companyReasonForLeaving: reasonForLeaving
		}, () => {

		});
	}

	onChangeValue = (event) => {
		var element = event.target;
		this.setState(() => ({
			[element.name]: element.value
		}));
	}

	componentWillMount() {
		this.setState(
			{
				applicationId: this.props.applicationId
			},
			() => {
				this.getPreviousEmploymentList(this.state.applicationId);
			}
		);
	}

	render() {
		// To render the Skills Dialog
		let renderPreviousEmploymentDialogForm = () => (
			<Dialog fullWidth open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
				<form
					autoComplete="off"
					id="form-previous-employment"
					onSubmit={(e) => {
						e.preventDefault();
						e.stopPropagation();

						try {

							let { companyNameEmployment, previousEmploymentPhone, companyAddressEmployment, companySupervisor, companyJobTitle, companyPayRate, startPreviousEmployment, endPreviousEmployment, companyReasonForLeaving, applicationId } = this.state;
							let formData = {
								companyName: companyNameEmployment,
								phone: previousEmploymentPhone,
								address: companyAddressEmployment,
								supervisor: companySupervisor,
								jobTitle: companyJobTitle,
								payRate: companyPayRate,
								startDate: startPreviousEmployment,
								endDate: endPreviousEmployment,
								reasonForLeaving: companyReasonForLeaving,
							}
							let values = [];
							Object.values(formData).map(value => {
								if (value)
									values.push(value);
							})
							if (values.length == 0)
								this.props.handleOpenSnackbar('warning', 'You need to fill at least one field', 'bottom', 'right');
							else {
								let item = {
									uuid: uuidv4(),
									...formData,
									ApplicationId: applicationId
								};

								if (this.state.id != 0)
									this.updatePreviousEmploymentApplication({ ...item, id: this.state.id });
								else
									this.insertPreviousEmploymentApplication(item);
							}
						} catch (e) { }
					}}
					className="apply-form"
				>
					<br />
					<DialogContent>
						{this.state.editing ? (
							<div className="form-section-1 row">
								<div className="col-md-6">
									<span className="primary">{previousEmploymentLabels[0].label}</span>
									<input
										id="companyNameEmployment"
										form="form-previous-employment"
										name="companyNameEmployment"
										type="text"
										className="form-control"
										min="0"
										maxLength="50"
										minLength="3"
										value={this.state.companyNameEmployment}
										onChange={this.onChangeValue}
									/>
								</div>
								<div className="col-md-6">
									<span className="primary"> {previousEmploymentLabels[1].label}</span>
									<InputMask
										id="companyPhoneEmployment"
										form="form-previous-employment"
										name="phoneEmployment"
										mask="+(999) 999-9999"
										maskChar=" "
										value={this.state.previousEmploymentPhone}
										className="form-control"
										onChange={(event) => {
											this.setState({
												previousEmploymentPhone: event.target.value
											});
										}}
										placeholder="+(___) ___-____"
										minLength="15"
									/>
								</div>
								<div className="col-md-6">
									<span className="primary"> {previousEmploymentLabels[2].label}</span>
									<input
										id="companyAddressEmployment"
										form="form-previous-employment"
										name="companyAddressEmployment"
										type="text"
										className="form-control"
										min="0"
										maxLength="50"
										minLength="3"
										value={this.state.companyAddressEmployment}
										onChange={this.onChangeValue}
									/>
								</div>
								<div className="col-md-6">
									<span className="primary"> {previousEmploymentLabels[3].label}</span>
									<input
										id="companySupervisor"
										form="form-previous-employment"
										name="companySupervisor"
										type="text"
										className="form-control"
										min="0"
										maxLength="50"
										minLength="3"
										value={this.state.companySupervisor}
										onChange={this.onChangeValue}
									/>
								</div>
								<div className="col-md-6">
									<span className="primary">{previousEmploymentLabels[4].label}</span>
									<input
										id="companyJobTitle"
										form="form-previous-employment"
										name="companyJobTitle"
										type="text"
										className="form-control"
										min="0"
										maxLength="50"
										minLength="3"
										value={this.state.companyJobTitle}
										onChange={this.onChangeValue}
									/>
								</div>
								<div className="col-md-6">
									<span className="primary"> {previousEmploymentLabels[5].label}</span>
									<input
										id="companyPayRate"
										form="form-previous-employment"
										name="companyPayRate"
										type="number"
										step="0.01"
										className="form-control"
										min="0"
										maxLength="50"
										minLength="3"
										value={this.state.companyPayRate}
										onChange={this.onChangeValue}
									/>
								</div>
								<div className="col-md-6">
									<span className="primary">{previousEmploymentLabels[6].label}</span>
									<input
										id="companyStartDate"
										onChange={(event) => {
											this.setState({
												startPreviousEmployment: event.target.value
											});
										}}
										form="form-previous-employment"
										name="startPreviousEmployment"
										type="date"
										className="form-control"
										max={this.state.endPreviousEmployment}
										value={this.state.startPreviousEmployment}
									/>
								</div>
								<div className="col-md-6">
									<span className="primary">{previousEmploymentLabels[7].label} </span>
									<input
										id="companyEndDate"
										onChange={(event) => {
											this.setState({
												endPreviousEmployment: event.target.value
											});
										}}
										form="form-previous-employment"
										name="endPreviousEmployment"
										type="date"
										className="form-control"
										min={this.state.startPreviousEmployment}
										value={this.state.endPreviousEmployment}
									/>
								</div>
								<div className="col-12">
									<span className="primary"> {previousEmploymentLabels[8].label}</span>
									<textarea
										id="companyReasonForLeaving"
										form="form-previous-employment"
										name="companyReasonForLeaving"
										className="form-control textarea-apply-form"
										value={this.state.companyReasonForLeaving}
										onChange={this.onChangeValue}
									/>
								</div>
							</div>
						) : (
								''
							)}
					</DialogContent>
					<DialogActions>
						<div className="applicant-card__footer">
							<button className="applicant-card__cancel-button" onClick={this.handleClose}>
								{spanishActions[2].label}
							</button>
							<button
								className="applicant-card__save-button"
								type="submit"
								form="form-previous-employment"
							>
								{this.state.id == 0 ? spanishActions[0].label : spanishActions[4].label}
							</button>
						</div>
					</DialogActions>
				</form>
			</Dialog>
		);

		// To render the Previous Employment Section
		let renderPreviousEmploymentSection = () => (
			<div className="card-body">
				<div className="row">
					{this.state.previousEmployment.map((employmentItem) => (
						<div className="col-3">
							<PreviousEmploymentCard
								company={employmentItem.companyName}
								address={employmentItem.address}
								jobTitle={employmentItem.jobTitle}
								phone={employmentItem.phone}
								supervisor={employmentItem.supervisor}
								payRate={employmentItem.payRate}
								startDate={employmentItem.startDate}
								endDate={employmentItem.endDate}
								handleOpenModal={() => this.handleOpenEditModal(employmentItem)}
								remove={() => {
									this.setState(
										(prevState) => ({
											previousEmployment: this.state.previousEmployment.filter((_, i) => {
												return _.uuid !== employmentItem.uuid;
											})
										}),
										() => {
											if (employmentItem.id !== undefined) {
												this.removePreviousEmploymentById(employmentItem.id);
											}
										}
									);
								}}
							/>
						</div>
					))}
					{renderPreviousEmploymentDialogForm()}
				</div>
			</div>
		);

		return (
			<div className="Apply-container--application">
				<div className="">
					<div className="">
						<div className="applicant-card">
							<div className="applicant-card__header">
								<span className="applicant-card__title">{menuSpanish[2].label}</span>
								{this.state.editing ? (
									''
								) : (
										<button
											className="applicant-card__edit-button"
											onClick={() => {
												this.handleOpenNewModal();
											}}
										>
											{spanishActions[0].label} <i className="fas fa-plus" />
										</button>
									)}
							</div>
							<div className="">
								{this.state.loading ? (
									<div className="form-section-1 form-section--center">
										<CircularProgressLoading />
									</div>
								) : (
										renderPreviousEmploymentSection()
									)}
							</div>
							<div className="applicant-card__footer">
								<button
									className="applicant-card__cancel-button"
									onClick={() => {
										this.props.handleBack();
									}}
								>
									{spanishActions[9].label}
								</button>
								<button
									onClick={() => {
										this.props.handleNext();
									}}
									className="applicant-card__save-button">
									{spanishActions[8].label}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default withApollo(withGlobalContent(PreviousEmployment));
