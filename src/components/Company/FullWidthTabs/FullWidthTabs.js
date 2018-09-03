import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GeneralInformation from '../GeneralInformation/GeneralInformation';
import ContactCompanyForm from '../ContactCompanyForm';
import DepartmentsCompanyForm from '../DepartmentsCompanyForm';
import PositionsCompanyForm from '../PositionsCompanyForm';
import { Snackbar } from '@material-ui/core';
import { MySnackbarContentWrapper } from '../../Generic/SnackBar';

import './index.css';

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper
	},
	tabsRoot: {
		borderBottom: '2px solid #3DA2C7'
	},
	tabsIndicator: {
		backgroundColor: '#3DA2C7',
		borderRadius: '25px 25px 0px 0px',
		marginLeft: '5px',
		marginRight: '5px',
		height: '3px'
	},
	tabRoot: {
		fontSize: '32px',
		textTransform: 'initial',
		minWidth: 72,
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing.unit * 4,
		fontFamily: [
			'-apple-system',
			'BlinkMacSystemFont',
			'"Segoe UI"',
			'Roboto',
			'"Helvetica Neue"',
			'Arial',
			'sans-serif',
			'"Apple Color Emoji"',
			'"Segoe UI Emoji"',
			'"Segoe UI Symbol"'
		].join(','),
		'&:hover': {
			color: '#3DA2C7',
			opacity: 1
		},
		'&$tabSelected': {
			color: '#3DA2C7',
			fontWeight: theme.typography.fontWeightMedium
		},
		'&:focus': {
			color: '#3DA2C7'
		}
	},
	tabSelected: {},
	typography: {
		padding: theme.spacing.unit * 3
	}
});

class CustomizedTabs extends React.Component {
	state = {
		value: 0,
		item: 4,
		openSnackbar: false,
		variantSnackbar: 'info',
		messageSnackbar: 'Dummy text!'
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	backHandleChange = () => {
		if (this.state.value !== 0) {
			this.setState((prevState) => ({
				value: prevState.value - 1
			}));
		}
	};

	nextHandleChange = () => {
		if (this.state.value < 3) {
			// If current tab is 0 - CREATE COMPANY MUTATION should be execute

			this.setState((prevState) => ({
				item: prevState.value,
				value: prevState.value + 1
			}));
		}
	};

	showSelectedTab = (value) => {
		switch (value) {
			case 0:
				return (
					<GeneralInformation
						idCompany={this.props.idCompany}
						item={this.state.item}
						next={this.nextHandleChange}
						back={this.backHandleChange}
						valueTab={this.state.value}
					/>
				);
			case 1:
				return (
					<ContactCompanyForm
						idCompany={this.props.idCompany}
						handleOpenSnackbar={this.handleOpenSnackbar}
						item={this.state.item}
						next={this.nextHandleChange}
						back={this.backHandleChange}
						valueTab={this.state.value}
					/>
				);
			case 2:
				return (
					<DepartmentsCompanyForm
						idCompany={this.props.idCompany}
						handleOpenSnackbar={this.handleOpenSnackbar}
						item={this.state.item}
						next={this.nextHandleChange}
						back={this.backHandleChange}
						valueTab={this.state.value}
					/>
				);
			case 3:
				return (
					<PositionsCompanyForm
						idCompany={this.props.idCompany}
						idContract={this.props.idContract}
						handleOpenSnackbar={this.handleOpenSnackbar}
						item={this.state.item}
						next={this.nextHandleChange}
						back={this.backHandleChange}
						valueTab={this.state.value}
					/>
				);
		}
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
		const { classes } = this.props;
		const { value } = this.state;

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
					value={value}
					onChange={this.handleChange}
					classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
				>
					<Tab
						disableRipple
						classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
						label="General Information"
					/>
					<Tab
						disableRipple
						classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
						label="Contacts"
					/>
					<Tab
						disableRipple
						classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
						label="Departments"
					/>
					<Tab
						disableRipple
						classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
						label="Positions and Rates"
					/>
				</Tabs>
				{this.showSelectedTab(value)}
			</div>
		);
	}
}

CustomizedTabs.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomizedTabs);

// import React from 'react';
// import PropTypes from 'prop-types';
// import { withStyles } from '@material-ui/core/styles';
// import SwipeableViews from 'react-swipeable-views';
// import AppBar from '@material-ui/core/AppBar';
// import Tabs from '@material-ui/core/Tabs';
// import Tab from '@material-ui/core/Tab';
// import Typography from '@material-ui/core/Typography';
// import CreateCompanyForm from '../CreateCompanyForm/';
// function TabContainer({ children, dir }) {
// 	return (
// 		<Typography component="div" dir={dir} style={{ border: '1px solid #ddd' }}>
// 			{children}
// 		</Typography>
// 	);
// }
//
// TabContainer.propTypes = {
// 	children: PropTypes.node.isRequired,
// 	dir: PropTypes.string.isRequired
// };
//
// const styles = (theme) => ({
// 	root: {
// 		backgroundColor: theme.palette.background.paper,
// 		width: '100%'
// 	}
// });
//
// class FullWidthTabs extends React.Component {
// 	state = {
// 		value: 0
// 	};
//
// 	handleChange = (event, value) => {
// 		this.setState({ value });
// 	};
//
// 	handleChangeIndex = (index) => {
// 		this.setState({ value: index });
// 	};
//
// 	render() {
// 		const { classes, theme } = this.props;
//
// 		return (
// 			<div className={classes.root}>
// 				<AppBar position="static" color="default">
// 					<Tabs
// 						value={this.state.value}
// 						onChange={this.handleChange}
// 						indicatorColor="primary"
// 						textColor="primary"
// 						fullWidth
// 					>
// 						<Tab label="General Information" />
// 						<Tab label="Contacts" />
// 						<Tab label="Dapartments" />
// 						<Tab label="Positions and Rates" />
// 					</Tabs>
// 				</AppBar>
// 				<SwipeableViews
// 					axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
// 					index={this.state.value}
// 					onChangeIndex={this.handleChangeIndex}
// 				>
// 					<TabContainer dir={theme.direction}>
// 						<CreateCompanyForm />
// 					</TabContainer>
// 					<TabContainer dir={theme.direction}>Item Two</TabContainer>
// 					<TabContainer dir={theme.direction}>Item Three</TabContainer>
// 					<TabContainer dir={theme.direction}>Item Four</TabContainer>
// 				</SwipeableViews>
// 			</div>
// 		);
// 	}
// }
//
// FullWidthTabs.propTypes = {
// 	classes: PropTypes.object.isRequired,
// 	theme: PropTypes.object.isRequired
// };
//
// export default withStyles(styles, { withTheme: true })(FullWidthTabs);
