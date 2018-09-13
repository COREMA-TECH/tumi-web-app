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
					className={this.props.error ? 'input-form _invalid' : 'input-form'}
					maxLength={this.props.maxLength}
					placeholder={this.props.placeholder && ''}
					disabled={this.props.disabled}
					onChange={(event) => {
						if (event.target.value.toString().length > this.props.maxLength) return false;
						if (this.props.type == 'number') {
							if (event.target.value == '') event.target.value = 0;
							else {
								event.target.value = parseFloat(event.target.value);
							}
						}
						this.props.change(event.target.value);
					}}
				/>
			);
		}
	}
}

export default InputForm;
