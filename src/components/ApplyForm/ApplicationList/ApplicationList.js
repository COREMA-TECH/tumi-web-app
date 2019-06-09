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
import Grid from '@material-ui/core/Grid';
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
		query applicationsByUser($idUsers: Int,$Id_Department: Int, $idEntity: Int, $isActive:[Boolean] ){
			applicationsByUser(idUsers: $idUsers, Id_Department: $Id_Department, idEntity: $idEntity, isActive: $isActive) {
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
				employee {
					Employees {
					  idEntity
						BusinessCompany {
						Name
					  }
					}
				  }
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
		mutation disableApplication($id: Int!, $isActive: Boolean,  $codeuser: Int, $nameUser: String) {
			disableApplication(id: $id,isActive: $isActive, codeuser: $codeuser, nameUser: $nameUser) {
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
						this.setState({ opendialog: false, loadingConfirm: false });
						this.setState({ state: this.state });
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
		});
	}
	handleDepartmentChange = (department) => {
		this.setState(() => ({ department }));
		console.log(this.state.department);
	}
	handleStatusChange = (statu) => {
		this.setState(() => ({ statu }));
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

	componentWillMount() {
		this.getProperties();
		this.getDepartments();
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
			variables = { ...variables, Id_Department: this.state.department.value };
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
					<Select
						name="property"
						options={this.state.properties}
						value={this.state.property}
						onChange={this.handlePropertyChange}
						components={makeAnimated()}
						closeMenuOnSelect
					/>
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
					<Query fetchPolicy="network-only" query={this.GET_APPLICATION_QUERY} variables={variables} >
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

							if (data.applicationsByUser != null && data.applicationsByUser.length > 0) {
								const dataApplication =
									this.state.filterText === ''
										? data.applicationsByUser
										: data.applicationsByUser.filter((_, i) => {
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
									<div className="row pt-0">
										{localStorage.getItem('isEmployee') == 'false' &&
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
												/>
											</div>
										</div>
									</div>
								);
							} else {
								return (
									<NothingToDisplay
										title="Oops!"
										message={'There are no applications'}
										type="Error-success"
										icon="wow"
									/>
								);
							}
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
