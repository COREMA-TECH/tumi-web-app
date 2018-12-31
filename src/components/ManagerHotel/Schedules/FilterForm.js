import React, { Component } from 'react';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from '../../Generic/Global';
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
        ShiftId: 0
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

    /* insertShift = () => {
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
                         status: 1,
                         idPosition: this.state.position
                     },
                     employees: this.state.selectedEmployees.map(item => { return item.value })
                 }
             })
             .then((data) => {
                 this.setState({ ...this.DEFAULT_STATE })
                 this.props.handleOpenSnackbar('success', 'Shift created successfully!');
             })
             .catch((error) => {
                 this.props.handleOpenSnackbar('error', 'Error creating Shift');
             });
     };*/

    getInfoForSelectedShift = (id) => {
        this.props.client
            .query({
                query: GET_SHIFTS_QUERY,
                variables: {
                    id
                }
            })
            .then(({ data }) => {
                console.log("este es el data del shigt ", data.ShiftDetail[0])
                const shiftDetail = data.ShiftDetail[0];
                this.setState({
                    startDate: shiftDetail.startDate.substring(0, 10),
                    endDate: shiftDetail.endDate.substring(0, 10),
                    startHour: shiftDetail.startTime,
                    endHour: shiftDetail.endTime,
                    location: shiftDetail.shift.entityId,
                    title: shiftDetail.shift.title,
                    color: shiftDetail.shift.color,
                    selectedDetailId: id,
                    ShiftId: shiftDetail.ShiftId,
                    selectedEmployees: shiftDetail.detailEmployee != null ? this.getSelectedEmployee(shiftDetail.detailEmployee.EmployeeId) : 0

                    //       selectedEmployees: this.getSelectedEmployee(shiftDetail.detailEmployee.EmployeeId)
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

        if (this.state.selectedEmployees.length == 0)
            return { valid: false, message: 'You need to select at least one employee' };
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

    handleChangeStatusShift = (status, color) => {

        this.props.client
            .mutate({
                mutation: CHANGE_STATUS_SHIFT,
                variables: {
                    id: this.state.ShiftId,
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



    /* onSubmit = (event) => {
         event.preventDefault();
 
         let result = this.validateControls();
         let { valid, message } = result;
 
         if (valid) {
             this.insertShift();
         } else this.props.handleOpenSnackbar('error', message, 'bottom', 'right');
     }*/


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

        return <div className="MasterShiftForm">
            <form action="" >
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
                            isDisabled={isEdition}
                            isMulti
                        />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">* Start Date</label>
                        <input type="date" name="startDate" disabled={isEdition} className="form-control" value={this.state.startDate} onChange={this.handleInputValueChange} required />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">* End Date</label>
                        <input type="date" name="endDate" disabled={isEdition} className="form-control" value={this.state.endDate} onChange={this.handleInputValueChange} required />
                    </div>
                    <div className="col-md-6">
                        < label htmlFor="">* Start Time</label>
                        <TimeField name="startHour" style={{ width: '100%' }} disabled={isEdition} className="form-control" value={this.state.startHour} onChange={this.handleTimeChange('startHour')} />
                    </div>
                    <div className="col-md-6">
                        < label htmlFor="">* End Time</label>
                        <TimeField name="endHour" style={{ width: '100%' }} disabled={isEdition} className="form-control" value={this.state.endHour} onChange={this.handleTimeChange('endHour')} />
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
                            disabled={isEdition}
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
                            disabled={this.state.loadingPosition || isEdition}
                            required
                        >
                            <option value={0}>Select a position</option>
                            {this.renderPositionList()}
                        </select>
                    </div>
                    <div className="col-md-9">
                        < label htmlFor="">* Title</label>
                        <input type="text" className="form-control" disabled={isEdition} name="title" value={this.state.title} onChange={this.handleInputValueChange} />
                    </div>
                    <div className="col-md-3">
                        <ShiftColorPicker onChange={this.handleColorChange} disabled={isEdition} color={this.state.color} />
                    </div>
                </div  >
                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-danger float-right mb-1 ml-1" type="button" onClick={() => { this.handleChangeStatusShift(3, "#cccccc") }} >Rejected</button>
                        <button className="btn btn-success float-right mb-1 ml-1" type="button" onClick={() => { this.handleChangeStatusShift(2, "#114bff") }}>Approved</button>
                    </div>

                </div>
            </form>
        </div>
    }
}

export default withApollo(withGlobalContent(FilterForm));