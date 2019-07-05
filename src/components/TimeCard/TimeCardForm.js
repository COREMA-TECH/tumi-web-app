import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import { GET_HOTEL_QUERY, GET_EMPLOYEES, GET_POSITION_BY_QUERY, GET_RECRUITER, GET_CONTACT_BY_QUERY, GET_SHIFTS, GET_DETAIL_SHIFT, GET_WORKORDERS_QUERY } from './queries';
import { ADD_MARCKED } from './mutations';
import ShiftsData from '../../data/shitfsWorkOrder.json';
//import ShiftsData from '../../data/shitfs.json';
import { parse } from 'path';
import { bool } from 'prop-types';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
import TimeField from 'react-simple-timefield';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import moment from 'moment';
import Datetime from 'react-datetime';


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

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU"

class TimeCardForm extends Component {
    DEFAULT_STATE = {
        id: null,
        hotel: 0,
        IdEntity: null,
        date: new Date().toISOString().substring(0, 10),
        quantity: 0,
        status: 1,
        shift: moment('08:00', "HH:mm").format("HH:mm"),
        endShift: moment('16:00', "HH:mm").format("HH:mm"),
        startDate: '',
        endDate: '',
        needExperience: false,
        needEnglish: false,
        comment: '',
        EspecialComment: '',
        Electronic_Address: '',
        position: 0,
        PositionRateId: 0,
        PositionName: '',
        RecruiterId: 0,
        contactId: 0,
        userId: localStorage.getItem('LoginId'),
        ShiftsData: ShiftsData,
        saving: false,
        isAdmin: Boolean(localStorage.getItem('IsAdmin')),
        employees: [],
        employeesarray: [],
        openConfirm: false,
        idToDelete: 0,
        Monday: 'MO,',
        Tuesday: 'TU,',
        Wednesday: 'WE,',
        Thursday: 'TH,',
        Friday: 'FR,',
        Saturday: 'SA,',
        Sunday: 'SU,',
        dayWeek: '',
        DateContract: '',
        departmentId: 0,
        dayWeeks: '',
        statusTimeOut: false

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
        if (nextProps.item && nextProps.openModal) {

            this.setState(
                {
                    id: nextProps.item.id,
                    contactId: nextProps.item.contactId,
                    IdEntity: nextProps.item.IdEntity,
                    date: nextProps.item.date,
                    quantity: nextProps.item.quantity,
                    status: nextProps.item.status,
                    shift: nextProps.item.shift,
                    endShift: nextProps.item.endShift,
                    startDate: nextProps.item.startDate,
                    endDate: nextProps.item.endDate,
                    sameContractDate: nextProps.item.endDate,
                    needExperience: nextProps.item.needExperience,
                    needEnglish: nextProps.item.needEnglish,
                    comment: nextProps.item.comment,
                    userId: localStorage.getItem('LoginId'),
                    EspecialComment: nextProps.item.EspecialComment,
                    PositionName: nextProps.item.positionName,
                    dayWeeks: nextProps.item.dayWeek
                },
                () => {

                    this.ReceiveStatus = true;
                }
            );
        } else if (!nextProps.openModal) {
            this.setState({
                id: null,
                hotel: 0,
                IdEntity: null,
                date: new Date().toISOString().substring(0, 10),
                quantity: 0,
                status: 1,
                shift: moment('08:00', "HH:mm").format("HH:mm"),
                endShift: moment('16:00', "HH:mm").format("HH:mm"),
                startDate: '',
                endDate: '',
                needExperience: false,
                needEnglish: false,
                comment: '',
                EspecialComment: '',
                Electronic_Address: '',
                position: 0,
                PositionRateId: 0,
                PositionName: '',
                RecruiterId: 0,
                contactId: 0,
                userId: localStorage.getItem('LoginId'),
                ShiftsData: ShiftsData,
                saving: false,
                isAdmin: Boolean(localStorage.getItem('IsAdmin')),
                employees: [],
                employeesarray: [],
                openConfirm: false,
                idToDelete: 0,
                Monday: 'MO,',
                Tuesday: 'TU,',
                Wednesday: 'WE,',
                Thursday: 'TH,',
                Friday: 'FR,',
                Saturday: 'SA,',
                Sunday: 'SU,',
                dayWeek: '',
                DateContract: '',
                departmentId: 0,
                dayWeeks: '',
                statusTimeOut: false
            });
        }


        this.getHotels();
        this.getEmployees();
    }

    getWorkOrders = () => {
        this.props.client
            .query({
                query: GET_WORKORDERS_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    data: data.workOrder
                });
            })
            .catch();
    }


    componentWillMount() {
        this.getHotels();
        this.getEmployees();


    }

    handleCloseModal = (event) => {
        this.setState({
            ...this.DEFAULT_STATE
        });
        this.props.handleCloseModal(event);
    }



    handleSubmit = (event) => {
        event.preventDefault();
        if (
            this.state.IdEntity == 0 ||
            this.state.PositionRateId == 0 ||
            this.state.PositionRateId == null ||
            this.state.startDate == '' ||
            this.state.endDate == '' ||
            this.state.employeeId == 0 ||
            this.state.employeeId == null
        ) {

            this.props.handleOpenSnackbar('error', 'Error all fields are required');
        } else {
            this.setState({ saving: true });
            if (this.state.id == null) this.addIn();
            else {
                //alert(this.state.employees.detailEmployee)
                if (this.state.employees.length > 0) {
                    //  this.setState({ openConfirm: true, idToDelete: row.id });
                    this.props.handleOpenSnackbar('error', 'This work order has assigned employees, to update them you must eliminate them');
                    this.setState({ saving: false });
                } else {
                    //this.update();
                }
            }
        }
    };

    addIn = () => {
        this.props.client
            .mutate({
                mutation: ADD_MARCKED,
                variables: {
                    MarkedEmployees: {
                        entityId: this.state.IdEntity,
                        typeMarkedId: 30570,
                        markedDate: this.state.startDate,
                        markedTime: this.state.shift,
                        imageMarked: "https://www.elheraldo.co/sites/default/files/articulo/2017/11/16/un-gato-bebe-433.jpg",
                        EmployeeId: this.state.employeeId,
                        ShiftId: 1132,
                        notes: this.state.comment
                    }
                }
            })
            .then((data) => {
                if (!this.state.statusTimeOut) { this.addOut(); } else {
                    this.props.handleOpenSnackbar('success', 'Record Inserted!');
                    this.props.toggleRefresh();
                    this.setState({ saving: false }, () => { this.props.handleCloseModal(); this.props.toggleRefresh(); });
                } 0

            })
            .catch((error) => {
                this.setState({ saving: true });
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
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
                        imageMarked: "https://www.elheraldo.co/sites/default/files/articulo/2017/11/16/un-gato-bebe-433.jpg",
                        EmployeeId: this.state.employeeId,
                        ShiftId: 1132,
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
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
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
            this.state.PositionRateId == 0 ||
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
                    positions: data.getposition,
                    PositionRateId: PositionId
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
                query: GET_HOTEL_QUERY
            })
            .then(({ data }) => {
                this.setState({
                    hotels: data.getbusinesscompanies
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

    DisabledTimeOut = () => {
        if (document.getElementById("disabledTimeOut").checked) {
            this.setState(
                {
                    statusTimeOut: true,
                    endDate: "CCC",
                    endShift: "CCC"
                })
        } else {
            this.setState(
                {
                    statusTimeOut: false,
                    endDate: "",
                    endShift: ""
                })
        }
    }

    render() {

        const { classes } = this.props;
        const isAdmin = localStorage.getItem('IsAdmin') == "true"

        return (
            <div>
                <Dialog fullScreen={false} maxWidth='sm' open={this.props.openModal} onClose={this.props.handleCloseModal}>
                    <form action="" onSubmit={this.handleSubmit}>
                        <DialogTitle style={{ padding: '0px' }}>
                            <div className="modal-header">
                                <h5 className="modal-title">Add Time +</h5>
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6">
                                        <select
                                            required
                                            name="IdEntity"
                                            className="form-control"
                                            id=""
                                            onChange={this.handleChange}
                                            value={this.state.IdEntity}
                                            disabled={!isAdmin}
                                            onBlur={this.handleValidate}
                                        >
                                            <option value={0}>Select a Property</option>
                                            {this.state.hotels.map((hotel) => (
                                                <option value={hotel.Id}>{hotel.Name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="col-md-6">
                                        <select
                                            required
                                            name="employeeId"
                                            className="form-control"
                                            id=""
                                            onChange={this.handleChange}
                                            value={this.state.employeeId}
                                            disabled={!isAdmin}
                                            onBlur={this.handleValidate}
                                        >
                                            <option value={0}>Select a Employee</option>
                                            {this.state.employees.map((employee) => (
                                                <option value={employee.id}>{employee.lastName + " " + employee.firstName}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent style={{ backgroundColor: "#f5f5f5" }}>
                            <div className="card">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <input
                                                placeholder="Date In"
                                                required
                                                type="date"
                                                className="form-control"
                                                name="startDate"
                                                onChange={this.handleChange}
                                                value={this.state.startDate.substring(0, 10)}
                                                onBlur={this.handleValidate}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <input
                                                placeholder="Date Out"
                                                required={!this.state.statusTimeOut}
                                                type="date"
                                                className="form-control"
                                                name="endDate"
                                                disabled={this.state.statusTimeOut}
                                                onChange={this.handleChange}
                                                value={this.state.endDate.substring(0, 10)}
                                                onBlur={this.handleValidate}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <span className="float-left">
                                                <input type="checkbox" id="disabledTimeOut" name="disabledTimeOut" onChange={this.DisabledTimeOut} />
                                                <label htmlFor="">&nbsp; Currently working</label>
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="">* Time In</label>
                                            <Datetime dateFormat={false} value={moment(this.state.shift, "HH:mm").format("hh:mm A")} inputProps={{ name: "shift", required: true }} onChange={this.handleTimeChange('shift')} />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="">{!this.state.statusTimeOut ? "*" : ""} Time Out</label>
                                            <Datetime dateFormat={false} value={moment(this.state.endShift, "HH:mm").format("hh:mm A")} inputProps={{ name: "endShift", required: !this.state.statusTimeOut, disabled: this.state.statusTimeOut }} onChange={this.handleTimeChange('endShift')} />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="">Total Hours</label>
                                            <input type="text" className="MasterShiftForm-hour form-control" name="duration" value={this.state.duration} onChange={this.handleCalculatedByDuration} />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="">* Job</label>
                                            <select
                                                required
                                                name="PositionRateId"
                                                className="form-control"
                                                id=""
                                                onChange={this.handleChange}
                                                value={this.state.PositionRateId}
                                                onBlur={this.handleValidate}
                                            >
                                                <option value="0">Select a Position</option>
                                                {this.state.positions.map((position) => (
                                                    <option value={position.Id}>{position.Position} </option>

                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="">Notes</label>
                                            <textarea
                                                onChange={this.handleChange}
                                                name="comment"
                                                className="form-control"
                                                id=""
                                                cols="30"
                                                rows="3"
                                                value={this.state.comment}
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

                                            <button className="btn btn-success" type="submit">
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

