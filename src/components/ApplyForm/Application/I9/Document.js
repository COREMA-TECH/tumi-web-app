import React, {Fragment} from 'react';

const EMPTY_FUNCTION = _ => {}; 

/**
 * 
 * @param {Object} props 
 * @param {function} props.setState handle state
 * @param {Object} props.data information to show
 * @param {*} props.data.lastName
 * @param {*} props.data.firstName
 * @param {*} props.data.middleName
 * @param {*} props.data.otherLastName
 * @param {*} props.data.streetNumber
 * @param {*} props.data.aptNumber
 * @param {*} props.data.city
 * @param {*} props.data.state
 * @param {*} props.data.zipCode
 * @param {*} props.data.dateOfBirth
 * @param {*} props.data.socialSecurityNumber
 * @param {*} props.data.email
 * @param {*} props.data.telephone
 * @param {*} props.data.oneCheck
 * @param {*} props.data.oneCheck1
 * @param {*} props.data.oneCheck2
 * @param {*} props.data.oneCheck3Explain
 * @param {*} props.data.oneCheck3
 * @param {*} props.data.alienExplain
 * @param {*} props.data.alienRegister
 * @param {*} props.data.admissionNumber
 * @param {*} props.data.foreignPassport
 * @param {*} props.data.countryIssuance
 * @param {*} props.data.signature
 * @param {*} props.data.todayDate
 * @param {*} props.data.preparer0
 * @param {*} props.data.preparer1
 * @param {*} props.data.signature1
 * @param {*} props.data.todayDate2
 * @param {*} props.data.lastName2
 * @param {*} props.data.firstName2
 * @param {*} props.data.address2
 * @param {*} props.data.city2
 * @param {*} props.data.state2
 * @param {*} props.data.zipCode2
 * @param {*} props.data.docTitle
 * @param {*} props.data.Issuing
 * @param {*} props.data.docNumber
 * @param {*} props.data.expireDate2
 * @param {*} props.data.docTitle2
 * @param {*} props.data.Issuing2
 * @param {*} props.data.docNumb3
 * @param {*} props.data.expDate3
 * @param {*} props.data.docT15
 * @param {*} props.data.IssuingT15
 * @param {*} props.data.docT16
 * @param {*} props.data.docT17
 * @param {*} props.data.docT18
 * @param {*} props.data.docT19
 * @param {*} props.data.docT20
 * @param {*} props.data.docT21
 * @param {*} props.data.docT22
 * @param {*} props.data.docL1
 * @param {*} props.data.docL2
 * @param {*} props.data.docL3
 * @param {*} props.data.signature2
 * @param {*} props.data.docL5
 * @param {*} props.data.docL6
 * @param {*} props.data.docL7
 * @param {*} props.data.docL8
 * @param {*} props.data.docL9
 * @param {*} props.data.docP1
 * @param {*} props.data.docP2
 * @param {*} props.data.docP3
 * @param {*} props.data.signature4
 * @param {*} props.data.todayDateDay1
 * @param {*} props.data.empAuth15
 */

const Document = props => {
    const setState = props.setState || EMPTY_FUNCTION;
    const {lockFields} = props; // campos desabilitado
    const{ lastName, firstName, middleName, otherLastName, streetNumber, aptNumber, city, state,
        zipCode, dateOfBirth, socialSecurityNumber, email, telephone, oneCheck, oneCheck1, oneCheck2,
        oneCheck3Explain, oneCheck3, alienExplain, alienRegister, admissionNumber, foreignPassport, countryIssuance,
        signature, todayDate, preparer0, preparer1, signature1, todayDate2, lastName2, firstName2, address2, city2, state2,
        zipCode2, docTitle, Issuing, docNumber, expireDate2, docTitle2, Issuing2, docNumb3, expDate3, docT15, IssuingT15, docT16,
        docT17, docT18, docT19, docT20, docT21, docT22, docL1, docL2, docL3, signature2, docL5, docL6, docL7, docL8, docL9, docP1,
        docP2, docP3, signature4, todayDateDay1, empAuth15
    } = props.data;

    return <Fragment>
        <div id="DocumentPDF" className="signature-information">
            <div style={{ width: '100%' }}>
                <img src="https://i.imgur.com/EXoWtMF.png" style={{ width: '100%' }} alt />
                <div data-font-name="g_d0_f3" data-angle={0}
                    data-canvas-width="16.334999999999997"><span style={{
                        color: '#000000',
                        fontFamily: 'arial, helvetica, sans-serif',
                        fontSize: '8pt',
                        fontWeight: '900'
                    }}>
                        ►&nbsp;START HERE: Read instructions carefully before completing this form. The instructions must be
                        available, either in paper or electronically, during completion of this form. Employers are liable for
                    errors in the completion of this form.</span>
                </div>
                <div data-font-name="Helvetica" data-angle={0}
                    data-canvas-width="234.99000000000004"><span style={{
                        color: '#000000',
                        fontFamily: 'arial, helvetica, sans-serif',
                        fontSize: '8pt'
                    }}>
                        <span style={{ fontWeight: '900' }}>ANTI-DISCRIMINATION NOTICE: </span>
                        It is illegal to discriminate against work-authorized individuals. Employers
                    <span style={{ fontWeight: '900' }}>CANNOT</span> specify which document(s) an employee may present to establish employment
                            authorization and identity. The refusal to hire or continue to employ an individual because the
                            documentation presented has a future expiration date may also constitute illegal discrimination.
                </span>
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
                            <tr style={{ height: '17px' }}>
                                <td style={{ width: '100%', height: '17px' }}>
                                    <div data-font-name="Helvetica" data-angle={0}
                                        data-canvas-width="422.76666666666665"><span
                                            style={{
                                                color: '#000000',
                                                fontFamily: 'arial, helvetica, sans-serif',
                                                fontSize: '8pt'
                                            }}>
                                            <span style={{ fontWeight: '900' }}>Section 1. Employee Information and Attestation</span> (Employees must complete
                                        and sign Section 1 of Form I-9 no later than the<em> <span style={{ fontWeight: '900' }}>first day of employment</span> </em>, but not before accepting a job offer.)
                                    </span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '25%' }}>
                                    <div data-font-name="g_d0_f5" data-angle={0}
                                        data-canvas-width="68.17333333333332"><span
                                            style={{
                                                color: '#000000',
                                                fontFamily: 'arial, helvetica, sans-serif',
                                                fontSize: '8pt'
                                            }}>Last Name&nbsp;(Family Name) <input
                                                value={lastName}
                                                onChange={(e) => {
                                                    setState({
                                                        lastName: e.target.value
                                                    })
                                                }} style={{ border: 0, width: '100%' }}
                                                type="text"
                                                id="lastName" /></span>
                                    </div>
                                </td>
                                <td style={{ width: '25%' }}>
                                    <span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>First Name (Given Name)
                                    <input value={firstName}
                                            onChange={(e) => {
                                                setState({
                                                    firstName: e.target.value
                                                })
                                            }} style={{ border: 0, width: '100%' }} type="text" id="firstName" />
                                    </span>
                                </td>
                                <td style={{ width: '25%' }}>
                                    <span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>Middle Initial
                                    <input value={middleName}
                                            onChange={(e) => {
                                                setState({
                                                    middleName: e.target.value
                                                })
                                            }} style={{ border: 0, width: '100%' }} type="text" id="middleInitia" />
                                    </span>
                                </td>
                                <td style={{ width: '25%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Other
Last Names Used (if any) <input value={otherLastName}
                                        onChange={(e) => {
                                            setState({
                                                otherLastName: e.target.value
                                            })
                                        }} style={{ border: 0, width: '100%' }} type="text"
                                        id="otherLastName" /></span>
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
                            <tr style={{ height: '17px' }}>
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
                                                fontSize: '8pt'
                                            }}>Address
(Street Number and Name) <input value={streetNumber}
                                                onChange={(e) => {
                                                    setState({
                                                        streetNumber: e.target.value
                                                    })
                                                }} style={{ border: 0, width: '100%' }} type="text"
                                                id="address" /></span>
                                    </div>
                                </td>
                                <td style={{
                                    width: '20%',
                                    height: '17px',
                                    verticalAlign: 'top'
                                }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Apt.
Number <input value={aptNumber}
                                            onChange={(e) => {
                                                setState({
                                                    aptNumber: e.target.value
                                                })
                                            }} style={{ border: 0, width: '100%' }} type="text" id="aptNumber" /></span></td>
                                <td style={{
                                    width: '20%',
                                    height: '17px',
                                    verticalAlign: 'top'
                                }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>City or
Town <input value={city}
                                            onChange={(e) => {
                                                setState({
                                                    city: e.target.value
                                                })
                                            }} style={{ border: 0, width: '100%' }} type="text" id="city" /></span></td>
                                <td style={{
                                    width: '20%',
                                    height: '17px',
                                    verticalAlign: 'top'
                                }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>State
<input value={state}
                                            onChange={(e) => {
                                                setState({
                                                    state: e.target.value
                                                })
                                            }} style={{ border: 0, width: '100%' }} type="text" id="state" /></span></td>
                                <td style={{
                                    width: '20%',
                                    height: '17px',
                                    verticalAlign: 'top'
                                }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>ZIP Code
<input value={zipCode}
                                            onChange={(e) => {
                                                setState({
                                                    zipCode: e.target.value
                                                })
                                            }} style={{ border: 0, width: '100%' }} type="text" id="zipCode" /></span></td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '25%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Date of
Birth (mm/dd/yyyy) <input value={dateOfBirth}
                                        onChange={(e) => {
                                            setState({
                                                dateOfBirth: e.target.value
                                            })
                                        }} style={{ border: 0, width: '100%' }} type="text"
                                        id="dateOfBirth" /></span>
                                </td>
                                <td style={{ width: '25%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>U.S.
Social Security Number <input value={socialSecurityNumber}
                                        onChange={(e) => {
                                            setState({
                                                socialSecurityNumber: e.target.value
                                            })
                                        }} style={{ border: 0, width: '100%' }} type="text"
                                        id="socialSecurityNumber" /></span></td>
                                <td style={{ width: '25%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Employee's
E-mail Address <input value={email}
                                        onChange={(e) => {
                                            setState({
                                                email: e.target.value
                                            })
                                        }} style={{ border: 0, width: '100%' }} type="text" id="email" /></span></td>
                                <td style={{ width: '25%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Employee's
Telephone Number <input value={telephone}
                                        onChange={(e) => {
                                            setState({
                                                telephone: e.target.value
                                            })
                                        }} style={{ border: 0, width: '100%' }} type="text" id="telephone" /></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p>
                        <span style={{
                            color: '#000000',
                            fontFamily: 'arial, helvetica, sans-serif',
                            fontSize: '8pt',
                            fontWeight: '900'
                        }}>
                            I am aware that federal law provides for imprisonment and/or fines for false statements or use of false documents in connection with the completion of this form.
                        </span>
                    </p>
                    <p>
                        <span style={{
                            color: '#000000',
                            fontFamily: 'arial, helvetica, sans-serif',
                            fontSize: '8pt',
                            fontWeight: '900'
                        }}>I attest, under penalty of perjury, that I am (check one of the following boxes):
                        </span>
                    </p>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '100%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}> <input
                                        name="status"
                                        value={oneCheck}
                                        defaultChecked={oneCheck}
                                        style={{ display: "none" }}
                                        onChange={(e) => {
                                            setState({
                                                oneCheck: e.target.checked,
                                                oneCheck1: false,
                                                oneCheck2: false,
                                                oneCheck3: false,
                                            })
                                        }} type="radio" id="citizen" />

                                    <label style={{ fontSize: "18px", paddingLeft: "5px" }} htmlFor="citizen"
                                        dangerouslySetInnerHTML={{
                                            __html: `${oneCheck ? '&#10003;' : '&#9633;'}`
                                        }}
                                    />
                                    1. A citizen of the United States
                                </span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '100%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}> <input value={oneCheck1}
                                    defaultChecked={oneCheck1}
                                    name="status"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        setState({
                                            oneCheck1: e.target.checked,
                                            oneCheck: false,
                                            oneCheck2: false,
                                            oneCheck3: false,
                                        })
                                    }} type="radio" id="non-citizen" />

                                    <label style={{ fontSize: "18px", paddingLeft: "5px" }} htmlFor="non-citizen"
                                        dangerouslySetInnerHTML={{
                                            __html: `${oneCheck1 ? '&#10003;' : '&#9633;'}`
                                        }}
                                    />
                                    2. A noncitizen national of the United States (See instructions)</span>
                                </td>
                            </tr>
                            <tr>
                                <td style={{ width: '100%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}> <input value={oneCheck2}
                                    defaultChecked={oneCheck2}
                                    name="status"
                                    style={{ display: "none" }}
                                    onChange={(e) => {
                                        setState({
                                            oneCheck2: e.target.checked,
                                            oneCheck: false,
                                            oneCheck1: false,
                                            oneCheck3: false,
                                        })
                                    }} type="radio"
                                    id="lowful-permanent-resident"
                                    />
                                    <label style={{ fontSize: "18px", paddingLeft: "5px" }} htmlFor="lowful-permanent-resident"
                                        dangerouslySetInnerHTML={{
                                            __html: `${oneCheck2 ? '&#10003;' : '&#9633;'}`
                                        }}
                                    />
                                    3. A lawful permanent resident (Alien Registration Number/USCIS Number):&nbsp; &nbsp;


                                <input
                                        name="status"
                                        // defaultChecked={this.state.oneCheck3Explain}
                                        value={oneCheck3Explain}
                                        onChange={(e) => {
                                            setState({
                                                oneCheck3Explain: e.target.value,
                                            })
                                        }}
                                        id="resident-explain"
                                        style={{
                                            border: 0,
                                            borderBottom: '1px solid #000'
                                        }}
                                        type="text"
                                    />

                                </span>
                                </td>
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
                                        fontSize: '8pt'
                                    }}>
                                        <input value={oneCheck3}
                                            name="status"
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                setState({
                                                    oneCheck3: e.target.checked,
                                                    oneCheck: false,
                                                    oneCheck1: false,
                                                    oneCheck2: false,
                                                })
                                            }} type="radio" id="alien"
                                        />

                                        <label style={{ fontSize: "18px", paddingLeft: "5px" }} htmlFor="alien"
                                            dangerouslySetInnerHTML={{
                                                __html: `${oneCheck3 ? '&#10003;' : '&#9633;'}`
                                            }}
                                        />

                                        4. An alien authorized to work until (expiration date, if
                                applicable, mm/dd/yyyy) : <input
                                            value={alienExplain}
                                            onChange={(e) => {
                                                setState({
                                                    alienExplain: e.target.value
                                                })
                                            }}
                                            id="alien-explain"
                                            style={{
                                                border: 0,
                                                borderBottom: '1px solid #000'
                                            }}
                                            type="text" /></span>
                                    </p>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>&nbsp;
                                                &nbsp; Some aliens may write "N/A" in the expiration date field. (See
instructions)</span></p>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}><em>Aliens
authorized to work must provide only one of the following document numbers to
complete Form I-9: An Alien Registration Number/USCIS Number OR Form I-94 Admission
Number OR Foreign Passport&nbsp; &nbsp; &nbsp; Number.</em></span></p>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>1.Alien
Registration Number/USCIS Number: <input
                                            value={alienRegister}
                                            onChange={(e) => {
                                                setState({
                                                    alienRegister: e.target.value
                                                })
                                            }}
                                            style={{
                                                border: 0,
                                                borderBottom: '1px solid #000'
                                            }}
                                            type="text"
                                            id="alien-register-number" /></span>
                                    </p>
                                    <p style={{ paddingLeft: '80px' }}>
                                        <span style={{
                                            color: '#000000',
                                            fontFamily: 'arial, helvetica, sans-serif',
                                            fontSize: '8pt'
                                        }}><span style={{ fontWeight: '900' }}>OR</span>
                                        </span>
                                    </p>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>2.Form
I-94 Admission Number: <input
                                            value={admissionNumber}
                                            onChange={(e) => {
                                                setState({
                                                    admissionNumber: e.target.value
                                                })
                                            }}
                                            style={{
                                                border: 0,
                                                borderBottom: '1px solid #000'
                                            }} type="text"
                                            id="admision-number" /></span></p>
                                    <p style={{ paddingLeft: '80px' }}><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}><span style={{ fontWeight: '900' }}>OR</span>
                                    </span></p>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>3.Foreign
Passport Number: <input
                                            value={foreignPassport}
                                            onChange={(e) => {
                                                setState({
                                                    foreignPassport: e.target.value
                                                })
                                            }}
                                            style={{
                                                border: 0,
                                                borderBottom: '1px solid #000'
                                            }} type="text"
                                            id="foreign-passport-number" /></span></p>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>&nbsp;
                                    &nbsp; Country of Issuance: <input
                                            value={countryIssuance}
                                            onChange={(e) => {
                                                setState({
                                                    countryIssuance: e.target.value
                                                })
                                            }}
                                            style={{
                                                border: 0,
                                                borderBottom: '1px solid #000'
                                            }}
                                            type="text" id="country-issuance" /></span>
                                    </p>
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
                                            <tr style={{ height: '195px' }}>
                                                <td style={{
                                                    width: '100%',
                                                    height: '195px',
                                                    verticalAlign: 'top',
                                                    textAlign: 'center'
                                                }}>
                                                    <span
                                                        style={{ color: '#000000', fontFamily: 'arial, helvetica, sans-serif', fontSize: '8pt' }}>QR
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
                        fontSize: '8pt'
                    }}>&nbsp;</span></p>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '50%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Signature
of Employee:
                                    <img id="employee-signature-box" src={signature} style={{
                                        width: '100px',
                                        height: '30px',
                                        display: 'inline-block',
                                        backgroundColor: '#f9f9f9',
                                        // cursor: 'pointer'
                                    }} onClick={() => {
                                        // if (this.state.isCreated === false) {
                                        //     this.setState({
                                        //         signType: 0
                                        //     }, () => {
                                        //         this.setState({
                                        //             openSignature: true,
                                        //         })
                                        //     });
                                        // }
                                    }}
                                        alt="" />
                                </span></td>
                                <td style={{ width: '50%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Today's
Date (mm/dd/yyyy) <input
                                        value={todayDate}
                                        onChange={(e) => {
                                            setState({
                                                todayDate: e.target.value
                                            })
                                        }}
                                        id="today-date"
                                        style={{ border: 0, width: '100%' }}
                                        type="text" /></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p><span style={{
                        color: '#000000',
                        fontFamily: 'arial, helvetica, sans-serif',
                        fontSize: '8pt'
                    }}>&nbsp;</span></p>
                    <table style={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        height: '17px',
                        backgroundColor: '#bec1c3'
                    }} border={1}>
                        <tbody>
                            <tr style={{ height: '17px' }}>
                                <td style={{ width: '100%', height: '17px' }}>
                                    <h3>
                                        <span style={{
                                            color: '#000000',
                                            fontFamily: 'arial, helvetica, sans-serif',
                                            fontSize: '11pt',
                                            fontWeight: '900'
                                        }}>Preparer and/or Translator Certification (check one):
                                    </span>
                                    </h3>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>
                                        <input
                                            checked={preparer0}
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                setState({
                                                    preparer0: e.target.checked,
                                                })
                                            }}
                                            type="checkbox" id="preparer-0"
                                        />
                                        <label style={{ fontSize: "18px", paddingLeft: "5px" }} htmlFor="preparer-0"
                                            dangerouslySetInnerHTML={{
                                                __html: `${preparer0 ? '&#10003;' : '&#9633;'}`
                                            }}
                                        />
                                        I did not use a preparer or translator.

                                <input
                                            checked={preparer1}
                                            style={{ display: "none" }}
                                            onChange={(e) => {
                                                setState({
                                                    preparer1: e.target.checked,
                                                })
                                            }}
                                            type="checkbox" id="preparer-1"
                                        />
                                        <label style={{ fontSize: "18px", paddingLeft: "5px" }} htmlFor="preparer-1"
                                            dangerouslySetInnerHTML={{
                                                __html: `${preparer1 ? '&#10003;' : '&#9633;'}`
                                            }}
                                        />
                                        I A preparer(s) and/or translator(s) assisted the employee in completing Section 1.</span></p>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
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
                        fontSize: '8pt',
                        fontWeight: '900'
                    }}>I attest,
under penalty of perjury, that I have assisted in the completion of Section 1 of this form and that
to the best of my knowledge the information is true and correct.</span></p>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '65.2979%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Signature
of Preparer or Translator <img style={{
                                        width: '100px',
                                        height: '30px',
                                        display: 'inline-block',
                                        backgroundColor: '#f9f9f9',
                                        cursor: 'pointer'
                                    }} onClick={() => {
                                        setState({
                                            signType: 1
                                        }, () => {
                                            setState({
                                                openSignature: true,
                                            })
                                        });
                                    }}
                                        src={signature1} alt="" /></span></td>
                                <td style={{ width: '34.7021%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Today's
Date (mm/dd/yyyy) <input
                                        value={todayDate2}
                                        onChange={(e) => {
                                            setState({
                                                todayDate2: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
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
                            <tr style={{ height: '17px' }}>
                                <td style={{ width: '50%', height: '17px' }}><span
                                    style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>Last
Name (Family Name) <input
                                        value={lastName2}
                                        onChange={(e) => {
                                            setState({
                                                lastName2: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                                <td style={{ width: '50%', height: '17px' }}><span
                                    style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>First
Name (Given Name) <input
                                        value={firstName2}
                                        onChange={(e) => {
                                            setState({
                                                firstName2: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
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
                                <td style={{ width: '31.9243%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Address
(Street Number and Name) <input
                                        value={address2}
                                        onChange={(e) => {
                                            setState({
                                                address2: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                                <td style={{ width: '41.2641%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>City or
Town <input
                                        value={city2}
                                        onChange={(e) => {
                                            setState({
                                                city2: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                                <td style={{ width: '6.80349%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>State
<input
                                        value={state2}
                                        onChange={(e) => {
                                            setState({
                                                state2: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }} type="text" /></span></td>
                                <td style={{ width: '20.0081%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>ZIP Code
<input
                                        value={zipCode2}
                                        onChange={(e) => {
                                            setState({
                                                zipCode2: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }} type="text" /></span></td>
                            </tr>
                        </tbody>
                    </table>
                    <img src="https://i.imgur.com/yP3pq57.png" style={{ width: '100%' }} alt />
                    <img src="https://i.imgur.com/EXoWtMF.png" style={{ width: '100%' }} alt />
                    <table style={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        backgroundColor: '#bec1c3'
                    }} border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '100%' }}>
                                    <h3><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '11pt',
                                        fontWeight: '900'
                                    }}>Section 2. Employer or Authorized Representative Review and Verification
                                </span>
                                    </h3>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>(Employers
or their authorized representative must complete and sign Section 2 within 3 business
days of the employee's first day of employment. You must physically examine one document
from List A OR a combination of one document from List B and one document from List C as
listed on the "Lists of Acceptable Documents.")</span></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '18.438%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}><strong>Employee
Info from Section 1</strong></span></td>
                                <td style={{ width: '25.7381%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Last
Name (Family Name)</span></td>
                                <td style={{ width: '32.9576%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>First
Name (Given Name)</span></td>
                                <td style={{ width: '6.19971%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>M.I.</span>
                                </td>
                                <td style={{ width: '16.6667%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Citizenship/Immigration
Status</span></td>
                            </tr>
                        </tbody>
                    </table>

                    <table style={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        fontSize: '8pt'
                    }}
                    >
                        <tbody>
                            <tr>
                                <td style={{ width: '31.07%', textAlign: 'center', fontWeight: '900' }}>
                                    List A <br />
                                    Identity and employment Authorization
                                </td>
                                <td style={{ width: '5%', textAlign: 'center', fontWeight: '900', verticalAlign: 'top' }}>OR</td>
                                <td style={{ width: '28.83%', textAlign: 'center', fontWeight: '900' }}>
                                    List B <br />
                                    Identity
                                </td>
                                <td style={{ width: '5%', textAlign: 'center', fontWeight: '900', verticalAlign: 'top' }}>AND</td>
                                <td style={{ width: '30%', textAlign: 'center', fontWeight: '900' }}>
                                    List C <br />
                                    Employment Authorization
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{
                        borderCollapse: 'collapse',
                        width: '100%',
                        height: '98px'
                    }}
                        border={1}>
                        <tbody>
                            <tr style={{ height: '98px' }}>
                                <td style={{ width: '33.3333%', height: '98px' }}>
                                    <table
                                        style={{
                                            borderCollapse: 'collapse',
                                            width: '100%'
                                        }}
                                        border={1}>
                                        <tbody>
                                            <tr>
                                                <td style={{ width: '100%' }}><span style={{
                                                    color: '#000000',
                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                    fontSize: '8pt'
                                                }}>Document
Title <input
                                                        value={docTitle}
                                                        onChange={(e) => {
                                                            setState({
                                                                docTitle: e.target.value
                                                            })
                                                        }}
                                                        disabled={lockFields}
                                                        style={{ width: '100%', border: 0 }}
                                                        type="text" /></span></td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '100%' }}><span style={{
                                                    color: '#000000',
                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                    fontSize: '8pt'
                                                }}>Issuing
Authority <input
                                                        value={Issuing}
                                                        disabled={lockFields}
                                                        onChange={(e) => {
                                                            setState({
                                                                Issuing: e.target.value
                                                            })
                                                        }}
                                                        style={{ width: '100%', border: 0 }}
                                                        type="text" /></span></td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '100%' }}><span style={{
                                                    color: '#000000',
                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                    fontSize: '8pt'
                                                }}>Document
Number <input
                                                        value={docNumber}
                                                        disabled={lockFields}
                                                        onChange={(e) => {
                                                            setState({
                                                                docNumber: e.target.value
                                                            })
                                                        }}
                                                        style={{ width: '100%', border: 0 }}
                                                        type="text" /></span></td>
                                            </tr>
                                            <tr>
                                                <td style={{ width: '100%' }}><span style={{
                                                    color: '#000000',
                                                    fontFamily: 'arial, helvetica, sans-serif',
                                                    fontSize: '8pt'
                                                }}>
                                                    Expiration Date (if any)(mm/dd/yyyy) <input
                                                        value={expireDate2}
                                                        disabled={lockFields}
                                                        onChange={(e) => {
                                                            setState({
                                                                expireDate2: e.target.value
                                                            })
                                                        }}
                                                        style={{ width: '100%', border: 0 }}
                                                        type="text" /></span>
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
                                            <tr style={{ height: '18px' }}>
                                                <td style={{
                                                    width: '100%',
                                                    height: '18px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Document
Title <input
                                                            value={docTitle2}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docTitle2: e.target.value
                                                                })
                                                            }}
                                                            style={{ width: '100%', border: 0 }}
                                                            type="text" /></span></td>
                                            </tr>
                                            <tr style={{ height: '18px' }}>
                                                <td style={{
                                                    width: '100%',
                                                    height: '18px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Issuing
Authority <input
                                                            value={Issuing2}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    Issuing2: e.target.value
                                                                })
                                                            }}
                                                            style={{ width: '100%', border: 0 }}
                                                            type="text" /></span></td>
                                            </tr>
                                            <tr style={{ height: '18px' }}>
                                                <td style={{
                                                    width: '100%',
                                                    height: '18px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Document
Number <input
                                                            value={docNumb3}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docNumb3: e.target.value
                                                                })
                                                            }}
                                                            style={{ width: '100%', border: 0 }}
                                                            type="text" /></span></td>
                                            </tr>
                                            <tr style={{ height: '18px' }}>
                                                <td style={{
                                                    width: '100%',
                                                    height: '18px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>
                                                        Expiration Date (if any)(mm/dd/yyyy) <input
                                                            value={expDate3}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    expDate3: e.target.value
                                                                })
                                                            }}
                                                            style={{ width: '100%', border: 0 }}
                                                            type="text" /></span>
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
                                            <tr style={{ height: '18px' }}>
                                                <td style={{
                                                    width: '100%',
                                                    height: '18px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Document
Title <input
                                                            value={docT15}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docT15: e.target.value
                                                                })
                                                            }}
                                                            style={{ width: '100%', border: 0 }}
                                                            type="text" /></span></td>
                                            </tr>
                                            <tr style={{ height: '18px' }}>
                                                <td style={{
                                                    width: '100%',
                                                    height: '18px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Issuing
Authority <input
                                                            value={IssuingT15}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    IssuingT15: e.target.value
                                                                })
                                                            }}
                                                            style={{ width: '100%', border: 0 }}
                                                            type="text" /></span></td>
                                            </tr>
                                            <tr style={{ height: '18px' }}>
                                                <td style={{
                                                    width: '100%',
                                                    height: '18px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Document
Number <input
                                                            value={docT16}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docT16: e.target.value
                                                                })
                                                            }}
                                                            style={{ width: '100%', border: 0 }}
                                                            type="text" /></span></td>
                                            </tr>
                                            <tr style={{ height: '18px' }}>
                                                <td style={{
                                                    width: '100%',
                                                    height: '18px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>
                                                        Expiration Date (if any)(mm/dd/yyyy) <input
                                                            value={docT17}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docT17: e.target.value
                                                                })
                                                            }}
                                                            style={{ width: '100%', border: 0 }}
                                                            type="text" /></span>
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
                                            <tr style={{ height: '17px' }}>
                                                <td style={{
                                                    width: '50%',
                                                    height: '17px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Document
Title <input
                                                            value={docT18}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docT18: e.target.value
                                                                })
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                border: 0,
                                                                borderBottom: 'solid 1px #000'
                                                            }}
                                                            type="text" /></span></td>
                                                <td style={{
                                                    width: '50%',
                                                    height: '17px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Document
Title <input
                                                            value={docT19}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docT19: e.target.value
                                                                })
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                border: 0,
                                                                borderBottom: 'solid 1px #000'
                                                            }}
                                                            type="text" /></span></td>
                                            </tr>
                                            <tr style={{ height: '17px' }}>
                                                <td style={{
                                                    width: '50%',
                                                    height: '17px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Issuing
Authority <input
                                                            value={docT20}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docT20: e.target.value
                                                                })
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                border: 0,
                                                                borderBottom: 'solid 1px #000'
                                                            }}
                                                            type="text" /></span></td>
                                                <td style={{
                                                    width: '50%',
                                                    height: '17px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Issuing
Authority <input
                                                            value={docT21}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docT21: e.target.value
                                                                })
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                border: 0,
                                                                borderBottom: 'solid 1px #000'
                                                            }}
                                                            type="text" /></span></td>
                                            </tr>
                                            <tr style={{ height: '17px' }}>
                                                <td style={{
                                                    width: '50%',
                                                    height: '17px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Document
Number <input
                                                            value={docT22}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docT22: e.target.value
                                                                })
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                border: 0,
                                                                borderBottom: 'solid 1px #000'
                                                            }}
                                                            type="text" /></span></td>
                                                <td style={{
                                                    width: '50%',
                                                    height: '17px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Document
Number<input
                                                            value={docL1}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docL1: e.target.value
                                                                })
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                border: 0,
                                                                borderBottom: 'solid 1px #000'
                                                            }}
                                                            type="text" /></span></td>
                                            </tr>
                                            <tr style={{ height: '17px' }}>
                                                <td style={{
                                                    width: '50%',
                                                    height: '17px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Expiration
Date (if any)(mm/dd/yyyy) <input
                                                            value={docL2}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docL2: e.target.value
                                                                })
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                border: 0,
                                                                borderBottom: 'solid 1px #000'
                                                            }} type="text" /></span></td>
                                                <td style={{
                                                    width: '50%',
                                                    height: '17px'
                                                }}><span
                                                    style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Expiration
Date (if any)(mm/dd/yyyy) <input
                                                            value={docL3}
                                                            disabled={lockFields}
                                                            onChange={(e) => {
                                                                setState({
                                                                    docL3: e.target.value
                                                                })
                                                            }}
                                                            style={{
                                                                width: '100%',
                                                                border: 0,
                                                                borderBottom: 'solid 1px #000'
                                                            }} type="text" /></span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <table style={{
                                        borderCollapse: 'collapse',
                                        width: '100%',
                                        height: '297px'
                                    }} border={0}>
                                        <tbody>
                                            <tr style={{
                                                height: '297px',
                                                verticalAlign: 'top'
                                            }}>
                                                <td style={{
                                                    width: '62.476%',
                                                    height: '297px'
                                                }}>
                                                    <div style={{
                                                        width: '250px',
                                                        height: '250px',
                                                        border: 'solid 1px #000'
                                                    }}><span style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
                                                    }}>Additional
Information</span></div>
                                                </td>
                                                <td style={{
                                                    width: '37.524%',
                                                    height: '297px'
                                                }}>
                                                    <div style={{
                                                        width: '150px',
                                                        height: '150px',
                                                        border: 'solid 1px #000'
                                                    }}><span style={{
                                                        color: '#000000',
                                                        fontFamily: 'arial, helvetica, sans-serif',
                                                        fontSize: '8pt'
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
                        fontSize: '8pt',
                        fontWeight: '900'
                    }}>Certification:
I attest, under penalty of perjury, that (1) I have examined the document(s) presented by the
above-named employee, (2) the above-listed document(s) appear to be genuine and to relate to the
employee named, and (3) to the best of my knowledge the employee is authorized to work in the United
States.</span></p>
                    <p><span style={{
                        color: '#000000',
                        fontFamily: 'arial, helvetica, sans-serif',
                        fontSize: '8pt',
                        fontWeight: '900'
                    }}>The
employee's first day of employment (mm/dd/yyyy):&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                                &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                        &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; (See instructions for exemptions)</span>
                    </p>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '39.6135%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Signature
of Employer or Authorized Representative <img style={{
                                        width: '100px',
                                        height: '30px',
                                        display: 'inline-block',
                                        backgroundColor: '#f9f9f9',
                                        cursor: 'pointer'
                                    }} onClick={() => {

                                        setState({
                                            signType: 2
                                        }, () => {
                                            setState({
                                                openSignature: true,
                                            })
                                        });

                                    }}
                                        src={signature2} alt="" /></span></td>
                                <td style={{ width: '19.431%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Today's
Date(mm/dd/yyyy) <input
                                        value={docL5}
                                        onChange={(e) => {
                                            setState({
                                                docL5: e.target.value
                                            })
                                        }}
                                        disabled={lockFields}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                                <td style={{ width: '40.9554%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Title of
Employer or Authorized Representative <input
                                        value={docL6}
                                        disabled={lockFields}
                                        onChange={(e) => {
                                            setState({
                                                docL6: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '33.3333%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Last
Name of Employer or Authorized Representative <input
                                        value={docL7}
                                        onChange={(e) => {
                                            setState({
                                                docL7: e.target.value
                                            })
                                        }}
                                        disabled={lockFields}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                                <td style={{ width: '33.3333%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>First
Name of Employer or Authorized Representative <input
                                        value={docL8}
                                        disabled={lockFields}
                                        onChange={(e) => {
                                            setState({
                                                docL8: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                                <td style={{ width: '33.3333%' }}>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>Employer's
Business or Organization Name</span></p>
                                    <p style={{ paddingLeft: '40px' }}><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt',
                                        fontWeight: '900'
                                    }}>Tummi Staffing, Inc.</span></p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '50%' }}>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>Employer's
Business or Organization Address (Street Number and Name)</span></p>
                                    <p style={{ paddingLeft: '40px' }}><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt',
                                        fontWeight: '900'
                                    }}>PO Box 592715</span></p>
                                </td>
                                <td style={{ width: '30%' }}>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>City
or Town</span></p>
                                    <p style={{ paddingLeft: '40px' }}><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt',
                                        fontWeight: '900'
                                    }}>San Antonio </span></p>
                                </td>
                                <td style={{ width: '5%' }}>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>State</span>
                                    </p>
                                    <p style={{ paddingLeft: '40px' }}><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt',
                                        fontWeight: '900'
                                    }}>TX</span></p>
                                </td>
                                <td style={{ width: '15%' }}>
                                    <p><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>Zip
Code</span></p>
                                    <p style={{ paddingLeft: '40px' }}><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt',
                                        fontWeight: '900'
                                    }}>78259</span>
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
                            <tr style={{ height: '17px' }}>
                                <td style={{
                                    width: '25%',
                                    height: '17px',
                                    backgroundColor: '#bec1c3'
                                }} colSpan={4}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}> <span style={{ fontWeight: '900' }}>Section 3. Reverification and Rehires</span> (To be completed and signed by employer or authorized representative.)
                            </span></td>
                            </tr>
                            <tr style={{ height: '17px' }}>
                                <td style={{ width: '25%', height: '17px' }}
                                    colSpan={2}><span
                                        style={{
                                            color: '#000000',
                                            fontFamily: 'arial, helvetica, sans-serif',
                                            fontSize: '8pt'
                                        }}><strong>A.</strong>
                                        New Name (if applicable)</span></td>
                                <td style={{ width: '25%', height: '17px' }}>&nbsp;</td>
                                <td style={{ width: '25%', height: '17px' }}><span
                                    style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}><strong>B.</strong>
                                    Date of Rehire (if applicable)</span></td>
                            </tr>
                            <tr style={{ height: '17px' }}>
                                <td style={{ width: '25%', height: '17px' }}><span
                                    style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>Last
Name (Family Name) <input
                                        value={docL9}
                                        disabled={lockFields}
                                        onChange={(e) => {
                                            setState({
                                                docL9: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                                <td style={{ width: '25%', height: '17px' }}><span
                                    style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>First
Name (Given Name) <input
                                        value={docP1}
                                        disabled={lockFields}
                                        onChange={(e) => {
                                            setState({
                                                docP1: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                                <td style={{ width: '25%', height: '17px' }}><span
                                    style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>Middle
Initial <input
                                        value={docP2}
                                        disabled={lockFields}
                                        onChange={(e) => {
                                            setState({
                                                docP2: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                                <td style={{ width: '25%', height: '17px' }}><span
                                    style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}>Date
(mm/dd/yyyy) <input
                                        value={docP3}
                                        disabled={lockFields}
                                        onChange={(e) => {
                                            setState({
                                                docP3: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                            </tr>
                        </tbody>
                    </table>
                    <p><span style={{
                        color: '#000000',
                        fontFamily: 'arial, helvetica, sans-serif',
                        fontSize: '8pt'
                    }}>&nbsp;</span></p>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{
                                    width: '99.9999%',
                                    backgroundColor: '#bec1c3'
                                }}
                                    colSpan={3}><span style={{
                                        color: '#000000',
                                        fontFamily: 'arial, helvetica, sans-serif',
                                        fontSize: '8pt'
                                    }}><strong>C.</strong>
                                        If the employee's previous grant of employment authorization has expired, provide the
                                        information for the document or receipt that establishes continuing employment authorization
in the space provided below.</span></td>
                            </tr>
                            <tr>
                                <td style={{ width: '37.5841%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}> Document Title
                                <input
                                        // value={this.state}
                                        onChange={(e) => {
                                            // this.setState({
                                            //     docL9: e.target.value
                                            // })
                                        }}
                                        disabled={lockFields}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" />
                                </span></td>
                                <td style={{ width: '28.3386%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>
                                    Document Number
                                <input
                                        // value={this.state}
                                        onChange={(e) => {
                                            // this.setState({
                                            //     docL9: e.target.value
                                            // })
                                        }}
                                        disabled={lockFields}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" />
                                </span></td>
                                <td style={{ width: '34.0772%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>
                                    Expiration Date (if any) (mm/dd/yyyy)
                                <input
                                        // value={this.state}
                                        onChange={(e) => {
                                            // this.setState({
                                            //     docL9: e.target.value
                                            // })
                                        }}
                                        disabled={lockFields}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" />
                                </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <p><span style={{
                        color: '#000000',
                        fontFamily: 'arial, helvetica, sans-serif',
                        fontSize: '8pt',
                        fontWeight: '900'
                    }}>I attest, under penalty of perjury, that to the best of my knowledge, this employee is authorized to work in
the United States, and if the employee presented document(s), the document(s) I have examined appear
to be genuine and to relate to the individual.</span></p>
                    <table style={{ borderCollapse: 'collapse', width: '100%' }}
                        border={1}>
                        <tbody>
                            <tr>
                                <td style={{ width: '37.5841%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Signature
of Employer or Authorized Representative <img style={{
                                        width: '100px',
                                        height: '30px',
                                        display: 'inline-block',
                                        backgroundColor: '#f9f9f9',
                                        cursor: 'pointer'
                                    }} onClick={() => {

                                        setState({
                                            signType: 4
                                        }, () => {
                                            setState({
                                                openSignature: true,
                                            })
                                        });

                                    }}  disabled={lockFields}
                                        src={signature4} alt="" /></span></td>
                                <td style={{ width: '27.0634%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Today's
Date (mm/dd/yyyy) <input                disabled={lockFields}
                                        value={todayDateDay1}
                                        onChange={(e) => {
                                            setState({
                                                todayDateDay1: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span></td>
                                <td style={{ width: '35.3524%' }}><span style={{
                                    color: '#000000',
                                    fontFamily: 'arial, helvetica, sans-serif',
                                    fontSize: '8pt'
                                }}>Name of
Employer or Authorized Representative <input
                                        value={empAuth15}
                                        disabled={lockFields}
                                        onChange={(e) => {
                                            setState({
                                                empAuth15: e.target.value
                                            })
                                        }}
                                        style={{ width: '100%', border: 0 }}
                                        type="text" /></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </Fragment>
}

export default Document;