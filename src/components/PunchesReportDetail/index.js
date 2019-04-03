import React, { Component } from 'react';
import DropDown from './DropDown';
import Filter from './Filter';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import { GET_PUNCHES_REPORT_CONSOLIDATED } from './queries';
import withApollo from 'react-apollo/withApollo';

class PunchesReportDetail extends Component {

    constructor(props) {
        super(props);
        this.state = { loadingReport: false, data: [] }
    }

    getPunchesReport = () => {
        this.setState(() => ({ loadingReport: true }), () => {
            this.props.client
                .query({
                    query: GET_PUNCHES_REPORT_CONSOLIDATED,
                    fetchPolicy: 'no-cache',
                })
                .then(({ data }) => {
                    console.log(data);
                    this.setState(() => ({
                        data: data.markedEmployeesConsolidate,
                        loadingReport: false
                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingReport: false }));
                });
        })
    }


    componentWillMount() {
        this.getPunchesReport();
    }

    render() {
        var { loadingReport } = this.state;

        return <React.Fragment>
            {loadingReport && <LinearProgress />}

            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <Filter />
                        <DropDown data={this.state.data}></DropDown>
                    </div>
                </div>
            </div>
        </React.Fragment>

    }
}


export default withApollo(PunchesReportDetail);