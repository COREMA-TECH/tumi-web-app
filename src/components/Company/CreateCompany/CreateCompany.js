import React, { Component } from 'react';
import './index.css';
import Stepper from '../../Stepper/Stepper';

class CreateCompany extends Component {
	render() {
		return (
			<div className="create-company-container">
				<Stepper />
			</div>
		);
	}
}

export default CreateCompany;
