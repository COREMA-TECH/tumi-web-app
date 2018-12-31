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
			opendialog: false
		};
	}

	/**
     * This method redirect to create application component
     */
	redirectToCreateApplication = () => {
		this.props.history.push({
			pathname: '/employment-application',
			state: { ApplicationId: 0 }
		});
	};

	GET_APPLICATION_QUERY = gql`
	{
		applications(isActive: true,isLead:true) {
			id
			firstName
			middleName
			lastName
			socialSecurityNumber
			emailAddress
			position{
				id
				position {
						  Position
					  }
				BusinessCompany {
						  Id
						  Code
					  }
			  }
		}
	}
	`;
	DELETE_APPLICATION_QUERY = gql`
		mutation disableApplication($id: Int!) {
			disableApplication(id: $id) {
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
							id: this.state.idToDelete
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
			<div className="row">
				<div className="col-md-6">
					<div class="input-group mb-3">
						<div class="input-group-prepend">
							<span class="input-group-text" id="basic-addon1">
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
							placeholder="Search application form"
							className="form-control"
						/>
					</div>
				</div>
				<div className="col-md-6">
					<button
						className="btn btn-success float-right"
						onClick={() => {
							this.redirectToCreateApplication();
						}}
					>
						Add Application
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
					<Query query={this.GET_APPLICATION_QUERY} pollInterval={300}>
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
											<div className="contract_table_wrapper">
												<ApplicationTable
													data={dataApplication}
													onDeleteHandler={this.onDeleteHandler}
												/>
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
