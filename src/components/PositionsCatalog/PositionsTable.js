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
import moment from 'moment';

import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';

import PositionModal from './PositionModal';
import {GET_POSITIONS_CATALOG, INSERT_CATALOG_ITEM_QUERY, UPDATE_CATALOG_ITEM_QUERY, DELETE_CATALOG_ITEM_QUERY} from './Queries';

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
		fontSize: 14
    }
}))(TableCell);

class PositionCatalogTable extends Component{
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
			positions: [],
			showCircularLoading: false,		
			nameValid: false,
			displayLabelValid: false,
			descriptionValid: false,
			...this.INITIAL_STATE
		}
	}
	
	componentWillMount(){
		this.loadPositions();
	}

	confirmSaved = () => {
		this.setState({
			confirmSaved: true
		});
	}	

	loadPositions = () => {
		this.props.client
		.query({
			query: GET_POSITIONS_CATALOG,
			fetchPolicy: 'no-cache'
		})
		.then( ({ data }) => {
			this.setState(() => ({
				positions: data.getcatalogitem				
			}));
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
		}, _ => this.loadPositions());
	}

	deletePosition = (Id) => {
		this.props.client
		.mutate({
			mutation: DELETE_CATALOG_ITEM_QUERY,
			variables: {
				Id
			}
		})
		.then( ({ data }) => {
			this.props.handleOpenSnackbar('success', 'Successfully eliminated record', 'bottom', 'right');
			this.loadPositions();
		})
		.catch( error => {
			this.props.handleOpenSnackbar('error', 'Failed to delete record', 'bottom', 'right');
		});
	}

	render(){
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
							Add Position
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
										{this.state.positions.map((row) => {	
											return (
												<TableRow key={row.Id}>
													<CustomTableCell className={'text-center'}>	
															<button
																className="btn btn-danger mr-1 float-left"
																disabled={this.props.loading}
																onClick={(e) => {
																	e.stopPropagation();	
																	this.deletePosition(row.Id)																											
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
													<CustomTableCell className={'text-center'}>Position</CustomTableCell>
													<CustomTableCell className={'text-center'}>{ row.Name.trim() }</CustomTableCell>
													<CustomTableCell className={'text-center'}>{ row.DisplayLabel.trim() }</CustomTableCell>
													<CustomTableCell className={'text-center'}>{ row.Description.trim() }</CustomTableCell>
												</TableRow>
											);								
										})}
									</TableBody>					
								</Table>				
							</React.Fragment>
						</div>
					</div>     
				</div>
			</div>	
			<PositionModal
				positionId={this.state.idToEdit}
				open={this.state.openModal}
				handleOnClose={this.handleOnClose}
				confirmSaved={this.confirmSaved}
			/>
			</React.Fragment>		       
        );
    }
};

export default withGlobalContent(withApollo(PositionCatalogTable));