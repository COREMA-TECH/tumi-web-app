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
import Tooltip from '@material-ui/core/Tooltip/Tooltip';
import TableFooter from '@material-ui/core/TableFooter/TableFooter';
import TablePagination from '@material-ui/core/TablePagination/TablePagination';
import Paper from '@material-ui/core/Paper/Paper';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import withApollo from 'react-apollo/withApollo';
import { GET_TRANSACTION_LOGS } from './queries';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import { DELETE_CATALOG_ITEM_QUERY } from './mutations';

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

let id = 0;

class TransactionTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 15,
            loadingRemoving: false,
            transactions: [],
            openConfirm: false,
            idToDelete: 0,
            loadingConfirm: false,
            showCircularLoading: false
        };
    }

    getTransactions = () => {
        this.setState({
            loadingRemoving: true
        });
        this.props.client
            .query({
                query: GET_TRANSACTION_LOGS,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    transactions: data.transactionLogs
                });
                this.setState(() => ({ loadingRemoving: false }));
            })
            .catch(error => {
                this.setState(() => ({ loadingRemoving: false }));
            });
    };
    componentWillReceiveProps(nextProps) {
        console.log("Entro al componentWillReceiveProps del table")

        this.getTransactions();
    }
    componentWillMount() {
        console.log("Entro al componentWillMount del table")
        this.getTransactions();
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value });
    };

    

    render() {
        const { classes } = this.props;
     
        //let items = this.state.transactions;
        let items = this.props.data;
        const { rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

        if (this.state.loadingRemoving) {
            return <LinearProgress />;
        }

        return (
            <Route
                render={({ history }) => (
                    <div className="card-body p-3 tumi-forcedResponsiveTable">            
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell className={"Table-head"} style={{ width: '150px' }}>User Name</CustomTableCell>
                                    <CustomTableCell className={"Table-head"} style={{ width: '150px' }}>Date of change</CustomTableCell>
                                    <CustomTableCell className={"Table-head"} style={{ width: '150px' }}>Time of change</CustomTableCell>
                                    <CustomTableCell className={"Table-head"} style={{ width: '150px' }}>Affected object</CustomTableCell>
                                    <CustomTableCell className={"Table-head"} style={{ width: '150px' }}>Action</CustomTableCell>
                                    <CustomTableCell className={"Table-head"} style={{ width: '150px' }}>Description</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            className={classes.row}
                                            key={uuidv4()}>
                                            
                                            <CustomTableCell>{row.nameUser}</CustomTableCell>
                                            <CustomTableCell>{row.actionDate.substring(0, 10)}</CustomTableCell>
                                            <CustomTableCell>{row.actionDate.substring(11, 19)}</CustomTableCell>
                                            <CustomTableCell>{row.affectedObject}</CustomTableCell>
                                            <CustomTableCell>{row.action}</CustomTableCell>
                                            <CustomTableCell>{row.affectedObject} {row.action.replace('ROW','')}</CustomTableCell>
                                        </TableRow>
                                    );
                                })}

                                {emptyRows > 0 && (
                                    <TableRow style={{ height: 48 * emptyRows }}>
                                        <TableCell colSpan={7} />
                                    </TableRow>
                                )}
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
                      
                 
                    </div>
                )}
            />
        );
    }
}

Table.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(TransactionTable));
