import React, { Component, Fragment } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';

import withApollo from 'react-apollo/withApollo';
import { GET_VISITS_BY_OPMANAGER_QUERY } from './Queries';


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

    getVisits = () => {
        let {opManagerId} = this.props;
		this.props.client
			.query({
                query: GET_VISITS_BY_OPMANAGER_QUERY,
                variables: {
                    opManagerId: opManagerId || 0
                },
				fetchPolicy: 'no-cache'
			})
			.then(({ data }) => {
				this.setState({
					visits: data.visits
				});
			})
			.catch(error => {
				console.log(error)
			});
    }

    componentWillMount(){
        this.getVisits();
    }

    render() {
        let items = this.state.visits;
        let { handleCloseVisit } = this.props;
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
                                                className="btn btn-success mr-1 float-left"
                                                onClick={() => handleCloseVisit(row.id)}
                                            >
                                                <i className="fas fa-eye"></i>
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