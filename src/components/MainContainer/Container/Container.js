import React, { Component } from 'react';
import './index.css';
import { Route } from 'react-router-dom';
import CompanyList from '../../Company/CompanyList/';
import CreateCompany from '../../Company/CreateCompany/CreateCompany';

class Container extends Component {
	render() {
		return (
			<div className="container">
				<Route exact path="/company" component={CompanyList} />
				<Route exact path="/company/add" component={CreateCompany} />
			</div>
		);
	}
}

export default Container;
