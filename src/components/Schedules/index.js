import FilterForm from './FilterForm.js';
import Filters from './Filters.js';
import React, { Component } from 'react';
import Shifts from './Shifts.js';
import PreFilter from './PreFilter';
import DefaultClient from 'apollo-boost';
import WorkOrdersForm from "../WorkOrders/WorkOrdersForm";
import withGlobalContent from 'Generic/Global';

const DEFAULT_EMPLOYEE = { value: 0, label: "Select an employee" };

class Schedules extends Component {

    INITIAL_STATE = {
        cityId: null,
        shiftId: null,
        selectedShiftId: 0,
        refresh: true,
        isSerie: false,
        isEditFilter: false,
        employees: [],
        selectedEmployee: { ...DEFAULT_EMPLOYEE }
    };

    constructor() {
        super();
        this.state = {
            ...this.INITIAL_STATE,
            closedForm: true,
            location: null,
            openPreFilter: true,
            requested: null,
            editConfirmOpened: false,
            filtered: false,
            templateShifts: [],
            previousWeekShifts: [],
            templateStartDate: '',
            templateEndDate: '',
            viewType: 1,
            filterFormDiabled: false,
            openWorkOrderForm: false
        }
    }

    saveTemplateShift = (templateShifts, startDate, endDate) => {
        var newTemplateShiftArray = [];
        var templateFound = [];
        templateShifts.map(templateShift => {
            delete templateShift.startDate;
            delete templateShift.endDate;
            templateShift.id = templateShift.ShiftId;
            if (templateFound.indexOf(templateShift.ShiftId) < 0) {
                templateFound.push(templateShift.ShiftId);
                delete templateShift.ShiftId;
                newTemplateShiftArray.push(templateShift.id);
            }
        });

        this.setState((prevState) => {
            return { templateShifts: newTemplateShiftArray, templateStartDate: startDate, templateEndDate: endDate }
        })
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleReset = (e) => {
        this.setState({
            ...this.INITIAL_STATE
        });
    }

    getSelectedValue = (item, type) => {
        this.setState({
            selectedShiftId: item.id,
            isSerie: type,
            editConfirmOpened: false,
            closedForm: false
        })
    }

    toggleRefresh = () => {
        this.setState((prevState) => { return { refresh: !prevState.refresh } })
    }

    handleCloseForm = (resetInputs = () => { }) => {
        this.setState({
            closedForm: true,
            selectedShiftId: 0,
        }, resetInputs);
    }

    handleClosePreFilter = (event) => {
        event.preventDefault();
        this.setState({
            openPreFilter: !this.state.openPreFilter,
            isEditFilter: true
        });
    }

    handleOpenForm = (event) => {
        event.preventDefault();
        this.setState({
            closedForm: false
        });
    }

    handleApplyFilters = (location, requested, department, position) => {
        this.setState((prevState) => {
            return { location, requested, openPreFilter: false, filtered: true, department, position }
        })
    }

    handleGetTextofFilters = (locationName, requestedName, departmentName, positionName) => {
        this.setState((prevState) => {
            return { locationName, requestedName, departmentName, positionName }
        })
    }

    handleOpenWorkOrderForm = () => {
        this.setState({
            openWorkOrderForm: !this.state.openWorkOrderForm,
            item: null
        });
    }

    openEditConfirm = () => {
        this.setState(() => {
            return { editConfirmOpened: !this.state.editConfirmOpened }
        });
    }

    changeViewType = (viewType) => {
        this.setState({
            viewType: viewType
        });
    }

    updateEmployeeList = (employees) => {
        var myEmployees = employees.slice();
        myEmployees.unshift({ ...DEFAULT_EMPLOYEE })
        this.setState({
            employees: myEmployees,
            selectedEmployee: { ...DEFAULT_EMPLOYEE }
        })
    }

    onSelectedEmployeeChange = (selectedEmployee) => {
        this.setState({ selectedEmployee });
    }
    render() {
        return (
            <div className="MasterShift">
                <PreFilter
                    openPreFilter={this.state.openPreFilter}
                    handleApplyFilters={this.handleApplyFilters}
                    openPreFilter={this.state.openPreFilter}
                    handleGetTextofFilters={this.handleGetTextofFilters}
                    templateShifts={this.templateShifts}
                    handleClosePreFilter={this.handleClosePreFilter}
                    isEditFilter={this.state.isEditFilter}
                    location={this.state.location}
                    position={this.state.position}
                    department={this.state.department}
                />
                <Filters
                    handleClosePreFilter={this.handleClosePreFilter}
                    handleOpenForm={this.handleOpenForm}
                    handleReset={this.handleReset}
                    handleChange={this.handleChange}
                    cityId={this.state.cityId}
                    shiftId={this.state.shiftId}
                    locationName={this.state.locationName}
                    requestedName={this.state.requestedName}
                    departmentName={this.state.departmentName}
                    positionName={this.state.positionName}
                    templateShifts={this.state.templateShifts}
                    templateStartDate={this.state.templateStartDate}
                    templateEndDate={this.state.templateEndDate}
                    requested={this.state.requested}
                    viewType={this.state.viewType}
                    location={this.state.location}
                    department={this.state.department}
                    position={this.state.position}
                    toggleRefresh={this.toggleRefresh}
                    employees={this.state.employees}
                    onSelectedEmployeeChange={this.onSelectedEmployeeChange}
                    handleOpenWorkOrderForm={this.handleOpenWorkOrderForm}
                />
                <FilterForm
                    updateEmployeeList={this.updateEmployeeList}
                    isSerie={this.state.isSerie}
                    location={this.state.location}
                    department={this.state.department}
                    position={this.state.position}
                    requestedBy={this.state.requested}
                    handleCloseForm={this.handleCloseForm}
                    closedForm={this.state.closedForm}
                    id={this.state.selectedShiftId}
                    toggleRefresh={this.toggleRefresh}
                    hotelManager={this.props.hotelManager}
                    locationName={this.state.locationName}
                    positionName={this.state.positionName}
                />
                <WorkOrdersForm
                    item={this.state.item}
                    handleOpenSnackbar={this.props.handleOpenSnackbar}
                    openModal={this.state.openWorkOrderForm}
                    handleCloseModal={this.handleCloseModal}
                    handleCloseModal={this.handleOpenWorkOrderForm}
                    toggleRefresh={this.toggleRefresh}
                />
                <div className="row">
                    <div className="col-md-12">
                        <div className="MasterShift-schedules">
                            <div className="MasterShift-schedulesBody" id="divToPrint">
                                {
                                    this.state.filtered == true ? (
                                        <Shifts
                                            editConfirmOpened={this.state.editConfirmOpened}
                                            openEditConfirm={this.openEditConfirm}
                                            refresh={this.state.refresh}
                                            getSelectedValue={this.getSelectedValue}
                                            cityId={this.state.cityId}
                                            shiftId={this.state.shiftId}
                                            entityId={this.state.location}
                                            saveTemplateShift={this.saveTemplateShift}
                                            previousWeekShifts={this.previousWeekShifts}
                                            changeViewType={this.changeViewType}
                                            location={this.state.location}
                                            department={this.state.department}
                                            position={this.state.position}
                                            selectedEmployee={this.state.selectedEmployee}
                                        />
                                    ) : ('')
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withGlobalContent(Schedules);