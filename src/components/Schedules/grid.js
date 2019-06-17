import React, { Component } from 'react';
import { GET_INITIAL_DATA } from './Queries';
import withApollo from "react-apollo/withApollo";
import moment from 'moment';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { CREATE_WORKORDER } from './Mutations';

const uuidv4 = require('uuid/v4');
const WILDCARD = '||';
const DAYS = [
    { id: 0, description: "firstDay" },
    { id: 1, description: "secondDay" },
    { id: 2, description: "thirdDay" },
    { id: 3, description: "fourthDay" },
    { id: 4, description: "fifthDay" },
    { id: 5, description: "sixthDay" },
    { id: 6, description: "seventhDay" }
];

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
            let date = moment(weekStart).add(i, 'days');
            days.push({ index: i, label: date.format("MMMM Do,dddd"), date: date.format("YYYY-MM-DD") });
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

    createWorkOrder = () => {
        this.props.client
            .mutate({
                mutation: CREATE_WORKORDER,
                variables: {
                    workOrder: this.state.form,
                    codeuser: localStorage.getItem('LoginId'),
                    nameUser: localStorage.getItem('FullName')
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Record Inserted!');
                this.setState(() => ({
                    rows: []
                }))
            })
            .catch((error) => {
                this.setState({ saving: true });
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
            });
    };

    saveWorkOrder = () => {
        let data = [];
        this.state.rows.map(_ => {
            if (Object.keys(_.employeeId).length > 0) {
                console.log(_);
                DAYS.map(day => {
                    if (_[day.description] != "0")
                        this.createWorkOrderObject({ dayNumber: day.id, hour: _[day.description] });
                })
            }
        })
    }

    // createWorkOrderObject = ({ dayNumber, hour, employeeId }) => {
    createWorkOrderObject = ({ dayNumber ,hour}) => {
        console.log({ dayNumber, dates: this.state.daysOfWeek })
        let date = this.state.daysOfWeek.find(_ => { return _.index == dayNumber }).date;
        console.log(date);
        let algo = {
            IdEntity: 206,
            PositionRateId: "172",
            comment: "",
            // contactId: null,
            date: date,
            dayWeek: this.getDayCode(moment(date).day()),
            departmentId: 30708,
            endDate: date,
            endShift: hour,
            needEnglish: false,
            needExperience: false,
            quantity: "1",
            shift: "08:00",
            startDate: "2019-05-21T00:00:00-06:00",
            status: 1,
            userId: "10"
        }
        console.log(algo);
    }

    getDayCode = (day) => {
        console.log("this is my day", day)
        return day.toString().replace(1, "MO").replace(2, "TU").replace(3, "WE").replace(4, "TH").replace(5, "FR").replace(6, "SA").replace(7, "SU")
    }

    getDayControlName = (day) => {
        return DAYS.find(_ => { return _.id == day }).description;
    }

    onChangeDayHandler = (rowId, dayName) => (e) => {
        let element = e.target;
        this.setState((prevState) => {
            let rows = prevState.rows;
            let data = [];
            rows.map(_ => {
                if (_.id == rowId)
                    _[dayName] = element.value
                data.push(_);
            })

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
                                            let dayName = this.getDayControlName(day.index)
                                            return (
                                                <td>

                                                    <select name="" className="form-control" id={`${_.id}${WILDCARD}${day.index}`} value={_[dayName]} onChange={this.onChangeDayHandler(_.id, dayName)} >
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
                                <button className="btn btn-success" onClick={this.saveWorkOrder}>Save</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        );
    }

}

export default withApollo(Grid);