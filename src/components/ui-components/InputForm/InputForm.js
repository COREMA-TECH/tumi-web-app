import React, { Component } from 'react';
import './index.css';

class InputForm extends Component {
	render() {
		{
			if (this.props.placeholder) {
				return (
					<input
						type="text"
						id={this.props.id}
						name={this.props.name}
						value={this.props.value}
						className={this.props.error ? 'input-form _invalid' : 'input-form'}
						maxLength={this.props.maxLength}
						placeholder={this.props.placeholder}
						onChange={(event) => {
							this.props.change(event.target.value);
						}}
					/>
				);
			} else {
				return (
					<input
						type="text"
						id={this.props.id}
						name={this.props.name}
						value={this.props.value}
						className={this.props.error ? 'input-form _invalid' : 'input-form'}
						maxLength={this.props.maxLength}
						onChange={(event) => {
							this.props.change(event.target.value);
						}}
					/>
				);
			}
		}
	}
}

export default InputForm;
