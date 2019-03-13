import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
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
        const {classes, count, page, rowsPerPage, theme} = this.props;

        return (
            <div className={classes.root}>
                <IconButton onClick={this.handleFirstPageButtonClick} disabled={page === 0} aria-label="First Page">
                    {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
                </IconButton>
                <IconButton onClick={this.handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
                    {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                </IconButton>
                <IconButton
                    onClick={this.handleNextButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Next Page"
                >
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                </IconButton>
                <IconButton
                    onClick={this.handleLastPageButtonClick}
                    disabled={page >= Math.ceil(count / rowsPerPage) - 1}
                    aria-label="Last Page"
                >
                    {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
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

const TablePaginationActionsWrapped = withStyles(actionsStyles, {withTheme: true})(TablePaginationActions);

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
            openModalPicture: true
        };
    }

    handleChangePage = (event, page) => {
        this.setState({page});
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({rowsPerPage: event.target.value});
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

    handleClickOpenModal = () => {
        this.setState({openModalPicture: true});
    };

    handleCloseModal = () => {
        alert("Error");
        this.setState({openModalPicture: false});
    };



    render() {
        const {classes} = this.props;
        let items = this.props.data || [];
        const {rowsPerPage, page} = this.state;

        let renderDialogPicture = () => (
            <Dialog maxWidth="md" open={this.state.openModalPicture} onClose={this.handleCloseModal}>
                {/*<DialogTitle style={{ width: '800px', height: '800px'}}>*/}
                    <img src="https://i.imgur.com/VJRRwvC.jpg" className="avatar-lg" />
                {/*</DialogTitle>*/}
            </Dialog>
        );


        return (
            <Route
                render={({history}) => (
                    <div className="card-body pt-0">
                        {
                            renderDialogPicture()
                        }
                        <Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <CustomTableCell className={"Table-head"}>Employee Id</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Name</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Hour Category</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Hours Worked</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Pay Rate</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Date</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Clock In</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Lunch In</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Lunch Out</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Clock Out</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Hotel Code</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Position Code</CustomTableCell>
                                        <CustomTableCell className={"Table-head"}>Avatar</CustomTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                        return (

                                            <TableRow
                                                className={classes.row}
                                                key={uuidv4()}
                                                onClick={() => {
                                                    //   e.stopPropagation();
                                                    //                                                    alert("Aqui estoy")
                                                    //this.handleClickOpenModal();
                                                }}>
                                                <CustomTableCell>{row.employeeId}</CustomTableCell>
                                                <CustomTableCell>{row.name}</CustomTableCell>
                                                <CustomTableCell>{row.hourCategory}</CustomTableCell>
                                                <CustomTableCell>{row.hoursWorked}</CustomTableCell>
                                                <CustomTableCell>{row.payRate}</CustomTableCell>
                                                <CustomTableCell>{row.date}</CustomTableCell>
                                                <CustomTableCell>{row.clockIn || ''}</CustomTableCell>
                                                <CustomTableCell>{row.lunchIn || ''}</CustomTableCell>
                                                <CustomTableCell>{row.lunchOut || ''}</CustomTableCell>
                                                <CustomTableCell>{row.clockOut || ''}</CustomTableCell>
                                                <CustomTableCell>{row.hotelCode}</CustomTableCell>
                                                <CustomTableCell>{row.positionCode}</CustomTableCell>
                                                <CustomTableCell style={{position: 'relative'}}>
                                                    <img className="avatar" src={row.imageMarked} onClick={() => {
                                                        alert("Alert!");
                                                        this.setState({
                                                            openModalPicture: true
                                                        }, ()  => {
                                                            console.log(this.state.openModalPicture)
                                                        })
                                                    }} />
                                                </CustomTableCell>
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