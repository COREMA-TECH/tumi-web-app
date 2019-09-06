import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import renderHTML from 'react-render-html';
import { CREATE_DOCUMENTS_PDF_QUERY, GET_CITY_NAME, GET_STATE_NAME, GET_WORKER_COMPENSATION_INFO } from "./Queries";
import { GET_APPLICANT_INFO } from "../ConductCode/Queries";
import { ADD_WORKER_COMPENSATION, UPDATE_WORKER_COMPENSATION } from "./Mutations";
import withApollo from "react-apollo/withApollo";
import withGlobalContent from "../../../Generic/Global";
import SignatureForm from "../../SignatureForm/SignatureForm";
import './index.css';
import PropTypes from 'prop-types';
import moment from 'moment';
import DatePicker from "react-datepicker";
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
            urlPDF: null
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

    createDocumentsPDF = (uuid) => {
        this.setState(
            {
                downloading: true
            }
        )
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
                        loadingData: false
                    }, () => {
                        this.UpdatePdfUrlWorkerCompensation();
                        this.downloadDocumentsHandler();
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
        var url = this.state.urlPDF; //this.context.baseUrl + '/public/Documents/' + "WorkerCompensation-" + uuid + "-" + this.state.applicantName + '.pdf';
        if(url)
            window.open(url, '_blank');
        else
            this.props.handleOpenSnackbar(
                'error',
                'Error to open Worker Compensation document.',
                'bottom',
                'right'
            );

        this.setState({ downloading: false });
    };

    insertWorkerCompensation = (item) => {
        let workerCompensationObject = Object.assign({}, item);
        delete workerCompensationObject.openSignature;
        delete workerCompensationObject.id;
        delete workerCompensationObject.accept;
        delete workerCompensationObject.urlPDF; // no es necesario en el crear

        if (workerCompensationObject.injuryDate === '') {
            workerCompensationObject.injuryDate = null;
        }

        this.props.client
            .mutate({
                mutation: ADD_WORKER_COMPENSATION,
                variables: {
                    workerCompensation: workerCompensationObject
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
                }
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
                    id: id
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.applications[0].workerCompensation !== null) {
                    this.setState({
                        id: data.applications[0].workerCompensation.id,
                        signature: data.applications[0].workerCompensation.signature,
                        content: data.applications[0].workerCompensation.content,
                        applicantName: data.applications[0].workerCompensation.applicantName,
                        date: this.formatDate(data.applications[0].workerCompensation.date, true),
                        applicantAddress: data.applications[0].workerCompensation.applicantAddress,
                        applicantCity: data.applications[0].workerCompensation.applicantCity,
                        applicantState: data.applications[0].workerCompensation.applicantState,
                        applicantZipCode: data.applications[0].workerCompensation.applicantZipCode,
                        initialNotification: data.applications[0].workerCompensation.initialNotification,
                        injuryNotification: data.applications[0].workerCompensation.injuryNotification,
                        injuryDate: this.formatDate(data.applications[0].workerCompensation.injuryDate, true),
                        urlPDF: data.applications[0].workerCompensation.pdfUrl,
                    });
                } else {
                    this.setState({
                        id: null
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
        if(this.state.urlPDF){
            this.downloadDocumentsHandler();
        }
        else {
            const uuid = uuidv4();
            this.createDocumentsPDF(uuid);
        }
    }

    handleChangeInjuryDate = (date) => {
        //let injuryDate = this.formatDate(date);
        this.setState({
            injuryDate: date
        });
    }

    componentWillMount() {
        this.getWorkerCompensationInformation(this.props.applicationId);
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

                        this.insertWorkerCompensation(this.state);
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
                        <h1 className="primary apply-form-container__label text-center">Please Complete and
                            Sign</h1>
                    </DialogTitle>
                    <DialogContent className="no-margin">
                        <div className="col-12 form-section-1">
                            <div className="row">
                                <div className="col-12">
                                    <label className="primary">Is this a initial notification?</label>
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
                                <div className="col-12">
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
                            </div>
                            <div className="row">
                                <div className="col-12">
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
                                    this.state.id === '' ? (
                                        ''
                                    ) : (
                                            <div>
                                                {
                                                    this.state.id !== null ? (
                                                        <button className="applicant-card__edit-button" onClick={this.handlePdfDownload}>
                                                            {this.state.downloading && (
                                                            <React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>)}
                                                            {!this.state.downloading && (<React.Fragment>{actions[9].label} <i
                                                                className="fas fa-download" /></React.Fragment>)}

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
                            <div className="p-4">
                                <div id="DocumentPDF" className="signature-information">
                                    {renderHTML(`<p style="text-align: center; font-family: 'Times New Roman';"><span style="font-family: Times New Roman;"><b>Employee &nbsp;Acknowledgment &nbsp;of &nbsp;&nbsp;Workers&apos; Compensation Network</b></span></p>
<p style="text-align: justify; font-family: Times New Roman;"><strong><span style="font-family: 'Times New Roman';">&nbsp;</span></strong></p>
<p style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I &nbsp;have &nbsp;received information that tells me how to get health care under my employer&apos;s workers&apos; compensation insurance.</p>
<p style="text-align: justify; font-family: Times New Roman;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style="text-align: justify; font-family: Times New Roman;">If I am hurt on the job and live in a service area described in this information, I understand that:</p>
<ol style="margin-top: 0in; margin-bottom: .0001pt;">
    <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I must choose a treating doctor from the list of doctors in the network. Or, I may ask my HMO primary care physician to agree to serve as my treating doctor. If I select my HMO primary care physician as my treating doctor, I will call Texas Mutual at (800) 859-5995 to notify them of my choice.</li>
    <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I must go to my treating doctor for all health care for my injury. If I need a specialist, my treating doctor will refer me. If I need emergency care, I may go anywhere.</li>
    <li style="text-align: justify; font-family: Times New Roman;">The insurance carrier will pay the treating doctor and other network providers.</li>
    <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">I might have to pay the bill if I get health care from someone other than a network doctor without network approval.</li>
    <li style="text-align: justify; line-height: 1.5; font-family: Times New Roman;">Knowingly making a false workers&apos; compensation claim may lead to a criminal investigation that could result in criminal penalties such as fines and imprisonment.</li>
</ol>
<p style="text-align: justify; font-family: Times New Roman;"><span style="">&nbsp;</span></p>
<table style="border-collapse: collapse; width: 100%; border-style: none; margin-bottom: 14px" border="0" cellspacing="5">
    <tbody>
        <tr>
            <td style="width: 80%; border-bottom: 1px solid black; margin-right: 5px;"><img src="${this.state.signature || ''}" alt="" width="150" height="auto" style="zoom:1.5" /></td>
            <td style="width: 20%; border-bottom: 1px solid black; margin-left: 5px;">${this.state.date.substring(0, 10) || ''}</td>
        </tr>
        <tr>
            <td style="width: 80%; font-size: 10px; vertical-align: top;">Signature</td>
            <td style="width: 20%; font-size: 10px; vertical-align: top;">Date</td>
        </tr>
    </tbody>
</table>
<table style="border-collapse: collapse; width: 100%; border-style: none; margin-bottom: 14px" border="0" cellspacing="5">
    <tbody>
        <tr>
            <td style="width: 80%; border-bottom: 1px solid black; margin-right: 5px;">${this.state.applicantName || ''}</td>
            <td style="width: 20%;">&nbsp;</td>
        </tr>
        <tr>
            <td style="width: 80%; font-size: 10px; vertical-align: top;">Printed Name</td>
            <td style="width: 20%;">&nbsp;</td>
        </tr>
    </tbody>
</table>
<table style="border-collapse: collapse; width: 100%; border-style: none; margin-bottom: 14px" border="0">
    <tbody>
        <tr>
            <td style="width: 20%; margin-left: 5px;">I live at:</td>
            <td style="width: 80%; border-bottom: 1px solid black; margin-right: 5px;">${this.state.applicantAddress || ''}</td>
        </tr>
        <tr>
            <td style="width: 20%; margin-left: 5px;">&nbsp;</td>
            <td style="width: 80%; margin-right: 5px; font-size: 10px; vertical-align: top;">Street Address</td>
        </tr>
    </tbody>
</table>
<table style="border-collapse: collapse; width: 100%; border-style: none; margin-bottom: 14px" border="0">
    <tbody>
        <tr>
            <td style="width: 20%; margin-left: 5px;">&nbsp;</td>
            <td style="width: 20%; border-bottom: 1px solid black; margin-right: 5px;">${this.state.applicantCity || ''}</td>
            <td style="width: 40%; border-bottom: 1px solid black; margin-right: 5px;">${this.state.applicantState || ''}</td>
            <td style="width: 20%; border-bottom: 1px solid black; margin-right: 5px;">${this.state.applicantZipCode || ''}</td>
        </tr>
        <tr>
            <td style="width: 20%; margin-left: 5px;">&nbsp;</td>
            <td style="width: 20%; margin-right: 5px; font-size: 10px; vertical-align: top;">City</td>
            <td style="width: 40%; margin-right: 5px; font-size: 10px; vertical-align: top;">State</td>
            <td style="width: 20%; margin-right: 5px; font-size: 10px; vertical-align: top;">Zip Code</td>
        </tr>
    </tbody>
</table>

<p style="text-align: justify; font-family: Times New Roman;">Name of Employer: <u>TUMI STAFFING INC.</u></p>
<p style="text-align: justify; font-family: Times New Roman;">Name of Network: <em>Texas Star Network</em>&reg;</p>
<p style="text-align: justify; font-family: Times New Roman;"><span style="">&nbsp;</span></p>
<p style="text-align: justify; line-height: 1.5; font-family: Times New Roman;"><strong><span style="font-family: 'Times New Roman';">Network service areas are subject to change. Call (800) 381-8067 if you need a network treating </span></strong><strong><span style="font-family: 'Times New Roman';">provider.</span></strong></p>
<table style="border-collapse: collapse; width: 100%;" border="1">
    <tbody>
        <tr>
            <td style="width: 100%; padding: 8px;">
                <p style="font-family: Times New Roman;"><span style="">Please indicate whether this is the:</span></p>
                <ul style="margin-top: 1.0pt; margin-bottom: .0001pt; list-style: none;">
                    <li style="margin: 1pt 0in 0.0001pt 31.2px; font-family: Times New Roman;"><span style="">&#9633;  Initial Employee Notification</span></li>
                    <li style="margin: 0.95pt 0in 0.0001pt 31.2px; font-family: Times New Roman;"><span style="">&#9633;  Injury Notification: <u>${this.formatDate(this.state.injuryDate, true)}</u></span></li>
                </ul>
            </td>
        </tr>
    </tbody>
</table>
<p style="text-align: justify; font-family: Times New Roman;">&nbsp;</p>
<p style="text-align: justify; font-family: Times New Roman;"><strong><span style="font-family: 'Times New Roman';">DO NOT RETURN THIS FORM TO TEXAS MUTUAL INSURANCE COMPANY UNLESS REQUESTED</span></strong></p>`)}
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