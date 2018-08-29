import React, { Component } from 'react';
import './index.css';
import { Route } from 'react-router-dom';
import CompanyList from '../../Company/CompanyList/';
import CreateCompany from '../../Company/CreateCompany/CreateCompany';
import Contract from "../../Contract/Contract";

class Container extends Component {
	render() {
		return (
			<div className="container">
				<Route exact path="/contract" component={Contract} />
				<Route exact path="/company" component={CompanyList} />
				<Route exact path="/company/add" component={CreateCompany} />
				<Route exact path="/company/edit" component={CreateCompany} />
			</div>
		);
	}
}

export default Container;
