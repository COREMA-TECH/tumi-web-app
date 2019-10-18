import React, {Component, Fragment} from 'react';
import { withApollo } from 'react-apollo';
import {GET_DOCUMENT_TYPES, GET_HISTORICAL_DOCUMENTS} from './Queries';
import Dropdown from './Dropdown';

class HistoricalNHP extends Component {

    state = {
        typeDocuments: [],
        historicalDocuments: []
    }

    getTypeDocument = () => {
        this.props.client.query({
            query: GET_DOCUMENT_TYPES,
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState({
                typeDocuments: data ? data.applicationDocumentTypes : []
            })
        }).catch(error => {
            console.log(error)
        });
    }

    getHistoricalDocuments = () => {
        this.props.client.query({
            query: GET_HISTORICAL_DOCUMENTS,
            fetchPolicy: 'no-cache',
            variables:{
                ApplicationId: this.props.applicationId
            }
        }).then(({ data }) => {
            this.setState({
                historicalDocuments: data ? data.applicantLegalDocuments : []
            })
        }).catch(error => {
            console.log(error)
        });
    }

    componentDidMount() {
        this.getTypeDocument();
        this.getHistoricalDocuments();
    }

    render() {
        const {typeDocuments, historicalDocuments} = this.state;
        return <Fragment>
            <div className="card">
                <div className="card-body">
                    <div className="mb-5">
                        <h3>Historical New Hire Package</h3>
                    </div>
                    <Dropdown data={typeDocuments} historicalDocuments={historicalDocuments} />
                </div>
            </div>
        </Fragment>
    }
} 

export default withApollo(HistoricalNHP);