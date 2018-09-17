import React from 'react';
import './index.css';
import SignaturePad from 'react-signature-canvas';

import { withApollo } from 'react-apollo';
import PropTypes from 'prop-types';
import SaveIcon from '@material-ui/icons/Save';
import ClearIcon from '@material-ui/icons/Clear';
import ClearAllIcon from '@material-ui/icons/ClearAll';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import TitleIcon from '@material-ui/icons/Title';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';

import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import gql from 'graphql-tag';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import renderHTML from 'react-render-html';
import queryString from 'query-string';
import NothingToDisplay from 'ui-components/NothingToDisplay/NothingToDisplay';

import withGlobalContent from 'Generic/Global';
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
		color: 'white',
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
		openModal: false,
		disableButtonLetter: true,
		allowSave: false,
		saved: false,
		empty: true
	};
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			success: false,
			openSignatureModal: false,

			agreement: '',
			signature: '',
			loadingData: false,
			openModal: false,
			selectedColor: 'blackSelector',
			selectedLetter: 'letter1Selector',
			inputText: '',
			signature: '',
			signatory: '',
			disableButtonLetter: true,
			allowSave: false,
			saved: false,
			empty: true,
			tokenValid: false,
			idContract: 0,
			view: 1
		};
	}

	GET_AGREEMENT_QUERY = gql`
		query getcontracts($Id: Int) {
			getcontracts(Id: $Id) {
				Contract_Terms
				Client_Signature
				Company_Signature
			}
		}
	`;

	GET_TOKEN_QUERY = gql`
		query validtokens($Token: String, $Signatory: String) {
			validtokens(Token: $Token, Signatory: $Signatory) {
				Token
				IsActive
				Id_Contract
			}
		}
	`;

	INSERT_AGREEMENT_SIGNATURE_QUERY = gql`
		mutation updcontracstsignature($Id: Int, $Signature: String, $Signatory: String) {
			updcontracstsignature(Id: $Id, Signature: $Signature, Signatory: $Signatory) {
				Id
			}
		}
	`;
	resizeCanvas = () => {
		if (this.sigPad != null) {
			// When zoomed out to less than 100%, for some very strange reason,
			// some browsers report devicePixelRatio as less than 1
			// and only part of the canvas is cleared then.
			var ratio = Math.max(window.devicePixelRatio || 1, 1);
			var canvas = this.sigPad.getCanvas();

			// This part causes the canvas to be cleared
			canvas.width = canvas.offsetWidth * ratio;
			canvas.height = canvas.offsetHeight * ratio;
			canvas.getContext('2d').scale(ratio, ratio);
			this.sigPad.fromDataURL(this.state.signature);

			// This library does not listen for canvas changes, so after the canvas is automatically
			// cleared by the browser, SignaturePad#isEmpty might still return false, even though the
			// canvas looks empty, because the internal data of this library wasn't cleared. To make sure
			// that the state of this library is consistent with visual state of the canvas, you
			// have to clear it manually.
			//	signaturePad.clear();
		}
	};
	insertTextIntoCanvas = () => {
		if (this.state.inputText.trim() == '') {
			this.props.handleOpenSnackbar('warning', 'You must to specify a text signature');
			return true;
		}
		if (this.sigPad != null) {
			var ratio = Math.max(window.devicePixelRatio || 1, 1);
			var canvas = this.sigPad.getCanvas();
			var container = document.getElementById('signaturePadContainer');
			var ctx;
			// This part causes the canvas to be cleared
			canvas.width = canvas.offsetWidth * ratio;
			canvas.height = canvas.offsetHeight * ratio;
			ctx = canvas.getContext('2d');

			ctx.scale(ratio, ratio);
			ctx.font = this.getFontForCanvas();
			ctx.fillStyle = this.getFillStyleForCanvas();
			ctx.textAlign = 'center';

			ctx.fillText(this.state.inputText, (container.offsetWidth - 15) / 2, (container.offsetHeight - 15) / 2);
			this.setState({ openModal: false, disableButtonLetter: true, allowSave: true, empty: false }, () => {
				this.sigPad.off();
				this.setState({ signature: this.sigPad.toDataURL() }, () => {
					this.sigPad.fromDataURL(this.state.signature);
				});
			});
		}
	};
	getFontForCanvas = () => {
		switch (this.state.selectedLetter) {
			case 'letter1Selector':
				return '30px "Muli"';
			case 'letter2Selector':
				return '40px "Rancho"';
			case 'letter3Selector':
				return 'italic 30px "Pacifico"';
			default:
				return '30px "Muli"';
		}
	};
	getFillStyleForCanvas = () => {
		switch (this.state.selectedColor) {
			case 'blackSelector':
				return 'black';
			case 'blueSelector':
				return '#3f51b5';
			case 'greenSelector':
				return '#357a38';
			default:
				return 'black';
		}
	};
	loadAgreement = (signatory) => {
		this.setState({ loadingData: true });
		this.props.client
			.query({
				query: this.GET_AGREEMENT_QUERY,
				variables: { Id: this.state.idContract },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.getcontracts != null) {
					if (data.data.getcontracts.length == 0) {
						this.props.history.push('/home/');
						return true;
					}
					this.setState(
						{
							agreement: data.data.getcontracts[0].Contract_Terms,
							signature:
								signatory == 'C'
									? data.data.getcontracts[0].Client_Signature
									: data.data.getcontracts[0].Company_Signature,
							signatory: signatory
						},
						() => {
							if (this.sigPad) this.sigPad.fromDataURL(this.state.signature);

							if (this.state.signature && this.sigPad) this.sigPad.off();
							this.setState({
								loadingData: false,
								allowSave: this.state.signature,
								saved: this.state.signature,
								disableButtonLetter: this.state.signature,
								view: this.state.signature ? 2 : 3
							});
						}
					);
				} else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading agreement: getcontracts not exists in query data'
					);
					this.setState({ loadingData: false });
				}
			})
			.catch((error) => {
				console.log('Error: Loading agreement: ', error);
				this.props.handleOpenSnackbar('error', 'Error: Loading agreement: ' + error);
				this.setState({ loadingData: false });
			});
	};
	validateToken = (token, signatory) => {
		this.setState({ loadingToken: true });
		this.props.client
			.query({
				query: this.GET_TOKEN_QUERY,
				variables: { Token: `'${token}'`, Signatory: `'${signatory}'` },
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.validtokens != null) {
					if (data.data.validtokens.length == 0) {
						this.props.history.push('/home/');
						return true;
					}
					this.setState(
						{
							tokenValid: data.data.validtokens.length > 0,
							idContract: data.data.validtokens[0].Id_Contract
						},
						() => {
							if (this.state.tokenValid) this.loadAgreement(signatory);
							else this.props.history.push('/home/');
						}
					);
				} else {
					this.setState({ loadingToken: false }, () => {
						this.props.history.push('/home/');
					});
				}
			})
			.catch((error) => {
				console.log('Error: Loading agreement: ', error);
				this.setState({ loadingToken: false }, () => {
					this.props.history.push('/home/');
				});
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
							Id: this.state.idContract,
							Signature: `${this.state.signature}`,
							Signatory: this.state.signatory
						}
					})
					.then((data) => {
						this.props.handleOpenSnackbar('success', 'Document Signed!');
						this.setState(
							{
								success: true,
								loading: false,
								allowSave: false,
								saved: true,
								view: 2
							},
							() => {
								if (this.sigPad) this.sigPad.off();
							}
						);
					})
					.catch((error) => {
						console.log('Error: Signing Document: ', error);
						this.props.handleOpenSnackbar('error', 'Error: Signing Document: ' + error);
						this.setState({
							success: false,
							loading: false
						});
					});
			}
		);
	};
	handleSaveSignature = () => {
		if (this.state.saved || !this.state.allowSave) return false;
		if (this.sigPad.isEmpty()) {
			this.props.handleOpenSnackbar('warning', 'You need to sign the document!');
			return false;
		}
		this.setState({ signature: this.sigPad.toDataURL() }, this.saveSignature);
	};

	clearSignature = (e) => {
		if (this.state.saved) return false;
		this.setState(
			{
				selectedColor: 'blackSelector',
				selectedLetter: 'letter1Selector',
				inputText: '',
				disableButtonLetter: false,
				empty: true,
				allowSave: false
			},
			() => {
				this.sigPad.on();
				this.sigPad.clear();
			}
		);
	};
	handleOpenSignatureModal = () => {
		this.setState({ openSignatureModal: true });
	};

	handleCloseSignatureModal = () => {
		this.setState({ openSignatureModal: false });
	};

	componentWillMount() {
		console.log('Signature', this.props);
		const values = queryString.parse(this.props.location.search);
		if (!values.token || !values.signatory) this.props.history.push('/home/');

		this.validateToken(values.token, values.signatory);
	}
	componentDidMount() {
		window.addEventListener('resize', this.resizeCanvas.bind(this));
		this.resizeCanvas();
	}
	handleClickOpenModal = () => {
		this.setState({ openModal: true });
	};

	handleCloseModal = () => {
		this.setState({
			openModal: false,
			selectedColor: 'blackSelector',
			selectedLetter: 'letter1Selector',
			inputText: ''
		});
	};

	handleColorSelectorClick = (event) => {
		this.setState({ selectedColor: event.currentTarget.id });
	};
	handleLetterSelectorClick = (event) => {
		this.setState({ selectedLetter: event.currentTarget.id });
	};
	getClassColorSelector = (id) => {
		switch (id) {
			case 'blackSelector':
				if (this.state.selectedColor == id) return 'signature-handwriting-color leftborder selected';
				else return 'signature-handwriting-color leftborder';
				break;
			case 'blueSelector':
				if (this.state.selectedColor == id) return 'signature-handwriting-color noleftborder selected';
				else return 'signature-handwriting-color noleftborder';
				break;
			case 'greenSelector':
				if (this.state.selectedColor == id) return 'signature-handwriting-color noleftborder selected';
				else return 'signature-handwriting-color noleftborder';
				break;
			default:
				return 'signature-handwriting-color leftborder';
				break;
		}
	};
	getClassLetterSelector = (id) => {
		switch (id) {
			case 'letter1Selector':
				if (this.state.selectedLetter == id)
					return 'default-font signature-handwriting-letter leftborder selected';
				else return 'default-font signature-handwriting-letter leftborder';
				break;
			case 'letter2Selector':
				if (this.state.selectedLetter == id)
					return 'second-font signature-handwriting-letter noleftborder selected';
				else return 'second-font signature-handwriting-letter noleftborder';
				break;
			case 'letter3Selector':
				if (this.state.selectedLetter == id)
					return 'third-font signature-handwriting-letter noleftborder selected';
				else return 'third-font signature-handwriting-letter noleftborder';
				break;
			default:
				return 'default-font signature-handwriting-letter leftborder';
				break;
		}
	};
	getClassTextInput = () => {
		var font = 'signature-handwriting-input blackText';
		switch (this.state.selectedColor) {
			case 'blackSelector':
				font = 'signature-handwriting-input blackText';
				break;
			case 'blueSelector':
				font = 'signature-handwriting-input blueText';
				break;
			case 'greenSelector':
				font = 'signature-handwriting-input greenText';
				break;
			default:
				font = 'signature-handwriting-input blackText';
				break;
		}
		switch (this.state.selectedLetter) {
			case 'letter1Selector':
				font += ' default-font';
				break;
			case 'letter2Selector':
				font += ' second-font';
				break;
			case 'letter3Selector':
				font += ' third-font';
				break;
			default:
				font += ' default-font';
				break;
		}
		return font;
	};

	render() {
		const { classes } = this.props;
		const buttonClassname = classNames({
			[classes.buttonSuccess]: success
		});
		const { loading, success } = this.state;
		const { fullScreen } = this.props;
		if (this.state.view == 1) {
			return <div>{this.state.loadingData && <LinearProgress />}</div>;
		} else if (this.state.view == 2) {
			return (
				<div className="signature-container" id="signatureMainContainer">
					{this.state.loadingData && <LinearProgress />}
					<NothingToDisplay
						url="https://cdn3.iconfinder.com/data/icons/business-2-3/256/Contract-512.png"
						message="Contract Signed!"
					/>
				</div>
			);
		}
		return (
			<div className="signature-container" id="signatureMainContainer">
				{this.state.loadingData && <LinearProgress />}
				<h1 className="signature-header"> Legal Agreement</h1>
				<div className="signature-content">
					<div className="signature-information">{renderHTML(this.state.agreement)}</div>
				</div>
				<h1 className="signature-header"> Signature</h1>
				<div className="signaturePad-MainContainer">
					<div id="signaturePadContainer" className="signaturePad-container">
						<SignaturePad
							ref={(ref) => {
								this.sigPad = ref;
							}}
							clearOnResize={false}
							id="signingSurface"
							canvas={<canvas id="signingCanvas" ref="signingCanvas" style={{ maxHeight: 300 }} />}
							canvasProps={{ className: 'signature-input', id: 'signingCanvas' }}
							onEnd={(e) => {
								this.setState({
									disableButtonLetter: true,
									allowSave: true,
									empty: false,
									signature: this.sigPad.toDataURL()
								});
							}}
						/>
					</div>
				</div>
				<div className="signature-footer">
					<div className="signature-button-root">
						<div className="signature-button">
							<Tooltip title={'Clear'}>
								<div>
									<Button
										disabled={this.state.loading || this.state.saved || this.state.empty}
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
					</div>
					<div className="signature-button-root">
						<div className="signature-button">
							<Tooltip title="Write Signature">
								<div>
									<Button
										disabled={
											this.state.loading || this.state.disableButtonLetter || this.state.saved
										}
										variant="fab"
										className={[buttonClassname, classes.buttonSuccess].join(' ')}
										onClick={this.handleClickOpenModal}
									>
										<TitleIcon />
									</Button>
								</div>
							</Tooltip>
						</div>{' '}
					</div>

					<div className="signature-button-root">
						<div className="signature-button-wrapper">
							<div className="signature-button">
								<Tooltip title="Sign Contract">
									<div>
										<Button
											disabled={this.state.loading || !this.state.allowSave || this.state.saved}
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
				<Dialog
					fullScreen={fullScreen}
					open={this.state.openModal}
					onClose={this.handleCloseModal}
					aria-labelledby="responsive-dialog-title"
				>
					<DialogTitle id="responsive-dialog-title">{'Write Signature'}</DialogTitle>
					<DialogContent className="signature-handwriting-dialog-content">
						<div className="signature-handwriting-color-container">
							<div
								id="blackSelector"
								className={this.getClassColorSelector('blackSelector')}
								onClick={this.handleColorSelectorClick}
							>
								<div className="circleBase black" />
							</div>
							<div
								id="greenSelector"
								className={this.getClassColorSelector('greenSelector')}
								onClick={this.handleColorSelectorClick}
							>
								<div className="circleBase green" />
							</div>
							<div
								id="blueSelector"
								className={this.getClassColorSelector('blueSelector')}
								onClick={this.handleColorSelectorClick}
							>
								<div className="circleBase blue" />
							</div>
						</div>
						<div className="signature-handwriting-container">
							<textarea
								id="signatureContainer"
								type="text"
								spellCheck="false"
								maxLength="20"
								className={this.getClassTextInput()}
								placeholder={'Write Signature'}
								value={this.state.inputText}
								onChange={(e) => {
									this.setState({ inputText: e.currentTarget.value });
								}}
							/>
						</div>
						<div className="signature-handwriting-letter-container">
							<div
								id="letter1Selector"
								className={this.getClassLetterSelector('letter1Selector')}
								onClick={this.handleLetterSelectorClick}
							>
								Text
							</div>
							<div
								id="letter2Selector"
								className={this.getClassLetterSelector('letter2Selector')}
								onClick={this.handleLetterSelectorClick}
							>
								Text
							</div>
							<div
								id="letter3Selector"
								className={this.getClassLetterSelector('letter3Selector')}
								onClick={this.handleLetterSelectorClick}
							>
								Text
							</div>
						</div>
					</DialogContent>
					<DialogActions>
						<div className={classes.wrapper}>
							<Button
								onClick={this.insertTextIntoCanvas}
								variant="contained"
								className={classes.buttonSuccess}
							>
								Accept
							</Button>
						</div>
						<Button onClick={this.handleCloseModal} color="secondary" variant="contained">
							Cancel
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
}
Signature.propTypes = {
	classes: PropTypes.object.isRequired,
	fullScreen: PropTypes.bool.isRequired
};
export default withStyles(styles)(withApollo(withMobileDialog()(withGlobalContent(Signature))));
