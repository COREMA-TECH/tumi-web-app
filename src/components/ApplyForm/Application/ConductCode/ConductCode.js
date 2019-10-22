import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import SignatureForm from '../../SignatureForm/SignatureForm';
import withApollo from 'react-apollo/withApollo';
import renderHTML from 'react-render-html';
import { GET_APPLICANT_INFO, GET_CONDUCT_CODE_INFO, CREATE_DOCUMENTS_PDF_QUERY, GET_DOCUMENT_TYPE } from './Queries';
import { ADD_CONDUCT_CODE, UPDATE_CONDUCT_CODE } from './Mutations';
import withGlobalContent from '../../../Generic/Global';
import Button from "@material-ui/core/es/Button/Button";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import PropTypes from 'prop-types';
import moment from 'moment';
import Document from './Document';

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

const lenguageform = localStorage.getItem('languageForm');

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
			completed: false,
			userId: 0,
            typeDocumentId: 0
		};
	}

	formatDate = (date, useSubstring = false) => {
        if(!date) return '';

        let substringDate = useSubstring ? String(date).substring(0, 10) : date;
        return moment(substringDate).format('MM/DD/YYYY');
    }

	handleSignature = (value) => {
		this.setState(
			{
				signature: value,
				openSignature: false,
				date: this.formatDate(new Date().toISOString(), true),
				completed: true
			},
			() => {
				this.insertConductCode();
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
					ApplicationId: id,
                    ApplicationDocumentTypeId: this.state.typeDocumentId
				},
				fetchPolicy: 'no-cache'
			})
			.then(({ data }) => {
				if (data.lastApplicantLegalDocument) {
					const fd = data.lastApplicantLegalDocument.fieldsData;
                    const formData = fd ? JSON.parse(fd) : {};
					this.setState({
						signature: formData.signature,
						applicantName: formData.applicantName,
						date: this.formatDate(formData.date),
						urlPDF: data.lastApplicantLegalDocument.url
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

	getDocumentType = () => {
        this.props.client
            .query({
                query: GET_DOCUMENT_TYPE,
                variables: {
                    name: 'Conduct Code'
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.applicationDocumentTypes.length) {
                    this.setState({
                        typeDocumentId: data.applicationDocumentTypes[0].id
                    }, _ => {
                        this.getConductCodeInformation(this.props.applicationId);
						this.getApplicantInformation(this.props.applicationId);
                    });
                }
            })
            .catch(error => {
                console.log(error);
            })
    };

	insertConductCode = () => {
		// let conductObject = Object.assign({}, item);
		// delete conductObject.openSignature;
		// delete conductObject.id;
		// delete conductObject.accept;
		// delete conductObject.urlPDF; // no es necesario en el crear
		const random = uuidv4();
        const html = this.cloneForm();
        const {applicantName, date, signature} = this.state;
        const jsonFields = JSON.stringify({applicantName, date, signature});

		this.props.client
			.mutate({
				mutation: ADD_CONDUCT_CODE,
				variables: {
					fileName: "ConductCode-" + random + "-" + this.state.applicantName,
                    html,
                    applicantLegalDocument: {
                        fieldsData: jsonFields,
                        ApplicationDocumentTypeId: this.state.typeDocumentId,
                        ApplicationId: this.props.applicationId,
                        UserId: this.state.userId,
                        completed: true
                    }
				}
			})
			.then(({ data }) => {
				this.props.handleOpenSnackbar('success', 'Successfully signed!', 'bottom', 'right');

				this.getConductCodeInformation(this.props.applicationId);

				this.props.changeTabState();
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

	updateConductCode = () => {
		this.props.client
			.mutate({
				mutation: UPDATE_CONDUCT_CODE,
				variables: {
					conductCode: {
						id: this.state.id,
						pdfUrl: this.state.urlPDF,
						content: this.state.content,
						ApplicationId: this.state.ApplicationId
					}
				}
			})
			.catch((error) => {
				// If there's an error show a snackbar with a error message
				this.props.handleOpenSnackbar(
					'error',
					'Error updating url Conduct Code document.',
					'bottom',
					'right'
				);
			});
	};


	cloneForm = _ => {
		let contentPDF = document.getElementById('DocumentPDF');
		let contentPDFClone = contentPDF.cloneNode(true);
		contentPDFClone.querySelector("#imgCanvasSign").style.zoom = "1.8";

		return `<html style="zoom: 60%; font-family: 'Times New Roman'; line-height: 1.3;">${contentPDFClone.innerHTML}</html>`;
	}

	createDocumentsPDF = (random, download = false) => {
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
			.then(({data}) => {
				if (data.createdocumentspdf != null) {
					//this.state.urlPDF = data.data.createdocumentspdf;
					this.setState({
						urlPDF: data.createdocumentspdf,
						downloading: false
					}, () => {
						this.updateConductCode(); 
						if(download) this.downloadDocumentsHandler();
					});
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
		const url = this.state.urlPDF; //this.context.baseUrl + this.state.urlPDF;
		if(url) window.open(url, '_blank');
	};

	componentWillMount() {
		this.setState({
            userId: localStorage.getItem('LoginId') || 0
        }, () => this.getDocumentType());
	}

	sleep() {
		return new Promise((resolve) => setTimeout(resolve, 8000));
	}

	handlePdfDownload = () => {
		if(this.state.urlPDF){
			this.downloadDocumentsHandler();
		}
		else {
			let random = uuidv4();
			this.createDocumentsPDF(random, true);
		}
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
			<div className="Apply-container--application" style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
				<div className="row">
					<div className="col-12">
						<div className="applicant-card">
							<div className="applicant-card__header">
								<span className="applicant-card__title">{applyTabs[5].label}</span>
								{
									<div>
										{
											this.state.urlPDF ? (
												<button className="applicant-card__edit-button" onClick={this.handlePdfDownload}>
													{this.state.downloading && (<React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>)}
													{!this.state.downloading && (<React.Fragment>{actions[9].label} <i className="fas fa-download" /></React.Fragment>)}
												</button>
											) : ''
										}
										<button className="applicant-card__edit-button ml-2" onClick={() => {
											this.setState({
												openSignature: true
											})
											}}>{actions[8].label} <i className="far fa-edit"></i>
										</button>
									</div>
								}
							</div>
							<div className="row pdf-container" style={{ margin: '0 auto', maxWidth: '95%', fontSize: '1.1rem' }}>
								<div id="DocumentPDF" className="signature-information">
									{
										renderHTML(
											Document({
												applicantName: this.state.applicantName,
												date: this.state.date,
												signature: this.state.signature
											}, lenguageform)
										)
									}
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
