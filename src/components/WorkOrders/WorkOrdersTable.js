import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';
import { withApollo } from 'react-apollo';
import { GET_WORKORDERS_QUERY, GET_RECRUITER, GET_HOTEL_QUERY } from './queries';
import TablePaginationActionsWrapped from '../ui-components/TablePagination';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import { DELETE_WORKORDER, UPDATE_WORKORDER, CONVERT_TO_OPENING } from './mutations';
import ShiftsData from '../../data/shitfsWorkOrder.json';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import Query from 'react-apollo/Query';

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

class WorkOrdersTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            Hotels: [],
            rowsPerPage: 5,
            page: 0,
            openConfirm: false,
            ShiftsData: ShiftsData,
            id: null,
            hotel: 0,
            IdEntity: null,
            date: '',
            quantity: 0,
            status: "",
            shift: '',
            startDate: '',
            endDate: '',
            needExperience: false,
            needEnglish: false,
            comment: '',
            position: 0,
            PositionRateId: null,
            RecruiterId: null,
            userId: localStorage.getItem('LoginId'),
            ShiftsData: ShiftsData,
            saving: false,
            recruiters: [],
            contactId: null,
            filterValue: 0,
            startDate: '',
            endDate: '',
            endDateDisabled: true
        }
    }

    componentWillMount() {
        this.getWorkOrders();
        this.getRecruiter();
        this.getHotel();

    }

    getDateFilters = () => {
        var variables;
        variables = null;
        if (this.state.startDate != "" && this.state.endDate != "") {
            variables = {
                startDate: this.state.startDate,
                endDate: this.state.endDate,
                ...variables
            }
        }
        if (this.state.status != "") {
            variables = {
                status: this.state.status,
                ...variables,
            }
        } 
        if (this.state.id != null) {
            variables = {
                id: this.state.id,
                ...variables,
            }
        }

        return variables;
    }

    getWorkOrders = () => {
        this.props.client
            .query({
                query: GET_WORKORDERS_QUERY,
                fetchPolicy: 'no-cache',
                variables: {
                    ...this.getDateFilters()
                }
            })
            .then(({ data }) => {
                this.setState({
                    data: data.workOrder
                });
            })
            .catch();
    }

    handleDelete = (id) => {
        this.setState({ removing: true })
        this.props.client.mutate({
            mutation: DELETE_WORKORDER,
            variables: {
                id: id
            }
        }).then((data) => {
            this.getWorkOrders();
            this.getRecruiter();
            this.getHotel();
            this.props.handleOpenSnackbar('success', 'Record Deleted!');
            this.setState({ openConfirm: false, removing: false });
            //window.location.reload();
        }).catch((error) => {
            this.setState({ removing: false })
            this.props.handleOpenSnackbar('error', 'Error: ' + error);
        });
    }

    handleConvertToOpening = (event, data) => {
        event.preventDefault();
        if (this.state[`RecruiterId${data.id}`]) {
            this.setState({
                id: data.id,
                IdEntity: data.IdEntity,
                date: data.IdEntity,
                quantity: data.quantity,
                status: 2,
                shift: data.shift + '-' + data.endShift,
                startDate: data.startDate,
                endDate: data.endDate,
                needExperience: data.needExperience,
                needEnglish: data.needExperience,
                comment: data.comment,
                contactId: data.contactId,
                PositionRateId: data.PositionRateId,
                RecruiterId: parseInt(this.state[`RecruiterId${data.id}`]),
                userId: this.state.userId
            }, () => {
                // this.update();
                this.CONVERT_TO_OPENING();
            });
        } else {
            this.props.handleOpenSnackbar('error', 'Recruiter fields is required');
        }
    }

    handleChange = (event, key) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name + key]: value
        });
    };

    update = () => {
        this.props.client
            .mutate({
                mutation: UPDATE_WORKORDER,
                variables: {
                    workOrder: {
                        id: this.state.id,
                        IdEntity: this.state.IdEntity,
                        date: this.state.date,
                        quantity: this.state.quantity,
                        status: this.state.status,
                        shift: this.state.shift,
                        startDate: this.state.startDate,
                        endDate: this.state.endDate,
                        needExperience: this.state.needExperience,
                        needEnglish: this.state.needEnglish,
                        comment: this.state.comment,
                        PositionRateId: this.state.PositionRateId,
                        userId: this.state.userId,
                        contactId: this.state.contactId
                    }
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

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value });
    };

    getHotel = () => {
        this.props.client
            .query({
                query: GET_HOTEL_QUERY,
                variables: {}
            })
            .then(({ data }) => {
                this.setState({
                    Hotels: data.getbusinesscompanies

                });
            })
            .catch();
    };

    componentWillReceiveProps(nextProps) {
        this.setState({
            filterValue: nextProps.filter
        })
    }

    handleChangeDate = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value,
            endDateDisabled: false
        });
    }

    handleEndDate = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => {
            this.getWorkOrders()
        });
    }

    clearInputDates = () => {
        this.setState({
            startDate: '',
            endDate: '',
            endDateDisabled: true
        }, () => {
            this.getWorkOrders();
        })
    }

    handleFilterValue = (event) => {
        const target = event.target;
        var value = target.value;
        const name = target.name;

        if (value == 3)
            value = "";

        this.setState({
            status: value
        }, () => {
            this.getWorkOrders()
        });
    }

    handleChangeId = (event) => {
        const target = event.target;
        var value = target.value;

        this.setState({
            id: value == "" ? null : value
        }, () => {
            this.getWorkOrders()
        });
    }

    render() {
        let items = this.state.data;
        const { rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);


        return (
            <div className="card">
                <div className="card-header bg-light">
                    <div className="row">
                        <div className="col-md-2">
                            <select name="" id="" className="form-control" onChange={(e) => {
                                this.setState({
                                    filterValue: parseInt(e.target.value)
                                })
                            }}>
                                <option value="0">State</option>
                                <option value="1">Canceled Work Orders</option>
                            </select>
                        </div>
                        <div className="col-md-3">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">From</span>
                                </div>
                                <input type="date" className="form-control" placeholder="2018-10-30" value={this.state.startDate} name="startDate" onChange={this.handleChangeDate} />
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">To</span>
                                </div>
                                <input type="date" className="form-control" name="endDate" value={this.state.endDate} disabled={this.state.endDateDisabled ? true : false} placeholder="2018-10-30" onChange={this.handleEndDate} />
                            </div>
                        </div>
                        <div className="col-md-1">
                            <button class="btn btn-outline-secondary btn-not-rounded" type="button" onClick={this.clearInputDates}>
                                <i class="fas fa-ban"></i> Clear
                            </button>
                        </div>
                        <div className="col-md-2 offset-md-2">
                            <select name="filterValue" id="" className="form-control" onChange={this.handleFilterValue}>
                                <option value="3">Status (All)</option>
                                <option value="1">Open</option>
                                <option value="2">Completed</option>
                                <option value="0">Canceled</option>
                            </select>
                        </div>
                        <div className="col-md-2">
                            <div class="input-group">
                                <input type="text" name="id" className="form-control" placeholder="Prop.Code / WO.No" onChange={this.handleChangeId} />
                                <div class="input-group-prepend">
                                    <span class="input-group-text" id="basic-addon1">
                                        <i class="fas fa-search"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className="card-body">

                    <Paper style={{ overflowX: 'auto' }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell className={"Table-head text-center"}>Actions</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>No.</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Property</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Position</CustomTableCell>
                                    <CustomTableCell className={"Table-head text-center"}>Quantity</CustomTableCell>
                                    <CustomTableCell className={"Table-head text-center"}>Shift</CustomTableCell>
                                    <CustomTableCell className={"Table-head text-center"}>Needs Experience?</CustomTableCell>
                                    <CustomTableCell className={"Table-head text-center"}>Needs to Speak English?</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    let backgroundColor = row.status === 0 ? '#ddd' : '#fff';
                                    if (this.state.filterValue === 0) {
                                        return (
                                            <TableRow style={{ background: backgroundColor }}>
                                                <CustomTableCell className={'text-center'}>
                                                    <Tooltip title="Life Cycle">
                                                        <button
                                                            className="btn btn-success mr-1 float-left"
                                                            disabled={this.props.loading}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                this.props.onLifeHandler({ ...row });
                                                                // return this.props.onEditHandler({ ...row });
                                                            }}
                                                        >
                                                            <i class="fas fa-info"></i>
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Edit">
                                                        <button
                                                            className="btn btn-success mr-1 float-left"
                                                            disabled={this.props.loading}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                return this.props.onEditHandler({ ...row });
                                                            }}
                                                        >
                                                            <i className="fas fa-pen"></i>
                                                        </button>
                                                    </Tooltip>
                                                    {
                                                        row.status != 0 ? (
                                                            <Tooltip title="Cancel">
                                                                <button
                                                                    className="btn btn-danger float-left"
                                                                    disabled={this.props.loading}
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        this.setState({ openConfirm: true, idToDelete: row.id });
                                                                    }}
                                                                >
                                                                    <i className="fas fa-ban"></i>
                                                                </button>
                                                            </Tooltip>
                                                        ) : (
                                                                ''
                                                            )
                                                    }
                                                </CustomTableCell>
                                                <CustomTableCell>{row.id}</CustomTableCell>
                                                <CustomTableCell>{row.BusinessCompany != null ? row.BusinessCompany.Name : ''}</CustomTableCell>
                                                <CustomTableCell>{row.position != null ? row.position.Position : ''}</CustomTableCell>
                                                <CustomTableCell className={'text-center'}>{row.quantity}</CustomTableCell>
                                                <CustomTableCell className={'text-center'}>{row.shift + '-' + row.endShift}</CustomTableCell>
                                                <CustomTableCell className={'text-center'}>{row.needExperience == false ? 'No' : 'Yes'}</CustomTableCell>
                                                <CustomTableCell className={'text-center'}>{row.needEnglish == false ? 'No' : 'Yes'}</CustomTableCell>
                                            </TableRow>
                                        );
                                    }
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    {items.length > 0 && (
                                        <TablePagination
                                            colSpan={3}
                                            count={items.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            onChangePage={this.handleChangePage}
                                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            ActionsComponent={TablePaginationActionsWrapped}
                                        />
                                    )}
                                </TableRow>
                            </TableFooter>
                        </Table>
                        <ConfirmDialog
                            open={this.state.openConfirm}
                            closeAction={() => {
                                this.setState({ openConfirm: false });
                            }}
                            confirmAction={() => {
                                this.handleDelete(this.state.idToDelete);
                            }}
                            title={'are you sure you want to cancel this record?'}
                            loading={this.state.removing}
                        />
                    </Paper>
                </div>
            </div >
        );
    }

}

export default (withApollo(WorkOrdersTable));