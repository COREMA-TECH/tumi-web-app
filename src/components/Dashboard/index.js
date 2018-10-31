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

	handleClickOpenModal = () => {
		this.setState({ openModal: true });
	};
	handleCloseModal = (e) => {
		e.preventDefault();
		this.setState({ openModal: false });
	};

	render() {
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="card mt-0">
						<div className="card-header">Work Orders</div>
						<div className="card-body p-0">
							<div className="row pt-2 pb-2 pl-2 pr-0">
								<div className="col-sm-3 col-lg-2 col-md-2 border-right">
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

								<div className="col-md-3 col-lg-3">
									<label> Start Date</label>
									<input
										type="date"
										className="form-control"
										placeholder="2018-10-30"
										value="2018-10-30"
									/>
								</div>
								<div className="col-md-3 col-lg-3">
									<label> End Date</label>
									<input
										type="date"
										className="form-control"
										placeholder="2018-10-30"
										value="2018-10-30"
									/>
								</div>
							</div>

							<div className="row">
								<div className="col-sm-12">
									<WorkOrdersTable />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-12 col-lg-5">
					<div className="card mt-0">
						<div className="card-header info">Quick Actions</div>
						<div className="card-body">
							<ul className="row">
								<li
									className="btn btn-primary ml-2 btn-lg  col-sm-4 col-lg-3 mt-2 p-3"
									onClick={this.handleClickOpenModal}
								>
									<i className="fas fa-plus fa-2x" />
									<br />
									<p className="text-white">
										<small>Add Work Order</small>
									</p>
								</li>

								<li className="btn btn-success ml-2 btn-lg  col-sm-4 col-lg-3 mt-2 p-3">
									<i className="fas fa-tv fa-2x" />
									<br />
									<p className="text-white">
										<small>Go to board</small>
									</p>
								</li>
							</ul>
						</div>
					</div>
				</div>
				<div className="col-md-12 col-lg-7">
					<div className="card mt-0">
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
					item={null}
					handleOpenSnackbar={this.props.handleOpenSnackbar}
					openModal={this.state.openModal}
					handleCloseModal={this.handleCloseModal}
				/>
			</div>
		);
	}
}

export default withGlobalContent(Dashboard);
