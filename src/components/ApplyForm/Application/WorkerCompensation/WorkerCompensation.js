import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import renderHTML from 'react-render-html';
import { GET_CITY_NAME, GET_STATE_NAME, GET_WORKER_COMPENSATION_INFO, CREATE_DOCUMENTS_PDF_QUERY } from "./Queries";
import { GET_APPLICANT_INFO } from "../ConductCode/Queries";
import { ADD_WORKER_COMPENSATION } from "./Mutations";
import withApollo from "react-apollo/withApollo";
import withGlobalContent from "../../../Generic/Global";
import SignatureForm from "../../SignatureForm/SignatureForm";
import './index.css';
import PropTypes from 'prop-types';

const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class WorkerCompensation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: null,
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
            injuryDate: ''
        }
    }

    handleSignature = (value) => {
        this.setState({
            signature: value,
            date: new Date().toISOString(),
        });
    };

    createDocumentsPDF = () => {
        this.props.client
            .query({
                query: CREATE_DOCUMENTS_PDF_QUERY,
                variables: {
                    contentHTML: document.getElementById('DocumentPDF').innerHTML,
                    Name: "WorkerCompensation-" + this.state.applicantName
                },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.createdocumentspdf != null) {
                    console.log("Ya estoy creando y estoy aqui con data ", data);

                    this.state.urlPDF = data.data.createdocumentspdf[0].Strfilename

                    console.log(this.state.urlPDF);

                } else {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error: Loading agreement: createdocumentspdf not exists in query data'
                    );
                    this.setState({ loadingData: false });
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
                this.setState({ loadingData: false });
            });
    };


    downloadDocumentsHandler = () => {
        var url = this.context.baseUrl + '/public/Documents/' + "WorkerCompensation-" + this.state.applicantName + '.pdf';
        window.open(url, '_blank');
    };

    insertWorkerCompensation = (item) => {
        let workerCompensationObject = Object.assign({}, item);
        delete workerCompensationObject.openSignature;
        delete workerCompensationObject.id;
        delete workerCompensationObject.accept;

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
                    });

                    this.getStateAndCity(parseInt(this.state.applicantState), parseInt(this.state.applicantCity));
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
                        date: data.applications[0].workerCompensation.date,
                        applicantAddress: data.applications[0].workerCompensation.applicantAddress,
                        applicantCity: data.applications[0].workerCompensation.applicantCity,
                        applicantState: data.applications[0].workerCompensation.applicantState,
                        applicantZipCode: data.applications[0].workerCompensation.applicantZipCode,
                        initialNotification: data.applications[0].workerCompensation.initialNotification,
                        injuryNotification: data.applications[0].workerCompensation.injuryNotification,
                        injuryDate: data.applications[0].workerCompensation.injuryDate.substring(0, 10)
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
                            this.setState({
                                applicantCity: data.getcatalogitem[0].Name
                            });
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

    componentWillMount() {
        this.getWorkerCompensationInformation(this.props.applicationId);
        this.getApplicantInformation(this.props.applicationId);
    }

    render() {
        let renderSignatureDialog = () => (
            <form
                autoComplete="off"
                id="worker-compensation-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();

                    this.insertWorkerCompensation(this.state);
                    this.setState({
                        openSignature: false
                    })
                }}
                className="apply-form"
            >
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
                                    <input
                                        id="injuryDate"
                                        form="worker-compensation-form"
                                        name="injuryDate"
                                        onChange={(event) => {
                                            this.setState({
                                                injuryDate: event.target.value
                                            });
                                        }}
                                        value={this.state.injuryDate}
                                        type="date"
                                        className="form-control"
                                        required
                                        min="0"
                                        pattern=".*[^ ].*"
                                        maxLength="50"
                                        minLength="2"

                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <SignatureForm applicationId={this.state.applicationId}
                                        signatureValue={this.handleSignature} />
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
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">Worker's Compensation</span>
                                {
                                    this.state.id !== null ? (
                                        <button className="applicant-card__edit-button" onClick={() => {
                                            this.createDocumentsPDF();
                                            this.downloadDocumentsHandler();
                                        }}>
                                            Download <i className="fas fa-download"></i>
                                        </button>
                                    ) : (
                                            <button className="applicant-card__edit-button" onClick={() => {
                                                this.setState({
                                                    openSignature: true
                                                })
                                            }}>Sign <i className="far fa-edit"></i>
                                            </button>
                                        )
                                }
                            </div>
                            <div className="row pdf-container">
                                <div className="signature-information">
                                    {renderHTML(`<h1 style="margin: 1.2pt 0in 0.0001pt 57.3pt; text-align: justify; font-size: 14pt; font-family: 'Time New Roman', sans-serif;">Employee &nbsp;Acknowledgment &nbsp;of &nbsp;&nbsp;Workers&apos; Compensation Network</h1>
<p style="margin: 0.1pt 0in 0.0001pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;"><strong><span style="font-size: 12.0pt; font-family: 'Time New Roman', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0in 54.3pt 0.0001pt 11pt; text-align: justify; line-height: 105%; font-size: 11pt; font-family: Time New Roman, sans-serif;">I &nbsp;have &nbsp;received information that tells me how to get health care under my employer&apos;s workers&apos; compensation insurance.</p>
<p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style="margin: 0.05pt 0in 0.0001pt 11pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;">If I am hurt on the job and live in a service area described in this information, I understand that:</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 12.0pt;">&nbsp;</span></p>
<ol style="margin-top: 0in; margin-bottom: .0001pt;">
<li style="margin: 0in 16.3pt 0.0001pt 14.6667px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: Time New Roman, sans-serif;">I must choose a treating doctor from the list of doctors in the network. Or, I may ask my HMO primary care physician to agree to serve as my treating doctor. If I select my HMO primary care physician as my treating doctor, I will call Texas Mutual at (800) 859-5995 to notify them of my choice.</li>
<li style="margin: 0.05pt 48.25pt 0.0001pt 14.6667px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: Time New Roman, sans-serif;">I must go to my treating doctor for all health care for my injury. If I need a specialist, my treating doctor will refer me. If I need emergency care, I may go anywhere.</li>
<li style="margin: 0.05pt 0in 0.0001pt 14.6667px; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;">The insurance carrier will pay the treating doctor and other network providers.</li>
<li style="margin: 0.8pt 42.75pt 0.0001pt 14.6667px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: Time New Roman, sans-serif;">I might have to pay the bill if I get health care from someone other than a network doctor without network approval.</li>
<li style="margin: 0.05pt 14.75pt 0.0001pt 14.6667px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: Time New Roman, sans-serif;">Knowingly making a false workers&apos; compensation claim may lead to a criminal investigation that could result in criminal penalties such as fines and imprisonment.</li>
</ol>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 10.0pt;">&nbsp;</span></p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 10.0pt;">&nbsp;</span></p>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 11.5pt;">&nbsp;&nbsp;&nbsp; </span><u><img width="300" height="300" src="` + this.state.signature + `" alt=""></u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u>` + this.state.date + `</u></p>
<p style="margin: 0in 0in 0.0001pt 11pt; text-align: justify; line-height: 12.3pt; font-size: 11pt; font-family: Time New Roman, sans-serif;">Signature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 10.0pt;">&nbsp;</span></p>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u>` + this.state.applicantName + `</u></p>
<p style="margin: 0in 0in 0.0001pt 11pt; text-align: justify; line-height: 12.3pt; font-size: 11pt; font-family: Time New Roman, sans-serif;">Printed Name</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 12.0pt;">&nbsp;</span></p>
<p style="margin: 0in 78.05pt 0.0001pt 83pt; text-align: justify; text-indent: -1in; line-height: 105%; font-size: 11pt; font-family: Time New Roman, sans-serif;">I live at:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u>` + this.state.applicantAddress + `</u></p>
<p style="margin: 0in 78.05pt 0.0001pt 83pt; text-align: justify; text-indent: -1in; line-height: 105%; font-size: 11pt; font-family: Time New Roman, sans-serif;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;Street Address</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 10.0pt;">&nbsp;</span></p>
<p style="margin: 0.1pt 0in 0.0001pt 1in; text-align: justify; text-indent: 11pt; font-size: 11pt; font-family: Time New Roman, sans-serif;"><u>` + this.state.applicantCity + `</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u>` + this.state.applicantState + `</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp; <u>` + this.state.applicantZipCode + `</u></p>
<p style="margin: 0in 0in 0.0001pt 83pt; text-align: justify; line-height: 12.3pt; font-size: 11pt; font-family: Time New Roman, sans-serif;">City&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; State&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Zip Code</p>
<p style="margin: 0.45pt 0in 0.0001pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 12.0pt;">&nbsp;</span></p>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;">Name of Employer: <u>` + this.state.applicantName + `</u></p>
<p style="margin: 2.95pt 0in 0.0001pt 11pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;">&nbsp;</p>
<p style="margin: 2.95pt 0in 0.0001pt 11pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;">Name of Network: <em>Texas Star Network</em>&reg;</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 12.0pt;">&nbsp;</span></p>
<p style="margin: 0.05pt 0in 0.0001pt 11pt; text-align: justify; line-height: 105%; font-size: 11pt; font-family: Time New Roman, sans-serif;"><strong><span style="font-family: 'Time New Roman', sans-serif;">Network service areas are subject to change. Call (800) 381-8067 if you need a network treating </span></strong><strong><span style="font-family: 'Time New Roman', sans-serif;">provider.</span></strong></p>
<p style="margin: 0.05pt 0in 0.0001pt 11pt; text-align: justify; line-height: 105%; font-size: 11pt; font-family: Time New Roman, sans-serif;">&nbsp;</p>
<table style="border-collapse: collapse; width: 100%;" border="1">
<tbody>
<tr>
<td style="width: 100%;">
<p style="margin: 1.1pt 0in 0.0001pt 5.4pt; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 12.0pt;">Please indicate whether this is the:</span></p>
<ul style="margin-top: 1.0pt; margin-bottom: .0001pt;">
<li style="margin: 1pt 0in 0.0001pt 31.2px; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 12.0pt;">Initial Employee Notification</span></li>
<li style="margin: 0.95pt 0in 0.0001pt 31.2px; font-size: 11pt; font-family: Time New Roman, sans-serif;"><span style="font-size: 12.0pt;">Injury Notification: <u>`+ this.state.injuryDate + `</u></span></li>
</ul>
</td>
</tr>
</tbody>
</table>
<p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;">&nbsp;</p>
<p style="margin: 2.7pt 0in 0.0001pt 14.6pt; text-align: justify; font-size: 11pt; font-family: Time New Roman, sans-serif;"><strong><span style="font-size: 12.0pt; font-family: 'Time New Roman', sans-serif;">DO NOT RETURN THIS FORM TO TEXAS MUTUAL INSURANCE COMPANY UNLESS REQUESTED</span></strong></p>`)}
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