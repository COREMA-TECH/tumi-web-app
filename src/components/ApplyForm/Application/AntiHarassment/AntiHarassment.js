import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import renderHTML from 'react-render-html';
import { CREATE_DOCUMENTS_PDF_QUERY, GET_ANTI_HARRASMENT_INFO, GET_APPLICANT_INFO } from "./Queries";
import { ADD_ANTI_HARASSMENT, UPDATE_ANTI_HARASSMENT } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import withApollo from "react-apollo/withApollo";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Button from "@material-ui/core/es/Button/Button";
import PropTypes from 'prop-types';

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

                if (data.applications[0].harassmentPolicy !== null) {
                    this.setState({
                        id: data.applications[0].harassmentPolicy.id,
                        signature: data.applications[0].harassmentPolicy.signature,
                        content: data.applications[0].harassmentPolicy.content,
                        applicantName: data.applications[0].harassmentPolicy.applicantName,
                        date: data.applications[0].harassmentPolicy.date,
                        urlPDF: data.applications[0].harassmentPolicy.pdfUrl
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

    insertAntiHarrasment = (item) => {
        let harassmentObject = Object.assign({}, item);
        delete harassmentObject.openSignature;
        delete harassmentObject.id;
        delete harassmentObject.accept;
        delete harassmentObject.urlPDF; // no es necesario en el crear

        this.props.client
            .mutate({
                mutation: ADD_ANTI_HARASSMENT,
                variables: {
                    harassmentPolicy: harassmentObject
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
                    id: data.addHarassmentPolicy[0].id
                })
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

    createDocumentsPDF = (idv4) => {
        this.setState(
            {
                downloading: true
            }
        )
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
                        loadingData: false
                    }, () => {
                        this.UpdatePdfUrlAntiHarrasment();
                        this.downloadDocumentsHandler();
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
        var url = this.state.urlPDF; //this.context.baseUrl + '/public/Documents/' + "Anti-Harrasment-" + idv4 + "-" + this.state.applicantName + '.pdf';
        window.open(url, '_blank');
        this.setState({ downloading: false });
    };


    componentWillMount() {
        this.getHarrasmentInformation(this.props.applicationId);
        this.getApplicantInformation(this.props.applicationId);
    }

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }

    handlePdfDownload = () => {
        if(this.state.urlPDF){
            this.downloadDocumentsHandler();
        }
        else {
            let idv4 = uuidv4();
            this.createDocumentsPDF(idv4);
        }
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
                                {
                                    this.state.id !== null ? (
                                        <button className="applicant-card__edit-button" onClick={this.handlePdfDownload}>
                                            {this.state.downloading && (
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
                                            }}>{actions[8].label} <i className="far fa-edit" />
                                            </button>
                                        )
                                }
                            </div>
                            <div className="">
                                <div id="DocumentPDF" className="signature-information">
                                    {renderHTML(`<div class="WordSection1">
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 1.75rem; text-align:center"><span style=" ">Anti-Harassment Policy</span></p>
<h1 style="font-size: 1rem; margin: 15.7pt 0in 0.0001pt 0pt; text-align: left;  ;"><u>Policy statement</u></h1>
<p style="margin: 0.35pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 13.0pt; ;">&nbsp;</span></strong></p>
<p style=" text-align: justify; line-height: 1.5;  ">TUMI STAFFING, INC. employees, contractors and others acting on behalf of TUMI STAFFING, INC. are entitled to respectful treatment in the workplace. Being respected means being treated honestly and professionally, with your unique talents and perspectives valued. A respectful workplace is about more than compliance with the law. It is a working environment that is free of inappropriate behavior of all kinds and harassment because of age, disability, marital status, race or color, national origin, religion, sex, sexual orientation or gender identity.</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">TUMI STAFFING, INC. employees, strive to create and maintain a work environment in which people are treated with dignity, decency and respect. The environment of the company should be characterized by mutual trust and the absence of intimidation, oppression and exploitation. Employees should be able to work and learn in a safe, yet stimulating atmosphere. The accomplishment of this goal is essential to the mission of the company. For that reason, TUMI STAFFING, INC. will not tolerate unlawful discrimination or harassment of any kind. Through enforcement of this policy and by education of employees, the company will seek to prevent, correct and discipline behavior that violates this policy.</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt;  ">&nbsp;</p>
<p style=" text-align: justify; line-height: 1.5;  ">All employees, regardless of their positions, are covered by and are expected to comply with this policy and to take appropriate measures to ensure that prohibited conduct does not occur. Appropriate disciplinary action will be taken against any employee who violates this policy. Based upon the seriousness of the offense, disciplinary action may include verbal or written reprimand, suspension or termination of employment.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem; text-align: left;   ;"><u>What it means:</u></h1>
<p style="margin: 0.35pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 13.0pt; ;">&nbsp;</span></strong></p>
<p style=" text-align: justify;  ">A respectful workplace</p>
<p style=" text-align: justify; line-height: 1.5;  ">TUMI STAFFING, INC. is committed to providing a workplace in which the dignity of every individual is respected. Each of us should understand that incidents of harassment and inappropriate behavior will not be tolerated at TUMI STAFFING, INC. or on our worksites.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem;  line-height: 206%;  ;">Prohibited Conduct under this Policy Discrimination</h1>
<p style=" text-align: justify; line-height: 1.5;  ">It is a violation of this policy to discriminate in the provision of employment opportunities, benefits or privileges; to create discriminatory work conditions; or to use discriminatory evaluative standards in employment if the basis of that discriminatory treatment is, in whole or in part, the person's race, color, national origin, age, religion, disability status, gender, sexual orientation, gender identity, genetic information or marital status.</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">Discrimination of this kind also may be strictly prohibited by a variety of federal, state and local laws, including Title VII of the Civil Rights Act 1964, the Age Discrimination Act of 1975, and the Americans With Disabilities Act of 1990. This policy is intended to comply with the prohibitions stated in these antidiscrimination laws.</p>
<p style="margin: 0.45pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style=" text-align: justify;  ">Discrimination in violation of this policy will be subject to severe sanctions up to and including termination.</p>
<p style="margin: 0.15pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 12.5pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem; text-align: left;   ;"><u>Harassment</u></h1>
<p style=" text-align: justify; line-height: 1.5;  ">Harassment is unwelcome conduct toward an individual because of his or her age, disability, marital status, national origin, race or color, religion, sex, sexual orientation or gender identity, when the conduct creates an intimidating, hostile or offensive work environment that:</p>
<p style="margin: 0.15pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<ul style="margin-bottom: 0in; margin-top: 0px; margin-left: 15pt;">
<li style="text-align: justify; font-size: 11pt; "><span style="font-size: 11.0pt;">Causes work performance to suffer; or</span></li>
<li style="text-align: justify; font-size: 11pt; "><span style="font-size: 11.0pt;">Negatively affects job opportunities.</span></li>
</ul>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 13.0pt;">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">Harassment is against the law in the United States and many other countries. Examples of harassment that may violate the law and will violate this policy include:</p>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<ul style="margin-bottom: 0in; margin-top: 0px; margin-left: 15pt">
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Oral or written communications that contain offensive name-calling, jokes, slurs, negative stereotyping, or threats. This includes comments or jokes that are distasteful or targeted at individuals or groups based on age, disability, marital status, national origin, race or color, religion, sex, sexual orientation or gender identity.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Nonverbal conduct, such as staring, leering and giving inappropriate gifts. Physical conduct, such as </span><span style="font-size: 11.0pt; line-height: 1.5;">assault or unwanted touching.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Visual images, such as derogatory or offensive pictures, cartoons, drawings or gestures. </span><span style="font-size: 11.0pt; line-height: 1.5;">Such prohibited images include those in hard copy or electronic form.</span></li>
</ul>
<p style="margin: 0.1pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.0pt;">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">Harassment, including sexual harassment, is prohibited by federal and state laws. This policy prohibits harassment of any kind, and the company will take appropriate action swiftly to address any violations of this policy. The definition of harassment is verbal or physical conduct designed to threaten, intimidate or coerce. Also, verbal taunting (including racial and ethnic slurs) that, in the employee's opinion, impairs his or her ability to perform his or her job.</p>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style=" text-align: justify; font-size: 11pt; "><em><span style="font-size: 11.0pt; ;">Examples of harassment are</span></em><span style="font-size: 11.0pt;">:</span></p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt;  "><span style="font-size: 12.5pt;">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">Verbal: Comments that are not flattering or are unwelcome regarding a person's nationality, origin, race, color, religion, gender, sexual orientation, age, body disability or appearance. Epithets, slurs, negative stereotyping.</p>
<p style="margin: 0.1pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<p style=" text-align: justify; line-height: 1.5;  ">Nonverbal: Distribution, display or discussion of any written or graphic material that ridicules, denigrates, insults, belittles, or shows hostility or aversion toward an individual or group because of national origin, race color, religion, age, gender, sexual orientation, pregnancy, appearance disability, gender identity, marital or other protected status.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem; text-align: left;   ;"><u>Sexual harassment</u></h1>
<p style="margin: 0.35pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 13.0pt; ;">&nbsp;</span></strong></p>
<p style=" text-align: left;  ">Sexual harassment is a form of harassment that is based on a person&apos;s sex or that is sex-based</p>
<p style=" text-align: justify; line-height: 1.5;  ">behavior. It is also sexual harassment for anyone in a position of authority to tie hiring, promotion, termination or any other condition of employment to a request or demand for</p>
<p style=" text-align: justify; line-height: 1.5;  ">sexual favors. Although having a consensual romantic relationship with another TUMI STAFFING, INC. employee is not harassment, harassment may occur as a result of the relationship if either person in the relationship engages in conduct in the workplace that is inappropriate or unwelcome.</p>
<p style="margin: 0.25pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem;   ;">Sexual Harassment</h1>
<h1 style="font-size: 1rem;   ;">&nbsp;</h1>
<h1 style="font-size: 1rem;   ;"><span style=" font-weight: normal;">Sexual harassment in any form is prohibited under this policy. Sexual harassment is a form of discrimination and is unlawful under Title VII of the Civil Rights Act of 1964.</span></h1>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">Sexual harassment includes unsolicited and unwelcome sexual advances, requests for sexual favors, or other verbal or physical conduct of a sexual nature, when such conduct:</p>
<p style="margin: 0.25pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<ul style="margin-top: 0in; margin-bottom: .0001pt; margin-left:15pt">
<li style="list-style: outside none none; margin: 0in 0in 0.0001pt 0px; text-align: justify; font-size: 11pt; ">
<ul style="margin-top: 0in; margin-bottom: .0001pt;">
<li style="margin: 0in 0in 0.0001pt 0px; text-align: justify; font-size: 11pt; "><span style="font-size: 11.0pt;">Is made explicitly or implicitly a term or condition of employment.</span></li>
<li style="margin: 0.45pt 0in 0.0001pt 0px; text-align: justify; font-size: 11pt; "><span style="font-size: 11.0pt;">Is used as a basis for an employment decision.</span></li>
<li style="margin: 0.25pt 16.35pt 0.0001pt 0px; text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Unreasonably interferes with an employee's work performance or creates an intimidating, hostile </span><span style="font-size: 11.0pt; line-height: 1.5;">or otherwise offensive environment.</span></li>
</ul>
</li>
</ul>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">Sexual harassment does not refer to behavior or occasional compliments of a socially acceptable nature. It refers to behavior that is unwelcome, that is personally offensive, that lowers morale and therefore interferes with work effectiveness. Sexual harassment may take different forms.</p>
<p style="margin: 0.55pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style=" text-align: justify; font-size: 11pt; "><em><span style="font-size: 11.0pt; ;">Examples of conduct that may constitute sexual harassment are:</span></em></p>
<p style="margin: 0.35pt 0in 0.0001pt; text-align: justify;  "><em><span style=";">&nbsp;</span></em></p>
<ul style="margin-top: 0.05pt; margin-bottom: 0in; margin-left:15pt">
<li style=" text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Verbal: Sexual innuendoes, suggestive comments, jokes of a sexual nature, sexual propositions, lewd remarks, threats. Requests for any type of sexual favor (this includes repeated, unwelcome requests </span><span style="font-size: 11.0pt; line-height: 1.5;">for dates). Verbal abuse or "kidding" that is oriented toward a prohibitive form of harassment, including that which is sex oriented and considered unwelcome.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Nonverbal: The distribution, display or discussion of any written or graphic material, including </span><span style="font-size: 11.0pt; line-height: 1.5;">calendars, posters and cartoons that are sexually suggestive or show hostility toward an individual or group because of sex; suggestive or insulting sounds; leering; staring; whistling; obscene gestures; content in letters and notes, facsimiles, email, photos, text messages, Internet postings, etc., that is </span><span style="font-size: 11.0pt; line-height: 1.5;">sexual in nature.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Physical: Unwelcome, unwanted physical contact, including but not limited to touching, tickling, pinching, patting, brushing up against, hugging, cornering, kissing, fondling; forced sexual intercourse </span><span style="font-size: 11.0pt; line-height: 1.5;">or assault.</span></li>
</ul>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.0pt;">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">Normal, courteous, mutually respectful, pleasant, non-coercive interactions between employees, including men and women, that are acceptable to and welcomed by both parties, are not considered to be harassment, including sexual harassment.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem; text-align: left;   ;"><u>Inappropriate behavior</u></h1>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 13.0pt; ;">&nbsp;</span></strong></p>
<p style="text-align: justify; line-height: 1.5;  ">Our goal is to have a work environment where we all treat each other respectfully and professionally. Any unprofessional or disrespectful behavior, even if not illegal, interferes with that goal and will not be tolerated. TUMI STAFFING, INC. reserves the right to respond to inappropriate behavior even where no one has complained or indicated they have been offended.</p>
<p style="margin: 0.55pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<p style=" text-align: justify;  ">Performance feedback is not harassment or inappropriate behavior</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 13.0pt;">&nbsp;</span></p>
<p style="text-align: justify; line-height: 1.5;  ">Effective leadership requires that managers talk with their employees about their job performance. Managers should be clear about how each employee is performing and how the employee &apos;s overall behavior contributes to the workgroup &apos;s ability to deliver results consistent</p>
</div>
<p><span style="font-size: 11.0pt; line-height: 1.5; ">&nbsp;</span></p>
<div class="WordSection2">
<p style=" text-align: justify; line-height: 1.5;  ">with the values of TUMI STAFFING, INC.. Such discussions may be difficult and they always should be done professionally and respectfully. However, constructive criticism and supervisory actions regarding performance deficiencies or other workplace issues are not harassment or retaliation.</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt;  "><span style="font-size: 12.5pt;">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">Every TUMI STAFFING, INC. employee and contractor has a role to play in achieving a respectful workplace:</p>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<ul style="margin-bottom: 0in; margin-top: 0px; margin-left:15pt">
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">TUMI STAFFING, INC. expects respectful and professional behavior at all times, no matter the situation. Remember that your actions reflect upon you, and potentially reflect upon TUMI STAFFING, INC. Be sensitive to how others may perceive your actions. Just because someone does not complain to you </span><span style="font-size: 11.0pt; line-height: 1.5;">does not mean that they don&apos;t object to your behavior.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">There is no reason to ever engage in unwelcome behavior that has the purpose or effect of harassing others. Report any unwelcome behavior you think might be harassment </span><span style="font-size: 11.0pt; line-height: 1.5;">under this policy.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Be open to constructive feedback regarding performance deficiencies. Recognize that </span><span style="font-size: 11.0pt; line-height: 1.5;">respectful supervisory actions regarding workplace issues are a necessary and </span><span style="font-size: 11.0pt; line-height: 1.5;">appropriate step in performance feedback.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">If someone offends you, let that person know so that it won&apos;t happen again. If you have offended someone, understand his or her perspective, apologize and don &apos;t let it happen </span><span style="font-size: 11.0pt; line-height: 1.5;">again.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">If you are aware of any behavior that might violate this policy, report it to your manager </span><span style="font-size: 11.0pt; line-height: 1.5;">or supervisor or to the TUMI STAFFING, INC. Human Resources Department.</span></li>
</ul>
<p style="text-align: justify; margin: 0in 0in 0.0001pt;  "><span style="font-size: 11.0pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem; text-align: left;"><u>What to avoid</u></h1>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 9.0pt; ;">&nbsp;</span></strong></p>
<ul style="margin-top: 4.35pt; margin-bottom: .0001pt; margin-left: 15pt">
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Any behavior that is unprofessional or disrespectful, or that has the purpose or effect of </span><span style="font-size: 11.0pt; line-height: 1.5;">harassing anyone.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Any retaliation against someone who raises a concern or potential violation under this </span><span style="font-size: 11.0pt; line-height: 1.5;">policy.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Missed opportunities to respectfully communicate to someone that you found his or her </span><span style="font-size: 11.0pt; line-height: 1.5;">behavior offensive.</span></li>
<li style="text-align: justify; line-height: 14.35pt; font-size: 11pt; "><span style="font-size: 11.0pt;">Unreported concerns or violations of this policy.</span></li>
</ul>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<h1 style="font-size: 1rem; text-align: left;   ;"><u>How to report a violation</u></h1>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 13.0pt; ;">&nbsp;</span></strong></p>
<p style="text-align: justify; line-height: 1.5;  ">Most reports of suspected violations of this policy are made to TUMI STAFFING, INC.&apos;s Human Resources. You can contact your local Manager, or go to someone higher in the organization. You can also use any of the additional reporting options listed in the If You Have a Business Conduct Concern section of this website/manual, if you prefer.</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<h1 style="font-size: 1rem; text-align: left;   ;"><u>How TUMI STAFFING, INC. will respond</u></h1>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 13.0pt; ;">&nbsp;</span></strong></p>
<p style=" text-align: justify;  ">Investigation and response</p>
<p style="margin: 0.15pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 13.0pt;">&nbsp;</span></p>
<p style=" text-align: justify;  ">If you report a complaint of harassment or inappropriate behavior, TUMI STAFFING, INC. will</p>
</div>
<div class="WordSection3">
<p style=" text-align: justify; line-height: 1.5;  ">investigate your concerns. Where there has been a violation of policy, TUMI STAFFING, INC. will take appropriate action to try to avoid future violations. In appropriate cases, TUMI STAFFING, INC. may take disciplinary action (up to and including immediate termination) against those violating the Harassment Policy.</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt;  "><span style="font-size: 12.5pt;">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">TUMI STAFFING, INC. will inform parties about the status of reviewing their complaints. To respect the privacy and confidentiality of all people involved, 3M might not share specific details of the discipline or other action taken.</p>
<p style="margin: 0.45pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<h1 style="font-size: 1rem; text-align: left;   ;"><u>TUMI STAFFING, INC. management responsibility</u></h1>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 13.0pt; ;">&nbsp;</span></strong></p>
<p style=" text-align: justify; line-height: 1.5;  ">Every TUMI STAFFING, INC. supervisor and manager is responsible for ensuring that TUMI STAFFING, INC. provides a workplace free of harassment and inappropriate behavior and that complaints are handled promptly and effectively. With the assistance of Human Resources, TUMI STAFFING, INC. management must inform their organizations about the policy, promptly investigate allegations of harassment, take appropriate disciplinary action, and take steps to assure retaliation is prohibited.</p>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem; text-align: left;   ;">Confidentiality</h1>
<p style="margin: 0.25pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 12.5pt; ;">&nbsp;</span></strong></p>
<p style=" text-align: justify; line-height: 1.5;  ">During the complaint process, while the confidentiality of the information received, the privacy of the individuals involved, and the wishes of the complaining person regarding action by the office cannot be guaranteed in every instance, they will be protected to as great a degree as is legally possible. The expressed wishes of the complaining person for confidentiality will be considered in the context of the company&apos;s legal obligation to act upon the charge and the right of the charged party to obtain information. In most cases, however, confidentiality will be strictly maintained by the company and those involved in the investigation. In addition, any notes or documents written by or received by the person(s) conducting the investigation will be kept confidential to the extent possible and according to any existing state or federal law.</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem;  text-align: left;  ;">Complaint Procedure</h1>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 12.5pt; ;">&nbsp;</span></strong></p>
<p style=" text-align: justify; line-height: 1.5;  ">The following complaint procedure will be followed in order to address a complaint regarding harassment, discrimination or retaliation.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.5pt;">&nbsp;</span></p>
<ul style="margin-bottom: 0in; margin-top: 0px; margin-left:15pt">
<li style="text-align: justify; line-height: 1.5;  font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">A person who feels harassed, discriminated or retaliated against may initiate the complaint process by filing a written and signed complaint with the HR director. No formal action will be taken against any person under this policy unless a written and signed complaint is on file containing sufficient details to </span><span style="font-size: 11.0pt; line-height: 1.5;">allow the HR director to determine if the policy may have been violated. The complainant (the employee making the complaint) may use the complaint form, which is attached to this policy. If a </span><span style="font-size: 11.0pt; line-height: 1.5;">supervisor or manager becomes aware that harassment or discrimination is occurring, either from personal observation or as a result of an employee coming forward, the supervisor or manager should </span><span style="font-size: 11.0pt; line-height: 1.5;">immediately report it to the HR director.</span></li>
<li style="text-align: justify; line-height: 1.5;  font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Upon receiving the complaint, or being advised by a supervisor or manager that violation of this policy </span><span style="font-size: 11.0pt; line-height: 1.5;">may be occurring, the HR director will notify the company, and review the complaint with the company&apos;s legal counsel.</span></li>
<li style="text-align: justify; line-height: 14.35pt; font-size: 11pt; "><span style="font-size: 11.0pt;">Within five (5) working days of receiving the complaint, the HR director will:</span>
    <dl>
        <dd style="text-align: justify;">- Notify the person(s) charged [hereafter referred to as "respondent(s)"] of a complaint.</dd>
        <dd style="text-align: justify; line-height: 1.5;">- Initiate the investigation to determine whether there is a reasonable basis for believing that the alleged violation of this policy occurred.</dd>
    </dl>
</li>
</ul>
</div>
<div class="WordSection4">
<ul style="margin-top: 3.15pt; margin-bottom: 0in; margin-left:15pt">
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">During the investigation, the HR director, together with legal counsel or other management employee, will interview the complainant, the respondent and any witnesses to determine whether the alleged </span><span style="font-size: 11.0pt; line-height: 1.5;">conduct occurred.</span></li>
<li style="text-align: justify; line-height: 1.5; font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Within 15 business days of the complaint being filed (or the matter being referred to the HR director), the HR director or other person conducting the investigation will conclude the investigation and submit </span><span style="font-size: 11.0pt; line-height: 1.5;">a report of his or her findings to the company.</span></li>
<li style="text-align: justify; line-height: 1.5;  font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">If it is determined that harassment or discrimination in violation of this company&apos;s policy has occurred, the HR director will recommend appropriate disciplinary action. The appropriate action will depend on the following factors: (i) The severity, frequency and pervasiveness of the conduct; (ii) Prior complaints made by the complainant; (iii) Prior complaints made against the respondent; (iv) The quality of the </span><span style="font-size: 11.0pt; line-height: 1.5;">evi</span><span style="font-size: 11.0pt; line-height: 1.5;">d</span><span style="font-size: 11.0pt; line-height: 1.5;">en</span><span style="font-size: 11.0pt; line-height: 1.5;">c</span><span style="font-size: 11.0pt; line-height: 1.5;">e</span> <span style="font-size: 11.0pt; line-height: 1.5;">(</span><span style="font-size: 11.0pt; line-height: 1.5;">f</span><span style="font-size: 11.0pt; line-height: 1.5;">i</span><span style="font-size: 11.0pt; line-height: 1.5;">rs</span><span style="font-size: 11.0pt; line-height: 1.5;">t</span><span style="font-size: 11.0pt; line-height: 1.5;">-</span><span style="font-size: 11.0pt; line-height: 1.5;">h</span><span style="font-size: 11.0pt; line-height: 1.5;">an</span><span style="font-size: 11.0pt; line-height: 1.5;">d</span> <span style="font-size: 11.0pt; line-height: 1.5;">k</span><span style="font-size: 11.0pt; line-height: 1.5;">n</span><span style="font-size: 11.0pt; line-height: 1.5;">o</span><span style="font-size: 11.0pt; line-height: 1.5;">w</span><span style="font-size: 11.0pt; line-height: 1.5;">l</span><span style="font-size: 11.0pt; line-height: 1.5;">e</span><span style="font-size: 11.0pt; line-height: 1.5;">d</span><span style="font-size: 11.0pt; line-height: 1.5;">g</span><span style="font-size: 11.0pt; line-height: 1.5;">e</span><span style="font-size: 11.0pt; line-height: 1.5;">,</span> <span style="font-size: 11.0pt; line-height: 1.5;">c</span><span style="font-size: 11.0pt; line-height: 1.5;">r</span><span style="font-size: 11.0pt; line-height: 1.5;">e</span><span style="font-size: 11.0pt; line-height: 1.5;">dibl</span><span style="font-size: 11.0pt; line-height: 1.5;">e</span> <span style="font-size: 11.0pt; line-height: 1.5;">c</span><span style="font-size: 11.0pt; line-height: 1.5;">o</span><span style="font-size: 11.0pt; line-height: 1.5;">rr</span><span style="font-size: 11.0pt; line-height: 1.5;">o</span><span style="font-size: 11.0pt; line-height: 1.5;">b</span><span style="font-size: 11.0pt; line-height: 1.5;">o</span><span style="font-size: 11.0pt; line-height: 1.5;">r</span><span style="font-size: 11.0pt; line-height: 1.5;">ati</span><span style="font-size: 11.0pt; line-height: 1.5;">o</span><span style="font-size: 11.0pt; line-height: 1.5;">n</span> <span style="font-size: 11.0pt; line-height: 1.5;">etc</span><span style="font-size: 11.0pt; line-height: 1.5;">.</span><span style="font-size: 11.0pt; line-height: 1.5;">)</span><span style="font-size: 11.0pt; line-height: 1.5;">.</span></li>
<li style="text-align: justify; line-height: 1.5;  font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">If the investigation is inconclusive or it is determined that there has been no harassment or discrimination in violation of this policy, but some potentially problematic conduct is revealed, preventative action may be taken.</span></li>
<li style="text-align: justify; line-height: 1.5;  font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Within five (5) days after the investigation is concluded, the HR director will meet with the complainant and the respondent separately in order to notify them in person of the findings of the investigation and </span><span style="font-size: 11.0pt; line-height: 1.5;">to inform them of the action being recommended by the HR director.</span></li>
<li style="text-align: justify; line-height: 1.5;  font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">The complainant and the respondent may submit statements to the HR director challenging the factual basis of the findings. Any such statement must be submitted no later than five (5) working days after </span><span style="font-size: 11.0pt; line-height: 1.5;">the meeting with the HR director in which the findings of the investigation is discussed.</span></li>
<li style="text-align: justify; line-height: 1.5;  font-size: 11pt; "><span style="font-size: 11.0pt; line-height: 1.5;">Within 10 days from the date the HR director meets with the complainant and respondent, the </span><span style="font-size: 11.0pt; line-height: 1.5;">company will review the investigative report and any statements submitted by the complainant or respondent, discuss results of the investigation with the HR director and other management staff as </span><span style="font-size: 11.0pt; line-height: 1.5;">may be appropriate and decide what action, if any, will be taken. The HR director will report the </span><span style="font-size: 11.0pt; line-height: 1.5;">company&apos;s decision to the complainant, the respondent and the appropriate management assigned to the department(s) in which the complainant and the respondent work. The company&apos;s decision will be </span><span style="font-size: 11.0pt; line-height: 1.5;">in writing and will include finding of fact and a statement for or against disciplinary action. If disciplinary action is to be taken, the sanction will be stated.</span></li>
</ul>
<h1 style="font-size: 1rem; margin: 11.55pt 0in 0.0001pt 5.2pt; text-align: left;  ;"><u>Retaliation is prohibited</u></h1>
<p style="margin: 0.35pt 0in 0.0001pt; text-align: justify;  "><strong><span style="font-size: 13.0pt; ;">&nbsp;</span></strong></p>
<p style="text-align: justify; line-height: 1.5;  ">This policy strictly prohibits any retaliation against an employee or other person who reports a concern about harassment or other inappropriate behavior.</p>
<p style="margin: 0.45pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<h1 style="font-size: 1rem; margin: 0in 0in 0.0001pt 7.95pt; text-align: left;  ;">Our Policy:</h1>
<p style=" text-align: justify; line-height: 1.5;  ">TUMI STAFFING, INC. strictly prohibits any form of retaliation against an employee who in good faith makes a complaint, raises a concern, provides information or otherwise assists in an investigation or proceeding regarding any conduct that he or she reasonably believes to be in violation of TUMI STAFFING, INC. Code of Conduct or policies, or applicable laws, rules or regulations. This policy is designed to ensure that all employees feel comfortable speaking up when they see or suspect illegal or unethical conduct without fear of retaliation. It is also intended to encourage all employees to cooperate with TUMI STAFFING, INC. in the internal investigation of any matter by providing honest, truthful and complete information without fear of retaliation.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<h1 style="font-size: 1rem;  text-align: left;  ;">Details:</h1>
<p style=" text-align: justify; line-height: 1.5;  ">No employee should be discharged, demoted, suspended, threatened, harassed, intimidated, coerced, or retaliated against in any other manner as a result of his or her making a good faith complaint or assisting in the handling or investigation of a good faith complaint, that a TUMI STAFFING, INC. policy, the Code of</p>
</div>
<p><span style="font-size: 11.0pt; line-height: 1.5; ">&nbsp;</span></p>
<p style=" text-align: justify; line-height: 1.5;  ">Conduct, or an applicable law, rule or regulation has been violated. Employees who in good faith make a complaint or participate in an investigation or proceeding under this policy, however, remain subject to the same standards of performance and conduct as other employees. Company prohibits employees from being retaliated against even if their complaints are proven unfounded by an investigation, unless the employee knowingly made a false allegation, provided false or misleading information in the course of an investigation, or otherwise acted in bad faith. Employees have an obligation to participate in good faith in any internal investigation of retaliation. Company takes all complaints of retaliation very seriously. All such complaints will be reviewed promptly and, where appropriate, investigated.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify;  ">&nbsp;</p>
<h1 style="font-size: 1rem;  text-align: left;  ;">Reporting Violations:</h1>
<p style=" text-align: justify; line-height: 1.5;  ">If you believe you have been retaliated against or that any other violation of this policy has occurred, or if you have questions concerning this policy, you must immediately notify Human Resources, your immediate manager, or any other person as outlined in the Open Door policy. You may also call the Company phone line at<u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </u>.</p>
<p style="margin: 0.1pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 12.5pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem; text-align: left;   ;">Remedy:</h1>
<p style="margin: 0.85pt 34.85pt 0.0001pt 5.2pt; text-align: justify; line-height: 118%;  ">Any employee who violates this policy is subject to disciplinary action, up to and including termination of employment.</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt;  "><span style="font-size: 14.0pt;">&nbsp;</span></p>
<p style="margin: 0.25pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 17.5pt;">&nbsp;</span></p>
<h1 style="font-size: 1rem; text-align: left;   ;"><u>Employee Acknowledgment</u></h1>
<p style="text-align: justify; margin: 0in 0in 0.0001pt;  "><strong><span style="font-size: 9.0pt; ;">&nbsp;</span></strong></p>
<p style="margin: 5.3pt 83.2pt 0.0001pt 5.2pt; text-align: justify; line-height: 1.5;  ">I understand compliance with the Non-Discrimination policy is a condition of my employment with TUMI STAFFING, INC., and I agree to abide by the above policy.</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt;  "><span style="font-size: 14.0pt;">&nbsp;</span></p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt;  "><span style="font-size: 14.0pt;">&nbsp;</span></p>
<p style="margin: 0.1pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.0pt;">&nbsp;</span></p>
<p style=" text-align: justify;  ">Employee Name (printed)&nbsp;&nbsp;&nbsp; <u>` + this.state.applicantName + `</u></p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt;  "><span style="font-size: 10.0pt; ">&nbsp;</span></p>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.0pt; ">&nbsp;</span></p>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify;  "><span style="font-size: 11.0pt; ">&nbsp;</span></p>

<p style="margin: 0.15pt 0in 0.0001pt;   text-align: justify;"><span style="font-size: 9.5pt;">&nbsp;&nbsp;&nbsp;<u><img src="` + this.state.signature + `" alt="" width="150" height="auto" style="zoom: 1.7" /></u> &nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </span></p>
<p style="margin: 0in 0in 0.0001pt 5pt; line-height: 13.7pt;   text-align: justify;">Signature of Employee&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</p>
<p style="margin: 0in 0in 0.0001pt;   text-align: justify;"><span style="font-size: 10.0pt;">&nbsp;</span></p>
<p style="margin: 0.15pt 0in 0.0001pt;   text-align: justify;"><span style="font-size: 9.5pt;">&nbsp;&nbsp;&nbsp;&nbsp; <u>` + this.state.date.substring(0, 10) + `</u></span></p>
<p style="margin: 0in 0in 0.0001pt 5pt; line-height: 13.7pt;   text-align: justify;"> Date Signed</p>`)}</div>
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
