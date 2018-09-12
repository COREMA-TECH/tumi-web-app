import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './index.css';
import TextAreaForm from '../../ui-components/InputForm/TextAreaForm';
import withApollo from 'react-apollo/withApollo';
import { gql } from 'apollo-boost';
import PositionsCompanyForm from '../../Company/PositionsCompanyForm/';
import { Snackbar } from '@material-ui/core';
import { MySnackbarContentWrapper } from '../../Generic/SnackBar';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveIcon from '@material-ui/icons/Save';
import SendIcon from '@material-ui/icons/Send';
import PrintIcon from '@material-ui/icons/Print';
import DownloadIcon from '@material-ui/icons/CloudDownload';
import ClearIcon from '@material-ui/icons/Clear';
import Tooltip from '@material-ui/core/Tooltip';
import InputForm from '../../ui-components/InputForm/InputForm';
import SelectForm from '../../ui-components/SelectForm/SelectForm';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import renderHTML from 'react-render-html';

const styles = (theme) => ({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginBottom: '30px',
		width: '100%'
	},
	root: {
		display: 'flex',
		alignItems: 'center'
	},
	formControl: {
		margin: theme.spacing.unit
		//width: '100px'
	},
	inputControl: {},
	departmentControl: {
		width: '200px',
		paddingRight: '0px'
	},
	shiftControl: {
		width: '100px',
		paddingRight: '0px'
	},
	resize: {
		//width: '200px'
	},
	divStyle: {
		width: '95%',
		display: 'flex'
		//justifyContent: 'space-around'
	},
	button: {
		margin: theme.spacing.unit
	},
	input: {
		display: 'none'
	},
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},
	buttonSuccess: {
		backgroundColor: green[500],
		'&:hover': {
			backgroundColor: green[700]
		}
	},
	fabProgress: {
		color: green[500],
		position: 'absolute',
		top: -6,
		left: -6,
		zIndex: 1
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	}
});

class ExhibitContract extends Component {
	constructor(props) {
		super(props);

		this.state = {
			exhibitA: '',
			exhibitB: '',
			exhibitC: '',
			exhibitD: '',
			exhibitE: '',
			exhibitF: '',
			openSnackbar: false,
			variantSnackbar: 'info',
			messageSnackbar: 'Dummy text!',
			agreement: ''
		};
	}

	ADD_EXHIBIT = gql`
		mutation updcontracstexhibit(
			$Id: Int
			$Exhibit_B: String
			$Exhibit_C: String
			$Exhibit_D: String
			$Exhibit_E: String
			$Exhibit_F: String
		) {
			updcontracstexhibit(
				Id: $Id
				Exhibit_B: $Exhibit_B
				Exhibit_C: $Exhibit_C
				Exhibit_D: $Exhibit_D
				Exhibit_E: $Exhibit_E
				Exhibit_F: $Exhibit_F
			) {
				Id
				Exhibit_B
				Exhibit_C
				Exhibit_D
				Exhibit_E
				Exhibit_F
			}
		}
	`;

	GET_AGREEMENT_QUERY = gql`
		query getcontracts($Id: Int) {
			getcontracts(Id: $Id) {
				Contract_Terms
			}
		}
	`;
	SEND_CONTRACT_QUERY = gql`
		query sendcontracts($Id: Int) {
			sendcontracts(Id: $Id, IsActive: 1) {
				Id
				Electronic_Address
				Primary_Email
			}
		}
	`;

	sendContract = () => {
		this.setState({ loadingData: true });
		this.props.client
			.query({
				query: this.SEND_CONTRACT_QUERY,
				variables: { Id: this.props.contractId },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.sendcontracts != null) {
					this.handleOpenSnackbar(
						'success', 'Contract Sent!');
					this.resetState();
				} else {
					this.handleOpenSnackbar('error', 'Error: Loading agreement: sendcontracts not exists in query data');
					this.setState({ loadingData: false });
				}
			})
			.catch((error) => {
				this.handleOpenSnackbar('error', 'Error: Loading agreement: ' + error);
				this.setState({ loadingData: false });
			});
	};

	loadAgreement = () => {
		this.setState({ loadingData: true });
		this.props.client
			.query({
				query: this.GET_AGREEMENT_QUERY,
				variables: { Id: this.props.contractId },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcontracts != null) {
					this.setState({
						agreement: data.data.getcontracts[0].Contract_Terms
						//signature: data.data.getcontracts[0].Client_Signature
					});
				} else {
					this.handleOpenSnackbar('error', 'Error: Loading agreement: getcontracts not exists in query data');
					this.setState({ loadingData: false });
				}
			})
			.catch((error) => {
				this.handleOpenSnackbar('error', 'Error: Loading agreement: ' + error);
				this.setState({ loadingData: false });
			});
	};

	DEFAULT_STATE = {
		id: '',
		idToDelete: null,
		idToEdit: null,
		idDepartment: '',
		position: '',
		billrate: 0,
		payrate: 0,
		shift: '',

		idDepartmentValid: true,
		positionValid: true,
		billrateValid: true,
		payrateValid: true,
		shiftValid: true,

		idDepartmentHasValue: false,
		positionHasValue: false,
		billrateHasValue: false,
		payrateHasValue: false,
		shiftHasValue: false,

		formValid: true,
		opendialog: false,
		buttonTitle: this.TITLE_ADD,
		enableCancelButton: false,
		openSnackbar: true,
		loading: false,
		success: false,
		loadingConfirm: false,
		openModal: false
	};

	resetState = () => {
		this.setState(
			{
				...this.DEFAULT_STATE
			},
			() => { }
		);
	};
	insertExhibit = () => {
		this.props.client.mutate({
			mutation: this.ADD_EXHIBIT,
			variables: {
				Id: parseInt(this.props.contractId),
				Exhibit_B: `'${this.state.exhibitB}'`,
				Exhibit_C: `'${this.state.exhibitC}'`,
				Exhibit_D: `'${this.state.exhibitD}'`,
				Exhibit_E: `'${this.state.exhibitE}'`,
				Exhibit_F: `'${this.state.exhibitF}'`
			}
		});
	};

	componentWillMount() {
		this.loadAgreement();
	}
	componentDidMount() {
		document.getElementById('ifmcontentstoprint').style.display = 'none';
	}

	handleClickOpenModal = () => {
		this.setState({ openModal: true });
	};
	handleCloseSnackbar = (event, reason) => {
		if (reason === 'clickaway') {
			return;
		}

		this.setState({ openSnackbar: false });
	};
	cancelContractHandler = () => {
		this.resetState();
	};

	printContractHandler = () => {
		var content = document.getElementById('agreement');
		var pri = document.getElementById('ifmcontentstoprint').contentWindow;
		pri.document.open();
		pri.document.write(content.innerHTML);
		pri.document.close();
		pri.focus();
		pri.print();
	};

	createPDFContractHandler = () => {
		var textToWrite = document.getElementById('agreement').innerHTML;
		var textFileAsBlob = new Blob([textToWrite], { type: 'text/html' });
		var fileNameToSaveAs = 'Contract.html';

		var downloadLink = document.createElement('a');
		downloadLink.download = fileNameToSaveAs;
		downloadLink.innerHTML = 'Download File';
		if (window.webkitURL != null) {
			// Chrome allows the link to be clicked without actually adding it to the DOM.
			downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
		} else {
			// Firefox requires the link to be added to the DOM before it can be clicked.
			//	downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
			//		downloadLink.onclick = destroyClickedElement;
			downloadLink.style.display = 'none';
			document.body.appendChild(downloadLink);
		}

		downloadLink.click();
	};

	handleOpenSnackbar = (variant, message) => {
		this.setState({
			openSnackbar: true,
			variantSnackbar: variant,
			messageSnackbar: message
		});
	};

	render() {
		const { loading, success } = this.state;
		const { classes } = this.props;
		const { fullScreen } = this.props;
		const buttonClassname = classNames({
			[classes.buttonSuccess]: success
		});

		return (
			<div className="contract-container">
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

				<Dialog
					fullScreen={true}
					open={this.state.openModal}
					onClose={this.cancelContractHandler}
					aria-labelledby="responsive-dialog-title"
				>
					<DialogTitle style={{ padding: '0px' }}>
						<div className="card-form-header orange">
							{' '}
							{this.state.idToEdit != null && this.state.idToEdit != '' && this.state.idToEdit != 0 ? (
								'Edit  Position/Rate'
							) : (
									'New Contract Preview'
								)}
						</div>
					</DialogTitle>
					<DialogContent style={{ minWidth: 750, padding: '0px' }}>
						<div id="agreement" className="exhibit-content">
							{renderHTML(this.state.agreement)}

						</div>
					</DialogContent>
					<DialogActions>
						<div className="exhibit-button-right">
							<Tooltip title="Save">
								<div>
									<Button
										disabled={this.state.loading}
										//	disabled={!this.state.formValid}
										variant="fab"
										color="primary"
										className={buttonClassname}
										onClick={this.handleSaveSignature}
									>
										<SaveIcon />
									</Button>
								</div>
							</Tooltip>
							{loading && <CircularProgress size={68} className={classes.fabProgress} />}

							<Tooltip title={'Cancel Operation'}>
								<div>
									<Button
										//	disabled={this.state.loading || !this.state.enableCancelButton}
										variant="fab"
										color="secondary"
										className={buttonClassname}
										onClick={this.cancelContractHandler}
									>
										<ClearIcon />
									</Button>
								</div>
							</Tooltip>
						</div>
						<div className="exhibit-button-left">
							<Tooltip title={'Print Contract'}>
								<div>
									<Button
										//	disabled={this.state.loading || !this.state.enableCancelButton}
										variant="fab"
										color="primary"
										className={buttonClassname}
										onClick={this.printContractHandler}
									>
										<PrintIcon />
									</Button>
								</div>
							</Tooltip>
							<Tooltip title={'Download Contract'}>
								<div>
									<Button
										//	disabled={this.state.loading || !this.state.enableCancelButton}
										variant="fab"
										color="primary"
										className={buttonClassname}
										onClick={this.createPDFContractHandler}
									>
										<DownloadIcon />
									</Button>
								</div>
							</Tooltip>
							<Tooltip title={'Send Contract by email'}>
								<div>
									<Button
										//	disabled={this.state.loading || !this.state.enableCancelButton}
										variant="fab"
										color="primary"
										className={buttonClassname}
										onClick={this.sendContract}
									>
										<SendIcon />
									</Button>
								</div>
							</Tooltip>
						</div>
					</DialogActions>
				</Dialog>

				<div className="contract-body">
					<div className="contract-body__content">
						<div className="contract-body-row">
							<div className="contract-body-row__content">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit A (Rates & Positions)</span>
								</div>
								<div className="contract-body-row__form contract-body-row__form--lg">
									<PositionsCompanyForm
										idCompany={this.props.companyId}
										idContract={this.props.contractId}
										handleOpenSnackbar={this.handleOpenSnackbar}
										showStepper={false}
									/>
								</div>
							</div>

							<div className="contract-body-row__content hidden">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit B</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.exhibitB}
												change={(text) => {
													this.setState({
														exhibitB: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="contract-body-row__content hidden">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit C</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.exhibitC}
												change={(text) => {
													this.setState({
														exhibitC: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="contract-body-row__content hidden">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit D</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.exhibitD}
												change={(text) => {
													this.setState({
														exhibitD: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="contract-body-row__content hidden">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit E</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.exhibitE}
												change={(text) => {
													this.setState({
														exhibitE: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>

							<div className="contract-body-row__content hidden">
								<div className="contract-body-row__header">
									<span className="contract-body__subtitle">Exhibit F</span>
								</div>
								<div className="contract-body-row__form">
									<div className="card-form-body">
										<div className="card-form-row">
											<span className="input-label primary">Contract Terms</span>
											<TextAreaForm
												value={this.state.exhibitF}
												change={(text) => {
													this.setState({
														exhibitF: text
													});
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="contract-footer">
							<div
								className="contract-next-button"
								onClick={() => {
									// Insert Exhibits
									this.insertExhibit();
								}}
							>
								Save
							</div>
							<div className="contract-next-button" onClick={this.handleClickOpenModal}>
								Create Contract
							</div>
						</div>
					</div>
				</div>
				<iframe id="ifmcontentstoprint" allowtransparency="true" />
			</div>
		);
	}
}

PositionsCompanyForm.propTypes = {
	classes: PropTypes.object.isRequired,
	fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles)(withApollo(withMobileDialog()(ExhibitContract)));
