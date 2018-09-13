import React, {Component} from 'react';
import './index.css';
import {gql} from 'apollo-boost';
import withApollo from "react-apollo/withApollo";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import TablesContracts from "./TablesContracts";

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
        });

        this.props.client
            .query({
                query: this.getContractsQuery
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
        this.setState({
            loadingRemoving: true
        });

        alert(id);

        this.props.client
            .mutate({
                mutation: this.deleteContractQuery,
                variables: {
                    Id: id
                }
            })
            .then(data => {
                this.setState({
                    loadingRemoving: false
                });

                this.getContracts();
            })
            .catch(error => console.log(error))
    };



    /**
     * Get data before render
     */
    componentWillMount() {
        this.getContracts()
    }

    render() {
        // If contracts query is loading, show a progress component
        if (this.state.loadingContracts) {
            return <LinearProgress/>
        }

        if (this.state.loadingRemoving) {
            return <LinearProgress/>
        }


        // To render the content of the header
        let renderHeaderContent = () => (
            <button className="add-company" onClick={() => {
                this.redirectToCreateContract()
            }}>Add Contract</button>
        );


        let renderTableWithContracts = () => (
                <TablesContracts data={this.state.data[0]} delete={(id) => {
                    this.deleteContractById(id)
                }}/>
        );

        return (
            <div className="main-contract">
                <div className="main-contract__header">
                    <div className="company-list__header">
                        {renderHeaderContent()}
                    </div>
                </div>
                <div className="main-contract__content">
                    {renderTableWithContracts()}
                </div>
            </div>
        );
    }
}

export default withApollo(MainContract);