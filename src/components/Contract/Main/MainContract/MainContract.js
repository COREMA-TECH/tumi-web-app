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
            data: []
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

        // To render the content of the header
        let renderHeaderContent = () => (
            <button className="add-company" onClick={() => {
                this.redirectToCreateContract()
            }}>Add Contract</button>
        );


        let renderTableWithContracts = () => (
                <TablesContracts data={this.state.data[0]} />
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