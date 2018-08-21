import React, { Component } from 'react';
import './index.css';
import Stepper from '../../Stepper/Stepper';

class CreateCompany extends Component {
	constructor(props) {
		super(props);

		this.state = {
			idCompany: this.props.location.state.idCompany
		};
	}
	render() {
		return (
			<div className="create-company-container">
				<Stepper idCompany={this.state.idCompany} />
			</div>
		);
	}
}

export default CreateCompany;
