import React, { Component } from 'react';
import Table from './table';
import Filter from './filter';
import withGlobalContent from 'Generic/Global';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import withApollo from 'react-apollo/withApollo';
import moment from 'moment';
import { GET_REPORT_QUERY } from './queries';
import { APPROVE_MARKS, UNAPPROVE_MARKS } from './mutations';

class ApprovePunchesReport extends Component {

    DEFAULT_STATE = {
        data: [],
        rowsId: [],
        approving: false,
        unapproving: false
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
                    fetchPolicy: 'no-cache',
                    variables: this.getFilters()
                })
                .then(({ data }) => {
                    this.setState(() => ({
                        data: data.approvePunchesReport,
                        loadingReport: false
                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingReport: false, data: [] }));
                });
        })
    }

    approveMarks = (rowsId, idsToApprove) => {
        this.setState(() => ({ approving: true, rowsId: Array.isArray(rowsId) ? rowsId : [rowsId] }));
        this.props.client.mutate({
            mutation: APPROVE_MARKS,
            variables: {
                approvedDate: this.state.endDate,
                idsToApprove
            }
        })
            .then(({ data: { approveMarks } }) => {
                this.props.handleOpenSnackbar('success', 'Data successfully processed');
                this.setState(() => ({ approving: false }), this.getReport);
            })
            .catch(_ => {
                this.props.handleOpenSnackbar('error', 'Error approving record');
                this.setState(() => ({ approving: false }));
            })
    }

    unapproveMarks = (rowsId, idsToUnapprove) => {
        this.setState(() => ({ unapproving: true, rowsId: Array.isArray(rowsId) ? rowsId : [rowsId] }));
        this.props.client.mutate({
            mutation: UNAPPROVE_MARKS,
            variables: {
                idsToUnapprove
            }
        })
            .then(({ data: { unapproveMarks } }) => {
                this.props.handleOpenSnackbar('success', 'Data successfully processed');
                this.setState(() => ({ unapproving: false }), this.getReport);
            })
            .catch(_ => {
                this.props.handleOpenSnackbar('error', 'Error unapproving record');
                this.setState(() => ({ unapproving: false }));
            })
    }

    changeFilter = (property) => {
        this.setState(() => ({
            property
        }), () => {
            this.getReport();
        });
    }

    getFilters = () => {
        var filters = {}, { employee, startDate, endDate, status } = this.state;

        if (employee)
            filters = { ...filters, idEmployee: employee };
        if (startDate)
            filters = { ...filters, startDate: moment(startDate).format("MM/DD/YYYY") };
        if (endDate)
            filters = { ...filters, endDate: moment(endDate).format("MM/DD/YYYY") };
        if (status)
            filters = { ...filters, status };

        return filters;
    }

    updateFilter = ({ employee, startDate, endDate, status }) => {
        this.setState((prevState) => ({
            employee,
            startDate,
            endDate,
            status
        }), () => {
            this.getReport();
        });
    }

    updateLoadingStatus = (status) => {
        this.setState(() => ({ loadingReport: status }))
    }

    render() {
        const { loadingReport, approving, unapproving, rowsId, endDate } = this.state;
        const loading = loadingReport;
        console.log({ endDate })
        return <React.Fragment>
            {loading && <LinearProgress />}

            <div className="row">
                <div className="col-md-12">
                    <Filter {...this.state} updateFilter={this.updateFilter} updateLoadingStatus={this.updateLoadingStatus} />
                    <Table data={this.state.data} approving={approving} unapproving={unapproving} approveMarks={this.approveMarks} unapproveMarks={this.unapproveMarks} rowsId={rowsId} endDate={endDate} />
                </div>
            </div>
        </React.Fragment>
    }
}

export default withApollo(withGlobalContent(ApprovePunchesReport));