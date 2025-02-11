import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import withApollo from "react-apollo/withApollo";
import { ADD_NON_DISCLOSURE } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import renderHTML from 'react-render-html';
import { GET_APPLICANT_INFO } from "../ConductCode/Queries";
import { CREATE_DOCUMENTS_PDF_QUERY, GET_DISCLOSURE_INFO } from "./Queries";
import PropTypes from 'prop-types';
import { NonDisclosureContent } from './Content';
import ReactDOMServer from 'react-dom/server';

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const FILE_NAME = "nonDisclosure-";

const uuidv4 = require('uuid/v4');

class NonDisclosure extends Component {
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
        }
    }

    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false,
            date: new Date().toISOString().substring(0, 10),
            completed: true
        }, () => {
            this.insertNonDisclosure(this.state)
        });
    };

    insertNonDisclosure = (item) => {
        let disclosureObject = Object.assign({}, item);
        delete disclosureObject.openSignature;
        delete disclosureObject.id;
        delete disclosureObject.accept;

        this.props.client
            .mutate({
                mutation: ADD_NON_DISCLOSURE,
                variables: {
                    disclosures: disclosureObject
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

                this.getDisclosureInformation(this.props.applicationId);

                this.props.changeTabState("ApplicantDisclosure");
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to sign Non-Disclosure document. Please, try again!',
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
                    });
                }
            })
            .catch(error => {

            })
    };

    getDisclosureInformation = (id) => {
        this.props.client
            .query({
                query: GET_DISCLOSURE_INFO,
                variables: {
                    id: id
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.applications[0].disclosure !== null) {
                    this.setState({
                        id: data.applications[0].disclosure.id,
                        signature: data.applications[0].disclosure.signature,
                        content: data.applications[0].disclosure.content,
                        applicantName: data.applications[0].disclosure.applicantName,
                        date: data.applications[0].disclosure.date.substring(0, 10),
                    });
                } else {
                    this.setState({
                        id: null
                    })
                }
            })
            .catch(error => {
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

    createDocumentsPDF = (fileName) => {
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
            .then((data) => {
                if (data.data.createdocumentspdf != null) {
                    this.state.urlPDF = data.data.createdocumentspdf[0].Strfilename
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
        var url = `${this.context.baseUrl}/public/Documents/${fileName}.pdf`;
        window.open(url, '_blank');
        this.setState(() => ({ downloading: false }));
    };

    componentWillMount() {
        this.getDisclosureInformation(this.props.applicationId);
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

    handleDownloadPDFClick = () => {
        const fileName = `${FILE_NAME}${uuidv4()}-${this.state.applicantName}`;
        this.createDocumentsPDF(fileName);
        this.sleep().then(() => {
            this.downloadDocumentsHandler(fileName);
        }).catch(error => {
            this.setState(() => ({ downloading: false }))
        })
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
                    <DialogTitle>
                        <h1 className="primary apply-form-container__label text-center">Please Sign</h1>
                    </DialogTitle>
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
            <div className="Apply-container--application" style={{width: '100%', maxWidth: '900px', margin: '0 auto'}}>
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[4].label}</span>
                                {
                                    this.state.id ?
                                        <button className="applicant-card__edit-button" onClick={this.handleDownloadPDFClick} disabled={this.state.downloading}>
                                            {this.state.downloading ?
                                                <React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>
                                                :
                                                <React.Fragment>{actions[9].label} <i className="fas fa-download" /></React.Fragment>
                                            }

                                        </button>
                                        :
                                        <button className="applicant-card__edit-button" onClick={() => {
                                            this.setState({
                                                openSignature: true
                                            })
                                        }}>{actions[8].label} <i className="far fa-edit"></i>
                                        </button>
                                }
                            </div>

                            <div className="p-4">
                                <div id="DocumentPDF" className="signature-information">
                                    {renderHTML(NonDisclosureContent(this.state))}
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

export default withApollo(withGlobalContent(NonDisclosure));