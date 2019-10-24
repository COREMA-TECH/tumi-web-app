import React, {Component, Fragment} from 'react';
import { withApollo } from 'react-apollo';
import {GET_DOCUMENT_TYPES, GET_HISTORICAL_DOCUMENTS} from './Queries';
import Dropdown from './Dropdown';
import typeDocuments from '../../../../data/TypeDocuments';

class HistoricalNHP extends Component {

    state = {
        historicalDocuments: []
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
        this.getHistoricalDocuments();
    }

    render() {
        const {historicalDocuments} = this.state;
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