import React, { Component } from 'react';
import './index.css';
import { Route } from 'react-router-dom';
import CompanyList from '../../Company/CompanyList/';
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
import ApplicationRecruiter from 'ApplyForm-Recruiter/Stepper/StepperApplyForm';
import ApplicationInfo from 'ApplyForm/Application/ApplicationInfo';

class Container extends Component {
	render() {
		return (
			<div className="container">
				<Route exact path="/home/application/info" component={ApplicationInfo} />
				<Route exact path="/home/contract/add" component={Contract} />
				<Route exact path="/home/contracts" component={MainContract} />
				<Route exact path="/home/company" component={CompanyList} />
				<Route exact path="/home/company/edit" component={CreateCompany} />
				<Route exact path="/home/company/add" component={CreateCompany} />
				<Route exact path="/home/application" component={ApplicationList} />
				<Route exact path="/home/recruiter" component={ApplicationRecruiter} />

				<Route exact path="/home/Roles" component={CreateRole} />
				<Route exact path="/home/RolesForms" component={CreateRolesForms} />
				<Route exact path="/home/Forms" component={CreateForms} />
				<Route exact path="/home/Users" component={CreateUsers} />
				<Route exact path="/home/catalogs" component={Catalogs} />
				<Route exact path="/home/signature" component={Signature} />
			</div>
		);
	}
}

export default Container;
