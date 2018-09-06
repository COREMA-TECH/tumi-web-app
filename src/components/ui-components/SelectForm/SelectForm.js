import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import './index.css';
import { select } from 'async';
const uuidv4 = require('uuid/v4');

const styles = (theme) => ({
	formControl: {
		font: '400 13.3333px Arial',
		border: '1px solid #E6E6E6',
		borderRadius: '5px',
		borderBottom: '1px solid'
	},
	select: { border: '1px solid #E6E6E6' },
	selectError: {
		borderBottomColor: 'red'
	}
});

class ControlledOpenSelect extends React.Component {
	constructor(props) {
		super(props);

		if (props.showNone != null) this.state = { showNone: props.showNone };
	}

	state = {
		age: '',
		open: false,
		showNone: true
	};

	handleChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });

		this.props.update(event.target.value);
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	handleOpen = () => {
		this.setState({ open: true });
	};

	render() {
		const { classes } = this.props;
		console.log(this.props.error);
		return (
			<form autoComplete="off">
				<FormControl className="select-form-customized default">
					<Select
						className={
							this.props.error ? (
								[ classes.formControl, classes.selectError ].join(' ')
							) : (
								[ classes.formControl, classes.select ].join(' ')
							)
						}
						disableUnderline
						name={this.props.name}
						id={this.props.id}
						open={this.state.open}
						onClose={this.handleClose}
						onOpen={this.handleOpen}
						value={this.props.value}
						onChange={this.handleChange}
						inputProps={{
							name: 'age'
						}}
						disabled={this.props.disabled}
						classes={{ select: 'select-custom' }}
					>
						{this.state.showNone && (
							<MenuItem key={0} value={0} name="None" className="select-form-customized__item ">
								<em>None</em>
							</MenuItem>
						)}
						{this.props.data.map((item) => {
							return (
								<MenuItem
									key={item.Id}
									value={item.Id}
									name={item.Name}
									className="select-form-customized__item"
								>
									{item.Name}
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
			</form>
		);
	}
}

ControlledOpenSelect.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ControlledOpenSelect);
