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
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { GET_HOTEL_QUERY, GET_USERS, GET_EMPLOYEES_WITHOUT_ENTITY, GET_CONFIGREGIONS } from './queries';
import SelectNothingToDisplay from '../../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';


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
			loadingContracts: false,
			data: [],
			filterText: '',
			opendialog: false,
			recruitersTags: []
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
				statusCompleted
				dateCreation
				immediately
				optionHearTumi
				eeoc
				exemptions
				area
				hireType
				gender
				marital
				sendInterview
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

	render() {
		const { classes } = this.props;
		// If contracts query is loading, show a progress component
		if (this.state.loadingContracts) {
			return <LinearProgress />;
		}

		/*	if (this.state.loadingRemoving) {
			return (
				<div className="nothing-container">
					<CircularProgress size={150} />
				</div>
			);
		}*/
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
				<div className="col-md-3 col-xl-2 mb-2">
				
				</div>

				<div className="col-md-3 col-xl-2 mb-2">
						<button
							className="btn btn-success float-right"
							onClick={() => {
								this.redirectToCreateApplication();
							}}
						>
							Add Lead
						</button>
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
