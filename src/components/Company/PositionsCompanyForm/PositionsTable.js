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
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format';
import Select from '@material-ui/core/Select';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';
import CircularProgress from '@material-ui/core/CircularProgress';

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
	numberControl: {
		textAlign: 'right'
	},
	th: {
		backgroundColor: '#3da2c7'
	}
});

function TextMaskCustom(props) {
	const { inputRef, ...other } = props;

	return (
		<MaskedInput
			{...other}
			ref={inputRef}
			mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
			placeholderChar={'\u2000'}
			showMask
		/>
	);
}

TextMaskCustom.propTypes = {
	inputRef: PropTypes.func.isRequired
};

function NumberFormatCustom(props) {
	const { inputRef, onChange, ...other } = props;

	return (
		<NumberFormat
			{...other}
			style={{ textAlign: 'right', width: '100%' }}
			getInputRef={inputRef}
			onValueChange={(values) => {
				onChange({
					target: {
						value: values.value
					}
				});
			}}
			thousandSeparator
		//prefix="$"
		/>
	);
}

NumberFormatCustom.propTypes = {
	inputRef: PropTypes.func.isRequired,
	onChange: PropTypes.func.isRequired
};

let id = 0;

class PositionsTable extends React.Component {
	state = {
		page: 0,
		rowsPerPage: 5
		//textmask: '(1  )    -    ',
		//numberformat: '1320'
	};
	handleChangePage = (event, page) => {
		this.setState({ page });
	};

	handleChangeRowsPerPage = (event) => {
		this.setState({ rowsPerPage: event.target.value });
	};
	shouldComponentUpdate(nextProps, nextState) {
		if (
			this.props.data !== nextProps.data ||
			this.props.departments !== nextProps.departments ||
			this.props.loading !== nextProps.loading //||
			//this.props.shifts !== nextProps.shifts
		) {
			return true;
		}
		if (
			this.state.page !== nextState.page ||
			this.state.rowsPerPage !== nextState.rowsPerPage //||
			//this.state.order !== nextState.order ||
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
		const { textmask, numberformat } = this.state;

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
			<Paper className={classes.root}>
				<Table className={classes.table}>
					<TableHead>
						<TableRow>
							<CustomTableCell className={"Table-head"} style={{width: '30px' }}>
								Actions
							</CustomTableCell>
							<CustomTableCell className={'Table-head'} style={{width: '50px' }}>Department</CustomTableCell>
							<CustomTableCell className={'Table-head'} style={{width: '80px' }}>Title</CustomTableCell>

							<CustomTableCell className={'Table-head'} style={{width: '80px' }}>Bill Rate</CustomTableCell>

							{this.props.showPayRate && (
								<CustomTableCell className={'Table-head'} style={{width: '80px' }}>Pay Rate</CustomTableCell>
							)}

							<CustomTableCell className={'Table-head'} style={{width: '80px' }}></CustomTableCell>
							<CustomTableCell className={'Table-head'} style={{width: '80px' }}></CustomTableCell>
							{/*<CustomTableCell padding="none" className={'Table-head'}>
								Shift
							</CustomTableCell>*/}
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

									<CustomTableCell component="th" style={{width: '30px' }}>
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
													return this.props.onDeleteHandler(row.Id);
												}}
											>
												<i class="fas fa-trash"></i>
											</button>
										</Tooltip>
									</CustomTableCell>
									<CustomTableCell  style={{width: '50px' }}>
										<Select
											id="department"
											name="department"
											value={row.Id_Department}
											disableUnderline={true}
											disabled
											IconComponent="div"
										>
											{this.props.departments.map(({ Id, Name }) => (
												<MenuItem key={Id} value={Id} name={Name} style={{width: '50px' }}>
													{Name}
												</MenuItem>
											))}
										</Select>
									</CustomTableCell>
									<CustomTableCell  style={{width: '80px' }}>{row.Position}</CustomTableCell>
									<CustomTableCell  style={{width: '80px' }}>
										$ {row.Bill_Rate}
									</CustomTableCell>

									{this.props.showPayRate && (
										<CustomTableCell  style={{width: '80px' }}>
											$ {row.Pay_Rate}
										</CustomTableCell>
									)}
									<CustomTableCell  style={{width: '80px' }}></CustomTableCell>
									<CustomTableCell  style={{width: '80px' }}></CustomTableCell>
									{/*
									<CustomTableCell padding="none">
										<Select
											id="shift"
											name="shift"
											value={row.Shift}
											disabled
											style={{ width: '100%' }}
											disableUnderline={true}
											IconComponent="div"
										>
											{this.props.shifts.map(({ Id, Name }) => (
												<MenuItem key={Id} value={Id} name={Name}>
													{Name}
												</MenuItem>
											))}
										</Select>
											</CustomTableCell>*/}
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
		);
	}
}

PositionsTable.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(PositionsTable);
