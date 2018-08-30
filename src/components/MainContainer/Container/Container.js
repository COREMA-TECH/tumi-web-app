import React, { Component } from 'react';
import './index.css';
import { Route } from 'react-router-dom';
import CompanyList from '../../Company/CompanyList/';
import CreateCompany from '../../Company/CreateCompany/CreateCompany';
import Catalogs from '../../Catalogs/Catalogs';

class Container extends Component {
	render() {
		return (
			<div className="container">
				<Route exact path="/company" component={CompanyList} />
				<Route exact path="/company/add" component={CreateCompany} />
				<Route exact path="/company/edit" component={CreateCompany} />
				<Route exact path="/catalogs" component={Catalogs} />
			</div>
		);
	}
}

export default Container;
