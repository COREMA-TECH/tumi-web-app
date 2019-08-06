import React, { Component } from 'react';
import DropDown from './DropDown';
import Filter from './Filter';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import { GET_DEPARTMENTS_QUERY, GET_PROPERTIES_QUERY, GET_PUNCHES_REPORT_CONSOLIDATED } from './queries';
import withApollo from 'react-apollo/withApollo';
import Dialog from "@material-ui/core/Dialog/Dialog";
import { Query } from "react-apollo";

const PROPERTY_DEFAULT = { value: '', label: 'Property(All)' };
const DEPARTMENT_DEFAULT = { value: '', label: 'Department(All)' };

class PunchesReportConsolidated extends Component {

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
        urlPicture: '',
        item: {},
        editModal: false
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE,
            loadingReport: false
        }
    }


    componentWillMount() {
        this.getDepartments();
        this.getProperties();
    }

    handleClickOpenModal = (item) => {
        this.setState({ openModal: true, item: item, editModal: true });
    };

    handleClickCloseModal = () => {
        this.setState({ openModal: false });
    }

    getDepartments = () => {
        this.setState(() => ({ loadingDepartments: true }), () => {
            this.props.client
                .query({
                    query: GET_DEPARTMENTS_QUERY,
                    variables: { UserId: localStorage.getItem('LoginId') },
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {
                    let options = [];

                    //Add first record
                    options.push({ value: '', label: 'Department(All)' });

                    //Create structure based on department data
                    data.departmentsByUser.map(({ Id, DisplayLabel }) => {
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
        this.setState(() => ({ property }));
    }

    getProperties = () => {
        this.setState(() => ({ loadingProperties: true }), () => {
            this.props.client
                .query({
                    query: GET_PROPERTIES_QUERY,
                    fetchPolicy: 'no-cache',
                    variables: { Id: localStorage.getItem('LoginId') }
                })
                .then(({ data }) => {
                    let options = [];

                    //Add first record
                    options.push({ value: '', label: 'Property(All)' });

                    //Create structure based on property data
                    data.companiesByUser.map((property) => {
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
        let idRol = localStorage.getItem('IdRoles');
        let idEntity = localStorage.getItem("Id_Entity");

        if (property.value)
            filters = { ...filters, idEntity: property.value };
        else
            filters = { ...filters, idEntity: this.state.properties.filter(_ => _.value > 0).map(_ => _.value) };
        if (department.value)
            filters = { ...filters, Id_Deparment: department.value };
        else
            filters = { ...filters, Id_Deparment: this.state.departments.filter(_ => _.value > 0).map(_ => _.value) };
        if (employee)
            filters = { ...filters, employee };
        if (startDate)
            filters = { ...filters, startDate };
        if (endDate)
            filters = { ...filters, endDate };
        if (idRol == 5) filters = { ...filters, idEntity };

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
            {renderDialogPicture()}
            <div className="row">
                <div className="col-md-12">
                    <div className="card" style={{ "position": "relative"}}>
                        <Filter {...this.state} updateFilter={this.updateFilter} getFilters={this.getFilters} editModal={this.state.openModal} item={this.state.item} handleClickCloseModal={this.handleClickCloseModal} />
                    </div>
                    <div className="card" style={{ "position": "relative", "overflow": "hidden" }}>
                        <Query query={GET_PUNCHES_REPORT_CONSOLIDATED} variables={this.getFilters()} fetchPolicy="cache-and-network" pollInterval="5000">

                            {({ loading, error, data }) => {
                                return <React.Fragment>
                                    <DropDown data={data.markedEmployeesConsolidated || []} handleEditModal={this.handleClickOpenModal}></DropDown>
                                </React.Fragment>
                            }}
                        </Query>
                    </div>
                </div>
            </div>
        </React.Fragment >

    }
}


export default withApollo(PunchesReportConsolidated);