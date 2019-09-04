import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import SignatureForm from '../../SignatureForm/SignatureForm';
import withApollo from 'react-apollo/withApollo';
import renderHTML from 'react-render-html';
import { GET_APPLICANT_INFO, GET_CONDUCT_CODE_INFO, CREATE_DOCUMENTS_PDF_QUERY } from './Queries';
import { ADD_CONDUCT_CODE } from './Mutations';
import withGlobalContent from '../../../Generic/Global';
import Button from "@material-ui/core/es/Button/Button";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import PropTypes from 'prop-types';


const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

const lenguageform = localStorage.getItem("languageForm");

const uuidv4 = require('uuid/v4');

class ConductCode extends Component {
	constructor(props) {
		super(props);

		this.state = {
			id: '',
			signature: '',
			content: '',
			date: '',
			applicantName: '',
			ApplicationId: this.props.applicationId,
			openSignature: false,
			completed: false
		};
	}

	handleSignature = (value) => {
		this.setState(
			{
				signature: value,
				openSignature: false,
				date: new Date().toISOString().substring(0, 10),
				completed: true
			},
			() => {
				this.insertConductCode(this.state);
			}
		);
	};

	getApplicantInformation = (id) => {
		this.props.client
			.query({
				query: GET_APPLICANT_INFO,
				variables: {
					id: id
				}
			})
			.then(({ data }) => {
				if (data.applications[0] !== null) {
					this.setState({
						applicantName:
							data.applications[0].firstName +
							' ' +
							data.applications[0].middleName +
							' ' +
							data.applications[0].lastName
					});
				}
			})
			.catch((error) => { });
	};

	getConductCodeInformation = (id) => {
		this.props.client
			.query({
				query: GET_CONDUCT_CODE_INFO,
				variables: {
					id: id
				},
				fetchPolicy: 'no-cache'
			})
			.then(({ data }) => {
				if (data.applications[0].conductCode !== null) {
					this.setState({
						id: data.applications[0].conductCode.id,
						signature: data.applications[0].conductCode.signature,
						content: data.applications[0].conductCode.content,
						applicantName: data.applications[0].conductCode.applicantName,
						date: data.applications[0].conductCode.date
					});
				} else {
					this.setState({
						id: null
					});
				}
			})
			.catch((error) => {
				// If there's an error show a snackbar with a error message
				this.props.handleOpenSnackbar(
					'error',
					'Error to get conduct code information. Please, try again!',
					'bottom',
					'right'
				);
			});
	};

	insertConductCode = (item) => {
		let conductObject = Object.assign({}, item);
		delete conductObject.openSignature;
		delete conductObject.id;
		delete conductObject.accept;

		this.props.client
			.mutate({
				mutation: ADD_CONDUCT_CODE,
				variables: {
					conductCode: conductObject
				}
			})
			.then(({ data }) => {
				this.props.handleOpenSnackbar('success', 'Successfully signed!', 'bottom', 'right');

				this.setState({
					id: data.addConductCode[0].id
				});
				this.props.changeTabState("ApplicantConductCode");
			})
			.catch((error) => {
				// If there's an error show a snackbar with a error message
				this.props.handleOpenSnackbar(
					'error',
					'Error to sign Conduct Code document. Please, try again!',
					'bottom',
					'right'
				);
			});
	};

	cloneForm = _ => {
		let contentPDF = document.getElementById('DocumentPDF');
		let contentPDFClone = contentPDF.cloneNode(true);
		contentPDFClone.querySelector("#imgCanvasSign").style.zoom = "1.8";

		return `<html style="zoom: 60%; font-family: 'Times New Roman'; line-height: 1.5;">${contentPDFClone.innerHTML}</html>`;
	}

	createDocumentsPDF = (random) => {
		this.setState({
			downloading: true
		});
		this.props.client
			.query({
				query: CREATE_DOCUMENTS_PDF_QUERY,
				variables: {
					contentHTML: this.cloneForm(),
					Name: 'ConductCode-' + random
				},
				fetchPolicy: 'no-cache'
			})
			.then((data) => {
				if (data.data.createdocumentspdf != null) {
					this.state.urlPDF = data.data.createdocumentspdf;
				} else {
					this.props.handleOpenSnackbar(
						'error',
						'Error: Loading agreement: createdocumentspdf not exists in query data'
					);
					this.setState({ loadingData: false, downloading: false });
				}
			})
			.catch((error) => {
				this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
				this.setState({ loadingData: false, downloading: false });
			});
	};

	downloadDocumentsHandler = () => {
		var url = this.context.baseUrl + this.state.urlPDF; //'/public/Documents/' + 'ConductCode-' + this.state.applicantName + '.pdf';
		window.open(url, '_blank');
		this.setState({ downloading: false });
	};

	componentWillMount() {
		this.getConductCodeInformation(this.props.applicationId);
		this.getApplicantInformation(this.props.applicationId);
	}

	sleep() {
		return new Promise((resolve) => setTimeout(resolve, 8000));
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.applicationId != this.props.applicationId) {
			this.setState({
				applicationId: nextProps.applicationId
			});
		}
	}

	render() {
		let renderSignatureDialog = () => (
			<div>
				<Dialog
					fullWidth
					open={this.state.openSignature}
					onClose={() => {
						this.setState({
							openSignature: false,
						}, () => {
							if (this.state.signature === '') {
								this.setState({
									accept: false
								})
							}
						})
					}}
					aria-labelledby="form-dialog-title">
					<Toolbar>
						<h1 className="primary apply-form-container__label">Please Sign</h1>
						<Button color="default" onClick={() => {
							this.setState(() => ({ openSignature: false }),
								() => {
									if (this.state.signature === '') {
										this.setState({
											accept: false
										})
									}
								});
						}}>
							Close
                                </Button>
					</Toolbar>
					<DialogContent>
						<SignatureForm applicationId={this.state.applicationId}
							signatureValue={this.handleSignature}
							showSaveIcon={null}
						/>
					</DialogContent>
				</Dialog>
			</div>
		);

		return (
			<div className="Apply-container--application" style={{ width: '900px', margin: '0 auto' }}>
				<div className="row">
					<div className="col-12">
						<div className="applicant-card">
							<div className="applicant-card__header">
								<span className="applicant-card__title">{applyTabs[5].label}</span>
								{
									this.state.id === '' ? (
										''
									) : (
											<div>
												{
													this.state.id !== null ? (
														<button className="applicant-card__edit-button" onClick={() => {
															let random = uuidv4();
															this.createDocumentsPDF(random);
															this.sleep().then(() => {
																this.downloadDocumentsHandler();
															}).catch(error => {
																this.setState({ downloading: false })
															})
														}}>{this.state.downloading && (<React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>)}
															{!this.state.downloading && (<React.Fragment>{actions[9].label} <i className="fas fa-download" /></React.Fragment>)}
														</button>
													) : (
															<button className="applicant-card__edit-button" onClick={() => {
																this.setState({
																	openSignature: true
																})
															}}>{actions[8].label} <i className="far fa-edit"></i>
															</button>
														)
												}
											</div>
										)
								}
							</div>
							<div className="row pdf-container" style={{ margin: '0 auto', maxWidth: '95%', fontSize: '1.1rem' }}>
								<div id="DocumentPDF" className="signature-information">
									{
										lenguageform == 'en' ?
											renderHTML(`<div class="WordSection1">
                                                <p style="margin: 0.65pt 0in 0.0001pt 1pt; text-align: center; font-size: 11pt; " align="center"><strong><span style="font-size: 15.5pt;">Tumi Staffing Code of Conduct</span></strong></p>
                                                <p style="margin: 4.9pt 42.8pt 0.0001pt 0in; line-height: 110%; font-size: 11pt; "><span style=" line-height: 110%;">&nbsp;</span></p>
                                                <ol>
                                                <li style="text-align: justify;"><span style="">As an employee of Tumi Staffing committed to providing the highest level of guest service with a commitment to quality in every aspect of my job;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="">I agree to follow all rules and regulations of both Tumi Staffing, and the employment partner or hotel where I am assigned to work;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="">I understand that I have a responsibility for my safety and security, as well as that of my co-workers and our clients and hotel guests, and will conduct myself in a safe manner, and report any accidents, or unsafe conditions immediately to ensure that corrective action is taken;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="">I will arrive to my workplace with sufficient time to ensure that I am in uniform and ready to clock-in and begin my work shift on time;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="">I will practice good hygiene, including bathing and washing my hair, being clean shaven, using deodorant, brushing my teeth before reporting to work, and using clothing that is clean, pressed and presentable for the work environment; </span></li>
                                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="">When in the front of the house guest contact areas, I will conduct myself in a positive and professional manner, making contact with and offering a warm and friendly greeting to every guest I encounter;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="">I understand that a positive work environment is critical to the success of our business, and I will treat every other Tumi Staffing employee, supervisor or manager, or those of our employment partner with the same respect and dignity as we treat our hotel guests;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="">I will perform my assigned duties in a through and timely manner, with a positive attitude, always seeking to exceed the expectations of the guests and our employment partner;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="">I understand that open lines of communication and a free flow of information are critical to the success of our business and our relationship with our employment partner, and I will report to Tumi Staffing Management, any problems I encounter in the workplace or which are reported to me, including any inappropriate behavior by or toward any employee of Tumi Staffing, any safety or security hazards or violations, any guest or employee accidents, or any inappropriate or unethical conduct, and will never do anything to hinder communication between Tumi employees, supervisors, managers, or our employment partner;</span><span style="">&nbsp;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="">I will conduct myself with honesty and integrity in all interactions with my coworkers, hotel staff, supervisors and managers and will not engage in any unsafe or inappropriate conduct, or actions which would negatively reflect on Tumi Staffing or our hotel partner, or cause a conflict of interest with either one;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="">I am committed to the success of Tumi Staffing, Inc and providing a positive environment to all of my fellow employees!</span></li>
                                                </ol>
                                                <p style="margin: 4.4pt 0in 0.0001pt; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Signed: <u><img id ="imgCanvasSign" width="150" height="auto" src="` +
												this.state.signature +
												`" alt=""></u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date: <u>` +
												this.state.date.substring(0, 10) +
												`</u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                                <p style="margin: 4.4pt 0in 0.0001pt; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Printed Name: <u>` + this.state.applicantName + `</u></p>
                                                </div>`) :
											renderHTML(`<div class="WordSection1">
                                <p style="margin: 0.65pt 0in 0.0001pt 1pt; text-align: center;"
                                    align="center"><strong><span style="font-size: 15.5pt;">Tumi Staffing
                                            Codigo de Conducta</span></strong></p>
                                <p style="margin: 4.9pt 42.8pt 0.0001pt 0in; line-height: 110%; "><span
                                        style=" line-height: 110%;">&nbsp;</span></p>
                                <ol>
                                    <ol>
                                        <li>Como trabajador de Tumi Staffing me comprometo a proporcionar un alto nivel de servicio con gran
                                            calidad en cada aspecto de mi trabajo.</li>
                                        <li><span style="">Me comprometo a seguir todas las reglas y regulaciones tanto de Tumi
                                                Staffing como de la compania asociada o hotel donde yo este asignado a trabajar</span></li>
                                        <li><span style="">Yo comprendo que soy responsable por mi seguridad, la seguidad de mis
                                                companeros de trabajo, nuestros clientes y huespedes. Me conducire de una manera segura. Reportare
                                                immediatamente cualquier accidente o insegura condicion para prevenir un accidente. </span></li>
                                        <li><span style="">Voy a llegar a mi trabajo con suficiente tiempo para cambiarme ponerme
                                                el uniforme y estar listo para iniciar mi jornmada de trabajo a tiempo.</span></li>
                                        <li><span style="">Voy a presentarme con un buen aseo personal: banado, lavado ,peinado,
                                                afeitado. Usare desodorante, cepillare mis dientes. Usare ropa limpia, presentable y
                                                profesionalpara trabajar.</span></li>
                                        <li>Cuando me encuentre en mi ambiente de trabajo me conducire con una actitud positive y profesional. Hare
                                            contacto visual con los huespedes, ofreciendo un calida y amigable saludo.</li>
                                        <li>Comprendo que un positvo ambiente de trabajo es crucial e importante para alcazar el exito en nuestro
                                            negocio. Voy a tratar cada trabajador de Tumi Staffing, supervisor o manager y empleados de la compania
                                            asociada con el mismo respeto y dignidad que trato a los huespedes.</li>
                                        <li>Voy a hacer mis deberes de la mejor manera y en el correcto tiempo, con una actitud positive. Siempre
                                            velare por alcanzar las espectativas del huesped y de nuestro compania asociada.</li>
                                        <li><span style="">Comprendo que una abieta y fluida comunicacion es importante para el
                                                exito de nuestro negocio y de nuestra relacion con la compania asociada. Reportare a Tumi Staffing
                                                manager cualquier problema que yo encuentre o que me repoten en mi area de trabajo. Reportare
                                                cualquier inapropiada conducta de cualquier trabajador de Tumi Staffing, violacion a la seguridad,
                                                cualquier accidente de huesped o trabajador o inapropiada o no etica conducta. Nunca ocultare
                                                informacion entre Tumi trabajador, supervisor, manager o nuestros companeros asociados.</span></li>
                                        <li>Me conducire con honestidad e integridad en todo momento tanto con mis companeros de trabajo, personal
                                            del hotel, supervisors y gerentes. No permitire ninguna inseguridad o inapropiada conducta o accion que
                                            repercuta negativamente en Tumi Staffing o Hotel asociado, o que cause conflicto de intereses en uno u
                                            otro.</li>
                                        <li>Me comprometo con la compania Tumi Staffing a proporcionar positivo ambiente con todos los companeros
                                            de trabajo.</li>
                                    </ol>
                                </ol>
                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                <p style="margin: 5.4pt 0in 0.0001pt; font-size: 9.5pt; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    Signed: <u><img  id ="imgCanvasSign" src="` + this.state.signature + `" alt="" width="150" height="auto" /></u>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date: <u>` +
												this.state.date.substring(0, 10) + `</u>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
                                <p style="margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
                                <p style="margin: 5.4pt 0in 0.0001pt; font-size: 9.5pt; ">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    Printed Name: <u>` + this.state.applicantName + `</u></p>
                            </div>
                            <p>&nbsp;</p>
                            `)}

								</div> </div>
						</div>
					</div>
				</div>
				{
					renderSignatureDialog()
				}
			</div>
		);
	}

	static contextTypes = {
		baseUrl: PropTypes.string
	};

}

export default withApollo(withGlobalContent(ConductCode));
