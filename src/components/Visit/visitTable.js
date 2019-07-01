import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
//import TableFooter from '@material-ui/core/TableFooter';
//import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';
import ConfirmDialog from 'material-ui/ConfirmDialog';


//import withApollo from 'react-apollo/withApollo';


const CustomTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white
	},
	body: {
		fontSize: 14
	}
}))(TableCell);

class VisitTable extends Component{

    state = {
        //data: [],
        page: 0,
        rowsPerPage: 100, //this.props.rowsPerPage || 25,
        openConfirm: false
    }

    render() {
        let items = this.props.data;
		const { rowsPerPage, page } = this.state;
        return (
            <Fragment>
                <Table classes={{}}>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell className={"Table-head text-center"}>Actions</CustomTableCell>
                            <CustomTableCell className={"Table-head"}>Code</CustomTableCell>
                            <CustomTableCell className={"Table-head"}>Name</CustomTableCell>
                            <CustomTableCell className={'Table-head'}>Start Time</CustomTableCell>
                            <CustomTableCell className={'Table-head'}>End Time</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                            return (
                                <TableRow key={row.Id}>
                                    <CustomTableCell>
                                        <Tooltip title="Edit">
                                            <button
                                                className="btn btn-success mr-1 float-left"
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                        </Tooltip>
                                    </CustomTableCell>
                                    <CustomTableCell>{row.Code}</CustomTableCell>
                                    <CustomTableCell>{row.Name}</CustomTableCell>
                                    <CustomTableCell>0</CustomTableCell>
                                    <CustomTableCell>0</CustomTableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                    {/* <TableFooter>
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
                    </TableFooter> */}
                </Table>
                <ConfirmDialog
                    open={this.state.openConfirm}
                    closeAction={() => {
                        this.setState({ openConfirm: false });
                    }}
                    // confirmAction={() => {
                    //     this.handleDelete(this.state.idToDelete);
                    // }}
                    title={'are you sure you want to reject this opening?'}
                    //loading={this.state.removing}
                />
            </Fragment>
        )
    }
}

export default VisitTable;