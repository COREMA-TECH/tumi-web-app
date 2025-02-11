import React, { Component } from 'react';
import Table from './table';
import Filter from './filter';

import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import withApollo from 'react-apollo/withApollo';
import {GET_DEPARTMENTS_QUERY, GET_PROPERTIES_QUERY, GET_REPORT_QUERY} from './queries';
// import './index.css';

import PreFilter from './PreFilter';
import Dialog from "@material-ui/core/Dialog/Dialog";

const PROPERTY_DEFAULT = { value: '', label: 'Property(All)' };
const DEPARTMENT_DEFAULT = { value: '', label: 'Department(All)' };

class PunchesReport extends Component {

    DEFAULT_STATE = {
        data: [],
        properties: [],
        departments: [],
        property: PROPERTY_DEFAULT,
        department: DEPARTMENT_DEFAULT,
        employee: '',
        startDate: '',
        endDate: '',
        openModal: false,
        openModalPicture: false,
        urlPicture: ''
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

    handleClickOpenModal = () => {
        this.setState({ openModal: true });
    };

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
            var variables = {};

            if (this.state.property.value)
                variables = { Id_Entity: this.state.property.value };

            this.props.client
                .query({
                    query: GET_DEPARTMENTS_QUERY,
                    variables,
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {
                    let options = [];

                    //Add first record
                    options.push({ value: '', label: 'Department(All)' });

                    //Create structure based on department data
                    data.catalogitem.map(({ Id, DisplayLabel }) => {
                        options.push({ value: Id, label: DisplayLabel })
                    });

                    this.setState(() => ({
                        departments: options,
                        loadingDepartments: false
                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingDepartments: false }));
                });
        })
    }

    changeFilter = (property) => {
        this.setState(() => ({
            property
        }), () => {
            this.getReport();
        });
    }

    getProperties = () => {
        this.setState(() => ({ loadingProperties: true }), () => {
            this.props.client
                .query({
                    query: GET_PROPERTIES_QUERY,
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {
                    let options = [];

                    //Add first record
                    options.push({ value: '', label: 'Property(All)' });

                    //Create structure based on property data
                    data.getbusinesscompanies.map((property) => {
                        options.push({ value: property.Id, label: property.Code + " | " + property.Name });
                    });

                    //Set values to state
                    this.setState(() => ({
                        properties: options,
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

        if (property.value)
            filters = { ...filters, idEntity: property.value };
        if (department.value)
            filters = { ...filters, Id_Department: department.value };
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
            department: prevState.property.value != property.value ? DEPARTMENT_DEFAULT : department,
            employee,
            startDate,
            endDate,
            departments: prevState.property.value != property.value ? [] : prevState.departments
        }), () => {
            this.getDepartments();
            this.getReport();
        });
    }

    handleClickOpenModalPicture = (urlPicture) => {
        this.setState({
            openModalPicture: true,
            urlPicture: urlPicture
        });
    };

    handleCloseModalPicture = () => {
        this.setState({ openModalPicture: false });
    };

    handleCloseModal = () => {
        this.setState({ openMpdal: false });
    };
    render() {
        const { loadingReport } = this.state;
        const loading = loadingReport;


        let renderDialogPicture = () => (
            <Dialog maxWidth="md" open={this.state.openModalPicture} onClose={this.handleCloseModalPicture}>
                {/*<DialogTitle style={{ width: '800px', height: '800px'}}>*/}
                <img src={this.state.urlPicture} className="avatar-lg" />
                {/*</DialogTitle>*/}
            </Dialog>
        );


        return <React.Fragment>
            {loading && <LinearProgress />}
            {
                renderDialogPicture()
            }
            <PreFilter changeFilter={this.changeFilter} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card">
                        <Filter {...this.state} updateFilter={this.updateFilter} getFilters={this.getFilters} getReport={this.getReport} />
                        <Table
                            openModal={this.state.openModal}
                            openModalPicture={this.handleClickOpenModalPicture}
                            closeModalPicture={this.handleCloseModalPicture}
                            handleCloseModal={this.handleCloseModal}
                            data={this.state.data} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    }
}

export default withApollo(PunchesReport);