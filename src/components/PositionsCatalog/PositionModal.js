import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import SelectForm from 'ui-components/SelectForm/SelectForm';
import InputForm from 'ui-components/InputForm/InputForm';

import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';

import Button from '@material-ui/core/Button';
import { withApollo } from 'react-apollo';
import withGlobalContent from 'Generic/Global';
import moment from 'moment';

import {GET_POSITION, INSERT_CATALOG_ITEM_QUERY, UPDATE_CATALOG_ITEM_QUERY, DELETE_CATALOG_ITEM_QUERY} from './Queries';

class PositionModal extends Component{
	INITIAL_STATE = {
		Id: 0,
		Name: '',
		DisplayLabel: '',
		Description: '',
		DateCreated: ''
	}
	
	constructor(props) {
		super(props);
		this.state = {
			Id: 0, 
			Name: '',
			DisplayLabel: '',
			Description: '',
			DateCreated: ''			
		};
	}	

	componentWillReceiveProps(nextProps){
		if (nextProps.positionId !== 0 && nextProps.open) {
			this.setState({
				open: nextProps.open,				
			});

			this.loadPosition(nextProps.positionId);			
		} else if (!nextProps.open) {
			this.setState({...this.INITIAL_STATE});
		}

		this.setState({...this.INITIAL_STATE, open: nextProps.open});
		return true;
	}

	onChangeHandler = (event) => {
		const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
		const name = target.name;
		
		this.setState({
            [name]: value
        });
	}

	onSubmit = (event) => {
		event.preventDefault();	

		if(this.state.Id === 0)		
			this.insertPosition();
		else	
			this.updatePosition();
	}

	loadPosition = (positionId) => {
		this.props.client
		.query({
			query: GET_POSITION,
			fetchPolicy: 'no-cache',

			variables: {
				input: positionId,
			}
		})
		.then( ({ data }) => {
			const { Id, Name, DisplayLabel, Description, Date_Created } = data.catalogitem[0];
			
			this.setState(() => ({
				Id,
				Name: Name.trim(),
				DisplayLabel: DisplayLabel.trim(),
				Description: Description.trim(),
				DateCreated: Date_Created
			}));
			
		})
		.catch( error => {
		});
	}

	validateFields = () => {
		let validated = false;
		const {Name, DisplayLabel, Description} = this.state;

		if(Name.length > 0 && DisplayLabel.length > 0 && Description.length > 0)
			validated = true;

		return validated;
	}

	insertPosition = () => {
		if(!this.validateFields()){
			this.props.handleOpenSnackbar(
				'error', 'Please fill in the required fields.', 'bottom', 'right'
			);

			return;
		}
		
		this.props.client.mutate({
				mutation: INSERT_CATALOG_ITEM_QUERY,
				variables: {
					input: {
						Id: this.state.Id,
						Id_Catalog: 6,
						Id_Parent: 0,
						Name: `'${this.state.Name}'`,
						DisplayLabel: `'${this.state.DisplayLabel}'`,
						Description: `'${this.state.Description}'`,
						Value: `' '`,
						Value01: null,
						Value02: null,
						Value03: null,
						Value04: null,
						IsActive: 1,
						User_Created: 1,
						User_Updated: 1,
						Date_Created: `'${new Date().toISOString()}'`,
						Date_Updated: `'${new Date().toISOString()}'`
					}
				}
			}).then((data) => {
				this.props.handleOpenSnackbar('success', 'Successfully inserted', 'bottom', 'right');
				this.props.handleOnClose();
			}).catch((error) => {
				this.props.handleOpenSnackbar(
					'error', 'Error Inserting Catalog Item: ' + error, 'bottom', 'right'
				);
				this.setState({
					loading: false
				});
			});
	}

	updatePosition = () => {
		if(!this.validateFields()){
			this.props.handleOpenSnackbar(
				'error', 'Please fill in the required fields.', 'bottom', 'right'
			);

			return;
		}

		this.props.client
            .mutate({
                mutation: UPDATE_CATALOG_ITEM_QUERY,
                variables: {
					input: {
						Id: this.state.Id,
						Id_Catalog: 6,
						Id_Parent: 0,
						Name: `'${this.state.Name}'`,
						DisplayLabel: `'${this.state.DisplayLabel}'`,
						Description: `'${this.state.Description}'`,
						Value: `' '`,
						Value01: null,
						Value02: null,
						Value03: null,
						Value04: null,
						IsActive: 1,
						User_Created: 1,
						User_Updated: 1,
						Date_Created: `'${new Date().toISOString()}'`,
						Date_Updated: `'${new Date().toISOString()}'`,
					}					
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Successfully inserted', 'bottom', 'right');
                this.setState({ ...this.INITIAL_STATE  });               
                this.props.handleOnClose();
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
					'error', 'Error Inserting Catalog Item: ' + error, 'bottom', 'right'
				);
            });
	}

	onCancel = () => {
		this.setState({...this.INITIAL_STATE}, _ => this.props.handleOnClose());		
	}

	render(){
		return(		
			<Dialog
					fullScreen={false}
					maxWidth="md"
					open={this.state.open}
					onClose={ _ => this.setState({...this.INITIAL_STATE}, this.props.handleOnClose) }
					aria-labelledby="responsive-dialog-title"
				>	
			<form action="" onSubmit={this.onSubmit}>
					<DialogContent style={{ width: 600 }}>
						<div className="row">
							<div className="col-md-12 mb-4">
								<span className="">* Name</span>
								<input
									type='text'
									id="name"
									name="Name"
									maxLength="150"
									className="form-control"
									error={!this.state.nameValid}
									value={this.state.Name}
									onChange={this.onChangeHandler}
								/>
							</div>
							<div className="col-md-12 mb-4">
								<span className="">* Display Label</span>
								<input
									type='text'
									id="displayLabel"
									name="DisplayLabel"
									maxLength="150"
									className="form-control"
									error={!this.state.displayLabelValid}
									value={this.state.DisplayLabel}
									onChange={this.onChangeHandler}
								/>
							</div>
							<div className="col-md-12 mb-4">
								<span className="">* Description</span>
								<input
									type='text'
									id="description"
									name="Description"
									maxLength="150"
									className="form-control"
									error={!this.state.descriptionValid}
									value={this.state.Description}
									onChange={this.onChangeHandler}
								/>
							</div>
						</div>				
					</DialogContent>
					<DialogActions style={{ margin: '16px 10px' }}>
						<button className="btn btn-success" type="submit" value="Submit">
							<i className="fas fa-save"></i> Save
						</button>

						<button type="button" className="btn btn-danger" 
								onClick={ this.onCancel }>
							<i className="fas fa-ban"></i> Cancel
						</button>
					</DialogActions>
					</form>
				</Dialog>
		);
	}
};

export default withGlobalContent(withApollo(PositionModal));
