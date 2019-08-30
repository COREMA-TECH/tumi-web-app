import React, { Component } from 'react';
import withGlobalContent from 'Generic/Global';
import DatePicker from "react-datepicker";
import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';
import moment from 'moment';
import withApollo from 'react-apollo/withApollo';
import filterTypes from './filterTypeData';
import statusList from './filterStatusData';
import { GET_EMPLOYEES_QUERY } from './queries';
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from 'prop-types';

const DEFAULT_FILTER_TYPE = { value: "W", label: "By week" };
const DEFAULT_DATA_RANGE_APP = { value: null, label: 'Report Date' };
const DEFAULT_SELECTED_EMPLOYEE = { value: 0, label: "All Employees" };

class ApprovePunchesReportFilter extends Component {

    state = {
        employees: []
    }

    DEFAULT_STATE = {
        endDateDisabled: true,
        openModal: false,
        employee: null,
        status: "W",
        startDate: null,
        endDate: null,
        typeDateFiltered: DEFAULT_FILTER_TYPE, // opcion seleccinada para filtro de fecha en indice
        dateRange: DEFAULT_DATA_RANGE_APP,
        selectAll: false
    }

    constructor(props) {
        super(props);
        var { employee, status, startDate, endDate } = props;
        this.state = { employee, status, startDate, endDate, approving: false, ...this.DEFAULT_STATE };
    }

    updateLoadingStatus = (status) => {
        if (this.props.updateLoadingStatus)
            this.props.updateLoadingStatus(status);
    }

    getEmployees = () => {
        this.updateLoadingStatus(true);
        this.props.client
            .query({
                query: GET_EMPLOYEES_QUERY
            })
            .then(({ data: { employees } }) => {
                this.setState(() => ({ employees: employees.map(_ => ({ value: _.id, label: `${_.firstName} ${_.lastName}` })) }),
                    () => {
                        if (employees.length > 0)
                            this.setState((prevState) => ({
                                employees: [DEFAULT_SELECTED_EMPLOYEE, ...prevState.employees]
                            }))
                        this.updateLoadingStatus(false);
                    });
            })
    }

    updateFilter = () => {
        if (this.props.updateFilter)
            this.props.updateFilter(this.state)
    }

    findSelectedEmployee = value => {
        const defValue = DEFAULT_SELECTED_EMPLOYEE;

        if (!value)
            return defValue;

        const found = this.state.employees.find(item => {
            return item.value === value;
        });

        return found ? { value: found.value, label: found.label } : defValue;
    }

    handleEmployeeFilterChange = ({ value }) => {
        this.setState(() => ({ employee: parseInt(value) }), this.updateFilter);
    }

    findSelectedStatus = value => {
        const found = statusList.find(item => {
            return item.value === value;
        });

        return { value: found.value, label: found.label };
    }

    handleStatusFilterChange = ({ value }) => {
        this.setState(() => ({ status: value }), this.updateFilter);
    }

    handleTypeDateFiltered = (option) => {
        this.setState(() => {
            return { typeDateFiltered: option }
        }, () => {
            this.setState(() => ({
                dateRange: DEFAULT_DATA_RANGE_APP,
                startDate: null,
                endDate: null
            }), this.updateFilter);
        });
    }

    handleDateRange = (dateRange) => {
        let dates = dateRange.value.split('||');
        this.setState(() => ({ dateRange, startDate: new Date(dates[0]), endDate: new Date(dates[1]) }), this.updateFilter)
    }

    handleStartDate = (value) => {
        this.setState(() => ({
            startDate: value,
            endDateDisabled: false
        }), this.updateFilter);
    }

    handleEndDate = (value) => {
        this.setState(() => ({
            endDate: value
        }), this.updateFilter);
    }

    getDateRange = _ => {
        let today = new Date(), weeks = 4, months = 6, startDate, endDate, data = [], endDateValue, startDateValue;
        let { typeDateFiltered } = this.state;

        today = moment.utc(today).subtract(6 - moment.utc(today).day(), "days")._d;

        if (typeDateFiltered.value == "W") {
            while (weeks > 0) {
                endDate = moment.utc(today).format("MM/DD/YYYY"); //get Start Date
                today = moment.utc(today).subtract(1, "weeks").add('days', 1)._d;//Substract a week
                startDate = moment.utc(today).format("MM/DD/YYYY");//get End Date
                today = moment.utc(today).subtract(1, "days")._d;//Substract a day to start new week
                data.push({ value: `${startDate}||${endDate}`, label: `${startDate} - ${endDate}` })
                weeks--;
            }
        }

        if (typeDateFiltered.value == "M") {
            while (months > 0) {
                endDate = moment.utc(today).format("MM/YYYY"); //get Start Date
                endDateValue = moment.utc(today).endOf("month").format("MM/DD/YYYY");
                startDateValue = moment.utc(today).startOf("month").format("MM/DD/YYYY");
                today = moment.utc(today).subtract(1, "months")._d;//Substract a month

                data.push({ value: `${startDateValue}||${endDateValue}`, label: `${endDate}` })
                months--;
            }
        }
        return data;
    }

    clearInputs = () => {
        this.setState(() => ({ ...this.DEFAULT_STATE }), this.updateFilter);
    }

    componentDidMount() {
        this.getEmployees();
    }

    makeSelection = (e) => {
        let value = e.target.checked;
        this.setState(() => ({ selectAll: value }));
        this.props.makeSelection(value);
    }

    hasSelected = () => {
        let algo = this.props.data.filter(_ => _.selected).length > 0;
        return algo;
    }

    approveMarks = () => {
        let { data } = this.props;
        let rowsId = [];
        let idsToApprove = [];

        //Get selected rows
        let selectedList = data.filter(_ => _.selected);
        //Get rowsId and idsToApprove
        selectedList.map(_ => {
            rowsId.push(_.id);
            idsToApprove = idsToApprove.concat(_.detailUnapproved.map(_ => _.id));
        })
        //Approve Marks (Approving= "A": Approving , "F": Approved, "E": Error)
        this.props.approveMarks(rowsId, idsToApprove, (approvationStatus) => {
            if (approvationStatus === "F")
                this.setState(() => ({ selectAll: false }));
            this.setState(() => ({ approving: approvationStatus === "A" }));
        })
    }

    render() {
        let { typeDateFiltered, startDate, endDate, dateRange, employee, employees, status, endDateDisabled, selectAll, approving } = this.state;
        return <div className="card mb-1">
            <div className="card-header bg-light">
                <div className="row">
                    <div className="col-md-2 col-xl-2 mb-3">
                        <Select
                            options={employees}
                            value={this.findSelectedEmployee(employee)}
                            onChange={this.handleEmployeeFilterChange}
                            closeMenuOnSelect={true}
                            components={makeAnimated()}
                            isMulti={false}
                            className='tumi-fullWidth'
                        />
                    </div>
                    <div className="col-md-2 col-xl-2 mb-3">
                        <Select
                            options={statusList}
                            value={this.findSelectedStatus(status)}
                            onChange={this.handleStatusFilterChange}
                            closeMenuOnSelect={true}
                            components={makeAnimated()}
                            isMulti={false}
                            className='tumi-fullWidth'
                        />
                    </div>
                    <div className="col-md-2 col-xl-2 mb-3">
                        <Select
                            name="typeDateFiltered"
                            options={filterTypes}
                            value={typeDateFiltered}
                            onChange={this.handleTypeDateFiltered}
                            components={makeAnimated()}
                            closeMenuOnSelect
                        />
                    </div>
                    {typeDateFiltered.value != "C" ?
                        <div className="col-md-2 col-xl-2 mb-3">
                            <Select
                                name="dateRange"
                                options={this.getDateRange()}
                                value={dateRange}
                                onChange={this.handleDateRange}
                                components={makeAnimated()}
                                closeMenuOnSelect
                            />
                        </div>
                        :
                        <React.Fragment>
                            <div className="col-md-2 col-xl-2 mb-3">
                                <div class="input-group">
                                    <DatePicker
                                        selected={startDate}
                                        onChange={this.handleStartDate}
                                        placeholderText="Start date"
                                        id="startDate"
                                    />
                                    <div class="input-group-append">
                                        <label class="input-group-text" id="addon-wrapping" for="startDate">
                                            <i class="far fa-calendar"></i>
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-2 col-xl-2 mb-3">
                                <div class="input-group">
                                    <DatePicker
                                        selected={endDate}
                                        onChange={this.handleEndDate}
                                        disabled={endDateDisabled}
                                        placeholderText="End date"
                                        id="endDate"
                                    />
                                    <div class="input-group-append">
                                        <label class="input-group-text" id="addon-wrapping" for="endDate">
                                            <i class="far fa-calendar"></i>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </React.Fragment>
                    }
                    <div className="col-md-2 col-xl-2 mb-3">
                        <button class="btn btn-outline-secondary btn-not-rounded clear-btn" type="button" onClick={this.clearInputs}>
                            <i class="fas fa-filter"></i> Clear
                 </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <input type="checkbox" checked={selectAll} id="selectAllUnapproved" onChange={this.makeSelection} />
                        <label htmlFor="selectAllUnapproved" className="ml-2" onChange={this.makeSelection}> Select all unapproved</label>
                        <button className={`btn ${this.hasSelected() ? 'btn-primary' : 'btn-secondary'} btn-sm ml-4`} disabled={!this.hasSelected()} onClick={this.approveMarks}>
                            Approve Selected {approving ? < i class="fas fa-spinner fa-spin ml-1" /> : <React.Fragment />}
                        </button>
                    </div>
                </div>
            </div >
        </div>

    }
}

ApprovePunchesReportFilter.propTypes = {
    makeSelection: PropTypes.func.isRequired,
    approveMarks: PropTypes.func.isRequired
}

export default withApollo(withGlobalContent(ApprovePunchesReportFilter));