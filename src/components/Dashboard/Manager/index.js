import React from 'react';
import WorkOrdersTable from 'WorkOrders/WorkOrdersTable';
import { Pie } from 'react-chartjs-2';
import WorkOrdersForm from 'WorkOrders/WorkOrdersForm';
import withGlobalContent from 'Generic/Global';
import './index.css';
import NotShowApplicantsTable from "./NotShowApplicantsTable";
import withApollo from "react-apollo/withApollo";
import {GET_CATALOG} from "./Queries";

class DashboardManager extends React.Component {
	data = {
		labels: ['Banquet', 'Housemen', 'Cook'],
		datasets: [
			{
				label: 'Demand for positions',
				data: [300, 50, 100],
				backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
				hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
			}
		]
	};
	constructor(props) {
		super(props);
		this.state = {
			showAll: false,
			openModal: false,
			catalogs: [],
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

	/**
	 * Get catalogs from API
	 * */
	getApplicantStatsCodes = () => {
		this.props.client
			.query({
				query: GET_CATALOG
			})
			.then(({data}) => {
				this.setState({
                    catalogs: data.getcatalogitem[0]
				}, () => {
					console.table(this.state);
				})
			})
			.catch(error => {

			})
	};

	componentWillMount() {
		this.getApplicantStatsCodes();
	}

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
					<div className="row">
						<div className="col-md-12">
                            <WorkOrdersTable
                                onEditHandler={this.onEditHandler}
                                handleOpenSnackbar={this.props.handleOpenSnackbar}
                            />
						</div>

                        {/*<div className="col-md-6">*/}
							{/*<NotShowApplicantsTable*/}
                                {/*onEditHandler={this.onEditHandler}*/}
                                {/*handleOpenSnackbar={this.props.handleOpenSnackbar}*/}
							{/*/>*/}
                        {/*</div>*/}
					</div>
				</div>
                <div className="col-md-12">
                    <div className="card">
                        <div className="row stat-header">
                            <div className="col-md-12">
                                <h3 className="text-success">Stats</h3>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-2">
                                <div className="stat-card">
                                    <div className="stat-description">Not Show</div>
                                    <div className="stat-number">20</div>
                                </div>
                            </div>
                            <div className="col-md-2">
                                <div className="stat-card">
                                    <div className="stat-description">Disqualified</div>
                                    <div className="stat-number stat-number--secondary">150</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
				<div className="col-md-12 col-lg-7">
					<div className="card">
						<div className="card-header info">Quick Access</div>
						<div className="row">
							<div className="col-md-2 col-lg-2">
								<a href="" className="text-center d-block" onClick={this.handleClickOpenModal}>
									<img src="/icons/actions/list.svg" alt="" className="w-50" />
									<span className="d-block">Add Work Order</span>
								</a>
							</div>
							<div className="col-md-2 col-lg-2">
								<a href="/home/board/manager" className="text-center d-block">
									<img src="/icons/actions/notepad-3.svg" alt="" className="w-50" />
									<span className="d-block">Go to board</span>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-12 col-lg-5">
					<div className="card">
						<div className="card-header danger">Demand for positions</div>
						<div className="card-body">
							<Pie
								data={this.data}
								width={200}
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

export default withGlobalContent(withApollo(DashboardManager));
