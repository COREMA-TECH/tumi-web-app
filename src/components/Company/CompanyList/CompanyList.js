import React, { Component } from 'react';
import './index.css';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import LinearProgress from '@material-ui/core/LinearProgress';
import CompanyCard from '../../ui-components/CompanyCard/CompanyCard';
import Redirect from 'react-router-dom/es/Redirect';

class CompanyList extends Component {
	state = { data: [], open: false };

	loadCompanies = () => {
		console.log('Loading companies');
	};

	getCompaniesQuery = gql`
		{
			getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: "'C'") {
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
			{
				/*<CompanyCard*/
			}
			{
				/*key={Id}*/
			}
			{
				/*idCompany={Id}*/
			}
			{
				/*code={Code}*/
			}
			{
				/*imageUrl={ImageURL}*/
			}
			{
				/*title={Name}*/
			}
			{
				/*description={Description}*/
			}
			{
				/*address={Address}*/
			}
			{
				/*loadCompanies={() => this.loadCompanies(refetch)}*/
			}
			{
				/*open={this.state.open}*/
			}
			{
				/*/>*/
			}
			return <CompanyCard key={Id} idCompany={Id} name={Name} description={Description} url={ImageURL} idContract={Id_Contract} />;
		});
		return source;
	};

	redirect() {
		this.props.history.push('/home/Company/add');
	}

	render() {
		const LoadCompanyList = () => (
			<Query query={this.getCompaniesQuery} pollInterval={500}>
				{({ loading, error, data, refetch, networkStatus }) => {
					//if (networkStatus === 4) return <LinearProgress />;
					if (loading) return <LinearProgress />;
					if (error) return <p>Error </p>;
					if (data.getbusinesscompanies != null && data.getbusinesscompanies.length > 0) {
						return (
							<div className="company-list">
								<div className="company-list__header">
									<button
										onClick={() => {
											this.redirect();
										}}
										className="add-company"
									>
										{/*<a href="Company/add">Add Company </a>*/}
										Add Company
									</button>
								</div>
								{this.renderCards(data.getbusinesscompanies)}
							</div>
						);
					}
					return <p>Nothing to display </p>;
				}}
			</Query>
		);

		return <div>{LoadCompanyList()}</div>;
	}
}

export default CompanyList;
