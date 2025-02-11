import React, { Component } from 'react';
import './index.css';
import { Route } from 'react-router-dom';
import CompanyList from '../../Company/CompanyList/';
import HotelList from '../../Company/HotelList/';
import CreateCompany from '../../Company/CreateCompany/CreateCompany';
import Contract from '../../Contract/Contract';
import CreateRole from '../../Security/Roles';
import CreateForms from '../../Security/Forms';
import CreateRolesForms from '../../Security/RolesForms';
import CreateUsers from '../../Security/Users';
import Catalogs from '../../Catalogs/';
import Signature from '../../Contract/Signature';
import MainContract from '../../Contract/Main/MainContract/MainContract';
import ApplicationList from 'ApplyForm/ApplicationList/ApplicationList';
import ApplicationRecruiter from 'ApplyForm-Recruiter/ApplicationList/ApplicationList';
import ApplicationInfo from 'ApplyForm/Application/ApplicationInfo';
import ApplicationInfoFast from 'ApplyForm-Recruiter/Application/ApplicationInfo';
import ApplicantDocument from 'ApplyForm/Application/ApplicantDocuments/ApplicantDocument.js';
import ApplicationTabs from '../../ApplyForm/Application/ApplicationTabs';
import WorkOrders from '../../WorkOrders';
import WorkOrdersPosition from '../../WorkOrdersPosition';
import ResetPassword from '../../ResetPassword/ResetPassword';
import Board from '../../Board-Manager/BoardManager';
import BoardRecruiter from '../../Board-Recruiter/BoardRecruiter';
import withApollo from 'react-apollo/withApollo';
import { GET_ROLES_FORMS, GET_ROLES, GET_FORMS_QUERY } from '../Queries';
import withGlobalContent from '../../Generic/Global';
import NotFound from '../../NotFound/NotFound';
import DashboardManager from '../../Dashboard/TumiManager';
import DashboardHotel from '../../Dashboard/HotelManager';
import DashboardRecruiter from '../../Dashboard/Recruiter';
import Holidays from '../../Holidays';
import Calendar from '../../Holidays/Calendar';
import Employees from "../../Employees/Employees";
import Schedules from '../../Schedules';
import Property_Schedules from "../../ManagerHotel/Schedules"
import SchedulesAccept from '../../Schedules/SchedulesAccept';
import Region from "../../Region";
import RegionTable from "../../Region/RegionTable";
import RecruiteReport from '../../RecruiterReport';
import TimeCardTable from '../../TimeCard/TimeCardTable';
import TimeCard from '../../TimeCard';
import PayRoll from "../../Security/PayRoll/PayRoll";
import PunchesReportConsolidated from '../../PunchesReportConsolidated';
import PunchesReport from '../../PunchesReport';
import PunchesReportDetail from '../../PunchesReportDetail';
import ApprovePunches from '../../ApprovePunchesReport';
import DashBoardSponsor from '../../Dashboard/Sponsor';
import PositionCatalogTable from '../../PositionsCatalog/PositionsTable';
import DepartmentsCatalogTable from '../../DepartmentsCatalog/DepartmentsTable';
import TransactionLogs from '../../TransactionLogs';
import EmployeesProperties from '../../EmployeesProperties';
import EmployeesPropertiesConsolidated from '../../EmployeesProperties/TableConsolidated';
import Visit from '../../Visit';
import SchedulesvsWorkedHours from '../../SchedulesvsWorkedHours';
import DirectDeposit from '../../DirectDeposit';
import OperationsDashboard from '../../Dashboard/Operations';
import { Redirect } from 'react-router-dom'


class Container extends Component {
	constructor(props) {
		super(props);

		this.state = {
			userLoggedRol: 1,
			dataRolForm: [],
			dataForm: []
		};
	}

	getRolesFormsInfo = () => {
		this.setState(
			{
				loading: true
			},
			() => {

				this.props.client
					.query({
						query: GET_ROLES_FORMS
					})
					.then(({ data }) => {

						this.setState({
							dataRolForm: data.rolesforms,
							loading: false
						});
					})
					.catch((error) => {
						this.setState({
							loading: false
						});

						this.props.handleOpenSnackbar(
							'error',
							'Error to get data. Please, try again!',
							'bottom',
							'right'
						);
					});
			}
		);
	};

	getFormsInfo = () => {
		this.setState(
			{
				loading: true
			},
			() => {
				this.props.client
					.query({
						query: GET_FORMS_QUERY,
						variables: {
							Id: this.state.roles[0].default_form_id
						}
					})
					.then(({ data }) => {
						this.setState({
							dataForm: data.getforms,
							loading: false
						});
					})
					.catch((error) => {
						this.setState({
							loading: false
						});

						this.props.handleOpenSnackbar(
							'error',
							'Error to get data. Please, try again!',
							'bottom',
							'right'
						);
					});
			}
		);
	};

	getRoles = () => {
		this.setState({ loading: true },
			() => {
				this.props.client.query({
					query: GET_ROLES,
					variables: {
						id: parseInt(localStorage.getItem("IdRoles"))
					},
					fetchPolicy: 'no-cache'
				}).then(({ data }) => {
					this.setState({
						roles: data.roles,
						loading: false
					}, _ => {
						if (this.state.roles[0].default_form_id)
							this.getFormsInfo();
					});
				}).catch((error) => {
					this.setState({
						loading: false
					});

					this.props.handleOpenSnackbar(
						'error',
						'Error to get data. Please, try again!',
						'bottom',
						'right'
					);
				});
			}
		);
	};


	componentWillMount() {
		this.getRolesFormsInfo();
		this.getRoles();
	}

	render() {
		if (this.state.loading) {
			return <div className="container-fluid" />;
		}

		if (window.location.pathname === '/home' && this.state.dataForm[0])
			return <Redirect to={this.state.dataForm[0].Value} />

		return (
			<div className="container-fluid">
				<Route exact path="/home/company" component={CompanyList} />
				<Route exact path="/home/Properties" component={HotelList} />
				<Route exact path="/home/contracts" component={MainContract} />
				<Route exact path="/home/employees" component={Employees} />
				<Route exact path="/home/board/manager" component={Board} />
				<Route exact path="/home/dashboard/recruiter" component={DashboardRecruiter} />
				<Route exact path="/home/dashboard/manager" component={DashboardManager} />
				<Route exact path="/home/board/recruiter" component={BoardRecruiter} />
				<Route exact path="/home/application" component={ApplicationList} />
				<Route exact path="/home/work-orders" component={WorkOrders} />
				<Route exact path="/home/schedules" component={Schedules} />
				<Route exact path="/home/property/schedules" component={Property_Schedules} />
				<Route exact path="/home/openings" component={WorkOrdersPosition} />
				<Route exact path="/home/catalogs" component={Catalogs} />
				<Route exact path="/home/Roles" component={CreateRole} />
				<Route exact path="/home/Forms" component={CreateForms} />
				<Route exact path="/home/RolesForms" component={CreateRolesForms} />
				<Route exact path="/home/Users" component={CreateUsers} />
				<Route exact path="/home/payroll" component={PayRoll} />
				<Route exact path="/home/calendar" component={Calendar} />
				<Route exact path="/home/application/info" component={ApplicationTabs} />
				<Route exact path="/home/recruiter" component={ApplicationRecruiter} />
				<Route exact path="/home/recruiter/report" component={RecruiteReport} />
				<Route exact path="/home/application/Form" component={ApplicationInfoFast} />
				<Route exact path="/home/contract/add" component={Contract} />
				<Route exact path="/home/contract/edit" component={Contract} />
				<Route exact path="/home/dashboard/hotel" component={DashboardHotel} />
				<Route exact path="/home/company/edit" component={CreateCompany} />
				<Route exact path="/home/company/add" component={CreateCompany} />
				<Route exact path="/Reset" component={ResetPassword} />
				{/*<Route exact path="/home/signature" component={Signature} />*/}
				<Route exact path="/home/schedules-accept/:accept/:id" component={SchedulesAccept} />
				<Route exact path="/home/region" component={Region} />
				<Route exact path="/home/regiontable" component={RegionTable} />
				<Route exact path="/home/punches/report/consolidated" component={PunchesReportConsolidated} />
				<Route exact path="/home/punches/report" component={PunchesReport} />
				<Route exact path="/home/punches/report/detail" component={PunchesReportDetail} />
				<Route exact path="/home/notfound" component={NotFound} />
				<Route exact path="/home/timecard" component={TimeCard} />
				<Route exact path="/home/timecardtable" component={TimeCardTable} />
				<Route exact path="/home/approve-punches" component={ApprovePunches} />
				<Route exact path="/home/dashboard/sponsor" component={DashBoardSponsor} />
				<Route exact path="/home/catalogs/positions" component={PositionCatalogTable} />
				<Route exact path="/home/catalogs/departments" component={DepartmentsCatalogTable} />
				<Route exact path="/home/logs" component={TransactionLogs} />		
				<Route exact path="/home/active-report" component={EmployeesProperties} />	
				<Route exact path="/home/active-report-consolidated" component={EmployeesPropertiesConsolidated} />		
				<Route exact path="/home/hotel-manager-report" component={EmployeesPropertiesConsolidated} />		
        		<Route exact path="/home/visit" component={Visit} />
				<Route exact path="/home/schedules-vs-worked" component={SchedulesvsWorkedHours} />
				<Route exact path="/home/direct-deposit" component={DirectDeposit} />
				<Route exact path="/home/dashboard/operations" component={OperationsDashboard} />
			</div>
		);
	}
}

export default withApollo(withGlobalContent(Container));
