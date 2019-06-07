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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { copyFileSync } from 'fs';

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
        dayWeeks: '',
        DateContract: '',
        departmentId: 0,
        dayWeeks: '',
        openModal: false,
        departments: [],
        isEditing: false,
        dataToEdit: {
            quantity: 0,
            shift: moment('08:00', "HH:mm").format("HH:mm"),
            endShift: moment('16:00', "HH:mm").format("HH:mm"),
            dayWeeks: '',
            comment: '',
            needExperience: false,
            needEnglish: false,
            PositionRateId: 0,
            departmentId: 0,
            duration: '8',
        }

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

            let dataToEdit = {
                quantity: nextProps.item.quantity,
                shift: nextProps.item.shift,
                endShift: nextProps.item.endShift,
                dayWeeks: nextProps.item.dayWeeks,
                comment: nextProps.item.comment,
                needExperience: nextProps.item.needExperience,
                needEnglish: nextProps.item.needEnglish,
                PositionRateId: nextProps.item.PositionRateId,
                departmentId: nextProps.item.departmentId
            }
            this.setState({
                id: nextProps.item.id,
                workOrderId: nextProps.item.workOrderId,
                dataToEdit,
                ...dataToEdit,
                sameContractDate: nextProps.item.endDate,
                endDate: nextProps.item.endDate,
                contactId: nextProps.item.contactId,
                IdEntity: nextProps.item.IdEntity,
                date: nextProps.item.date,
                status: nextProps.item.status,
                startDate: nextProps.item.startDate,
                userId: localStorage.getItem('LoginId'),
                openModal: nextProps.openModal,
                EspecialComment: nextProps.item.EspecialComment,
                PositionName: nextProps.item.positionName,
                isEditing: true
            },
            () => {
                this.getEmployees();
                this.getPositions(nextProps.item.departmentId);
                this.getRecruiter();
                this.getDepartment(nextProps.item.IdEntity);
                this.newWorkOrder();
                this.ReceiveStatus = true;
            });
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
                dayWeeks: '',
                duration: '8',
                openModal: false,


            });
        }
        this.setState({
            openModal: nextProps.openModal
        });
        return true;
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
        if (typeof this.state.id === 'string') {
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
    };

    add = () => {
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
                //this.setState({ ...this.DEFAULT_STATE }, this.props.toggleRefresh)
                this.setState({ openModal: false, saving: false },
                    () => {
                        this.props.toggleRefresh();
                        this.props.handleCloseModal();
                    });
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
                    codeuser: localStorage.getItem('LoginId'),
                    nameUser: localStorage.getItem('FullName'),
                    workOrder: {
                        id: this.state.workOrderId,
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
                        dayWeek: this.state.dayWeeks,
                        departmentId: this.state.departmentId
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
                    id: this.state.workOrderId,
                    userId: this.state.userId,
                    codeuser: localStorage.getItem('LoginId'),
                    nameUser: localStorage.getItem('FullName')
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
            this.getDepartment(value);
        }

        if (name === 'departmentId') {
            this.getPositions(value);
        }
    };

    getPositions = (Id_Department) => {
        this.props.client
            .query({
                query: GET_POSITION_BY_QUERY,
                fetchPolicy: 'no-cache',
                variables: {
                    Id_Department
                }
            })
            .then(({ data }) => {
                this.setState({
                    positions: data.getposition
                });
            })
            .catch(error => {
                console.log(error);
            });
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
                variables: { WorkOrderId: this.state.workOrderId }
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
                    codeuser: localStorage.getItem('LoginId'),
                    nameUser: localStorage.getItem('FullName')
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
        //This is to set edited values into state, because Work Order Update Structure 
        //is created based on state props directly
        this.setState(() => ({
            ...postData
        }))
        var dataFiltered = this.state.form.filter((item) => {
            return item.id != postData.id
        });
        this.setState((prevState) => ({
            form: dataFiltered.concat(postData)
        }));

    }

    newWorkOrder = () => {
        var form = {
            id: uuidv4(),
            quantity: 0,
            PositionRateId: 0,
            shift: '',
            duration: 0,
            endShift: '',
            comment: '',
            dayWeeks: ''
        }
        this.setState((prevState) =>
            ({ form: prevState.form.concat(form) })
        );
    }

    handleCloseModal = (event) => {
        this.setState({
            ...this.DEFAULT_STATE
        });
        this.props.handleCloseModal(event);
    }

    handleChangeDate = (date) => {
        let startDate = moment(date).subtract(7, "days").format();

        this.setState({
            startDate: startDate,
            endDate: date
        });
    }

    render() {

        const { classes } = this.props;
        const isAdmin = localStorage.getItem('IsAdmin') == "true"
        console.log({ state: this.state })
        return (
            <div>
                <Dialog maxWidth="md" open={this.state.openModal} onClose={this.props.handleCloseModal}>
                    <DialogTitle style={{ padding: '0px' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Work Order</h5>
                        </div>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-4 col-xl-2">
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
                                <div className="col-md-4 col-xl-2">
                                    <div class="input-group flex-nowrap">
                                        <DatePicker
                                            selected={this.state.endDate}
                                            onChange={this.handleChangeDate}
                                            placeholderText="Week Ending"
                                            id="datepicker"
                                        />
                                        <div class="input-group-append">
                                            <label class="input-group-text" id="addon-wrapping" for="datepicker">
                                                <i class="far fa-calendar"></i>
                                            </label>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </DialogTitle>
                    <DialogContent className="minWidth-empty-modal" style={{ backgroundColor: "#f5f5f5" }}>
                        <form action="" onSubmit={this.handleSubmit}>
                            <div className="card">
                                <div className="card-header bg-light">
                                    <div className="row">
                                        <div className="col-md-4 col-xl-2 mb-2">
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
                                                    <option key={department.Id} value={department.Id}>{department.Description}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            {!this.state.isEditing &&
                                                <button type="button" className="btn btn-link" onClick={this.newWorkOrder}>New +</button>
                                            }
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
                                        dataToEdit={this.state.dataToEdit}
                                    />
                                )
                            })}

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

                                                                    return (
                                                                        <TableRow
                                                                            hover
                                                                            className={classes.row}
                                                                            key={item.id}
                                                                        >
                                                                            <CustomTableCell>
                                                                                <Tooltip title="Delete">
                                                                                    <button
                                                                                        className="btn btn-danger float-left"
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


                                <div className="col-12 pull-right">
                                    <button
                                        type="button"
                                        className="btn btn-danger tumi-button float-right"
                                        onClick={this.handleCloseModal}
                                    >
                                        Cancel<i className="fas fa-ban ml-2" />
                                    </button>
                                    <button className="btn btn-success tumi-button float-right" type="submit">
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

