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
import { CREATE_DOCUMENTS_PDF_QUERY, GET_SUMMARY_INFO } from "./Queries";
import PropTypes from 'prop-types';

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class Summary extends Component {
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

    getInformation = () => {
        this.props.client
            .query({
                query: GET_SUMMARY_INFO,
                variables: {
                    id: this.props.applicationId
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.applications[0] !== null) {
                   console.log("data.applications[0] ", data.applications[0].Account.bankName)
                    this.setState({
                        applicantName: data.applications[0].firstName +' '+data.applications[0].middleName+' '+ data.applications[0].lastName
                        ,socialSecurityNumber:data.applications[0].socialSecurityNumber==null?'--':data.applications[0].socialSecurityNumber
                        ,cellphone:data.applications[0].cellPhone==null?'--':data.applications[0].cellPhone
                        ,birthDay :data.applications[0].birthDay==null?'--':data.applications[0].birthDay.substring(0, 10)
                        ,streetAddress:data.applications[0].streetAddress==null?'--':data.applications[0].streetAddress
                        ,zipCode:data.applications[0].zipCode==null?'--':data.applications[0].zipCode.substring(0, 5)
                        ,hireDate:data.applications[0].hireDate==null?'--':data.applications[0].hireDate
                        ,gender:data.applications[0].gender==null?'--':data.applications[0].gender
                        ,bankName:data.applications[0].Account !=null ? data.applications[0].Account.bankName: '--'
                        ,routing:data.applications[0].Account !=null ? data.applications[0].Account.routingNumber: '--'
                        ,account:data.applications[0].Account !=null ? data.applications[0].Account.accountNumber: '--'
                        ,car:data.applications[0].car
                        ,recruiter:data.applications[0].recruiter==null?'--':data.applications[0].recruiter.Full_Name
                        ,area:data.applications[0].area==null?'--':data.applications[0].area
                        ,typeOfId:data.applications[0].typeOfId==null?'--': (data.applications[0].typeOfId==1?'Birth certificate':(data.applications[0].typeOfId==2?'Social Security card':'State-issued drivers license'))
                        ,expireDateId:data.applications[0].expireDateId==null?'--':data.applications[0].expireDateId.substring(0, 10)
                        ,hotel: data.applications[0].employee==null?'--': data.applications[0].employee.Employees.BusinessCompany.Name
                    });
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
                    Name: "Summary-" + this.state.applicantName
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
        var url = this.context.baseUrl + '/public/Documents/' + "Summary-" + this.state.applicantName + '.pdf';
        window.open(url, '_blank');
        this.setState({ downloading: false });
    };

    componentWillMount() {
        this.getInformation();
//        this.getDisclosureInformation(this.props.applicationId);
  //      this.getApplicantInformation(this.props.applicationId);
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
                                                        }}>{this.state.downloading && (
                                                            <React.Fragment>Downloading <i class="fas fa-spinner fa-spin" /></React.Fragment>)}
                                                            {!this.state.downloading && (<React.Fragment>{actions[9].label} <i
                                                                className="fas fa-download" /></React.Fragment>)}

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
                                    {renderHTML(`<div class="WordSection1">
                                    <table style='border-collapse: collapse; width: 100%; height: 75px;' border='0'>

                                    <tbody style='border-bottom: solid 3px #b40639;'>
                                    
                                    <tr style='height: 91px;'>
                                    
                                    <td style='width: 8.21675%; height: 75px;'><img src='
                                     data:image/jpeg;base64,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
                                    ' width='140' height='140' style='margin-bottom: -5px;'/></td>
                                    
                                    <td style='width: 91.7833%; height: 75px;'>
                                    
                                    <p><strong><span style='font-family: 'times new roman', times; color: #b40639;'>SUMMARY</span></strong></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>NAME</strong>: </span>` + this.state.applicantName + `</span></p>
                                    
                                    </td>
                                    
                                    </tr>
                                    
                                    </tbody>
                                    
                                    </table>
                                    
                                    <h4><strong><span style='font-family: 'times new roman', times;'>&nbsp;<span style='color: #b40639;'>PERSONAL INFORMATION:</span></span></strong></h4>
                                    
                                    <table style='border-collapse: collapse; width: 100%; height: 42px;' border='0'>
                                    
                                    <tbody>
                                    
                                    <tr style='height: 21px;'>
                                    
                                    <td style='width: 50%; height: 21px;'>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #000000;'><strong>SOCIAL SECURITY NO:</strong> </span> `+this.state.socialSecurityNumber+` </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #000000;'><strong>CONTACT</strong>:</span> `+this.state.cellphone +` </span></p>
                                    
                                    </td>
                                    
                                    <td style='width: 50%; height: 21px;'>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><strong><span style='color: #000000;'>GENDER:</span> </strong> `+ this.state.gender +` </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><strong><span style='color: #000000;'>BIRTHDATE:</span></strong> `+ this.state.birthDay +` </span></p>
                                    
                                    </td>
                                    
                                    </tr>
                                    
                                    </tbody>
                                    
                                    </table>
                                    
                                    <h4><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>ADDRESS:</strong></span> `+ this.state.streetAddress +`,`+ this.state.zipCode +`</span></h4>
                                    
                                    <table style='border-collapse: collapse; width: 100%; background-color: #ecf0f1; border-color: #ffffff;' border='0'>
                                    
                                    <tbody>
                                    
                                    <tr>
                                    
                                    <td style='width: 50%;'>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>HOTEL:</strong></span> `+ this.state.hotel +` </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>DEPARTMENT:</strong></span> -- </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>JOB DESCRIPTION:</strong></span> -- </span></p>
                                    
                                    </td>
                                    
                                    <td style='width: 50%;'>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>HIRE DATE:</strong></span>  `+ this.state.hireDate +` </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><strong><span style='color: #b40639;'>EMPLOYMENT TYPE(FT/PT):</span></strong>  -- </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><strong><span style='color: #b40639;'>PAY RATE:</span></strong>  -- </span></p>
                                    
                                    </td>
                                    
                                    </tr>
                                    
                                    </tbody>
                                    
                                    </table>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>STATUS (SINGLE/MARRIED):</strong></span>  `+ this.state.gender +` </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>NO. OF DEPARTMENT:</strong></span> 0</span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>SOURCE (RECRUITER NAME):</strong></span> `+  this.state.recruiter +` </span></p>
                                    
                                    <table style='border-collapse: collapse; width: 100%; height: 127px; background-color: #ecf0f1;' border='0'>
                                    
                                    <tbody>
                                    
                                    <tr style='height: 127px;'>
                                    
                                    <td style='width: 100%; height: 127px;'>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>DIRECT DEPOSIT ACCOUNT NO:</strong></span> `+  this.state.account +` </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>BANK NAME:</strong></span> `+  this.state.bankName +` </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>ROUTING NO:</strong></span> `+ this.state.routing +` </span></p>
                                    
                                    </td>
                                    
                                    </tr>
                                    
                                    </tbody>
                                    
                                    </table>
                                    
                                    <table style='border-collapse: collapse; width: 100%;' border='0'>
                                    
                                    <tbody>
                                    
                                    <tr>
                                    
                                    <td style='width: 50%;'>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>ID:</strong></span> -- </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><strong><span style='color: #b40639;'>TYPE OF ID:</span></strong> `+ this.state.typeOfId +` </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>EXP DATE:</strong></span> `+ this.state.expireDateId +` </span></p>
                                    
                                    </td>
                                    
                                    <td style='width: 50%;'>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>CAR:</strong></span> `+ this.state.car +` </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>KIDS:</strong></span> -- </span></p>
                                    
                                    <p><span style='font-family: 'times new roman', times;'><span style='color: #b40639;'><strong>AREA:</strong></span> `+ this.state.area +` </span></p>
                                    
                                    </td>
                                    
                                    </tr>
                                    
                                    </tbody>
                                    
                                    </table>
                                    
                                    <p>&nbsp;</p>`)}
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

export default withApollo(withGlobalContent(Summary));