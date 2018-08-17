import React, {Component} from 'react';
import CompanyCard from '../CompanyCard/';
import './index.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import LinearProgress from '@material-ui/core/LinearProgress';

class CompanyList extends Component {
    state = {data: [], open: false};

    loadCompanies = () => {
        console.log('Loading companies');
    };

    getCompaniesQuery = gql`
        {
            getcompanies(Id: null, IsActive: 1) {
                Id
                Code
                Name
                Description
                ImageURL
                Address
            }
        }
    `;

    renderCards = (data, refetch) => {
        const source = data.map(({Id, Code, Description, Name, ImageURL, Address}) => (
            <CompanyCard
                key={Id}
                idCompany={Id}
                code={Code}
                imageUrl={ImageURL}
                title={Name}
                description={Description}
                address={Address}
                loadCompanies={() => this.loadCompanies(refetch)}
                open={this.state.open}
            />
        ));
        return source;
    };

    render() {
        const LoadCompanyList = () => (
            <Query query={this.getCompaniesQuery} pollInterval={500}>
                {({loading, error, data, refetch, networkStatus}) => {
                    //if (networkStatus === 4) return <LinearProgress />;
                    if (loading) return <LinearProgress/>;
                    if (error) return <p>Error </p>;
                    if (data.getcompanies != null && data.getcompanies.length > 0) {
                        console.log(networkStatus);
                        return <div className="company-list">{this.renderCards(data.getcompanies)}</div>;
                    }
                    return <p>Nothing to display </p>;
                }}
            </Query>
        );

        return <div>{LoadCompanyList()}</div>;
    }
}

export default CompanyList;
