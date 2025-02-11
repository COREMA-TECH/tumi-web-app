import React, { Component } from 'react';
import { GET_INITIAL_DATA } from './Queries';
import withApollo from "react-apollo/withApollo";
import moment from 'moment';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { CREATE_WORKORDER } from './Mutations';
import { conformToMask } from 'react-text-mask';
import RapidForm from './RapidForm';

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
        weekStart: 1,
        weekEnd: 0,
        formOpen: false,
        currentRow: {}
    }

    componentWillMount() {
        this.getCurrentWeek();
        this.setState(() => ({
            rows: [
                this.createNewRow()
            ]
        }))
        this.getEmployees(this.props.entityId);
    }

    getCurrentWeek = (newCurrentDate) => {
        let currentDate = moment.utc();

        if (newCurrentDate) {
            currentDate = moment.utc(newCurrentDate);
        }

        let weekStart = currentDate.clone().day(this.props.weekDayStart);

        let weekEnd = weekStart.clone().add('days',6);
        
        let days = [];
        for (let i = 0; i <= 6; i++) {
            let date = moment.utc(weekStart).add(i, 'days');
            days.push({ index: i, label: date.format("MMMM Do,dddd"), date: date.format("YYYY-MM-DD") });
        };

        const hours = Array(24 * 2).fill(0).map((_, i) => {
            return ('0' + ~~(i / 2) + ':0' + 60 * (i / 2 % 1)).replace(/\d(\d\d)/g, '$1')
        });

        this.setState((prevState, prevProps) => {
            return {
                daysOfWeek: days,
                hours: hours,
                weekStart: weekStart.subtract(6,'days'),
                weekEnd: weekEnd
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.entityId != nextProps.entityId) {
            this.getEmployees(nextProps.entityId);
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
                        value: item.id, label: item.firstName + ' ' + item.lastName, key: item.id
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
            let currentRow = {};
            rows.map(_ => {
                if (_.id == rowId) {
                    _.employeeId = employeesTags
                    currentRow = _;
                }
                data.push(_);
            });
            
            if (Object.keys(employeesTags).length > 0 && rowId == this.state.lastRowId)
                data.push(this.createNewRow())
            return { rows: data, formOpen: true, currentRow }

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

    insertWorkOrders = (data) => {
        this.setState({ saving: true }, () => {
            this.props.client
                .mutate({
                    mutation: CREATE_WORKORDER,
                    variables: {
                        workOrder: data,
                        codeuser: localStorage.getItem('LoginId'),
                        nameUser: localStorage.getItem('FullName')
                    }
                })
                .then((data) => {
                    this.props.handleOpenSnackbar('success', ' Shifts created successfully!');
                    this.setState(() => ({ firstRow: null }));
                    this.setState(() => ({
                        rows: [{
                            ...this.createNewRow(),
                        }],
                        saving: false
                    }))
                })
                .catch((error) => {
                    this.setState({ saving: false });
                    this.props.handleOpenSnackbar('error', 'Error: ' + error);
                });
        });
    };

    saveWorkOrder = () => {
        this.setState(() => ({ saving: true }), () => {
            let data = [];
            this.state.rows.map(_ => {
                if (Object.keys(_.employeeId).length > 0) {
                    DAYS.map(day => {
                        if (_[day.description] != "0")
                            data.push(this.createWorkOrderObject({ dayNumber: day.id, hour: _[day.description], employeeId: _.employeeId.value }));
                    })
                }
            })
            if (data.length == 0) {
                this.setState(() => ({ saving: false }));
                this.props.handleOpenSnackbar(
                    'warning',
                    'There is nothing to save!!'
                )
            }
            else this.insertWorkOrders(data);
        })

    }

    // createWorkOrderObject = ({ dayNumber, hour, employeeId }) => {
    createWorkOrderObject = ({ dayNumber, hour, employeeId }) => {
        let date = this.state.daysOfWeek.find(_ => { return _.index == dayNumber }).date;
        let workOrder = {
            IdEntity: this.props.entityId,
            PositionRateId: this.props.positionId,
            comment: "",
            date: date,
            dayWeek: this.getDayCode(moment.utc(date).day()),
            departmentId: this.props.departmentId,
            endDate: date,
            endShift: moment.utc(new Date("01/01/1990 " + hour), "HH:mm:ss").add(8, 'hours').format('HH:mm'),
            needEnglish: false,
            needExperience: false,
            quantity: 1,
            shift: hour,
            startDate: date,
            status: 1,
            userId: localStorage.getItem("LoginId"),
            employeeId
        }
        return workOrder;
    }

    getDayCode = (day) => {
        return day.toString().replace(1, "MO").replace(2, "TU").replace(3, "WE").replace(4, "TH").replace(5, "FR").replace(6, "SA").replace(0, "SU")
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

    handleCloseForm = () => {
        this.setState(_ => {
            return { formOpen: false }
        }, _ => {
            this.handleReset();
        });
    }

    handleReset = () => {
        this.setState(_ => {
            return { currentRow: {} }
        });
    }

    setRow = (row) => {
        this.setState((prevState) => {
            let rows = prevState.rows;
            let data = [];
            rows.map(_ => {
                if (_.id == row.id)
                    Object.keys(row).map((key, index) => {
                        _[key] = row[key]
                    });
                data.push(_);
            });
            return { rows: data }
        }, _ => {
            this.handleCloseForm();
            this.handleReset();
        })
    }

    render() {
        return (
            <React.Fragment>
                <RapidForm setRow={this.setRow} propertyStartWeek={this.props.weekDayStart} open={this.state.formOpen} handleCloseForm={this.handleCloseForm} currentRow={this.state.currentRow}/>
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th className="font-weight-bold align-middle">
                                <div className="btn-group" role="group" aria-label="Basic example">
                                    <button type="button" className="btn btn-light btn-sm" onClick={_ => this.getCurrentWeek(this.state.weekStart)}>
                                        <i className="fas fa-chevron-left"></i>
                                        &nbsp;
                                        Prev Week
                                    </button>
                                    <button type="button" className="btn btn-light btn-sm" onClick={_ => this.getCurrentWeek(this.state.weekEnd)}>
                                        Next Week &nbsp;
                                        <i className="fas fa-chevron-right"></i>
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
                                    <tr className={`${this.state.currentRow.id === _.id ? 'table-active' : '' }`}>
                                        <td>
                                            <div className="d-inline-block w-25">
                                                {_.id != this.state.firstRow ? <button className="btn" onClick={this.onClickDeleteHandler(_.id)}>
                                                    <i className="fas fa-times"></i>
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
                                <button className="btn btn-success" onClick={this.saveWorkOrder}>Save {this.state.saving && <i className="fas fa-spinner fa-spin ml-1" />}</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </React.Fragment>
        );
    }

}

export default withApollo(Grid);