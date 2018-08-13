import React, { Component } from 'react';
import CompanyCard from '../CompanyCard/';
import './index.css';

class CompanyList extends Component {
	render() {
		return (
			<div className="company-list">
				<CompanyCard />
				<CompanyCard />
				<CompanyCard />
				<CompanyCard />
				<CompanyCard />
				<CompanyCard />
				<CompanyCard />
				<CompanyCard />
				<CompanyCard />
			</div>
		);
	}
}

export default CompanyList;
