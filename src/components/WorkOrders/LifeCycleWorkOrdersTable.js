import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import { PHASE_WORK_ORDER } from './queries';
import ShiftsData from '../../data/shitfsWorkOrder.json';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';
//import ShiftsData from '../../data/shitfs.json';
import { parse } from 'path';
import { bool } from 'prop-types';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
import TablePaginationActionsWrapped from '../ui-components/TablePagination';

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

class LifeCycleWorkOrdersTable extends Component {
    _states = {
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

    };

    constructor(props) {
        super(props);
        this.state = {
            openLife: false,
            hotels: [],
            positions: [],
            recruiters: [],
            contacts: [],
            ...this._states
        };
    }

    ReceiveStatus = false;

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.item && !this.state.openLife) {
            this.setState(
                {
                    id: nextProps.item.workOrderId,
                    IdEntity: nextProps.item.IdEntity,
                    date: nextProps.item.date,
                    quantity: nextProps.item.quantity,
                    status: nextProps.item.status,
                    shift: nextProps.item.shift,
                    startDate: nextProps.item.startDate,
                    endDate: nextProps.item.endDate,
                    needExperience: nextProps.item.needExperience,
                    needEnglish: nextProps.item.needEnglish,
                    comment: nextProps.item.comment,
                    userId: localStorage.getItem('LoginId'),
                    openLife: nextProps.openLife
                    //isAdmin: Boolean(localStorage.getItem('IsAdmin'))
                },
                () => {
                    this.getPhaseWork(nextProps.item.workOrderId);
                    this.ReceiveStatus = true;
                }
            );
        } else if (!this.state.openLife) {
            this.setState({
                IdEntity: 0,
                date: new Date().toISOString().substring(0, 10),
                quantity: 0,
                status: 0,
                shift: '',
                startDate: '',
                endDate: '',
                needExperience: false,
                needEnglish: false,
                comment: '',
                PositionRateId: 0,
                contactId: 0,
                userId: localStorage.getItem('LoginId'),
                isAdmin: Boolean(localStorage.getItem('IsAdmin'))
            });
        }
        this.setState({
            openLife: nextProps.openLife
        });
    }

    componentWillMount() {
        this.setState({
            openLife: this.props.openLife

        });
    }

    getPhaseWork = (id) => {
        this.props.client
            .query({
                query: PHASE_WORK_ORDER,
                variables: {
                    WorkOrderId: id,
                }
            })
            .then(({ data }) => {
                this.setState({
                    data: data.phaseworkOrder
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
                <Dialog maxWidth="md" open={this.state.openLife} onClose={this.props.handleCloseModal}>
                    <DialogTitle style={{ padding: '0px' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Work Order No. - {this.state.id} </h5>
                        </div>
                    </DialogTitle>
                    <DialogContent>

                        <Table>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell className={"Table-head"}>Action</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Date</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>User</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    console.log("Inform de la row ", row);
                                    return (
                                        <TableRow>

                                            <CustomTableCell>{row.actions.Name}</CustomTableCell>
                                            <CustomTableCell className={'text-center'}>{new Date(row.createdAt).toISOString().substring(0, 10)}</CustomTableCell>
                                            <CustomTableCell className={'text-center'}>{row.users.Code_User}</CustomTableCell>

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

                        <form action="" onSubmit={this.handleSubmit}>
                            <div className="row pl-0 pr-0">

                                <div className="col-md-12">
                                    <button
                                        className="btn btn-danger ml-1 float-right"
                                        onClick={this.props.handleCloseModal}
                                    >
                                        Close<i class="fas fa-ban ml-2" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div >
        );
    }
}

export default (withMobileDialog()(withApollo(LifeCycleWorkOrdersTable)));
