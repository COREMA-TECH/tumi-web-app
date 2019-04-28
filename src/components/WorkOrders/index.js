import React, { Component } from 'react';
import WorkOrdersTable from './WorkOrdersTable';
import WorkOrdersForm from './WorkOrdersForm';
import WorkOrdersView from './WorkOrdersView';
import withGlobalContent from 'Generic/Global';
import LifeCycleWorkOrdersTable from './LifeCycleWorkOrdersTable';

class WorkOrders extends Component {
	constructor(props) {
		super(props);

		this.state = {
			data: [],
			openModal: false,
			openLife: false,
			item: null,
			refresh: false
		};
	}

	handleClickOpenModal = () => {
		this.setState({ openModal: true, openLife: false, item: null });
	};
	handleCloseModal = (event) => {
		if (event)
			event.preventDefault();
		this.setState({
			openModal: false, openLife: false

		});
	};

	onEditHandler = (item) => {
		this.setState({
			openModal: true,
			openLife: false,
			item: item
		});
	};

	onLifeHandler = (item) => {
		this.setState({
			openModal: false,
			openLife: true,
			item: item
		});
	};

	toggleRefresh = () => {
        this.setState((prevState) => { return { refresh: !prevState.refresh } })
    }

	render() {
		return (
			<div>
				<div className="row">
					<div className="col-md-12">
						<button className="btn btn-success float-right" onClick={this.handleClickOpenModal}>
							Add Work Order <i className="fas fa-plus"></i>
						</button>
					</div>
				</div>
				<div className="row">
					<div className="col-md-12">
						<WorkOrdersTable
							status={1}
							filter={0}
							onEditHandler={this.onEditHandler}
							onLifeHandler={this.onLifeHandler}
							handleOpenSnackbar={this.props.handleOpenSnackbar}
							rowsPerPage={25}
							refresh={this.state.refresh}
						/>
					</div>
				</div>
				<WorkOrdersForm
					item={this.state.item}
					handleOpenSnackbar={this.props.handleOpenSnackbar}
					openModal={this.state.openModal}
					handleCloseModal={this.handleCloseModal}
					toggleRefresh={this.toggleRefresh}
				/>
				<LifeCycleWorkOrdersTable
					item={this.state.item}
					handleOpenSnackbar={this.props.handleOpenSnackbar}
					openLife={this.state.openLife}
					handleCloseModal={this.handleCloseModal}
				/>
			</div>
		);
	}
}

export default withGlobalContent(WorkOrders);
