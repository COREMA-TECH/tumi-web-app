import React from 'react';
import PropTypes from 'prop-types';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import NewContract from './NewContract/NewContract';
import ExhibitContract from './ExhibitContract/ExhibitContract';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import withGlobalContent from '../Generic/Global';

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

class Contract extends React.Component {
	constructor(props) {
		super(props);
	}

	state = {
		value: 0,
		contractId: 0,
		Id_Entity: 0,
		Id_Parent: 0,
		companyId: 0,
		ContractName: '',
		loading: false
	};

	handleChange = (event, value) => {
		this.setState({ value });
	};

	updateContractId = (id) => {
		this.setState({
			contractId: id,
			value: 1
		});
	};


	updateId_ToRenewedContract = (id) => {
		this.setState({
			contractId: id
		});
	};

	updateCompanyId = (id) => {
		this.setState({
			companyId: id
		});
	};

	getContractName = (contractname) => {
		this.setState({
			ContractName: contractname
		});
	};

	componentWillMount() {
		this.setState(
			{
				loading: true
			},
			() => {
				try {
					if (this.props.location.state.contract !== 0) {
						this.setState(
							{
								contractId: this.props.location.state.contract,
								Id_Entity: this.props.location.state.Id_Entity,
								Id_Parent: this.props.location.state.Id_Parent,
							},
							() => {
								this.setState({
									loading: false
								});
							}
						);
					} else {
						this.setState({
							contractId: 0,
							Id_Entity: this.props.location.state.Id_Entity,
							Id_Parent: this.props.location.state.Id_Parent,
							loading: false
						});
					}
				} catch (e) {
					this.props.history.push({
						pathname: '/home/'
					});
					return false;

					this.setState(
						{
							contractId: 0
						},
						() => {
							this.setState({
								loading: false
							});
						}
					);
				}
			}
		);
	}

	render() {
		const { classes } = this.props;
		const { value } = this.state;
		const contractValue = this.state.contractId === 0;

		if (this.state.loading) {
			return <LinearProgress />;
		}

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
							label={this.state.contractId == 0 ? 'New Contract' : 'Edit Contract'}
						/>
						<Tab
							disabled={contractValue}
							disableRipple
							classes={{ root: "Tab-item", selected: "Tab-selected" }}
							label="Exhibit"
						/>
					</Tabs>
					{value === 0 && (
						<NewContract
							href={this.props.location.state.href}
							contractId={this.state.contractId}
							Id_Entity={this.state.Id_Entity}
							Id_Parent={this.state.Id_Parent}
							updateContractId={this.updateContractId}
							updateId_ToRenewedContract={this.updateId_ToRenewedContract}
							updateCompanyId={this.updateCompanyId}
							handleOpenSnackbar={this.props.handleOpenSnackbar}
							getContractName={this.getContractName}
						/>
					)}
					{value === 1 && (
						<ExhibitContract
							contractId={this.state.contractId}
							companyId={
								this.state.companyId == 0 ? this.props.location.state.Id_Entity : this.state.companyId
							}
							handleOpenSnackbar={this.props.handleOpenSnackbar}
							baseUrl={this.props.baseUrl}
							contractname={this.state.ContractName}
							showStepper={false}
						/>
					)}
				</MuiThemeProvider>
			</div>
		);
	}
}

Contract.propTypes = {
	classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withGlobalContent(Contract));
