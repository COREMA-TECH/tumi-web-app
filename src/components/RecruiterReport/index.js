import React, { Component } from 'react';
import Table from './table';
import Filter from './filter';

import withApollo from 'react-apollo/withApollo';
import { GET_APPLICATION_QUERY } from './queries';

class RecruiterReport extends Component {
    DEFAULT_STATE = {
        data: []
    }
    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE
        }
    }
    componentWillMount() {
        this.getReport();
    }
    getReport = () => {
        this.props.client
            .query({
                query: GET_APPLICATION_QUERY
            })
            .then(({ data }) => {
                this.setState(() => ({
                    data: data.applications
                }));
            })
            .catch(error => {

            });

        this.setState({
            openModal: this.props.openModal

        });
    }
    render() {
        return <div className="row">
            <div className="col-md-12">
                <div className="card">

                    <Filter />
                    <Table data={this.state.data} />
                </div>
            </div>
        </div>
    }
}

export default withApollo(RecruiterReport);