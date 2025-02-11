import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import MenuItem from '@material-ui/core/MenuItem';
import TablePagination from '@material-ui/core/TablePagination';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import TableFooter from '@material-ui/core/TableFooter';
import Select from '@material-ui/core/Select';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import CircularProgress from '@material-ui/core/CircularProgress';
import UserFormModal from '../../ui-components/UserForm/UserContactForm';

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

class ContactsTable extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			page: 0,
			rowsPerPage: 5,
			openModal: false,
			contact: null
		};
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({ rowsPerPage: event.target.value });
	};

	shouldComponentUpdate(nextProps, nextState) {
		if (
			this.props.data !== nextProps.data ||
			this.props.types !== nextProps.types ||
			this.props.loading !== nextProps.loading ||
			this.props.supervisors !== nextProps.supervisors ||
			this.props.departments !== nextProps.departments
		) {
			return true;
		}
		if (
			this.state.page !== nextState.page ||
			this.state.rowsPerPage !== nextState.rowsPerPage || //||
			this.state.openModal != nextState.openModal
			//this.state.order !== nextState.order ||
			//this.state.orderBy !== nextState.orderBy
		) {
			return true;
		}
		return false;
	}

	/**
     * To open modal updating the state
     */
	handleClickOpenModal = (row) => {
		this.setState(() => ({ openModal: true, contact: row }));
	};

    /**
     * To hide modal and then restart modal state values
     */
	handleCloseModal = () => {
		this.setState(() => ({ openModal: false, contact: null }), () => {
			if (this.props.updateData)
				this.props.updateData();
		});
	};

	render() {
		const { classes } = this.props;
		let items = this.props.data;
		const { rowsPerPage, page } = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

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
			return <NothingToDisplay title="Wow!" message="Nothing to display!" type="Error-success" icon="wow" />;
		}
		return (
			<React.Fragment>
				<UserFormModal handleCloseModal={this.handleCloseModal} openModal={this.state.openModal}
					idEntity={this.props.idEntity} contact={this.state.contact} />
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell padding="none" width="40px" className={"Table-head"}>Actions</CustomTableCell>
							<CustomTableCell className={"Table-head"} width="60px">Contact
                                Type</CustomTableCell>
							<CustomTableCell className={"Table-head"}>Full Name</CustomTableCell>
							<CustomTableCell className={"Table-head"}>Department</CustomTableCell>
							{/*<CustomTableCell className={classes.th}>Supervisor</CustomTableCell>*/}
							<CustomTableCell className={"Table-head"}>Email</CustomTableCell>
							<CustomTableCell className={"contact-th Table-head"}>Phone
                                Number</CustomTableCell>
							<CustomTableCell className={"Table-head"}>Contact Title</CustomTableCell>
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
										return this.props.onEditHandler({ ...row });
									}}
								>
									<CustomTableCell>
										<Tooltip title="Edit">
											<button
												className="btn btn-success ml-1 float-left"
												disabled={this.props.loading}
												onClick={(e) => {
													e.stopPropagation();
													return this.props.onEditHandler({ ...row });
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
													e.stopPropagation();
													return this.props.onDeleteHandler(row.idSearch);
												}}
											>
												<i class="fas fa-trash"></i>
											</button>
										</Tooltip>
										{row.users.length == 0 ?
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
											</Tooltip> : ''}
									</CustomTableCell>
									<CustomTableCell>
										<Select
											id="type"
											name="type"
											value={row.type}
											disabled
											IconComponent="div"
											disableUnderline={true}
										>


											{this.props.types.map(({ Id, Name }) => (
												<MenuItem key={Id} value={Id} name={Name}>
													{Name}
												</MenuItem>
											))}
										</Select>
									</CustomTableCell>
									<CustomTableCell>{row.firstname + ' ' + row.lastname}</CustomTableCell>
									<CustomTableCell>
										<Select
											id="department"
											name="department"
											value={row.idDepartment}
											disabled
											IconComponent="div"
											disableUnderline={true}
										>
											{this.props.departments.map(({ Id, Name }) => (
												<MenuItem key={Id} value={Id} name={Name}>
													{Name}
												</MenuItem>
											))}
										</Select>
									</CustomTableCell>
									<CustomTableCell>{row.email}</CustomTableCell>
									<CustomTableCell>{row.number}</CustomTableCell>
									<CustomTableCell>
										<Select
											id="title"
											name="title"
											value={row.title}
											disabled
											IconComponent="div"
											disableUnderline={true}
										>
											{this.props.titles.map(({ Id, Name }) => (
												<MenuItem key={Id} value={Id} name={Name}>
													{Name}
												</MenuItem>
											))}
										</Select>
									</CustomTableCell>
								</TableRow>
							);
						})}

						{/*emptyRows > 0 && (
							<TableRow style={{ height: 48 * emptyRows }}>
								<TableCell colSpan={11} />
							</TableRow>
						)*/}
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
			</React.Fragment >
		);
	}
}

ContactsTable.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ContactsTable);
