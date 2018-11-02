import React, { Component } from 'react';
import WorkOrdersPositionTable from './WorkOrdersPositionTable';
import WorkOrdersPositionForm from './WorkOrdersPositionForm';
import WorkOrdersPositionView from './WorkOrdersPositionView';
import withGlobalContent from 'Generic/Global';

class WorkOrders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			openModal: false,
			item: null
		};
	}

	handleClickOpenModal = () => {
		this.setState({ openModal: true, item: null });
	};
	handleCloseModal = (event) => {
		event.preventDefault();
		this.setState({ openModal: false });
	};

	onEditHandler = (item) => {
		this.setState({
			openModal: true,
			item: item
		});
	};

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<WorkOrdersPositionTable
							onEditHandler={this.onEditHandler}
							handleOpenSnackbar={this.props.handleOpenSnackbar}
						/>
					</div>
				</div>
				<WorkOrdersPositionForm
					item={this.state.item}
					handleOpenSnackbar={this.props.handleOpenSnackbar}
					openModal={this.state.openModal}
					handleCloseModal={this.handleCloseModal}
				/>
				<WorkOrdersPositionView
					item={this.state.item}
					handleOpenSnackbar={this.props.handleOpenSnackbar}
					openModal={this.state.openModal}
					handleCloseModal={this.handleCloseModal}
				/>
			</div>
		);
	}
}

export default withGlobalContent(WorkOrders);
