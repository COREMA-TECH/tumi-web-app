import React, { Component } from 'react';
import Table from './table';
import Filter from './filter';

import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import withApollo from 'react-apollo/withApollo';
import { GET_REPORT_QUERY, GET_DEPARTMENTS_QUERY, GET_PROPERTIES_QUERY } from './queries';

class PunchesReport extends Component {

    DEFAULT_STATE = {
        data: [],
        properties: [],
        departments: [],
        property: 0,
        department: 0,
        employee: '',
        startDate: '',
        endDate: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE
        }
    }
    componentWillMount() {
        this.getReport();
        this.getDepartments();
        this.getProperties();
    }

    getReport = () => {
        this.setState(() => ({ loadingReport: true }), () => {
            this.props.client
                .query({
                    query: GET_REPORT_QUERY,
                    fetchPolicy: 'no-cache',
                    variables: { ...this.getFilters() }
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

    getDepartments = () => {
        this.setState(() => ({ loadingDepartments: true }), () => {
            this.props.client
                .query({
                    query: GET_DEPARTMENTS_QUERY,
                    variables: { Id_Entity: this.state.property },
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {
                    this.setState(() => ({
                        departments: data.catalogitem,
                        loadingDepartments: false
                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingDepartments: false }));
                });
        })
    }

    getProperties = () => {
        this.setState(() => ({ loadingProperties: true }), () => {
            this.props.client
                .query({
                    query: GET_PROPERTIES_QUERY,
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {
                    this.setState(() => ({
                        properties: data.getbusinesscompanies,
                        loadingProperties: false
                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingProperties: false }));
                });
        })
    }

    getFilters = () => {
        var filters = {}, { property, department, employee, startDate, endDate } = this.state;

        if (property)
            filters = { ...filters, idEntity: property };
        if (department)
            filters = { ...filters, Id_Department: department };
        if (employee)
            filters = { ...filters, employee };
        if (startDate)
            filters = { ...filters, startDate };
        if (endDate)
            filters = { ...filters, endDate };

        return filters;
    }

    updateFilter = ({ property, department, employee, startDate, endDate }) => {
        this.setState((prevState) => ({
            property,
            department: prevState.property != property ? 0 : department,
            employee,
            startDate,
            endDate,
            departments: prevState.property != property ? [] : prevState.departments
        }), () => {
            this.getDepartments();
            this.getReport();
        });
    }

    render() {
        const { loadingReport } = this.state;
        const loading = loadingReport;

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

export default withApollo(PunchesReport);