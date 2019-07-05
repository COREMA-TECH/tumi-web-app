import React, { Component } from 'react'
import { GET_PROPERTIES_QUERY, GET_EMPLOYEEES_BY_PROPERTIES } from './queries';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import PropTypes from 'prop-types';
import withApollo from 'react-apollo/withApollo';
import TablePagination from '@material-ui/core/TablePagination';

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

class TableConsolidated extends Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 25,
            employeesByProperties: []
        };
    }

    getEmployeesByProperties = () => {
        this.props.client.query({
            query: GET_EMPLOYEEES_BY_PROPERTIES,
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState(prevState => ({
                employeesByProperties: data.employeesByProperties
            }), _ => {
                this.setState(prevState => ({loading: false}))
            });

        }).catch(error => {
            this.setState(() => ({ loadingProperties: false }));
        });
    }

    componentWillMount() {
        this.getEmployeesByProperties();
	}

    render() {
        let items = this.state.employeesByProperties;
        const { rowsPerPage, page } = this.state;
        return(
            <React.Fragment>
                <div className="card">
                    <div className="card-body">
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell className={"Table-head"}>Code</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Property Name</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Operation Manager</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Last Visited</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Associates</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Avg Hours</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Management</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Ops Manager</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow>
                                            <CustomTableCell>{row.code}</CustomTableCell>
                                            <CustomTableCell>{row.name}</CustomTableCell>
                                            <CustomTableCell>{row.count_department}</CustomTableCell>
                                            <CustomTableCell>{row.count_associate}</CustomTableCell>
                                            <CustomTableCell>--</CustomTableCell>
                                            <CustomTableCell>--</CustomTableCell>
                                            <CustomTableCell>{row.management_company}</CustomTableCell>
                                            <CustomTableCell>{row.operationManager === "null null" ? "No Name" : row.operationManager}</CustomTableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>

                                {items.length > 0 && (
                                    <TablePagination
                                        colSpan={1}
                                        count={items.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    />
                                )}

                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default withApollo(TableConsolidated);