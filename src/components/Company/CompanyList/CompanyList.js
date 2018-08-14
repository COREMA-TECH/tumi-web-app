import React, {Component} from 'react';
import './index.css';
import CompanyCard from "../CompanyCard/CompanyCard";
import {Query} from 'react-apollo';
import gql from 'graphql-tag';

const COMPANY_QUERY = gql`
    {
        companies(Id: 1) {
            Name,
            Description,
            ImageURL
        }
    }
`;

class CompanyList extends Component {
    render() {
        return (
            <div className="company-list">
                <Query query={COMPANY_QUERY}>
                    {
                        ({error, data, loading}) => {
                            if (loading) return <div>Fetching</div>;
                            if (error) {
                                console.log("The error " + error);
                                return <div>Error</div>;
                            }

                            let companies = data.companies;

                            // Access to the data
                            return (
                                <div>
                                    {companies.map(company => <CompanyCard
                                        title={company.Name}
                                        description={company.Description}
                                        url={company.ImageURL}
                                    />)}
                                </div>
                            )
                        }
                    }
                </Query>
            </div>
        );
    }
}

export default CompanyList;
