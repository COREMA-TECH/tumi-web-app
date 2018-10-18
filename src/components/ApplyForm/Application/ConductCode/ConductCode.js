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
//import html from '../../../../data/Package hire/CondeConduct';


class ConductCode extends Component {
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
                    'Error to sign Conduct Code information. Please, try again!',
                    'bottom',
                    'right'
                );
            });
    };

    createDocumentsPDF = () => {
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
                    this.setState({ loadingData: false });
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
                this.setState({ loadingData: false });
            });
    };


    downloadDocumentsHandler = () => {
        var url = this.context.baseUrl + '/public/Documents/' + "ConductCode-" + this.state.applicantName + '.pdf';
        window.open(url, '_blank');
    };

    componentWillMount() {
        this.getConductCodeInformation(this.props.applicationId);
        this.getApplicantInformation(this.props.applicationId);
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
                                <span className="applicant-card__title">Conduct Code</span>
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
                                                <p style="margin: 0.65pt 0in 0.0001pt 1pt; text-align: center; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;" align="center"><strong><span style="font-size: 15.5pt; font-family: 'Times New Roman', serif;">Tumi Staffing Code of Conduct</span></strong></p>
                                                <p style="margin: 4.9pt 42.8pt 0.0001pt 0in; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 10.5pt; line-height: 110%;">&nbsp;</span></p>
                                                <ol>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">As an employee of Tumi Staffing committed to providing the highest level of guest service with a commitment to quality in every aspect of my job;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">I agree to follow all rules and regulations of both Tumi Staffing, and the employment partner or hotel where I am assigned to work;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">I understand that I have a responsibility for my safety and security, as well as that of my co-workers and our clients and hotel guests, and will conduct myself in a safe manner, and report any accidents, or unsafe conditions immediately to ensure that corrective action is taken;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">I will arrive to my workplace with sufficient time to ensure that I am in uniform and ready to clock-in and begin my work shift on time;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">I will practice good hygiene, including bathing and washing my hair, being clean shaven, using deodorant, brushing my teeth before reporting to work, and using clothing that is clean, pressed and presentable for the work environment; </span></li>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">When in the front of the house guest contact areas, I will conduct myself in a positive and professional manner, making contact with and offering a warm and friendly greeting to every guest I encounter;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">I understand that a positive work environment is critical to the success of our business, and I will treat every other Tumi Staffing employee, supervisor or manager, or those of our employment partner with the same respect and dignity as we treat our hotel guests;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">I will perform my assigned duties in a through and timely manner, with a positive attitude, always seeking to exceed the expectations of the guests and our employment partner;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">I understand that open lines of communication and a free flow of information are critical to the success of our business and our relationship with our employment partner, and I will report to Tumi Staffing Management, any problems I encounter in the workplace or which are reported to me, including any inappropriate behavior by or toward any employee of Tumi Staffing, any safety or security hazards or violations, any guest or employee accidents, or any inappropriate or unethical conduct, and will never do anything to hinder communication between Tumi employees, supervisors, managers, or our employment partner;</span><span style="font-size: 10.5pt;">&nbsp;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">I will conduct myself with honesty and integrity in all interactions with my coworkers, hotel staff, supervisors and managers and will not engage in any unsafe or inappropriate conduct, or actions which would negatively reflect on Tumi Staffing or our hotel partner, or cause a conflict of interest with either one;</span></li>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <li style="text-align: justify;"><span style="font-size: 10.5pt;">I am committed to the success of Tumi Staffing, Inc and providing a positive environment to all of my fellow employees!</span></li>
                                                </ol>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif; text-align: justify;">&nbsp;</p>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
                                                <p style="margin: 5.4pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Signed: <u><img width="300" height="300" src="` + this.state.signature + `" alt=""></u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Date: <u>` + this.state.date + `</u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Printed Name: <u>` + this.state.applicantName + `</u></p>
                                                </div>
                                                <p>&nbsp;</p>
                                `)}
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