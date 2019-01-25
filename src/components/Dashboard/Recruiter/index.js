import React from 'react';
import WorkOrdersPositionTable from 'WorkOrdersPosition/WorkOrdersPositionTable';
import { Bar } from 'react-chartjs-2';
import WorkOrdersPositionForm from 'WorkOrdersPosition/WorkOrdersPositionForm';
import withGlobalContent from 'Generic/Global';

const data = {
	datasets: [
		{
			label: 'Leads',
			type: 'line',
			data: [51, 65, 40, 49, 60, 37, 40],
			fill: false,
			borderColor: '#EC932F',
			backgroundColor: '#EC932F',
			pointBorderColor: '#EC932F',
			pointBackgroundColor: '#EC932F',
			pointHoverBackgroundColor: '#EC932F',
			pointHoverBorderColor: '#EC932F',
			yAxisID: 'y-axis-2'
		},
		{
			type: 'bar',
			label: 'Candidates',
			data: [200, 185, 590, 621, 250, 400, 95],
			fill: false,
			backgroundColor: '#71B37C',
			borderColor: '#71B37C',
			hoverBackgroundColor: '#71B37C',
			hoverBorderColor: '#71B37C',
			yAxisID: 'y-axis-1'
		}
	]
};

const options = {
	responsive: true,
	maintainAspectRatio: false,
	labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
	tooltips: {
		mode: 'label'
	},
	elements: {
		line: {
			fill: false
		}
	},
	scales: {
		xAxes: [
			{
				display: true,
				gridLines: {
					display: false
				},
				labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July']
			}
		],
		yAxes: [
			{
				type: 'linear',
				display: true,
				position: 'left',
				id: 'y-axis-1',
				gridLines: {
					display: false
				},
				labels: {
					show: true
				}
			},
			{
				type: 'linear',
				display: true,
				position: 'right',
				id: 'y-axis-2',
				gridLines: {
					display: false
				},
				labels: {
					show: true
				}
			}
		]
	}
};

const plugins = [
	{
		afterDraw: (chartInstance, easing) => {
			const ctx = chartInstance.chart.ctx;
			//	ctx.fillText('This text drawn by a plugin', 100, 100);
		}
	}
];

class DashboardRecruiter extends React.Component {
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
                    <h3 className="text-success">Work Orders</h3>
					<div className="card">
						<div className="card-body">
							<div className="row">
								{/*
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
							*/}

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

					<WorkOrdersPositionTable
						onEditHandler={this.onEditHandler}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
					/>
				</div>
				<div className="col-md-12 col-lg-7">
					<div className="card">
						<div className="card-header info">Quick Access</div>
						<div className="row">

							<div className="col-md-2 col-lg-2">
								<a href="/home/board/recruiter" className="text-center d-block">
									<img src="/icons/actions/notepad-3.svg" alt="" className="w-50" />
									<span className="d-block">Go to board</span>
								</a>
							</div>
						</div>
					</div>
				</div>
				{/*
				<div className="col-md-12 col-lg-7">
					<div className="card">
						<div className="card-header info">Quick Access</div>
						<div className="row">
							<div className="col-md-4 col-lg-6">
								<a href="/home/board/recruiter" className="card bg-gd-info QuickButton">
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
				*/}

				<div className="col-md-12 col-lg-5">
					<div className="card">
						<div className="card-header danger">Chart</div>
						<div className="card-body">
							<Bar data={data} width={100} height={200} plugins={plugins} options={options} />
						</div>
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

export default withGlobalContent(DashboardRecruiter);
