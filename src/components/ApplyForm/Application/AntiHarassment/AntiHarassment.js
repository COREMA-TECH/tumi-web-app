import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import renderHTML from 'react-render-html';
import { CREATE_DOCUMENTS_PDF_QUERY, GET_ANTI_HARRASMENT_INFO, GET_APPLICANT_INFO, GET_DOCUMENT_TYPE } from "./Queries";
import { ADD_ANTI_HARASSMENT, UPDATE_ANTI_HARASSMENT } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import withApollo from "react-apollo/withApollo";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Button from "@material-ui/core/es/Button/Button";
import PropTypes from 'prop-types';
import moment from 'moment';
import Document from './Document';

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

const uuidv4 = require('uuid/v4');

class AntiHarassment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signature: '',
            openSignature: false,
            id: '',
            content: '',
            date: '',
            applicantName: '',
            companyPhoneNumber: '',
            ApplicationId: this.props.applicationId,
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
            openSignature: false,
            date: this.formatDate(new Date().toISOString(), true),
            completed: true
        }, () => {
            this.insertAntiHarrasment();
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
                    });
                }
            })
            .catch(error => {

            })
    };

    getHarrasmentInformation = (id) => {
        this.props.client
            .query({
                query: GET_ANTI_HARRASMENT_INFO,
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
                        //id: 0, 
                        signature: formData.signature,
                        //content: data.applications[0].harassmentPolicy.content,
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
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to get conduct code information. Please, try again!',
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
                    name: 'Harassment Policies'
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.applicationDocumentTypes.length) {
                    this.setState({
                        typeDocumentId: data.applicationDocumentTypes[0].id
                    }, _ => {
                        this.getHarrasmentInformation(this.props.applicationId);
                        this.getApplicantInformation(this.props.applicationId);
                    });
                }
            })
            .catch(error => {
                console.log(error);
            })
    };

    insertAntiHarrasment = () => {
        const random = uuidv4();
        const html = '<html style="zoom: 60%; font-family: Time New Roman; letter-spacing: 0">' + document.getElementById('DocumentPDF').innerHTML + '</html>'
        const {applicantName, date, signature} = this.state;
        const jsonFields = JSON.stringify({applicantName, date, signature});

        this.props.client
            .mutate({
                mutation: ADD_ANTI_HARASSMENT,
                variables: {
                    fileName: "Anti-Harrasment-" + random + "-" + this.state.applicantName,
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
                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully signed!',
                    'bottom',
                    'right'
                );
                
                this.getHarrasmentInformation(this.props.applicationId)

                this.props.changeTabState();
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to sign Anti Harrasment information. Please, try again!',
                    'bottom',
                    'right'
                );
            });
    };

    UpdatePdfUrlAntiHarrasment = () => {
        this.props.client
            .mutate({
                mutation: UPDATE_ANTI_HARASSMENT,
                variables: {
                    harassmentPolicy: {
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
                    'Error to updating url Anti Harrasment document.',
                    'bottom',
                    'right'
                );
            });
    };

    createDocumentsPDF = (idv4, download = false) => {
        this.setState({downloading: true})
        this.props.client
            .query({
                query: CREATE_DOCUMENTS_PDF_QUERY,
                variables: {
                    contentHTML: '<html style="zoom: 60%; font-family: Time New Roman; letter-spacing: 0">' + document.getElementById('DocumentPDF').innerHTML + '</html>',
                    Name: "Anti-Harrasment-" + idv4 + "-" + this.state.applicantName
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
                        this.UpdatePdfUrlAntiHarrasment();
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
        const url = this.state.urlPDF;
        if(url) window.open(url, '_blank');
    };


    componentDidMount() {
        this.setState({
            userId: localStorage.getItem('LoginId') || 0
        }, () => this.getDocumentType());
    }

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }

    handlePdfDownload = () => {
        this.downloadDocumentsHandler();
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
                    open={this.state.openSignature}
                    fullWidth
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
                        <SignatureForm
                            applicationId={this.state.applicationId}
                            signatureValue={this.handleSignature}
                            showSaveIcon={null}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );

        return (
            <div className="Apply-container--application" style={{ 'width': '900px', 'margin': '0 auto' }}>
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[6].label}</span>
                                <div>
                                    {
                                        this.state.urlPDF !== null ? (
                                            <button className="applicant-card__edit-button" onClick={this.handlePdfDownload}>
                                                {this.state.downloading && (
                                                <React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>)}
                                                {!this.state.downloading && (
                                                    <React.Fragment>{actions[9].label} <i
                                                        className="fas fa-download" /></React.Fragment>)}

                                            </button>
                                        ) : ''                                    
                                    }
                                    <button className="applicant-card__edit-button ml-2" 
                                        onClick={() => {
                                            this.setState({
                                                openSignature: true
                                            })
                                        }}>{actions[8].label} <i className="far fa-edit" />
                                    </button>
                                </div>
                            </div>
                            <div className="">
                                <div id="DocumentPDF" className="signature-information">
                                    {renderHTML(
                                        Document({
                                            applicantName: this.state.applicantName,
                                            date: this.state.date,
                                            signature: this.state.signature
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

export default withApollo(withGlobalContent(AntiHarassment));
