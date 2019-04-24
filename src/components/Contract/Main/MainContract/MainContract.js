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


import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import HotelDialog from './HotelDialog';

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
			showConfirm:true,
			showConfirmCompany:false,
			showConfirmCompanyOrProperty:false,
			opendialog: false,
			open:false
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

	redirectToCreateCompany = () => {
		this.props.history.push({
			pathname: '/home/company/add',
			state: { idCompany: 0, idContract: 0 }
		});
	};

	redirectToCreateProperty = () => {
		this.props.history.push({
			pathname: '/home/company/add',
			state: { idCompany: 0, idContract: 0 }
		});
	};


	handleClickOpen = (event) => {
		event.preventDefault();
		this.setState({
			showConfirmCompany: false, 
			showConfirm: false, 
			showConfirmCompanyOrProperty:false,
			open: true
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

	handleClose = () => {
		this.setState({showConfirm: true, open: false });
	};

	handleOpenConfirmDialog = () => {
		this.setState({ showConfirmCompany: false, showConfirm: true, showConfirmCompanyOrProperty:false});
	}
	
	handleOpenConfirmDialogCompany = () => {
		this.setState({ showConfirmCompany: true, showConfirm: false, showConfirmCompanyOrProperty:false });
	}

	handleOpenConfirmDialogCompanyOrProperty = () => {
		this.setState({ showConfirmCompany: false, showConfirm: false, showConfirmCompanyOrProperty:true });
	}

	handleCloseConfirmDialog = () => {
	this.setState({ showConfirm: false });
    }


	printDialogConfirm = () => {
	//	console.log("estoy en el dialog ", this.state.showConfirm)
       
            return <Dialog maxWidth="xl" open={this.state.showConfirm} >
                <DialogContent>
                    <h2 className="text-center">What would you like to do?</h2>
                </DialogContent>
                <DialogActions>
					<div className="tumi-modalButtonWrapper">
						<button className="btn btn-success btn-not-rounded tumi-modalButton" type="button" onClick={() => this.handleOpenConfirmDialogCompany() }>
							Create New Contract 
						</button>
						<button className="btn btn-info btn-not-rounded tumi-modalButton" type="button" onClick={() => this.handleCloseConfirmDialog()}>
							View and Renew Contracts 
						</button>
					</div>
                    
                </DialogActions>
            </Dialog>
	}

	printDialogConfirmCompany = () => {
		//	console.log("estoy en el dialog ", this.state.showConfirm)
		   
				return <Dialog maxWidth="xl" open={this.state.showConfirmCompany} >
					<DialogContent>
						<h2 className="text-center">Is this contract for a new or existing company?</h2>
					</DialogContent>
					<DialogActions>
						<div className="tumi-modalButtonWrapper">
							<button className="btn btn-success btn-not-rounded tumi-modalButton" type="button" onClick={() => this.handleOpenConfirmDialogCompanyOrProperty() }>
								New Company
							</button>
							<button className="btn btn-info btn-not-rounded tumi-modalButton" type="button" onClick={() => this.redirectToCreateContract()}>
								Existing Company
							</button>
						</div>
						
					</DialogActions>
				</Dialog>
		}

		printDialogConfirmCompanyOrProperty = () => {
			//	console.log("estoy en el dialog ", this.state.showConfirm)
			   
					return <Dialog maxWidth="xl" open={this.state.showConfirmCompanyOrProperty} >
						<DialogContent>
							<h2 className="text-center">Is this contract for Property or a Management Company?</h2>
						</DialogContent>
						<DialogActions>
							<div className="tumi-modalButtonWrapper">
								<button className="btn btn-success btn-not-rounded tumi-modalButton" type="button" onClick={(e) => this.handleClickOpen(e)}>
									Property
								</button>
								<button className="btn btn-info btn-not-rounded tumi-modalButton" type="button" onClick={() => this.redirectToCreateCompany() }>
									Management Company
								</button>							
							</div>
						</DialogActions>
					</Dialog>
			}

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
												<div className="card">
													<div className="card-body Table-wrapper">
														<TablesContracts
															data={dataContract}
															printDialogConfirm={this.printDialogConfirm}
															printDialogConfirmCompany={this.printDialogConfirmCompany}
															printDialogConfirmCompanyOrProperty={this.printDialogConfirmCompanyOrProperty}
															acciones={0}
															delete={(id) => {
																this.deleteContractById(id);
															}}
														/>

														<HotelDialog
															open={this.state.open}
															handleClose={this.handleClose}
															handleOpenSnackbar={this.props.handleOpenSnackbar}
														/>													
													</div>
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
