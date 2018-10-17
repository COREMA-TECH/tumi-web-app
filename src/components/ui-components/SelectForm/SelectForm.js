import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const uuidv4 = require('uuid/v4');

const styles = (theme) => ({
	formControl: {
		font: '400 0.8em Arial',
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

		this.state = {
			age: '',
			open: false,
			showNone: props.showNone == null ? true : props.showNone,
			noneName: props.noneName || 'None'
		};
	}

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

		return (
			<form autoComplete="off">
				<FormControl className="form-control default">
					<Select
						className={
							this.props.error ? (
								[classes.formControl, classes.selectError].join(' ')
							) : (
									[classes.formControl, classes.select].join(' ')
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
						readOnly={this.props.readOnly}
					>
						{this.state.showNone && (
							<MenuItem
								key={0}
								value={0}
								name={this.state.noneName}
								className="select-form-customized__item "
							>
								<em>{this.state.noneName}</em>
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
