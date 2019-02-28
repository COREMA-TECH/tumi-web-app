import React from 'react';
import WorkOrdersPositionTable from 'WorkOrdersPosition/WorkOrdersPositionTable';
import { Bar } from 'react-chartjs-2';
import WorkOrdersPositionForm from 'WorkOrdersPosition/WorkOrdersPositionForm';
import withGlobalContent from 'Generic/Global';
import { timeElapsed } from '../HotelManager/Queries';
import withApollo from "react-apollo/withApollo";
import WorkOrdersTable from 'WorkOrders/WorkOrdersTable';
import WorkOrdersForm from 'WorkOrders/WorkOrdersForm';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";

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
		}
	}
];

class DashboardRecruiter extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			timeElapsed: [],
			showAll: false,
			openModal: false,
			openLife: false,
			catalogs: [],
			phases: [],
			notShow: 0,
			disqualified: 0,
			filterValue: 0
		};
	}

	handleClickOpenModal = (event) => {
		event.preventDefault();
		this.setState({ openModal: true, openLife: false, item: null });
	};
	handleCloseModal = (e) => {
		e.preventDefault();
		this.setState({ openModal: false, openLife: false });
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

	componentWillMount() {
		this.getElapsed();
	}

	getElapsed = () => {
		this.props.client.query({
			query: timeElapsed,
			fetchPolicy: "no-cache",
		}).then(({ data }) => {
			this.setState({
				timeElapsed: data.timeElapsed
			});
		}).catch(error => {
			this.setState({
				loading: false
			})
		})
	}

	render() {
		if (this.state.loading) {
			return (
				<LinearProgress />
			)
		}
		return (
			<div className="row WorkOrder">
				<div className="col-md-12">
					<WorkOrdersTable
						status={4}
						filter={this.state.filterValue}
						onEditHandler={this.onEditHandler}
						onLifeHandler={this.onLifeHandler}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
						rowsPerPage={5}
					/>

				</div>

				<div className="col-md-12 col-lg-4">
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

				<div className="col-md-12 col-lg-4">
					<div className="card">
						<div className="card-header danger">Chart</div>
						<div className="card-body">
							<Bar data={data} width={100} height={200} plugins={plugins} options={options} />
						</div>
					</div>
				</div>

				<div className="col-lg-4">
					<div className="card">
						<div className="card-header info">FULFILLMENT STATS</div>
						<div className="card-body">
							<ul className="list-group list-group-flush">
								{this.state.timeElapsed.slice(0, 5).map((timeElapsed) => {
									return (
										<li className="list-group-item d-flex justify-content-between align-items-center">
											<span className="font-weight-bold">{timeElapsed.WorkOrderId}</span>	{timeElapsed.Full_Name}
											<span class="badge badge-primary"> {timeElapsed.TimeElapsed}</span>
										</li>
									)
								})}
							</ul>
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

export default withApollo(withGlobalContent(DashboardRecruiter));
