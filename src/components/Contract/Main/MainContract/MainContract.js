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
						console.log('Error: Deleting Contract: ', error);

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

	// To render the content of the header
	render() {
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

		let renderHeaderContent = () => (
			<div className="company-list__header">
				<div className="search-container">
					<input
						onChange={(text) => {
							this.setState({
								filterText: text.target.value
							});
						}}
						value={this.state.filterText}
						type="text"
						placeholder="Search contract"
						className="input-search-contract"
					/>
					<button className="button-search-contract">Search</button>
				</div>
				<button
					className="add-company"
					onClick={() => {
						this.redirectToCreateContract();
					}}
				>
					Add Contract
				</button>
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

				<div className="main-contract__header">{renderHeaderContent()}</div>
				<div className="main-contract__content">
					<Query query={this.getContractsQuery} pollInterval={300}>
						{({ loading, error, data, refetch, networkStatus }) => {
							if (this.state.filterText === '') {
								if (loading) return <LinearProgress />;
							}

							if (error) return <p>Error </p>;
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
									<div className="main-contract-table">
										<div className="contract_table_wrapper">
											<TablesContracts
												data={dataContract}
												delete={(id) => {
													this.deleteContractById(id);
												}}
											/>
										</div>
									</div>
								);
							}
							return (
								<NothingToDisplay
									url="https://cdn3.iconfinder.com/data/icons/business-2-3/256/Contract-512.png"
									message="There are no contracts"
								/>
							);
						}}
					</Query>
				</div>
			</div>
		);
	}
}

export default withApollo(withGlobalContent(MainContract));
