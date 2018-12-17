import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import withApollo from 'react-apollo/withApollo';
import TimeField from 'react-simple-timefield';
import withGlobalContent from 'Generic/Global';
import { GET_INITIAL_DATA } from './Queries';

class FilterForm extends Component {

    DEFAULT_STATE = {
        employees: [],
        selectedEmployees: [],
        locations: [],
        location: 0,
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

    renderLocationList = () => {
        return this.state.locations.map((item) => {
            return <option key={item.Id} value={item.Id}>{item.Code} | {item.Name}</option>
        })

    }

    validateControls = () => {
        console.log("This is my location", this.state.location, typeof (this.state.location))
        if (this.state.selectedEmployees.length == 0)
            return { valid: false, message: 'You need to select at least one employee' };
        if (this.state.endDate < this.state.startDate)
            return { valid: false, message: 'End Date can not be less than Start Date' };
        if (this.state.endDate < this.state.startDate)
            return { valid: false, message: 'End Hour can not be less than Start Date' };
        if (parseInt(this.state.location) == 0)
            return { valid: false, message: 'You need to select a location' };
        return { valid: true, message: 'Everything is ok' };;
    }

    handleChangeEmployeeTag = (selectedEmployees) => {
        this.setState({ selectedEmployees });
    }

    handleValueChange = (event) => {
        const element = event.target;
        this.setState({ [element.name]: element.value })
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
                        <label htmlFor="">Employess</label>
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
                        <TimeField name="startHour" style={{ width: '100%' }} className="form-control" value={this.state.startDate} onChange={this.handleTimeChange('startHour')} />
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
                        < label htmlFor="">Color</label>
                        <input type="text" className="form-control" name="color" value={this.state.color} onChange={this.handleValueChange} />
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