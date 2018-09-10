import React from 'react';
import './index.css';
import SignaturePad from 'react-signature-canvas';

import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import CheckIcon from '@material-ui/icons/Check';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import { Snackbar } from '@material-ui/core';
import { MySnackbarContentWrapper } from '../../Generic/SnackBar';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import gql from 'graphql-tag';

const styles = (theme) => ({
	container: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginBottom: '30px',
		width: '100%'
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

class Signature extends React.Component {
	state = {
		signInput: null,
		openModal: false
	};
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			success: false,
			openSignatureModal: false,
			openSnackbar: false,
			variantSnackbar: 'info',
			messageSnackbar: 'Dummy text!',
			agreement: '',
			signature: '',
			loadingData: false
		};
	}

	GET_AGREEMENT_QUERY = gql`
		query getcontracts($Id: Int) {
			getcontracts(Id: $Id) {
				Contract_Terms
				Client_Signature
			}
		}
	`;
	INSERT_AGREEMENT_SIGNATURE_QUERY = gql`
		mutation updcontracstsignature($Id: Int, $Client_Signature: String, $Company_Signature: String) {
			updcontracstsignature(Id: $Id, Client_Signature: $Client_Signature, Company_Signature: $Company_Signature) {
				Id
			}
		}
	`;
	resizeCanvas = () => {
		// When zoomed out to less than 100%, for some very strange reason,
		// some browsers report devicePixelRatio as less than 1
		// and only part of the canvas is cleared then.
		var ratio = Math.max(window.devicePixelRatio || 1, 1);
		var canvas = this.sigPad.getCanvas();
		var signaturePad = this.sigPad;
		// This part causes the canvas to be cleared
		canvas.width = canvas.offsetWidth * ratio;
		//canvas.height = canvas.offsetHeight * ratio;
		canvas.getContext('2d').scale(ratio, ratio);
		this.sigPad.fromDataURL(this.state.signature);
		// This library does not listen for canvas changes, so after the canvas is automatically
		// cleared by the browser, SignaturePad#isEmpty might still return false, even though the
		// canvas looks empty, because the internal data of this library wasn't cleared. To make sure
		// that the state of this library is consistent with visual state of the canvas, you
		// have to clear it manually.
		//	signaturePad.clear();
	};
	loadAgreement = () => {
		this.setState({ loadingData: true });
		this.props.client
			.query({
				query: this.GET_AGREEMENT_QUERY,
				variables: { Id: 14 },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcontracts != null) {
					this.setState(
						{
							agreement: data.data.getcontracts[0].Contract_Terms,
							signature: data.data.getcontracts[0].Client_Signature
						},
						() => {
							this.sigPad.fromDataURL(this.state.signature);
							this.setState({ loadingData: false });
						}
					);
				} else {
					this.handleOpenSnackbar('error', 'Error: Loading agreement: getcontracts not exists in query data');
					this.setState({ loadingData: false });
				}
			})
			.catch((error) => {
				console.log('Error: Loading agreement: ', error);
				this.handleOpenSnackbar('error', 'Error: Loading agreement: ' + error);
				this.setState({ loadingData: false });
			});
	};
	saveSignature = () => {
		this.setState(
			{
				success: false,
				loading: true
			},
			() => {
				this.props.client
					.mutate({
						mutation: this.INSERT_AGREEMENT_SIGNATURE_QUERY,
						variables: {
							Id: 14,
							Client_Signature: `'${this.state.signature}'`,
							Company_Signature: `'${this.state.signature}'`
						}
					})
					.then((data) => {
						this.handleOpenSnackbar('success', 'Document Signed!');
						this.setState({
							success: true,
							loading: false
						});
					})
					.catch((error) => {
						console.log('Error: Signing Document: ', error);
						this.handleOpenSnackbar('error', 'Error: Signing Document: ' + error);
						this.setState({
							success: false,
							loading: false
						});
					});
			}
		);
	};
	handleSaveSignature = () => {
		if (this.sigPad.isEmpty()) {
			this.handleOpenSnackbar('error', 'You need to sign the document!');
			return false;
		}
		this.setState({ signature: this.sigPad.toDataURL() }, this.saveSignature);
	};

	clearSignature = (e) => {
		this.sigPad.clear();
	};
	handleOpenSignatureModal = () => {
		this.setState({ openSignatureModal: true });
	};

	handleCloseSignatureModal = () => {
		this.setState({ openSignatureModal: false });
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
	componentWillMount() {
		this.loadAgreement();
	}
	componentDidMount() {
		window.addEventListener('resize', this.resizeCanvas.bind(this));
		this.resizeCanvas();
	}
	render() {
		const { classes } = this.props;
		const { fullScreen } = this.props;
		const buttonClassname = classNames({
			[classes.buttonSuccess]: success
		});
		const { loading, success } = this.state;

		return (
			<div className="signature-container">
				{this.state.loadingData && <LinearProgress />}
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
				<h1 className="signature-header"> Legal Agreement</h1>
				<div className="signature-content">
					<textarea
						type="text"
						value={this.state.agreement}
						className="signature-information"
						placeholder={this.props.placeholder}
					/>
				</div>

				<h1 className="signature-header"> Signature</h1>
				<div className="signaturePad-MainContainer">
					<div className="signaturePad-container">
						<SignaturePad
							ref={(ref) => {
								this.sigPad = ref;
							}}
							style={{ height: 300 }}
							clearOnResize={false}
							id="signingSurface"
							canvas={<canvas id="signingCanvas" ref="signingCanvas" />}
							canvasProps={{ className: 'signature-input', id: 'signingCanvas' }}
						/>
					</div>
				</div>

				<div className="signature-footer">
					<div className="signature-button">
						<Tooltip title={'Clear'}>
							<div>
								<Button
									//disabled={this.state.loading || !this.state.enableCancelButton}
									variant="fab"
									color="secondary"
									className={buttonClassname}
									onClick={this.clearSignature}
								>
									<ClearAllIcon />
								</Button>
							</div>
						</Tooltip>
					</div>
					<div className="signature-button-root">
						<div className="signature-button-wrapper">
							<div className="signature-button">
								<Tooltip title="Sign Contract">
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
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
Signature.propTypes = {
	classes: PropTypes.object.isRequired,
	fullScreen: PropTypes.bool.isRequired
};
export default withStyles(styles)(withApollo(withMobileDialog()(Signature)));
