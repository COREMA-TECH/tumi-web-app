import React, { Component } from 'react';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from 'Generic/Global';
import moment from 'moment';

import { GET_INITIAL_DATA, GET_POSITION, GET_SHIFTS_QUERY, GET_SHIFTS_BY_DATE_EMPLOYEE_QUERY, GET_LIST_SHIFT_ID } from './Queries';
import { INSERT_SHIFT, CHANGE_STATUS_SHIFT, UPDATE_SHIFT_RECORD, UPDATE_SHIFT } from './Mutations';

import Select from 'react-select';
import { isArray } from 'util';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU"

class FilterForm extends Component {

    DEFAULT_STATE = {
        selectedEmployees: [],
        positions: [],
        color: '#5f4d8b',
        //  title: '',
        title: 'My Title',
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
        workOrderId: 0
    }

    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            locations: [],
            ...this.DEFAULT_STATE
        }
    }

    getEmployees = () => {
        this.props.client
            .query({
                query: GET_INITIAL_DATA,
            })
            .then(({ data }) => {
                //Save data into state
                //--Employees
                this.setState((prevState) => {
                    let employees = data.employees.map(item => {
                        return { value: item.id, label: `${item.firstName} ${item.lastName}` }
                    })
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
    getPosition = (position = 0) => {
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
                        title: this.state.title,
                        color: this.state.color,
                        status: this.state.status,
                        idPosition: this.props.position,
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
                        id: this.props.isSerie ? this.state.shiftId : 0,//Only serie edition can modify shift comment
                        comment: this.state.comment
                    },
                    shiftDetail: {
                        id: this.state.selectedDetailId,
                        startTime: this.state.startHour,
                        endTime: this.state.endHour,
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
                    status: shiftDetail.shift.status,
                    openShift: !shiftDetail.detailEmployee,//Is open shift when there is no employee associated to a Shift
                    workOrderId: shiftDetail.shift.workOrder ? shiftDetail.shift.workOrder.id : 0,
                    dayWeeks: shiftDetail.shift.dayWeek,
                    selectedEmployees: selectedEmployee ? selectedEmployee : [],
                    comment: shiftDetail.shift.comment
                }, () => this.getPosition(shiftDetail.shift.idPosition))

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

    renderLocationList = () => {
        return this.state.locations.map((item) => {
            return <option key={item.Id} value={item.Id}>{item.Code} | {item.Name}</option>
        })
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
        if (parseInt(this.props.position) == 0)
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

        return moment.utc(moment(endDate, "DD/MM/YYYY HH:mm:ss").diff(moment(startDate, "DD/MM/YYYY HH:mm:ss"))).format("HH:mm")
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

    handleTimeChange = (event) => {
        var element = event.target;
        this.setState({ [element.name]: element.value })
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
                    status: status,
                    color: color
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
            var position = this.state.positions.find(item => item.Id == this.props.position)
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

    componentWillMount() {
        this.getEmployees()
        this.getPosition(this.props.position);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id != nextProps.id && nextProps.id != 0)
            this.getInfoForSelectedShift(nextProps.id)
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

    showConfirmationButtons = () => {
        if (this.props.hotelManager)
            return <div className="row">
                <div className="col-md-12">
                    <button className="btn btn-success btn-large mb-1" type="button" onClick={() => { this.handleChangeStatusShifts(2, "#114bff") }}>Confirm {this.state.confirm && <i className="fa fa-spinner fa-spin" />}</button>
                    <button className="btn btn-danger btn-large mb-1 " type="button" onClick={() => { this.handleChangeStatusShifts(3, "#cccccc") }} >Reject {this.state.reject && <i className="fa fa-spinner fa-spin" />}</button>
                </div>
            </div>
        else
            return <div>
                <button type="button" className="btn btn-link text-danger">
                    <i className="fas fa-trash"></i>
                </button>
                <button className="btn btn-default" type="button" onClick={this.clearInputs} >Clear</button>
                <button className="btn btn-default" type="button" onClick={this.saveDraft} >Save Draft {(this.state.updating && !this.state.notify) && <i className="fa fa-spinner fa-spin" />}</button>
                <button className="btn btn-success" type="button" onClick={this.savePublish} >Publish {(this.state.updating && this.state.notify) && <i className="fa fa-spinner fa-spin" />}</button>
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

    render() {
        const isEdition = this.state.selectedDetailId != 0;
        const isHotelManger = this.props.hotelManager;
        return <div className={`MasterShiftForm ${this.props.closedForm ? '' : 'active'}`}>
            <div className="row">
                <div className="col-md-10">
                    <h3 className="MasterShiftForm-title">From Mon 11 to Sat 15</h3>
                </div>
                <div className="col-md-2">
                    <button className="btn btn-link MasterShiftForm-close" onClick={this.props.handleCloseForm}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>
            <form id="form" method="POST" onSubmit={this.onSubmit} >
                <div className="row">
                    {/* <div className="col-md-12">
                        <Options />
                    </div> */}
                    <div className="col-md-12">
                        <label htmlFor="">* Employees</label>
                        <Select
                            name="employees"
                            options={this.state.employees}
                            value={this.state.selectedEmployees}
                            onChange={this.handleChangeEmployee}
                            closeMenuOnSelect={false}
                            isDisabled={isHotelManger}
                            isMulti={!isEdition}
                        />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="">* Start Date</label>
                        <input type="date" name="startDate" disabled={isHotelManger || isEdition} className="form-control" value={this.state.startDate} onChange={this.handleInputValueChange} required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="">* End Date</label>
                        <input type="date" name="endDate" disabled={isHotelManger || isEdition} className="form-control" value={this.state.endDate} onChange={this.handleInputValueChange} required />
                    </div>
                    <div className="col-md-5">
                        < label htmlFor="">* Start Time</label>
                        <input type="time" name="startHour" disabled={isHotelManger} className="form-control" value={this.state.startHour} onChange={this.handleTimeChange} required></input>
                    </div>
                    <div className="col-md-5">
                        < label htmlFor="">* End Time</label>
                        <input type="time" name="endHour" disabled={isHotelManger} className="form-control" value={this.state.endHour} onChange={this.handleTimeChange} required></input>
                    </div>
                    <div className="col-md-2">
                        <span className="MasterShiftForm-hour" data-hour={this.calculateHours()}></span>
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">Repeat?</label>
                        <div className="btn-group" role="group" aria-label="Basic example">
                            <button disabled={isEdition} type="button" className={this.getWeekDayStyle(MONDAY)} onClick={() => this.selectWeekDay(MONDAY)}>{MONDAY}</button>
                            <button disabled={isEdition} type="button" className={this.getWeekDayStyle(TUESDAY)} onClick={() => this.selectWeekDay(TUESDAY)}>{TUESDAY}</button>
                            <button disabled={isEdition} type="button" className={this.getWeekDayStyle(WEDNESDAY)} onClick={() => this.selectWeekDay(WEDNESDAY)}>{WEDNESDAY}</button>
                            <button disabled={isEdition} type="button" className={this.getWeekDayStyle(THURSDAY)} onClick={() => this.selectWeekDay(THURSDAY)}>{THURSDAY}</button>
                            <button disabled={isEdition} type="button" className={this.getWeekDayStyle(FRIDAY)} onClick={() => this.selectWeekDay(FRIDAY)}>{FRIDAY}</button>
                            <button disabled={isEdition} type="button" className={this.getWeekDayStyle(SATURDAY)} onClick={() => this.selectWeekDay(SATURDAY)}>{SATURDAY}</button>
                            <button disabled={isEdition} type="button" className={this.getWeekDayStyle(SUNDAY)} onClick={() => this.selectWeekDay(SUNDAY)}>{SUNDAY}</button>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">Comment</label>
                        <textarea name="comment" className="form-control" id="" cols="30" rows="10" disabled={isHotelManger || (this.props.isSerie == false && this.state.selectedDetailId != 0)} value={this.state.comment} onChange={this.handleInputValueChange}></textarea>
                    </div>
                    {/* <div className="col-md-3">
                        <ShiftColorPicker onChange={this.handleColorChange} color={this.state.color} />
                    </div> */}
                </div>
                <div className="MasterShiftForm-groupButtons">
                    {this.showConfirmationButtons()}
                </div>
            </form>
        </div>
    }
}

export default withApollo(withGlobalContent(FilterForm));