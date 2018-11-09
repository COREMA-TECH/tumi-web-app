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
import { GET_WORKORDERS_QUERY, GET_RECRUITER } from './queries';
import TablePaginationActionsWrapped from '../ui-components/TablePagination';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import { DELETE_WORKORDER, UPDATE_WORKORDER } from './mutations';
import ShiftsData from '../../data/shitfs.json';

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
            rowsPerPage: 10,
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
            userId: 1,
            ShiftsData: ShiftsData,
            saving: false,
            recruiters: []
        }
    }

    componentWillMount() {
        this.props.client
            .query({
                query: GET_WORKORDERS_QUERY
            })
            .then(({ data }) => {
                this.setState({
                    data: data.workOrder
                });
            })
            .catch();

        this.getRecruiter();
    }

    handleDelete = (id) => {
        this.setState({ removing: true })
        this.props.client.mutate({
            mutation: DELETE_WORKORDER,
            variables: {
                id: id
            }
        }).then((data) => {
            this.props.handleOpenSnackbar('success', 'Record Deleted!');
            this.setState({ openModal: false, removing: false });
            window.location.reload();
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
                shift: data.shift,
                startDate: data.startDate,
                endDate: data.endDate,
                needExperience: data.needExperience,
                needEnglish: data.needExperience,
                comment: data.comment,
                PositionRateId: data.PositionRateId,
                RecruiterId: parseInt(this.state[`RecruiterId${data.id}`]),
                userId: 1
            }, () => {
                this.update();
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
                        userId: this.state.userId
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

    render() {
        let items = this.state.data;
        const { rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

        return (
            <div>
                <Paper style={{ overflowX: 'auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell className={"Table-head text-center"}></CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Position</CustomTableCell>
                                <CustomTableCell className={"Table-head text-center"}>Quantity</CustomTableCell>
                                <CustomTableCell className={"Table-head text-center"}>Shift</CustomTableCell>
                                <CustomTableCell className={"Table-head text-center"}>Need Experience?</CustomTableCell>
                                <CustomTableCell className={"Table-head text-center"}>Need to Speak English?</CustomTableCell>
                                <CustomTableCell className={"Table-head text-center"}></CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow>
                                        <CustomTableCell>
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
                                            <Tooltip title="Delete">
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
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </Tooltip>
                                        </CustomTableCell>
                                        <CustomTableCell>{row.position.Position}</CustomTableCell>
                                        <CustomTableCell className={'text-center'}>{row.quantity}</CustomTableCell>
                                        <CustomTableCell className={'text-center'}>
                                            {this.state.ShiftsData.map((shift) => (
                                                shift.Id == row.shift ? shift.Name : ''
                                            ))}
                                        </CustomTableCell>
                                        <CustomTableCell className={'text-center'}>{row.needExperience == false ? 'No' : 'Yes'}</CustomTableCell>
                                        <CustomTableCell className={'text-center'}>{row.needEnglish == false ? 'No' : 'Yes'}</CustomTableCell>

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
                                        </CustomTableCell>
                                    </TableRow>
                                );
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
                        title={'are you sure you want to delete this record?'}
                        loading={this.state.removing}
                    />
                </Paper>
            </div >
        );
    }

}

export default withStyles()(withApollo(WorkOrdersTable));