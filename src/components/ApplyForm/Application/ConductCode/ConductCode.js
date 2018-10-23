import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import withApollo from "react-apollo/withApollo";
import renderHTML from 'react-render-html';
import { GET_APPLICANT_INFO, GET_CONDUCT_CODE_INFO, CREATE_DOCUMENTS_PDF_QUERY } from "./Queries";
import { ADD_CONDUCT_CODE } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import PropTypes from 'prop-types';
import AntiHarassmentPDF from "../../../../templates/en/AntiHarassmentPDF";
//import html from '../../../../data/Package hire/CondeConduct';

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);


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
        }
    }

    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false,
            date: new Date().toISOString().substring(0, 10)
        }, () => {
            this.insertConductCode(this.state);
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
                console.log("esta es la data ", data);
                if (data.applications[0].conductCode !== null) {
                    this.setState({
                        id: data.applications[0].conductCode.id,
                        signature: data.applications[0].conductCode.signature,
                        content: data.applications[0].conductCode.content,
                        applicantName: data.applications[0].conductCode.applicantName,
                        date: data.applications[0].conductCode.date,
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
                    'Error to get conduct code information. Please, try again!',
                    'bottom',
                    'right'
                );
            })
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
                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully signed!',
                    'bottom',
                    'right'
                );

                this.setState({
                    id: data.addConductCode[0].id
                })
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to sign Conduct Code document. Please, try again!',
                    'bottom',
                    'right'
                );
            });
    };

    createDocumentsPDF = () => {
        this.setState(
            {
                downloading: true
            }
        )
        this.props.client
            .query({
                query: CREATE_DOCUMENTS_PDF_QUERY,
                variables: {
                    contentHTML: document.getElementById('DocumentPDF').innerHTML,
                    Name: "ConductCode-" + this.state.applicantName
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
                    this.setState({ loadingData: false, downloading: false });

                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
                this.setState({ loadingData: false, downloading: false });
            });
    };


    downloadDocumentsHandler = () => {
        var url = this.context.baseUrl + '/public/Documents/' + "ConductCode-" + this.state.applicantName + '.pdf';
        window.open(url, '_blank');
        this.setState({ downloading: false });
    };

    componentWillMount() {
        this.getConductCodeInformation(this.props.applicationId);
        this.getApplicantInformation(this.props.applicationId);
    }

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 5000));
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
                            signatureValue={this.handleSignature}
                                       showSaveIcon={null}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );

        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[3].label}</span>
                                {
                                    this.state.id === '' ? (
                                        ''
                                    ) : (
                                        <div>
                                            {
                                                this.state.id !== null ? (
                                                    <button className="applicant-card__edit-button" onClick={() => {
                                                        this.createDocumentsPDF();
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
                            <div className="row pdf-container">
                                <div id="DocumentPDF" className="signature-information">
                                    <AntiHarassmentPDF />
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