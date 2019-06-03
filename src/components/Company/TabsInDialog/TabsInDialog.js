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
import User from '../User';
import { gql } from 'apollo-boost';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from 'Generic/Global';
import TablesContracts from '../../Contract/Main/MainContract/TablesContracts';//'./TablesContracts';


import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

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
		idManagement: null,
		dataContract: [],
		Id_Entity: null,

		showConfirm:true,
			showConfirmCompany:false,
			showConfirmCompanyOrProperty:false,
			opendialog: false,
			open:false
	};


	getContractsQuery = gql`
	query getContractById($Id_Entity: Int!) {
		getcontracts(Id_Entity: $Id_Entity, IsActive: 1) {
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
					Id_Entity: this.props.idProperty
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


	render() {
		const { classes } = this.props;
		const { value } = this.state;

		return (
			<div>
				<MuiThemeProvider theme={theme}>
					<Tabs
						value={value}
						onChange={this.handleChange}
						classes={{ root: "Tabs-wrapper", indicator: "Tab-selectedBorder", flexContainer: "Tabs-wrapperFluid tumi-xScroll" }}
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
							label="Departments"
						/>
						<Tab
							disabled={this.state.idProperty === null}
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Department Contact"
						/>
						<Tab
							disabled={this.state.idProperty === null}
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Positions and Rates"
						/>
						{localStorage.getItem('ShowMarkup') == 'true' ?
						<Tab
							disabled={this.state.idProperty === null}
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Contracts"
						/>
						:''}
						<Tab
							disabled={this.state.idProperty === null}
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Configuration"
						/>
					</Tabs>
					{value === 0 && (
						<GeneralInforProperty
							idManagement={this.props.idCompany ? this.props.idCompany : this.state.idManagement}
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
					{value === 2 && (
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
					{localStorage.getItem('ShowMarkup') == 'true'  ?
					value === 4 && (
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
					)
					:''}
					{value === 5 && (
						<User
							handleOpenSnackbar={this.props.handleOpenSnackbar}
							item={this.state.item}
							idCompany={this.state.idProperty}
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

export default withStyles(styles)(withApollo(withGlobalContent(CustomizedTabs)));
//export default withStyles(styles)(CustomizedTabs);
