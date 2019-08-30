import React, { Component } from 'react';
import Table from './table';
import Filter from './filter';
import moment from 'moment';

import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import withApollo from 'react-apollo/withApollo';
import { GET_APPLICATION_QUERY, GET_RECRUITER_QUERY } from './queries';

class RecruiterReport extends Component {

    DEFAULT_STATE = {
        data: [],
        recruiters: [],
        frequency: "D",
        date: new Date().toISOString().substring(0, 10),
        recruiter: ''

    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE
        }
    }
    componentWillMount() {
        this.getReport();
        this.getRecruiters();
    }

    getFilters = () => {
        var { recruiter, frequency, date } = this.state;
        var filter = {}, startDate, endDate;
        //Add filter by recruiter
        if (recruiter)
            filter = { ...filter, UserId: this.state.recruiter };
        //Add filter by date
        if (frequency && date) {

            startDate = moment(date).startOf(frequency).format('MM/DD/YYYY');
            endDate = moment(date).endOf(frequency).format('MM/DD/YYYY');

            filter = { ...filter, startDate, endDate }
        }
        return filter;
    }

    getRecruiterFilter = () => {
        let userId = localStorage.getItem('LoginId');
        let roleId = localStorage.getItem('IdRoles');
        var filter = {};
        if (userId && roleId == 4)
            filter = { ...filter, Id: userId }
        return filter;
    }

    getReport = () => {
        this.setState(() => ({ loadingReport: true }), () => {
            this.props.client
                .query({
                    query: GET_APPLICATION_QUERY,
                    fetchPolicy: 'no-cache',
                    variables: this.getFilters()
                })
                .then(({ data }) => {
                    this.setState(() => ({
                        data: data.recruiterReport,
                        loadingReport: false
                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingReport: false }));
                });
        })

    }

    getRecruiters = () => {
        this.setState(() => ({ loadingRecruiter: true }), () => {
            this.props.client
                .query({
                    query: GET_RECRUITER_QUERY,
                    fetchPolicy: 'no-cache',
                    variables: this.getRecruiterFilter()
                })
                .then(({ data }) => {
                    this.setState(() => ({
                        recruiters: data.user,
                        loadingRecruiter: false,
                        recruiter: data.user.length == 1 ? data.user[0].Id : ''
                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingRecruiter: false }));
                });
        })
    }

    updateFilter = ({ recruiter, frequency, date }) => {
        this.setState(() => ({ recruiter, frequency, date }), this.getReport);
    }

    render() {
        const { loadingRecruiter, loadingReport } = this.state;
        const loading = loadingRecruiter || loadingReport;

        return <React.Fragment>
            {loading && <LinearProgress />}
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <Filter {...this.state} updateFilter={this.updateFilter} />
                        <Table data={this.state.data} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
}

export default withApollo(RecruiterReport);