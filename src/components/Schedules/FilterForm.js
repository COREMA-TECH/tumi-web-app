import React, { Component } from 'react';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from 'Generic/Global';
import moment from 'moment';

import { GET_INITIAL_DATA, GET_POSITION, GET_SHIFTS_QUERY } from './Queries';
import { INSERT_SHIFT, CHANGE_STATUS_SHIFT, UPDATE_SHIFT } from './Mutations';

import Select from 'react-select';
import TimeField from 'react-simple-timefield';
import Options from './Options';
import ShiftColorPicker from './ShiftColorPicker';

class FilterForm extends Component {

    DEFAULT_STATE = {
        selectedEmployees: [],
        location: 0,
        positions: [],
        position: 0,
        color: '#867979',
        title: '',
        startHour: '00:00',
        endHour: '00:00',
        startDate: '',
        endDate: '',
        selectedDetailId: 0,
        status: 1,
        openShift: false
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
                    'Error loading employees list',
                    'bottom',
                    'right'
                );
            });
    }
    getPosition = (position = 0) => {
        this.setState({ loadingPosition: true }, () => {
            this.props.client
                .query({
                    query: GET_POSITION,
                    variables: {
                        Id_Entity: this.state.location
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
                        'Error loading position list',
                        'bottom',
                        'right'
                    );
                });

        })

    }

    insertShift = () => {
        this.props.client
            .mutate({
                mutation: INSERT_SHIFT,
                variables: {
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    startHour: this.state.startHour,
                    endHour: this.state.endHour,
                    shift: {
                        entityId: this.state.location,
                        title: this.state.title,
                        color: this.state.color,
                        status: this.state.status,
                        idPosition: this.state.position
                    },
                    employees: this.state.selectedEmployees.map(item => { return item.value })
                }
            })
            .then((data) => {
                this.setState({ ...this.DEFAULT_STATE })
                this.props.handleOpenSnackbar('success', 'Shift created successfully!');
                this.props.toggleRefresh();
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error creating Shift');
            });
    };

    updateShift = () => {
        this.props.client
            .mutate({
                mutation: UPDATE_SHIFT,
                variables: {
                    shift: {
                        id: this.state.shiftId,
                        entityId: this.state.location,
                        title: this.state.title,
                        color: this.state.color,
                        status: this.state.status,
                        idPosition: this.state.position
                    },
                    shiftDetail: {
                        id: this.state.selectedDetailId,
                        startDate: this.state.startDate,
                        endDate: this.state.endDate,
                        startTime: this.state.startHour,
                        endTime: this.state.endHour,
                        ShiftId: this.state.shiftId
                    },
                    shiftDetailEmployee: {
                        ShiftDetailId: this.state.selectedDetailId,
                        EmployeeId: this.state.openShift ? this.state.selectedEmployees.value : 0
                    }
                }
            })
            .then((data) => {
                this.setState({ ...this.DEFAULT_STATE })
                this.props.handleOpenSnackbar('success', 'Shift updated successfully!');
                this.props.toggleRefresh();
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error updating Shift');
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

                this.setState({
                    startDate: shiftDetail.startDate.substring(0, 10),
                    endDate: shiftDetail.endDate.substring(0, 10),
                    startHour: shiftDetail.startTime,
                    endHour: shiftDetail.endTime,
                    location: shiftDetail.shift.entityId,
                    title: shiftDetail.shift.title,
                    color: shiftDetail.shift.color,
                    selectedDetailId: id,
                    shiftId: shiftDetail.shift.id,
                    status: shiftDetail.shift.status,
                    openShift: !shiftDetail.detailEmployee,
                    selectedEmployees: this.getSelectedEmployee(detailEmployee ? detailEmployee.EmployeeId : null)
                }, () => this.getPosition(shiftDetail.shift.idPosition))

            }).catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error loading selected shift information',
                    'bottom',
                    'right'
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
        if (!this.state.openShift) {
            if (this.state.selectedEmployees.length == 0)
                return { valid: false, message: 'You need to select at least one employee' };
        }
        else
            if (!this.state.selectedEmployees)
                return { valid: false, message: 'You need to select a employee' };

        if (this.state.endDate < this.state.startDate)
            return { valid: false, message: 'End Date can not be less than Start Date' };

        let startHour = this.state.startHour.replace(':', ''), endHour = this.state.endHour.replace(':', '');

        if (parseInt(endHour) < parseInt(startHour) && this.state.startDate == this.state.endDate)
            return { valid: false, message: 'End Time can not be less than Start Time' };

        if (parseInt(this.state.location) == 0)
            return { valid: false, message: 'You need to select a location' };
        if (parseInt(this.state.position) == 0)
            return { valid: false, message: 'You need to select a position' };
        if (!this.state.title.trim())
            return { valid: false, message: 'You need to set a title' };


        return { valid: true, message: 'Everything is ok' };
    }

    calculateHours = () => {
        let startDate = new Date(`01-01-2000 ${this.state.startHour}`)
        let endDate = new Date(`01-01-2000 ${this.state.endHour}`)

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

    handleTimeChange = (name) => (text) => {
        this.setState({ [name]: text })
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

            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error approved Shift');
            });
    };

    onSubmit = (event) => {
        event.preventDefault();

        let result = this.validateControls();
        let { valid, message } = result;

        if (valid) {
            if (this.state.selectedDetailId == 0)
                this.insertShift();
            else
                this.updateShift();

        } else this.props.handleOpenSnackbar('error', message, 'bottom', 'right');
    }

    clearInputs = (e) => {
        e.preventDefault();
        this.setState({ ...this.DEFAULT_STATE })
    }

    componentWillMount() {
        this.getEmployees()
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.id != nextProps.id && nextProps.id != 0)
            this.getInfoForSelectedShift(nextProps.id)
    }

    render() {
        const isEdition = this.state.selectedDetailId != 0;
        const isHotelManger = this.props.hotelManager;
        return <div className="MasterShiftForm">
            <form action="" onSubmit={this.onSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        <Options />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">* Employees</label>
                        <Select
                            name="employees"
                            options={this.state.employees}
                            value={this.state.selectedEmployees}
                            onChange={this.handleChangeEmployee}
                            closeMenuOnSelect={false}
                            isDisabled={isHotelManger || (isEdition && !this.state.openShift)}
                            isMulti={!isEdition}
                        />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">* Start Date</label>
                        <input type="date" name="startDate" disabled={isHotelManger} className="form-control" value={this.state.startDate} onChange={this.handleInputValueChange} required />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">* End Date</label>
                        <input type="date" name="endDate" disabled={isHotelManger} className="form-control" value={this.state.endDate} onChange={this.handleInputValueChange} required />
                    </div>
                    <div className="col-md-6">
                        < label htmlFor="">* Start Time</label>
                        <TimeField name="startHour" disabled={isHotelManger} style={{ width: '100%' }} className="form-control" value={this.state.startHour} onChange={this.handleTimeChange('startHour')} />
                    </div>
                    <div className="col-md-6">
                        < label htmlFor="">* End Time</label>
                        <TimeField name="endHour" disabled={isHotelManger} style={{ width: '100%' }} className="form-control" value={this.state.endHour} onChange={this.handleTimeChange('endHour')} />
                    </div>
                    <div className="col-md-12">
                        <span className="MasterShiftForm-hour" data-hour={this.calculateHours()}></span>
                    </div>
                    <div className="col-md-12">
                        < label htmlFor="">* Location</label>
                        <select
                            name="location"
                            id="location"
                            onChange={this.handleSelectValueChange}
                            value={this.state.location}
                            className="form-control"
                            disabled={isHotelManger || isEdition}
                            required
                        >
                            <option value={0}>Select a location</option>
                            {this.renderLocationList()}
                        </select>
                    </div>
                    <div className="col-md-12">
                        < label htmlFor="">* Position</label>
                        <select
                            name="position"
                            id="position"
                            onChange={this.handleSelectValueChange}
                            value={this.state.position}
                            className="form-control"
                            disabled={isHotelManger || this.state.loadingPosition || isEdition}
                            required
                        >
                            <option value={0}>Select a position</option>
                            {this.renderPositionList()}
                        </select>
                    </div>
                    <div className="col-md-9">
                        < label htmlFor="">* Title</label>
                        <input type="text" disabled={isHotelManger} className="form-control" name="title" value={this.state.title} onChange={this.handleInputValueChange} />
                    </div>
                    <div className="col-md-3">
                        <ShiftColorPicker onChange={this.handleColorChange} color={this.state.color} />
                    </div>
                </div  >
                {
                    this.props.hotelManager == true ? (
                        <div className="row">
                            <div className="col-md-12">
                                <button className="btn btn-success float-right mb-1 ml-1" type="button" onClick={() => { this.handleChangeStatusShifts(2, "#114bff") }}>Confirm</button>
                                <button className="btn btn-danger float-right mb-1 ml-1" type="button" onClick={() => { this.handleChangeStatusShifts(3, "#cccccc") }} >Rejected</button>
                            </div>
                        </div>
                    ) : (
                            <div className="row">
                                <div className="col-md-12">
                                    <button className="btn btn-success float-right mb-1 ml-1" type="submit">Publish</button>
                                    <button className="btn btn-danger float-right mb-1" type="button" onClick={this.clearInputs} >Clear</button>
                                </div>
                            </div>
                        )
                }
            </form>
        </div>
    }
}

export default withApollo(withGlobalContent(FilterForm));