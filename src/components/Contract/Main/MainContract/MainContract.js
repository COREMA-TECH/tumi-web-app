import React, {Component} from 'react';
import './index.css';
import {gql} from 'apollo-boost';
import withApollo from "react-apollo/withApollo";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import TablesContracts from "./TablesContracts";
import CircularProgress from "../../../material-ui/CircularProgress";
import {Query} from "react-apollo";
import NothingToDisplay from "../../../ui-components/NothingToDisplay/NothingToDisplay";

class MainContract extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loadingContracts: false,
            data: [],
            loadingRemoving: false
        }
    }

    /**
     * This method redirect to create contract component
     */
    redirectToCreateContract = () => {
        this.props.history.push('/home/contract/add');
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

    getContracts = () => {
        // Show linear progress
        this.setState({
            loadingContracts: true,
        }, () => {
        });

        this.props.client
            .query({
                query: this.getContractsQuery,
                fetchPolicy: 'no-cache',
            })
            .then(({data}) => {
                this.setState(prevState => ({
                    data: [...prevState.data, data.getcontracts]
                }), () => {
                    // Hide linear progress
                    this.setState({
                        loadingContracts: false,
                    });
                });
            })
            .catch(error => {
                console.log("Error fetching data")
            })
    };

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

    deleteContractById = id => {
        // this.setState(prevState => ({
        //     data: this.state.data.filter((_, i) => {
        //         let element = _.map(item => item.Id);
        //         return (element !== id);
        //     })
        // }), () => {
        //
        // });

        this.setState({
            loadingRemoving: true,
        }, () => {
            this.props.client
                .mutate({
                    mutation: this.deleteContractQuery,
                    variables: {
                        Id: id
                    },
                })
                .then(data => {
                    this.setState({
                        loadingRemoving: false
                    })
                })
                .catch(error => console.log(error))
        });
    };

    render() {
        // If contracts query is loading, show a progress component
        if (this.state.loadingContracts) {
            return <LinearProgress/>
        }

        if (this.state.loadingRemoving) {
            return (
                <CircularProgress/>
            )
        }


        // To render the content of the header
        let renderHeaderContent = () => (
            <button className="add-company" onClick={() => {
                this.redirectToCreateContract()
            }}>Add Contract</button>
        );

        return (
            <div className="main-contract">
                <div className="main-contract__header">
                    <div className="company-list__header">
                        {renderHeaderContent()}
                    </div>
                </div>
                <div className="main-contract__content">
                    <Query query={this.getContractsQuery} pollInterval={300}>
                        {({loading, error, data, refetch, networkStatus}) => {
                            //if (networkStatus === 4) return <LinearProgress />;
                            if (loading) return <LinearProgress/>;
                            if (error) return <p>Error </p>;
                            if (data.getcontracts != null && data.getcontracts.length > 0) {
                                return (
                                    <TablesContracts
                                        data={data.getcontracts}
                                        delete={(id) => {
                                            this.deleteContractById(id)
                                        }}/>
                                )
                            }
                            return (
                                <NothingToDisplay
                                    url="https://cdn3.iconfinder.com/data/icons/business-2-3/256/Contract-512.png"
                                    message="There are no contracts"/>
                            )
                        }}
                    </Query>
                </div>
            </div>
        );
    }
}

export default withApollo(MainContract);