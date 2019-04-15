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
import { GET_REGION_QUERY } from './queries';
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

class RegionTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 7,
            loadingRemoving: false,
            regions: [],
            openConfirm: false,
            idToDelete: 0,
            loadingConfirm: false,
            showCircularLoading: false
        };
    }

    getRegions = () => {
        this.props.client
            .query({
                query: GET_REGION_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                console.log("Informacion de las regiones ", data)
                this.setState({
                    regions: data.getcatalogitem

                });
            })
            .catch();
    };
    componentWillReceiveProps(nextProps) {
        console.log("Entro al componentWillReceiveProps del table")

        this.getRegions();
    }
    componentWillMount() {
        console.log("Entro al componentWillMount del table")
        this.getRegions();
    }

    handleChangePage = (event, page) => {
        this.setState({ page });
    };

    handleChangeRowsPerPage = (event) => {
        this.setState({ rowsPerPage: event.target.value });
    };

    handleDelete = (id) => {
        this.props.client
            .mutate({
                mutation: DELETE_CATALOG_ITEM_QUERY,
                variables: {
                    Id: id
                }
            })
            .then((data) => {
                this.setState({ openConfirm: false, removing: false });
                this.props.toggleRefresh();
                this.props.handleOpenSnackbar('success', 'Region was deleted!');
            })
            .catch((error) => {
                this.setState({ removing: false })
                this.props.handleOpenSnackbar('error', 'Error: Deleting region: ' + error);
            });
    };

    render() {
        const { classes } = this.props;
        //  let items = this.props.dataRegions;
        let items = this.state.regions;
        const { rowsPerPage, page } = this.state;
        const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

        if (this.state.loadingRemoving) {
            return <LinearProgress />;
        }

        return (
            <Route
                render={({ history }) => (
                    <Paper className={classes.root}>
                        <Table className={classes.table}>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell padding="none" className={"Table-head"}>Actions</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Region's Code</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Region's Name</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow
                                            hover
                                            className={classes.row}
                                            key={uuidv4()}
                                        >
                                            <CustomTableCell>
                                                <Tooltip title="Edit">
                                                    <button
                                                        className="btn btn-success float-left ml-1"
                                                        disabled={this.props.loading}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            this.props.onEditHandler({ ...row });
                                                        }}
                                                    >
                                                        <i class="fas fa-pen"></i>
                                                    </button>
                                                </Tooltip>

                                                <Tooltip title="Delete">
                                                    <button
                                                        className="btn btn-danger float-left ml-1"
                                                        disabled={this.props.loading}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.setState({ openConfirm: true, idToDelete: row.Id });
                                                        }}
                                                    >
                                                        <i class="fas fa-trash"></i>
                                                    </button>
                                                </Tooltip>
                                            </CustomTableCell>
                                            <CustomTableCell>{row.Name}</CustomTableCell>
                                            <CustomTableCell>{row.DisplayLabel}</CustomTableCell>
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
                        <ConfirmDialog
                            open={this.state.openConfirm}
                            closeAction={() => {
                                this.setState({ openConfirm: false });
                            }}
                            confirmAction={() => {
                                this.handleDelete(this.state.idToDelete);
                            }}
                            title={'are you sure you want to cancel this record?'}
                            loading={this.state.removing}
                        />
                    </Paper>
                )}
            />
        );
    }
}

RegionTable.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(RegionTable));
