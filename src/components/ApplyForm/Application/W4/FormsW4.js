import React, { Component, Fragment } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import { CREATE_DOCUMENTS_PDF_QUERY, GET_ANTI_HARRASMENT_INFO, GET_APPLICANT_INFO, GET_DOCUMENT_TYPE } from "./Queries";
import { ADD_W4 } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';
//import w4_form_english from './w4_header_eng.png';
import Button from "@material-ui/core/es/Button/Button";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Document from './Document';

const uuidv4 = require('uuid/v4');

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class FormsW4 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signature: '',
            openSignature: false,
            id: null,
            content: '',
            date: '',
            applicantName: '',
            companyPhoneNumber: '',
            ApplicationId: this.props.applicationId,
            isCreated: null,
            html: '',

            // FORM Fields
            firstName: '',
            lastName: '',
            socialSecurityNumber: '',
            idNumber: '',
            firstEmployeeDate: '',
            employeer: '',
            excention: '',
            payCheck: '',
            excentionYear: '',
            address: '',
            postalCode: '',
            socialSecurityExtention: false,

            estadoCivil: false,
            estadoCivil1: false,
            estadoCivil2: false,
            urlPDF: '',
            formData: '',
            typeDocumentId: 0,
            userId: 0,
        }
    }


    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false,
            date: new Date().toISOString().substring(0, 10)
        }, () => {
            this.validateW4();
        });
    };

    cloneForm = _ => {
        let contentPDF = document.getElementById('w4Html');
        let contentPDFClone = contentPDF.cloneNode(true);

        return `<html style="zoom: 65%;">${contentPDFClone.innerHTML}</html>`;
    }
    
    
    getApplicantInformation = (id) => {
        this.props.client
            .query({
                query: GET_APPLICANT_INFO,
                variables: {
                    ApplicationId: id,
                    ApplicationDocumentTypeId: this.state.typeDocumentId
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.lastApplicantLegalDocument) {
                    let fd = data.lastApplicantLegalDocument.fieldsData;
                    this.setState({
                        isCreated: true,
                        urlPDF: data.lastApplicantLegalDocument.url,
                        formData: fd ? JSON.parse(fd) : {}
                    }, _ => {
                        this.loadDataFromJson(this.state.formData)
                    });
                } else {
                    this.setState({
                        isCreated: false,
                    })
                }
            })
            .catch(error => {
                console.log(error);
            })
    };

    getDocumentType = () => {
        this.props.client
            .query({
                query: GET_DOCUMENT_TYPE,
                variables: {
                    name: 'W4'
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.applicationDocumentTypes.length) {
                    this.setState({
                        typeDocumentId: data.applicationDocumentTypes[0].id
                    }, _ => {
                        this.getApplicantInformation(this.props.applicationId);
                    });
                }
            })
            .catch(error => {
                console.log(error);
            })
    };

    loadDataFromJson = fieldsData => {
        if(!fieldsData) return;
        const { firstName, lastName, ssn, idNumber, firstEmployeeDate, employeer, excention, payCheck, excentionYear, address, postalCode, sse, signature, estadoCivil, estadoCivil1, estadoCivil2 } = fieldsData;

        this.setState(_ => ({
            firstName,
            lastName,
            socialSecurityNumber: ssn,
            idNumber,
            firstEmployeeDate,
            employeer,
            excention,
            payCheck,
            excentionYear,
            address,
            postalCode,
            socialSecurityExtention: sse,
            signature,
            estadoCivil, estadoCivil1, estadoCivil2
        }));
    }

    // insertW4 = (item) => {
    //     let harassmentObject = Object.assign({}, item);
    //     delete harassmentObject.openSignature;
    //     delete harassmentObject.id;
    //     delete harassmentObject.accept;
    //
    //
    //     this.props.client
    //         .mutate({
    //             mutation: ADD_ANTI_HARASSMENT,
    //             variables: {
    //                 harassmentPolicy: harassmentObject
    //             }
    //         })
    //         .then(({ data }) => {
    //             console.log("entro al data ", data);
    //             this.props.handleOpenSnackbar(
    //                 'success',
    //                 'Successfully signed!',
    //                 'bottom',
    //                 'right'
    //             );
    //
    //             this.setState({
    //                 id: data.addHarassmentPolicy[0].id
    //             })
    //         })
    //         .catch(error => {
    //             // If there's an error show a snackbar with a error message
    //             this.props.handleOpenSnackbar(
    //                 'error',
    //                 'Error to sign Anti Harrasment information. Please, try again!',
    //                 'bottom',
    //                 'right'
    //             );
    //         });
    // };

    createDocumentsPDF = (random) => {
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
                    Name: "W4-" + random + this.state.applicantName
                },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.createdocumentspdf != null) {

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
        var url = this.state.urlPDF; //this.context.baseUrl + this.state.urlPDF.replace(".", "");
        if(url)
            window.open(url, '_blank');
        else
            this.props.handleOpenSnackbar(
                'error',
                'Error to open W4 document.',
                'bottom',
                'right'
            );
        this.setState({ downloading: false });
    };



    componentDidMount() {
        this.setState({
            userId: localStorage.getItem('LoginId') || 0
        }, () => this.getDocumentType());
    }

    validateW4 = () => {
        let firstNameField = document.getElementById('firstName');
        let lastNameField = document.getElementById('lastName');
        let socialSecurityNumberField = document.getElementById('socialSecurityNumber');
        const random = uuidv4();

        if (firstNameField.value.length > 0 &&
            lastNameField.value.length > 0 &&
            socialSecurityNumberField.value.length > 0) {

            const html = this.cloneForm();

            const { firstName, lastName, socialSecurityNumber: ssn, idNumber, firstEmployeeDate, employeer, excention, payCheck, excentionYear, address, postalCode, socialSecurityExtention: sse, signature, estadoCivil, estadoCivil1, estadoCivil2 } = this.state;
            const jsonFields = JSON.stringify({ firstName, lastName, ssn, idNumber, firstEmployeeDate, employeer, excention, payCheck, excentionYear, address, postalCode, sse, signature, estadoCivil, estadoCivil1, estadoCivil2 });

            this.props.client
                .mutate({
                    mutation: ADD_W4,
                    variables: {
                        fileName: "W4-" + random + this.state.applicantName,
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
                        this.state.html ? 'Updated Successfully' : 'Created Successfully',
                        'bottom',
                        'right'
                    );
                    this.getApplicantInformation(this.props.applicationId)
                    this.props.changeTabState();
                })
                .catch(error => {
                    // If there's an error show a snackbar with a error message
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to save W4. Please, try again!',
                        'bottom',
                        'right'
                    );

                    console.log(error);
                });
        } else {
            // TODO: show a snackbar
            this.props.handleOpenSnackbar(
                'warning',
                'Complete all the fields and try again!',
                'bottom',
                'right'
            );
        }
    };

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }

    externalSetState = (updateData, callback = () => {}) => {
        this.setState(updateData, _ => callback());
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

        // if(this.state.isCreated){
        //     let inputs = document.getElementsByTagName('input');
        //     for (let index = 0; index < inputs.length; ++index) {
        //         // deal with inputs[index] element.
        //         inputs[index].disabled = true;
        //     }
        // }

        return (
            <div className="Apply-container--application" style={{ maxWidth: '900px', width: '100%', margin: '0 auto' }}>
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[10].label}</span>
                                
                                                <Fragment>
                                                    <button style={{marginLeft: 'auto', marginRight: '8px'}} className="applicant-card__edit-button" onClick={() => {
                                                       this.setState(_ => ({
                                                           openSignature: true
                                                       }))
                                                    }}>
                                                        Sign <i className="fas fa-pencil-alt" />
                                                    </button>
                                                    <button className="applicant-card__edit-button" style={{marginRight: '8px'}} onClick={this.downloadDocumentsHandler}>
                                                        {this.state.downloading && (
                                                        <React.Fragment>Downloading <i
                                                            class="fas fa-spinner fa-spin" /></React.Fragment>)}
                                                        {!this.state.downloading && (
                                                            <React.Fragment>{actions[9].label} <i
                                                                className="fas fa-download" /></React.Fragment>)}
                                                </button>
                                            </Fragment>
                                       
                                                <button className="applicant-card__edit-button" onClick={() => {
                                                    this.validateW4();
                                                }}>{actions[4].label} <i className="far fa-save" />
                                                </button>
                                           
                            </div>
                            {
                                (
                                    <div style={{ width: '100%', margin: '0 auto' }}>
                                        <div className="row pdf-container" id="w4Html" style={{ maxWidth: '100%' }}>
                                            <Document 
                                                setState={this.externalSetState}
                                                languageForm = {localStorage.getItem('languageForm')}
                                                data={{
                                                    firstName: this.state.firstName,
                                                    lastName: this.state.lastName,
                                                    socialSecurityNumber: this.state.socialSecurityNumber,
                                                    address: this.state.address,
                                                    estadoCivil: this.state.estadoCivil,
                                                    estadoCivil1: this.state.estadoCivil1,
                                                    estadoCivil2: this.state.estadoCivil2,
                                                    postalCode: this.state.postalCode,
                                                    socialSecurityExtention: this.state.socialSecurityExtention,
                                                    excention: this.state.excention,
                                                    payCheck: this.state.payCheck,
                                                    excentionYear: this.state.excentionYear,
                                                    signature: this.state.signature,
                                                    employeer: this.state.employeer,
                                                    firstEmployeeDate: this.state.firstEmployeeDate,
                                                    idNumber: this.state.idNumber
                                                }}
                                            />
                                            
                                        </div>
                                    </div>
                                )
                            }

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

export default withApollo(withGlobalContent(FormsW4));



