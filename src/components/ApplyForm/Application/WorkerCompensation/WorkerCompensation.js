import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import renderHTML from 'react-render-html';
import { CREATE_DOCUMENTS_PDF_QUERY, GET_CITY_NAME, GET_STATE_NAME, GET_WORKER_COMPENSATION_INFO, GET_DOCUMENT_TYPE } from "./Queries";
import { GET_APPLICANT_INFO } from "../ConductCode/Queries";
import { ADD_WORKER_COMPENSATION, UPDATE_WORKER_COMPENSATION } from "./Mutations";
import withApollo from "react-apollo/withApollo";
import withGlobalContent from "../../../Generic/Global";
import SignatureForm from "../../SignatureForm/SignatureForm";
import './index.css';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from "react-datepicker";
import Document from './Document';
const uuidv4 = require('uuid/v4');

const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);


const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class WorkerCompensation extends Component {
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

            applicantAddress: '',
            applicantCity: '',
            applicantState: '',
            applicantZipCode: '',

            initialNotification: false,
            injuryNotification: false,
            injuryDate: '',
            completed: false,
            urlPDF: null,
            userId: 0,
            typeDocumentId: 0
        }
    }

    formatDate = (date, useSubstring = false) => {
        if(!date) return '';

        let substringDate = useSubstring ? String(date).substring(0, 10) : date;
        return moment(substringDate).format('MM/DD/YYYY');
    }

    handleSignature = (value) => {
        this.setState({
            signature: value,
            date: this.formatDate(new Date().toISOString()),
            completed: true
        });
    };

    cloneForm = _ => {
        let contentPDF = document.getElementById('DocumentPDF');
        let contentPDFClone = contentPDF.cloneNode(true);
        return `<html style="zoom: 60%;">${contentPDFClone.innerHTML}</html>`;
    }

    createDocumentsPDF = (uuid, download = false) => {
        this.setState({ downloading: true });
        this.props.client
            .query({
                query: CREATE_DOCUMENTS_PDF_QUERY,
                variables: {
                    contentHTML: this.cloneForm(),
                    Name: "WorkerCompensation-" + uuid + "-" + this.state.applicantName
                },
                fetchPolicy: 'no-cache'
            })
            .then(({data}) => {
                if (data.createdocumentspdf !== null) {
                    this.setState({
                        urlPDF: data.createdocumentspdf,
                        loadingData: false,
                        downloading: false
                    }, () => {
                        this.UpdatePdfUrlWorkerCompensation();
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
        var url = this.state.urlPDF;
        if(url)
            window.open(url, '_blank');
        else
            this.props.handleOpenSnackbar(
                'error',
                'Error to open Worker Compensation document.',
                'bottom',
                'right'
            );
    };

    insertWorkerCompensation = () => {
        // let workerCompensationObject = Object.assign({}, item);
        // delete workerCompensationObject.openSignature;
        // delete workerCompensationObject.id;
        // delete workerCompensationObject.accept;
        // delete workerCompensationObject.urlPDF; // no es necesario en el crear

        // if (workerCompensationObject.injuryDate === '') {
        //     workerCompensationObject.injuryDate = null;
        // }

        const random = uuidv4();
        const html = this.cloneForm();
        const { signature, applicantName, date, applicantAddress, applicantCity,
            applicantState, applicantZipCode, initialNotification, injuryNotification, injuryDate        
        } = this.state;
        const jsonFields = JSON.stringify({signature, applicantName, date, applicantAddress, applicantCity,
            applicantState, applicantZipCode, initialNotification, injuryNotification, injuryDate});

        this.props.client
            .mutate({
                mutation: ADD_WORKER_COMPENSATION,
                variables: {
                    fileName: "WorkerCompensation-" + random + "-" + this.state.applicantName,
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
                // Show a snackbar with a success message
                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully signed!',
                    'bottom',
                    'right'
                );

                this.getWorkerCompensationInformation(this.props.applicationId);
                this.props.changeTabState();
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to sign Worker Compensation document. Please, try again!',
                    'bottom',
                    'right'
                );
            });
    };

    UpdatePdfUrlWorkerCompensation = () => {
        this.props.client
            .mutate({
                mutation: UPDATE_WORKER_COMPENSATION,
                variables: {
                    workerCompensation: {
                        id: this.state.id,
						pdfUrl: this.state.urlPDF,
						content: this.state.content || '',
						ApplicationId: this.state.ApplicationId
                    }
                }
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to updating url Worker Compensation document.',
                    'bottom',
                    'right'
                );
            });
    };

    getApplicantInformation = (id) => {
        this.props.client
            .query({
                query: GET_APPLICANT_INFO,
                variables: {
                    id: id
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.applications[0] !== null) {
                    this.setState({
                        applicantName: data.applications[0].firstName + " " + data.applications[0].middleName + " " + data.applications[0].lastName,
                        applicantAddress: data.applications[0].streetAddress,
                        applicantCity: data.applications[0].city,
                        applicantState: data.applications[0].state,
                        applicantZipCode: data.applications[0].zipCode,
                    }, () => this.getStateAndCity(parseInt(this.state.applicantState), parseInt(this.state.applicantCity)));
                }
            })
            .catch(error => {

            })
    };

    getWorkerCompensationInformation = (id) => {
        this.props.client
            .query({
                query: GET_WORKER_COMPENSATION_INFO,
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
                        //applicantName: formData.applicantName,
                        date: this.formatDate(formData.date),
                        applicantAddress: formData.applicantAddress,
                        applicantCity: formData.applicantCity,
                        applicantState: formData.applicantState,
                        applicantZipCode: formData.applicantZipCode,
                        initialNotification: formData.initialNotification,
                        injuryNotification: formData.injuryNotification,
                        injuryDate: this.formatDate(formData.injuryDate),
                        urlPDF: data.lastApplicantLegalDocument.url,
                    });
                }
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to get worker compensation information. Please, try again!',
                    'bottom',
                    'right'
                );
            })
    };

    getDocumentType = () => {
        this.props.client
            .query({
                query: GET_DOCUMENT_TYPE,
                variables: {
                    name: 'Worker Compensation'
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.applicationDocumentTypes.length) {
                    this.setState({
                        typeDocumentId: data.applicationDocumentTypes[0].id
                    }, _ => {
                        this.getWorkerCompensationInformation(this.props.applicationId);
                        this.getApplicantInformation(this.props.applicationId);
                    });
                }
            })
            .catch(error => {
                console.log(error);
            })
    };

    getStateAndCity = (stateId, cityId) => {
        this.props.client
            .query({
                query: GET_STATE_NAME,
                variables: {
                    id: stateId,
                    parent: 6
                }
            })
            .then(({ data }) => {
                if(data.getcatalogitem[0]){
                    this.setState({
                        applicantState: data.getcatalogitem[0].Name.trim()
                    }, () => {
                        this.props.client
                            .query({
                                query: GET_CITY_NAME,
                                variables: {
                                    id: cityId,
                                    parent: stateId
                                }
                            })
                            .then(({ data }) => {
                                if(data.getcatalogitem[0]){
                                    this.setState({
                                        applicantCity: data.getcatalogitem[0].Name
                                    });
                                }
                            })
                            .catch(error => {
                                this.props.handleOpenSnackbar(
                                    'error',
                                    'Error to get City Name. Please, try again!',
                                    'bottom',
                                    'right'
                                );
                            })
                    })
                }
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to get State Name. Please, try again!',
                    'bottom',
                    'right'
                );
            })
    };

    handlePdfDownload = () => {
        this.downloadDocumentsHandler();
    }

    handleChangeInjuryDate = (date) => {
        //let injuryDate = this.formatDate(date);
        this.setState({
            injuryDate: date
        });
    }

    componentWillMount() {
        this.setState({
            userId: localStorage.getItem('LoginId') || 0
        }, () => this.getDocumentType());
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
            <form
                autoComplete="off"
                id="worker-compensation-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    if (this.state.signature === '') {
                        this.props.handleOpenSnackbar(
                            'warning',
                            'Please sign!',
                            'bottom',
                            'right'
                        );
                    } else {

                        this.insertWorkerCompensation();
                        this.setState({
                            openSignature: false
                        })
                    }
                }}
                className="apply-form"
            >
                <Dialog
                    fullWidth
                    open={this.state.openSignature}
                    onClose={() => {
                        this.setState({
                            openSignature: false,
                            signature: ''
                        }, () => {
                            if (this.state.signature === '') {
                                this.setState({
                                    accept: false
                                })
                            }
                        })
                    }}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle className="worker-compensation-form ">
                        <h1 className="primary apply-form-container__label text-center">Please Complete and Sign</h1>
                    </DialogTitle>
                    <DialogContent className="no-margin">
                        <div className="col-12 form-section-1">
                            <div className="row">
                            <div className="col-6">
                                    <label className="primary">Initialing the network program (companywide)</label>
                                    <label className="switch">
                                        <input
                                            id="initialNotification"
                                            form="worker-compensation-form"
                                            name="worker-compensation-form"
                                            onChange={(event) => {
                                                this.setState({
                                                    initialProgram: event.target.checked
                                                });
                                            }}
                                            checked={this.state.initialProgram}
                                            value={this.state.initialProgram}
                                            type="checkbox"
                                            className="form-control"
                                            min="0"
                                            maxLength="50"
                                            minLength="10"
                                        />
                                        <p className="slider round"></p>
                                    </label>
                                </div>
                                <div className="col-6">
                                    <label className="primary">Initial employee notification (new hire)</label>
                                    <label className="switch">
                                        <input
                                            id="initialNotification"
                                            form="worker-compensation-form"
                                            name="worker-compensation-form"
                                            onChange={(event) => {
                                                this.setState({
                                                    initialNotification: event.target.checked
                                                });
                                            }}
                                            checked={this.state.initialNotification}
                                            value={this.state.initialNotification}
                                            type="checkbox"
                                            className="form-control"
                                            min="0"
                                            maxLength="50"
                                            minLength="10"
                                        />
                                        <p className="slider round"></p>
                                    </label>
                                </div>
                                <div className="col-6">
                                    <label className="primary">Is this a injury notification?</label>
                                    <label className="switch">
                                        <input
                                            id="injuryNotification"
                                            form="worker-compensation-form"
                                            name="injuryNotification"
                                            onChange={(event) => {
                                                this.setState({
                                                    injuryNotification: event.target.checked
                                                });
                                            }}
                                            checked={this.state.injuryNotification}
                                            value={this.state.injuryNotification}
                                            type="checkbox"
                                            className="form-control"
                                            min="0"
                                            maxLength="50"
                                            minLength="10"
                                        />
                                        <p className="slider round"></p>
                                    </label>
                                </div>
                                <div className="col-6">
                                    <label className="primary">Injury Date</label>
                                    <div class="input-group flex-nowrap">
                                        <DatePicker
                                            id="injuryDate"
                                            name="injuryDate"
                                            selected={this.state.injuryDate}
                                            onChange={this.handleChangeInjuryDate}
                                            placeholderText="Injury Date"
                                            disabled={!this.state.injuryNotification}
                                        />
                                        <div class="input-group-append">
                                            <label class="input-group-text" id="addon-wrapping" for="injuryDate">
                                                <i class="far fa-calendar"></i>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <SignatureForm applicationId={this.state.applicationId}
                                        signatureValue={this.handleSignature}
                                        showSaveIcon={true}
                                    />
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <div className="applicant-card__footer worker-compensation-footer">
                        <button className="applicant-card__cancel-button" type="reset"
                            onClick={() => {
                                this.setState({ openSignature: false })
                            }}>
                            {spanishActions[2].label}
                        </button>
                        <button className="applicant-card__save-button" type="submit" form="worker-compensation-form">
                            {spanishActions[0].label}
                        </button>
                    </div>
                </Dialog>
            </form>
        );

        return (
            <div className="Apply-container--application" style={{ width: "100%", maxWidth: "900px", margin: "0 auto" }}>
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[7].label}</span>
                                {
                                    <div>
                                        {
                                            this.state.urlPDF ? (
                                                <button className="applicant-card__edit-button" onClick={this.handlePdfDownload}>
                                                    {this.state.downloading && (
                                                    <React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>)}
                                                    {!this.state.downloading && (<React.Fragment>{actions[9].label} <i
                                                        className="fas fa-download" /></React.Fragment>)}

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
                            <div className="p-4">
                                <div id="DocumentPDF" className="signature-information">
                                    {renderHTML(
                                        Document({
                                            languageForm: localStorage.getItem('languageForm'),
                                            initialProgram: this.state.initialProgram,
                                            initialNotification: this.state.initialNotification,
                                            injuryNotification: this.state.injuryNotification,
                                            signature: this.state.signature,
                                            date: this.formatDate(this.state.date, true),
                                            applicantName: this.state.applicantName,
                                            applicantAddress: this.state.applicantAddress,
                                            applicantCity: this.state.applicantCity,
                                            applicantState: this.state.applicantState,
                                            applicantZipCode: this.state.applicantZipCode,
                                            injuryDate: this.formatDate(this.state.injuryDate, true)
                                        })
                                    )}
                                </div>
                            </div>
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

export default withApollo(withGlobalContent(WorkerCompensation));