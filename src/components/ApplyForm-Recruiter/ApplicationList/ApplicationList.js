import React, { Component } from 'react';
import './index.css';
import { gql } from 'apollo-boost';
import withApollo from 'react-apollo/withApollo';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import ApplicationTable from './ApplicationTable';
import { Query } from 'react-apollo';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import withGlobalContent from 'Generic/Global';
import ErrorMessageComponent from 'ui-components/ErrorMessageComponent/ErrorMessageComponent';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { GET_HOTEL_QUERY, GET_USERS, GET_EMPLOYEES_WITHOUT_ENTITY, GET_CONFIGREGIONS } from './queries';
import SelectNothingToDisplay from '../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import filterTypes from './filterTypeData';
import NoShowReport from '../../NoShowReport';
import DatePicker from "react-datepicker";
import moment from 'moment';
import { GET_RECRUITERS } from '../../NoShowReport/queries';

const styles = (theme) => ({
	root: {
		flexGrow: 1
	},
	paper: {
		padding: theme.spacing.unit * 2,
		// textAlign: 'center',
		color: theme.palette.text.secondary,
		overflowY: 'visible'
	}
});

const DEFAULT_RECRUITER_VALUE = "ND";
const DEFAULT_FILTER_TYPE = { value: "W", label: "By week" };
const DEFAULT_FILTER_RECRUITER = { value: DEFAULT_RECRUITER_VALUE, label: "Recruited by" };
const DEFAULT_DATA_RANGE_APP = { value: null, label: 'Report Date'};

class ApplicationList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loadingContracts: false,
			data: [],
			filterText: '',
			opendialog: false,
			recruitersTags: [],
			showNoShowPrefilterModal: false,
			filterType: DEFAULT_FILTER_TYPE,
			filterRecruiter: DEFAULT_FILTER_RECRUITER,
			filterRecruiters: [],
			recruiterFiltered: DEFAULT_FILTER_RECRUITER, // opcion seleccionada para filtro de recruiter en indice
			typeDateFiltered: DEFAULT_FILTER_TYPE, // opcion seleccinada para filtro de fecha en indice
			startDateApp: null,
			endDateApp: null,
			dateRangeApp: DEFAULT_DATA_RANGE_APP
		};
	}

	/**
     * This method redirect to create application component
     */
	redirectToCreateApplication = () => {
		localStorage.setItem('idApplication', 0);
		this.props.history.push({
			//pathname: '/employment-application',
			pathname: '/home/application/Form',
			state: { ApplicationId: 0 }
		});
	};

	GET_APPLICATION_QUERY = gql`
	query applications( $idRecruiter:Int) 	
	{
			applications(isActive: true,isLead:true, idRecruiter : $idRecruiter) {
				id
				firstName
				middleName
				lastName
				socialSecurityNumber
				emailAddress
				cellPhone
				isLead
				idWorkOrder
				date
				recruiter{
					Id
					Full_Name
				}
				user{
					Full_Name
				}
				position{
					id
					position {
							Position
						}
					BusinessCompany {
							Id
							Code
							Name
						}
				}
			}
		}
	`;
	DELETE_APPLICATION_QUERY = gql`
		mutation disableApplication($id: Int!, $isActive: Boolean) {
			disableApplication(id: $id,isActive: $isActive) {
				id
				isActive
			}
		}
	`;
	deleteApplication = () => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.DELETE_APPLICATION_QUERY,
						variables: {
							id: this.state.idToDelete,
							isActive: false
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Application Deleted!');
						this.setState({ opendialog: false, loadingConfirm: false }, () => { });
					})
					.catch((error) => {
						this.props.handleOpenSnackbar('error', 'Error: Deleting Position and Rates: ' + error);
						this.setState({
							loadingConfirm: false
						});
					});
			}
		);
	};

	handleChangerecruiterTag = (recruitersTags) => {
		this.setState({ recruitersTags });
	};

	onDeleteHandler = (id) => {
		this.setState({ idToDelete: id, opendialog: true });
	};
	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteApplication();
	};

	showNoShowReportFilter = () => {
		this.setState(() => ({ showNoShowPrefilterModal: true }))
	}

	hideNoShowReportFilter = () => {
		this.setState(() => ({ showNoShowPrefilterModal: false }))
	}
	hideNoShowReport = () => {
		this.setState(() => ({ showNoShowReportModal: false }))
	}

	handleFilterTypeChange = (filterType) => {
		this.setState(() => ({ filterType, dateRange: {} }))
	}

	handleFilterRecruiterChange = (filterRecruiter) => {
		this.setState(() => ({ filterRecruiter, recruiter: filterRecruiter.label }))
	}

	handleAcceptFilterClick = () => {
		let { startDate, endDate, filterRecruiter } = this.state;
		if (!startDate || !endDate)
			this.props.handleOpenSnackbar('warning', 'You need to select a valid range!');
		else if (Object.keys(filterRecruiter).length == 0)
			this.props.handleOpenSnackbar('warning', 'You need to select a recruiter!');
		else if (filterRecruiter.value == DEFAULT_RECRUITER_VALUE)
			this.props.handleOpenSnackbar('warning', 'You need to select a recruiter!');
		else
			this.setState(() => ({ showNoShowPrefilterModal: false, showNoShowReportModal: true }))
	}

	handleDateRangeChange = (dateRange) => {
		let dates = dateRange.value.split('||');
		this.setState(() => ({ dateRange, startDate: new Date(dates[0]), endDate: new Date(dates[1]) }))
	}

	handleChangeStartDate = (value) => {
		this.setState(() => ({
			startDate: value,
			endDateDisabled: false
		}));
	}

	handleChangeEndDate = (value) => {
		this.setState(() => ({
			endDate: value
		}));
	}

	loadRecruiters = () => {
		this.props.client
			.query({
				query: GET_RECRUITERS,
				fetchPolicy: 'no-cache'
			})
			.then(({ data: { user } }) => {
				user.map(_ => {
					this.setState((prevState => ({
						filterRecruiters: prevState.filterRecruiters.concat({ value: _.Id, label: _.Full_Name })
					})))
				})
			})
			.catch((error) => {
				this.props.handleOpenSnackbar('error', 'Error: Loading Recruiters ');
			});
	}
	componentWillMount() {
		this.loadRecruiters();
	}

	getDateRange = (type) => {
		let today = new Date(), weeks = 4, months = 6, value, label, startDate, endDate, data = [], endDateValue, startDateValue;
		let { filterType } = this.state;

		today = moment.utc(today).subtract(6 - moment.utc(today).day(), "days")._d;

		if (filterType.value == "W") {
			while (weeks > 0) {
				endDate = moment.utc(today).format("MM/DD/YYYY"); //get Start Date
				today = moment.utc(today).subtract(1, "weeks")._d;//Substract a week
				startDate = moment.utc(today).format("MM/DD/YYYY");//get End Date
				today = moment.utc(today).subtract(1, "days")._d;//Substract a day to start new week
				data.push({ value: `${startDate}||${endDate}`, label: `${startDate} - ${endDate}` })
				weeks--;
			}
		}

		if (filterType.value == "M") {
			while (months > 0) {
				endDate = moment.utc(today).format("MM/YYYY"); //get Start Date
				endDateValue = moment.utc(today).endOf("month").format("MM/DD/YYYY");
				startDateValue = moment.utc(today).startOf("month").format("MM/DD/YYYY");
				today = moment.utc(today).subtract(1, "months")._d;//Substract a month

				data.push({ value: `${startDateValue}||${endDateValue}`, label: `${endDate}` })
				months--;
			}
		}
		return data;
	}
	printNoShowReportPrefilter = () => {
		const { classes } = this.props;
		let { showNoShowPrefilterModal, filterType, dateRange, filterRecruiter, filterRecruiters } = this.state;
		return <Dialog
			open={showNoShowPrefilterModal}
			onClose={this.hideNoShowReportFilter}
			aria-labelledby="responsive-dialog-title"
			fullWidth
			maxWidth="sm"
			classes={{ paper: classes.paper }}
		>
			<DialogTitle id="responsive-dialog-title" style={{ padding: '0px' }}>
				<div className="modal-header">
					<h5 className="modal-title">
						No Show Report
					</h5>
				</div>
			</DialogTitle>
			<DialogContent style={{ overflowY: "unset" }}>
				<div className="card-body">

					<div className="row">
						<div className="col-md-12 mb-2">
							<Select
								name="filterRecruiter"
								options={filterRecruiters}
								value={filterRecruiter}
								onChange={this.handleFilterRecruiterChange}
								components={makeAnimated()}
								closeMenuOnSelect
							/>
						</div>
						<div className="col-md-4 mb-2">
							<Select
								name="filterType"
								options={filterTypes}
								value={filterType}
								onChange={this.handleFilterTypeChange}
								components={makeAnimated()}
								closeMenuOnSelect
							/>
						</div>
						{filterType.value != "C" ?
							<div className="col-md-8 mb-2">
								<Select
									name="dateRange"
									options={this.getDateRange()}
									value={dateRange}
									onChange={this.handleDateRangeChange}
									components={makeAnimated()}
									closeMenuOnSelect
								/>
							</div> :
							<React.Fragment>
								<div className="col-md-4 mb-2">
									<div class="input-group flex-nowrap">
										<DatePicker
											selected={this.state.startDate}
											onChange={this.handleChangeStartDate}
											placeholderText="Start date"
											id="startDate"
										/>
										<div class="input-group-append">
											<label class="input-group-text" id="addon-wrapping" for="startDate">
												<i class="far fa-calendar"></i>
											</label>
										</div>
									</div>
								</div>
								<div className="col-md-4 mb-2">
									<div class="input-group flex-nowrap">
										<DatePicker
											selected={this.state.endDate}
											onChange={this.handleChangeEndDate}
											placeholderText="End date"
											id="endDate"
										/>
										<div class="input-group-append">
											<label class="input-group-text" id="addon-wrapping" for="endDate">
												<i class="far fa-calendar"></i>
											</label>
										</div>
									</div>
								</div>
							</React.Fragment>
						}
					</div>
				</div>
			</DialogContent>
			<DialogActions>
				<div className="applicant-card__footer">
					<button className="applicant-card__cancel-button" type="reset" onClick={this.hideNoShowReportFilter}>
						Cancel
				</button>
					<button className="applicant-card__save-button" onClick={this.handleAcceptFilterClick}>
						Accept
				</button>
				</div>
			</DialogActions>
		</ Dialog>
	}
	printNoShowReport = () => {
		let { showNoShowReportModal, startDate, endDate, filterRecruiter, recruiter } = this.state;

		return <Dialog
			open={showNoShowReportModal}
			onClose={this.hideNoShowReport}
			aria-labelledby="responsive-dialog-title"
			fullWidth
			maxWidth="lg"
		>

			<DialogContent maxWidth="sm" style={{ overflowY: "unset" }}>
				<div className="card-body">
					<div className="row">
						<div className="col-md-12">
							<NoShowReport recruiter={recruiter} handleOpenSnackbar={this.props.handleOpenSnackbar} startDate={startDate} endDate={endDate} idRecruiter={filterRecruiter.value} />
						</div>
					</div>
				</div>
			</DialogContent>
			<DialogActions>
				<div className="applicant-card__footer">
					<button className="applicant-card__cancel-button" type="reset" onClick={this.hideNoShowReport}>
						Close
					</button>
				</div>
			</DialogActions>
		</Dialog>
	}

	handleRecruiterFiltered = (option) => {
		this.setState(() => {
			return {
				recruiterFiltered: option
			}
		});
	}

	handleTypeDateFiltered = (option) => {
		this.setState(() => {
			return { typeDateFiltered: option }
		});
	}

	handleDateRangeApp = (dateRangeApp) => {
		let dates = dateRangeApp.value.split('||');
		this.setState(() => ({ dateRangeApp, startDateApp: new Date(dates[0]), endDateApp: new Date(dates[1]) }))
	}

	handleStartDateApp = (value) => {
		this.setState(() => ({
			startDateApp: value
		}));
	}

	handleEndDateApp = (value) => {
		this.setState(() => ({
			endDateApp: value
		}));
	}

	getDateRangeApp = (type) => {
		let today = new Date(), weeks = 4, months = 6, value, label, startDate, endDate, data = [], endDateValue, startDateValue;
		let { typeDateFiltered } = this.state;

		today = moment.utc(today).subtract(6 - moment.utc(today).day(), "days")._d;

		if (typeDateFiltered.value == "W") {
			while (weeks > 0) {
				endDate = moment.utc(today).format("MM/DD/YYYY"); //get Start Date
				today = moment.utc(today).subtract(1, "weeks").add('days', 1)._d;//Substract a week
				startDate = moment.utc(today).format("MM/DD/YYYY");//get End Date
				today = moment.utc(today).subtract(1, "days")._d;//Substract a day to start new week
				data.push({ value: `${startDate}||${endDate}`, label: `${startDate} - ${endDate}` })
				weeks--;
			}
		}

		if (typeDateFiltered.value == "M") {
			while (months > 0) {
				endDate = moment.utc(today).format("MM/YYYY"); //get Start Date
				endDateValue = moment.utc(today).endOf("month").format("MM/DD/YYYY");
				startDateValue = moment.utc(today).startOf("month").format("MM/DD/YYYY");
				today = moment.utc(today).subtract(1, "months")._d;//Substract a month

				data.push({ value: `${startDateValue}||${endDateValue}`, label: `${endDate}` })
				months--;
			}
		}
		return data;
	}

	clearFilter = (e) => {
		e.preventDefault();
		this.setState(() => {
			return {
				recruiterFiltered: DEFAULT_FILTER_RECRUITER,
				startDateApp: null,
				endDateApp: null,
				dateRangeApp: DEFAULT_DATA_RANGE_APP
			}
		});
	}

	render() {
		let { filterRecruiters, recruiterFiltered, typeDateFiltered, startDateApp, endDateApp, dateRangeApp } = this.state;
		let rectuiterFilterValue = recruiterFiltered.value !== DEFAULT_RECRUITER_VALUE ? recruiterFiltered.value : null;
		let variables = rectuiterFilterValue != null ? { idRecruiter: rectuiterFilterValue  } : {}; // variable para la consulta

		let Filters = recruiterFiltered.value !== DEFAULT_RECRUITER_VALUE ? { idRecruiter: rectuiterFilterValue } : {};

		// If contracts query is loading, show a progress component
		if (this.state.loadingContracts) {
			return <LinearProgress />;
		}

		// To render the content of the header
		let renderHeaderContent = () => (
			<div className="row">
				<div className="col-md-2 col-xl-2">
					<div className="input-group mb-3">
						<div className="input-group-prepend">
							<span className="input-group-text" id="basic-addon1">
								<i className="fa fa-search icon" />
							</span>
						</div>
						<input
							onChange={(text) => {
								this.setState({
									filterText: text.target.value
								});
							}}
							value={this.state.filterText}
							type="text"
							placeholder="Lead Search"
							className="form-control"
						/>
					</div>
				</div>

				<div className="col-md-10 col-xl-10 mb-2 ">
					<div className="row p-0 d-flex justify-content-end">
						<div className="col-md-4 col-xl-3">
							<Select
								name="recruiterFiltered"
								options={filterRecruiters}
								value={recruiterFiltered}
								onChange={this.handleRecruiterFiltered}
								components={makeAnimated()}
								closeMenuOnSelect
							/>
						</div>
						<div className="col-md-5 col-lg-4 col-xl-3">
							<div className="row p-0">
								<div className="col-md-12">
									<Select
										name="typeDateFiltered"
										options={filterTypes}
										value={typeDateFiltered}
										onChange={this.handleTypeDateFiltered}
										components={makeAnimated()}
										closeMenuOnSelect
									/>
								</div>
							</div>
							<div className="row mt-1 p-0">
								{typeDateFiltered.value != "C" ?
									<div className="col-md-12">
										<Select
											name="dateRangeApp"
											options={this.getDateRangeApp()}
											value={dateRangeApp}
											onChange={this.handleDateRangeApp}
											components={makeAnimated()}
											closeMenuOnSelect
										/>
									</div> :
									<React.Fragment>
										<div className="col-md-12">
											<div class="input-group">
												<DatePicker
													selected={this.state.startDateApp}
													onChange={this.handleStartDateApp}
													placeholderText="Start date"
													id="startDateApp"
												/>
												<div class="input-group-append">
													<label class="input-group-text" id="addon-wrapping" for="startDateApp">
														<i class="far fa-calendar"></i>
													</label>
												</div>
											</div>
										</div>
										<div className="col-md-12">
											<div class="input-group">
												<DatePicker
													selected={this.state.endDateApp}
													onChange={this.handleEndDateApp}
													placeholderText="End date"
													id="endDateApp"
												/>
												<div class="input-group-append">
													<label class="input-group-text" id="addon-wrapping" for="endDateApp">
														<i class="far fa-calendar"></i>
													</label>
												</div>
											</div>
										</div>
									</React.Fragment>
								}
							</div>
						</div>
						<div className="col-md-auto">
							<button class="btn btn-outline-secondary btn-not-rounded" type="button" onClick={this.clearFilter}>
								<i class="fas fa-filter"></i> Clear
							</button>
						</div>
					</div>
				</div>

				<div className="col-md-4 col-xl-12 mb-2">
					{/* <button
						className="btn btn-success float-right ml-2"
						onClick={this.showNoShowReportFilter}
					>
						No Show Report
						</button> */}
					<button
						className="btn btn-success float-right"
						onClick={this.redirectToCreateApplication}
					>
						Add Lead
						</button>
				</div>


			</div>
		);

		return (
			<div className="main-application">
				{this.printNoShowReportPrefilter()}
				{this.printNoShowReport()}
				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingConfirm}
					content="Do you really want to continue whit this operation?"
				/>
				<div className="">{renderHeaderContent()}</div>
				<div className="main-contract__content">
					<Query query={this.GET_APPLICATION_QUERY} variables={{ ...Filters }} fetchPolicy="no-cache">
						{({ loading, error, data, refetch, networkStatus }) => {
							if (this.state.filterText === '') {
								if (loading && !this.state.opendialog) return <LinearProgress />;
							}

							if (error)
								return (
									<ErrorMessageComponent
										title="Oops!"
										message={'Error loading applications'}
										type="Error-danger"
										icon="danger"
									/>
								);
							if (data.applications != null && data.applications.length > 0) {
								
								let dataApplication = data.applications.filter((_, i) => {
									if (this.state.filterText === '') {
										return true;
									}

									if (
										(_.firstName +
											_.middleName +
											_.lastName +
											(_.position ? _.position.position.Position.trim() : 'Open Position') +
											(_.idWorkOrder ? `000000${_.idWorkOrder}`.slice(-6) : '') +
											(_.position ? _.position.BusinessCompany.Name : '') +
											(_.recruiter ? _.recruiter.Full_Name : '') +
											(_.user ? _.user.Full_Name : '') +
											_.emailAddress)
											.toLocaleLowerCase()
											.indexOf(this.state.filterText.toLocaleLowerCase()) > -1
									) {
										return true;
									}
								}).filter((_, i) => {
									// Filtro por fecha
									return((!startDateApp || new Date(startDateApp.setUTCHours(0, 0, 0)) <= new Date(_.date)) 
									&& (!endDateApp || new Date(endDateApp.setUTCHours(23, 59, 59)) >= new Date(_.date)))
								});

								return (
									<div className="row">
										<div className="col-md-12">
											<div className="card">
												<div className="card-body tumi-forcedResponsiveTable">
													<ApplicationTable
														data={dataApplication}
														onDeleteHandler={this.onDeleteHandler}
													/>
												</div>
											</div>
										</div>
									</div>
								);
							}
							return (
								<NothingToDisplay
									title="Oops!"
									message={'There are no applications'}
									type="Error-success"
									icon="wow"
								/>
							);
						}}
					</Query>
				</div>
			</div>
		);
	}
}

ApplicationList.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(withGlobalContent(ApplicationList)));
