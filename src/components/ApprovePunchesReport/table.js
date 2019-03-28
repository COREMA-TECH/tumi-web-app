import React from 'react';
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
import Route from 'react-router-dom/es/Route';
import TimeCardForm from '../TimeCard/TimeCardForm'
import './index.css';

import Tooltip from '@material-ui/core/Tooltip';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";

import Table_Punches from '../PunchesReport/table';

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


class PunchesReportTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 25,
            //  openModalPicture: true,
            openModal: false
        };
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value });
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.data !== nextProps.data ||
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
            <Route
                render={({ history }) => (
                    <div className="card-body pt-0">
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <CustomTableCell style={{ width: '30px' }} className={"Table-head"}></CustomTableCell>
                                        <CustomTableCell style={{ width: '120px' }} className={"Table-head"}>Employees</CustomTableCell>
                                        <CustomTableCell style={{ width: '50px', textAlign: 'center' }} className={"Table-head"}>Hours Worked</CustomTableCell>
                                        <CustomTableCell style={{ width: '120px' }} className={"Table-head"}></CustomTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        return (

                                            <TableRow
                                                className={classes.row}
                                                key={uuidv4()}
                                            >
                                                <CustomTableCell style={{ width: '30px', textAlign: 'center' }}>
                                                    <Tooltip title="Approve Punches">
                                                        <button
                                                            className="btn btn-success ml-1 float-left"
                                                            disabled={this.props.loading}
                                                            onClick={() => {
                                                                history.push({
                                                                    pathname: '/home/contract/edit',
                                                                    state: { contract: row.Id }
                                                                });
                                                            }}
                                                        >
                                                            <i class="fas fa-check"></i>
                                                        </button>
                                                    </Tooltip>
                                                    <Tooltip title="Reject Punches">
                                                        <button
                                                            className="btn btn-danger ml-1 float-left"
                                                            disabled={this.props.loading}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                return this.props.delete(row.Id);
                                                            }}
                                                        >
                                                            <i class="fas fa-ban"></i>
                                                        </button>
                                                    </Tooltip>
                                                </CustomTableCell>
                                                <CustomTableCell style={{ width: '120px' }}>{row.name}</CustomTableCell>
                                                <CustomTableCell style={{ width: '50px', textAlign: 'center' }}>{row.hoursWorked}
                                                    <Tooltip title="View Details">
                                                        <button
                                                            className="btn btn-success ml-1 float-right"
                                                            disabled={this.props.loading}
                                                            onClick={(e) => {
                                                                //e.stopPropagation();
                                                                this.setState({ openModal: true });
                                                                alert("this.state.openModal " + this.state.openModal)
                                                            }}
                                                        >
                                                            <i class="fas fa-info"></i>
                                                        </button>
                                                    </Tooltip>
                                                </CustomTableCell>
                                                <CustomTableCell style={{ width: '120' }}> </CustomTableCell>
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

                        <div className="row">
                            <div className="col-md-12">
                                <TimeCardForm
                                    openModal={this.state.openModal}
                                    handleOpenSnackbar={this.props.handleOpenSnackbar}
                                    onEditHandler={this.onEditHandler}
                                    toggleRefresh={this.toggleRefresh}
                                    handleCloseModal={this.handleCloseModal}
                                />
                            </div>
                        </div>

                        <Dialog maxWidth="md" open={this.state.openLife} onClose={this.props.handleCloseModal}>
                            <DialogTitle style={{ padding: '0px' }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Details punches</h5>
                                </div>
                            </DialogTitle>
                            <DialogContent>
                                <Table_Punches
                                    openModal={this.state.openModal}
                                    openModalPicture={this.handleClickOpenModalPicture}
                                    closeModalPicture={this.handleCloseModalPicture}
                                    handleCloseModal={this.handleCloseModal}
                                    data={this.props.data} />
                            </DialogContent>
                        </Dialog>

                    </div>


                )}
            />
        );
    }
}

PunchesReportTable.propTypes = {
    classes: PropTypes.object.isRequired
};


export default withStyles(styles)(PunchesReportTable);