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
            status: 1,
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

            filterValue: 0
        }
    }

    componentWillMount() {
        /*this.props.client
            .query({
                query: GET_WORKORDERS_QUERY
            })
            .then(({ data }) => {
                this.setState({
                    data: data.workOrder
                });
            })
            .catch();*/
        this.getWorkOrders();
        this.getRecruiter();
        this.getHotel();

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

    componentWillReceiveProps(nextProps){
        this.setState({
            filterValue: nextProps.filter
        })
    }

    render() {
        let items = this.state.data;
        const { rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);
        console.log("These are my props", this.props)

        return (
            <div>
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
                                {this.props.showRecruiter && <CustomTableCell className={"Table-head text-center"}>Assign to</CustomTableCell>}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                let backgroundColor = row.status === 0 ? '#ddd' : '#fff';
                                if(this.state.filterValue === 0) {
                                    return (
                                        <TableRow style={{background: backgroundColor}}>
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
                                                                // onClick={(e) => {
                                                                //     e.stopPropagation();
                                                                //     return this.props.onDeleteHandler({ ...row });
                                                                // }}
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
                                            {this.props.showRecruiter &&
                                            <CustomTableCell>
                                                <div className="input-group">
                                                    <select
                                                        required
                                                        name={`RecruiterId`}
                                                        className="form-control"
                                                        id=""
                                                        onChange={(e) => { this.handleChange(e, row.id) }}
                                                        value={this.state.RecruiterId}
                                                        onBlur={this.handleValidate}
                                                    >
                                                        <option value="0">Select a Recruiter</option>
                                                        {this.state.recruiters.map((recruiter) => (
                                                            <option value={recruiter.Id} > {recruiter.Full_Name}</option>
                                                        ))}
                                                    </select>
                                                    <Tooltip title="Convert to Opening">
                                                        <button
                                                            className="btn btn-link float-left ml-1"
                                                            disabled={this.props.loading}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                this.handleConvertToOpening(e, { ...row });
                                                            }}
                                                        >
                                                            <i class="fas fa-exchange-alt text-info"></i>
                                                        </button>
                                                    </Tooltip>
                                                </div>
                                            </CustomTableCell>}
                                        </TableRow>
                                    );
                                } else if (this.state.filterValue == 1) {
                                    if(row.status == 0){
                                        return (
                                            <TableRow style={{background: backgroundColor}}>
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
                                                                    // onClick={(e) => {
                                                                    //     e.stopPropagation();
                                                                    //     return this.props.onDeleteHandler({ ...row });
                                                                    // }}
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
                                                {this.props.showRecruiter &&
                                                <CustomTableCell>
                                                    <div className="input-group">
                                                        <select
                                                            required
                                                            name={`RecruiterId`}
                                                            className="form-control"
                                                            id=""
                                                            onChange={(e) => { this.handleChange(e, row.id) }}
                                                            value={this.state.RecruiterId}
                                                            onBlur={this.handleValidate}
                                                        >
                                                            <option value="0">Select a Recruiter</option>
                                                            {this.state.recruiters.map((recruiter) => (
                                                                <option value={recruiter.Id} > {recruiter.Full_Name}</option>
                                                            ))}
                                                        </select>
                                                        <Tooltip title="Convert to Opening">
                                                            <button
                                                                className="btn btn-link float-left ml-1"
                                                                disabled={this.props.loading}
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    this.handleConvertToOpening(e, { ...row });
                                                                }}
                                                            >
                                                                <i class="fas fa-exchange-alt text-info"></i>
                                                            </button>
                                                        </Tooltip>
                                                    </div>
                                                </CustomTableCell>}
                                            </TableRow>
                                        );
                                    }
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
            </div >
        );
    }

}

export default (withApollo(WorkOrdersTable));