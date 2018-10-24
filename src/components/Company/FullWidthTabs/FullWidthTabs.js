import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GeneralInformation from '../GeneralInformation/GeneralInformation';
import ContactCompanyForm from '../ContactCompanyForm';
import DepartmentsCompanyForm from '../DepartmentsCompanyForm';
import PositionsCompanyForm from '../PositionsCompanyForm';
import Preferences from '../Preferences';

import withGlobalContent from 'Generic/Global';

const theme = createMuiTheme({
	overrides: {
		MuiTabs: { // Name of the component ⚛️ / style sheet
			root: { // Name of the rule
				overflow: 'unset', // Some CSS
			},
			fixed: { // Name of the rule
				overflowX: 'unset', // Some CSS
			},
		},
	},
});

class CustomizedTabs extends React.Component {

	constructor(props) {
		console.log("Esyamos en full ", props);
		super(props);
		this.state = {
			value: 0,
			item: 4,
			activateTabs: true,
			idCompany: props.idCompany,
			idManagement: props.idCompany
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
						idManagement={this.state.idManagement}
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
						idManagement={this.state.idManagement}
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
						idManagement={this.state.idManagement}
						idContract={this.props.idContract}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
						item={this.state.item}
						next={this.nextHandleChange}
						back={this.backHandleChange}
						valueTab={this.state.value}
						showStepper={true}
						toggleStepper={this.toggleStepper}
						showPayRate={true}
					/>
				);
			case 4:
				return (
					<Preferences
						idCompany={this.state.idCompany}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
					/>
				);
		}
	};

	render() {
		const { classes } = this.props;
		const { value } = this.state;

		return (
			<div>
				<MuiThemeProvider theme={theme}>
					<Tabs
						value={value}
						onChange={this.handleChange}
						classes={{ root: "Tabs-wrapper", indicator: "Tab-selectedBorder", flexContainer: "Tabs-wrapperFluid" }}
					>
						<Tab
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="General Information"
						/>
						<Tab
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Contacts"
							disabled={!this.state.activateTabs}
						/>
						<Tab
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Departments"
							disabled={!this.state.activateTabs}
						/>
						<Tab
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Positions and Rates"
							disabled={!this.state.activateTabs}
						/>
						<Tab
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Preferences"
							disabled={!this.state.activateTabs}
						/>
					</Tabs>
					{this.showSelectedTab(value)}
				</MuiThemeProvider>
			</div >
		);
	}
}

CustomizedTabs.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withGlobalContent(CustomizedTabs);
