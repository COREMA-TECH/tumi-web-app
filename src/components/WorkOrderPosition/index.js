import React, { Component } from 'react';
import WorkOrdersPositionTable from './WorkOrdersPositionTable';
import WorkOrdersPositionForm from './WorkOrdersPositionForm';
import withGlobalContent from 'Generic/Global';

class WorkOrdersPosition extends Component {
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
						<button className="btn btn-success float-right" onClick={this.handleClickOpenModal}>
							Add Work Order <i className="fas fa-plus" />
						</button>
					</div>
				</div>
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
			</div>
		);
	}
}

export default withGlobalContent(WorkOrdersPosition);
