import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActions from './TablePaginationActions';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import PropTypes from 'prop-types';
const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

class TableNoShowReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 10
        };
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value });
    };

    getTableData = () => {
        let { data } = this.props;
        let { page, rowsPerPage } = this.state;

        return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(_ => (
            <TableRow>
                <CustomTableCell>{`${_.application.firstName} ${_.application.lastName}`}</CustomTableCell>
                <CustomTableCell>{_.application.cellPhone}</CustomTableCell>
                <CustomTableCell>{`${_.application.cityInfo ? _.application.cityInfo.Description : ''},${_.application.stateInfo ? _.application.stateInfo.Description : ''}`}</CustomTableCell>
                <CustomTableCell>{_.application.idealJobs ? _.application.idealJobs.map(_job => _job.description).toString() : ''}</CustomTableCell>
                <CustomTableCell className={"text-center"}>{_.application.car ? 'Yes' : 'No'}</CustomTableCell>
                <CustomTableCell className={"text-center"}>{_.application.idWorkOrder || 'Open'}</CustomTableCell>
                <CustomTableCell>{_.application.position ? _.application.position.position.Position : 'Open'}</CustomTableCell>
                <CustomTableCell>{_.application.position ? _.application.position.BusinessCompany.Name : 'n/a'}</CustomTableCell>
                <CustomTableCell>{_.application.position ? _.application.position.position.department.Description : 'n/a'}</CustomTableCell>
                <CustomTableCell className={"text-center"}> {moment.utc(_.createdAt).format("MM/DD/YYYY")}</CustomTableCell>
            </TableRow>
        ))
    }

    render() {
        let { rowsPerPage, page } = this.state;
        let { data } = this.props;

        return (
            <React.Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell className={"Table-head"} style={{ width: '150px' }}  >Laed Name </CustomTableCell>
                            <CustomTableCell className={"Table-head"}  >Phone Number</CustomTableCell>
                            <CustomTableCell className={"Table-head"}  >City/State</CustomTableCell>
                            <CustomTableCell className={"Table-head"}  >Willing to Work As</CustomTableCell>
                            <CustomTableCell className={"Table-head text-center"}  >Transportation</CustomTableCell>
                            <CustomTableCell className={"Table-head text-center"}  >Work Order #</CustomTableCell>
                            <CustomTableCell className={"Table-head"}  >Position</CustomTableCell>
                            <CustomTableCell className={"Table-head"}  >Hotel</CustomTableCell>
                            <CustomTableCell className={"Table-head"}  >Department</CustomTableCell>
                            <CustomTableCell className={"Table-head text-center"}  >Sent to Interview Date</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.getTableData()}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            {data.length ? <TablePagination
                                colSpan={5}
                                count={data.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    native: true,
                                }}
                                onChangePage={this.handleChangePage}
                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                ActionsComponent={TablePaginationActions}
                            /> : <React.Fragment />}
                        </TableRow>
                    </TableFooter>
                </Table>
            </React.Fragment>
        );
    }
}

TableNoShowReport.propTypes = {
    data: PropTypes.object.isRequired
};


export default TableNoShowReport;