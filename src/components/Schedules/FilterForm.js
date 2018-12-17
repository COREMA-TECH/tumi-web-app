import React, { Component } from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from 'Generic/Global';
import { GET_INITIAL_DATA } from './Queries';

class FilterForm extends Component {

    DEFAULT_STATE = { employees: [], locations: [], location: 0 }

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

    handleChangeEmployeeTag = (employeesTags) => {
        this.setState({ employeesTags });
    }

    handleValueChange = (event) => {
        const element = event.target;
        this.setState({ [element.name]: element.value })
    }

    onSubmit = (event) => {
        event.preventDefault();
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
                        <input type="date" name="start-date" className="form-control" required />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="">End Date</label>
                        <input type="date" name="end-date" className="form-control" required />
                    </div>
                    <div className="col-md-5">
                        < label htmlFor="">Start Time</label>
                        <input type="time" name="start-hour" className="form-control" required />
                    </div>
                    <div className="col-md-5">
                        < label htmlFor="">End Time</label>
                        <input type="time" name="end-hour" className="form-control" required />
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
                        >
                            <option value={0}>Select a position</option>
                            {this.renderLocationList()}
                        </select>
                    </div>
                    <div className="col-md-12">
                        < label htmlFor="">Color</label>
                        <input type="text" className="form-control" name="location" />
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