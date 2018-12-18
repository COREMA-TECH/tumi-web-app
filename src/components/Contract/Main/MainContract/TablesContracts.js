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
import DeleteIcon from '@material-ui/icons/Delete';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import withApollo from 'react-apollo/withApollo';
import EditIcon from '@material-ui/icons/Edit';

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

class DepartmentsTable extends React.Component {
	state = {
		page: 0,
		rowsPerPage: 7,
		loadingRemoving: false
	};
	handleChangePage = (event, page) => {
		this.setState({ page });
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
			this.state.rowsPerPage !== nextState.rowsPerPage //||
			//	this.state.order !== nextState.order ||
			//this.state.orderBy !== nextState.orderBy
		) {
			return true;
		}
		return false;
	}

	render() {
		const { classes } = this.props;
		let items = this.props.data;
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
									<CustomTableCell padding="none" className={"Table-head text-center"} >Actions</CustomTableCell>
									<CustomTableCell className={"Table-head"}>Contract Name</CustomTableCell>
									<CustomTableCell style={{ textAlign: 'center' }} className={"Table-head"}>Contract Owner</CustomTableCell>
									<CustomTableCell style={{ textAlign: 'center' }} className={"Table-head"}>Contract Status</CustomTableCell>
									<CustomTableCell style={{ textAlign: 'center' }} className={"Table-head"}>Contract Expiration Date</CustomTableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
									return (
										<TableRow
											hover
											className={classes.row}
											key={uuidv4()}
											onClick={() => {
												history.push({
													pathname: '/home/contract/add',
													state: { contract: row.Id }
												});
											}}
										>
											<CustomTableCell component="th" style={{ textAlign: 'center', width: '50px' }}>
												<Tooltip title="Edit">
													<div>
														<button
															className="btn btn-danger ml-1 float-left"
															disabled={this.props.loading}
															onClick={() => {
																history.push({
																	pathname: '/home/contract/add',
																	state: { contract: row.Id }
																});
															}}
														>
															<i class="fas fa-pen"></i>
														</button>
													</div>
												</Tooltip>
												<Tooltip title="Delete">
													<div>
														<button
															className="btn btn-success ml-1 float-left"
															disabled={this.props.loading}
															onClick={(e) => {
																//console.log(this.props);
																e.stopPropagation();
																return this.props.delete(row.Id);
															}}
														>
															<i class="fas fa-trash"></i>
														</button>
													</div>
												</Tooltip>
											</CustomTableCell>
											<CustomTableCell>{row.Contract_Name.trim()}</CustomTableCell>
											<CustomTableCell style={{ textAlign: 'center' }}>{row.Contrat_Owner}</CustomTableCell>
											<CustomTableCell style={{ textAlign: 'center', width: '250px' }}>
												{row.Contract_Status == 0 ? 'Draft' : (row.Contract_Status == 1 ? 'Completed' : 'Expired')}
											</CustomTableCell>
											<CustomTableCell style={{ textAlign: 'center', width: '250px' }}>
												{row.Contract_Expiration_Date}
											</CustomTableCell>
										</TableRow>
									);
								})}

								{emptyRows > 0 && (
									<TableRow style={{ height: 48 * emptyRows }}>
										<TableCell colSpan={6} />
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
					</Paper>
				)}
			/>
		);
	}
}

DepartmentsTable.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(DepartmentsTable));
