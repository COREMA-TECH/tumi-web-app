import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import renderHTML from 'react-render-html';
import { GET_APPLICANT_INFO, GET_ANTI_HARRASMENT_INFO } from "./Queries";
import { ADD_ANTI_HARASSMENT } from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import withApollo from "react-apollo/withApollo";

class AntiHarassment extends Component {
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

    componentWillMount() {
        this.getHarrasmentInformation(this.props.applicationId);
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
                        <SignatureForm
                            applicationId={this.state.applicationId}
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
                                <span className="applicant-card__title">Anti-Harassment</span>
                                {
                                    this.state.id !== null ? (
                                        <button className="applicant-card__edit-button">
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
                                <div className="signature-information">
                                    {renderHTML(`<div class="WordSection1">
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 18.0pt; font-family: Calibri, sans-serif;">Anti--‐Harassment Policy</span></p>
<h1 style="margin: 15.7pt 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>Policy statement</u></h1>
<p style="margin: 0.35pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 13.0pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0in 5.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">TUMI STAFFING, INC. employees, contractors and others acting on behalf of TUMI STAFFING, INC. are entitled to respectful treatment in the workplace. Being respected means being treated honestly and professionally, with your unique talents and perspectives valued. A respectful workplace is about more than compliance with the law. It is a working environment that is free of inappropriate behavior of all kinds and harassment because of age, disability, marital status, race or color, national origin, religion, sex, sexual orientation or gender identity.</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style="margin: 0in 5.55pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">TUMI STAFFING, INC. employees, strive to create and maintain a work environment in which people are treated with dignity, decency and respect. The environment of the company should be characterized by mutual trust and the absence of intimidation, oppression and exploitation. Employees should be able to work and learn in a safe, yet stimulating atmosphere. The accomplishment of this goal is essential to the mission of the company. For that reason, TUMI STAFFING, INC. will not tolerate unlawful discrimination or harassment of any kind. Through enforcement of this policy and by education of employees, the company will seek to prevent, correct and discipline behavior that violates this policy.</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<p style="margin: 0in 5.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">All employees, regardless of their positions, are covered by and are expected to comply with this policy and to take appropriate measures to ensure that prohibited conduct does not occur. Appropriate disciplinary action will be taken against any employee who violates this policy. Based upon the seriousness of the offense, disciplinary action may include verbal or written reprimand, suspension or termination of employment.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>What it means:</u></h1>
<p style="margin: 0.35pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 13.0pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0in 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">A respectful workplace</p>
<p style="margin: 0.7pt 5.65pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">TUMI STAFFING, INC. is committed to providing a workplace in which the dignity of every individual is respected. Each of us should understand that incidents of harassment and inappropriate behavior will not be tolerated at TUMI STAFFING, INC. or on our worksites.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="margin: 0in 284.85pt 0.0001pt 5.2pt; line-height: 206%; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">Prohibited Conduct under this Policy Discrimination</h1>
<p style="margin: 0.05pt 5.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">It is a violation of this policy to discriminate in the provision of employment opportunities, benefits or privileges; to create discriminatory work conditions; or to use discriminatory evaluative standards in employment if the basis of that discriminatory treatment is, in whole or in part, the person's race, color, national origin, age, religion, disability status, gender, sexual orientation, gender identity, genetic information or marital status.</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style="margin: 0in 5.55pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Discrimination of this kind also may be strictly prohibited by a variety of federal, state and local laws, including Title VII of the Civil Rights Act 1964, the Age Discrimination Act of 1975, and the Americans With Disabilities Act of 1990. This policy is intended to comply with the prohibitions stated in these antidiscrimination laws.</p>
<p style="margin: 0.45pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style="margin: 0in 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Discrimination in violation of this policy will be subject to severe sanctions up to and including termination.</p>
<p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.5pt;">&nbsp;</span></p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>&nbsp;</u></h1>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>&nbsp;</u></h1>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>&nbsp;</u></h1>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>&nbsp;</u></h1>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>&nbsp;</u></h1>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>Harassment</u></h1>
<p style="margin: 4.25pt 83.2pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Harassment is unwelcome conduct toward an individual because of his or her age, disability, marital status, national origin, race or color, religion, sex, sexual orientation or gender identity, when the conduct creates an intimidating, hostile or offensive work environment that:</p>
<p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<ul style="margin-bottom: 0in; margin-top: 0px;">
<li style="margin: 0in 0in 0.0001pt 6.9333px; text-align: justify; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt;">Causes work performance to suffer; or</span></li>
<li style="margin: 0.45pt 0in 0.0001pt 6.9333px; text-align: justify; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt;">Negatively affects job opportunities.</span></li>
</ul>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 13.0pt;">&nbsp;</span></p>
<p style="margin: 0in 107.75pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Harassment is against the law in the United States and many other countries. Examples of harassment that may violate the law and will violate this policy include:</p>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<ul style="margin-bottom: 0in; margin-top: 0px;">
<li style="margin: 0in 90.8pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Or</span><span style="font-size: 12.0pt; line-height: 105%;">al</span> <span style="font-size: 12.0pt; line-height: 105%;">o</span><span style="font-size: 12.0pt; line-height: 105%;">r</span> <span style="font-size: 12.0pt; line-height: 105%;">w</span><span style="font-size: 12.0pt; line-height: 105%;">r</span><span style="font-size: 12.0pt; line-height: 105%;">i</span><span style="font-size: 12.0pt; line-height: 105%;">tte</span><span style="font-size: 12.0pt; line-height: 105%;">n</span> <span style="font-size: 12.0pt; line-height: 105%;">c</span><span style="font-size: 12.0pt; line-height: 105%;">o</span><span style="font-size: 12.0pt; line-height: 105%;">mmuni</span><span style="font-size: 12.0pt; line-height: 105%;">c</span><span style="font-size: 12.0pt; line-height: 105%;">ati</span><span style="font-size: 12.0pt; line-height: 105%;">o</span><span style="font-size: 12.0pt; line-height: 105%;">n</span><span style="font-size: 12.0pt; line-height: 105%;">s</span> <span style="font-size: 12.0pt; line-height: 105%;">th</span><span style="font-size: 12.0pt; line-height: 105%;">at</span> <span style="font-size: 12.0pt; line-height: 105%;">c</span><span style="font-size: 12.0pt; line-height: 105%;">o</span><span style="font-size: 12.0pt; line-height: 105%;">n</span><span style="font-size: 12.0pt; line-height: 105%;">tai</span><span style="font-size: 12.0pt; line-height: 105%;">n</span> <span style="font-size: 12.0pt; line-height: 105%;">o</span><span style="font-size: 12.0pt; line-height: 105%;">ff</span><span style="font-size: 12.0pt; line-height: 105%;">e</span><span style="font-size: 12.0pt; line-height: 105%;">n</span><span style="font-size: 12.0pt; line-height: 105%;">s</span><span style="font-size: 12.0pt; line-height: 105%;">i</span><span style="font-size: 12.0pt; line-height: 105%;">v</span><span style="font-size: 12.0pt; line-height: 105%;">e</span> <span style="font-size: 12.0pt; line-height: 105%;">n</span><span style="font-size: 12.0pt; line-height: 105%;">ame</span><span style="font-size: 12.0pt; line-height: 105%;">-&shy;‐</span><span style="font-size: 12.0pt; line-height: 105%;">c</span><span style="font-size: 12.0pt; line-height: 105%;">al</span><span style="font-size: 12.0pt; line-height: 105%;">lin</span><span style="font-size: 12.0pt; line-height: 105%;">g</span><span style="font-size: 12.0pt; line-height: 105%;">,</span> <span style="font-size: 12.0pt; line-height: 105%;">jo</span><span style="font-size: 12.0pt; line-height: 105%;">k</span><span style="font-size: 12.0pt; line-height: 105%;">e</span><span style="font-size: 12.0pt; line-height: 105%;">s</span><span style="font-size: 12.0pt; line-height: 105%;">,</span> <span style="font-size: 12.0pt; line-height: 105%;">s</span><span style="font-size: 12.0pt; line-height: 105%;">lu</span><span style="font-size: 12.0pt; line-height: 105%;">r</span><span style="font-size: 12.0pt; line-height: 105%;">s</span><span style="font-size: 12.0pt; line-height: 105%;">, </span><span style="font-size: 12.0pt; line-height: 105%;">negative stereotyping, or threats. This includes comments or jokes that are distasteful or targeted at individuals or groups based on age, disability, marital status, national </span><span style="font-size: 12.0pt; line-height: 105%;">origin, race or color, religion, sex, sexual orientation or gender identity.</span></li>
<li style="margin: 0in 5.65pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Nonverbal conduct, such as staring, leering and giving inappropriate gifts. Physical conduct, such as </span><span style="font-size: 12.0pt; line-height: 105%;">assault or unwanted touching.</span></li>
<li style="margin: 0in 83.85pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Visual images, such as derogatory or offensive pictures, cartoons, drawings or gestures. </span><span style="font-size: 12.0pt; line-height: 105%;">Such prohibited images include those in hard copy or electronic form.</span></li>
</ul>
<p style="margin: 0.1pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.0pt;">&nbsp;</span></p>
<p style="margin: 0in 5.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Harassment, including sexual harassment, is prohibited by federal and state laws. This policy prohibits harassment of any kind, and the company will take appropriate action swiftly to address any violations of this policy. The definition of harassment is verbal or physical conduct designed to threaten, intimidate or coerce. Also, verbal taunting (including racial and ethnic slurs) that, in the employee's opinion, impairs his or her ability to perform his or her job.</p>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style="margin: 0in 0in 0.0001pt 5.2pt; text-align: justify; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><em><span style="font-size: 12.0pt; font-family: 'Trebuchet MS', sans-serif;">Examples of harassment are</span></em><span style="font-size: 12.0pt;">:</span></p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.5pt;">&nbsp;</span></p>
<p style="margin: 0.05pt 5.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Verbal: Comments that are not flattering or are unwelcome regarding a person's nationality, origin, race, color, religion, gender, sexual orientation, age, body disability or appearance. Epithets, slurs, negative stereotyping.</p>
<p style="margin: 0.1pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<p style="margin: 0in 5.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Nonverbal: Distribution, display or discussion of any written or graphic material that ridicules, denigrates, insults, belittles, or shows hostility or aversion toward an individual or group because of national origin, race color, religion, age, gender, sexual orientation, pregnancy, appearance disability, gender identity, marital or other protected status.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>Sexual harassment</u></h1>
<p style="margin: 0.35pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 13.0pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0in 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Sexual harassment is a form of harassment that is based on a person&rsquo;s sex or that is sex-&shy;‐based</p>
<p style="margin: 0.7pt 5.65pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">behavior. It is also sexual harassment for anyone in a position of authority to tie hiring, promotion, termination or any other condition of employment to a request or demand for</p>
<p style="margin: 0in 5.65pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">sexual favors. Although having a consensual romantic relationship with another TUMI STAFFING, INC. employee is not harassment, harassment may occur as a result of the relationship if either person in the relationship engages in conduct in the workplace that is inappropriate or unwelcome.</p>
<p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</h1>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</h1>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</h1>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</h1>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</h1>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</h1>
<h1 style="margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">Sexual Harassment</h1>
<h1 style="margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</h1>
<h1 style="margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-family: 'DejaVu Sans', sans-serif; font-weight: normal;">Sexual harassment in any form is prohibited under this policy. Sexual harassment is a form of discrimination and is unlawful under Title VII of the Civil Rights Act of 1964.</span></h1>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style="margin: 0in 4.9pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Sexual harassment includes unsolicited and unwelcome sexual advances, requests for sexual favors, or other verbal or physical conduct of a sexual nature, when such conduct:</p>
<p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<ul style="margin-top: 0in; margin-bottom: .0001pt;">
<li style="list-style: outside none none; margin: 0in 0in 0.0001pt 0px; text-align: justify; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;">
<ul style="margin-top: 0in; margin-bottom: .0001pt;">
<li style="margin: 0in 0in 0.0001pt 0px; text-align: justify; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt;">Is made explicitly or implicitly a term or condition of employment.</span></li>
<li style="margin: 0.45pt 0in 0.0001pt 0px; text-align: justify; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt;">Is used as a basis for an employment decision.</span></li>
<li style="margin: 0.25pt 16.35pt 0.0001pt 0px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Unreasonably interferes with an employee's work performance or creates an intimidating, hostile </span><span style="font-size: 12.0pt; line-height: 105%;">or otherwise offensive environment.</span></li>
</ul>
</li>
</ul>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style="margin: 0in 5.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Sexual harassment does not refer to behavior or occasional compliments of a socially acceptable nature. It refers to behavior that is unwelcome, that is personally offensive, that lowers morale and therefore interferes with work effectiveness. Sexual harassment may take different forms.</p>
<p style="margin: 0.55pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<p style="margin: 0in 0in 0.0001pt 5.2pt; text-align: justify; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><em><span style="font-size: 12.0pt; font-family: 'Trebuchet MS', sans-serif;">Examples of conduct that may constitute sexual harassment are:</span></em></p>
<p style="margin: 0.35pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><em><span style="font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></em></p>
<ul style="margin-top: 0.05pt; margin-bottom: 0in;">
<li style="margin: 0.05pt 5.6pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Verbal: Sexual innuendoes, suggestive comments, jokes of a sexual nature, sexual propositions, lewd remarks, threats. Requests for any type of sexual favor (this includes repeated, unwelcome requests </span><span style="font-size: 12.0pt; line-height: 105%;">for dates). Verbal abuse or "kidding" that is oriented toward a prohibitive form of harassment, including that which is sex oriented and considered unwelcome.</span></li>
<li style="text-align: justify; line-height: 105%; margin: 0in 5.6pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Nonverbal: The distribution, display or discussion of any written or graphic material, including </span><span style="font-size: 12.0pt; line-height: 105%;">calendars, posters and cartoons that are sexually suggestive or show hostility toward an individual or group because of sex; suggestive or insulting sounds; leering; staring; whistling; obscene gestures; content in letters and notes, facsimiles, email, photos, text messages, Internet postings, etc., that is </span><span style="font-size: 12.0pt; line-height: 105%;">sexual in nature.</span></li>
<li style="text-align: justify; line-height: 105%; margin: 0in 5.6pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Physical: Unwelcome, unwanted physical contact, including but not limited to touching, tickling, pinching, patting, brushing up against, hugging, cornering, kissing, fondling; forced sexual intercourse </span><span style="font-size: 12.0pt; line-height: 105%;">or assault.</span></li>
</ul>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.0pt;">&nbsp;</span></p>
<p style="margin: 0in 5.65pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Normal, courteous, mutually respectful, pleasant, non-&shy;‐coercive interactions between employees, including men and women, that are acceptable to and welcomed by both parties, are not considered to be harassment, including sexual harassment.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>Inappropriate behavior</u></h1>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 13.0pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0in 86.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Our goal is to have a work environment where we all treat each other respectfully and professionally. Any unprofessional or disrespectful behavior, even if not illegal, interferes with</p>
<p style="margin: 0in 5pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">that goal and will not be tolerated. TUMI STAFFING, INC. reserves the right to respond to inappropriate behavior even where no one has complained or indicated they have been offended.</p>
<p style="margin: 0.55pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<p style="margin: 0in 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Performance feedback is not harassment or inappropriate behavior</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 13.0pt;">&nbsp;</span></p>
<p style="margin: 0.05pt 83.25pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Effective leadership requires that managers talk with their employees about their job performance. Managers should be clear about how each employee is performing and how the employee&rsquo;s overall behavior contributes to the workgroup&rsquo;s ability to deliver results consistent</p>
</div>
<p><span style="font-size: 11.0pt; line-height: 105%; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</span></p>
<div class="WordSection2">
<p style="margin: 4.6pt 5.65pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">with the values of TUMI STAFFING, INC.. Such discussions may be difficult and they always should be done professionally and respectfully. However, constructive criticism and supervisory actions regarding performance deficiencies or other workplace issues are not harassment or retaliation.</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.5pt;">&nbsp;</span></p>
<p style="margin: 0in 80.1pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Every TUMI STAFFING, INC. employee and contractor has a role to play in achieving a respectful workplace:</p>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<ul style="margin-bottom: 0in; margin-top: 0px;">
<li style="text-align: justify; line-height: 105%; margin: 0in 5.6pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">TUMI STAFFING, INC. expects respectful and professional behavior at all times, no matter the situation. Remember that your actions reflect upon you, and potentially reflect upon TUMI STAFFING, INC. Be sensitive to how others may perceive your actions. Just because someone does not complain to you </span><span style="font-size: 12.0pt; line-height: 105%;">does not mean that they don&rsquo;t object to your behavior.</span></li>
<li style="margin: 0in 79.1pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">There is no reason to ever engage in unwelcome behavior that has the purpose or effect of harassing others. Report any unwelcome behavior you think might be harassment </span><span style="font-size: 12.0pt; line-height: 105%;">under this policy.</span></li>
<li style="margin: 0in 93.05pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Be open to constructive feedback regarding performance deficiencies. Recognize that </span><span style="font-size: 12.0pt; line-height: 105%;">respectful supervisory actions regarding workplace issues are a necessary and </span><span style="font-size: 12.0pt; line-height: 105%;">appropriate step in performance feedback.</span></li>
<li style="margin: 0in 80.5pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">If someone offends you, let that person know so that it won&rsquo;t happen again. If you have offended someone, understand his or her perspective, apologize and don&rsquo;t let it happen </span><span style="font-size: 12.0pt; line-height: 105%;">again.</span></li>
<li style="margin: 0in 80.5pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">If you are aware of any behavior that might violate this policy, report it to your manager </span><span style="font-size: 12.0pt; line-height: 105%;">or supervisor or to the TUMI STAFFING, INC. Human Resources Department.</span></li>
</ul>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.0pt;">&nbsp;</span></p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>What to avoid</u></h1>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 9.0pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<ul style="margin-top: 4.35pt; margin-bottom: .0001pt;">
<li style="margin: 4.35pt 81.25pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Any behavior that is unprofessional or disrespectful, or that has the purpose or effect of </span><span style="font-size: 12.0pt; line-height: 105%;">harassing anyone.</span></li>
<li style="margin: 0in 89.45pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Any retaliation against someone who raises a concern or potential violation under this </span><span style="font-size: 12.0pt; line-height: 105%;">policy.</span></li>
<li style="margin: 0in 78.6pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Missed opportunities to respectfully communicate to someone that you found his or her </span><span style="font-size: 12.0pt; line-height: 105%;">behavior offensive.</span></li>
<li style="margin: 0in 0in 0.0001pt 6.9333px; text-align: justify; line-height: 14.35pt; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt;">Unreported concerns or violations of this policy.</span></li>
</ul>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>How to report a violation</u></h1>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 13.0pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0in 89pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Most reports of suspected violations of this policy are made to TUMI STAFFING, INC.&rsquo;s Human Resources. You can contact your local Manager, or go to someone higher in the organization. You can also use any of the additional reporting options listed in the If You Have a Business Conduct Concern section of this website/manual, if you prefer.</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>How TUMI STAFFING, INC. will respond</u></h1>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 13.0pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0in 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Investigation and response</p>
<p style="margin: 0.15pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 13.0pt;">&nbsp;</span></p>
<p style="margin: 0.05pt 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">If you report a complaint of harassment or inappropriate behavior, TUMI STAFFING, INC. will</p>
</div>
<p><span style="font-size: 11.0pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</span></p>
<div class="WordSection3">
<p style="margin: 4.6pt 5.65pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">investigate your concerns. Where there has been a violation of policy, TUMI STAFFING, INC. will take appropriate action to try to avoid future violations. In appropriate cases, TUMI STAFFING, INC. may take disciplinary action (up to and including immediate termination) against those violating the Harassment Policy.</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.5pt;">&nbsp;</span></p>
<p style="margin: 0in 5.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">TUMI STAFFING, INC. will inform parties about the status of reviewing their complaints. To respect the privacy and confidentiality of all people involved, 3M might not share specific details of the discipline or other action taken.</p>
<p style="margin: 0.45pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>TUMI STAFFING, INC. management responsibility</u></h1>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 13.0pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0in 5.65pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Every TUMI STAFFING, INC. supervisor and manager is responsible for ensuring that TUMI STAFFING, INC. provides a workplace free of harassment and inappropriate behavior and that complaints are handled promptly and effectively. With the assistance of Human Resources, TUMI STAFFING, INC. management must inform their organizations about the policy, promptly investigate allegations of harassment, take appropriate disciplinary action, and take steps to assure retaliation is prohibited.</p>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">Confidentiality</h1>
<p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 12.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0in 5.55pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">During the complaint process, while the confidentiality of the information received, the privacy of the individuals involved, and the wishes of the complaining person regarding action by the office cannot be guaranteed in every instance, they will be protected to as great a degree as is legally possible. The expressed wishes of the complaining person for confidentiality will be considered in the context of the company&rsquo;s legal obligation to act upon the charge and the right of the charged party to obtain information. In most cases, however, confidentiality will be strictly maintained by the company and those involved in the investigation. In addition, any notes or documents written by or received by the person(s) conducting the investigation will be kept confidential to the extent possible and according to any existing state or federal law.</p>
<p style="margin: 0.4pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<h1 style="margin: 0.05pt 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">Complaint Procedure</h1>
<p style="margin: 0.2pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 12.5pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0in 5.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">The following complaint procedure will be followed in order to address a complaint regarding harassment, discrimination or retaliation.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.5pt;">&nbsp;</span></p>
<ul style="margin-bottom: 0in; margin-top: 0px;">
<li style="text-align: justify; line-height: 105%; margin: 0in 5.6pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">A person who feels harassed, discriminated or retaliated against may initiate the complaint process by filing a written and signed complaint with the HR director. No formal action will be taken against any person under this policy unless a written and signed complaint is on file containing sufficient details to </span><span style="font-size: 12.0pt; line-height: 105%;">allow the HR director to determine if the policy may have been violated. The complainant (the employee making the complaint) may use the complaint form, which is attached to this policy. If a </span><span style="font-size: 12.0pt; line-height: 105%;">supervisor or manager becomes aware that harassment or discrimination is occurring, either from personal observation or as a result of an employee coming forward, the supervisor or manager should </span><span style="font-size: 12.0pt; line-height: 105%;">immediately report it to the HR director.</span></li>
<li style="text-align: justify; line-height: 105%; margin: 0in 5.6pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Upon receiving the complaint, or being advised by a supervisor or manager that violation of this policy </span><span style="font-size: 12.0pt; line-height: 105%;">may be occurring, the HR director will notify the company, and review the complaint with the company&rsquo;s legal counsel.</span></li>
<li style="margin: 0in 0in 0.0001pt 6.9333px; text-align: justify; line-height: 14.35pt; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt;">Within five (5) working days of receiving the complaint, the HR director will:</span></li>
</ul>
<p style="margin: 0.45pt 0in 0.0001pt 41.2pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">⁻&nbsp;&nbsp; Notify the person(s) charged [hereafter referred to as "respondent(s)&rdquo;] of a complaint.</p>
<p style="margin: 0.65pt 5.55pt 0.0001pt 59.2pt; text-align: justify; text-indent: -0.25in; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">⁻&nbsp;&nbsp; Initiate the investigation to determine whether there is a reasonable basis for believing that the alleged violation of this policy occurred.</p>
</div>
<p><span style="font-size: 11.0pt; line-height: 105%; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</span></p>
<div class="WordSection4">
<ul style="margin-top: 3.15pt; margin-bottom: 0in;">
<li style="margin: 3.15pt 5.6pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">During the investigation, the HR director, together with legal counsel or other management employee, will interview the complainant, the respondent and any witnesses to determine whether the alleged </span><span style="font-size: 12.0pt; line-height: 105%;">conduct occurred.</span></li>
<li style="margin: 0in 5.55pt 0.0001pt 6.9333px; text-align: justify; line-height: 105%; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Within 15 business days of the complaint being filed (or the matter being referred to the HR director), the HR director or other person conducting the investigation will conclude the investigation and submit </span><span style="font-size: 12.0pt; line-height: 105%;">a report of his or her findings to the company.</span></li>
<li style="text-align: justify; line-height: 105%; margin: 0in 5.6pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">If it is determined that harassment or discrimination in violation of this company&rsquo;s policy has occurred, the HR director will recommend appropriate disciplinary action. The appropriate action will depend on the following factors: (i) The severity, frequency and pervasiveness of the conduct; (ii) Prior complaints made by the complainant; (iii) Prior complaints made against the respondent; (iv) The quality of the </span><span style="font-size: 12.0pt; line-height: 105%;">evi</span><span style="font-size: 12.0pt; line-height: 105%;">d</span><span style="font-size: 12.0pt; line-height: 105%;">en</span><span style="font-size: 12.0pt; line-height: 105%;">c</span><span style="font-size: 12.0pt; line-height: 105%;">e</span> <span style="font-size: 12.0pt; line-height: 105%;">(</span><span style="font-size: 12.0pt; line-height: 105%;">f</span><span style="font-size: 12.0pt; line-height: 105%;">i</span><span style="font-size: 12.0pt; line-height: 105%;">rs</span><span style="font-size: 12.0pt; line-height: 105%;">t</span><span style="font-size: 12.0pt; line-height: 105%;">-&shy;‐</span><span style="font-size: 12.0pt; line-height: 105%;">h</span><span style="font-size: 12.0pt; line-height: 105%;">an</span><span style="font-size: 12.0pt; line-height: 105%;">d</span> <span style="font-size: 12.0pt; line-height: 105%;">k</span><span style="font-size: 12.0pt; line-height: 105%;">n</span><span style="font-size: 12.0pt; line-height: 105%;">o</span><span style="font-size: 12.0pt; line-height: 105%;">w</span><span style="font-size: 12.0pt; line-height: 105%;">l</span><span style="font-size: 12.0pt; line-height: 105%;">e</span><span style="font-size: 12.0pt; line-height: 105%;">d</span><span style="font-size: 12.0pt; line-height: 105%;">g</span><span style="font-size: 12.0pt; line-height: 105%;">e</span><span style="font-size: 12.0pt; line-height: 105%;">,</span> <span style="font-size: 12.0pt; line-height: 105%;">c</span><span style="font-size: 12.0pt; line-height: 105%;">r</span><span style="font-size: 12.0pt; line-height: 105%;">e</span><span style="font-size: 12.0pt; line-height: 105%;">dibl</span><span style="font-size: 12.0pt; line-height: 105%;">e</span> <span style="font-size: 12.0pt; line-height: 105%;">c</span><span style="font-size: 12.0pt; line-height: 105%;">o</span><span style="font-size: 12.0pt; line-height: 105%;">rr</span><span style="font-size: 12.0pt; line-height: 105%;">o</span><span style="font-size: 12.0pt; line-height: 105%;">b</span><span style="font-size: 12.0pt; line-height: 105%;">o</span><span style="font-size: 12.0pt; line-height: 105%;">r</span><span style="font-size: 12.0pt; line-height: 105%;">ati</span><span style="font-size: 12.0pt; line-height: 105%;">o</span><span style="font-size: 12.0pt; line-height: 105%;">n</span> <span style="font-size: 12.0pt; line-height: 105%;">etc</span><span style="font-size: 12.0pt; line-height: 105%;">.</span><span style="font-size: 12.0pt; line-height: 105%;">)</span><span style="font-size: 12.0pt; line-height: 105%;">.</span></li>
<li style="text-align: justify; line-height: 105%; margin: 0in 5.6pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">If the investigation is inconclusive or it is determined that there has been no harassment or discrimination in violation of this policy, but some potentially problematic conduct is revealed, preventative action may be taken.</span></li>
<li style="text-align: justify; line-height: 105%; margin: 0in 5.6pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Within five (5) days after the investigation is concluded, the HR director will meet with the complainant and the respondent separately in order to notify them in person of the findings of the investigation and </span><span style="font-size: 12.0pt; line-height: 105%;">to inform them of the action being recommended by the HR director.</span></li>
<li style="text-align: justify; line-height: 105%; margin: 0in 5.6pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">The complainant and the respondent may submit statements to the HR director challenging the factual basis of the findings. Any such statement must be submitted no later than five (5) working days after </span><span style="font-size: 12.0pt; line-height: 105%;">the meeting with the HR director in which the findings of the investigation is discussed.</span></li>
<li style="text-align: justify; line-height: 105%; margin: 0in 5.6pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.0pt; line-height: 105%;">Within 10 days from the date the HR director meets with the complainant and respondent, the </span><span style="font-size: 12.0pt; line-height: 105%;">company will review the investigative report and any statements submitted by the complainant or respondent, discuss results of the investigation with the HR director and other management staff as </span><span style="font-size: 12.0pt; line-height: 105%;">may be appropriate and decide what action, if any, will be taken. The HR director will report the </span><span style="font-size: 12.0pt; line-height: 105%;">company&rsquo;s decision to the complainant, the respondent and the appropriate management assigned to the department(s) in which the complainant and the respondent work. The company&rsquo;s decision will be </span><span style="font-size: 12.0pt; line-height: 105%;">in writing and will include finding of fact and a statement for or against disciplinary action. If disciplinary action is to be taken, the sanction will be stated.</span></li>
</ul>
<h1 style="margin: 11.55pt 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>Retaliation is prohibited</u></h1>
<p style="margin: 0.35pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 13.0pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 0.05pt 85.4pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">This policy strictly prohibits any retaliation against an employee or other person who reports a concern about harassment or other inappropriate behavior.</p>
<p style="margin: 0.45pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<h1 style="margin: 0in 0in 0.0001pt 7.95pt; text-align: justify; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">Our Policy:</h1>
<p style="margin: 0.85pt 10.6pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">TUMI STAFFING, INC. strictly prohibits any form of retaliation against an employee who in good faith makes a complaint, raises a concern, provides information or otherwise assists in an investigation or proceeding regarding any conduct that he or she reasonably believes to be in violation of TUMI STAFFING, INC. Code of Conduct or policies, or applicable laws, rules or regulations. This policy is designed to ensure that all employees feel comfortable speaking up when they see or suspect illegal or unethical conduct without fear of retaliation. It is also intended to encourage all employees to cooperate with TUMI STAFFING, INC. in the internal investigation of any matter by providing honest, truthful and complete information without fear of retaliation.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<h1 style="margin: 0.05pt 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">Details:</h1>
<p style="margin: 1.05pt 24.5pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">No employee should be discharged, demoted, suspended, threatened, harassed, intimidated, coerced, or retaliated against in any other manner as a result of his or her making a good faith complaint or assisting in the handling or investigation of a good faith complaint, that a TUMI STAFFING, INC. policy, the Code of</p>
</div>
<p><span style="font-size: 11.0pt; line-height: 105%; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</span></p>
<p style="margin: 4.6pt 11.05pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Conduct, or an applicable law, rule or regulation has been violated. Employees who in good faith make a complaint or participate in an investigation or proceeding under this policy, however, remain subject to the same standards of performance and conduct as other employees. Company prohibits employees from being retaliated against even if their complaints are proven unfounded by an investigation, unless the employee knowingly made a false allegation, provided false or misleading information in the course of an investigation, or otherwise acted in bad faith. Employees have an obligation to participate in good faith in any internal investigation of retaliation. Company takes all complaints of retaliation very seriously. All such complaints will be reviewed promptly and, where appropriate, investigated.</p>
<p style="margin: 0.3pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">&nbsp;</p>
<h1 style="margin: 0.05pt 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">Reporting Violations:</h1>
<p style="margin: 0.8pt 11.15pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">If you believe you have been retaliated against or that any other violation of this policy has occurred, or if you have questions concerning this policy, you must immediately notify Human Resources, your immediate manager, or any other person as outlined in the Open Door policy. You may also call the Company phone line at<u> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </u>.</p>
<p style="margin: 0.1pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 12.5pt;">&nbsp;</span></p>
<h1 style="text-align: justify; margin: 0in 0in 0.0001pt 5.2pt; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;">Remedy:</h1>
<p style="margin: 0.85pt 34.85pt 0.0001pt 5.2pt; text-align: justify; line-height: 118%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Any employee who violates this policy is subject to disciplinary action, up to and including termination of employment.</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 14.0pt;">&nbsp;</span></p>
<p style="margin: 0.25pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 17.5pt;">&nbsp;</span></p>
<h1 style="margin: 0in 197.5pt 0.0001pt 197.1pt; text-align: justify; font-size: 12pt; font-family: 'Trebuchet MS', sans-serif;"><u>Employee Acknowledgment</u></h1>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><strong><span style="font-size: 9.0pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</span></strong></p>
<p style="margin: 5.3pt 83.2pt 0.0001pt 5.2pt; text-align: justify; line-height: 105%; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">I understand compliance with the Non-&shy;‐Discrimination policy is a condition of my employment with TUMI STAFFING, INC., and I agree to abide by the above policy.</p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 14.0pt;">&nbsp;</span></p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 14.0pt;">&nbsp;</span></p>
<p style="margin: 0.1pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.0pt;">&nbsp;</span></p>
<p style="margin: 0in 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Employee Name (printed)&nbsp;&nbsp;&nbsp; <u>` + this.state.applicantName + `</u></p>
<p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 10.0pt; font-family: 'Times New Roman', serif;">&nbsp;</span></p>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.0pt; font-family: 'Times New Roman', serif;">&nbsp;</span></p>
<p style="margin: 0.5pt 0in 0.0001pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;"><span style="font-size: 11.0pt; font-family: 'Times New Roman', serif;">&nbsp;</span></p>
<p style="margin: 5.3pt 0in 0.0001pt 5.2pt; text-align: justify; font-size: 12pt; font-family: 'DejaVu Sans', sans-serif;">Employee Signature&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <u><img width="300" height="300" src="` + this.state.signature + `" alt=""></u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date <u><span style="font-family: 'Times New Roman', serif;">` + this.state.date + `</span></u></p>`)}</div>
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
}

export default withApollo(withGlobalContent(AntiHarassment));
