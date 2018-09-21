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
	state = {
		data: [], open: false
	};



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
				/>
			);
		});
		return source;
	};



	// To render the content of the header
	renderHeaderContent = ({ history }) => (
		<div className={[this.props.root, 'company-list__header'].join(' ')}>
			<Grid container spacing={24}>
				<Grid item xs={12} sm={6}>
					<div className="search-container">

					</div>
				</Grid>
				<Grid item xs={12} sm={6}>
					<button
						className="add-company"
						onClick={() => {
							history.push({
								pathname: '/home/company/add',
								state: { idCompany: 0, idContract: 0 }
							});
						}}
					>
						Add Management
								</button>
				</Grid>
			</Grid>
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
								message="Something went wrong. If you think this is a server error, please contact the admnistrator"
								type="Error-danger"
							/>
						);
					if (data.getbusinesscompanies != null && data.getbusinesscompanies.length > 0) {

						return (
							<Route
								render={({ history }) => (
									<div className="main-contract">
										<div className="main-contract__header main-contract__header-sg-container">{this.renderHeaderContent({ history })}</div>
										<div className="company-list">{this.renderCards(data.getbusinesscompanies)}</div>
									</div>
								)}
							/>
						);
					}
					return <NothingToDisplay title="Wow!" message="Nothing to display!" type="Error-success" icon="wow" />;
				}}
			</Query>
		);

		return <div>{LoadCompanyList()}</div>;
	}
}

export default CompanyList;
