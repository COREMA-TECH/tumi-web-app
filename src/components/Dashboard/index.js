import React from 'react';
import WorkOrdersTable from 'WorkOrders/WorkOrdersTable';
import { Bar } from 'react-chartjs-2';
import WorkOrdersForm from 'WorkOrders/WorkOrdersForm';
import withGlobalContent from 'Generic/Global';

class Dashboard extends React.Component {
	data = {
		labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ],
		datasets: [
			{
				label: 'My First dataset',
				backgroundColor: 'rgba(255,99,132,0.2)',
				borderColor: 'rgba(255,99,132,1)',
				borderWidth: 1,
				hoverBackgroundColor: 'rgba(255,99,132,0.4)',
				hoverBorderColor: 'rgba(255,99,132,1)',
				data: [ 65, 59, 80, 81, 56, 55, 40 ]
			}
		]
	};
	constructor(props) {
		super(props);
		this.state = {
			showAll: false,
			openModal: false
		};
	}

	handleClickOpenModal = (event) => {
		event.preventDefault();
		this.setState({ openModal: true, item: null });
	};
	handleCloseModal = (e) => {
		e.preventDefault();
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
			<div className="row WorkOrder">
				<div className="col-md-12">
					<div className="card">
						<div className="card-body p-0">
							<div className="row">
								<div className="col-xs-3 col-sm-3 col-md-3 col-lg-3 col-xl-2">
									<div className="row p-0">
										<div className="col-12">
											<div className="border-right">
												<label>Show All?</label>
												<div className="onoffswitch">
													<input
														type="checkbox"
														name="showAll"
														onChange={(e) => {
															this.setState({
																showAll: e.target.checked
															});
														}}
														className="onoffswitch-checkbox"
														id="showAll"
														checked={this.state.showAll}
													/>
													<label className="onoffswitch-label" htmlFor="showAll">
														<span className="onoffswitch-inner" />
														<span className="onoffswitch-switch" />
													</label>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-8">
									<div className="row p-0">
										<div className="col-sm-6 col-xs-12">
											<label> Start Date</label>
											<input
												type="date"
												className="form-control"
												placeholder="2018-10-30"
												value="2018-10-30"
											/>
										</div>
										<div className="col-sm-6 col-xs-12">
											<label> End Date</label>
											<input
												type="date"
												className="form-control"
												placeholder="2018-10-30"
												value="2018-10-30"
											/>
										</div>
									</div>
								</div>
								<div className="col-xs-2 col-sm-2 col-md-2 col-lg-2 col-xl-2">
									<div className="btnWrapper-centered pb-1">
										<button className="btn btn-success" type="submit">
											Filter<i className="fas fa-filter ml2" />
										</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					<WorkOrdersTable
						onEditHandler={this.onEditHandler}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
					/>
				</div>
				<div className="col-md-12 col-lg-5">
					<div className="card">
						<div className="card-header info">Quick Access</div>
						<div className="row">
							<div className="col-md-4 col-lg-6">
								<a
									href=""
									className="card bg-gd-danger QuickButton"
									onClick={this.handleClickOpenModal}
								>
									<div className="card-body">
										<div>
											<i className="fas fa-plus fa-5x" />
										</div>
										<span>Add Work Order</span>
									</div>
								</a>
							</div>
							<div className="col-md-4 col-lg-6">
								<a href="/home/board" className="card bg-gd-info QuickButton">
									<div className="card-body">
										<div>
											<i className="fas fa-tv fa-5x" />
										</div>
										<span>Go to board</span>
									</div>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-12 col-lg-7">
					<div className="card">
						<div className="card-header danger">Chart</div>
						<div className="card-body">
							<Bar
								data={this.data}
								width={100}
								height={200}
								options={{
									maintainAspectRatio: false
								}}
							/>
						</div>
					</div>
				</div>
				<WorkOrdersForm
					item={this.state.item}
					handleOpenSnackbar={this.props.handleOpenSnackbar}
					openModal={this.state.openModal}
					handleCloseModal={this.handleCloseModal}
				/>
			</div>
		);
	}
}

export default withGlobalContent(Dashboard);
