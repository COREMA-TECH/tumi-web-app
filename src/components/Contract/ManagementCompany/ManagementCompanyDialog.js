import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ManagementCompanyForm from './ManagmentCompanyForm';
import './index.css';

const styles = {
	appBar: {
		position: 'relative',
		background: '#3DA2C7'
	},
	flex: {
		flex: 1
	}
};

function Transition(props) {
	return <Slide direction="up" {...props} />;
}

class FullScreenDialog extends React.Component {
	state = {
		open: false
	};

	handleClickOpen = () => {
		this.setState({ open: true });
	};

	handleClose = () => {
		this.setState({ open: false });
	};

	render() {
		const { classes } = this.props;
		return (
			<div className="management-company-container">
				<span className="add-management-company" onClick={this.handleClickOpen}>
					New Company
				</span>
				<Dialog fullScreen open={this.state.open} onClose={this.handleClose} TransitionComponent={Transition}>
					<AppBar className={classes.appBar}>
						<Toolbar>
							<IconButton color="inherit" onClick={this.handleClose} aria-label="Close">
								<CloseIcon />
							</IconButton>
							<Typography variant="title" color="inherit" className={classes.flex}>
								Management Company
							</Typography>
						</Toolbar>
					</AppBar>
					<ManagementCompanyForm
						closeModal={this.handleClose}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
					/>
				</Dialog>
			</div>
		);
	}
}

FullScreenDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(FullScreenDialog);
