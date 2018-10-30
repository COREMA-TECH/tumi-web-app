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
import { GET_WORKORDERS_QUERY } from './queries';
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

class WorkOrdersTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            rowsPerPage: 10,
            page: 0

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
    }

    render() {
        let items = this.state.data;
        const { rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

        return (
            <div>
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell className={"Table-head"}></CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Position</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Quantity</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Shift</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Need Experience?</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Need to Speak English?</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                console.log(row);
                                return (
                                    <TableRow>
                                        <CustomTableCell>
                                            <Tooltip title="Edit">
                                                <button
                                                    className="btn btn-success mr-1 float-left"
                                                    disabled={this.props.loading}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        return this.props.onEditHandler({});
                                                    }}
                                                >
                                                    <i class="fas fa-pen"></i>
                                                </button>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <button
                                                    className="btn btn-danger float-left"
                                                    disabled={this.props.loading}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        return this.props.onDeleteHandler();
                                                    }}
                                                >
                                                    <i class="fas fa-trash"></i>
                                                </button>
                                            </Tooltip>
                                        </CustomTableCell>
                                        <CustomTableCell>Position</CustomTableCell>
                                        <CustomTableCell>{row.quantity}</CustomTableCell>
                                        <CustomTableCell>{row.shift}</CustomTableCell>
                                        <CustomTableCell>{row.needExperience == false ? 'No' : 'Yes'}</CustomTableCell>
                                        <CustomTableCell>{row.needEnglish == false ? 'No' : 'Yes'}</CustomTableCell>
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
                </Paper>
            </div>
        );
    }

}

export default withStyles()(withApollo(WorkOrdersTable));