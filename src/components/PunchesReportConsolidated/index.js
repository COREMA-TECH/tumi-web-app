import React, { Component } from 'react';
import DropDown from './DropDown';
import Filter from './Filter';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import { GET_DEPARTMENTS_QUERY, GET_PROPERTIES_QUERY, GET_PUNCHES_REPORT_CONSOLIDATED } from './queries';
import { DELETE_MARKED_EMPLOYEE } from './Mutations';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import withApollo from 'react-apollo/withApollo';
import { Query } from "react-apollo";
import withGlobalContent from '../Generic/Global';

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
        editModal: false,
        allowEditModal: false,
        intervalTime: 30000
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE,
            loadingReport: false
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.propertyInfo) {
            let { id, name } = nextProps.propertyInfo;
            this.changeFilter({ value: id, label: name });
        }
    }

    componentWillMount() {
        this.getDepartments();
        this.getProperties();
        if (this.props.propertyInfo) {
            let { id, name } = this.props.propertyInfo;
            this.changeFilter({ value: id, label: name });
        }
    }

    handleClickOpenModal = (item, allowEditModal) => {
        this.setState({ openModal: true, item: item, editModal: true, allowEditModal });
    };

    handleClickCloseModal = () => {
        this.setState({ openModal: false, allowEditModal: false, intervalTime: 1 });
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
        if (startDate)
            filters = { ...filters, startDate };
        if (endDate)
            filters = { ...filters, endDate };
        if (idRol == 5) filters = { ...filters, idEntity };

        filters = { ...filters, employee: employee ? employee : '' };

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


    calculateTotalHrs = (data) => {
        let dataList = data.markedEmployeesConsolidated || [];
        let total = 0, currentId = 0;
        let BreakException = {};
        try {
            dataList.forEach(_ => {
                _.punches.forEach(_punch => {
                    if (currentId == 0)
                        currentId = _punch.employeeId;
                    else if (currentId != _punch.employeeId) {
                        total = 0;
                        throw BreakException;
                    }
                    else
                        total += _punch.duration;
                })
            })
        }
        catch (e) {
            if (e != BreakException) throw e;
        }
        return total;
    }

    componentDidMount(){
        this.setState(_ => ({intervalTime: 30000}))
    }

    handleDeleteTimeModal = ({ clockInId, clockOutId }) => {
        this.setState(() => ({
            openConfirmDeleteTime: true,
            clockInIdToDelete: clockInId,
            clockOutIdToDelete: clockOutId
        }))
    }

    handleCloseDeleteTimeModal = () => {
        this.setState({ openConfirmDeleteTime: false });
    }

    handleConfirmDeleteTime = () => {
        this.setState(() => ({ removingTime: true }), () => {
            this.props.client
                .mutate({
                    mutation: DELETE_MARKED_EMPLOYEE,
                    variables: { idsToDelete: [this.state.clockInIdToDelete, this.state.clockOutIdToDelete] }
                })
                .then(({ data }) => {
                    this.setState(() => ({ clockInIdToDelete: null, clockOutIdToDelete: null, removingTime: false, openConfirmDeleteTime: false }));
                    this.props.handleOpenSnackbar('success', 'Records deleted successfully');
                })
                .catch(error => {
                    this.setState(() => ({ removingTime: false }));

                });
        })
    }
    render() {
        return <React.Fragment>
            <ConfirmDialog
                open={this.state.openConfirmDeleteTime}
                closeAction={this.handleCloseDeleteTimeModal}
                confirmAction={this.handleConfirmDeleteTime}
                title={'are you sure you want to delete this record?'}
                loading={this.state.removingTime}
            />
            <div className="row">
                <div className={this.props.leftStepperComponent ? 'col-md-3 col-xl-2' : 'd-none'}>
                    {this.props.leftStepperComponent}
                </div>

                <div className={this.props.leftStepperComponent ? 'col-md-9 col-xl-10' : 'col-md-12'}>
                    <div className="card" style={{ "position": "relative" }}>
                        <Filter {...this.state} updateFilter={this.updateFilter} getFilters={this.getFilters} editModal={this.state.openModal} allowEditModal={this.state.allowEditModal} item={this.state.item} handleClickCloseModal={this.handleClickCloseModal} />
                    </div>
                    <div className="card" style={{ "position": "relative" }}>
                        <Query query={GET_PUNCHES_REPORT_CONSOLIDATED} variables={this.getFilters()} fetchPolicy="cache-and-network" pollInterval={this.state.intervalTime}>

                            {({ loading, error, data }) => {

                                let total = this.calculateTotalHrs(data);

                                return <React.Fragment>
                                    {total > 0 ? <div className="card-head pt-3 pb-3 text-right mr-3">
                                        <span class="badge badge-primary">Total: ${total} HRS</span>
                                    </div> : <React.Fragment />
                                    }

                                    <DropDown data={data.markedEmployeesConsolidated || []} handleEditModal={this.handleClickOpenModal} handleDeleteTimeModal={this.handleDeleteTimeModal}></DropDown>

                                </React.Fragment>
                            }}
                        </Query>                        
                    </div>
                </div>
            </div>
        </React.Fragment >

    }
}


export default withApollo(withGlobalContent(PunchesReportConsolidated));