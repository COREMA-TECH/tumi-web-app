import React, {Component} from 'react';
import './index.css';
import gql from 'graphql-tag';
import {Query} from 'react-apollo';
import LinearProgress from '@material-ui/core/LinearProgress';
import CompanyCard from 'ui-components/CompanyCard/CompanyCard';
import ErrorMessageComponent from "../../ui-components/ErrorMessageComponent/ErrorMessageComponent";

class CompanyList extends Component {
    state = {data: [], open: false};

    getCompaniesQuery = gql`
		{
			getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: "'C'", Id_Parent: null) {
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
        const source = data.map(({Id, Code, Description, Name, ImageURL, Address, Id_Contract}) => {
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

    redirect() {
        this.props.history.push('/home/Company/add');
    }

    render() {
        const LoadCompanyList = () => (
            <Query query={this.getCompaniesQuery} pollInterval={500}>
                {({loading, error, data, refetch, networkStatus}) => {
                    //if (networkStatus === 4) return <LinearProgress />;
                    if (loading) return <LinearProgress/>;
                    if (error) return (
                        <ErrorMessageComponent
                            url="https://www.materialui.co/materialIcons/alert/error_red_192x192.png"
                            message="Error loading companies"
                        />
                    );
                    if (data.getbusinesscompanies != null && data.getbusinesscompanies.length > 0) {
                        return (
                            <div className="company-list">
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
