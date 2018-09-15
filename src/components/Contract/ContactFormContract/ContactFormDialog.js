import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import ContactCompanyForm from '../../Company/ContactCompanyForm/ContactCompanyForm';
import withGlobalContent from 'Generic/Global';
import Button from '@material-ui/core/es/Button/Button';

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
			<div>
				<span className="add-management-contact" onClick={this.handleClickOpen}>
					<span>New Contact</span>
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
							<Button color="inherit" onClick={this.handleClose}>
								Finish
							</Button>
						</Toolbar>
					</AppBar>
					<ContactCompanyForm
						idCompany={this.props.idContact}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
						item={this.state.item}
						next={this.nextHandleChange}
						back={this.backHandleChange}
						valueTab={this.state.value}
						showStepper={this.state.showStepper}
						toggleStepper={this.toggleStepper}
					/>
				</Dialog>
			</div>
		);
	}
}

FullScreenDialog.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withGlobalContent(FullScreenDialog));
