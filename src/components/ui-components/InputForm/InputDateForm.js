import React, { Component } from 'react';
import './index.css';

class InputDateForm extends Component {
	render() {
		{
			if (this.props.placeholder) {
				return (
					<input
						type="date"
						value={this.props.value}
						className={this.props.error ? 'input-form _invalid' : 'input-form'}
						placeholder={this.props.placeholder}
						onChange={(event) => {
							this.props.change(event.target.value);
						}}
					/>
				);
			} else {
				return (
					<input
						type="date"
						value={this.props.value}
						className={this.props.error ? 'input-form _invalid' : 'input-form'}
						onChange={(event) => {
							this.props.change(event.target.value);
						}}
					/>
				);
			}
		}
	}
}

export default InputDateForm;
