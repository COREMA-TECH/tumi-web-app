import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GeneralInformation from '../GeneralInformation/GeneralInformation';
import ContactCompanyForm from '../ContactCompanyForm';
import DepartmentsCompanyForm from '../DepartmentsCompanyForm';
import PositionsCompanyForm from '../PositionsCompanyForm';

import withGlobalContent from 'Generic/Global';

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

	constructor(props) {
		super(props);
		this.state = {
			value: 0,
			item: 4,
			activateTabs: true,
			idCompany: props.idCompany
		}
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

	toggleStepper = () => {
		this.setState({
			showStepper: !this.state.showStepper,
			activateTabs: !this.state.activateTabs
		});
	};

	updateCompany = (_idCompany) => {
		this.setState({
			idCompany: _idCompany
		});
	};

	showSelectedTab = (value) => {
		switch (value) {
			case 0:
				return (
					<GeneralInformation
						idCompany={this.state.idCompany}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
						item={this.state.item}
						next={this.nextHandleChange}
						back={this.backHandleChange}
						valueTab={this.state.value}
						showStepper={this.state.showStepper}
						toggleStepper={this.toggleStepper}
						updateCompany={this.updateCompany}
					/>
				);
			case 1:
				return (
					<ContactCompanyForm
						idCompany={this.state.idCompany}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
						item={this.state.item}
						next={this.nextHandleChange}
						back={this.backHandleChange}
						valueTab={this.state.value}
						showStepper={this.state.showStepper}
						toggleStepper={this.toggleStepper}
					/>
				);
			case 2:
				return (
					<DepartmentsCompanyForm
						idCompany={this.state.idCompany}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
						item={this.state.item}
						next={this.nextHandleChange}
						back={this.backHandleChange}
						valueTab={this.state.value}
						showStepper={this.state.showStepper}
						toggleStepper={this.toggleStepper}
					/>
				);
			case 3:
				return (
					<PositionsCompanyForm
						idCompany={this.state.idCompany}
						idContract={this.props.idContract}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
						item={this.state.item}
						next={this.nextHandleChange}
						back={this.backHandleChange}
						valueTab={this.state.value}
						showStepper={true}
						toggleStepper={this.toggleStepper}
						showBillRate={true}
					/>
				);
		}
	};

	render() {
		const { classes } = this.props;
		const { value } = this.state;

		return (
			<div className={classes.root}>
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
						disabled={!this.state.activateTabs}
					/>
					<Tab
						disableRipple
						classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
						label="Departments"
						disabled={!this.state.activateTabs}
					/>
					<Tab
						disableRipple
						classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
						label="Positions and Rates"
						disabled={!this.state.activateTabs}
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

export default withStyles(styles)(withGlobalContent(CustomizedTabs));
