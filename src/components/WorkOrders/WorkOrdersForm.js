import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import { GET_DEPARTMENTS_QUERY, GET_HOTEL_QUERY, GET_POSITION_BY_QUERY, GET_RECRUITER, GET_CONTACT_BY_QUERY, GET_SHIFTS, GET_DETAIL_SHIFT, GET_WORKORDERS_QUERY } from './queries';
import { CREATE_WORKORDER, UPDATE_WORKORDER, CONVERT_TO_OPENING, DELETE_EMPLOYEE } from './mutations';
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
import RowForm from './RowForm';

const uuidv4 = require('uuid/v4');


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

class WorkOrdersForm extends Component {
    DEFAULT_STATE = {
        id: null,
        hotel: 0,
        IdEntity: null,
        date: new Date().toISOString().substring(0, 10),
        form: [],
        quantity: 0,
        status: 1,
        shift: '',
        endShift: '',
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
        openModal: false,
        departments: []

    };

    constructor(props) {
        super(props);
        this.state = {
            rowsInput: [1],
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

            console.log("nextProps.item ", nextProps.item)
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
                    openModal: nextProps.openModal,
                    EspecialComment: nextProps.item.EspecialComment,
                    PositionName: nextProps.item.positionName,
                    dayWeeks: nextProps.item.dayWeek
                },
                () => {
                    this.getEmployees();
                    this.getPositions(nextProps.item.IdEntity, nextProps.item.PositionRateId);
                    this.getContacts(nextProps.item.IdEntity);
                    this.getRecruiter();
                    this.calculateHours();

                    this.ReceiveStatus = true;
                }
            );
        } else if (!nextProps.openModal) {
            this.setState({
                IdEntity: 0,
                date: new Date().toISOString().substring(0, 10),
                quantity: 0,
                status: 0,
                shift: moment('08:00', "HH:mm").format("HH:mm"),
                endShift: moment('16:00', "HH:mm").format("HH:mm"),
                startDate: '',
                endDate: '',
                needExperience: false,
                needEnglish: false,
                comment: '',
                EspecialComment: '',
                PositionRateId: 0,
                contactId: 0,
                userId: localStorage.getItem('LoginId'),
                isAdmin: Boolean(localStorage.getItem('IsAdmin')),
                Monday: 'MO,',
                Tuesday: 'TU,',
                Wednesday: 'WE,',
                Thursday: 'TH,',
                Friday: 'FR,',
                Saturday: 'SA,',
                Sunday: 'SU,',
                dayWeek: '',
                duration: '8',
                openModal: false,


            });
        }
        this.setState({
            openModal: nextProps.openModal
        });
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

        this.setState({
            openModal: this.props.openModal

        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.setState({ saving: true });
        var evens = [];
        if (this.state.id == null) {
            evens = this.state.form.map((item) => {
                delete item.id
                return item;
            });
            this.setState({
                form: evens
            }, () => this.add());
        }
        else {
            //alert(this.state.employees.detailEmployee)
            if (this.state.employees.length > 0) {
                //  this.setState({ openConfirm: true, idToDelete: row.id });
                this.props.handleOpenSnackbar('error', 'This work order has assigned employees, to update them you must eliminate them');
                this.setState({ saving: false });
            } else {
                this.update();
            }
        }
        if (
            this.state.IdEntity == 0 ||
            this.state.PositionRateId == 0 ||
            this.state.PositionRateId == null ||
            this.state.quantity == '' ||
            this.state.quantity == 0 ||
            this.state.date == '' ||
            this.state.startDate == '' ||
            this.state.endDate == '' ||
            this.state.dayWeeks == ''
        ) {

            this.props.handleOpenSnackbar('error', 'Error all fields are required');
        } else {
        }
    };

    add = () => {
        this.props.client
            .mutate({
                mutation: CREATE_WORKORDER,
                variables: {
                    workOrder: this.state.form
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Record Inserted!');
                //this.setState({ ...this.DEFAULT_STATE }, this.props.toggleRefresh)
                this.setState({ openModal: false, saving: false });
                //this.getWorkOrders();
                //                this.props.handleCloseModal
                //this.props.toggleRefresh();
                // window.location.reload();
            })
            .catch((error) => {
                this.setState({ saving: true });
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
            });
    };

    update = (status = 1) => {
        this.props.client
            .mutate({
                mutation: UPDATE_WORKORDER,
                variables: {
                    startshift: this.state.shift,
                    endshift: this.state.endShift,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    quantity: this.state.quantity,
                    workOrder: {
                        id: this.state.id,
                        IdEntity: this.state.IdEntity,
                        date: this.state.date,
                        quantity: this.state.quantity,
                        status: status,
                        shift: this.state.shift,
                        endShift: this.state.endShift,
                        startDate: this.state.startDate,
                        endDate: this.state.endDate,
                        needExperience: this.state.needExperience,
                        needEnglish: this.state.needEnglish,
                        comment: this.state.comment,
                        EspecialComment: this.state.EspecialComment,
                        PositionRateId: this.state.PositionRateId,
                        userId: this.state.userId,
                        contactId: this.state.contactId,
                        dayWeek: this.state.dayWeeks
                    },
                    shift: {
                        entityId: this.state.IdEntity,
                        title: this.state.PositionName,
                        color: "#96989A",
                        status: 1,
                        idPosition: this.state.PositionRateId,
                        startDate: this.state.startDate,
                        endDate: this.state.endDate,
                        dayWeek: this.state.dayWeeks,
                        departmentId: this.state.departmentId
                    }
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Record Updated!');
                this.setState({ openModal: false, saving: false, converting: false });
                //this.setState({ ...this.DEFAULT_STATE }, this.props.toggleRefresh)
                window.location.reload();
            })
            .catch((error) => {
                this.setState({ saving: true, converting: false });
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

    getDepartment = (id) => {
        this.props.client
            .query({
                query: GET_DEPARTMENTS_QUERY,
                variables: { Id_Entity: id }
            })
            .then(({ data }) => {
                this.setState({
                    departments: data.getcatalogitem
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

    CONVERT_TO_OPENING = () => {
        this.props.client
            .mutate({
                mutation: CONVERT_TO_OPENING,
                variables: {
                    id: this.state.id,
                    userId: this.state.userId,
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Record Updated!');
                this.setState({ openModal: false, saving: false, converting: false });
                window.location.reload();
            })
            .catch((error) => {
                this.setState({ saving: true, converting: false });
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
            });
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

        if (name == "endDate") {
            let startDate;
            startDate = moment(value).subtract(7, 'days').format();
            this.setState({
                startDate: startDate
            });
        }

        if (name === 'PositionRateId') {
            comments = this.state.positions.find((item) => { return item.Id == value })
            this.setState({
                EspecialComment: comments != null ? comments.Comment : '',
                PositionName: comments != null ? comments.Position : ''
            });
        }

        if (name === 'IdEntity') {
            this.getPositions(value);
            this.getContacts(value);
            this.getDepartment(value);
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
        this.setState({ employees: [] })
        this.props.client
            .query({
                query: GET_SHIFTS,
                variables: { WorkOrderId: this.state.id }
            })
            .then(({ data }) => {
                let employeesList = [];
                let employeeIdTemp = 0;

                data.ShiftWorkOrder.map((item) => {
                    this.props.client
                        .query({
                            query: GET_DETAIL_SHIFT,
                            variables: { ShiftId: item.ShiftId }
                        })
                        .then(({ data }) => {
                            data.ShiftDetailbyShift.sort().map((itemDetails) => {
                                if (itemDetails.detailEmployee != null) {
                                    if (itemDetails.detailEmployee.EmployeeId != employeeIdTemp) {
                                        employeesList.push({
                                            WorkOrderId: item.WorkOrderId,
                                            ShiftId: item.ShiftId,
                                            ShiftDetailId: itemDetails.id,
                                            EmployeeId: itemDetails.detailEmployee.EmployeeId,
                                            Employees: itemDetails.detailEmployee.Employees.firstName + ' ' + itemDetails.detailEmployee.Employees.lastName
                                        })

                                        employeeIdTemp = itemDetails.detailEmployee.EmployeeId;
                                    }
                                }
                            })
                            this.setState({ employees: employeesList })
                        })
                        .catch();
                })
            })
            .catch();
    };

    deleteEmployee = (id) => {
        this.props.client
            .mutate({
                mutation: DELETE_EMPLOYEE,
                variables: {
                    id: id,

                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Employee deleted!');
                this.setState({ saving: false, converting: false });
                window.location.reload();
            })
            .catch((error) => {
                this.setState({ saving: true, converting: false });
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
            });
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

    handleChangePostData = (postData) => {

        var dataFiltered = this.state.form.filter((item) => {
            return item.id != postData.id
        });
        this.setState((prevState) => ({
            form: dataFiltered.concat(postData)
        }), () => {
            console.log(this.state.form);
        });

    }

    newWorkOrder = (event) => {
        event.preventDefault();
        var form = {
            id: uuidv4(),
            quantity: 0,
            PositionRateId: 0,
            shift: '',
            duration: 0,
            endShift: '',
            comment: '',
            dayWeek: ''
        }
        this.setState((prevState) =>
            ({ form: prevState.form.concat(form) })
        );
    }

    render() {

        const { classes } = this.props;
        const isAdmin = localStorage.getItem('IsAdmin') == "true"

        return (
            <div>
                <Dialog maxWidth="md" open={this.state.openModal} onClose={this.props.handleCloseModal}>
                    <DialogTitle style={{ padding: '0px' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Work Order</h5>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-3">
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
                                <div className="col-md-3">
                                    <input
                                        required
                                        type="date"
                                        className="form-control"
                                        name="endDate"
                                        disabled={this.state.sameContractDate}
                                        onChange={this.handleChange}
                                        value={this.state.endDate.substring(0, 10)}
                                        onBlur={this.handleValidate}
                                    />
                                </div>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent className="minWidth-empty-modal" style={{ backgroundColor: "#f5f5f5" }}>
                        <form action="" onSubmit={this.handleSubmit}>
                            <div className="card">
                                <div className="card-header bg-light">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <select
                                                required
                                                name="departmentId"
                                                className="form-control"
                                                id=""
                                                onChange={this.handleChange}
                                                value={this.state.departmentId}
                                                disabled={!isAdmin}
                                                onBlur={this.handleValidate}
                                            >
                                                <option value={0}>Select a Department</option>
                                                {this.state.departments.map((department) => (
                                                    <option value={department.Id}>{department.Description}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-2">
                                            <a href="" className="btn btn-link" onClick={this.newWorkOrder}>New +</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {this.state.form.map((item, index) => {
                                return (
                                    <RowForm
                                        startDate={this.state.startDate}
                                        endDate={this.state.endDate}
                                        departmentId={this.state.departmentId}
                                        IdEntity={this.state.IdEntity}
                                        form={item}
                                        positions={this.state.positions}
                                        handleChangePostData={this.handleChangePostData}
                                    />
                                )
                            })}
                            {/* <div className="row pl-0 pr-0">
                                <div className="col-md-5 col-5">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <label>Needs Experience?</label>
                                            <div className="onoffswitch">
                                                <input
                                                    type="checkbox"
                                                    name="needExperience"
                                                    onClick={this.toggleState}
                                                    onChange={this.handleChange}
                                                    className="onoffswitch-checkbox"
                                                    id="myonoffswitch"
                                                    checked={this.state.needExperience}
                                                />
                                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                                    <span className="onoffswitch-inner" />
                                                    <span className="onoffswitch-switch" />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <label>Needs to Speak English?</label>
                                            <div className="onoffswitch">
                                                <input
                                                    type="checkbox"
                                                    name="needEnglish"
                                                    onClick={this.toggleState}
                                                    onChange={this.handleChange}
                                                    className="onoffswitch-checkbox"
                                                    id="myonoffswitchSpeak"
                                                    checked={this.state.needEnglish}
                                                />
                                                <label className="onoffswitch-label" htmlFor="myonoffswitchSpeak">
                                                    <span className="onoffswitch-inner" />
                                                    <span className="onoffswitch-switch" />
                                                </label>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
 */}

                            <div className='row'>
                                {this.state.id && (
                                    <div className="col-md-12">
                                        {this.state.employees.length > 0 ? (
                                            <div className="card">
                                                <div className="card-header danger">Employees assign to work order</div>
                                                <div className="card-body">
                                                    <Table className="Table">
                                                        <TableHead>
                                                            <TableRow>
                                                                <CustomTableCell className={'Table-head'}>Delete</CustomTableCell>
                                                                <CustomTableCell className={'Table-head'}>Employees</CustomTableCell>
                                                            </TableRow>
                                                        </TableHead>
                                                        <TableBody>
                                                            {

                                                                this.state.employees.map((item) => {

                                                                    // if (item.detailEmployee) {
                                                                    return (
                                                                        <TableRow
                                                                            hover
                                                                            className={classes.row}
                                                                            key={item.id}
                                                                        //onClick={this.handleClickOpen('paper', true, item.id, item.rate)}
                                                                        >
                                                                            <CustomTableCell>
                                                                                <Tooltip title="Delete">
                                                                                    <button
                                                                                        className="btn btn-danger float-left"
                                                                                        /* onClick={(e) => {
                                                                                             e.preventDefault();
                                                                                             this.deleteEmployee(item.detailEmployee.ShiftDetailId)
                                                                                         }}*/

                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            this.setState({ openConfirm: true, idToDelete: item.EmployeeId });
                                                                                        }}
                                                                                    >
                                                                                        <i className="fas fa-trash"></i>
                                                                                    </button>
                                                                                </Tooltip>
                                                                            </CustomTableCell>
                                                                            <CustomTableCell>{item.Employees}</CustomTableCell>
                                                                        </TableRow>
                                                                    )
                                                                    //}
                                                                })

                                                            }
                                                        </TableBody>
                                                    </Table>
                                                    <ConfirmDialog
                                                        open={this.state.openConfirm}
                                                        closeAction={() => {
                                                            this.setState({ openConfirm: false });
                                                        }}
                                                        confirmAction={() => {
                                                            //  this.handleDelete(this.state.idToDelete);
                                                            this.deleteEmployee(this.state.idToDelete)
                                                        }}
                                                        title={'are you sure you want to delete this record?'}
                                                        loading={this.state.removing}
                                                    />
                                                </div>
                                            </div>
                                        ) : ''
                                        }
                                    </div>

                                )}


                                <div className="col-md-12">
                                    <button
                                        type="button"
                                        className="btn btn-danger ml-1 float-right"
                                        onClick={this.props.handleCloseModal}
                                    >
                                        Cancel<i className="fas fa-ban ml-2" />
                                    </button>

                                    <button className="btn btn-success ml-1 float-right" type="submit">
                                        Save {!this.state.saving && <i className="fas fa-save ml2" />}
                                        {this.state.saving && <i className="fas fa-spinner fa-spin  ml2" />}
                                    </button>

                                </div>
                            </div>


                        </form >
                    </DialogContent >
                </Dialog >

            </div >
        );
    }
}

WorkOrdersForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(WorkOrdersForm));

