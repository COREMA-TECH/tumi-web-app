import React, { Component, Fragment } from 'react';
import './index.css';
import withApollo from 'react-apollo/withApollo';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import ApplicationTable from './ApplicationTable';
import withGlobalContent from 'Generic/Global';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AlertDialogSlide from 'Generic/AlertDialogSlide';

import { GET_APPLICATION_QUERY } from './Queries';
import { DELETE_APPLICATION_QUERY } from './Mutation';
import ApplicationSideBar from './ApplicationSideBar';
import ApplicationFilters from './ApplicationFilters';


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

class ApplicationList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			applications: [],
			loadingContracts: false,
			data: [],
			filterText: '',
			opendialog: false,
			openModal: false,
			properties: [],
			departments: [],
			statusValue: [{
				value: 1,
				label: 'Status'
			}],
			status: [{
				value: 1,
				label: "Active"
			}, {
				value: 2,
				label: "Inactive"
			}, {
				value: 3,
				label: "All"
			}],
			propertyId: null // recibida por props
		};
	}

	redirectToCreateApplication = () => {
		localStorage.setItem('idApplication', 0);
		this.props.history.push({
			//pathname: '/employment-application',
			pathname: '/home/application/info',
			state: { ApplicationId: 0 }
		});
	};

	deleteApplication = () => {
		this.setState(
			{
				loadingConfirm: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: DELETE_APPLICATION_QUERY,
						variables: {
							id: this.state.idToDelete,
							isActive: false
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Application Deleted!');
						this.setState({ opendialog: false, loadingConfirm: false }, () => this.getApplications());
						//this.setState({ state: this.state });
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

	onDeleteHandler = (id) => {
		this.setState({ idToDelete: id, opendialog: true });
	};
	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteApplication();
	};

	getApplications = (propertyValue, departmentValue, statusValue) => {
		this.setState(() => {
			return { loading: true, applications: [] }
		}, () => {
			let property = propertyValue;
			let department = departmentValue;
			let variables = {
				idEntity: property ? property : null,
			};
			if (localStorage.getItem('isEmployee') == 'true')
				variables = { ...variables, idUsers: localStorage.getItem('LoginId') }

			if (!!department)
				variables = { ...variables, Id_Deparment: department };

			switch (statusValue) {
				case 1:
					variables = { ...variables, isActive: [true] };
					break;
				case 2:
					variables = { ...variables, isActive: [false] };
					break;
				case 3:
					variables = { ...variables, isActive: [true, false] };
					break;
				default:
					break;
			}

			this.props.client
				.query({
					query: GET_APPLICATION_QUERY,
					variables,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
					this.setState(() => ({
						applications: data.applicationsByUser,
						loading: false
					}));
				})
				.catch(error => {
					this.setState(() => ({ loading: false }));
				});
		});

	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.propertyInfo) {
			let propertyInfo = this.props.propertyInfo;
			this.handlePropertyChange({ value: propertyInfo.id, label: propertyInfo.name });
		}
	}

	componentWillMount() {
		//handlePropertyChange
		if (this.props.propertyInfo) {
			let propertyInfo = this.props.propertyInfo;
			this.handlePropertyChange({ value: propertyInfo.id, label: propertyInfo.name });
		}
		else {
			this.getApplications();
		}

	}

	/**
	 * To render the content of the header
	 */
	renderHeaderContent = () => (
		<div className="row pb-0">
			<div className="col-md-12">
				<div className="input-group mb-2">
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
						placeholder="Applicant Search"
						className="form-control"
					/>
				</div>
			</div>
		</div>
	);

	/**
	 * To render the content of body screen
	 */
	renderContent = () => {
		if (this.state.loading && !this.state.opendialog) return <LinearProgress />

		let { applications } = this.state;
		// if (applications != null && applications.length > 0) {
		let dataApplication =
			this.state.filterText === ''
				? applications
				: applications.filter((_, i) => {
					let { id, firstName, lastName } = _;
					let employee = { id, firstName, lastName };
					let filterValue = [];
					Object.keys(employee).forEach(key => {
						if (employee[key])
							filterValue.push(employee[key]);
					})
					return (
						filterValue.join(' ').toLocaleLowerCase().indexOf(this.state.filterText.toLocaleLowerCase()) > -1
					);
				});

		return (
			<div className="row pt-0">
				{!this.props.propertyInfo && localStorage.getItem('isEmployee') === 'false' &&
					<div className="col-md-12">
						<button
							className="btn btn-success float-right"
							onClick={() => {
								this.redirectToCreateApplication();
							}}
						>
							Add Application
									</button>
					</div>}
				<div className="col-md-12">
					<div className="card">
						<ApplicationTable
							data={dataApplication}
							onDeleteHandler={this.onDeleteHandler}
							getApplications={this.getApplications}
						/>
					</div>
				</div>
			</div>
		);
	}

	handleOpenModal = () => {
		this.setState(_ => {
			return { openModal: !this.state.openModal }
		});
	}

	render() {
		var loading = this.state.loadingConfirm || this.state.loadingContracts || this.state.loadingProperties || this.state.loadingDepartments;

		// If contracts query is loading, show a progress component
		if (loading) {
			return <LinearProgress />;
		}

		return (
			<Fragment>
				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingConfirm}
					content="Do you really want to continue whit this operation?"
				/>
				<ApplicationFilters open={this.state.openModal} getApplications={this.getApplications} handleOpenModal={this.handleOpenModal}/>
				<div className="withSidebar-wrapper">
					<ApplicationSideBar handleOpenModal={this.handleOpenModal}/>
					<div className="withSidebar-content">
						{this.renderHeaderContent()}
						{this.renderContent()}
					</div>
				</div>
			</Fragment>
		);
	}
}

ApplicationList.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(withGlobalContent(ApplicationList)));