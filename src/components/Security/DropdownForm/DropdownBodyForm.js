import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import { INSERT_ROL_FORM } from './mutations';
import withApollo from 'react-apollo/withApollo';
import { GET_ROL_FORMS_QUERY } from './queries';
import withGlobalContent from '../../Generic/Global';
import TableItem from './TableItem';

let counter = 0;

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

function stableSort(array, cmp) {
	const stabilizedThis = array.map((el, index) => [ el, index ]);
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	return stabilizedThis.map((el) => el[0]);
}

function getSorting(order, orderBy) {
	return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
	{ id: 'code', numeric: false, disablePadding: true, label: 'Code' },
	{ id: 'form', numeric: true, disablePadding: false, label: 'Form' },
	{ id: 'url', numeric: true, disablePadding: false, label: 'URL Value' }
];

class EnhancedTableHead extends React.Component {
	createSortHandler = (property) => (event) => {
		this.props.onRequestSort(event, property);
	};

	render() {
		const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

		return (
			<TableHead>
				<TableRow>
					<TableCell padding="checkbox">
						<Checkbox
							color={'primary'}
							indeterminate={numSelected > 0 && numSelected < rowCount}
							checked={numSelected === rowCount}
							onChange={onSelectAllClick}
						/>
					</TableCell>
					{rows.map((row) => {
						return (
							<TableCell
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
	onSelectAllClick: PropTypes.func.isRequired,
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
					color: '#41afd7',
					backgroundColor: lighten(theme.palette.text.primary, 0.95)
				}
			: {
					color: '#41afd7',
					backgroundColor: '#41afd7'
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
					<Typography color="inherit" variant="subtitle1">
						{numSelected} selected
					</Typography>
				) : (
					<Typography variant="h6" id="tableTitle">
						Roles
					</Typography>
				)}
			</div>
			<div className={classes.spacer} />
			<div className={classes.actions}>
				{numSelected > 0 ? (
					<Tooltip title="Assign">
						<button
							onClick={() => {
								props.handleInsert();
							}}
							className="btn btn btn-success"
						>
							Assign and Save
						</button>
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

const styles = (theme) => ({
	root: {
		width: '100%',
		marginTop: theme.spacing.unit * 3
	},
	table: {
		minWidth: 1024
	},
	tableWrapper: {
		overflowX: 'auto'
	}
});

class EnhancedTable extends React.Component {
	state = {
		order: 'asc',
		orderBy: 'calories',
		selected: [],
		data: [
			createData('001', 'Catalogs', 'http://localhost:3000/home/forms'),
			createData('001', 'Catalogs', 'http://localhost:3000/home/forms')
		],
		page: 0,
		rowsPerPage: 5,
		dataRolForm: []
	};

	insertRolForm = (object) => {
		this.props.client
			.mutate({
				mutation: INSERT_ROL_FORM,
				variables: {
					input: object
				}
			})
			.then(({ data }) => {
				// Show a snackbar with a success message
				this.props.handleOpenSnackbar('success', 'Successfully inserted!', 'bottom', 'right');

				this.props.closeItem();
			})
			.catch((error) => {
				this.props.handleOpenSnackbar(
					'error',
					'Error to save permission. Please, try again!',
					'bottom',
					'right'
				);
			});
	};

	handleInsertRolForm = () => {
		let objectRolForm = {
			IdRoles: this.props.rolId,
			IdForms: 0,
			IsActive: 1,
			User_Created: 1,
			User_Updated: 1,
			Date_Created: "'2018-08-14'",
			Date_Updated: "'2018-08-14'"
		};

		this.state.selected.map((item) => {
			objectRolForm.IdForms = item;

			this.insertRolForm(objectRolForm);
		});
	};

	componentWillMount() {
		this.props.client
			.query({
				query: GET_ROL_FORMS_QUERY
			})
			.then(({ data }) => {
				this.setState({
					dataRolForm: data.getrolesforms
				});
			})
			.catch((error) => {
				this.props.handleOpenSnackbar('error', 'Error to get data. Please, try again!', 'bottom', 'right');
			});
	}

	render() {
		let forms = this.props.data;

		return (
			<table className="table">
				<thead className="thead-dark">
					<tr>
						<th scope="col">Code</th>
						<th scope="col">Name</th>
						<th scope="col">Value</th>
					</tr>
				</thead>
				<tbody>
					{forms.map((item) => {
						let checked = false;

						this.state.dataRolForm.map((itemRolForm) => {
							if (this.props.rolId === itemRolForm.IdRoles) {
								if (itemRolForm.IdForms === item.Id) {
									checked = true;
								}
							}
						});

						return <TableItem asiggned={checked} code={item.Code} name={item.Name} url={item.url} />;
					})}
				</tbody>
			</table>
		);
	}
}

EnhancedTable.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(withGlobalContent(EnhancedTable)));
