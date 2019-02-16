import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import renderHTML from 'react-render-html';
import { CREATE_DOCUMENTS_PDF_QUERY, GET_ANTI_HARRASMENT_INFO, GET_APPLICANT_INFO } from "./Queries";
import { ADD_ANTI_HARASSMENT } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class FormsI9 extends Component {
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
            ApplicationId: this.props.applicationId

        }
    }


    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false,
            date: new Date().toISOString().substring(0, 10)
        }, () => {
            this.insertAntiHarrasment(this.state);
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
                    id: id
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                console.log("esta es la data ", data);
                if (data.applications[0].harassmentPolicy !== null) {
                    this.setState({
                        id: data.applications[0].harassmentPolicy.id,
                        signature: data.applications[0].harassmentPolicy.signature,
                        content: data.applications[0].harassmentPolicy.content,
                        applicantName: data.applications[0].harassmentPolicy.applicantName,
                        date: data.applications[0].harassmentPolicy.date,
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

    insertAntiHarrasment = (item) => {
        let harassmentObject = Object.assign({}, item);
        delete harassmentObject.openSignature;
        delete harassmentObject.id;
        delete harassmentObject.accept;

        this.props.client
            .mutate({
                mutation: ADD_ANTI_HARASSMENT,
                variables: {
                    harassmentPolicy: harassmentObject
                }
            })
            .then(({ data }) => {
                console.log("entro al data ", data);
                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully signed!',
                    'bottom',
                    'right'
                );

                this.setState({
                    id: data.addHarassmentPolicy[0].id
                })
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

    insertI9 = (item) => {
        let harassmentObject = Object.assign({}, item);
        delete harassmentObject.openSignature;
        delete harassmentObject.id;
        delete harassmentObject.accept;


        this.props.client
            .mutate({
                mutation: ADD_ANTI_HARASSMENT,
                variables: {
                    harassmentPolicy: harassmentObject
                }
            })
            .then(({ data }) => {
                console.log("entro al data ", data);
                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully signed!',
                    'bottom',
                    'right'
                );

                this.setState({
                    id: data.addHarassmentPolicy[0].id
                })
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
                    Name: "Anti-Harrasment-" + this.state.applicantName
                },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.createdocumentspdf != null) {
                    console.log("Ya estoy creando y estoy aqui con data ", data);

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
        var url = this.context.baseUrl + '/public/Documents/' + "Anti-Harrasment-" + this.state.applicantName + '.pdf';
        window.open(url, '_blank');
        this.setState({ downloading: false });
    };


    componentWillMount() {
        this.getHarrasmentInformation(this.props.applicationId);
        this.getApplicantInformation(this.props.applicationId);
    }

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 5000));
    }


    render() {
        let renderSignatureDialog = () => (
            <div>
                <Dialog
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
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[6].label}</span>
                                {
                                    this.state.id !== null ? (
                                        <button className="applicant-card__edit-button" onClick={() => {
                                            this.createDocumentsPDF();
                                            this.sleep().then(() => {
                                                this.downloadDocumentsHandler();
                                            }).catch(error => {
                                                this.setState({ downloading: false })
                                            })
                                        }}>{this.state.downloading && (
                                            <React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>)}
                                            {!this.state.downloading && (
                                                <React.Fragment>{actions[9].label} <i
                                                    className="fas fa-download" /></React.Fragment>)}

                                        </button>
                                    ) : (
                                            <button className="applicant-card__edit-button" onClick={() => {
                                                this.setState({
                                                    openSignature: true
                                                })
                                            }}>{actions[4].label} <i className="far fa-save" />
                                            </button>
                                        )
                                }
                            </div>
                            <div className="row pdf-container--i9-w4">
                                <div id="DocumentPDF" className="signature-information">
                                    {renderHTML(`<div style="width: 800px; margin: 0 auto;">
    <img src="https://i.imgur.com/EXoWtMF.png" width="100%" alt="">
    <div data-font-name="g_d0_f3" data-angle="0" data-canvas-width="16.334999999999997"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>►&nbsp;START
                HERE:</strong> Read instructions carefully before completing this form. The instructions must be
            available, either in paper or electronically, during completion of this form. Employers are liable for
            errors in the completion of this form.</span></div>
    <div data-font-name="Helvetica" data-angle="0" data-canvas-width="234.99000000000004"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>ANTI-DISCRIMINATION
                NOTICE:&nbsp;</strong>It is illegal to discriminate against work-authorized individuals. Employers
            <strong>CANNOT</strong> specify which document(s) an employee may present to establish employment
            authorization and identity. The refusal to hire or continue to employ an individual because the
            documentation presented has a future expiration date may also constitute illegal discrimination.</span>
    </div>
    <div data-font-name="Helvetica" data-angle="0" data-canvas-width="234.99000000000004">&nbsp;</div>
    <div data-font-name="Helvetica" data-angle="0" data-canvas-width="234.99000000000004">
        <table style="border-collapse: collapse; width: 100%; height: 17px; background-color: #bec1c3;" border="1">
            <tbody>
                <tr style="height: 17px;">
                    <td style="width: 100%; height: 17px;">
                        <div data-font-name="Helvetica" data-angle="0" data-canvas-width="422.76666666666665"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Section
                                <strong>1. Employee Information and Attestation</strong>&nbsp;(Employees must complete
                                and sign Section 1 of Form I-9 no later than the<em><strong> first day of
                                        employment</strong> </em>, but not before accepting a job offer.)</span></div>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 25%;">
                        <div data-font-name="g_d0_f5" data-angle="0" data-canvas-width="68.17333333333332"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Last
                                Name&nbsp;(Family Name) <input style="border: 0; width: 100%;" type="text" id="lastName"></span>
                        </div>
                    </td>
                    <td style="width: 25%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">First
                            Name (Given Name) <input style="border: 0; width: 100%;" type="text" id="firstName"></span></td>
                    <td style="width: 25%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Middle
                            Initial <input style="border: 0; width: 100%;" type="text" id="middleInitia"></span></td>
                    <td style="width: 25%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Other
                            Last Names Used (if any) <input style="border: 0; width: 100%;" type="text" id="otherLastName"></span></td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%; height: 17px;" border="1">
            <tbody>
                <tr style="height: 17px;">
                    <td style="width: 20%; height: 17px; vertical-align: top;">
                        <div data-font-name="g_d0_f5" data-angle="0" data-canvas-width="52.61333333333333"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Address
                                (Street Number and Name) <input style="border: 0; width: 100%;" type="text" id="address"></span>
                        </div>
                    </td>
                    <td style="width: 20%; height: 17px; vertical-align: top;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Apt.
                            Number <input style="border: 0; width: 100%;" type="text" id="aptNumber"></span></td>
                    <td style="width: 20%; height: 17px; vertical-align: top;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">City or
                            Town <input style="border: 0; width: 100%;" type="text" id="city"></span></td>
                    <td style="width: 20%; height: 17px; vertical-align: top;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">State
                            <input style="border: 0; width: 100%;" type="text" id="state"></span></td>
                    <td style="width: 20%; height: 17px; vertical-align: top;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">ZIP Code
                            <input style="border: 0; width: 100%;" type="text" id="zipCode"></span></td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 25%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Date of
                            Birth (mm/dd/yyyy) <input style="border: 0; width: 100%;" type="text" id="dateOfBirth"></span></td>
                    <td style="width: 25%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">U.S.
                            Social Security Number <input style="border: 0; width: 100%;" type="text" id="socialSecurityNumber"></span></td>
                    <td style="width: 25%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Employee's
                            E-mail Address <input style="border: 0; width: 100%;" type="text" id="email"></span></td>
                    <td style="width: 25%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Employee's
                            Telephone Number <input style="border: 0; width: 100%;" type="text" id="telephone"></span></td>
                </tr>
            </tbody>
        </table>
        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>I am aware
                    that federal law provides for imprisonment and/or fines for false statements or use of false
                    documents in connection with the completion of this form.</strong></span></p>
        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>I attest,
                    under penalty of perjury, that I am (check one of the following boxes):</strong></span></p>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 100%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"> <input type="checkbox" id="citizen"> 1. A citizen of the United States</span></td>
                </tr>
                <tr>
                    <td style="width: 100%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"> <input type="checkbox" id="non-citizen"> 2. A noncitizen national of the United States (See
                            instructions)</span></td>
                </tr>
                <tr>
                    <td style="width: 100%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"> <input type="checkbox" id="lowful-permanent-resident"> 3. A lawful permanent resident (Alien Registration Number/USCIS
                            Number):&nbsp; &nbsp; <input id="resident-explain" style="border: 0; border-bottom: 1px solid #000;" type="text"></span></td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%; border-right: 0; border-bottom: 0; border-top: 0;" border="1">
            <tbody>
                <tr>
                    <td style="width: 70%; border-right: solid 1px #000; border-bottom: solid 1px #000;">
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">
                                <input type="checkbox" id="alien"> 4. An alien authorized to work until (expiration date, if
                                applicable, mm/dd/yyyy): <input id="alien-explain" style="border: 0; border-bottom: 1px solid #000;" type="text"></span></p>
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">&nbsp;
                                &nbsp; Some aliens may write "N/A" in the expiration date field. (See
                                instructions)</span></p>
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><em>Aliens
                                    authorized to work must provide only one of the following document numbers to
                                    complete Form I-9: An Alien Registration Number/USCIS Number OR Form I-94 Admission
                                    Number OR Foreign Passport&nbsp; &nbsp; &nbsp; Number.</em></span></p>
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">1.Alien
                                Registration Number/USCIS Number: <input style="border: 0; border-bottom: 1px solid #000;" type="text" id="alien-register-number"></span></p>
                        <p style="padding-left: 80px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>OR</strong></span>
                        </p>
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">2.Form
                                I-94 Admission Number: <input style="border: 0; border-bottom: 1px solid #000;" type="text" id="admision-number"></span></p>
                        <p style="padding-left: 80px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>OR</strong>
                            </span></p>
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">3.Foreign
                                Passport Number: <input style="border: 0; border-bottom: 1px solid #000;" type="text" id="foreign-passport-number"></span></p>
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">&nbsp;
                                &nbsp; Country of Issuance: <input style="border: 0; border-bottom: 1px solid #000;" type="text" id="country-issuance"></span></p>
                        <p>&nbsp;</p>
                    </td>
                    <td style="width: 30%; border: solid 1px #FFF; padding: 10px;">
                        <table style="border-collapse: collapse; width: 100%; height: 195px;" border="1">
                            <tbody>
                                <tr style="height: 195px;">
                                    <td style="width: 100%; height: 195px; vertical-align: top; text-align: center;">
                                        <span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">QR
                                            Code - Section 1 Do Not Write In This Space</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">&nbsp;</span></p>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 50%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Signature
                            of Employee<input style="border: 0; width: 100%;" type="text" id="signature"></span></td>
                    <td style="width: 50%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Today's
                            Date (mm/dd/yyyy) <input id="today-date" style="border: 0; width: 100%;" type="text"></span></td>
                </tr>
            </tbody>
        </table>
        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">&nbsp;</span></p>
        <table style="border-collapse: collapse; width: 100%; height: 17px; background-color: #bec1c3;" border="1">
            <tbody>
                <tr style="height: 17px;">
                    <td style="width: 100%; height: 17px;">
                        <h3><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>Preparer
                                    and/or Translator Certification (check one):</strong></span></h3>
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">
                                <input type="checkbox" id="preparer-0">I did not use a preparer or translator. <input type="checkbox" id="preparer-1">I A preparer(s) and/or translator(s) assisted the employee in
                                completing Section 1.</span></p>
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><em>(Fields
                                    below must be completed and signed when preparers and/or translators assist an
                                    employee in completing Section 1.)</em></span></p>
                    </td>
                </tr>
            </tbody>
        </table>
        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>I attest,
                    under penalty of perjury, that I have assisted in the completion of Section 1 of this form and that
                    to the best of my knowledge the information is true and correct.</strong></span></p>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 65.2979%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Signature
                            of Preparer or Translator <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 34.7021%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Today's
                            Date (mm/dd/yyyy) <input style="width: 100%; border: 0;" type="text"></span></td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%; height: 17px; border-top: 0;" border="1">
            <tbody>
                <tr style="height: 17px;">
                    <td style="width: 50%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Last
                            Name (Family Name) <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 50%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">First
                            Name (Given Name) <input style="width: 100%; border: 0;" type="text"></span></td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%; border-top: 0;" border="1">
            <tbody>
                <tr>
                    <td style="width: 31.9243%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Address
                            (Street Number and Name) <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 41.2641%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">City or
                            Town <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 6.80349%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">State
                            <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 20.0081%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">ZIP Code
                            <input style="width: 100%; border: 0;" type="text"></span></td>
                </tr>
            </tbody>
        </table>
        <img src="https://i.imgur.com/yP3pq57.png" width="100%" alt="">
        <img src="https://i.imgur.com/EXoWtMF.png" width="100%" alt="">
        <table style="border-collapse: collapse; width: 100%; background-color: #bec1c3;" border="1">
            <tbody>
                <tr>
                    <td style="width: 100%;">
                        <h3><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>Section
                                    2. Employer or Authorized Representative Review and Verification </strong></span>
                        </h3>
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">(Employers
                                or their authorized representative must complete and sign Section 2 within 3 business
                                days of the employee's first day of employment. You must physically examine one document
                                from List A OR a combination of one document from List B and one document from List C as
                                listed on the "Lists of Acceptable Documents.")</span></p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 18.438%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>Employee
                                Info from Section 1</strong></span></td>
                    <td style="width: 25.7381%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Last
                            Name (Family Name)</span></td>
                    <td style="width: 32.9576%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">First
                            Name (Given Name)</span></td>
                    <td style="width: 6.19971%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">M.I.</span>
                    </td>
                    <td style="width: 16.6667%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Citizenship/Immigration
                            Status</span></td>
                </tr>
            </tbody>
        </table>
        <p>&nbsp;</p>
        <table style="border-collapse: collapse; width: 100%; height: 98px;" border="1">
            <tbody>
                <tr style="height: 98px;">
                    <td style="width: 33.3333%; height: 98px;">
                        <table style="border-collapse: collapse; width: 100%;" border="1">
                            <tbody>
                                <tr>
                                    <td style="width: 100%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Document
                                            Title <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                                <tr>
                                    <td style="width: 100%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Issuing
                                            Authority <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                                <tr>
                                    <td style="width: 100%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Document
                                            Number <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                                <tr>
                                    <td style="width: 100%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">
                                            Expiration Date (if any)(mm/dd/yyyy) <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                            </tbody>
                        </table>
                        <table style="border-collapse: collapse; width: 100%; height: 72px;" border="1">
                            <tbody>
                                <tr style="height: 18px;">
                                    <td style="width: 100%; height: 18px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Document
                                            Title <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                                <tr style="height: 18px;">
                                    <td style="width: 100%; height: 18px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Issuing
                                            Authority <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                                <tr style="height: 18px;">
                                    <td style="width: 100%; height: 18px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Document
                                            Number <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                                <tr style="height: 18px;">
                                    <td style="width: 100%; height: 18px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">
                                            Expiration Date (if any)(mm/dd/yyyy) <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                            </tbody>
                        </table>
                        <table style="border-collapse: collapse; width: 100%; height: 72px;" border="1">
                            <tbody>
                                <tr style="height: 18px;">
                                    <td style="width: 100%; height: 18px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Document
                                            Title <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                                <tr style="height: 18px;">
                                    <td style="width: 100%; height: 18px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Issuing
                                            Authority <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                                <tr style="height: 18px;">
                                    <td style="width: 100%; height: 18px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Document
                                            Number <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                                <tr style="height: 18px;">
                                    <td style="width: 100%; height: 18px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">
                                            Expiration Date (if any)(mm/dd/yyyy) <input style="width: 100%; border: 0;" type="text"></span></td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td style="width: 1.0735%; height: 98px; background-color: #bec1c3;">&nbsp;</td>
                    <td style="width: 65.5931%; height: 98px; vertical-align: top;">
                        <table style="border-collapse: collapse; width: 100%; height: 68px;" border="0">
                            <tbody>
                                <tr style="height: 17px;">
                                    <td style="width: 50%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Document
                                            Title <input style="width: 100%; border: 0; border-bottom: solid 1px #000;" type="text"></span></td>
                                    <td style="width: 50%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Document
                                            Title <input style="width: 100%; border: 0; border-bottom: solid 1px #000;" type="text"></span></td>
                                </tr>
                                <tr style="height: 17px;">
                                    <td style="width: 50%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Issuing
                                            Authority <input style="width: 100%; border: 0; border-bottom: solid 1px #000;" type="text"></span></td>
                                    <td style="width: 50%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Issuing
                                            Authority <input style="width: 100%; border: 0; border-bottom: solid 1px #000;" type="text"></span></td>
                                </tr>
                                <tr style="height: 17px;">
                                    <td style="width: 50%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Document
                                            Number <input style="width: 100%; border: 0; border-bottom: solid 1px #000;" type="text"></span></td>
                                    <td style="width: 50%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Document
                                            Number<input style="width: 100%; border: 0; border-bottom: solid 1px #000;" type="text"></span></td>
                                </tr>
                                <tr style="height: 17px;">
                                    <td style="width: 50%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Expiration
                                            Date (if any)(mm/dd/yyyy) <input style="width: 100%; border: 0; border-bottom: solid 1px #000;" type="text"></span></td>
                                    <td style="width: 50%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Expiration
                                            Date (if any)(mm/dd/yyyy) <input style="width: 100%; border: 0; border-bottom: solid 1px #000;" type="text"></span></td>
                                </tr>
                            </tbody>
                        </table>
                        <table style="border-collapse: collapse; width: 100%; height: 297px;" border="0">
                            <tbody>
                                <tr style="height: 297px; vertical-align: top;">
                                    <td style="width: 62.476%; height: 297px;">
                                        <div style="width: 250px; height: 250px; border: solid 1px #000;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Additional
                                                Information</span></div>
                                    </td>
                                    <td style="width: 37.524%; height: 297px;">
                                        <div style="width: 150px; height: 150px; border: solid 1px #000;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">QR
                                                Code - Sections 2 &amp; 3</span></div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>Certification:
                    I attest, under penalty of perjury, that (1) I have examined the document(s) presented by the
                    above-named employee, (2) the above-listed document(s) appear to be genuine and to relate to the
                    employee named, and (3) to the best of my knowledge the employee is authorized to work in the United
                    States.</strong></span></p>
        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>The
                    employee's first day of employment (mm/dd/yyyy):&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                    &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; (See instructions for exemptions)</strong></span></p>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 39.6135%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Signature
                            of Employer or Authorized Representative <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 19.431%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Today's
                            Date(mm/dd/yyyy) <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 40.9554%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Title of
                            Employer or Authorized Representative <input style="width: 100%; border: 0;" type="text"></span></td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 33.3333%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Last
                            Name of Employer or Authorized Representative <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 33.3333%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">First
                            Name of Employer or Authorized Representative <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 33.3333%;">
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Employer's
                                Business or Organization Name</span></p>
                        <p style="padding-left: 40px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>Tummi
                                    Staffing, Inc.</strong></span></p>
                    </td>
                </tr>
            </tbody>
        </table>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 35.5207%;">
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Employer's
                                Business or Organization Address (Street Number and Name)</span></p>
                        <p style="padding-left: 40px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>PO
                                    Box 592715</strong></span></p>
                    </td>
                    <td style="width: 45.2361%;">
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">City
                                or Town</span></p>
                        <p style="padding-left: 40px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>
                                    San Antonio </strong></span></p>
                    </td>
                    <td style="width: 6.3205%;">
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">State</span>
                        </p>
                        <p style="padding-left: 40px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>TX</strong></span>
                        </p>
                    </td>
                    <td style="width: 12.9227%;">
                        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Zip
                                Code</span></p>
                        <p style="padding-left: 40px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>78259</strong></span>
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
        <p>&nbsp;</p>
        <table style="border-collapse: collapse; width: 100%; height: 51px;" border="1">
            <tbody>
                <tr style="height: 17px;">
                    <td style="width: 25%; height: 17px; background-color: #bec1c3;" colspan="4"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>Section
                                3. Reverification and Rehires (To be completed and signed by employer or authorized
                                representative.)</strong></span></td>
                </tr>
                <tr style="height: 17px;">
                    <td style="width: 25%; height: 17px;" colspan="2"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>A.</strong>
                            New Name (if applicable)</span></td>
                    <td style="width: 25%; height: 17px;">&nbsp;</td>
                    <td style="width: 25%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>B.</strong>
                            Date of Rehire (if applicable)</span></td>
                </tr>
                <tr style="height: 17px;">
                    <td style="width: 25%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Last
                            Name (Family Name) <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 25%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">First
                            Name (Given Name) <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 25%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Middle
                            Initial <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 25%; height: 17px;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Date
                            (mm/dd/yyyy) <input style="width: 100%; border: 0;" type="text"></span></td>
                </tr>
            </tbody>
        </table>
        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">&nbsp;</span></p>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 99.9999%; background-color: #bec1c3;" colspan="3"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>C.</strong>
                            If the employee's previous grant of employment authorization has expired, provide the
                            information for the document or receipt that establishes continuing employment authorization
                            in the space provided below.</span></td>
                </tr>
                <tr>
                    <td style="width: 37.5841%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Signature
                            of Employer or Authorized Representative <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 28.3386%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Today's
                            Date (mm/dd/yyyy) <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 34.0772%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Name of
                            Employer or Authorized Representative <input style="width: 100%; border: 0;" type="text"></span></td>
                </tr>
            </tbody>
        </table>
        <p><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;"><strong>I attest,
                    under penalty of perjury, that to the best of my knowledge, this employee is authorized to work in
                    the United States, and if the employee presented document(s), the document(s) I have examined appear
                    to be genuine and to relate to the individual.</strong></span></p>
        <table style="border-collapse: collapse; width: 100%;" border="1">
            <tbody>
                <tr>
                    <td style="width: 37.5841%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Signature
                            of Employer or Authorized Representative <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 27.0634%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Today's
                            Date (mm/dd/yyyy) <input style="width: 100%; border: 0;" type="text"></span></td>
                    <td style="width: 35.3524%;"><span style="color: #000000; font-family: arial, helvetica, sans-serif; font-size: 10pt;">Name of
                            Employer or Authorized Representative <input style="width: 100%; border: 0;" type="text"></span></td>
                </tr>
            </tbody>
        </table>
    </div>
    <img src="https://i.imgur.com/yP3pq57.png" width="100%" alt="">
</div>`)}</div>
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

export default withApollo(withGlobalContent(FormsI9));
