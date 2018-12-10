import React, { Component } from 'react';
import './index.css';
import FullWithTabs from './../FullWidthTabs/FullWidthTabs';

class CreateCompany extends Component {
	constructor(props) {
		super(props);
	}

	componentWillMount() {

	}

	checkId() {
		let id;

		// If the props id doesn't exist, id = 0
		try {
			return this.props.location.state.idCompany;
		} catch (error) {
			this.props.history.push('/home/');
			return false;
		}
	}

	checkIdContract() {
		let id;

		// If the props id doesn't exist, id = 0
		try {
			return this.props.location.state.idContract;
		} catch (error) {
			this.props.history.push('/home/Company');
			return false;
		}
	}

	render() {
		return (
			<div className="create-company-container">
				<FullWithTabs idCompany={this.checkId()} idContract={this.checkIdContract()} {...this.props} />
			</div>
		);
	}
}

export default CreateCompany;
