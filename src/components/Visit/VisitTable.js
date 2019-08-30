import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import withApollo from 'react-apollo/withApollo';

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
        visits: []
    }

    componentWillReceiveProps(nextProps) {
        let visits = nextProps.visits;
        if(visits !== this.state.visits){
            this.setState(() => {
                return {
                    visits: visits
                }
            });
        }
    }

    render() {
        let items = this.state.visits;
        let { handleCloseVisit, handleDisableVisit } = this.props;

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
                        {items.map((row) => {
                            return (
                                <TableRow key={row.id}>
                                    <CustomTableCell>
                                        <Tooltip title="Edit">
                                            <button
                                                type="button"
                                                className="btn btn-success mr-1 float-left"
                                                onClick={() => handleCloseVisit(row.id)}
                                            >
                                                <i className="fas fa-eye"></i>
                                            </button>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <button
                                                type="button"
                                                className="btn btn-danger mr-1 float-left"
                                                onClick={() => handleDisableVisit(row)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </Tooltip>
                                    </CustomTableCell>
                                    <CustomTableCell>{row.BusinessCompany.Code}</CustomTableCell>
                                    <CustomTableCell>{row.BusinessCompany.Name}</CustomTableCell>
                                    <CustomTableCell>{row.startTime}</CustomTableCell>
                                    <CustomTableCell>{row.endTime}</CustomTableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Fragment>
        )
    }
}

export default withApollo(VisitTable);

