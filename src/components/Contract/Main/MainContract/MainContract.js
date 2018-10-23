import React, { Component } from 'react';
import './index.css';
import { gql } from 'apollo-boost';
import withApollo from 'react-apollo/withApollo';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import TablesContracts from './TablesContracts';
import CircularProgress from '../../../material-ui/CircularProgress';
import { Query } from 'react-apollo';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import withGlobalContent from 'Generic/Global';
import ErrorMessageComponent from '../../../ui-components/ErrorMessageComponent/ErrorMessageComponent';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

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

class MainContract extends Component {
	constructor(props) {
		super(props);

		this.state = {
			loadingContracts: false,
			data: [],
			loadingRemoving: false,
			filterText: '',
			opendialog: false
		};
	}

	/**
     * This method redirect to create contract component
     */
	redirectToCreateContract = () => {
		this.props.history.push({
			pathname: '/home/contract/add',
			state: { contract: 0 }
		});
	};

	getContractsQuery = gql`
		{
			getcontracts(Id: null, IsActive: 1) {
				Id
				Contract_Name
				Contrat_Owner
				Contract_Status
				Contract_Expiration_Date
			}
		}
	`;

	/**
     * To delete contracts by id
     */
	deleteContractQuery = gql`
		mutation delcontracts($Id: Int!) {
			delcontracts(Id: $Id, IsActive: 0) {
				Id
			}
		}
	`;

	deleteContract = () => {
		this.setState(
			{
				loadingRemoving: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.deleteContractQuery,
						variables: {
							Id: this.state.idToDelete
						}
					})
					.then((data) => {
						this.setState(
							{
								opendialog: false,
								loadingRemoving: false
							},
							() => {
								this.props.handleOpenSnackbar('success', 'Contract Deleted!');
							}
						);
					})
					.catch((error) => {
						this.setState(
							{
								opendialog: false,
								loadingRemoving: false
							},
							() => {
								this.props.handleOpenSnackbar('error', 'Error: Deleting Contract: ' + error);
							}
						);
					});
			}
		);
	};

	deleteContractById = (id) => {
		this.setState({ idToDelete: id, opendialog: true, loadingRemoving: false, loadingContracts: false });
	};

	handleCloseAlertDialog = () => {
		this.setState({ opendialog: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteContract();
	};

	render() {
		const { classes } = this.props;
		// If contracts query is loading, show a progress component
		if (this.state.loadingContracts) {
			return <LinearProgress />;
		}

		if (this.state.loadingRemoving) {
			return (
				<div className="nothing-container">
					<CircularProgress size={150} />
				</div>
			);
		}

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
							placeholder="Search contract"
							className="form-control"
						/>
					</div>
				</div>
				<div className="col-md-6">
					<button
						className="btn btn-success float-right"
						onClick={() => {
							this.redirectToCreateContract();
						}}
					>
						Add Contract
						</button>
				</div>
			</div>
		);

		return (
			<div className="main-contract">
				<AlertDialogSlide
					handleClose={this.handleCloseAlertDialog}
					handleConfirm={this.handleConfirmAlertDialog}
					open={this.state.opendialog}
					loadingConfirm={this.state.loadingRemoving}
					content="Do you really want to continue whit this operation?"
				/>

				{renderHeaderContent()}
				<div className="main-contract__content">
					<Query query={this.getContractsQuery} pollInterval={300}>
						{({ loading, error, data, refetch, networkStatus }) => {
							if (this.state.filterText === '') {
								if (loading) return <LinearProgress />;
							}

							if (error)
								return (
									<ErrorMessageComponent
										title="Oops!"
										message={'Error loading contracts'}
										type="Error-danger"
										icon="danger"
									/>
								);
							if (data.getcontracts != null && data.getcontracts.length > 0) {
								let dataContract = data.getcontracts.filter((_, i) => {
									if (this.state.filterText === '') {
										return true;
									}

									if (
										_.Contract_Name.indexOf(this.state.filterText) > -1 ||
										_.Contract_Name.toLocaleLowerCase().indexOf(this.state.filterText) > -1 ||
										_.Contract_Name.toLocaleUpperCase().indexOf(this.state.filterText) > -1
									) {
										return true;
									}
								});

								return (
									<div className="">
										<div className="row">
											<div className="col-md-12">
												<div className="">
													<TablesContracts
														data={dataContract}
														delete={(id) => {
															this.deleteContractById(id);
														}}
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
									message={'There are no contracts'}
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

MainContract.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(withGlobalContent(MainContract)));
