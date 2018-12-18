import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import GeneralInforProperty from './GeneralInforProperty';
import ContactCompanyForm from '../ContactCompanyForm/ContactCompanyForm';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import DepartmentsCompanyForm from '../DepartmentsCompanyForm/DepartmentsCompanyForm';
import PositionsCompanyForm from '../PositionsCompanyForm/PositionsCompanyForm';


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

const styles = (theme) => ({
	root: {
		justifyContent: 'center',
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
		zIndex: '-1'
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
		fontSize: '28px',
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

class CustomizedTabs extends Component {
	state = {
		value: 0,
		activeTab: false,
		idProperty: null,
		idManagement: null
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	updateValue = () => {
		this.setState((prevState) => ({
			value: prevState.value + 1
		}));
	};

	componentWillMount() {
		if (this.props.idProperty) {
			this.setState({
				idProperty: this.props.idProperty,
				idManagement: this.props.idCompany
			});
		}
	}

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
							disabled={this.state.idProperty === null}
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Contacts"
						/>
						<Tab
							disabled={this.state.idProperty === null}
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Departments"
						/>
						<Tab
							disabled={this.state.idProperty === null}
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Positions and Rates"
						/>
					</Tabs>
					{value === 0 && (
						<GeneralInforProperty
							idCompany={this.props.idCompany}
							idManagement={this.props.idManagement}
							idProperty={this.state.idProperty}
							Markup={this.props.Markup}
							updateIdProperty={(id, idmanagement) => {
								this.setState({
									idProperty: id,
									idManagement: idmanagement
								});
							}}
							handleClose={this.props.handleClose}
							handleOpenSnackbar={this.props.handleOpenSnackbar}
							next={this.updateValue}
						/>
					)}
					{value === 1 && (
						<ContactCompanyForm
							idCompany={this.state.idProperty}
							item={this.state.item}
							next={this.nextHandleChange}
							back={this.backHandleChange}
							valueTab={this.state.value}
							showStepper={this.state.showStepper}
							toggleStepper={this.toggleStepper}
							handleOpenSnackbar={this.props.handleOpenSnackbar}
						/>
					)}
					{value === 2 && (
						<DepartmentsCompanyForm
							idCompany={this.state.idProperty}
							item={this.state.item}
							next={this.nextHandleChange}
							back={this.backHandleChange}
							valueTab={this.state.value}
							showStepper={this.state.showStepper}
							toggleStepper={this.toggleStepper}
							handleOpenSnackbar={this.props.handleOpenSnackbar}
						/>
					)}
					{value === 3 && (
						<PositionsCompanyForm
							href="/home/Properties"
							idCompany={this.state.idProperty}
							idManagement={this.state.idManagement}
							idContract={1}
							item={this.state.item}
							next={this.nextHandleChange}
							back={this.backHandleChange}
							valueTab={this.state.value}
							showStepper={true}
							toggleStepper={this.toggleStepper}
							handleOpenSnackbar={this.props.handleOpenSnackbar}
							showPayRate={true}
						/>
					)}
				</MuiThemeProvider>
			</div>
		);
	}
}

CustomizedTabs.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(CustomizedTabs);
