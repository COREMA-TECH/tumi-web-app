import React, { Component } from 'react';
import './index.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LinearProgress from '@material-ui/core/LinearProgress';
import CompanyCard from 'ui-components/CompanyCard/CompanyCard';
import ErrorMessageComponent from '../../ui-components/ErrorMessageComponent/ErrorMessageComponent';
import Grid from '@material-ui/core/Grid';
import { Route } from 'react-router-dom';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import withGlobalContent from 'Generic/Global';
import { withStyles } from '@material-ui/core/styles';

import withApollo from 'react-apollo/withApollo';

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
class CompanyList extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			loadingRemoving: false,
			filterText: '',
			open: false
		};

		/*this.state = {
			loadingContracts: false,
			data: [],
			loadingRemoving: false,
			filterText: '',
			opendialog: false
		};*/
	}

	getCompaniesQuery = gql`
		{
			getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: "'C'", Id_Parent: 0) {
				Id
				Id_Contract
				Code
				Name
				Description
				ImageURL
				Address
			}
		}
	`;

	/**
     * To delete contracts by id
     */
	deleteCompanyQuery = gql`
		mutation DeleteCompany($Id: Int!, $IsActive: Int!) {
			delbusinesscompanies(Id: $Id, IsActive: $IsActive) {
				Code
				Name
			}
		}
	`;

	deleteCompany = () => {
		this.setState(
			{
				loadingRemoving: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.deleteCompanyQuery,
						variables: {
							Id: this.state.idToDelete,
							IsActive: 0
						}
					})
					.then((data) => {
						this.setState(
							{
								open: false,
								loadingRemoving: false
							},
							() => {
								this.props.handleOpenSnackbar('success', 'Company Deleted!');
							}
						);
					})
					.catch((error) => {
						this.setState(
							{
								open: false,
								loadingRemoving: false
							},
							() => {
								this.props.handleOpenSnackbar('error', 'Error: Deleting Company: ' + error);
							}
						);
					});
			}
		);
	};

	handleCloseAlertDialog = () => {
		this.setState({ open: false });
	};
	handleConfirmAlertDialog = () => {
		this.deleteCompany();
	};

	deleteCompanyById = (id) => {
		this.setState({ idToDelete: id, open: true, loadingRemoving: false });
	};

	renderCards = (data, refetch) => {
		const source = data.map(({ Id, Code, Description, Name, ImageURL, Address, Id_Contract }) => {
			return (
				<CompanyCard
					key={Id}
					idCompany={Id}
					name={Name}
					description={Description}
					url={ImageURL}
					idContract={Id_Contract}
					delete={(id) => {
						this.deleteCompanyById(id);
					}}
				/>
			);
		});
		return source;
	};

	// To render the content of the header
	renderHeaderContent = ({ history }) => (
		<div className="row">
			<div className="col-md-12">
				<button
					className="btn btn-success float-right"
					onClick={() => {
						history.push({
							pathname: '/home/company/add',
							state: { idCompany: 0, idContract: 0 }
						});
					}}
				>
					Add Management
				</button>
			</div>
		</div>
	);

	redirect() {
		this.props.history.push('/home/contract/add');
	}

	render() {
		const LoadCompanyList = () => (
			<Query query={this.getCompaniesQuery} pollInterval={500}>
				{({ loading, error, data, refetch, networkStatus }) => {
					//if (networkStatus === 4) return <LinearProgress />;

					if (loading) return <LinearProgress />;
					if (error)
						return (
							<ErrorMessageComponent
								title="Oops!"
								message={'Something went wrong'}
								type="Error-danger"
								icon="danger"
							/>
						);
					if (data.getbusinesscompanies != null && data.getbusinesscompanies.length > 0) {
						return (
							<Route
								render={({ history }) => (
									<div className="main-contract">
										<AlertDialogSlide
											handleClose={this.handleCloseAlertDialog}
											handleConfirm={this.handleConfirmAlertDialog}
											open={this.state.open}
											loadingConfirm={this.state.loadingRemoving}
											content="Do you really want to continue whit this operation?"
										/>

										<div className="">{this.renderHeaderContent({ history })}</div>
										<div className="company-list">
											{this.renderCards(data.getbusinesscompanies)}
										</div>
									</div>
								)}
							/>
						);
					}
					return (
						<React.Fragment>
							<Route render={({ history }) => (
								<div className="">{this.renderHeaderContent({ history })}</div>
							)} />
							<NothingToDisplay title="Wow!" message="Nothing to display!" type="Error-success" icon="wow" />
						</React.Fragment>
					);
				}}
			</Query>
		);

		return <div>{LoadCompanyList()}</div>;
	}
}

export default withStyles(styles)(withApollo(withGlobalContent(CompanyList)));

//export default CompanyList;
