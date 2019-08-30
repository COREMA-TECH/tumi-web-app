import React, { Component } from 'react';
import './index.css';

class InputForm extends Component {

	isNumberKey = (e) => {
		if (e.target.type == "number") {
			e = e || window.event;
			var charCode = (typeof e.which == "undefined") ? e.keyCode : e.which;
			var charStr = String.fromCharCode(charCode);

			if (!charStr.match(/^[0-9]*\.?[0-9]*$/))
				e.preventDefault();
		}
	}

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
					disabled={this.props.disabled}
					onKeyPress={this.isNumberKey}
					onChange={(event) => {
						if (event.target.value.toString().length > this.props.maxLength) return false;
						if (this.props.type == 'number') {
							if (this.props.allowZero != null && this.props.allowZero == false)
								event.target.value = parseFloat(event.target.value);
						}
						this.props.change(event.target.value);
					}}
					required={this.props.required}
				/>
			);
		}
	}
}

export default InputForm;
