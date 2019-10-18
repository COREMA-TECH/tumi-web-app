import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import withApollo from "react-apollo/withApollo";
import { ADD_DOCUMENT, UPDATE_DOCUMENT } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import renderHTML from 'react-render-html';
import { CREATE_DOCUMENTS_PDF_QUERY, GET_DOCUMENT_INFO } from "./Queries";
import PropTypes from 'prop-types';
import { Document } from './Document';
import Button from "@material-ui/core/es/Button/Button";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import moment from 'moment';

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const FILE_NAME = "antiDiscrimination-";

const uuidv4 = require('uuid/v4');

class AntiDiscrimination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: '',
            signature: '',
            date: '',
            name: '',
            ApplicationId: this.props.applicationId,
            openSignature: false,
            completed: false,
            urlPDF: null
        }
    }

    formatDate = (date, useSubstring = false) => {
        if (!date) return '';

        let substringDate = useSubstring ? String(date).substring(0, 10) : date;
        return moment(substringDate).format('MM/DD/YYYY');
    }

    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false,
            date: this.formatDate(new Date().toISOString(), true),
            completed: true
        }, () => {
            this.saveAntiDiscrimination();
        });
    };

    saveAntiDiscrimination = () => {
        let { name, signature, date } = this.state;
        const jsonFields = JSON.stringify({ name, signature, date });

        this.props.client
            .mutate({
                mutation: ADD_DOCUMENT,
                variables: {
                    applicantLegalDocuments: {
                        fieldsData: jsonFields,
                        url: "",
                        ApplicationDocumentTypeId: 19,
                        ApplicationId: this.state.ApplicationId,
                        completed: true,
                        UserId: localStorage.getItem('LoginId')
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

                this.getDocumentInformation(this.props.applicationId, true);

                this.props.changeTabState();
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to sign Anti-Discrimination document. Please, try again!',
                    'bottom',
                    'right'
                );
            });
    };

    updatePdfUrlAntiDiscrimination = () => {
        this.props.client
            .mutate({
                mutation: UPDATE_DOCUMENT,
                variables: {
                    applicantLegalDocument: {
                        id: this.state.id,
                        url: this.state.urlPDF
                    }
                }
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to updating url Anti-Discrimination',
                    'bottom',
                    'right'
                );
            });
    };

    getJSONFields = (data) => {
        let name = '', signature = '', date = '';
        if (data) {
            let fields = JSON.parse(data);
            name = fields.name;
            signature = fields.signature;
            date = fields.date;
        }
        return { name, signature, date };
    }

    getDocumentInformation = (ApplicationId, generatePdf = false) => {
        this.setState(() => ({ loadingData: true }));
        this.props.client
            .query({
                query: GET_DOCUMENT_INFO,
                variables: {
                    ApplicationId
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data: { lastApplicantLegalDocument: record, applications } }) => {
                let { firstName, middleName, lastName, lastName2 } = applications[0];
                if (record) {
                    let { name, signature, date } = this.getJSONFields(record.fieldsData);
                    this.setState({
                        id: record.id,
                        url: record.url,
                        name,
                        signature,
                        date,
                        loadingData: false
                    }, () => {
                        if (generatePdf) this.createDocumentsPDF(uuidv4());
                    });
                } else {
                    this.setState(() => ({
                        id: null,
                        name: `${firstName || ''} ${middleName || ''} ${lastName || ''} ${lastName2 || ''}`,
                        loadingData: false,
                        signature: '',
                        date: ''
                    }));
                }
            })
            .catch(error => {
                console.log({ error })
                this.setState(() => ({ loadingData: false }));
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to get disclosure information. Please, try again!',
                    'bottom',
                    'right'
                );
            })
    };

    cloneForm = _ => {
        let contentPDF = document.getElementById('DocumentPDF');
        let contentPDFClone = contentPDF.cloneNode(true);
        return `<html style="zoom: 60%; font-family: "Times New Roman", Times, serif  !important; line-height: 1.5 !important;">${contentPDFClone.innerHTML}</html>`;
    }

    createDocumentsPDF = (fileName, download = false) => {
        this.setState(() => ({ downloading: true }));

        this.props.client
            .query({
                query: CREATE_DOCUMENTS_PDF_QUERY,
                variables: {
                    contentHTML: this.cloneForm(),
                    Name: fileName
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.createdocumentspdf !== null) {
                    this.state.urlPDF = data.createdocumentspdf
                    this.setState({
                        urlPDF: data.createdocumentspdf,
                        downloading: false
                    }, () => {
                        this.updatePdfUrlAntiDiscrimination();
                        if (download) this.downloadDocumentsHandler();
                    });
                } else {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error: Loading agreement: createdocumentspdf not exists in query data'
                    );
                    this.setState(() => ({ loadingData: false, downloading: false }));
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
                this.setState(() => ({ loadingData: false, downloading: false }));
            });
    };


    downloadDocumentsHandler = (fileName) => {
        let url = this.state.urlPDF;
        window.open(url, '_blank');
    };

    componentWillMount() {
        this.getDocumentInformation(this.props.applicationId);
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

    handlePdfDownload = () => {
        if (this.state.urlPDF) {
            this.downloadDocumentsHandler();
        }
        else {
            const fileName = `${FILE_NAME}${uuidv4()}-${this.state.applicantName}`;
            this.createDocumentsPDF(fileName, true);
        }
    }

    onHandleOpenSignatureClick = () => {
        this.setState(() => ({
            openSignature: true
        }));
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
                            showSaveIcon={null}
                            signatureValue={this.handleSignature}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );

        return (
            <div className="Apply-container--application" style={{ width: '100%', maxWidth: '900px', margin: '0 auto' }}>
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[14].label}</span>
                                {
                                    this.state.id ?
                                        <button className="applicant-card__edit-button" onClick={this.handlePdfDownload} disabled={this.state.downloading || this.state.loadingData}>
                                            {this.state.downloading ?
                                                <React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>
                                                :
                                                <React.Fragment>{actions[9].label} <i className="fas fa-download" /></React.Fragment>
                                            }

                                        </button>
                                        :
                                        <button className="applicant-card__edit-button" disabled={this.state.loadingData} onClick={this.onHandleOpenSignatureClick}>{actions[8].label} <i className="far fa-edit"></i>
                                        </button>
                                }
                            </div>

                            <div className="p-4">
                                <div id="DocumentPDF" className="signature-information">
                                    {renderHTML(Document(this.state))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    renderSignatureDialog()
                }
            </div >
        );
    }

    static contextTypes = {
        baseUrl: PropTypes.string
    };
}


export default withApollo(withGlobalContent(AntiDiscrimination));