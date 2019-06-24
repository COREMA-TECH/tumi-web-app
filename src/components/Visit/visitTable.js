import React, { Component, Fragment } from 'react';

class VisitTable extends Component{
    render() {
        return (
            <Paper style={{ overflowX: 'auto' }}>
                <Table>
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
                                <TableRow>
                                    <CustomTableCell>
                                        <Tooltip title="View">
                                            <button
                                                className="btn btn-success mr-1 float-left"
                                                disabled={this.props.loading}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    return this.props.onEditHandler({ ...row });
                                                }}
                                            >
                                                <i className="fas fa-pen" />
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Reject Opening">
                                            <button
                                                className="btn btn-danger float-left"
                                                disabled={this.props.loading}
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    this.setState({ openConfirm: true, idToDelete: row.id });
                                                }}
                                            >
                                                <i class="fas fa-eject" />
                                            </button>
                                        </Tooltip>
                                    </CustomTableCell>
                                    <CustomTableCell>{row.Id}</CustomTableCell>
                                    <CustomTableCell>{row.Code_User}</CustomTableCell>
                                    <CustomTableCell>{row.Full_Name}</CustomTableCell>
                                    <CustomTableCell>{row.quantity}</CustomTableCell>
                                    <CustomTableCell>
                                        {ShiftsData.map((shift) => (shift.Id == row.shift ? shift.Name : ''))}
                                    </CustomTableCell>
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
                <ConfirmDialog
                    open={this.state.openConfirm}
                    closeAction={() => {
                        this.setState({ openConfirm: false });
                    }}
                    confirmAction={() => {
                        this.handleDelete(this.state.idToDelete);
                    }}
                    title={'are you sure you want to reject this opening?'}
                    loading={this.state.removing}
                />
            </Paper>
        )
    }
}

export default VisitTable;