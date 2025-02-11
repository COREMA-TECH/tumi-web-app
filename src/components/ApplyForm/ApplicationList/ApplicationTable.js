import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Route from 'react-router-dom/es/Route';
import Table from '@material-ui/core/Table/Table';
import TableHead from '@material-ui/core/TableHead/TableHead';
import TableRow from '@material-ui/core/TableRow/TableRow';
import TableBody from '@material-ui/core/TableBody/TableBody';
import TableFooter from '@material-ui/core/TableFooter/TableFooter';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import withApollo from 'react-apollo/withApollo';
import Tooltip from '@material-ui/core/Tooltip';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import ProfilePreview from "../Application/ProfilePreview/ProfilePreview"; //"./ProfilePreview/ProfilePreview";
import UserFormModal from '../../ui-components/UserForm/UserApplicationForm';

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

function createData(name, calories, fat) {
    counter += 1;
    return { id: counter, name, calories, fat };
}

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
            backgroundColor: '#fff'
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

let id = 0;

class ApplicationTable extends React.Component {
    state = {
        page: 0,
        rowsPerPage: 25,
        completed: false,
        openModal: false,
        ApplicationId: 0,
        openUserModal: false,
        application: null
    };
    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleClose = () => {
        this.setState({ openModal: false });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value });
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.data !== nextProps.data || this.props.loading !== nextProps.loading) {
            return true;
        }
        if (
            this.state.page !== nextState.page ||
            this.state.rowsPerPage !== nextState.rowsPerPage ||
            this.state.openModal !== nextState.openModal ||
            this.state.openUserModal !== nextState.openUserModal ||
            this.state.ApplicationId !== nextState.ApplicationId
            //this.state.orderBy !== nextState.orderBy
        ) {
            return true;
        }
        return false;
    };

    /**
    * To hide modal and then restart modal state values
    */
    handleCloseModal = () => {
        this.setState(() => ({ openUserModal: false, application: null }), this.props.getApplications);
    };

    /**
         * To open modal updating the state
         */
    handleClickOpenModal = (row) => {
        this.setState(() => ({ openUserModal: true, application: row }));
    };

    render() {
        const { classes } = this.props;
        let items = this.props.data;
        const { rowsPerPage, page } = this.state;

        if (this.state.loadingRemoving) {
            return <LinearProgress />;
        }
        console.log({ items });
        return (

            <Route
                render={({ history }) => (
                    <div className="card-body p-3 tumi-forcedResponsiveTable">
                        <UserFormModal handleCloseModal={this.handleCloseModal} openModal={this.state.openUserModal} application={this.state.application} />
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell className={"Table-head"} style={{ width: '150px' }}>Actions</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Full Name</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Email Address</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Work Order</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Position Applying For</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Hotel</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Recruited By</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Sent to Interview By</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Completed</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    let hasUser = row.Employee ? true : false;
                                    return (
                                        <TableRow
                                            hover
                                            className={classes.row}
                                            key={uuidv4()}
                                            onClick={() => {
                                                history.push({
                                                    pathname: '/home/application/info',
                                                    state: { ApplicationId: row.id }
                                                });
                                            }}
                                        >
                                            <CustomTableCell className={'text-center'} style={{ width: '80px' }}>
                                                <Tooltip title="Delete">
                                                    <button
                                                        className="btn btn-danger mr-1 float-left"
                                                        disabled={this.props.loading}
                                                        onClick={(e) => {
                                                            e.stopPropagation();

                                                            return this.props.onDeleteHandler(row.id);
                                                        }}
                                                    >
                                                        <i className="fas fa-trash"></i>
                                                    </button>
                                                </Tooltip>
                                                <Tooltip title="Profile">
                                                    <button
                                                        className="btn btn-success mr-1 float-left"
                                                        disabled={this.props.loading}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            this.setState(() => ({ openModal: true, ApplicationId: row.id }));

                                                        }}
                                                    >
                                                        <i class="fas fa-info"></i>
                                                    </button>
                                                </Tooltip>
                                                {
                                                    !hasUser ?
                                                        <Tooltip title="User">
                                                            <button
                                                                className="btn btn-outline-info float-left ml-1"
                                                                disabled={this.props.loading}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    this.handleClickOpenModal({ ...row });
                                                                }}
                                                            >
                                                                <i className="fas fa-plus"></i>
                                                            </button>
                                                        </Tooltip> :
                                                        <React.Fragment />
                                                }
                                            </CustomTableCell>
                                            <CustomTableCell>{row.firstName + ' ' + row.lastName}</CustomTableCell>
                                            <CustomTableCell>{row.emailAddress}</CustomTableCell>
                                            <CustomTableCell>{row.workOrderId ? `000000${row.workOrderId}`.slice(-6) : ''}</CustomTableCell>
                                            <CustomTableCell>{row.Position ? `${row.Position.Position.trim()} ${row.PositionCompany ? `(${row.PositionCompany.Code.trim()})` : ''}` : 'Open Position'}</CustomTableCell>
                                            <CustomTableCell>{row.DefaultCompany ? row.DefaultCompany.Name : ''}</CustomTableCell>
                                            <CustomTableCell>{row.Recruiter ? row.Recruiter.Full_Name : ''}</CustomTableCell>
                                            <CustomTableCell>{row.User && row.sendInterview ? row.User.Full_Name : ''}</CustomTableCell>
                                            <CustomTableCell>{row.statusCompleted === true ? "YES" : "NO"}</CustomTableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    {items.length > 0 && (
                                        <TablePagination
                                            colSpan={1}
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

                        <Dialog fullWidth maxWidth="xl" open={this.state.openModal} onClose={this.handleClose}>
                            <DialogTitle style={{ padding: '0px' }}>
                                <div className="modal-header">
                                    <h5 className="modal-title">Profile Preview</h5>
                                </div>
                            </DialogTitle>
                            <DialogContent>
                                <ProfilePreview applicationId={this.state.ApplicationId} />;

                                <div className="row pl-0 pr-0">
                                    <div className="col-md-12">
                                        <button
                                            className="btn btn-danger ml-1 float-right"
                                            onClick={(e) => {
                                                this.setState(() => ({ openModal: false, IdEmployee: 0 }));
                                            }}
                                        >
                                            Close<i class="fas fa-ban ml-2" />
                                        </button>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}


            />
        );
    }
}

ApplicationTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(ApplicationTable));