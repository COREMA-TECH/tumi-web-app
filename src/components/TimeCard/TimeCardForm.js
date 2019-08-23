import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withApollo } from 'react-apollo';
import { GET_HOTEL_QUERY, GET_EMPLOYEES, GET_POSITION_BY_QUERY, GET_RECRUITER, GET_CONTACT_BY_QUERY, GET_SHIFTS, GET_DETAIL_SHIFT, GET_WORKORDERS_QUERY, GET_MARK } from './queries';
import { ADD_MARCKED, UPDATE_MARKED } from './mutations';
import TableCell from '@material-ui/core/TableCell';
import PropTypes from 'prop-types';
import moment from 'moment';
import Datetime from 'react-datetime';
import DatePicker from "react-datepicker";

import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';

const styles = (theme) => ({
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    buttonSuccess: {},
    buttonProgress: {
        //color: ,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        },
        '&:hover': {
            cursor: 'pointer'
        }
    }

});

const CustomTableCell = withStyles((theme) => ({
    head: {
        color: theme.palette.common.white
    },
    body: {
        fontSize: 12
    }
}))(TableCell);

class TimeCardForm extends Component {
    DEFAULT_STATE = {
        id: null,
        clockInId: null,
        clockOutId: null,
        IdEntity: null,
        employeeId: null,
        shift: moment('08:00', "HH:mm").format("HH:mm"),
        endShift: moment('16:00', "HH:mm").format("HH:mm"),
        startDate: '',
        endDate: '',
        employees: [],
        positions: [],
        PositionRateId: 0,
        newMark: false,
        readOnly: false
    };

    constructor(props) {
        super(props);
        this.state = {

            hotels: [],
            positions: [],
            recruiters: [],
            contacts: [],
            Shift: [],

            ...this.DEFAULT_STATE
        };

    }

    ReceiveStatus = false;

    componentWillReceiveProps(nextProps) {
        if (Object.keys(nextProps.item).length > 0 && nextProps.openModal) {
            this.setState({
                id: nextProps.item.clockInId,
                clockInId: nextProps.item.clockInId,
                clockOutId: nextProps.item.clockOutId,
                IdEntity: nextProps.item.hotelId,
                employeeId: nextProps.item.employeeId,
                startDate: nextProps.item.key ? nextProps.item.key.substring(nextProps.item.key.length - 8, nextProps.item.key.length) : nextProps.item.key,
                endDate: !nextProps.item.clockOutId ? '' : (nextProps.item.key ? nextProps.item.key.substring(nextProps.item.key.length - 8, nextProps.item.key.length) : nextProps.item.key),
                shift: nextProps.item.clockIn,
                endShift: !nextProps.item.clockOutId ? '' : (nextProps.item.clockOut !== 'Now' ? nextProps.item.clockOut : null),
                comment: nextProps.item.noteIn,
                duration: nextProps.item.clockOut !== 'Now' && nextProps.item.clockIn ? moment(nextProps.item.clockOut, 'HH:mm').diff(moment(nextProps.item.clockIn, 'HH:mm'), 'hours') : '',
                statusTimeOut: nextProps.item.clockOut === 'Now' ? true : false,
                newMark: nextProps.item.clockOut === 'Now' ? true : false,
                readOnly: nextProps.readOnly
            });
        } else if (!nextProps.openModal) {
            this.setState({
                id: null,
                clockInId: null,
                clockOutId: null,
                IdEntity: 0,
                employeeId: 0,
                shift: moment('08:00', "HH:mm").format("HH:mm"),
                endShift: moment('16:00', "HH:mm").format("HH:mm"),
                startDate: '',
                endDate: '',
                duration: 8,
                comment: '',
                PositionRateId: 0
            });
        }


        this.getHotels();
        this.getEmployees();
        //this.getPositions();
    }

    componentWillMount() {
        this.getHotels();
        this.getEmployees();
        //this.getPositions();
    }

    handleCloseModal = (event) => {
        this.setState({
            ...this.DEFAULT_STATE
        });
        this.props.handleCloseModal(event);
    }

    getPunches = () => {
        this.props.client.query({
            query: GET_MARK,
            variables: {
                typeMarkedId: 30570,
                markedDate: this.state.startDate
            }
        }).then(({ data }) => {
            this.setState(prevState => ({
                mark: data
            }));
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (
            this.state.IdEntity == null ||
            this.state.PositionRateId === null ||
            this.state.startDate == ''
        ) {

            this.props.handleOpenSnackbar('error', 'Error all fields are required');
        } else {
            this.setState({ saving: true });
            if (this.state.id == null) {
                //if (this.state.PositionRateId == 0)
                let mark = {
                    entityId: this.state.IdEntity === 0 ? 180 : this.state.IdEntity,
                    typeMarkedId: this.state.PositionRateId === 0 ? 30572 : 30570,
                    markedDate: this.state.startDate,
                    markedTime: this.state.shift,
                    imageMarked: "",
                    EmployeeId: this.state.employeeId,
                    ShiftId: null,
                    notes: this.state.comment
                }

                this.setState(prevState => {
                    return { marks: mark }
                }, _ => { this.addIn(); });

            } else {
                let marks = [];

                if (this.state.clockInId) {
                    let markIn = {
                        id: this.state.clockInId,
                        entityId: this.state.IdEntity,
                        markedDate: moment(this.state.startDate).format('YYYY-MM-DD'),
                        markedTime: this.state.shift,
                        imageMarked: "",
                        EmployeeId: this.state.employeeId,
                        ShiftId: null,
                        notes: this.state.comment
                    };
                    marks.push(markIn);
                }

                if (this.state.clockOutId) {
                    let markOut = {
                        id: this.state.clockOutId,
                        entityId: this.state.IdEntity,
                        markedDate: this.state.endDate === '' ? moment(Date.now()).format('YYYY-MM-DD') : moment(this.state.endDate).format('YYYY-MM-DD'),
                        markedTime: this.state.endShift,
                        imageMarked: "",
                        EmployeeId: this.state.endDate === '' ? 0 : this.state.employeeId,
                        ShiftId: null,
                        notes: this.state.comment
                    }

                    marks.push(markOut);
                }

                if (this.state.newMark) {
                    let markOut = {
                        entityId: this.state.IdEntity,
                        markedDate: moment(this.state.endDate).format('YYYY-MM-DD'),
                        markedTime: this.state.endShift,
                        imageMarked: "",
                        EmployeeId: this.state.employeeId,
                        ShiftId: null,
                        notes: this.state.comment,
                        typeMarkedId: this.state.PositionRateId === 0 ? 30571 : 30570,
                    }

                    this.setState(prevState => {
                        return { marks: markOut }
                    }, _ => { this.addIn(); });
                }
                
                marks.map(mark => {                    
                    this.updateMark(mark);
                });
            }
        }
    };

    updateMark = (mark) => {
        if (!mark) return;

        let editMark = {...mark};        

        this.props.client
            .mutate({
                mutation: UPDATE_MARKED,
                variables: {
                    MarkedEmployees: editMark
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Record Updated!');
                this.props.toggleRefresh();
                this.setState({ saving: false }, () => {
                    this.props.handleCloseModal();
                    //this.props.getReport();
                });
                // window.location.reload();
            })
            .catch((error) => {
                this.setState({ saving: true });
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
            });
    }

    addIn = () => {
        this.props.client.mutate({
            mutation: ADD_MARCKED,
            variables: {
                MarkedEmployees: this.state.marks
            }
        }).then((data) => {
            if (!this.state.statusTimeOut)
                this.addOut()
            else {
                this.props.handleOpenSnackbar('success', 'Record Inserted!');
                this.props.toggleRefresh();
                this.setState({ saving: false }, () => { this.props.handleCloseModal(); this.props.toggleRefresh(); });
            } 0

        })
            .catch((error) => {
                this.setState({ saving: true });
                this.props.handleOpenSnackbar('error', 'Error: Ups!!!, Something went wrong.');
            });
    };

    addOut = () => {
        this.props.client
            .mutate({
                mutation: ADD_MARCKED,
                variables: {
                    MarkedEmployees: {
                        entityId: this.state.IdEntity,
                        typeMarkedId: 30571,
                        markedDate: this.state.endDate,
                        markedTime: this.state.endShift,
                        imageMarked: "",
                        EmployeeId: this.state.employeeId,
                        ShiftId: null,
                        notes: this.state.comment
                    }
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Record Inserted!');
                this.props.toggleRefresh();
                this.setState({ saving: false }, () => {
                    this.props.handleCloseModal();
                    //this.props.getReport();
                });
                // window.location.reload();
            })
            .catch((error) => {
                this.setState({ saving: true });
                this.props.handleOpenSnackbar('error', 'Error: Ups!!!, Something went wrong.');
            });
    };

    getContacts = (id) => {
        this.props.client
            .query({
                query: GET_CONTACT_BY_QUERY,
                variables: { id: id }
            })
            .then(({ data }) => {
                var request = data.getcontacts.find((item) => { return item.Id == this.state.contactId })
                this.setState({
                    contacts: data.getcontacts,
                    Electronic_Address: request != null ? request.Electronic_Address : '',
                    departmentId: request != null ? request.Id_Deparment : 0
                });

            })
            .catch();
    };

    handleChangeState = (event) => {
        event.preventDefault();
        if (
            this.state.IdEntity == 0 ||
            this.state.PositionRateId == null ||
            this.state.contactId == 0 ||
            this.state.quantity == '' ||
            this.state.quantity == 0 ||
            this.state.date == '' ||
            this.state.startDate == '' ||
            this.state.endDate == '' ||
            this.state.shift == '' ||
            this.state.shift == 0 ||
            this.state.endShift == '' ||
            this.state.endShift == 0 ||
            this.state.dayWeeks == ''
        ) {
            this.props.handleOpenSnackbar('error', 'Error all fields are required');
        } else {
            this.setState({ converting: true });
            // this.update(2);
            this.CONVERT_TO_OPENING();
        }
    };

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let comments = '';
        let request = '';

        this.setState({
            [name]: value
        });

        if (name === 'IdEntity') {
            this.getPositions(value);
            this.getContacts(value);
        }
    };

    getPositions = (id, PositionId = null) => {
        this.props.client
            .query({
                query: GET_POSITION_BY_QUERY,
                variables: { id: id }
            })
            .then(({ data }) => {
                this.setState({
                    positions: data.getposition
                }, _ => {
                    console.log(this.state.positions);
                });
            })
            .catch();
    };

    getRecruiter = () => {
        this.props.client
            .query({
                query: GET_RECRUITER,
                variables: {}
            })
            .then(({ data }) => {
                this.setState({
                    recruiters: data.getusers

                });
            })
            .catch();
    };

    getEmployees = () => {
        this.props.client
            .query({
                query: GET_EMPLOYEES
            })
            .then(({ data }) => {
                this.setState({ employees: data.employees })
            })
            .catch();
    };


    getHotels = () => {
        this.props.client
            .query({
                query: GET_HOTEL_QUERY,
                variables: { Id: localStorage.getItem('LoginId') }
            })
            .then(({ data }) => {
                this.setState({
                    hotels: data.companiesByUser
                });
            })
            .catch();
    };

    validateInvalidInput = () => {
        if (document.addEventListener) {
            document.addEventListener(
                'invalid',
                (e) => {
                    e.target.className += ' invalid-apply-form';
                },
                true
            );
        }
    };

    handleTimeChange = (name) => (text) => {
        this.setState({
            [name]: moment(text, "HH:mm:ss").format("HH:mm")
        }, () => {
            this.calculateHours()
        })
    }

    handleValidate = (event) => {
        let selfHtml = event.currentTarget;
        if (selfHtml.value == "" || selfHtml.value == 0 || selfHtml.value == null)
            selfHtml.classList.add("is-invalid");
        else
            selfHtml.classList.remove("is-invalid");

    }

    handleCalculatedByDuration = (event) => {
        const target = event.target;
        const value = target.value;
        const startHour = this.state.shift;

        var endHour = moment(new Date("01/01/1990 " + startHour), "HH:mm:ss").add(parseFloat(value), 'hours').format('HH:mm');
        var _moment = moment(new Date("01/01/1990 " + startHour), "HH:mm:ss").add(8, 'hours').format('HH:mm');
        var _endHour = (value == 0) ? _moment : endHour;

        this.setState({
            endShift: _endHour,
            duration: value
        });
    }

    calculateHours = () => {
        let startHour = this.state.shift;
        let endHour = this.state.endShift;

        var duration = moment.duration(moment.utc(moment(endHour, "HH:mm:ss").diff(moment(startHour, "HH:mm:ss"))).format("HH:mm")).asHours();
        duration = parseFloat(duration).toFixed(2);

        this.setState({
            duration: duration
        });
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

    TakeDateContract = () => {
        const DateExpiration = this.state.hotels.find((item) => { return item.Id == this.state.IdEntity })
        if (this.state.IdEntity == 0) {
            this.props.handleOpenSnackbar('error', 'Please, select one property');
            document.getElementById("materialUnchecked").checked = false
        } else {
            if (DateExpiration.Contract_Expiration_Date == null) {
                this.props.handleOpenSnackbar('error', 'The property does not have a contract active, please create a contract');
                document.getElementById("materialUnchecked").checked = false
            } else {
                if (document.getElementById("materialUnchecked").checked) {
                    var ExpirationDate = new Date(DateExpiration.Contract_Expiration_Date);
                    this.setState({ endDate: ExpirationDate.toISOString().substring(0, 10) });
                } else { this.setState({ endDate: "" }); }
            }
        }
    }

    DisabledTimeOut = ({target: {checked}}) => {
        if (checked) {
            this.setState({
                statusTimeOut: true,
                endDate: "",
                endShift: ""
            });
        } else {
            this.setState({
                statusTimeOut: false,
                endShift: '16:00'
            }, _ => { this.calculateHours() });
        }
    }

    handleChangeDate = (date) => {
        let endDate = date;//moment(date).add(7, "days").format();

        this.setState({
            startDate: date,
            endDate: endDate
        });
    }

    handleChangeEndDate = (date) => {
        let endDate = date;

        this.setState({
            endDate: endDate
        });
    }

    getPropertyFilterList = _ => {
        const propertyList = this.state.hotels.map(item => {
            return { value: item.Id, label: item.Name }
        });

        const options = [{ value: 0, label: "Select a Property" }, ...propertyList];
        return options;
    }

    getEmployeeFilterList = _ => {
        const employeeList = this.state.employees.map(item => {
            return { value: item.id, label: item.firstName + " " + item.lastName }
        });

        const options = [{ value: 0, label: "Select a Property" }, ...employeeList];
        return options;
    }

    getPositionFilterList = _ => {
        const positionList = this.state.positions.map(item => {
            return { value: item.Id, label: item.Position }
        });

        const options = [{ value: 0, label: "Select a Position" }, ...positionList];
        return options;
    }

    handlePropertySelectChange = ({ value }) => {
        this.setState((prevState, props) => {
            let hotel = this.state.hotels.find(_ => {
                return _.Id === parseInt(value)
            })
            return { IdEntity: value, propertyStartWeek: hotel ? hotel.Start_Week : null }
        }, _ => {
            this.getPositions(parseInt(value));
        });
    }

    handleEmployeeSelectChange = ({ value }) => {
        this.setState((prevState, props) => {
            return { employeeId: value }
        });
    }

    handlePositionChange = ({ value }) => {
        this.setState((prevState, props) => {
            return { PositionRateId: value }
        });
    }

    findSelectedProperty = propertyId => {
        const defValue = { value: 0, label: "Select a Property" };

        if (propertyId === 'null' || propertyId === 0)
            return defValue;

        const found = this.state.hotels.find(item => {
            return parseInt(item.Id) === parseInt(propertyId);
        });

        return found ? { value: found.Id, label: found.Name.trim() } : defValue;
    }

    findSelectedEmployee = employeeId => {
        const defValue = { value: 0, label: "Select a Employee" };

        if (employeeId === 'null' || employeeId === 0)
            return defValue;

        const found = this.state.employees.find(item => {
            return item.id === employeeId;
        });

        return found ? { value: found.id, label: found.firstName.trim() + " " + found.lastName.trim() } : defValue;
    }

    findSelectedPosition = positionId => {
        const defValue = { value: 0, label: "Select a Position" };

        if (positionId === 'null' || positionId === 0)
            return defValue;

        const found = this.state.positions.find(item => {
            return item.Id === positionId;
        });

        return found ? { value: found.Id, label: found.Position.trim() } : defValue;
    }

    render() {

        const { classes } = this.props;
        const isAdmin = localStorage.getItem('IsAdmin') == "true"

        const propertyList = this.getPropertyFilterList();
        const employeeList = this.getEmployeeFilterList();
        const positionList = this.getPositionFilterList();

        const {readOnly} = this.state;

        return (
            <div>
                <Dialog fullScreen={false} maxWidth='sm' open={this.props.openModal} >
                    <form action="" onSubmit={this.handleSubmit}>
                        <DialogTitle style={{ padding: '0px' }}>
                            <div className="modal-header">
                                {
                                    readOnly 
                                        ? <p className="modal-title alert alert-success d-flex flex-row">
                                                <i class="fas fa-fw fa-exclamation-circle mr-3 align-self-center"></i>
                                                <div>
                                                    This timesheet has been approved and cannot be edited. A manager must unapprove the day or week this timesheet falls in before it can be edited.
                                                </div>
                                            </p>
                                        : <h5 className="modal-title">Add Time +</h5>
                                }
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Select
                                            options={propertyList}
                                            value={this.findSelectedProperty(this.state.IdEntity)}
                                            onChange={this.handlePropertySelectChange}
                                            closeMenuOnSelect={true}
                                            components={makeAnimated()}
                                            isMulti={false}
                                            onBlur={this.handleValidate}
                                            className="WorkOrders-dropdown"
                                            isDisabled={readOnly}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Select
                                            options={employeeList}
                                            value={this.findSelectedEmployee(this.state.employeeId)}
                                            onChange={this.handleEmployeeSelectChange}
                                            closeMenuOnSelect={true}
                                            components={makeAnimated()}
                                            isMulti={false}
                                            onBlur={this.handleValidate}
                                            className="WorkOrders-dropdown"
                                            isDisabled={readOnly}
                                        />
                                    </div>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent style={{ backgroundColor: "#f5f5f5" }}>
                            <div className="card">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div class="input-group flex-nowrap">
                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    onChange={this.handleChangeDate}
                                                    placeholderText="Date In"
                                                    id="datepickerIn"
                                                    disabled={readOnly}
                                                />
                                                <div class="input-group-append">
                                                    <label class="input-group-text" id="addon-wrapping" for="datepickerIn">
                                                        <i class="far fa-calendar"></i>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div class="input-group flex-nowrap">
                                                <DatePicker
                                                    selected={this.state.endDate}
                                                    onChange={this.handleChangeEndDate}
                                                    placeholderText="Date Out"
                                                    id="datepickerOut"
                                                    disabled={readOnly || this.state.statusTimeOut}
                                                />
                                                <div class="input-group-append">
                                                    <label class="input-group-text" id="addon-wrapping" for="datepickerOut">
                                                        <i class="far fa-calendar"></i>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <span className="float-left">
                                                <input type="checkbox" id="disabledTimeOut" name="disabledTimeOut" onChange={this.DisabledTimeOut} checked={this.state.statusTimeOut} disabled={readOnly} />
                                                <label htmlFor="">&nbsp; Currently working</label>
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="">* Time In</label>
                                            <Datetime dateFormat={false} value={this.state.shift ? moment(this.state.shift, "HH:mm").format("hh:mm A") : ''} inputProps={{ name: "shift", required: true }} onChange={this.handleTimeChange('shift')} inputProps={{disabled: readOnly }} />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="">{!this.state.statusTimeOut ? "*" : ""} Time Out</label>
                                            <Datetime dateFormat={false} value={!this.state.statusTimeOut && this.state.endShift ? moment(this.state.endShift, "HH:mm").format("hh:mm A") : ''} inputProps={{ name: "endShift", required: !this.state.statusTimeOut, disabled: this.state.statusTimeOut }} onChange={this.handleTimeChange('endShift')} inputProps={{disabled: readOnly }} />
                                        </div>
                                        <div className="col-md-4">
                                            <input placeholder="Total Hours" type="text" className="MasterShiftForm-hour form-control" name="duration" value={this.state.duration} onChange={this.handleCalculatedByDuration} disabled={readOnly} />
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <Select
                                                options={positionList}
                                                value={this.findSelectedPosition(this.state.PositionRateId)}
                                                onChange={this.handlePositionChange}
                                                closeMenuOnSelect={true}
                                                components={makeAnimated()}
                                                isMulti={false}
                                                className="WorkOrders-dropdown"
                                                isDisabled={readOnly}
                                            />
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <textarea
                                                onChange={this.handleChange}
                                                name="comment"
                                                className="form-control"
                                                id=""
                                                cols="30"
                                                rows="3"
                                                value={this.state.comment}
                                                placeholder="Notes"
                                                disabled={readOnly}
                                            />
                                        </div>
                                        <div className="col-md-12 text-right">
                                            <button
                                                type="button"
                                                className="btn btn-danger mr-1"
                                                onClick={this.handleCloseModal}
                                            >
                                                Cancel<i className="fas fa-ban ml-2" />
                                            </button>

                                            <button className="btn btn-success" type="submit" disabled={readOnly}>
                                                Save {!this.state.saving && <i className="fas fa-save ml2" />}
                                                {this.state.saving && <i className="fas fa-spinner fa-spin  ml2" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent >
                    </form >
                </Dialog >
            </div >
        );
    }
}

TimeCardForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(TimeCardForm));

