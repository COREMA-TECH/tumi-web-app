import React, { Component } from 'react';
import { GET_INITIAL_DATA } from './Queries';
import withApollo from "react-apollo/withApollo"; 
import moment from 'moment';

class Grid extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE
        }
    }

    DEFAULT_STATE = {
        employees: [],
        daysOfWeek: [],
        weekStart: 0,
        weekEnd: 0
    }

    componentWillMount() {
        this.getCurrentWeek();
    }

    getCurrentWeek = (newCurrentDate) => {
        let currentDate = moment();

        if (newCurrentDate){
            currentDate = moment(newCurrentDate);
        }

        let weekStart = currentDate.clone().startOf('week');
        let weekEnd = currentDate.clone().endOf('week');
    
        let days = [];
        for (let i = 0; i <= 6; i++) {
            days.push(moment(weekStart).add(i, 'days').format("MMMM Do,dddd"));
        };
        
        const hours = Array(24 * 2).fill(0).map((_, i) => { 
            return ('0' + ~~(i / 2) + ':0' + 60  * (i / 2 % 1)).replace(/\d(\d\d)/g, '$1') 
        });

        this.setState((prevState, prevProps) => {
            return { 
                daysOfWeek: days, 
                hours: hours,
                weekStart: weekStart,
                weekEnd: weekEnd
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.location != nextProps.location || this.props.gridView != nextProps.gridView) {
            this.getEmployees(nextProps.location);
        }
    }

    getEmployees = (idEntity) => {
        this.props.client.query({
            query: GET_INITIAL_DATA,
            fetchPolicy: 'no-cache',
            variables: {
                idEntity: idEntity
            }
        }).then(({ data }) => {
            //Save data into state
            //--Employees
            this.setState((prevState) => {
                return { employees:data.employees }
            });

        }).catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                'Error loading employees list'
            );
        });
    }

    render() {
        return(
            <React.Fragment>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th className="font-weight-bold align-middle">
                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" class="btn btn-light btn-sm" onClick={ _ => this.getCurrentWeek(this.state.weekStart) }>
                                        <i class="fas fa-chevron-left"></i> 
                                        &nbsp;
                                        Prev Week
                                    </button>
                                    <button type="button" class="btn btn-light btn-sm" onClick={ _ => this.getCurrentWeek(this.state.weekEnd) }>
                                        Next Week &nbsp;
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </th>
                            {this.state.daysOfWeek.map(day => {
                                return (
                                    <th className="font-weight-bold align-middle">{day}</th>
                                )
                            })}
                        </tr>
                        <tr>
                            <th colspan="7" className="font-weight-bold">Employees</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.employees.map(employee => {
                            return (
                                <tr>
                                    <td>{employee.firstName + " " + employee.lastName}</td>
                                    {this.state.daysOfWeek.map(day => {
                                        return (
                                            <td>
                                                <select name="" className="form-control" id="">
                                                    <option value="0">OFF</option>
                                                    {this.state.hours.map(hour => {
                                                        return (
                                                            <option value={hour}>{hour}</option>
                                                        )
                                                    })}
                                                </select>
                                            </td>
                                        )
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </React.Fragment>
        );
    }

}

export default withApollo(Grid);