import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import green from '@material-ui/core/colors/green';

const styles = (theme) => ({
	root: {
		display: 'flex',
		alignItems: 'center'
	},
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},
	buttonSuccess: {
		backgroundColor: '#357a38',
		color: 'white',
		'&:hover': {
			backgroundColor: green[700]
		}
	},
	fabProgress: {
		color: green[500],
		position: 'absolute',
		top: -6,
		left: -6,
		zIndex: 1
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	}
});

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.Component {
	timer = null;

	state = {
		open: this.props.open
	};

	componentWillUnmount() {
		clearTimeout(this.timer);
	}

	render() {
		const { classes } = this.props;
		return (
			<Dialog
				open={this.props.open}
				TransitionComponent={Transition}
				keepMounted
				onClose={this.props.handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				<DialogTitle id="alert-dialog-slide-title">{'Delete this record?'}</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-slide-description">Once you delete the record, it can not be undone</DialogContentText>
				</DialogContent>
				<DialogActions>
					<div className={classes.wrapper}>
						<Button
							onClick={this.props.handleConfirm}
							variant="contained"
							className={classes.buttonSuccess}
							disabled={this.props.loadingConfirm}
						>
							Delete
						</Button>

						{this.props.loadingConfirm && <CircularProgress size={24} className={classes.buttonProgress} />}
					</div>
					<Button onClick={this.props.handleClose} color="secondary" variant="contained">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}

AlertDialogSlide.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AlertDialogSlide);
