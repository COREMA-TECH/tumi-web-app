import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';

import React, { Component } from 'react';

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

class BreaksTable extends Component {
    constructor(props) {
        super(props);
    }

    render(){
        return(
            <React.Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell className={"Table-head"} style={{ width: '220px' }} >Name</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ width: '220px' }} >Type</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ width: '220px' }} >Employees</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ width: '220px' }} >Automatic/Manual</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ width: '220px' }} >Active</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <CustomTableCell>Lunch Break</CustomTableCell>
                            <CustomTableCell>Unpaid</CustomTableCell>
                            <CustomTableCell>All employees</CustomTableCell>
                            <CustomTableCell>Manual</CustomTableCell>
                            <CustomTableCell>Active</CustomTableCell>
                        </TableRow>
                        <TableRow>
                            <CustomTableCell>Lunch Break</CustomTableCell>
                            <CustomTableCell>Unpaid</CustomTableCell>
                            <CustomTableCell>All employees</CustomTableCell>
                            <CustomTableCell>Manual</CustomTableCell>
                            <CustomTableCell>Active</CustomTableCell>
                        </TableRow>
                        <TableRow>
                            <CustomTableCell>Lunch Break</CustomTableCell>
                            <CustomTableCell>Unpaid</CustomTableCell>
                            <CustomTableCell>All employees</CustomTableCell>
                            <CustomTableCell>Manual</CustomTableCell>
                            <CustomTableCell>Active</CustomTableCell>
                        </TableRow>
                        <TableRow>
                            <CustomTableCell>Lunch Break</CustomTableCell>
                            <CustomTableCell>Unpaid</CustomTableCell>
                            <CustomTableCell>All employees</CustomTableCell>
                            <CustomTableCell>Manual</CustomTableCell>
                            <CustomTableCell>Active</CustomTableCell>
                        </TableRow>
                    </TableBody>
                </Table>              
            </React.Fragment>
        );
    }
}

export default BreaksTable;