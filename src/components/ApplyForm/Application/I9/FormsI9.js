import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import {CREATE_DOCUMENTS_PDF_QUERY, GET_APPLICANT_INFO} from "./Queries";
import {ADD_ANTI_HARASSMENT, ADD_I9} from "./Mutations";
import withGlobalContent from "../../../Generic/Global";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';

const uuidv4 = require('uuid/v4');

const applyTabs = require(`../languagesJSON/${localStorage.getItem('languageForm')}/applyTabs`);
const actions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class FormsI9 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signature: '',
            signature1: '',
            signature2: '',
            signature3: '',
            signature4: '',

            signType: null,

            openSignature: false,
            id: null,
            content: '',
            date: '',
            applicantName: '',
            companyPhoneNumber: '',
            ApplicationId: this.props.applicationId,


            isCreated: null,
            html: '',

            oneCheck: false,
            oneCheck1: false,
            oneCheck2: false,
            oneCheck3: false,
        }
    }


    handleSignature = (value) => {
        let signType = this.state.signType;

        if (signType == 0) {
            this.setState({
                signature: value,
                openSignature: false,
                date: new Date().toISOString().substring(0, 10)
            }, () => {
                //this.insertAntiHarrasment(this.state);
            });
        }  else if (signType == 1) {
            this.setState({
                signature1: value,
                openSignature: false,
                date: new Date().toISOString().substring(0, 10)
            }, () => {
                //this.insertAntiHarrasment(this.state);
            });
        } else if (signType == 2) {
            this.setState({
                signature2: value,
                openSignature: false,
                date: new Date().toISOString().substring(0, 10)
            }, () => {
                //this.insertAntiHarrasment(this.state);
            });
        } else if (signType == 3) {
            this.setState({
                signature3: value,
                openSignature: false,
                date: new Date().toISOString().substring(0, 10)
            }, () => {
                //this.insertAntiHarrasment(this.state);
            });
        } else if (signType == 4) {
            this.setState({
                signature4: value,
                openSignature: false,
                date: new Date().toISOString().substring(0, 10)
            }, () => {
                //this.insertAntiHarrasment(this.state);
            });
        }
    };

    getApplicantInformation = (id) => {
        this.props.client
            .query({
                query: GET_APPLICANT_INFO,
                variables: {
                    ApplicationId: id
                },
                fetchPolicy: 'no-cache'
            })
            .then(({data}) => {
                if (data.applicantI9.length > 0) {
                    this.setState({
                        isCreated: true,
                        html: data.applicantI9[0].html
                    }, () => {
                        let pdf = document.getElementById('pdf-ready').innerHTML = this.state.html;
                    });
                } else {
                    this.setState({
                        isCreated: false,
                    })
                }
            })
            .catch(error => {

            })
    };

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
                    contentHTML: document.getElementById('DocumentPDF').innerHTML,
                    Name: "I9-" + random + this.state.applicantName
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
                    this.setState({loadingData: false, downloading: false});
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
                this.setState({loadingData: false, downloading: false});
            });
    };


    downloadDocumentsHandler = (random) => {
        var url = this.context.baseUrl + '/public/Documents/' + "I9-" + random + this.state.applicantName + '.pdf';
        window.open(url, '_blank');
        this.setState({downloading: false});
    };


    componentWillMount() {
        // this.getHarrasmentInformation(this.props.applicationId);
        this.getApplicantInformation(this.props.applicationId);
    }

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 5000));
    }


    validateI9 = () => {
        let inputs = document.getElementsByTagName('input')

        for (let i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }

        let html = document.getElementById('i9Html');

        this.props.client
            .mutate({
                mutation: ADD_I9,
                variables: {
                    html: html.outerHTML,
                    ApplicantId: this.props.applicationId,
                }
            })
            .then(({data}) => {
                this.props.handleOpenSnackbar(
                    'success',
                    'Created successfully',
                    'bottom',
                    'right'
                );
                this.getApplicantInformation(this.props.applicationId)
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to save I9. Please, try again!',
                    'bottom',
                    'right'
                );

                console.log(error);
            });
    };

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
                                    this.state.isCreated === null ? (
                                        ''
                                    ) : (
                                        this.state.isCreated ? (
                                            <button className="applicant-card__edit-button" onClick={() => {
                                                let random = uuidv4();

                                                this.createDocumentsPDF(random);
                                                this.sleep().then(() => {
                                                    this.downloadDocumentsHandler(random);
                                                }).catch(error => {
                                                    this.setState({downloading: false})
                                                })
                                            }}>{this.state.downloading && (
                                                <React.Fragment>Downloading <i
                                                    class="fas fa-spinner fa-spin"/></React.Fragment>)}
                                                {!this.state.downloading && (
                                                    <React.Fragment>{actions[9].label} <i
                                                        className="fas fa-download"/></React.Fragment>)}

                                            </button>
                                        ) : (
                                            <button className="applicant-card__edit-button" onClick={() => {
                                                this.validateI9();
                                            }}>{actions[4].label} <i className="far fa-save"/>
                                            </button>
                                        )
                                    )
                                }
                            </div>
                            {
                                this.state.html.length > 0 ? (
                                    <div id="pdf-ready" style={{width: '1000px', margin: '0 auto'}}>
                                    </div>
                                ) : (
                                    <div style={{ width: '1000px', margin: '0 auto' }}>
                                        <div className="row pdf-container--i9-w4" id="i9Html">
                                            <div id="DocumentPDF" className="signature-information">
                                                <div style={{width: '800px', margin: '0 auto'}}>
                                                    <img src="https://i.imgur.com/EXoWtMF.png" width="100%" alt/>
                                                    <div data-font-name="g_d0_f3" data-angle={0}
                                                         data-canvas-width="16.334999999999997"><span style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '10pt'
                                                    }}><strong>►&nbsp;START
              HERE:</strong> Read instructions carefully before completing this form. The instructions must be
            available, either in paper or electronically, during completion of this form. Employers are liable for
            errors in the completion of this form.</span></div>
                                                    <div data-font-name="Helvetica" data-angle={0}
                                                         data-canvas-width="234.99000000000004"><span style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '10pt'
                                                    }}><strong>ANTI-DISCRIMINATION
              NOTICE:&nbsp;</strong>It is illegal to discriminate against work-authorized individuals. Employers
            <strong>CANNOT</strong> specify which document(s) an employee may present to establish employment
            authorization and identity. The refusal to hire or continue to employ an individual because the
            documentation presented has a future expiration date may also constitute illegal discrimination.</span>
                                                    </div>
                                                    <div data-font-name="Helvetica" data-angle={0}
                                                         data-canvas-width="234.99000000000004">&nbsp;</div>
                                                    <div data-font-name="Helvetica" data-angle={0}
                                                         data-canvas-width="234.99000000000004">
                                                        <table style={{
                                                            borderCollapse: 'collapse',
                                                            width: '100%',
                                                            height: '17px',
                                                            backgroundColor: '#bec1c3'
                                                        }} border={1}>
                                                            <tbody>
                                                            <tr style={{height: '17px'}}>
                                                                <td style={{width: '100%', height: '17px'}}>
                                                                    <div data-font-name="Helvetica" data-angle={0}
                                                                         data-canvas-width="422.76666666666665"><span
                                                                        style={{
                                                                            color: '#000000',
                                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                                            fontSize: '10pt'
                                                                        }}>Section
                      <strong>1. Employee Information and Attestation</strong>&nbsp;(Employees must complete
                      and sign Section 1 of Form I-9 no later than the<em><strong> first day of
                          employment</strong> </em>, but not before accepting a job offer.)</span></div>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '25%'}}>
                                                                    <div data-font-name="g_d0_f5" data-angle={0}
                                                                         data-canvas-width="68.17333333333332"><span
                                                                        style={{
                                                                            color: '#000000',
                                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                                            fontSize: '10pt'
                                                                        }}>Last
                      Name&nbsp;(Family Name) <input
                                                                            value={this.state.lastName}
                                                                            onChange={(e) => {
                                                                                this.setState({
                                                                                    lastName: e.target.value
                                                                                })
                                                                            }} style={{border: 0, width: '100%'}}
                                                                            type="text"
                                                                            id="lastName"/></span>
                                                                    </div>
                                                                </td>
                                                                <td style={{width: '25%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>First
                    Name (Given Name) <input value={this.state.firstName}
                                             onChange={(e) => {
                                                 this.setState({
                                                     firstName: e.target.value
                                                 })
                                             }} style={{border: 0, width: '100%'}} type="text" id="firstName"/></span>
                                                                </td>
                                                                <td style={{width: '25%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Middle
                    Initial <input value={this.state.middleName}
                                   onChange={(e) => {
                                       this.setState({
                                           middleName: e.target.value
                                       })
                                   }} style={{border: 0, width: '100%'}} type="text" id="middleInitia"/></span></td>
                                                                <td style={{width: '25%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Other
                    Last Names Used (if any) <input value={this.state.otherLastName}
                                                    onChange={(e) => {
                                                        this.setState({
                                                            otherLastName: e.target.value
                                                        })
                                                    }} style={{border: 0, width: '100%'}} type="text"
                                                    id="otherLastName"/></span>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table style={{
                                                            borderCollapse: 'collapse',
                                                            width: '100%',
                                                            height: '17px'
                                                        }}
                                                               border={1}>
                                                            <tbody>
                                                            <tr style={{height: '17px'}}>
                                                                <td style={{
                                                                    width: '20%',
                                                                    height: '17px',
                                                                    verticalAlign: 'top'
                                                                }}>
                                                                    <div data-font-name="g_d0_f5" data-angle={0}
                                                                         data-canvas-width="52.61333333333333"><span
                                                                        style={{
                                                                            color: '#000000',
                                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                                            fontSize: '10pt'
                                                                        }}>Address
                      (Street Number and Name) <input value={this.state.streetNumber}
                                                      onChange={(e) => {
                                                          this.setState({
                                                              streetNumber: e.target.value
                                                          })
                                                      }} style={{border: 0, width: '100%'}} type="text"
                                                      id="address"/></span>
                                                                    </div>
                                                                </td>
                                                                <td style={{
                                                                    width: '20%',
                                                                    height: '17px',
                                                                    verticalAlign: 'top'
                                                                }}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Apt.
                    Number <input value={this.state.aptNumber}
                                  onChange={(e) => {
                                      this.setState({
                                          aptNumber: e.target.value
                                      })
                                  }} style={{border: 0, width: '100%'}} type="text" id="aptNumber"/></span></td>
                                                                <td style={{
                                                                    width: '20%',
                                                                    height: '17px',
                                                                    verticalAlign: 'top'
                                                                }}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>City or
                    Town <input value={this.state.city}
                                onChange={(e) => {
                                    this.setState({
                                        city: e.target.value
                                    })
                                }} style={{border: 0, width: '100%'}} type="text" id="city"/></span></td>
                                                                <td style={{
                                                                    width: '20%',
                                                                    height: '17px',
                                                                    verticalAlign: 'top'
                                                                }}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>State
                    <input value={this.state.state}
                           onChange={(e) => {
                               this.setState({
                                   state: e.target.value
                               })
                           }} style={{border: 0, width: '100%'}} type="text" id="state"/></span></td>
                                                                <td style={{
                                                                    width: '20%',
                                                                    height: '17px',
                                                                    verticalAlign: 'top'
                                                                }}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>ZIP Code
                    <input value={this.state.zipCode}
                           onChange={(e) => {
                               this.setState({
                                   zipCode: e.target.value
                               })
                           }} style={{border: 0, width: '100%'}} type="text" id="zipCode"/></span></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '25%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Date of
                    Birth (mm/dd/yyyy) <input value={this.state.dateOfBirth}
                                              onChange={(e) => {
                                                  this.setState({
                                                      dateOfBirth: e.target.value
                                                  })
                                              }} style={{border: 0, width: '100%'}} type="text"
                                              id="dateOfBirth"/></span>
                                                                </td>
                                                                <td style={{width: '25%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>U.S.
                    Social Security Number <input value={this.state.socialSecurityNumber}
                                                  onChange={(e) => {
                                                      this.setState({
                                                          socialSecurityNumber: e.target.value
                                                      })
                                                  }} style={{border: 0, width: '100%'}} type="text"
                                                  id="socialSecurityNumber"/></span></td>
                                                                <td style={{width: '25%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Employee's
                    E-mail Address <input value={this.state.email}
                                          onChange={(e) => {
                                              this.setState({
                                                  email: e.target.value
                                              })
                                          }} style={{border: 0, width: '100%'}} type="text" id="email"/></span></td>
                                                                <td style={{width: '25%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Employee's
                    Telephone Number <input value={this.state.telephone}
                                            onChange={(e) => {
                                                this.setState({
                                                    telephone: e.target.value
                                                })
                                            }} style={{border: 0, width: '100%'}} type="text" id="telephone"/></span>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <p><span style={{
                                                            color: '#000000',
                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                            fontSize: '10pt'
                                                        }}><strong>I am aware
                that federal law provides for imprisonment and/or fines for false statements or use of false
                documents in connection with the completion of this form.</strong></span></p>
                                                        <p><span style={{
                                                            color: '#000000',
                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                            fontSize: '10pt'
                                                        }}><strong>I attest,
                under penalty of perjury, that I am (check one of the following boxes):</strong></span></p>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '100%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}> <input
                                                                    name="status"
                                                                    value={this.state.oneCheck}
                                                                    defaultChecked={this.state.oneCheck}
                                                                    onChange={(e) => {
                                                                        this.setState({
                                                                            oneCheck: e.target.checked,
                                                                            oneCheck1: false,
                                                                            oneCheck2: false,
                                                                            oneCheck3: false,
                                                                        })
                                                                    }} type="radio" id="citizen"/> 1. A citizen of the United States</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{width: '100%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}> <input value={this.state.oneCheck1}
                                                                           defaultChecked={this.state.oneCheck1}
                                                                           name="status"
                                                                           onChange={(e) => {
                                                                               this.setState({
                                                                                   oneCheck1: e.target.checked,
                                                                                   oneCheck: false,
                                                                                   oneCheck2: false,
                                                                                   oneCheck3: false,
                                                                               })
                                                                           }} type="radio" id="non-citizen"/> 2. A noncitizen national of the United States (See
                    instructions)</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{width: '100%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}> <input value={this.state.oneCheck2}
                                                                           defaultChecked={this.state.oneCheck2}
                                                                           name="status"
                                                                           onChange={(e) => {
                                                                               this.setState({
                                                                                   oneCheck2: e.target.checked,
                                                                                   oneCheck: false,
                                                                                   oneCheck1: false,
                                                                                   oneCheck3: false,
                                                                               })
                                                                           }} type="radio" id="lowful-permanent-resident"/> 3. A lawful permanent resident (Alien Registration Number/USCIS
                    Number):&nbsp; &nbsp; <input
                                                                        name="status"
                                                                        // defaultChecked={this.state.oneCheck3Explain}
                                                                        value={this.state.oneCheck3Explain}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                oneCheck3Explain: e.target.value,
                                                                            })
                                                                        }}
                                                                        id="resident-explain"
                                                                        style={{border: 0, borderBottom: '1px solid #000'}}
                                                                        type="text"/></span></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table style={{
                                                            borderCollapse: 'collapse',
                                                            width: '100%',
                                                            borderRight: 0,
                                                            borderBottom: 0,
                                                            borderTop: 0
                                                        }} border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{
                                                                    width: '70%',
                                                                    borderRight: 'solid 1px #000',
                                                                    borderBottom: 'solid 1px #000'
                                                                }}>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>
                      <input value={this.state.oneCheck3}
                             name="status"
                             onChange={(e) => {
                                 this.setState({
                                     oneCheck3: e.target.checked,
                                     oneCheck: false,
                                     oneCheck1: false,
                                     oneCheck2: false,
                                 })
                             }} type="radio" id="alien"/> 4. An alien authorized to work until (expiration date, if
                      applicable, mm/dd/yyyy): <input
                                                                        value={this.state.alienExplain}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                alienExplain: e.target.value
                                                                            })
                                                                        }}
                                                                        id="alien-explain"
                                                                        style={{border: 0, borderBottom: '1px solid #000'}}
                                                                        type="text"/></span>
                                                                    </p>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>&nbsp;
                                                                        &nbsp; Some aliens may write "N/A" in the expiration date field. (See
                      instructions)</span></p>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><em>Aliens
                        authorized to work must provide only one of the following document numbers to
                        complete Form I-9: An Alien Registration Number/USCIS Number OR Form I-94 Admission
                        Number OR Foreign Passport&nbsp; &nbsp; &nbsp; Number.</em></span></p>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>1.Alien
                      Registration Number/USCIS Number: <input
                                                                            value={this.state.alienRegister}
                                                                            onChange={(e) => {
                                                                                this.setState({
                                                                                    alienRegister: e.target.value
                                                                                })
                                                                            }}
                                                                            style={{
                                                                                border: 0,
                                                                                borderBottom: '1px solid #000'
                                                                            }}
                                                                            type="text" id="alien-register-number"/></span>
                                                                    </p>
                                                                    <p style={{paddingLeft: '80px'}}><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><strong>OR</strong></span>
                                                                    </p>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>2.Form
                      I-94 Admission Number: <input
                                                                            value={this.state.admissionNumber}
                                                                            onChange={(e) => {
                                                                                this.setState({
                                                                                    admissionNumber: e.target.value
                                                                                })
                                                                            }}
                                                                            style={{
                                                                                border: 0,
                                                                                borderBottom: '1px solid #000'
                                                                            }} type="text"
                                                                            id="admision-number"/></span></p>
                                                                    <p style={{paddingLeft: '80px'}}><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><strong>OR</strong>
                    </span></p>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>3.Foreign
                      Passport Number: <input
                                                                            value={this.state.foreignPassport}
                                                                            onChange={(e) => {
                                                                                this.setState({
                                                                                    foreignPassport: e.target.value
                                                                                })
                                                                            }}
                                                                            style={{
                                                                                border: 0,
                                                                                borderBottom: '1px solid #000'
                                                                            }} type="text"
                                                                            id="foreign-passport-number"/></span></p>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>&nbsp;
                                                                        &nbsp; Country of Issuance: <input
                                                                            value={this.state.countryIssuance}
                                                                            onChange={(e) => {
                                                                                this.setState({
                                                                                    countryIssuance: e.target.value
                                                                                })
                                                                            }}
                                                                            style={{
                                                                                border: 0,
                                                                                borderBottom: '1px solid #000'
                                                                            }}
                                                                            type="text" id="country-issuance"/></span></p>
                                                                    <p>&nbsp;</p>
                                                                </td>
                                                                <td style={{
                                                                    width: '30%',
                                                                    border: 'solid 1px #FFF',
                                                                    padding: '10px'
                                                                }}>
                                                                    <table style={{
                                                                        borderCollapse: 'collapse',
                                                                        width: '100%',
                                                                        height: '195px'
                                                                    }} border={1}>
                                                                        <tbody>
                                                                        <tr style={{height: '195px'}}>
                                                                            <td style={{
                                                                                width: '100%',
                                                                                height: '195px',
                                                                                verticalAlign: 'top',
                                                                                textAlign: 'center'
                                                                            }}>
                          <span
                              style={{color: '#000000', fontFamily: 'arial, helvetica, sans-serif', fontSize: '10pt'}}>QR
                            Code - Section 1 Do Not Write In This Space</span></td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <p><span style={{
                                                            color: '#000000',
                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                            fontSize: '10pt'
                                                        }}>&nbsp;</span></p>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '50%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Signature
                    of Employee:
                                                                    {/*<input*/}
                                                                    {/*value={this.state.signature}*/}
                                                                    {/*onChange={(e) => {*/}
                                                                    {/*this.setState({*/}
                                                                    {/*signature: e.target.value*/}
                                                                    {/*})*/}
                                                                    {/*}}*/}
                                                                    {/*style={{border: 0, width: '100%'}} type="text" id="signature"/>*/}
                                                                    <img style={{
                                                                        width: '100px',
                                                                        height: '30px',
                                                                        display: 'inline-block',
                                                                        backgroundColor: '#f9f9f9',
                                                                        cursor: 'pointer'
                                                                    }} onClick={() => {
                                                                        if (this.state.isCreated === false) {
                                                                            this.setState({
                                                                                signType: 0
                                                                            }, () => {
                                                                                this.setState({
                                                                                    openSignature: true,
                                                                                })
                                                                            });
                                                                        }
                                                                    }}
                                                                         src={this.state.signature} alt=""/>
                                                            </span></td>
                                                                <td style={{width: '50%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Today's
                    Date (mm/dd/yyyy) <input
                                                                        value={this.state.todayDate}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                todayDate: e.target.value
                                                                            })
                                                                        }}
                                                                        id="today-date" style={{border: 0, width: '100%'}}
                                                                        type="text"/></span>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <p><span style={{
                                                            color: '#000000',
                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                            fontSize: '10pt'
                                                        }}>&nbsp;</span></p>
                                                        <table style={{
                                                            borderCollapse: 'collapse',
                                                            width: '100%',
                                                            height: '17px',
                                                            backgroundColor: '#bec1c3'
                                                        }} border={1}>
                                                            <tbody>
                                                            <tr style={{height: '17px'}}>
                                                                <td style={{width: '100%', height: '17px'}}>
                                                                    <h3><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><strong>Preparer
                        and/or Translator Certification (check one):</strong></span></h3>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>
                      <input
                          value={this.state.preparer0}
                          onChange={(e) => {
                              this.setState({
                                  preparer0: e.target.value
                              })
                          }}
                          type="checkbox" id="preparer-0"/>I did not use a preparer or translator. <input
                                                                        value={this.state.preparer1}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                preparer1: e.target.value
                                                                            })
                                                                        }}
                                                                        type="checkbox" id="preparer-1"/>I A preparer(s) and/or translator(s) assisted the employee in
                      completing Section 1.</span></p>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><em>(Fields
                        below must be completed and signed when preparers and/or translators assist an
                        employee in completing Section 1.)</em></span></p>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <p><span style={{
                                                            color: '#000000',
                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                            fontSize: '10pt'
                                                        }}><strong>I attest,
                under penalty of perjury, that I have assisted in the completion of Section 1 of this form and that
                to the best of my knowledge the information is true and correct.</strong></span></p>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '65.2979%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Signature
                    of Preparer or Translator <img style={{
                                                                        width: '100px',
                                                                        height: '30px',
                                                                        display: 'inline-block',
                                                                        backgroundColor: '#f9f9f9',
                                                                        cursor: 'pointer'
                                                                    }} onClick={() => {
                                                                        if (this.state.isCreated === false) {
                                                                            this.setState({
                                                                                signType: 1
                                                                            }, () => {
                                                                                this.setState({
                                                                                    openSignature: true,
                                                                                })
                                                                            });
                                                                        }
                                                                    }}
                                                   src={this.state.signature1} alt=""/></span></td>
                                                                <td style={{width: '34.7021%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Today's
                    Date (mm/dd/yyyy) <input
                                                                        value={this.state.todayDate2}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                todayDate2: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table style={{
                                                            borderCollapse: 'collapse',
                                                            width: '100%',
                                                            height: '17px',
                                                            borderTop: 0
                                                        }} border={1}>
                                                            <tbody>
                                                            <tr style={{height: '17px'}}>
                                                                <td style={{width: '50%', height: '17px'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Last
                    Name (Family Name) <input
                                                                        value={this.state.lastName2}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                lastName2: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '50%', height: '17px'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>First
                    Name (Given Name) <input
                                                                        value={this.state.firstName2}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                firstName2: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table style={{
                                                            borderCollapse: 'collapse',
                                                            width: '100%',
                                                            borderTop: 0
                                                        }}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '31.9243%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Address
                    (Street Number and Name) <input
                                                                        value={this.state.address2}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                address2: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '41.2641%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>City or
                    Town <input
                                                                        value={this.state.city2}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                city2: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '6.80349%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>State
                    <input
                        value={this.state.state2}
                        onChange={(e) => {
                            this.setState({
                                state2: e.target.value
                            })
                        }}
                        style={{width: '100%', border: 0}} type="text"/></span></td>
                                                                <td style={{width: '20.0081%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>ZIP Code
                    <input
                        value={this.state.zipCode2}
                        onChange={(e) => {
                            this.setState({
                                zipCode2: e.target.value
                            })
                        }}
                        style={{width: '100%', border: 0}} type="text"/></span></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <img src="https://i.imgur.com/yP3pq57.png" width="100%" alt/>
                                                        <img src="https://i.imgur.com/EXoWtMF.png" width="100%" alt/>
                                                        <table style={{
                                                            borderCollapse: 'collapse',
                                                            width: '100%',
                                                            backgroundColor: '#bec1c3'
                                                        }} border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '100%'}}>
                                                                    <h3><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><strong>Section
                        2. Employer or Authorized Representative Review and Verification </strong></span>
                                                                    </h3>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>(Employers
                      or their authorized representative must complete and sign Section 2 within 3 business
                      days of the employee's first day of employment. You must physically examine one document
                      from List A OR a combination of one document from List B and one document from List C as
                      listed on the "Lists of Acceptable Documents.")</span></p>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '18.438%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}><strong>Employee
                      Info from Section 1</strong></span></td>
                                                                <td style={{width: '25.7381%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Last
                    Name (Family Name)</span></td>
                                                                <td style={{width: '32.9576%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>First
                    Name (Given Name)</span></td>
                                                                <td style={{width: '6.19971%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>M.I.</span>
                                                                </td>
                                                                <td style={{width: '16.6667%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Citizenship/Immigration
                    Status</span></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <p>&nbsp;</p>
                                                        <table style={{
                                                            borderCollapse: 'collapse',
                                                            width: '100%',
                                                            height: '98px'
                                                        }}
                                                               border={1}>
                                                            <tbody>
                                                            <tr style={{height: '98px'}}>
                                                                <td style={{width: '33.3333%', height: '98px'}}>
                                                                    <table
                                                                        style={{borderCollapse: 'collapse', width: '100%'}}
                                                                        border={1}>
                                                                        <tbody>
                                                                        <tr>
                                                                            <td style={{width: '100%'}}><span style={{
                                                                                color: '#000000',
                                                                                fontFamily: 'arial, helvetica, sans-serif',
                                                                                fontSize: '10pt'
                                                                            }}>Document
                            Title <input
                                                                                    value={this.state.docTitle}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docTitle: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{width: '100%', border: 0}}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{width: '100%'}}><span style={{
                                                                                color: '#000000',
                                                                                fontFamily: 'arial, helvetica, sans-serif',
                                                                                fontSize: '10pt'
                                                                            }}>Issuing
                            Authority <input
                                                                                    value={this.state.Issuing}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            Issuing: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{width: '100%', border: 0}}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{width: '100%'}}><span style={{
                                                                                color: '#000000',
                                                                                fontFamily: 'arial, helvetica, sans-serif',
                                                                                fontSize: '10pt'
                                                                            }}>Document
                            Number <input
                                                                                    value={this.state.docNumber}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docNumber: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{width: '100%', border: 0}}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td style={{width: '100%'}}><span style={{
                                                                                color: '#000000',
                                                                                fontFamily: 'arial, helvetica, sans-serif',
                                                                                fontSize: '10pt'
                                                                            }}>
                            Expiration Date (if any)(mm/dd/yyyy) <input
                                                                                value={this.state.expireDate2}
                                                                                onChange={(e) => {
                                                                                    this.setState({
                                                                                        expireDate2: e.target.value
                                                                                    })
                                                                                }}
                                                                                style={{width: '100%', border: 0}}
                                                                                type="text"/></span>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <table style={{
                                                                        borderCollapse: 'collapse',
                                                                        width: '100%',
                                                                        height: '72px'
                                                                    }} border={1}>
                                                                        <tbody>
                                                                        <tr style={{height: '18px'}}>
                                                                            <td style={{
                                                                                width: '100%',
                                                                                height: '18px'
                                                                            }}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Document
                            Title <input
                                                                                    value={this.state.docTitle2}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docTitle2: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{width: '100%', border: 0}}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr style={{height: '18px'}}>
                                                                            <td style={{
                                                                                width: '100%',
                                                                                height: '18px'
                                                                            }}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Issuing
                            Authority <input
                                                                                    value={this.state.Issuing2}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            Issuing2: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{width: '100%', border: 0}}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr style={{height: '18px'}}>
                                                                            <td style={{
                                                                                width: '100%',
                                                                                height: '18px'
                                                                            }}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Document
                            Number <input
                                                                                    value={this.state.docNumb3}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docNumb3: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{width: '100%', border: 0}}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr style={{height: '18px'}}>
                                                                            <td style={{
                                                                                width: '100%',
                                                                                height: '18px'
                                                                            }}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>
                            Expiration Date (if any)(mm/dd/yyyy) <input
                                                                                value={this.state.expDate3}
                                                                                onChange={(e) => {
                                                                                    this.setState({
                                                                                        expDate3: e.target.value
                                                                                    })
                                                                                }}
                                                                                style={{width: '100%', border: 0}}
                                                                                type="text"/></span>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <table style={{
                                                                        borderCollapse: 'collapse',
                                                                        width: '100%',
                                                                        height: '72px'
                                                                    }} border={1}>
                                                                        <tbody>
                                                                        <tr style={{height: '18px'}}>
                                                                            <td style={{
                                                                                width: '100%',
                                                                                height: '18px'
                                                                            }}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Document
                            Title <input
                                                                                    value={this.state.docT15}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docT15: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{width: '100%', border: 0}}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr style={{height: '18px'}}>
                                                                            <td style={{
                                                                                width: '100%',
                                                                                height: '18px'
                                                                            }}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Issuing
                            Authority <input
                                                                                    value={this.state.IssuingT15}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            IssuingT15: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{width: '100%', border: 0}}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr style={{height: '18px'}}>
                                                                            <td style={{
                                                                                width: '100%',
                                                                                height: '18px'
                                                                            }}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Document
                            Number <input
                                                                                    value={this.state.docT16}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docT16: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{width: '100%', border: 0}}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr style={{height: '18px'}}>
                                                                            <td style={{
                                                                                width: '100%',
                                                                                height: '18px'
                                                                            }}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>
                            Expiration Date (if any)(mm/dd/yyyy) <input
                                                                                value={this.state.docT17}
                                                                                onChange={(e) => {
                                                                                    this.setState({
                                                                                        docT17: e.target.value
                                                                                    })
                                                                                }}
                                                                                style={{width: '100%', border: 0}}
                                                                                type="text"/></span>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                                <td style={{
                                                                    width: '1.0735%',
                                                                    height: '98px',
                                                                    backgroundColor: '#bec1c3'
                                                                }}>&nbsp;</td>
                                                                <td style={{
                                                                    width: '65.5931%',
                                                                    height: '98px',
                                                                    verticalAlign: 'top'
                                                                }}>
                                                                    <table style={{
                                                                        borderCollapse: 'collapse',
                                                                        width: '100%',
                                                                        height: '68px'
                                                                    }} border={0}>
                                                                        <tbody>
                                                                        <tr style={{height: '17px'}}>
                                                                            <td style={{width: '50%', height: '17px'}}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Document
                            Title <input
                                                                                    value={this.state.docT18}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docT18: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        border: 0,
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }}
                                                                                    type="text"/></span></td>
                                                                            <td style={{width: '50%', height: '17px'}}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Document
                            Title <input
                                                                                    value={this.state.docT19}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docT19: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        border: 0,
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr style={{height: '17px'}}>
                                                                            <td style={{width: '50%', height: '17px'}}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Issuing
                            Authority <input
                                                                                    value={this.state.docT20}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docT20: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        border: 0,
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }}
                                                                                    type="text"/></span></td>
                                                                            <td style={{width: '50%', height: '17px'}}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Issuing
                            Authority <input
                                                                                    value={this.state.docT21}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docT21: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        border: 0,
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr style={{height: '17px'}}>
                                                                            <td style={{width: '50%', height: '17px'}}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Document
                            Number <input
                                                                                    value={this.state.docT22}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docT22: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        border: 0,
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }}
                                                                                    type="text"/></span></td>
                                                                            <td style={{width: '50%', height: '17px'}}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Document
                            Number<input
                                                                                    value={this.state.docL1}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docL1: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        border: 0,
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }}
                                                                                    type="text"/></span></td>
                                                                        </tr>
                                                                        <tr style={{height: '17px'}}>
                                                                            <td style={{width: '50%', height: '17px'}}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Expiration
                            Date (if any)(mm/dd/yyyy) <input
                                                                                    value={this.state.docL2}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docL2: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        border: 0,
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }} type="text"/></span></td>
                                                                            <td style={{width: '50%', height: '17px'}}><span
                                                                                style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Expiration
                            Date (if any)(mm/dd/yyyy) <input
                                                                                    value={this.state.docL3}
                                                                                    onChange={(e) => {
                                                                                        this.setState({
                                                                                            docL3: e.target.value
                                                                                        })
                                                                                    }}
                                                                                    style={{
                                                                                        width: '100%',
                                                                                        border: 0,
                                                                                        borderBottom: 'solid 1px #000'
                                                                                    }} type="text"/></span></td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                    <table style={{
                                                                        borderCollapse: 'collapse',
                                                                        width: '100%',
                                                                        height: '297px'
                                                                    }} border={0}>
                                                                        <tbody>
                                                                        <tr style={{height: '297px', verticalAlign: 'top'}}>
                                                                            <td style={{width: '62.476%', height: '297px'}}>
                                                                                <div style={{
                                                                                    width: '250px',
                                                                                    height: '250px',
                                                                                    border: 'solid 1px #000'
                                                                                }}><span style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>Additional
                              Information</span></div>
                                                                            </td>
                                                                            <td style={{width: '37.524%', height: '297px'}}>
                                                                                <div style={{
                                                                                    width: '150px',
                                                                                    height: '150px',
                                                                                    border: 'solid 1px #000'
                                                                                }}><span style={{
                                                                                    color: '#000000',
                                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                                    fontSize: '10pt'
                                                                                }}>QR
                              Code - Sections 2 &amp; 3</span></div>
                                                                            </td>
                                                                        </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <p><span style={{
                                                            color: '#000000',
                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                            fontSize: '10pt'
                                                        }}><strong>Certification:
                I attest, under penalty of perjury, that (1) I have examined the document(s) presented by the
                above-named employee, (2) the above-listed document(s) appear to be genuine and to relate to the
                employee named, and (3) to the best of my knowledge the employee is authorized to work in the United
                States.</strong></span></p>
                                                        <p><span style={{
                                                            color: '#000000',
                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                            fontSize: '10pt'
                                                        }}><strong>The
                employee's first day of employment (mm/dd/yyyy):&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                                            &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; (See instructions for exemptions)</strong></span>
                                                        </p>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '39.6135%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Signature
                    of Employer or Authorized Representative <img style={{
                                                                        width: '100px',
                                                                        height: '30px',
                                                                        display: 'inline-block',
                                                                        backgroundColor: '#f9f9f9',
                                                                        cursor: 'pointer'
                                                                    }} onClick={() => {
                                                                        if (this.state.isCreated === false) {
                                                                            this.setState({
                                                                                signType: 2
                                                                            }, () => {
                                                                                this.setState({
                                                                                    openSignature: true,
                                                                                })
                                                                            });
                                                                        }
                                                                    }}
                                                                  src={this.state.signature2} alt=""/></span></td>
                                                                <td style={{width: '19.431%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Today's
                    Date(mm/dd/yyyy) <input
                                                                        value={this.state.docL5}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                docL5: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '40.9554%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Title of
                    Employer or Authorized Representative <input
                                                                        value={this.state.docL6}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                docL6: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '33.3333%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Last
                    Name of Employer or Authorized Representative <input
                                                                        value={this.state.docL7}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                docL7: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '33.3333%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>First
                    Name of Employer or Authorized Representative <input
                                                                        value={this.state.docL8}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                docL8: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '33.3333%'}}>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>Employer's
                      Business or Organization Name</span></p>
                                                                    <p style={{paddingLeft: '40px'}}><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><strong>Tummi
                        Staffing, Inc.</strong></span></p>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '35.5207%'}}>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>Employer's
                      Business or Organization Address (Street Number and Name)</span></p>
                                                                    <p style={{paddingLeft: '40px'}}><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><strong>PO
                        Box 592715</strong></span></p>
                                                                </td>
                                                                <td style={{width: '45.2361%'}}>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>City
                      or Town</span></p>
                                                                    <p style={{paddingLeft: '40px'}}><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><strong>
                        San Antonio </strong></span></p>
                                                                </td>
                                                                <td style={{width: '6.3205%'}}>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>State</span>
                                                                    </p>
                                                                    <p style={{paddingLeft: '40px'}}><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><strong>TX</strong></span>
                                                                    </p>
                                                                </td>
                                                                <td style={{width: '12.9227%'}}>
                                                                    <p><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}>Zip
                      Code</span></p>
                                                                    <p style={{paddingLeft: '40px'}}><span style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><strong>78259</strong></span>
                                                                    </p>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <p>&nbsp;</p>
                                                        <table style={{
                                                            borderCollapse: 'collapse',
                                                            width: '100%',
                                                            height: '51px'
                                                        }}
                                                               border={1}>
                                                            <tbody>
                                                            <tr style={{height: '17px'}}>
                                                                <td style={{
                                                                    width: '25%',
                                                                    height: '17px',
                                                                    backgroundColor: '#bec1c3'
                                                                }} colSpan={4}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}><strong>Section
                      3. Reverification and Rehires (To be completed and signed by employer or authorized
                      representative.)</strong></span></td>
                                                            </tr>
                                                            <tr style={{height: '17px'}}>
                                                                <td style={{width: '25%', height: '17px'}} colSpan={2}><span
                                                                    style={{
                                                                        color: '#000000',
                                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                                        fontSize: '10pt'
                                                                    }}><strong>A.</strong>
                    New Name (if applicable)</span></td>
                                                                <td style={{width: '25%', height: '17px'}}>&nbsp;</td>
                                                                <td style={{width: '25%', height: '17px'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}><strong>B.</strong>
                    Date of Rehire (if applicable)</span></td>
                                                            </tr>
                                                            <tr style={{height: '17px'}}>
                                                                <td style={{width: '25%', height: '17px'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Last
                    Name (Family Name) <input
                                                                        value={this.state.docL9}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                docL9: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '25%', height: '17px'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>First
                    Name (Given Name) <input
                                                                        value={this.state.docP1}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                docP1: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '25%', height: '17px'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Middle
                    Initial <input
                                                                        value={this.state.docP2}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                docP2: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '25%', height: '17px'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Date
                    (mm/dd/yyyy) <input
                                                                        value={this.state.docP3}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                docP3: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <p><span style={{
                                                            color: '#000000',
                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                            fontSize: '10pt'
                                                        }}>&nbsp;</span></p>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '99.9999%', backgroundColor: '#bec1c3'}}
                                                                    colSpan={3}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}><strong>C.</strong>
                    If the employee's previous grant of employment authorization has expired, provide the
                    information for the document or receipt that establishes continuing employment authorization
                    in the space provided below.</span></td>
                                                            </tr>
                                                            <tr>
                                                                <td style={{width: '37.5841%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Signature
                    of Employer or Authorized Representative <img style={{
                                                                        width: '100px',
                                                                        height: '30px',
                                                                        display: 'inline-block',
                                                                        backgroundColor: '#f9f9f9',
                                                                        cursor: 'pointer'
                                                                    }} onClick={() => {
                                                                        if (this.state.isCreated === false) {
                                                                            this.setState({
                                                                                signType: 3
                                                                            }, () => {
                                                                                this.setState({
                                                                                    openSignature: true,
                                                                                })
                                                                            });
                                                                        }
                                                                    }}
                                                                  src={this.state.signature3} alt=""/></span></td>
                                                                <td style={{width: '28.3386%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Today's
                    Date (mm/dd/yyyy) <input
                                                                        value={this.state.tdayDate}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                tdayDate: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '34.0772%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Name of
                    Employer or Authorized Representative <input
                                                                        value={this.state.employeerAuth2}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                employeerAuth2: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <p><span style={{
                                                            color: '#000000',
                                                            fontFamily: 'arial, helvetica, sans-serif',
                                                            fontSize: '10pt'
                                                        }}><strong>I attest,
                under penalty of perjury, that to the best of my knowledge, this employee is authorized to work in
                the United States, and if the employee presented document(s), the document(s) I have examined appear
                to be genuine and to relate to the individual.</strong></span></p>
                                                        <table style={{borderCollapse: 'collapse', width: '100%'}}
                                                               border={1}>
                                                            <tbody>
                                                            <tr>
                                                                <td style={{width: '37.5841%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Signature
                    of Employer or Authorized Representative <img style={{
                                                                        width: '100px',
                                                                        height: '30px',
                                                                        display: 'inline-block',
                                                                        backgroundColor: '#f9f9f9',
                                                                        cursor: 'pointer'
                                                                    }} onClick={() => {
                                                                        if (this.state.isCreated === false) {
                                                                            this.setState({
                                                                                signType: 4
                                                                            }, () => {
                                                                                this.setState({
                                                                                    openSignature: true,
                                                                                })
                                                                            });
                                                                        }
                                                                    }}
                                                                  src={this.state.signature4} alt=""/></span></td>
                                                                <td style={{width: '27.0634%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Today's
                    Date (mm/dd/yyyy) <input
                                                                        value={this.state.todayDateDay1}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                todayDateDay1: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span></td>
                                                                <td style={{width: '35.3524%'}}><span style={{
                                                                    color: '#000000',
                                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                                    fontSize: '10pt'
                                                                }}>Name of
                    Employer or Authorized Representative <input
                                                                        value={this.state.empAuth15}
                                                                        onChange={(e) => {
                                                                            this.setState({
                                                                                empAuth15: e.target.value
                                                                            })
                                                                        }}
                                                                        style={{width: '100%', border: 0}}
                                                                        type="text"/></span>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                    <img src="https://i.imgur.com/yP3pq57.png" width="100%" alt/>
                                                </div>
                                            </div>
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

export default withApollo(withGlobalContent(FormsI9));
