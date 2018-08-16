import React, { Component } from 'react';
import FullWidthTabs from '../../FullWidthTabs/FullWidthTabs';
import './index.css';
import { Redirect } from 'react-router-dom';
class CreateCompany extends Component {
	render() {
		const idCompany = this.props.location.state.idCompany;
		if (!idCompany) return <Redirect to="/" />;
		return (
			<div className="create-company-container">
				<FullWidthTabs />
			</div>
		);
	}
}

export default CreateCompany;
