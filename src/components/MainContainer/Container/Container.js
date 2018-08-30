import React, { Component } from 'react';
import './index.css';
import { Route } from 'react-router-dom';
import CompanyList from '../../Company/CompanyList/';
import CreateCompany from '../../Company/CreateCompany/CreateCompany';
import CreateRole from '../../Security/Roles';
import CreateForms from '../../Security/Forms';
import CreateUsers from '../../Security/Users';
import Catalogs from '../../Catalogs/Catalogs';

class Container extends Component {
	render() {
		return (
			<div className="container">
				<Route exact path="/company" component={CompanyList} />
				<Route exact path="/company/add" component={CreateCompany} />
				<Route exact path="/company/edit" component={CreateCompany} />
				<Route exact path="/Roles" component={CreateRole} />
				<Route exact path="/Forms" component={CreateForms} />
				<Route exact path="/Users" component={CreateUsers} />
				<Route exact path="/catalogs" component={Catalogs} />
			</div>
		);
	}
}

export default Container;
