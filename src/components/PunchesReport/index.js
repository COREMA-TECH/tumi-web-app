import React, { Component } from 'react';
import Table from './table';
import Filter from './filter';
import moment from 'moment';

import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import withApollo from 'react-apollo/withApollo';
import { GET_REPORT_QUERY } from './queries';

class PunchesReport extends Component {

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
        this.setState(() => ({ loadingReport: true }), () => {
            this.props.client
                .query({
                    query: GET_REPORT_QUERY,
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {
                    this.setState(() => ({
                        data: data.punches,
                        loadingReport: false
                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingReport: false }));
                });
        })

    }
    render() {
        const { loadingReport } = this.state;
        const loading = loadingReport;

        return <React.Fragment>
            {loading && <LinearProgress />}
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <Filter />
                        <Table data={this.state.data} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
}

export default withApollo(PunchesReport);