import React, {Component} from 'react';

import { withStyles } from '@material-ui/core/styles';
import { withApollo } from 'react-apollo';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import withGlobalContent from 'Generic/Global';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActionsWrapped from '../ui-components/TablePagination';

import moment from 'moment';

import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';

import DepartmentModal from './DepartmentModal';
import {GET_DEPARTMENTS, INSERT_CATALOG_ITEM_QUERY, UPDATE_CATALOG_ITEM_QUERY, DELETE_CATALOG_ITEM_QUERY} from './Queries';

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
		fontSize: 14
    }
}))(TableCell);

class DepartmentsCatalogTable extends Component{
    
    constructor(props){
		super(props);

		this.INITIAL_STATE = {
			name: '',
			displayLabel: '',
			description: '',
			idToEdit: 0,
			openModal: false,
			confirmSaved: false
		}
		
		this.state = {
			departments: [],	
			rowsPerPage: 25,
			page: 0,		
			...this.INITIAL_STATE
		}
	}
    
    componentWillMount(){
        this.loadDepartments();
    }

    loadDepartments = () => {
		this.props.client
		.query({
			query: GET_DEPARTMENTS,
			fetchPolicy: 'no-cache'
		})
		.then( ({ data }) => {
			this.setState(() => ({
				departments: data.getcatalogitem				
			}), _ => {
				console.log(this.state.departments)
			});
		})
    }
    
    openModal = () => {
		this.setState({
			openModal: true
		});
	}

	handleOnClose = () => {
		this.setState({
			openModal: false,
			idToEdit: 0
		}, _ => this.loadDepartments());
    }
    
    deleteDepartment = (Id) => {
		this.props.client
		.mutate({
			mutation: DELETE_CATALOG_ITEM_QUERY,
			variables: {
				Id
			}
		})
		.then( ({ data }) => {
			this.props.handleOpenSnackbar('success', 'Successfully eliminated record', 'bottom', 'right');
			this.loadDepartments();
		})
		.catch( error => {
			this.props.handleOpenSnackbar('error', 'Failed to delete record', 'bottom', 'right');
		});
	}

	handleChangePage = (event, page) => {
		this.setState({ page });
};

handleChangeRowsPerPage = (event) => {
	this.setState({ rowsPerPage: event.target.value });
};
    
    render(){
			let items = this.state.departments;
        const { rowsPerPage, page } = this.state;
        let isLoading = this.state.loading;  
        return(
			<React.Fragment>
			<div className="row">
				{localStorage.getItem('isEmployee') == 'false' &&
					<div className="col-md-12">
						<button
							type="button"
							className="btn btn-success float-right"
							onClick={(e) => {
								e.stopPropagation();	
								this.setState({									
									openModal: true
								});														
							}}
						>
							Add Department
						</button>
					</div>
				}

				<div className="col-12">
					<div className="card">
						<div className="card-body tumi-forcedResponsiveTable">
							<React.Fragment>
								<Table>
									<TableHead>
										<TableRow>
											<CustomTableCell width={'70px'} className={"Table-head text-center"}>Actions</CustomTableCell>
											<CustomTableCell className={"Table-head text-center"}>Catalog</CustomTableCell>
											<CustomTableCell className={"Table-head text-center"}>Name</CustomTableCell>
											<CustomTableCell className={"Table-head text-center"}>Display Label</CustomTableCell>
											<CustomTableCell className={"Table-head text-center"}>Description</CustomTableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{this.state.departments.map((row) => {	
											return (
												<TableRow key={row.Id}>
													<CustomTableCell className={'text-center'}>	
															<button
																className="btn btn-danger mr-1 float-left"
																disabled={this.props.loading}
																onClick={(e) => {
																	e.stopPropagation();	
																	this.deleteDepartment(row.Id)																											
																}}
															>
																<i class="fas fa-trash"></i>
															</button>
														
															<button
																className="btn btn-success mr-1 float-left"
																disabled={this.props.loading}
																onClick={(e) => {
																	e.stopPropagation();	
																	this.setState({
																		idToEdit: row.Id,
																		name: row.Name,
																		displayLabel: row.DisplayLabel,
																		description: row.Description,
																		openModal: true
																	});														
																}}
															>
																<i className="fas fa-pen"></i>
															</button>
													</CustomTableCell>
													<CustomTableCell className={'text-center'}>Department</CustomTableCell>
													<CustomTableCell className={'text-center'}>{ row.Name.trim() || '' }</CustomTableCell>
													<CustomTableCell className={'text-center'}>{ row.DisplayLabel.trim() || '' }</CustomTableCell>
													<CustomTableCell className={'text-center'}>{ row.Description.trim() || '' }</CustomTableCell>
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
						</div>
					</div>     
				</div>
			</div>	
			<DepartmentModal
				departmentId={this.state.idToEdit}
				open={this.state.openModal}
				handleOnClose={this.handleOnClose}
				confirmSaved={this.confirmSaved}
			/>
			</React.Fragment>		       
        );
    }
};

export default withGlobalContent(withApollo(DepartmentsCatalogTable));