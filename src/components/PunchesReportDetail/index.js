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

    getFilters = () => {
        var filters = {}, { startDate, endDate } = this.state, { EmployeeId } = this.props;

        if (startDate)
            filters = { ...filters, startDate };
        if (endDate)
            filters = { ...filters, endDate };
        if (EmployeeId)
            filters = { ...filters, EmployeeId };

        return filters;
    }

    getPunchesReport = () => {
        this.setState(() => ({ loadingReport: true }), () => {
            this.props.client
                .query({
                    query: GET_PUNCHES_REPORT_CONSOLIDATED,
                    variables: { ...this.getFilters() },
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {
                    this.setState(() => ({
                        data: data.markedEmployeesDetail,
                        loadingReport: false
                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingReport: false }));
                });
        })
    }

    updateFilter = ({ startDate, endDate }) => {
        this.setState((prevState) => ({
            startDate,
            endDate,
        }), () => {
            this.getPunchesReport();
        });
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
                        <Filter updateFilter={this.updateFilter} />
                        <DropDown data={this.state.data}></DropDown>
                    </div>
                </div>
            </div>
        </React.Fragment>

    }
}


export default withApollo(PunchesReportDetail);