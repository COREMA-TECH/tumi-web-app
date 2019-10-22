import React, { Component, Fragment } from 'react';
import Document from './Document';
import { CREATE_DOCUMENTS_PDF_QUERY, GET_APPLICANT_INFO, GET_DOCUMENT_INFO } from './Queries';
import { ADD_DOCUMENT } from './Mutation';
import withApollo from "react-apollo/withApollo";
import withGlobalContent from "../../../Generic/Global";
import Signature from './Signature';

const uuidv4 = require('uuid/v4');

class NonRetaliation extends Component {

    constructor(props) {
        super(props);
        this.state = {
            signature: '',
            downloading: false,
            applicantName: '',
            haveDocument: false
        }
    }

    handleSignature = (value) => {
        this.setState(_ => ({
            signature: value
        }), _ => {
            this.createStatesFields(this.state.signature, this.state.applicantName);
        });
    }

    handlePdfDownload = () => {
        if(this.state.urlPDF){
            this.downloadDocumentsHandler();
        }
        else{
            const fileName = `${'nonRetaliation'}${uuidv4()}-${this.state.applicantName}`;
            this.createDocumentsPDF(fileName, true);
        }
    }

    createDocumentsPDF = (fileName, download = false) => {
        this.setState(() => ({ downloading: true }));

        this.props.client.query({
            query: CREATE_DOCUMENTS_PDF_QUERY,
            variables: {
                contentHTML: this.cloneForm(),
                Name: fileName
            },
            fetchPolicy: 'no-cache'
        }).then(({data}) => {
            if (data.createdocumentspdf !== null) {
                this.state.urlPDF = data.createdocumentspdf
                this.setState({
                    urlPDF: data.createdocumentspdf,
                    downloading: false
                }, () => {
                    this.saveDocument(data.createdocumentspdf);
                    if(download) this.downloadDocumentsHandler();
                });
            } else {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error: Loading agreement: createdocumentspdf not exists in query data'
                );
                this.setState(() => ({ loadingData: false, downloading: false }));
            }
        }).catch((error) => {
            this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
            this.setState(() => ({ loadingData: false, downloading: false }));
        });
    };

    downloadDocumentsHandler = (fileName) => {
        let url = this.state.urlPDF;
        window.open(url, '_blank');
    };

    cloneForm = _ => {
        let contentPDF = document.getElementById('DocumentPDF');
        let contentPDFClone = contentPDF.cloneNode(true);
        return `<html style="zoom: 60%; font-family: "Times New Roman", Times, serif  !important; line-height: 1.0 !important;">${contentPDFClone.innerHTML}</html>`;
    }

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

    componentWillMount() {
        this.getApplicantInformation(this.props.applicationId);
        this.getDocumentInformation(this.props.applicationId);
    }

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
        this.props.client.query({
            query: GET_DOCUMENT_INFO,
            variables: {
                ApplicationId
            },
            fetchPolicy: 'no-cache'
        }).then(({ data: { lastApplicantLegalDocument: record } }) => {
            if (record) {
                let { fullName, signature, date } = this.getJSONFields(record.fieldsData);
                this.setState({
                    urlPDF: record.url,
                    fullName,
                    signature,
                    date,
                    loadingData: false
                });
            } 
        }).catch(error => {
            this.setState(() => ({ loadingData: false }));
            // If there's an error show a snackbar with a error message
            this.props.handleOpenSnackbar(
                'error',
                'Error to get Retaliation information. Please, try again!',
                'bottom',
                'right'
            );
        })
    };

    saveDocument = (url) => {
        const { fullName, signature } = this.state;
        const jsonFields = JSON.stringify({ fullName, signature });

        this.props.client
            .mutate({
                mutation: ADD_DOCUMENT,
                variables: {
                    applicantLegalDocuments: {
                        fieldsData: jsonFields,
                        url: url,
                        ApplicationDocumentTypeId: 21,
                        ApplicationId: this.props.applicationId,
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

                this.props.changeTabState();
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to sign Non Retaliation document. Please, try again!',
                    'bottom',
                    'right'
                );
            });
    };

    createStatesFields = (signature, fullName) => {
        this.setState(_ => {
            return {
                signature,
                fullName
            }
        }, () => {
            const fileName = `${'nonRetaliation'}${uuidv4()}-${this.state.applicantName}`;
            this.createDocumentsPDF(fileName, false);
        });
    }

    enableSignature = () => {
        this.setState(_ => {
            return { signature: false }
        });
    }

    render() {
        return(
            <Fragment>
                <div className="Apply-container--application" style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
                    <div className="row">
                        <div className="col-12">
                            <div className="applicant-card">
                                <div className="applicant-card__header">
                                    <span className="applicant-card__title">Non Retaliation</span>
                                    <button className="applicant-card__edit-button ml-auto mr-2" onClick={this.enableSignature}>
                                        Sign
                                    </button>
                                    <button className="applicant-card__edit-button" onClick={this.handlePdfDownload} disabled={this.state.downloading}>
                                        {this.state.downloading ?
                                            <React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>
                                            :
                                            <React.Fragment>Download <i className="fas fa-download" /></React.Fragment>
                                        }
                                    </button>
                                </div>
                                <div id="DocumentPDF" className="signature-information">
                                    <Document signature={this.state.signature} applicantName={this.state.applicantName} />
                                    { !this.state.signature ?  
                                        <Signature applicationId={this.props.applicationId} handleSignature={this.handleSignature} />
                                        : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        );
    }

}

export default withApollo(withGlobalContent(NonRetaliation));