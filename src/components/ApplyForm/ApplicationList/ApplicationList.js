import React, { Component } from 'react';
import './index.css';
import { gql } from 'apollo-boost';
import withApollo from 'react-apollo/withApollo';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import ApplicationTable from './ApplicationTable';
import withGlobalContent from 'Generic/Global';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AlertDialogSlide from 'Generic/AlertDialogSlide';

import makeAnimated from 'react-select/lib/animated';
import Select from 'react-select';
import { GET_PROPERTIES_QUERY, GET_DEPARTMENTS_QUERY } from './Queries';


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

const DEFAULT_PROPERTY = { value: '', label: 'Property(All)' };
const DEFAULT_DEPARTMENT = { value: '', label: 'Department(All)' };
const DEFAULT_STATUS = { value: 1, label: 'Active' };

class ApplicationList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			applications: [],
			loadingContracts: false,
			data: [],
			filterText: '',
			opendialog: false,
			property: DEFAULT_PROPERTY,
			department: DEFAULT_DEPARTMENT,
			properties: [],
			departments: [],
			statu: DEFAULT_STATUS,
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

	/**
     * This method redirect to create application component
     */
	/*redirectToCreateApplication = () => {
		this.props.history.push({
			pathname: '/employment-application',
			state: { ApplicationId: 0 }
		});
	};*/

	redirectToCreateApplication = () => {
		localStorage.setItem('idApplication', 0);
		this.props.history.push({
			//pathname: '/employment-application',
			pathname: '/home/application/info',
			state: { ApplicationId: 0 }
		});
	};

	GET_APPLICATION_QUERY = gql`
		query applicationsByUser($idUsers: Int,$Id_Deparment: Int, $idEntity: Int, $isActive:[Boolean] ,$isLead:Boolean){
			applicationsByUser(idUsers: $idUsers, Id_Deparment: $Id_Deparment, idEntity: $idEntity, isActive: $isActive,isLead:$isLead) {
				id
				firstName
				middleName
				lastName
				socialSecurityNumber
				emailAddress
				cellPhone
				isLead
				idWorkOrder
				statusCompleted
				sendInterview
				User {
					Full_Name
				}
				Employee{
					idUsers
				}
				DefaultCompany{
					Id
					Name
				}
				Companies{
					Id,
					Code,
					Name
				}
				Recruiter {
					Full_Name
				}
				Position{
					Position      
				}
				PositionCompany{
     				Code
    			}
				workOrderId    
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
	handlePropertyChange = (property) => {
		this.setState((prevState) => ({
			property,
			department: prevState.property.value != property.value ? DEFAULT_DEPARTMENT : prevState.department,
			departments: prevState.property.value != property.value ? [] : prevState.departments
		}), () => {
			this.getDepartments();
			this.getApplications();
		});
	}
	handleDepartmentChange = (department) => {
		this.setState(() => ({ department }), () => this.getApplications());
	}
	handleStatusChange = (statu) => {
		this.setState(() => ({ statu }), () => this.getApplications());
	}

	getProperties = () => {
		this.setState(() => ({ loadingProperties: true }), () => {
			this.props.client
				.query({
					query: GET_PROPERTIES_QUERY,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
					let options = [];

					//Add first record
					options.push(DEFAULT_PROPERTY);

					//Create structure based on property data
					data.getbusinesscompanies.map((property) => {
						options.push({ value: property.Id, label: property.Code + " | " + property.Name });
					});

					//Set values to state
					this.setState(() => ({
						properties: options,
						loadingProperties: false
					}));

				})
				.catch(error => {
					this.setState(() => ({ loadingProperties: false }));
				});
		})
	}

	getDepartments = () => {
		this.setState(() => ({ loadingDepartments: true }), () => {
			var variables = {};

			if (this.state.property.value)
				variables = { Id_Entity: this.state.property.value };

			this.props.client
				.query({
					query: GET_DEPARTMENTS_QUERY,
					variables,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
					let options = [];

					//Add first record
					options.push({ value: '', label: 'Department(All)' });

					//Create structure based on department data
					data.catalogitem.map(({ Id, DisplayLabel }) => {
						options.push({ value: Id, label: DisplayLabel })
					});

					this.setState(() => ({
						departments: options,
						loadingDepartments: false
					}));
				})
				.catch(error => {
					this.setState(() => ({ loadingDepartments: false }));
				});
		})
	}

	getApplications = () => {
		this.setState(() => {
			return { loading: true, applications: [] }
		}, () => {
			let property = this.state.property.value;
			let department = this.state.department.value;
			let variables = {
				idEntity: property ? property : null,				
			};
			if (localStorage.getItem('isEmployee') == 'true')
				variables = { ...variables, idUsers: localStorage.getItem('LoginId') }

			if (!!department)
				variables = { ...variables, Id_Deparment: department };

			switch (this.state.statu.value) {
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
					query: this.GET_APPLICATION_QUERY,
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
			this.getProperties();
			this.getDepartments();
			this.getApplications();
		}

	}

	render() {
		var loading = this.state.loadingConfirm || this.state.loadingContracts || this.state.loadingProperties || this.state.loadingDepartments;
		var variables = {};

		/**
		 * Start - Define variables for application query
		 */
		if (localStorage.getItem('isEmployee') == 'true')
			variables = { idUsers: localStorage.getItem('LoginId') };

		if (this.state.property.value != '')
			variables = { ...variables, idEntity: this.state.property.value };
		if (this.state.department.value != '')
			variables = { ...variables, Id_Deparment: this.state.department.value };
		if (this.state.statu.value != '') {
			if (this.state.statu.value == 1) { variables = { ...variables, isActive: [true] }; }
			if (this.state.statu.value == 2) { variables = { ...variables, isActive: [false] }; }
			if (this.state.statu.value == 3) { variables = { ...variables, isActive: [true, false] }; }
		}

		/**
		 * End - Define variables for application query
		 */

		// If contracts query is loading, show a progress component
		if (loading) {
			return <LinearProgress />;
		}

		// To render the content of the header
		let renderHeaderContent = () => (
			<div className="row pb-0">
				<div className="col-md-3 col-xl-2">
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
				<div className="col-md-3 col-xl-2 offset-xl-4 mb-2">
					{
						!this.props.propertyInfo &&
						<Select
							name="property"
							options={this.state.properties}
							value={this.state.property}
							onChange={this.handlePropertyChange}
							components={makeAnimated()}
							closeMenuOnSelect
						/>
					}
				</div>
				<div className="col-md-3 col-xl-2 mb-2">
					<Select
						name="department"
						options={this.state.departments}
						value={this.state.department}
						onChange={this.handleDepartmentChange}
						components={makeAnimated()}
						closeMenuOnSelect
					/>
				</div>
				<div className="col-md-3 col-xl-2 mb-2">
					<Select
						name="status"
						options={this.state.status}
						value={this.state.statu}
						onChange={this.handleStatusChange}
						components={makeAnimated()}
						closeMenuOnSelect
					/>
				</div>
			</div>
		);

		let renderContent = () => {
			if (this.state.loading && !this.state.opendialog) return <LinearProgress />

			let { applications } = this.state;
			// if (applications != null && applications.length > 0) {
			let dataApplication =
				this.state.filterText === ''
					? applications
					: applications.filter((_, i) => {
						return (
							(_.firstName + _.middleName + _.lastName)
								.toLocaleLowerCase().indexOf(this.state.filterText.toLocaleLowerCase()) > -1
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
						<div className="row">
							<div className={this.props.leftStepperComponent ? 'col-md-3 col-xl-2' : 'd-none'}>
								{this.props.leftStepperComponent}
							</div>

							<div className={this.props.leftStepperComponent ? 'col-md-9 col-xl-10' : 'col-md-12'}>
								<div className="card">
									<ApplicationTable
										data={dataApplication}
										onDeleteHandler={this.onDeleteHandler}
										getApplications={this.getApplications}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			);
		}

		return (
			<div className="main-application">
				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingConfirm}
					content="Do you really want to continue whit this operation?"
				/>
				<div className="">{renderHeaderContent()}</div>
				<div className="main-contract__content">
					{renderContent()}
				</div>
			</div>
		);
	}
}

ApplicationList.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(withGlobalContent(ApplicationList)));