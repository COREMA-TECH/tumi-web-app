import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import CreateCompanyForm from '../Company/CreateCompanyForm/CreateCompanyForm';
import ContactCompanyForm from '../Company/ContactCompanyForm/ContactCompanyForm';
import DepartmentsCompanyForm from '../Company/DepartmentsCompanyForm/';
import { Snackbar } from '@material-ui/core';
import { MySnackbarContentWrapper } from '../Generic/SnackBar';
import PositionsCompanyForm from '../Company/PositionsCompanyForm/';
function TabContainer({ children, dir }) {
	return (
		<Typography
			component="div"
			dir={dir}
			style={[
				{
					border: '1px solid #ddd'
				}
			]}
		>
			{children}
		</Typography>
	);
}

TabContainer.propTypes = {
	children: PropTypes.node.isRequired,
	dir: PropTypes.string.isRequired
};

const styles = (theme) => ({
	root: {
		backgroundColor: theme.palette.background.paper,
		width: '100%'
	}
});

class FullWidthTabs extends React.Component {
	state = {
		value: 0,
		openSnackbar: false,
		variantSnackbar: 'info',
		messageSnackbar: 'Dummy text!'
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	handleChangeIndex = (index) => {
		this.setState({ value: index });
	};

	handleText = (message) => {
		alert(message);
	};
	handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ openSnackbar: false });
	};
	handleOpenSnackbar = (variant, message) => {
		this.setState({
			openSnackbar: true,
			variantSnackbar: variant,
			messageSnackbar: message
		});
	};
	render() {
		const { classes, theme } = this.props;

		return (
			<div className={classes.root}>
				<Snackbar
					anchorOrigin={{
						vertical: 'top',
						horizontal: 'center'
					}}
					open={this.state.openSnackbar}
					autoHideDuration={3000}
					onClose={this.handleCloseSnackbar}
				>
					<MySnackbarContentWrapper
						onClose={this.handleCloseSnackbar}
						variant={this.state.variantSnackbar}
						message={this.state.messageSnackbar}
					/>
				</Snackbar>
				<Tabs
					value={this.props.item}
					//onChange={this.props.item}
					indicatorColor="primary"
					textColor="primary"
					fullWidth
				/>
				<SwipeableViews
					axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
					index={this.props.item}
					onChangeIndex={this.handleChangeIndex}
				>
					<TabContainer dir={theme.direction}>
						<div />
						<CreateCompanyForm title="General info" idCompany={this.props.idCompany} />
					</TabContainer>
					<TabContainer dir={theme.direction}>
						<ContactCompanyForm
							idCompany={this.props.idCompany}
							handleOpenSnackbar={this.handleOpenSnackbar}
						/>
					</TabContainer>
					<TabContainer dir={theme.direction}>
						<DepartmentsCompanyForm
							idCompany={this.props.idCompany}
							handleOpenSnackbar={this.handleOpenSnackbar}
						/>
					</TabContainer>
					<TabContainer dir={theme.direction}>
						<PositionsCompanyForm
							idCompany={this.props.idCompany}
							handleOpenSnackbar={this.handleOpenSnackbar}
						/>
					</TabContainer>
				</SwipeableViews>
			</div>
		);
	}
}

FullWidthTabs.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);
