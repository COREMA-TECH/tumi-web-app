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
		textAlign: 'center',
		color: theme.palette.text.secondary
	}
});

const DEFAULT_FILTER_TYPE = { value: "W", label: "By week" };
const DEFAULT_FILTER_RECRUITER = {};

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
			filterRecruiters: []
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
				recruiter{
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
		let { showNoShowPrefilterModal, filterType, dateRange, filterRecruiter, filterRecruiters } = this.state;
		return <Dialog
			open={showNoShowPrefilterModal}
			onClose={this.hideNoShowReportFilter}
			aria-labelledby="responsive-dialog-title"
			fullWidth
			maxWidth="sm"
		>
			<DialogTitle id="responsive-dialog-title" style={{ padding: '0px' }}>
				<div className="modal-header">
					<h5 className="modal-title">
						Filter No Show Report
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
		</Dialog>
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

	render() {

		// If contracts query is loading, show a progress component
		if (this.state.loadingContracts) {
			return <LinearProgress />;
		}

		// To render the content of the header
		let renderHeaderContent = () => (
			<div className="row">
				<div className="col-md-6 col-xl-2">
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
				

				<div className="col-md-3 col-xl-2 offset-xl-4 mb-2">
					<Query query={GET_USERS} variables={{ Id_Roles: 4 }} >
						{({ loading, error, data, refetch, networkStatus }) => {
							//if (networkStatus === 4) return <LinearProgress />;
							if (error) return <p>Error </p>;
							if (data.user != null && data.user.length > 0) {
								let options = [];
								data.user.map((item) => (
									options.push({ value: item.Id, label: item.Full_Name })
								));

								return (
									<div style={{
										paddingTop: '0px',
										paddingBottom: '2px',
									}}>
										<Select
											options={options}
											value={this.state.recruitersTags}
											onChange={this.handleChangerecruiterTag}
											closeMenuOnSelect={false}
											components={makeAnimated()}
											// isMulti
										/>
									</div>
								);
							}
							return <SelectNothingToDisplay />;
						}}
					</Query>
					</div>
				<div className="col-md-3 col-xl-2 offset-xl-2 mb-2">
					<Select
						name="property"
						options={this.state.properties}
						value={this.state.property}
						onChange={this.handlePropertyChange}
						components={makeAnimated()}
						closeMenuOnSelect
					/>
				</div>
				<div className="col-md-2 col-xl-2 mb-2">

				</div>
				<div className="col-md-4 col-xl-4 mb-2">
					<button
						className="btn btn-success float-right ml-2"
						onClick={this.showNoShowReportFilter}
					>
						No Show Report
						</button>
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
					<Query query={this.GET_APPLICATION_QUERY} variables={{idRecruiter:this.state.recruitersTags.value}} fetchPolicy="no-cache">
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
