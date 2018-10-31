import React from 'react';
import WorkOrdersTable from 'WorkOrders/WorkOrdersTable';

class Dashboard extends React.Component {
	render() {
		return (
			<div className="row">
				<div className="col-md-12">
					<div className="card mt-0">
						<div className="card-header">List of Work Orders</div>
						<div className="card-body">
							<WorkOrdersTable />
						</div>
					</div>
				</div>
				<div className="col-md-12 col-lg-5">
					<div className="card mt-0">
						<div className="card-header info">Quick Actions</div>
						<div className="card-body">
							<ul className="row">
								<li class="btn btn-primary ml-2 btn-lg  col-sm-4 col-lg-3 mt-2 p-3">
									<i class="fas fa-plus fa-2x" />
									<br />
									<p className="text-white">
										<small>Add Work Order</small>
									</p>
								</li>

								<li class="btn btn-success ml-2 btn-lg  col-sm-4 col-lg-3 mt-2 p-3">
									<i class="fas fa-tv fa-2x" />
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
						<div className="card-body">Body</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Dashboard;
