import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableFooter from '@material-ui/core/TableFooter/TableFooter';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import Paper from '@material-ui/core/Paper/Paper';
import moment from 'moment';

const uuidv4 = require('uuid/v4');
const actionsStyles = (theme) => ({
    root: {
        flexShrink: 0,
        color: theme.palette.text.secondary,
        marginLeft: theme.spacing.unit * 2.5
    },
    paddingDefault: {
        padding: '40px 24px 40px 16px'
    }
});

class TablePaginationActions extends React.Component {
    handleFirstPageButtonClick = (event) => {
        this.props.onChangePage(event, 0);
    };

    handleBackButtonClick = (event) => {
        this.props.onChangePage(event, this.props.page - 1);
    };

    handleNextButtonClick = (event) => {
        this.props.onChangePage(event, this.props.page + 1);
    };

    handleLastPageButtonClick = (event) => {
        this.props.onChangePage(event, Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1));
    };

    render() {
        const { classes, count, page, rowsPerPage, theme } = this.props;

        return (
            <div className={classes.root}>
                <IconButton onClick={this.handleFirstPageButtonClick} disabled={page === 0} aria-label="First Page">
                    {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
                </IconButton>
                <IconButton onClick={this.handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
                    {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
                </IconButton>
            </div>
        );
    }
}

TablePaginationActions.propTypes = {
    classes: PropTypes.object.isRequired,
    count: PropTypes.number.isRequired,
    onChangePage: PropTypes.func.isRequired,
    page: PropTypes.number.isRequired,
    rowsPerPage: PropTypes.number.isRequired,
    theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(TablePaginationActions);

let counter = 0;

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const styles = (theme) => ({
    root: {
        width: '100%',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto'
    },
    table: {
        minWidth: 500
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        },
        '&:hover': {
            cursor: 'pointer'
        }
    },
    fab: {
        margin: theme.spacing.unit * 2
    },
    absolute: {
        position: 'absolute',
        bottom: theme.spacing.unit * 2,
        right: theme.spacing.unit * 3
    },
    th: {
        backgroundColor: '#3da2c7'
    }
});


class RecruiterReportTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 25
        };
    }
    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value });
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.data.join() !== nextProps.data.join() ||
            this.props.loading !== nextProps.loading) {
            return true;
        }
        if (
            this.state.page !== nextState.page ||
            this.state.rowsPerPage !== nextState.rowsPerPage
        ) {
            return true;
        }
        return false;
    }

    render() {
        const { classes } = this.props;
        let items = this.props.data || [];
        const { rowsPerPage, page } = this.state;

        return (
            <div className="card-body pt-0">
                <Paper className={classes.root}>
                    <Table className={classes.table}>
                        <TableHead>
                            <TableRow>
                                <CustomTableCell className={"Table-head"}>Full Name</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Phone Number</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>City</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Position Applying For</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Work Order</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Hotel</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Date Recruited</CustomTableCell>
                                <CustomTableCell className={"Table-head text-center"}>Transportation</CustomTableCell>
                                <CustomTableCell className={"Table-head"}>Comments</CustomTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                return (
                                    <TableRow
                                        className={classes.row}
                                        key={uuidv4()}
                                    >
                                        <CustomTableCell>{row.firstName + ' ' + row.lastName}</CustomTableCell>
                                        <CustomTableCell>{row.cellPhone}</CustomTableCell>
                                        <CustomTableCell>{row.cityInfo ? row.cityInfo.DisplayLabel : ''}</CustomTableCell>
                                        <CustomTableCell>{row.position ? row.position.position.Position.trim() + '(' + row.position.BusinessCompany.Code.trim() + ')' : 'Open Position'}</CustomTableCell>
                                        <CustomTableCell>{row.idWorkOrder ? `000000${row.idWorkOrder}`.slice(-6) : ''}</CustomTableCell>
                                        <CustomTableCell>{row.position ? row.position.BusinessCompany.Name : ''}</CustomTableCell>
                                        <CustomTableCell>{moment(row.createdAt).format('MM/DD/YYYY')}</CustomTableCell>
                                        <CustomTableCell className={"text-center"} >{row.car ? 'Yes' : 'No'}</CustomTableCell>
                                        <CustomTableCell>{row.comment}</CustomTableCell>
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

RecruiterReportTable.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(RecruiterReportTable);