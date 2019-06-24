import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import Tooltip from '@material-ui/core/Tooltip';
import { withApollo } from 'react-apollo';
import { GET_WORKORDERS_QUERY, GET_HOTEL_QUERY } from './queries';
import TablePaginationActionsWrapped from '../ui-components/TablePagination';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import { REJECT_WORKORDER } from './mutations';
import ShiftsData from '../../data/shitfs.json';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import Query from 'react-apollo/Query';
const CustomTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: theme.palette.common.black,
		color: theme.palette.common.white
	},
	body: {
		fontSize: 14
	}
}))(TableCell);

class WorkOrdersPositionTable extends Component {
	constructor(props) {
		super(props);
		this.state = {
			data: [],
			rowsPerPage: props.rowsPerPage || 25,
			page: 0,
			openConfirm: false,
			Hotels: [],

			ShiftsData: ShiftsData,
			id: null,
			hotel: 0,
			IdEntity: null,
			date: '',
			quantity: 0,
			status: 2,
			shift: '',
			startDate: '',
			endDate: '',
			needExperience: false,
			needEnglish: false,
			comment: '',
			position: 0,
			PositionRateId: null,
			RecruiterId: null,
			userId: localStorage.getItem('LoginId'),
			ShiftsData: ShiftsData,
			saving: false,
			recruiters: [],
			contactId: null,
			filterValue: 0,
			startDate: '',
			endDate: '',
			endDateDisabled: true,
			states: [],
			state: 0
		};
	}

	componentWillMount() {

		this.getWorkOrders();
	}

	getDateFilters = () => {
		var variables;
		variables = null;
		var workOrder = [];
		var workOrderCompany = [];
		if (this.state.startDate != "" && this.state.endDate != "") {
			workOrder = {
				startDate: this.state.startDate,
				endDate: this.state.endDate,
			}
		}
		if (this.state.status != "") {
			workOrder = {
				status: this.state.status,
				...workOrder
			}
		}

		if (this.state.id)
			workOrder = {
				id: this.state.id,
				...workOrder
			}

		if (this.state.state != 0) {
			workOrderCompany = {
				State: this.state.state
			}
		}

		variables = {
			workOrder,
			workOrderCompany
		}
		return variables;
	}

	getWorkOrders = () => {
		this.props.client
			.query({
				query: GET_WORKORDERS_QUERY,
				fetchPolicy: 'no-cache',
				variables: {
					...this.getDateFilters()
				}
			})
			.then(({ data }) => {
				this.setState({
					data: data.workOrder
				});
			})
			.catch(error => {
				console.log(error)
			});
	}

	handleDelete = (id) => {
		this.setState({ removing: true });
		this.props.client
			.mutate({
				mutation: REJECT_WORKORDER,
				variables: {
					id: id
				}
			})
			.then((data) => {
				this.props.handleOpenSnackbar('success', 'Record Rejected!');
				this.setState({ openModal: false, removing: false });
				window.location.reload();
			})
			.catch((error) => {
				this.setState({ removing: false });
				this.props.handleOpenSnackbar('error', 'Error: ' + error);
			});
	};

	render() {
		let items = this.state.data;
		const { rowsPerPage, page } = this.state;
		const emptyRows = rowsPerPage - Math.min(rowsPerPage, items.length - page * rowsPerPage);

		return (
			<div>
				<Paper style={{ overflowX: 'auto' }}>
					<Table>
						<TableHead>
							<TableRow>
								<CustomTableCell className={"Table-head text-center"}>Actions</CustomTableCell>
								<CustomTableCell className={"Table-head"}>No.</CustomTableCell>
								<CustomTableCell className={"Table-head"}>Hotel</CustomTableCell>
								<CustomTableCell className={'Table-head'}>Position</CustomTableCell>
								<CustomTableCell className={'Table-head'}>Quantity</CustomTableCell>
								<CustomTableCell className={'Table-head'}>Shift</CustomTableCell>
								<CustomTableCell className={'Table-head'}>Need Experience?</CustomTableCell>
								<CustomTableCell className={'Table-head'}>Need to Speak English?</CustomTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
								return (
									<TableRow>
										<CustomTableCell>
											<Tooltip title="View">
												<button
													className="btn btn-success mr-1 float-left"
													disabled={this.props.loading}
													onClick={(e) => {
														e.stopPropagation();
														return this.props.onEditHandler({ ...row });
													}}
												>
													<i className="fas fa-pen" />
												</button>
											</Tooltip>
											<Tooltip title="Reject Opening">
												<button
													className="btn btn-danger float-left"
													disabled={this.props.loading}
													onClick={(e) => {
														e.preventDefault();
														this.setState({ openConfirm: true, idToDelete: row.id });
													}}
												>
													<i class="fas fa-eject" />
												</button>
											</Tooltip>
										</CustomTableCell>
										<CustomTableCell>{row.id}</CustomTableCell>
										<CustomTableCell>{row.BusinessCompany.Name}</CustomTableCell>
										<CustomTableCell>{row.position.Position}</CustomTableCell>
										<CustomTableCell>{row.quantity}</CustomTableCell>
										<CustomTableCell>
											{ShiftsData.map((shift) => (shift.Id == row.shift ? shift.Name : ''))}
										</CustomTableCell>
										<CustomTableCell>{row.needExperience == false ? 'No' : 'Yes'}</CustomTableCell>
										<CustomTableCell>{row.needEnglish == false ? 'No' : 'Yes'}</CustomTableCell>
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
					<ConfirmDialog
						open={this.state.openConfirm}
						closeAction={() => {
							this.setState({ openConfirm: false });
						}}
						confirmAction={() => {
							this.handleDelete(this.state.idToDelete);
						}}
						title={'are you sure you want to reject this opening?'}
						loading={this.state.removing}
					/>
				</Paper>
			</div>
		);
	}
}

export default (withApollo(WorkOrdersPositionTable));
