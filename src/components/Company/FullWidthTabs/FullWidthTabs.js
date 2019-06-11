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

import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

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

	handleClose = () => {
		this.setState({showConfirm: true, open: false });
	};

	handleOpenConfirmDialog = () => {
		this.setState({ showConfirmCompany: false, showConfirm: true, showConfirmCompanyOrProperty:false});
	}
	
	handleOpenConfirmDialogCompany = () => {
		this.setState({ showConfirmCompany: true, showConfirm: false, showConfirmCompanyOrProperty:false });
	}

	handleOpenConfirmDialogCompanyOrProperty = () => {
		this.setState({ showConfirmCompany: false, showConfirm: false, showConfirmCompanyOrProperty:true });
	}

	handleCloseConfirmDialog = () => {
	this.setState({ showConfirm: false });
	}

	printDialogConfirm = () => {
		return <Dialog maxWidth="xl" open={false} >
			<DialogContent>
				<h2 className="text-center">What would you like to do?</h2>
			</DialogContent>
			<DialogActions>
				<button className="btn btn-success  btn-not-rounded mr-1 ml-2 mb-2" type="button" onClick={() => this.handleOpenConfirmDialogCompany() }>
					Create New Contract 
				</button>
				<button className="btn btn-info  btn-not-rounded mb-2" type="button" onClick={() => this.handleCloseConfirmDialog()}>
					View and Renew Contracts 
				</button>
				
			</DialogActions>
		</Dialog>
}

printDialogConfirmCompany = () => {
	//	console.log("estoy en el dialog ", this.state.showConfirm)
	   
			return <Dialog maxWidth="xl" open={this.state.showConfirmCompany} >
				<DialogContent>
					<h2 className="text-center">Is this contract for a new or existing company?</h2>
				</DialogContent>
				<DialogActions>
					<button className="btn btn-success  btn-not-rounded mr-1 ml-2 mb-2" type="button" onClick={() => this.handleOpenConfirmDialogCompanyOrProperty() }>
						New Company
					</button>
					<button className="btn btn-info  btn-not-rounded mb-2" type="button" onClick={() => this.redirectToCreateContract()}>
						Existing Company
					</button>
					
				</DialogActions>
			</Dialog>
	}

	printDialogConfirmCompanyOrProperty = () => {
		//	console.log("estoy en el dialog ", this.state.showConfirm)
		   
				return <Dialog maxWidth="xl" open={this.state.showConfirmCompanyOrProperty} >
					<DialogContent>
						<h2 className="text-center">Is this contract for Property or a Management Company?</h2>
					</DialogContent>
					<DialogActions>
					<button className="btn btn-success  btn-not-rounded mb-2" type="button" onClick={(e) => this.handleClickOpen(e)}>
							Property
						</button>
						<button className="btn btn-info  btn-not-rounded mr-1 ml-2 mb-2" type="button" onClick={() => this.redirectToCreateCompany() }>
							Management Company
						</button>
						
						
					</DialogActions>
				</Dialog>
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
						printDialogConfirm={this.printDialogConfirm}
						printDialogConfirmCompany={this.printDialogConfirmCompany}
						printDialogConfirmCompanyOrProperty={this.printDialogConfirmCompanyOrProperty}
					
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
						{ localStorage.getItem('ShowMarkup') == 'true' ?
						<Tab
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Contracts"
							disabled={!this.state.activateTabs}
						/> :'' }
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
