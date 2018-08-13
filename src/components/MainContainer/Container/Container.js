import React, { Component } from 'react';
import './index.css';
import { Route } from 'react-router-dom';
import CompanyList from '../../Company/CompanyList/';

class Container extends Component {
	render() {
		return (
			<div className="container">
				<Route exact path="/company" component={CompanyList} />
			</div>
		);
	}
}

export default Container;
