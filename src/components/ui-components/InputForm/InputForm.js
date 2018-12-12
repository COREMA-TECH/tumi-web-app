import React, { Component } from 'react';
import './index.css';

class InputForm extends Component {
	render() {
		{
			return (
				<input
					type={this.props.type}
					id={this.props.id}
					name={this.props.name}
					value={this.props.value}
					className={this.props.error ? 'form-control _invalid' : 'form-control'}
					placeholder={this.props.placeholder}
					//	maxLength={this.props.maxLength}
					//	min={this.props.type == 'number' ? 0 : null}
					//	placeholder={this.props.placeholder}
					//disabled={this.props.disabled}
					onChange={(event) => {
						if (event.target.value.toString().length > this.props.maxLength) return false;
						if (this.props.type == 'number') {
							if (this.props.allowZero != null && this.props.allowZero == false)
								event.target.value = parseFloat(event.target.value);
						}
						this.props.change(event.target.value);
					}}
				/>
			);
		}
	}
}

export default InputForm;
