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
	{ id: 'Edit', numeric: false, disablePadding: true, label: '' },
	{ id: 'Delete', numeric: false, disablePadding: true, label: '' },
	{ id: 'Id_Contact', numeric: false, disablePadding: false, label: 'Contact' },
	{ id: 'Code_User', numeric: false, disablePadding: false, label: 'User Name' },
	//{ id: 'Full_Name', numeric: false, disablePadding: false, label: 'Full Name' },
	{ id: 'Electronic_Address', numeric: false, disablePadding: false, label: 'Email' },
	{ id: 'Phone_Number', numeric: false, disablePadding: false, label: 'Number' },
	{ id: 'Id_Roles', numeric: false, disablePadding: false, label: 'Rol' },
	{ id: 'Id_language', numeric: false, disablePadding: false, label: 'Language' },
	{ id: 'IsAdmin', numeric: false, disablePadding: false, label: 'Admin' },
	{ id: 'AllowDelete', numeric: false, disablePadding: false, label: 'Allow Delete' },
	{ id: 'AllowInsert', numeric: false, disablePadding: false, label: 'Allow Insert' },
	{ id: 'AllowEdit', numeric: false, disablePadding: false, label: 'Allow Edit' },
	{ id: 'AllowExport', numeric: false, disablePadding: false, label: 'Allow Export' }
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
					{/*<TableCell padding="checkbox">
						<Checkbox
							indeterminate={numSelected > 0 && numSelected < rowCount}
							checked={numSelected === rowCount}
							onChange={onSelectAllClick}
		/>
					</TableCell>*/}
					{rows.map((row) => {
						if (row.id == 'Edit' || row.id == 'Delete') {
							return (
								<TableCell
									key={row.id}
									numeric={row.numeric}
									padding={row.disablePadding ? 'none' : 'default'}
									sortDirection={orderBy === row.id ? order : false}
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
									style={{ color: 'white' }}
									key={row.id}
									numeric={row.numeric}
									sortDirection={orderBy === row.id ? order : false}
									padding="checkbox"
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
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default
		}
	},
	fab: {
		margin: theme.spacing.unit * 2
	},
	absolute: {
		position: 'absolute',
		bottom: theme.spacing.unit * 2,
		right: theme.spacing.unit * 3
	}
});

let id = 0;

class UsersTable extends React.Component {
	state = {
		page: 0,
		rowsPerPage: 5,
		order: 'asc',
		orderBy: 'calories',
		selected: []
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
		if (items.length > 0) return [ ...items ].sort(getSorting(order, orderBy));
		else return items;
	};
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props.data !== nextProps.data||
		this.props.contacts !== nextProps.contacts||
		this.props.roles !== nextProps.roles||
		this.props.languages !== nextProps.languages||
		this.props.loading !== nextProps.loading) {
			
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
	render() {
		const { classes } = this.props;
		let items = this.props.data;
		const { order, orderBy, selected, rowsPerPage, page } = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

		return (
			<Paper className={classes.root}>
				<Table className={classes.table}>
					<EnhancedTableHead
						numSelected={selected.length}
						order={order}
						orderBy={orderBy}
						onSelectAllClick={this.handleSelectAllClick}
						onRequestSort={this.handleRequestSort}
						rowCount={items.length}
					/>
					{/*	<TableHead>
						<TableRow>
							<CustomTableCell padding="none" />
							<CustomTableCell padding="none" />
							<CustomTableCell>Catalog</CustomTableCell>
							<CustomTableCell>Name</CustomTableCell>
							<CustomTableCell>Display Label</CustomTableCell>
							<CustomTableCell>Description</CustomTableCell>
							<CustomTableCell>Parent</CustomTableCell>
							<CustomTableCell>Value</CustomTableCell>
						</TableRow>
				</TableHead>*/}
					<TableBody>
						{this.getSortedItems(items, order, orderBy)
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row) => {
								return (
									<TableRow hover className={classes.row} key={uuidv4()}>
										<CustomTableCell component="th" padding="none" style={{ width: '50px' }}>
											{' '}
											<Tooltip title="Edit">
												<div>
													<IconButton
														disabled={this.props.loading}
														onClick={() => {
															return this.props.onEditHandler({ ...row });
														}}
													>
														<EditIcon color="primary" />
													</IconButton>
												</div>
											</Tooltip>
										</CustomTableCell>
										<CustomTableCell component="th" padding="none" style={{ width: '50px' }}>
											<Tooltip title="Delete">
												<div>
													<IconButton
														disabled={this.props.loading}
														onClick={() => {
															return this.props.onDeleteHandler(row.Id);
														}}
													>
														<DeleteIcon color="primary" />
													</IconButton>
												</div>
											</Tooltip>
										</CustomTableCell>
										<CustomTableCell style={{ width: '150px' }}>
											<TextField
												id="Id_Contact"
												select
												name="Id_Contact"
												value={row.Id_Contact}
												margin="normal"
												disabled
											>
												{' '}
												<MenuItem key={0} value={0} name="None">
													<em>None</em>
												</MenuItem>
												{this.props.contacts.map(({ Id, Name }) => (
													<MenuItem key={Id} value={Id} name={NamedNodeMap}>
														{Name}
													</MenuItem>
												))}
											</TextField>
										</CustomTableCell>
										<CustomTableCell>{row.Code_User}</CustomTableCell>
										{/*<CustomTableCell style={{ width: '200px' }}>{row.Full_Name}</CustomTableCell>*/}
										<CustomTableCell style={{ width: '200px' }}>
											{row.Electronic_Address}
										</CustomTableCell>
										<CustomTableCell>{row.Phone_Number}</CustomTableCell>
										<CustomTableCell style={{ width: '150px' }}>
											<TextField
												id="Id_Roles"
												select
												name="Id_Roles"
												value={row.Id_Roles}
												margin="normal"
												disabled
											>
												{this.props.roles.map(({ Id, Name }) => (
													<MenuItem key={Id} value={Id} name={Name}>
														{Name}
													</MenuItem>
												))}
											</TextField>
										</CustomTableCell>
										<CustomTableCell style={{ width: '150px' }}>
											<TextField
												id="Id_Language"
												select
												name="Id_Language"
												value={row.Id_Language}
												margin="normal"
												disabled
											>
												{this.props.languages.map(({ Id, Name }) => (
													<MenuItem key={Id} value={Id} name={Name}>
														{Name}
													</MenuItem>
												))}
											</TextField>
										</CustomTableCell>
										<TableCell padding="checkbox">
											<Checkbox checked={row.IsAdmin == 1} />
										</TableCell>
										<TableCell padding="checkbox">
											<Checkbox checked={row.AllowInsert == 1} />
										</TableCell>
										<TableCell padding="checkbox">
											<Checkbox checked={row.AllowEdit == 1} />
										</TableCell>
										<TableCell padding="checkbox">
											<Checkbox checked={row.AllowDelete == 1} />
										</TableCell>
										<TableCell padding="checkbox">
											<Checkbox checked={row.AllowExport == 1} />
										</TableCell>
									</TableRow>
								);
							})}

						{emptyRows > 0 && (
							<TableRow style={{ height: 48 * emptyRows }}>
								<TableCell colSpan={13} />
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
		);
	}
}

UsersTable.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(UsersTable);
