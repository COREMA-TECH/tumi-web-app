import React, { Component } from 'react';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from 'Generic/Global';
import moment from 'moment';

import { GET_INITIAL_DATA, GET_POSITION, GET_SHIFTS_QUERY, GET_SHIFTS_BY_DATE_EMPLOYEE_QUERY, GET_LIST_SHIFT_ID } from './Queries';
import { INSERT_SHIFT, CHANGE_STATUS_SHIFT, UPDATE_SHIFT_RECORD, UPDATE_SHIFT, DELETE_SHIFT } from './Mutations';

import Select from 'react-select';
import { isArray } from 'util';

import Datetime from 'react-datetime';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU"
const COLOR_ASSIGNED = '#5f4d8b'


class FilterForm extends Component {

    DEFAULT_STATE = {
        selectedEmployees: [],
        color: COLOR_ASSIGNED,
        title: '',
        startHour: '',
        endHour: '',
        startDate: '',
        endDate: '',
        selectedDetailId: 0,
        status: 1,
        notify: false,
        openShift: false,
        updating: false,
        confirm: false,
        reject: false,
        needExperience: false,
        needEnglish: false,
        comment: '',
        specialComment: '',
        userId: 1,
        requestedBy: 1,
        dayWeeks: "",
        workOrderId: 0,
        position: "",
        summaryEnable: true
    }

    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            locations: [],
            positions: [],
            ...this.DEFAULT_STATE
        }
    }

    getEmployees = (idEntity) => {
        this.props.client
            .query({
                query: GET_INITIAL_DATA,
                fetchPolicy: 'no-cache',
                variables: {
                    idEntity: idEntity
                }
            })
            .then(({ data }) => {
                //Save data into state
                //--Employees
                this.setState((prevState) => {
                    let employees = data.employees.map(item => {
                        return { value: item.id, label: `${item.firstName} ${item.lastName}` }
                    })
                    this.props.updateEmployeeList(employees);
                    return { employees }
                });
                //Location
                this.setState((prevState) => {
                    return { locations: data.getbusinesscompanies }
                })

            }).catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error loading employees list'
                );
            });
    }

    getShiftByDateAndEmployee = (executeMutation = () => { },
        shiftDetailId = []//list of shift detail id to be excluded from the validation
    ) => {

        //This evaluate if Employee control has selected one or many employees
        //If only one employee can be selected then the value is got from object.value 
        //other way it is selected from an array of selected values
        let isOneEmployee = this.state.selectedDetailId != 0 || this.state.openShift;
        let selectedValues;

        //Selecte employees
        if (!isOneEmployee) {
            selectedValues = this.state.selectedEmployees.map(item => { return item.value })
            if (selectedValues.length == 0)
                selectedValues = 0;

        }
        //Verify if it is one employee or many 
        let idEmployee = (isOneEmployee ? this.state.selectedEmployees.value : selectedValues);
        this.props.client
            .query({
                query: GET_SHIFTS_BY_DATE_EMPLOYEE_QUERY,
                variables: {
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    employeeId: idEmployee == null ? 0 : idEmployee,
                    startTime: this.state.startHour,
                    endTime: this.state.endHour,
                    shiftDetailId: shiftDetailId,
                    daysWeek: this.state.dayWeeks
                }
            })
            .then(({ data }) => {
                if (data.ShiftDetailByDate.length == 0) {
                    executeMutation();
                } else {
                    this.setState({ updating: false }, () => {
                        this.props.handleOpenSnackbar(
                            'warning',
                            'This shift is not available'
                        );
                    })
                }
            }).catch(error => {
                this.setState({ updating: false }, () => {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error evaluting schedule'
                    );
                })
            });
    }
    getPosition = (position = "") => {
        this.setState({ loadingPosition: true }, () => {
            this.props.client
                .query({
                    query: GET_POSITION,
                    variables: {
                        Id_Entity: this.props.location
                    }
                })
                .then(({ data }) => {
                    //Save Positions into state
                    this.setState((prevState) => {
                        return { positions: data.getposition, position, loadingPosition: false }
                    })

                }).catch(error => {
                    this.setState({ loadingPosition: false })
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error loading position list'
                    );
                });

        })

    }

    insertShift = () => {
        this.props.client
            .mutate({
                mutation: INSERT_SHIFT,
                variables: {
                    startHour: this.state.startHour,
                    endHour: this.state.endHour,
                    shift: {
                        entityId: this.props.location,
                        departmentId: this.props.department,
                        title: this.state.title,
                        color: this.state.color,
                        status: this.state.status,
                        idPosition: this.state.position,
                        startDate: this.state.startDate,
                        endDate: this.state.endDate,
                        dayWeek: this.state.dayWeeks,
                        comment: this.state.comment
                    },
                    employees: this.state.selectedEmployees.map(item => { return item.value }),
                    special: {
                        needExperience: this.state.needExperience,
                        needEnglish: this.state.needEnglish,
                        comment: this.state.comment,
                        specialComment: this.state.specialComment,
                        notify: this.state.notify,
                        userId: this.state.userId,
                        requestedBy: this.state.requestedBy
                    }
                }
            })
            .then((data) => {
                this.setState({ ...this.DEFAULT_STATE })
                this.props.handleOpenSnackbar('success', 'Shift created successfully!');
                this.props.toggleRefresh();
            })
            .catch((error) => {
                this.setState({ updating: false }, () => {
                    this.props.handleOpenSnackbar('error', 'Error creating Shift');
                })
            });
    };

    updateShift = () => {

        this.props.client
            .mutate({
                mutation: UPDATE_SHIFT,
                variables: {
                    shift: {
                        id: this.props.isSerie ? this.state.shiftId : 0,//Only serie edition can modify shift
                        comment: this.state.comment,
                        color: COLOR_ASSIGNED
                    },
                    shiftDetail: {
                        id: this.state.selectedDetailId,
                        startTime: this.state.startHour,
                        endTime: this.state.endHour,
                        ShiftId: this.props.isSerie ? this.state.shiftId : 0,
                        color: COLOR_ASSIGNED,
                        status: 1
                    },
                    shiftDetailEmployee: {
                        ShiftDetailId: this.state.selectedDetailId,
                        EmployeeId: this.state.selectedEmployees.value
                    },
                    openShift: this.state.openShift,
                    workorderId: this.state.workOrderId,
                    comment: this.state.comment
                }
            })
            .then((data) => {
                this.setState({ ...this.DEFAULT_STATE })
                this.props.handleOpenSnackbar('success', 'Shift updated successfully!');
                this.props.toggleRefresh();
            })
            .catch((error) => {
                this.setState({ updating: false }, () => {
                    this.props.handleOpenSnackbar('error', 'Error updating Shift');
                });
            });
    };

    getInfoForSelectedShift = (id) => {
        this.props.client
            .query({
                query: GET_SHIFTS_QUERY,
                fetchPolicy: 'no-cache',
                variables: {
                    id
                }
            })
            .then(({ data }) => {
                const shiftDetail = data.ShiftDetail[0];
                const detailEmployee = shiftDetail.detailEmployee;
                const selectedEmployee = this.getSelectedEmployee(detailEmployee ? detailEmployee.EmployeeId : null)
                this.setState({
                    startDate: this.props.isSerie ? shiftDetail.shift.startDate.substring(0, 10) : shiftDetail.startDate.substring(0, 10),
                    endDate: this.props.isSerie ? shiftDetail.shift.endDate.substring(0, 10) : shiftDetail.endDate.substring(0, 10),
                    startHour: shiftDetail.startTime,
                    endHour: shiftDetail.endTime,
                    location: shiftDetail.shift.entityId,
                    title: shiftDetail.shift.title,
                    color: shiftDetail.shift.color,
                    selectedDetailId: id,
                    shiftId: shiftDetail.shift.id,
                    status: shiftDetail.status,
                    openShift: !shiftDetail.detailEmployee,//Is open shift when there is no employee associated to a Shift
                    workOrderId: shiftDetail.shift.workOrder ? shiftDetail.shift.workOrder.id : 0,
                    dayWeeks: shiftDetail.shift.dayWeek,
                    selectedEmployees: selectedEmployee ? selectedEmployee : [],
                    comment: shiftDetail.shift.comment,
                    position: shiftDetail.shift.idPosition,
                }, () => {
                    this.getPosition(this.state.position);
                    this.setState({
                        duration: this.calculateHours()
                    });
                })

            }).catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error loading selected shift information'
                );
            });
    }

    getSelectedEmployee = (id) => {
        return this.state.employees.find(item => item.value == id)
    }

    renderPositionList = () => {
        return this.state.positions.map((item) => {
            return <option key={item.Id} value={item.Id}>{item.Position}</option>
        })
    }

    validateControls = () => {
        //This is not an Open Shift
        if (isArray(this.state.selectedEmployees)) {
            if (this.state.selectedEmployees.length == 0)
                return { valid: false, message: 'You need to select at least one employee' };
        }
        else
            if (!this.state.selectedEmployees)
                return { valid: false, message: 'You need to select a employee' };

        if (this.state.endDate < this.state.startDate)
            return { valid: false, message: 'End Date can not be less than Start Date' };

        let startHour = this.state.startHour.replace(':', ''), endHour = this.state.endHour.replace(':', '');

        if (parseInt(endHour) < parseInt(startHour))
            return { valid: false, message: 'End Time can not be less than Start Time' };

        if (parseInt(this.props.location) == 0)
            return { valid: false, message: 'You need to select a location' };
        if (parseInt(this.state.position) == 0)
            return { valid: false, message: 'You need to select a position' };
        if (!this.state.title.trim())
            return { valid: false, message: 'You need to set a title' };
        var { dayWeeks } = this.state;
        if (!(dayWeeks.includes(MONDAY) || dayWeeks.includes(TUESDAY) || dayWeeks.includes(WEDNESDAY)
            || dayWeeks.includes(THURSDAY) || dayWeeks.includes(FRIDAY) || dayWeeks.includes(SATURDAY)
            || dayWeeks.includes(SUNDAY)))
            return { valid: false, message: 'You need to select a week day' };

        return { valid: true, message: 'Everything is ok' };
    }

    calculateHours = () => {
        let startDate = new Date(`01/01/2000 ${this.state.startHour}`)
        let endDate = new Date(`01/01/2000 ${this.state.endHour}`)

        return moment.duration(
            moment.utc(moment(endDate, "DD/MM/YYYY HH:mm:ss").diff(moment(startDate, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm")
        ).asHours()
    }

    handleChangeEmployee = (selectedEmployees) => {
        this.setState({ selectedEmployees });
    }

    handleSelectValueChange = (event) => {
        var index = event.nativeEvent.target.selectedIndex;
        var text = event.nativeEvent.target[index].text;

        const element = event.target;
        this.setState({
            [element.name]: element.value,
            [`${element.name}Text`]: text
        }, () => {
            if (element.name == 'location')
                this.getPosition();
            else if (element.name == "position")
                this.setState({ title: this.state.positionText })
        })
    }

    handleInputValueChange = (event) => {
        const element = event.target;
        this.setState({
            [element.name]: element.value,
        })
    }

    handleTimeChangeStart = (event) => {
        var element = event.target;
        let date = moment(event._d, "h:mm:ss").format("HH:mm")

        const startHour = date;
        const endHour = this.state.endHour;

        var duration = moment.duration(moment.utc(moment(endHour, "HH:mm:ss").diff(moment(startHour, "HH:mm:ss"))).format("HH:mm")).asHours();
        duration = parseFloat(duration).toFixed(2);

        this.setState({
            startHour: date,
            duration: duration
        })
    }

    handleTimeChangeEnd = (event) => {
        var element = event.target;
        let date = moment(event._d, "h:mm:ss").format("HH:mm")
        this.setState({ endHour: date })
    }

    handleColorChange = (color) => {
        this.setState({ color: color.hex })
    };

    handleChangeStatusShifts = (status, color) => {
        this.props.client
            .mutate({
                mutation: CHANGE_STATUS_SHIFT,
                variables: {
                    id: this.state.shiftId,
                }
            })
            .then((data) => {
                if (status == 2) { this.props.handleOpenSnackbar('success', 'Shift approved successfully!'); }
                else { this.props.handleOpenSnackbar('success', 'Shift rejected successfully!'); }
                this.setState({ ...this.DEFAULT_STATE }, this.props.toggleRefresh)
            })
            .catch((error) => {
                this.setState({ confirm: false, reject: false }, () => {
                    this.props.handleOpenSnackbar('error', 'Error approved Shift');
                })
            });
    };

    onSubmit = (event) => {

        event.preventDefault();

        let result = this.validateControls();
        let { valid, message } = result;

        if (valid) {
            let mutation;
            var position = this.state.positions.find(item => item.Id == this.state.position)
            if (position)
                this.setState({ specialComment: position.Comment ? position.Comment : '', updating: true }, () => {
                    if (this.state.selectedDetailId == 0)
                        mutation = this.insertShift;
                    else
                        mutation = this.updateShift;
                    if (this.props.isSerie)
                        this.getAssociatedShiftDetailList((shiftDetailId) => this.getShiftByDateAndEmployee(mutation, shiftDetailId))
                    else
                        this.getShiftByDateAndEmployee(mutation, this.state.selectedDetailId);
                })
            else
                this.props.handleOpenSnackbar('warning', "You need to select a position", 'bottom', 'right');

        } else this.setState({ updating: false }, () => {
            this.props.handleOpenSnackbar('warning', message, 'bottom', 'right');
        })
    }

    getAssociatedShiftDetailList = (execMutation = () => { }) => {
        this.props.client
            .query({
                query: GET_LIST_SHIFT_ID,
                variables: {
                    ShiftId: this.state.shiftId
                }
            })
            .then(({ data }) => {
                var shiftDetailId = data.ShiftDetail.map(item => { return item.id })
                execMutation(shiftDetailId)

            }).catch(error => {
                this.setState({ updating: false })
                this.props.handleOpenSnackbar(
                    'error',
                    'Error getting serie'
                );
            });
    }

    clearInputs = (e) => {
        e.preventDefault();
        this.setState({ ...this.DEFAULT_STATE })
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id != nextProps.id && nextProps.id != 0)
            this.getInfoForSelectedShift(nextProps.id)
        if (this.props.location != nextProps.location) {
            this.getEmployees(nextProps.location);
            this.getPosition();
        }
    }

    getWeekDayStyle = (dayName) => {
        return `btn btn-secondary ${this.state.dayWeeks.includes(dayName) ? 'btn-success' : ''}`;
    }

    selectWeekDay = (dayName) => {
        if (this.state.dayWeeks.includes(dayName))
            this.setState((prevState) => {
                return { dayWeeks: prevState.dayWeeks.replace(dayName, '') }
            })
        else
            this.setState((prevState) => {
                return { dayWeeks: prevState.dayWeeks.concat(dayName) }
            })
    }

    handleDisable = (id) => {
        this.props.client
            .mutate({
                mutation: DELETE_SHIFT,
                variables: {
                    id: this.state.shiftId,
                }
            })
            .then((data) => {
                this.props.toggleRefresh();
                this.props.handleOpenSnackbar(
                    'success',
                    'Shift disabled'
                );
                this.props.handleCloseForm();
            })
            .catch((error) => {
                this.setState({
                    updating: false
                }, () => {

                    this.props.handleOpenSnackbar(
                        'error',
                        'Shift can not be disabled'
                    );
                });
            });
    }

    showLoadingDraft = () => {
        if (this.state.updating && !this.state.notify) return <i className="fa fa-spinner fa-spin" />
    }

    showLoadingNotify = () => {
        if (this.state.updating && this.state.notify) return <i className="fa fa-spinner fa-spin" />
    }

    showConfirmationButtons = (allowEdit) => {
        if (!allowEdit)
            return '';
        if (this.props.hotelManager)
            return <div className="row">
                <div className="col-md-12">
                    <button className="btn btn-success btn-large mb-1" type="button" onClick={() => { this.handleChangeStatusShifts(2, "#114bff") }}>Confirm {this.state.confirm && <i className="fa fa-spinner fa-spin" />}</button>
                    <button className="btn btn-danger btn-large mb-1 " type="button" onClick={() => { this.handleChangeStatusShifts(3, "#cccccc") }} >Reject {this.state.reject && <i className="fa fa-spinner fa-spin" />}</button>
                </div>
            </div>
        else
            return <div>
                <button type="button" className="btn btn-link text-danger" onClick={this.handleDisable}>
                    <i className="fas fa-trash"></i>
                </button>
                <button className="btn btn-default" type="button" onClick={this.clearInputs} >Clear</button>
                <button className="btn btn-default" type="button" onClick={this.saveDraft} >Save Draft {this.showLoadingDraft()}</button>
                <button ref={input => this.publish = input} className="btn btn-success" style={{ visibility: 'hidden', widht: 0 }} type="submit">None</button>
            </div >
    }

    saveDraft = (e) => {
        e.preventDefault();
        this.setState({ notify: 0 },
            () => {
                this.publish.click();
            }
        );
    }

    savePublish = (e) => {
        e.preventDefault();
        this.setState({ notify: 1 },
            () => {
                this.publish.click();
            }
        );
    }

    resetInputs = () => {
        this.setState({ ...this.DEFAULT_STATE })
    }

    renderSummary = () => {
        var position = this.state.positions.length > 0 ? this.state.positions.find(item => item.Id == this.state.position) : ''
        return <div className="MasteShiftSummary">

            <div className="MasterShiftSummary-wrapper">
                <div className="MasterShiftSummary-item">
                    <div className="MasterShiftSummary-icon">
                        <i className="fas fa-building"></i>
                    </div>
                    <div className="MasterShiftSummary-position">
                        {position ? position.Position : ''}
                    </div>
                </div>
                <div className="MasterShiftSummary-item">
                    <div className="MasterShiftSummary-icon">
                        <i className="far fa-clock"></i>
                    </div>
                    <div className="MasterShiftSummary-position">
                        <span className="MasterShiftSummary-line">{moment(this.state.startDate).format('ddd D YYYY')}</span>
                        <span className="MasterShiftSummary-line">
                            {this.state.startHour} - {this.state.endHour} ({this.calculateHours()})
                        </span>
                    </div>
                </div>
                <div className="MasterShiftSummary-item">
                    <div className="MasterShiftSummary-icon">
                        <i className="fas fa-user-friends"></i>
                    </div>
                    <div className="MasterShiftSummary-position">
                        1 Employees
            </div>
                </div>
                <div className="MasterShiftSummary-item">
                    <div className="MasterShiftSummary-icon">
                        <i className="fas fa-map-marker-alt"></i>
                    </div>
                    <div className="MasterShiftSummary-position">
                        {this.props.locationName}
                    </div>
                </div>
            </div>
        </div>
    }

    handleSummaryState = () => {
        this.setState(prevState => {
            return { summaryEnable: !this.state.summaryEnable }
        });
    }

    handleCalculatedByDuration = (event) => {
        const target = event.target;
        const value = target.value;

        const startHour = this.state.startHour;

        var endHour = moment(new Date("01/01/1990 " + startHour), "HH:mm:ss").add(parseFloat(value), 'hours').format('HH:mm');
        var _moment = moment(new Date("01/01/1990 " + startHour), "HH:mm:ss").add(8, 'hours').format('HH:mm');

        var _endHour = (value == 0) ? _moment : endHour;

        this.setState({
            endHour: _endHour,
            duration: value
        });
    }

    render() {
        const isEdition = this.state.selectedDetailId != 0;
        const allowEdit = this.state.status < 2;

        const isHotelManger = this.props.hotelManager;
        return (
            <div>
                <div className={`MasterShiftForm ${this.props.closedForm ? '' : 'active'}`}>
                    <header className="MasterShiftForm-header">
                        <div className="row">
                            <div className="col-md-10">
                                <h3 className="MasterShiftForm-title">From {moment(this.state.startDate).format('ddd D')} to {moment(this.state.endDate).format('ddd D')}</h3>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-link MasterShiftForm-close"
                                    onClick={() => this.props.handleCloseForm(this.resetInputs)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </header>

                    {
                        this.state.summaryEnable ?
                            this.renderSummary() :
                            (
                                <form id="form" method="POST" onSubmit={this.onSubmit} >
                                    <div className="row">
                                        <div className="col-md-12">
                                            <label htmlFor="">* Employees</label>
                                            <Select
                                                name="employees"
                                                options={this.state.employees}
                                                value={this.state.selectedEmployees}
                                                onChange={this.handleChangeEmployee}
                                                closeMenuOnSelect={false}
                                                isDisabled={isHotelManger || !allowEdit}
                                                isMulti={!isEdition}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="">* Position</label>
                                            <select name="position" id="" className="form-control" onChange={this.handleInputValueChange} value={this.state.position} disabled={true}>
                                                {this.renderPositionList()}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">* Start Date</label>
                                            <input type="date" name="startDate" disabled={isHotelManger || isEdition || !allowEdit} className="form-control" value={this.state.startDate} onChange={this.handleInputValueChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">* End Date</label>
                                            <input type="date" name="endDate" disabled={isHotelManger || isEdition || !allowEdit} className="form-control" value={this.state.endDate} onChange={this.handleInputValueChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            < label htmlFor="">* Start Time</label>
                                            {/* <input type="time" name="startHour" disabled={isHotelManger || !allowEdit} className="form-control" value={this.state.startHour} onChange={this.handleTimeChange} required></input> */}
                                            <Datetime dateFormat={false} value={moment(this.state.startHour, "h:mm:ss A").format("hh:mm A")} inputProps={{ disabled: isHotelManger || !allowEdit, name: "startHour", required: true }} onChange={this.handleTimeChangeStart} />
                                            < label htmlFor="">* End Time</label>
                                            {/* <input type="time" name="endHour" disabled={isHotelManger || !allowEdit} className="form-control" value={this.state.endHour} onChange={this.handleTimeChange} required></input> */}
                                            <Datetime dateFormat={false} value={moment(this.state.endHour, "h:mm:ss A").format("hh:mm A")} inputProps={{ disabled: isHotelManger || !allowEdit, name: "endHour", disabled: true }} />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">Duration</label>
                                            <input type="text" className="MasterShiftForm-hour" name="duration" value={this.state.duration} onChange={this.handleCalculatedByDuration} />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="">Repeat?</label>
                                            <div className="btn-group" role="group" aria-label="Basic example">
                                                <button disabled={isEdition || !allowEdit} type="button" className={this.getWeekDayStyle(MONDAY)} onClick={() => this.selectWeekDay(MONDAY)}>{MONDAY}</button>
                                                <button disabled={isEdition || !allowEdit} type="button" className={this.getWeekDayStyle(TUESDAY)} onClick={() => this.selectWeekDay(TUESDAY)}>{TUESDAY}</button>
                                                <button disabled={isEdition || !allowEdit} type="button" className={this.getWeekDayStyle(WEDNESDAY)} onClick={() => this.selectWeekDay(WEDNESDAY)}>{WEDNESDAY}</button>
                                                <button disabled={isEdition || !allowEdit} type="button" className={this.getWeekDayStyle(THURSDAY)} onClick={() => this.selectWeekDay(THURSDAY)}>{THURSDAY}</button>
                                                <button disabled={isEdition || !allowEdit} type="button" className={this.getWeekDayStyle(FRIDAY)} onClick={() => this.selectWeekDay(FRIDAY)}>{FRIDAY}</button>
                                                <button disabled={isEdition || !allowEdit} type="button" className={this.getWeekDayStyle(SATURDAY)} onClick={() => this.selectWeekDay(SATURDAY)}>{SATURDAY}</button>
                                                <button disabled={isEdition || !allowEdit} type="button" className={this.getWeekDayStyle(SUNDAY)} onClick={() => this.selectWeekDay(SUNDAY)}>{SUNDAY}</button>
                                            </div>
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="">Comment</label>
                                            <textarea name="comment" className="form-control" id="" cols="30" rows="10" disabled={(isHotelManger || (this.props.isSerie == false && this.state.selectedDetailId != 0) || !allowEdit)} value={this.state.comment} onChange={this.handleInputValueChange}></textarea>
                                        </div>
                                        {/* <div className="col-md-3">
                                <ShiftColorPicker onChange={this.handleColorChange} color={this.state.color} />
                            </div> */}
                                    </div>
                                    <div className="MasterShiftForm-groupButtons">
                                        {this.showConfirmationButtons(allowEdit)}
                                    </div>
                                </form>

                            )

                    }
                    <footer className="MasterShiftForm-footer">
                        <div className="row">
                            {!this.props.hotelManager && <div className="col-xs-6 col-md-6">
                                {
                                    !this.state.summaryEnable ? (
                                        <button className="btn btn-success float-left btn-not-rounded" type="button" onClick={this.savePublish}>Notify {this.showLoadingNotify()}</button>
                                    ) : (
                                        ''
                                    )
                                }

                            </div>}
                            {
                                this.state.summaryEnable ? (
                                    <div className="col-xs-6 col-md-6">
                                        <button type="button" className="btn btn-default float-right btn-not-rounded" onClick={this.handleSummaryState}>Edit</button>
                                    </div>
                                ) :
                                    (
                                        <div className="col-xs-6 col-md-6">
                                            <button type="button" className="btn btn-default float-right btn-not-rounded" onClick={this.handleSummaryState}>Cancel</button>
                                        </div>
                                    )
                            }
                        </div>
                    </footer>
                </div>

                <div className="MasterShiftForm-overlay" onClick={() => this.props.handleCloseForm(this.resetInputs)}></div>
            </div>
        )
    }
}

export default withApollo(withGlobalContent(FilterForm));