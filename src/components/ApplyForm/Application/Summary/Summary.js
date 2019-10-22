import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import withApollo from "react-apollo/withApollo";
import { ADD_NON_DISCLOSURE, UPDATE_PDF_URL_SUMMARY } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import renderHTML from 'react-render-html';
import { GET_APPLICANT_INFO } from "../ConductCode/Queries";
import { CREATE_DOCUMENTS_PDF_QUERY, GET_SUMMARY_INFO, GET_HOME_LOCATION } from "./Queries";
import PropTypes from 'prop-types';
import moment from 'moment';
import Document from './Document';

const uuidv4 = require('uuid/v4');

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
            completed: false,
            marital: '',
            city: '',
            state: '',
            numberId: '',
            employmentType: '',
            accounts: [],
            exemptions: 0,
            jobDescription: [],
            urlPDF: null
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

                //this.props.changeTabState();
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

    getSource = (opt, nameReference) => {
        let source;
        switch (opt) {
            case 1: source = "Facebook";
                break;
            case 2: source = "Newspaper";
                break;
            case 3: source = nameReference + " (Employee)";
                break;
            case 4: source = nameReference + " (Recruiter)";
                break;
            default: source = '';
                break;
        }

        return source;
    }

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
                let applications  = data.applications[0];
                if (applications) {
                    this.setState(prevState => {
                        let gender = "--";
                        let hireDate = "--";
                        let hotel = "--";
                        const idealJob = applications.idealJobs ? applications.idealJobs.find(j => j.isDefault) : '--';
                        let typeOfId = applications.typeOfId;
                        if (applications.gender)
                            gender = applications.gender === 1 ? 'MALE' : 'FEMALE';
                        if (applications.employee)
                            hireDate = applications.employee.Employees.hireDate ? moment(applications.employee.Employees.hireDate).format('MM/DD/YYYY') : '--';
                        if (applications.employee)
                            hotel = applications.employee.Employees.BusinessCompany ? applications.employee.Employees.BusinessCompany.Name: '--';

                        
                        switch(typeOfId) {
                            case 1: 
                                typeOfId = 'Birth certificate';
                                break;
                            case 2: 
                                typeOfId = 'Social Security card';
                                break;
                            case 3: 
                                typeOfId = 'State-issued drivers license';
                                break;
                            case 4: 
                                typeOfId = 'State-issued ID';
                                break;
                            case 5: 
                                typeOfId = 'Passport';
                                break;
                            case 6: 
                                typeOfId = 'Department of Defense Identification Card';
                                break;
                            case 7: 
                                typeOfId = 'Green Card';
                                break;
                            default: 
                                typeOfId = '--';
                                break;
                        }

                        return {
                            applicantName: applications.firstName +' '+ applications.lastName,
                            socialSecurityNumber:applications.socialSecurityNumber ?applications.socialSecurityNumber:'--',
                            cellphone:applications.cellPhone ? applications.cellPhone:'--',
                            birthDay :applications.birthDay ? moment(applications.birthDay.substring(0, 10)).format('MM/DD/YYYY') : '--',
                            streetAddress:applications.streetAddress ? applications.streetAddress: '--',
                            zipCode:applications.zipCode ? applications.zipCode.substring(0, 5): '--',
                            city: applications.city ? applications.cityInfo.Name : '',
                            state: applications.state ? applications.stateInfo.Name : '',
                            hireDate: hireDate,
                            gender: gender,
                            //bankName:applications.Account ? applications.Account.bankName: '--',
                            //routing:applications.Account  ? applications.Account.routingNumber: '--',
                            //account:applications.Account  ? applications.Account.accountNumber: '--',
                            accounts: applications.Accounts,
                            car: applications.car ? 'YES' : 'NO', 
                            hotel: hotel,
                            source: this.getSource(applications.optionHearTumi, applications.nameReferences),
                            area:applications.area ? applications.area : '--',
                            typeOfId: typeOfId,
                            jobDescription: idealJob ? idealJob.description : '--',

                            expireDateId:applications.expireDateId ? moment(applications.expireDateId).format('MM/DD/YYYY'): '--',
                            marital: applications.marital === 2 ? "MARRIED" : "SINGLE",

                            numberId: applications.numberId ? applications.numberId : '--',
                            employmentType: applications.employmentType ? applications.employmentType : '--',
                            exemptions: applications.exemptions || '--'
                        }
                    });
                }
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to get summary information. Please, try again!',
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
                    contentHTML: '<html style="zoom: 50%; font-family: Arial, Helvetica, sans-serif;">' + document.getElementById('DocumentPDF').innerHTML + '</html>',
                    Name: "Summary-" + "-" + this.state.applicantName
                },
                fetchPolicy: 'no-cache'
            })
            .then(({data}) => {
                if (data.createdocumentspdf !== null) {
                    this.setState({
                        urlPDF: data.createdocumentspdf
                    }, () => {
                        this.downloadDocumentsHandler();
                        //this.updatePdfUrlSummary();
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
        var url = this.state.urlPDF; //this.context.baseUrl + '/public/Documents/' + "Summary-" + idv4 + "-" + this.state.applicantName + '.pdf';
        if(url) window.open(url, '_blank');
        this.setState({ downloading: false });
    };

    handlePdfDownload = () => {
        if(this.state.urlPDF)
            this.downloadDocumentsHandler();
        else
            this.createDocumentsPDF();
    }

    componentWillMount() {
        this.getInformation();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.applicationId != this.props.applicationId) {
            this.setState({
                applicationId: nextProps.applicationId
            });
        }
    }

    render() {
        const address = this.state.streetAddress !== '--' && this.state.zipCode !== '--' && this.state.city !== '--' ? `${this.state.streetAddress}, ${this.state.city}, ${this.state.state}, ${this.state.zipCode}` : '--';
        let appAccount = Array.isArray(this.state.accounts) && this.state.accounts.length ? this.state.accounts[0] : null; // Temporal para mostrar solo una cuenta
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
            <div className="Apply-container--application" style={{width:'900px', margin: '0 auto'}}>
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{applyTabs[11].label}</span>
                                {
                                    
                                            <div>
                                                {
                                                    this.state.id !== null ? (
                                                        <button className="applicant-card__edit-button" onClick={this.handlePdfDownload}>
                                                            {this.state.downloading && (
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
                                       
                                }
                            </div>
                            <div className="SummaryTab">
                                <div className="row pdf-container">
                                <div id="DocumentPDF" className="signature-information">
                                    {renderHTML(
                                        Document({
                                            applicantName: this.state.applicantName,
                                            socialSecurityNumber: this.state.socialSecurityNumber,
                                            cellphone: this.state.cellphone,
                                            gender: this.state.gender,
                                            birthDay: this.state.birthDay,
                                            address: address,
                                            hotel: this.state.hotel,
                                            jobDescription: this.state.jobDescription,
                                            hireDate: this.state.hireDate,
                                            employmentType: this.state.employmentType,
                                            marital: this.state.marital,
                                            exemptions: this.state.exemptions,
                                            source: this.state.source,
                                            accountNumber: appAccount ? appAccount.accountNumber : '--',
                                            bankName: appAccount ? appAccount.bankName : '--',
                                            routingNumber: appAccount ? appAccount.routingNumber : '--',
                                            numberId: this.state.numberId,
                                            typeOfId: this.state.typeOfId,
                                            expireDateId: this.state.expireDateId,
                                            car: this.state.car,
                                            area: this.state.area
                                        })
                                    )}
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    static contextTypes = {
        baseUrl: PropTypes.string
    };
}

export default withApollo(withGlobalContent(Summary));