import React, { Component } from 'react';
import { GET_INITIAL_DATA } from './Queries';
import withApollo from "react-apollo/withApollo";
import moment from 'moment';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';

const uuidv4 = require('uuid/v4');
const WILDCARD = '||';
class Grid extends Component {
    createNewRow = () => {
        let id = uuidv4();

        if (!this.state.firstRow)
            this.setState(() => ({ firstRow: id }));

        this.setState(() => ({ lastRowId: id }));

        return {
            id,
            employeeId: {},
            firstDay: '0',
            secondDay: '0',
            thirdDay: '0',
            fourthDay: '0',
            fifthDay: '0',
            sixthDay: '0',
            seventhDay: '0',
        }
    }
    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE,
            firstRow: null,
            lastRow: null
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
        this.setState(() => ({
            rows: [
                this.createNewRow()
            ]
        }))
    }

    getCurrentWeek = (newCurrentDate) => {
        let currentDate = moment();

        if (newCurrentDate) {
            currentDate = moment(newCurrentDate);
        }

        let weekStart = currentDate.clone().startOf('week');
        let weekEnd = currentDate.clone().endOf('week');

        let days = [];
        for (let i = 0; i <= 6; i++) {
            days.push({ index: i, label: moment(weekStart).add(i, 'days').format("MMMM Do,dddd") });
        };

        const hours = Array(24 * 2).fill(0).map((_, i) => {
            return ('0' + ~~(i / 2) + ':0' + 60 * (i / 2 % 1)).replace(/\d(\d\d)/g, '$1')
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
            let dataAPI = data.employees;
            dataAPI.map(item => {
                this.setState(prevState => ({
                    employees: [...prevState.employees, {
                        value: item.id, label: item.firstName + item.lastName, key: item.id
                    }]
                }))
            });

        }).catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                'Error loading employees list'
            );
        });
    }

    handleChangeEmployees = (rowId) => (employeesTags) => {
        this.setState((prevState) => {
            let rows = prevState.rows;
            let data = [];
            rows.map(_ => {
                if (_.id == rowId)
                    _.employeeId = employeesTags
                data.push(_);
            })
            if (Object.keys(employeesTags).length > 0 && rowId == this.state.lastRowId)
                data.push(this.createNewRow())
            return { rows: data }

        })

    };

    getEmployeeList = (idRow, employee) => {
        let data = [];
        this.state.employees.map(_ => {
            let record = this.state.rows.find(row => {
                return row.id != idRow && row.employeeId.value == _.value
            })
            if (!record)
                data.push(_)
        })
        return data;
    }

    onClickDeleteHandler = (id) => (e) => {
        this.setState((prevState) => {
            let data = prevState.rows.filter(_ => {
                return _.id != id
            })
            let lastRecord = data[data.length - 1];
            if (lastRecord)
                return { rows: data, lastRowId: lastRecord.id }
            return { rows: data }
        })
    }

    render() {
        return (
            <React.Fragment>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th className="font-weight-bold align-middle">
                                <div class="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" class="btn btn-light btn-sm" onClick={_ => this.getCurrentWeek(this.state.weekStart)}>
                                        <i class="fas fa-chevron-left"></i>
                                        &nbsp;
                                        Prev Week
                                    </button>
                                    <button type="button" class="btn btn-light btn-sm" onClick={_ => this.getCurrentWeek(this.state.weekEnd)}>
                                        Next Week &nbsp;
                                        <i class="fas fa-chevron-right"></i>
                                    </button>
                                </div>
                            </th>
                            {this.state.daysOfWeek.map(day => {
                                return (
                                    <th className="font-weight-bold align-middle">{day.label}</th>
                                )
                            })}
                        </tr>
                        <tr>
                            <th colspan="8" className="font-weight-bold">Employees</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.rows.map(_ => {
                                return (
                                    <tr>
                                        <td >
                                            <div className="d-inline-block w-25">
                                                {_.id != this.state.firstRow ? <button className="btn btn-info" onClick={this.onClickDeleteHandler(_.id)}>
                                                    <i class="fas fa-times"></i>
                                                </button> : ''}
                                            </div>
                                            <div className="d-inline-block w-75">
                                                <Select
                                                    id={_.id}
                                                    options={this.getEmployeeList(_.id, _.employeeId)}
                                                    value={_.employeeId}
                                                    onChange={this.handleChangeEmployees(_.id)}
                                                    closeMenuOnSelect={true}
                                                    components={makeAnimated()}
                                                    isMulti={false}
                                                />
                                            </div>

                                        </td>
                                        {this.state.daysOfWeek.map(day => {
                                            return (
                                                <td>

                                                    <select name="" className="form-control" id={`${_.id}${WILDCARD}${day.index}`} >
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
                                )
                            })
                        }
                        <tr>
                            <td colspan="8" align="right">
                                <button className="btn btn-success">Save</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        );
    }

}

export default withApollo(Grid);