import React, { Component } from 'react';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from 'Generic/Global';

import { GET_INITIAL_DATA, GET_POSITION } from './Queries';
import { INSERT_SHIFT } from './Mutations';

import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import TimeField from 'react-simple-timefield';
import Options from './Options';
import ReactDOM from 'react-dom';
import ShiftColorPicker from './ShiftColorPicker';

class FilterForm extends Component {

    DEFAULT_STATE = {
        employees: [],
        selectedEmployees: [],
        locations: [],
        location: 0,
        positions: [],
        position: 0,
        color: '',
        startHour: '00:00',
        endHour: '00:00',
        startDate: '',
        endDate: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE
        }
    }

    getEmployees = () => {
        this.props.client
            .query({
                query: GET_INITIAL_DATA
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
    getPosition = () => {
        this.props.client
            .query({
                query: GET_POSITION,
                variables: {
                    Id_Entity: this.state.location
                }
            })
            .then(({ data }) => {
                console.log(data)
                //Save Positions into state
                this.setState((prevState) => {
                    return { positions: data.getposition, position: 0 }
                })

            }).catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error loading position list',
                    'bottom',
                    'right'
                );
            });
    }

    insertShift = () => {
        this.props.client
            .mutate({
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                startHour: this.state.startHour,
                endHour: this.state.endHour,
                shift: {
                    entityId: this.state.location,
                    title: this.state.positionText,
                    color: this.state.color,
                    status: 1,
                    idPosition: this.state.position
                },
                employees: this.state.selectedEmployees.map(item => { return item.value })
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Shift created successfully!');
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error creating Shift');
            });
    };

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
        if (parseInt(endHour) < parseInt(startHour))
            return { valid: false, message: 'End Time can not be less than Start Time' };

        if (parseInt(this.state.location) == 0)
            return { valid: false, message: 'You need to select a location' };
        if (parseInt(this.state.position) == 0)
            return { valid: false, message: 'You need to select a position' };

        return { valid: true, message: 'Everything is ok' };
    }

    handleChangeEmployeeTag = (selectedEmployees) => {
        this.setState({ selectedEmployees });
    }

    handleValueChange = (event) => {
        var index = event.nativeEvent.target.selectedIndex;
        var text = event.nativeEvent.target[index].text;

        const element = event.target;
        this.setState({
            [element.name]: element.value,
            [`${element.name}Text`]: text
        }, () => {
            console.log("This is my state", this.state)
            if (element.name == 'location')
                this.getPosition();
        })
    }

    handleTimeChange = (name) => (text) => {
        this.setState({ [name]: text })
    }

    onSubmit = (event) => {
        event.preventDefault();

        let result = this.validateControls();
        let { valid, message } = result;

        if (valid) {

        } else this.props.handleOpenSnackbar('error', message, 'bottom', 'right');
    }

    componentWillMount() {
        this.getEmployees()
    }
    render() {
        return <div className="MasterShiftForm">
            <form action="" onSubmit={this.onSubmit}>
                <div className="row">
                    <div className="col-md-12">
                        <Options />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">Employes</label>
                        <Select
                            name="employees"
                            options={this.state.employees}
                            value={this.state.employeesTags}
                            onChange={this.handleChangeEmployeeTag}
                            closeMenuOnSelect={false}
                            components={makeAnimated()}
                            isMulti
                        />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">Start Date</label>
                        <input type="date" name="startDate" className="form-control" value={this.state.startDate} onChange={this.handleValueChange} required />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">End Date</label>
                        <input type="date" name="endDate" className="form-control" value={this.state.endDate} onChange={this.handleValueChange} required />
                    </div>
                    <div className="col-md-5">
                        < label htmlFor="">Start Time</label>
                        <TimeField name="startHour" style={{ width: '100%' }} className="form-control" value={this.state.startHour} onChange={this.handleTimeChange('startHour')} />
                    </div>
                    <div className="col-md-5">
                        < label htmlFor="">End Time</label>
                        <TimeField name="endHour" style={{ width: '100%' }} className="form-control" value={this.state.endHour} onChange={this.handleTimeChange('endHour')} />
                    </div>
                    <div className="col-md-2">
                        <span className="MasterShiftForm-hour" data-hour="4h"></span>
                    </div>
                    <div className="col-md-12">
                        < label htmlFor="">Location</label>
                        <select
                            name="location"
                            id="location"
                            onChange={this.handleValueChange}
                            value={this.state.location}
                            className="form-control"
                            required
                        >
                            <option value={0}>Select a location</option>
                            {this.renderLocationList()}
                        </select>
                    </div>
                    <div className="col-md-12">
                        < label htmlFor="">Position</label>
                        <select
                            name="position"
                            id="position"
                            onChange={this.handleValueChange}
                            value={this.state.position}
                            className="form-control"
                            required
                        >
                            <option value={0}>Select a position</option>
                            {this.renderPositionList()}
                        </select>
                    </div>
                    <div className="col-md-12">
                        < label htmlFor="">Color</label>
                        <input type="text" className="form-control" name="color" value={this.state.color} onChange={this.handleValueChange} />
                        <ShiftColorPicker />
                    </div>
                </div  >
                <div className="row">
                    <div className="col-md-12">
                        <button className="btn btn-success float-right" type="submit">Publish</button>
                    </div>
                </div>
            </form>
        </div>
    }
}

export default withApollo(withGlobalContent(FilterForm));