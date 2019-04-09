import React from 'react';

import { gql } from 'apollo-boost';
import withApollo from 'react-apollo/withApollo';
import { Route } from "react-router-dom";

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
import TablesContracts from '../../Contract/Main/MainContract/TablesContracts';//'./TablesContracts';




import withGlobalContent from 'Generic/Global';
import TitleCompanyForm from '../TitleCompanyForm/TitleCompanyForm';

const styles = (theme) => ({
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},
	buttonSuccess: {
		background: ' #3da2c7',
		borderRadius: '5px',
		padding: '.5em 1em',

		fontWeight: '300',
		fontFamily: 'Segoe UI',
		fontSize: '1.1em',
		color: '#fff',
		textTransform: 'none',
		//cursor: pointer;
		margin: '2px',

		//	backgroundColor: '#357a38',
		color: 'white',
		'&:hover': {
			background: ' #3da2c7'
		}
	},

	buttonProgress: {
		//color: ,
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	}
});

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
		super(props);
		this.state = {
			value: 0,
			item: 4,
			activateTabs: true,
			idCompany: props.idCompany,
			idManagement: props.idCompany,
			dataContract: []
		}
	};

	getContractsQuery = gql`
	query getContractById($IdManagement: Int!) {
		getcontracts(IdManagement: $IdManagement, IsActive: 1) {
			Id
			Contract_Name
			Contrat_Owner
			Contract_Status
			Contract_Expiration_Date
		}
	}
`;

	getContractData = () => {
		this.props.client
			.query({
				query: this.getContractsQuery,
				variables: {
					IdManagement: this.state.idManagement
				},
				fetchPolicy: 'no-cache'
			})
			.then(({ data }) => {
				if (data.getcontracts != null && data.getcontracts.length > 0) {
					this.setState({
						dataContract: data.getcontracts
					});

				}
			})
			.catch((err) => console.log(err));
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

	componentWillMount() {
		this.setState({
			value: this.props.tabSelected
		});

		this.getContractData();
	}

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
			case 2:
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

				{/*case 3:
				return (
					<TitleCompanyForm
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
				); */}
			case 3:
				return (
					<PositionsCompanyForm
						href={null}
						idCompany={this.state.idCompany}
						idManagement={this.state.idCompany}
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
				{/*	case 4:
				return (
					<Preferences
						idCompany={this.state.idCompany}
						handleOpenSnackbar={this.props.handleOpenSnackbar}
					/>
				);*/}
			case 4:
				return (
					<TablesContracts
						data={this.state.dataContract}
						acciones={1}
						delete={(id) => {
							this.deleteContractById(id);
						}}
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
							label="Department"
							disabled={!this.state.activateTabs}
						/>
						<Tab
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Department Contact"
							disabled={!this.state.activateTabs}
						/>
						{/*<Tab
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Title"
							disabled={!this.state.activateTabs}
						/>*/}
						<Tab
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Positions and Rates"
							disabled={!this.state.activateTabs}
						/>
						<Tab
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Contracts"
							disabled={!this.state.activateTabs}
						/>
						{/*<Tab*/}
						{/*disableRipple*/}
						{/*classes={{ root: "Tab-item", selected: "Tab-selected" }}*/}
						{/*label="Preferences"*/}
						{/*disabled={!this.state.activateTabs}*/}
						{/*/>*/}
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

export default withStyles(styles)(withApollo(withGlobalContent(CustomizedTabs)));
//export default withGlobalContent(CustomizedTabs);
