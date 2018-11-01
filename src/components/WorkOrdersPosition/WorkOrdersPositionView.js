import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import { GET_HOTEL_QUERY, GET_POSITION_BY_QUERY } from './queries';
import { CREATE_WORKORDER, UPDATE_WORKORDER } from './mutations';
import ShiftsData from '../../data/shitfs.json';

class WorkOrdersPositionView extends Component {
	render() {
		return (
			<div>
				<Dialog maxWidth="lg" open={false} onClose={this.props.handleCloseModal}>
					<DialogTitle style={{ padding: '0px' }}>
						<div className="modal-header">
							<h5 className="modal-title">Work Order View</h5>
						</div>
					</DialogTitle>
					<DialogContent />
				</Dialog>
			</div>
		);
	}
}

export default withStyles()(withMobileDialog()(withApollo(WorkOrdersPositionView)));
