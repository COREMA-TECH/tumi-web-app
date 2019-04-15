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
						disabled={this.props.disabled}
						className={
							this.props.error ? 'form-control _invalid' : 'form-control'
						}
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
						disabled={this.props.disabled}
						className={
							this.props.error ? 'form-control _invalid' : 'form-control'
						}
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
