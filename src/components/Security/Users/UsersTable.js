import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import TablePagination from '@material-ui/core/TablePagination';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TableFooter from '@material-ui/core/TableFooter';

import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import classNames from 'classnames';
import Select from '@material-ui/core/Select';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import CircularProgress from '@material-ui/core/CircularProgress';

//let counter = 0;
function createData(name, calories, fat, carbs, protein) {
	counter += 1;
	return { id: counter, name, calories, fat, carbs, protein };
}

function desc(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getSorting(order, orderBy) {
	return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
	{ id: 'Delete', numeric: false, disablePadding: true, label: 'Actions' },	
	{ id: 'Code_User', numeric: false, disablePadding: false, label: 'User Name' },
	{ id: 'firstName', numeric: false, disablePadding: false, label: 'First Name' },
	{ id: 'lastName', numeric: false, disablePadding: false, label: 'Last Name' },
	//{ id: 'Full_Name', numeric: false, disablePadding: false, label: 'Full Name' },
	{ id: 'Electronic_Address', numeric: false, disablePadding: false, label: 'Email' },
	{ id: 'Phone_Number', numeric: false, disablePadding: false, label: 'Phone Number' },
	{ id: 'Id_Roles', numeric: false, disablePadding: false, label: 'Role' },
	{ id: 'Id_language', numeric: false, disablePadding: false, label: 'Language' }
];

class EnhancedTableHead extends React.Component {
	createSortHandler = (property) => (event) => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

		return (
			<TableHead style={{ backgroundColor: 'black' }}>
				<TableRow>
					{rows.map((row) => {
						if (row.id == 'Edit' || row.id == 'Delete') {
							return (
								<TableCell
									key={row.id}
									numeric={row.numeric}
									sortDirection={orderBy === row.id ? order : false}
									style={{ backgroundColor: '#3da2c7' }}
									className={'Table-head'}
								>
									{row.label}
								</TableCell>
							);
						} else if (
							row.id == 'IsAdmin' ||
							row.id == 'AllowEdit' ||
							row.id == 'AllowInsert' ||
							row.id == 'AllowDelete' ||
							row.id == 'AllowExport'
						) {
							return (
								<TableCell
									key={row.id}
									numeric={row.numeric}
									sortDirection={orderBy === row.id ? order : false}
									padding="checkbox"
									style={{ backgroundColor: '#3da2c7', color: 'white' }}
									className={'Table-head'}
								>
									{row.label}
								</TableCell>
							);
						}
						return (
							<TableCell
								style={{ color: 'white' }}
								key={row.id}
								numeric={row.numeric}
								padding={row.disablePadding ? 'none' : 'default'}
								sortDirection={orderBy === row.id ? order : false}
								style={{ backgroundColor: '#3da2c7' }}
								className={'Table-head'}
							>
								<Tooltip
									title="Sort"
									placement={row.numeric ? 'bottom-end' : 'bottom-start'}
									enterDelay={300}
								>
									<TableSortLabel
										style={{ color: 'white' }}
										active={orderBy === row.id}
										direction={order}
										onClick={this.createSortHandler(row.id)}
										className={'Table-head'}
									>
										{row.label}
									</TableSortLabel>
								</Tooltip>
							</TableCell>
						);
					}, this)}
				</TableRow>
			</TableHead>
		);
	}
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	//onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.string.isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number.isRequired
};

const toolbarStyles = (theme) => ({
	root: {
		paddingRight: theme.spacing.unit
	},
	highlight:
		theme.palette.type === 'light'
			? {
				color: theme.palette.secondary.main,
				backgroundColor: lighten(theme.palette.secondary.light, 0.85)
			}
			: {
				color: theme.palette.text.primary,
				backgroundColor: theme.palette.secondary.dark
			},
	spacer: {
		flex: '1 1 100%'
	},
	actions: {
		color: theme.palette.text.secondary
	},
	title: {
		flex: '0 0 auto'
	}
});

let EnhancedTableToolbar = (props) => {
	const { numSelected, classes } = props;

	return (
		<Toolbar
			className={classNames(classes.root, {
				[classes.highlight]: numSelected > 0
			})}
		>
			<div className={classes.title}>
				{numSelected > 0 ? (
					<Typography color="inherit" variant="subheading">
						{numSelected} selected
					</Typography>
				) : (
						<Typography variant="title" id="tableTitle">
							Nutrition
					</Typography>
					)}
			</div>
			<div className={classes.spacer} />
			<div className={classes.actions}>
				{numSelected > 0 ? (
					<Tooltip title="Delete">
						<IconButton aria-label="Delete">
							<DeleteIcon />
						</IconButton>
					</Tooltip>
				) : (
						<Tooltip title="Filter list">
							<IconButton aria-label="Filter list">
								<FilterListIcon />
							</IconButton>
						</Tooltip>
					)}
			</div>
		</Toolbar>
	);
};

EnhancedTableToolbar.propTypes = {
	classes: PropTypes.object.isRequired,
	numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

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
		width: '100vw',
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

class UsersTable extends React.Component {
	state = {
		page: 0,
		rowsPerPage: 25,
		order: 'asc',
		orderBy: 'calories',
		selected: [],
		items: this.props.data
	};
	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({ rowsPerPage: event.target.value });
	};
	handleRequestSort = (event, property) => {
		if (property == 'Edit' || property == 'Delete') return false;
		const orderBy = property;
		let order = 'desc';

		if (this.state.orderBy === property && this.state.order === 'desc') {
			order = 'asc';
		}

		this.setState({ order, orderBy });
	};
	getSortedItems = (items, order, orderBy) => {
		if (items.length > 0) return [...items].sort(getSorting(order, orderBy));
		else return items;
	};
	shouldComponentUpdate(nextProps, nextState) {
		if (
			this.props.data !== nextProps.data ||
			this.props.roles !== nextProps.roles ||
			this.props.languages !== nextProps.languages ||
			this.props.loading !== nextProps.loading
		) {
			return true;
		}
		if (
			this.state.page !== nextState.page ||
			this.state.rowsPerPage !== nextState.rowsPerPage ||
			this.state.order !== nextState.order ||
			this.state.orderBy !== nextState.orderBy
		) {
			return true;
		}
		return false;
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			items: nextProps.data
		})
	}

	render() {
		const { classes } = this.props;
		let items = this.props.data;
		const { order, orderBy, selected, rowsPerPage, page } = this.state;

		if (this.props.loading) {
			return (
				<React.Fragment>
					<div className="nothing-container">
						<CircularProgress size={150} />
					</div>
				</React.Fragment>
			);
		}
		if (items.length == 0) {
			<NothingToDisplay title="Oops!" message={this.state.errorMessage} type="Error-success" icon="wow" />;
		}
		return (
			<React.Fragment>
				
					<Table className={classes.table}>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={this.handleSelectAllClick}
							onRequestSort={this.handleRequestSort}
							rowCount={items.length}
						/>

						<TableBody>
							{this.getSortedItems(this.state.items, order, orderBy)
								.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
								.map((row) => {
									return (
										<TableRow
											hover
											className={classes.row}
											key={uuidv4()}
											onClick={() => {
												return this.props.onEditHandler({ ...row });
											}}
										>
											<CustomTableCell component="th">
												<Tooltip title="Edit">
													<button
														className="btn btn-success ml-1 float-left"
														disabled={this.props.loading}
														onClick={(e) => {
															e.stopPropagation();
															return this.props.onEditHandler({ ...row });
														}}
													>
														<i className="fas fa-pen" />
													</button>
												</Tooltip>
												<Tooltip title="Delete">
													<button
														className="btn btn-danger float-left ml-1"
														disabled={this.props.loading}
														onClick={(e) => {
															e.stopPropagation();
															return this.props.onDeleteHandler(row.Id);
														}}
													>
														<i className="fas fa-trash" />
													</button>
												</Tooltip>
											</CustomTableCell>
											<CustomTableCell>{row.Code_User}</CustomTableCell>
											<CustomTableCell>{row.firstName ? row.firstName : ''}</CustomTableCell>
											<CustomTableCell>{row.lastName ? row.lastName: ''}</CustomTableCell>
											<CustomTableCell>{row.Electronic_Address}</CustomTableCell>
											<CustomTableCell>{row.Phone_Number}</CustomTableCell>
											<CustomTableCell>{row.role ? row.role.Description : ''}</CustomTableCell>
											<CustomTableCell>{row.language ? row.language.DisplayLabel : ''}</CustomTableCell>
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
				
			</React.Fragment>
		);
	}
}

UsersTable.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UsersTable);
