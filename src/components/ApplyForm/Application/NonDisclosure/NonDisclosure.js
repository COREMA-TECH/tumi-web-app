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
import { GET_DISCLOSURE_INFO, CREATE_DOCUMENTS_PDF_QUERY } from "./Queries";
import PropTypes from 'prop-types';

class NonDisclosure extends Component {
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
        }
    }

    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false,
            date: new Date().toISOString().substring(0, 10)
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

    createDocumentsPDF = () => {
        this.props.client
            .query({
                query: CREATE_DOCUMENTS_PDF_QUERY,
                variables: {
                    contentHTML: document.getElementById('DocumentPDF').innerHTML,
                    Name: "NonDisclosure-" + this.state.applicantName
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
        var url = this.context.baseUrl + '/public/Documents/' + "NonDisclosure-" + this.state.applicantName + '.pdf';
        window.open(url, '_blank');
    };

    componentWillMount() {
        this.getDisclosureInformation(this.props.applicationId);
        this.getApplicantInformation(this.props.applicationId);
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
                            signatureValue={this.handleSignature} />
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
                                <span className="applicant-card__title">Non-Disclosure</span>
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
                                <div id="DocumentPDF" className="signature-information">
                                    {renderHTML(`<div class="WordSection1">
                                    <p style="margin: 0.35pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 9.5pt; font-family: 'Times New Roman', serif;">&nbsp;</span></p>
                                    <p style="margin: 5.25pt 0in 0.0001pt 5pt; text-align: justify; font-size: 11pt; font-family: 'Time New Roman';"><span style="font-size: 18.0pt;">NO</span><span style="font-size: 18.0pt;">NON-DISCLOSURE AND NON-SOLICITATION AGREEMENT</span></p>
                                    <h1 style="margin: 15.95pt 0in 0.0001pt 5pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><u>PART I: Confidential Information</u></h1>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><strong><span style="font-size: 13.0pt;">&nbsp;</span></strong></p>
                                    <ol style="margin-bottom: 0in; margin-top: 0px;">
                                    <li style="margin: 0in 9.3pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">I &nbsp;acknowledge &nbsp;that Tumi Staffing, Inc. is the exclusive owner of its Confidential Information, which includes all information regardless of its form of recording, not in the public domain, relating to:</span></li>
                                    </ol>
                                    <p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <ol style="list-style-type: lower-roman; margin-bottom: 0in; margin-top: 0px;">
                                    <li style="margin: 0in 23.5pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">Information &nbsp;on customers of Tumi Staffing, Inc. names, addresses, telephone numbers, contact </span><span style="font-size: 12.0pt; line-height: 105%;">persons, medical information, and banking information.</span></li>
                                    </ol>
                                    <p style="margin: 0.1pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <ol style="list-style-type: lower-roman; margin-top: .05pt; margin-bottom: .0001pt;" start="2">
                                    <li style="margin: 0.05pt 34.4pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">Proprietary and financial information of Tumi Staffing, Inc. prices, sales information, terms of </span><span style="font-size: 12.0pt; line-height: 105%;">contracts with discounts, costs, the names of the organization&apos;s suppliers and customers.</span></li>
                                    </ol>
                                    <p style="margin: 0.1pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <ol style="list-style-type: lower-roman; margin-top: .05pt; margin-bottom: .0001pt;" start="3">
                                    <li style="margin: 0.05pt 20.4pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">Tumi Staffing, Inc. &apos;s business methods, practices, strategies, and related information including </span><span style="font-size: 12.0pt; line-height: 105%;">marketing &nbsp;and advertising, and indices, techniques, and data retention methodologies by which </span><span style="font-size: 12.0pt; line-height: 105%;">Tumi Staffing, Inc. maintains information regarding its clients.</span></li>
                                    </ol>
                                    <p style="margin: 0.1pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <ol style="list-style-type: lower-roman; margin-top: .05pt; margin-bottom: .0001pt;" start="4">
                                    <li style="margin: 0.05pt 47.95pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">All &nbsp;information regarding Tumi Staffing, Inc. &apos;s employees and its related human resources </span><span style="font-size: 12.0pt; line-height: 105%;">information, including employee manuals, interviewing techniques, and training manuals.</span></li>
                                    </ol>
                                    <p style="margin: 0.1pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <ol style="list-style-type: lower-roman; margin-top: .05pt; margin-bottom: .0001pt;" start="5">
                                    <li style="margin: 0.05pt 50pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">Information received by Tumi Staffing, Inc. from third persons to whom it owes a duty of </span><span style="font-size: 12.0pt; line-height: 105%;">confidence.</span></li>
                                    </ol>
                                    <p style="margin: 0.1pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <ol style="list-style-type: lower-roman; margin-top: 0in; margin-bottom: .0001pt;" start="6">
                                    <li style="margin: 0in 0in 0.0001pt 0px; text-align: justify; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 18.3333px;"><span style="font-size: 12.0pt;">All</span> <span style="font-size: 12.0pt;">secrets</span><span style="font-size: 12.0pt;">,</span> <span style="font-size: 12.0pt;">trade</span> <span style="font-size: 12.0pt;">secrets</span><span style="font-size: 12.0pt;">,</span> <span style="font-size: 12.0pt;">know</span><span style="font-size: 12.0pt;">-</span><span style="font-size: 12.0pt;">how</span><span style="font-size: 12.0pt;">,</span> <span style="font-size: 12.0pt;">ideas</span><span style="font-size: 12.0pt;">,</span> <span style="font-size: 12.0pt;">and</span> <span style="font-size: 12.0pt;">processe</span><span style="font-size: 12.0pt;">s</span> <span style="font-size: 12.0pt;">o</span><span style="font-size: 12.0pt;">f</span> <span style="font-size: 12.0pt;">Tum</span><span style="font-size: 12.0pt;">i</span> <span style="font-size: 12.0pt;">Staffing</span><span style="font-size: 12.0pt;">,</span> <span style="font-size: 12.0pt;">Inc.</span> <span style="font-size: 12.0pt;">.</span></li>
                                    </ol>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 13.0pt;">&nbsp;</span></p>
                                    <h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5pt; font-size: 12pt; font-family: 'Time New Roman';"><u>Proprietary right</u></h1>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><strong><span style="font-size: 13.0pt;">&nbsp;</span></strong></p>
                                    <ol style="margin-top: 0.05pt; margin-bottom: 0in;" start="2">
                                    <li style="margin: 0.05pt 6.25pt 0.0001pt 0px; text-align: justify; line-height: 106%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 106%;">I &nbsp;acknowledge &nbsp;that all Confidential Information constitutes a proprietary right which Tumi Staffing, </span><span style="font-size: 12.0pt; line-height: 106%;">Inc. and its affiliated organizations are entitled to protect.</span></li>
                                    </ol>
                                    <p style="margin: 0.35pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';">&nbsp;</p>
                                    <h1 style="margin: 0.05pt 0in 0.0001pt 5pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><u>Non-disclosure</u></h1>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><strong><span style="font-size: 13.0pt;">&nbsp;</span></strong></p>
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="3">
                                    <li style="margin: 0in 5.25pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">I agree that during my employment with Tumi Staffing, Inc., or at any time thereafter, I will not disclose &nbsp;any Confidential Information to any person, including any competitor of Tumi Staffing, Inc.</span></li>
                                    </ol>
                                    <p style="margin: 0in 0in 0.0001pt 41pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'Time New Roman';">, or future employer of mine. I will not use the confidential information for any purpose other than those permitted by Tumi Staffing, Inc.</p>
                                    <p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="4">
                                    <li style="text-align: justify; line-height: 105%; margin: 0in 6.25pt 0.0001pt 0px; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">I &nbsp;agree that during my employment with Tumi Staffing, Inc. or at any time thereafter, I will comply with all security precautions and measures of Tumi Staffing, Inc. that are intended to maintain the </span><span style="font-size: 12.0pt; line-height: 105%;">confidentiality of its Confidential Information and to limit its distribution to instances of a legitimate need-to-know basis that are intended to promote the best interests of the Company.</span></li>
                                    </ol>
                                    </div>
                                    <p><span style="font-size: 12.0pt; line-height: 105%; font-family: 'Time New Roman';">&nbsp;</span></p>
                                    <div class="WordSection2">
                                    <ol style="margin-top: 4.65pt; margin-bottom: .0001pt;" start="5">
                                    <li style="margin: 4.65pt 25.15pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">I &nbsp;agree that during my employment with Tumi Staffing, Inc. or at any time thereafter, I will not </span><span style="font-size: 12.0pt; line-height: 105%;">make copies, summaries, or extracts of Confidential Information, nor will I remove any Confidential Information from the place of business unless authorised by Tumi Staffing, Inc. .</span></li>
                                    </ol>
                                    <p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="6">
                                    <li style="margin: 0in 17.1pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">I &nbsp;agree that during my employment with Tumi Staffing, Inc. or at any time thereafter, I will not </span><span style="font-size: 12.0pt; line-height: 105%;">disclose any Confidential Information concerning Tumi Staffing, Inc. or its affiliated corporations </span><span style="font-size: 12.0pt; line-height: 105%;">which could adversely affect the organization&apos;s image, reputation or value.</span></li>
                                    </ol>
                                    <p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5pt; font-size: 12pt; font-family: 'Time New Roman';"><u>Former employer&apos;s confidential information</u></h1>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><strong><span style="font-size: 13.0pt;">&nbsp;</span></strong></p>
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="7">
                                    <li style="margin: 0in 11.85pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">I agree that during my employment with Tumi Staffing, Inc. I will not improperly use or disclose any proprietary information of any former or concurrent employer or other person or entity and I will not bring onto the premises of Tumi Staffing, Inc. any unpublished document or proprietary information belonging to any such employer, person or entity unless consented to in writing by </span><span style="font-size: 12.0pt; line-height: 105%;">such employer, person or entity.</span></li>
                                    </ol>
                                    <p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5pt; font-size: 12pt; font-family: 'Time New Roman';"><u>Return employer&apos;s property</u></h1>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><strong><span style="font-size: 13.0pt;">&nbsp;</span></strong></p>
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="8">
                                    <li style="margin: 0in 17.3pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">I agree that on termination of my employment with Tumi Staffing, Inc. or at any time Tumi Staffing, Inc. may request, to promptly deliver all memoranda, notes, records, reports, manuals, and any other hard copy documents or electronic data belonging to Tumi Staffing, Inc. , or containing Confidential Information, including all copies of materials I may posses or have under my control.</span></li>
                                    </ol>
                                    <p style="margin: 0.2pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5pt; font-size: 12pt; font-family: 'Time New Roman';"><u>Exit interview</u></h1>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><strong><span style="font-size: 13.0pt;">&nbsp;</span></strong></p>
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="9">
                                    <li style="margin: 0in 6.4pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">I agree that if my employment with Tumi Staffing, Inc. is terminated for any reason, unless Tumi Staffing, Inc. waives this requirement, I will, within one week of my leaving Tumi Staffing, Inc. , review with the person designated for this purpose by Tumi Staffing, Inc. , the nature and type of Confidential Information to which I have had access and I will sign an acknowledgement describing </span><span style="font-size: 12.0pt; line-height: 105%;">the nature and type of Confidential Information which I am duty bound not to use or disclose.</span></li>
                                    </ol>
                                    <p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <h1 style="margin: 0in 395.05pt 0.0001pt 5pt; text-align: justify; line-height: 210%; font-size: 12pt; font-family: 'Time New Roman';"><u>PART II: Non-solicitation</u> <u>Non-solicitation of clients</u></h1>
                                    <ol style="margin-top: .05pt; margin-bottom: .0001pt;" start="10">
                                    <li style="list-style: outside none none; margin: 0.05pt 12.25pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman';">
                                    <ol style="margin-top: .05pt; margin-bottom: .0001pt;">
                                    <li style="margin: 0.05pt 12.25pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman';"><span style="font-size: 12.0pt; line-height: 105%;">I agree for a period of twelve (12) months from the date of termination of my employment with Tumi Staffing, Inc., I will not to directly or indirectly solicit competitive business from any client or </span><span style="font-size: 12.0pt; line-height: 105%;">customer of the organization (including any potential client of Tumi Staffing, Inc. ) that was contacted, solicited, or served by me or about which I received confidential information while I was employed by Tumi Staffing, Inc. , nor for the same period of time, will I perform services or accept any business, competitive with that of Tumi Staffing, Inc., directly or indirectly from any of the customers and clients described above, which involves me performing similar functions or acting in a similar capacity as when employed with Tumi Staffing, Inc. .</span></li>
                                    </ol>
                                    </li>
                                    </ol>
                                    </div>
                                    <p><span style="font-size: 12.0pt; line-height: 105%; font-family: 'Time New Roman';">&nbsp;</span></p>
                                    <h1 style="margin: 4.65pt 0in 0.0001pt 5pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><u>Non-solicitation of other employees</u></h1>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><strong><span style="font-size: 13.0pt;">&nbsp;</span></strong></p>
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="11">
                                    <li style="list-style: outside none none; margin: 0in 5.7pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;">
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="2">
                                    <li style="margin: 0in 5.7pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">I agree so long as employed by Tumi Staffing, Inc. and for a period of twelve (12) months after leaving for any reason whatsoever, not to directly or indirectly recruit, solicit, or otherwise induce or attempt to induce any employee of Tumi Staffing, Inc., to terminate his or her employment with the Company or otherwise to act contrary to the interests of Tumi Staffing, Inc. .</span></li>
                                    </ol>
                                    </li>
                                    </ol>
                                    <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 14.0pt;">&nbsp;</span></p>
                                    <p style="margin: 0.3pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 11.0pt;">&nbsp;</span></p>
                                    <h1 style="margin: 0in 328.05pt 0.0001pt 5pt; text-align: justify; line-height: 210%; font-size: 12pt; font-family: 'Time New Roman';"><u>PART III: General Provisions</u> <u>Necessary protections</u></h1>
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="12">
                                    <li style="list-style: outside none none; margin: 0in 5.5pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman';">
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="3">
                                    <li style="list-style: outside none none; margin: 0in 5.5pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman';">
                                    <ol style="margin-bottom: 0in; margin-top: 0px;">
                                    <li style="margin: 0in 5.5pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman';"><span style="font-size: 12.0pt; line-height: 105%;">I acknowledge that the restrictions contained in this Agreement are necessary for the protection </span><span style="font-size: 12.0pt; line-height: 105%;">and goodwill of Tumi Staffing, Inc. and I consider them to be reasonable for that purpose. I therefore agree that any breach of the terms of this Agreement is likely to cause Tumi Staffing, Inc. substantial and irrevocable damage and irreparable harm. In the event of any such breach, I agree that Tumi Staffing, Inc. , in addition to such other remedies which may be available, shall be entitled to specific performance and other injunctive or marketing relief including interim or interlocutory relief, if demanded.</span></li>
                                    </ol>
                                    </li>
                                    </ol>
                                    </li>
                                    </ol>
                                    <p style="margin: 0.35pt 0in 0.0001pt 23pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';">2.</p>
                                    <h1 style="margin: 0.7pt 0in 0.0001pt 5pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><u>Continuing obligations</u></h1>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><strong><span style="font-size: 13.0pt;">&nbsp;</span></strong></p>
                                    <p style="margin: 0in 0in 0.0001pt 41pt; text-align: justify; text-indent: -0.25in; line-height: 105%; font-size: 12pt; font-family: 'Time New Roman';">3. I agree that the provisions of this Schedule shall survive the termination of my employment relationship however it may arise.</p>
                                    <p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5pt; font-size: 12pt; font-family: 'Time New Roman';"><u>Severability</u></h1>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><strong><span style="font-size: 13.0pt;">&nbsp;</span></strong></p>
                                    <ol style="margin-bottom: 0in; margin-top: 0px;">
                                    <li style="list-style: outside none none; margin: 0in 20.1pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;">
                                    <ol style="margin-bottom: 0in; margin-top: 0px;" start="4">
                                    <li style="margin: 0in 20.1pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman'; text-indent: 24px;"><span style="font-size: 12.0pt; line-height: 105%;">In the event that any provision of this Agreement or part thereof shall be deemed void, invalid, illegal or unenforceable in whole or in part, the remaining provisions or parts shall remain in full </span><span style="font-size: 12.0pt; line-height: 105%;">force and effect.</span></li>
                                    </ol>
                                    </li>
                                    </ol>
                                    <p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 12.5pt;">&nbsp;</span></p>
                                    <h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5pt; font-size: 12pt; font-family: 'Time New Roman';"><u>Independent Legal Advice</u></h1>
                                    <p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><strong><span style="font-size: 13.0pt;">&nbsp;</span></strong></p>
                                    <ol style="margin-top: 0in; margin-bottom: .0001pt;" start="2">
                                    <li style="list-style: outside none none; margin: 0in 7.5pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman';">
                                    <ol style="margin-top: 0in; margin-bottom: .0001pt;" start="5">
                                    <li style="margin: 0in 7.5pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'Time New Roman';"><span style="font-size: 12.0pt; line-height: 105%;">I have been advised that I have the right to obtain legal counsel before signing this Agreement and </span><span style="font-size: 12.0pt; line-height: 105%;">I have obtained the level of advice I deem appropriate.</span></li>
                                    </ol>
                                    </li>
                                    </ol>
                                    <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 10.0pt;">&nbsp;</span></p>
                                    <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 10.0pt;">&nbsp;</span></p>
                                    <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 10.0pt;">&nbsp;</span></p>
                                    <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 10.0pt;">&nbsp;</span></p>
                                    <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 10.0pt;">&nbsp;</span></p>
                                    <p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 9.5pt;"><u><img width="70" height="auto" src="` + this.state.signature + `" alt=""></u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<u>` + this.state.date + `</u></span></p>
                                    <p style="margin: 0in 0in 0.0001pt 5pt; text-align: justify; line-height: 13.7pt; font-size: 12pt; font-family: 'Time New Roman';">Signature of Employee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date Signed</p>
                                    <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 10.0pt;">&nbsp;</span></p>
                                    <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 10.0pt;">&nbsp;</span></p>
                                    <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 10.0pt;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u>` + this.state.applicantName + `</u></span></p>
                                    <p style="margin: 0in 0in 0.0001pt 5pt; text-align: justify; line-height: 13.7pt; font-size: 12pt; font-family: 'Time New Roman';">Name of Employee</p>
                                    <p style="margin: 0.2pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'Time New Roman';"><span style="font-size: 8.5pt; font-family: 'Times New Roman', serif;">&nbsp;</span></p>`)}
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

export default withApollo(withGlobalContent(NonDisclosure));