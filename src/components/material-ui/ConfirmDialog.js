import React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';
import CircularProgress from './CircularProgress';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const spanishActions = require(`ApplyForm/Application/languagesJSON/${localStorage.getItem(
	'languageForm'
)}/spanishActions`);

const styles = (theme) => ({
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},

	buttonProgress: {
		//		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	}
});

class ConfirmDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}
	// To open the skill dialog
	handleClickOpen = () => {
		this.setState({ open: true });
	};

	// To close the skill dialog
	handleClose = () => {
		this.setState({
			open: false
		});
	};

	componentWillReceiveProps(nextProps) {
		this.setState({ open: nextProps.open });
	}

	render() {
		const { classes } = this.props;

		return (
			<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
				<DialogTitle>{this.props.title}</DialogTitle>
				<DialogContent />
				<DialogActions>
					<button className="applicant-card__cancel-button" onClick={this.handleClose}>
						{spanishActions[2].label}
					</button>
					<button
						className="applicant-card__save-button"
						onClick={() => {
							this.props.confirmAction();
						}}
					>
						{this.props.loading && <i class="fa fa-spinner fa-spin" />}
						{spanishActions[3].label}
					</button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default withStyles(styles)(ConfirmDialog);
