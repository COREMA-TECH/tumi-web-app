import React, { Component } from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import renderHTML from 'react-render-html';
//import html from '../../../../data/Package hire/CondeConduct';


class ConductCode extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signature: null,
            openSignature: false
        }
    }

    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false
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
                                    this.state.editing ? (
                                        ''
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
                                {renderHTML(`<div class="WordSection1">
<p style="margin: 0.65pt 0in 0.0001pt 1pt; text-align: center; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;" align="center"><strong><span style="font-size: 15.5pt; font-family: 'Times New Roman', serif;">Tumi Staffing Code of Conduct</span></strong></p>
<p style="margin: 4.9pt 42.8pt 0.0001pt 0in; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 10.5pt; line-height: 110%;">&nbsp;</span></p>
<ol style="margin-top: 4.9pt; margin-bottom: .0001pt;">
<li style="margin: 4.9pt 42.8pt 0.0001pt 6.9333px; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">As an employee of Tumi Staffing committed to providing the highest level of guest service with a commitment to quality in every aspect of my job;</span></li>
</ol>
<p style="margin: 0.5pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt;">&nbsp;</span></p>
<ol style="margin-bottom: 0in; margin-top: 0px;" start="2">
<li style="margin: 0in 21.9pt 0.0001pt 6.9333px; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">I agree to follow all rules and regulations of both Tumi Staffing, and the employment partner or hotel where I am assigned to work;</span></li>
</ol>
<p style="margin: 0.15pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt;">&nbsp;</span></p>
<ol style="margin-bottom: 0in; margin-top: 0px;" start="3">
<li style="margin: 0in 10.25pt 0.0001pt 6.9333px; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">I</span> <span style="font-size: 9.0pt; line-height: 110%;">un</span><span style="font-size: 9.0pt; line-height: 110%;">d</span><span style="font-size: 9.0pt; line-height: 110%;">e</span><span style="font-size: 9.0pt; line-height: 110%;">r</span><span style="font-size: 9.0pt; line-height: 110%;">s</span><span style="font-size: 9.0pt; line-height: 110%;">t</span><span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">n</span><span style="font-size: 9.0pt; line-height: 110%;">d</span> <span style="font-size: 9.0pt; line-height: 110%;">t</span><span style="font-size: 9.0pt; line-height: 110%;">h</span><span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">t</span> <span style="font-size: 9.0pt; line-height: 110%;">I</span> <span style="font-size: 9.0pt; line-height: 110%;">h</span><span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">v</span><span style="font-size: 9.0pt; line-height: 110%;">e</span> <span style="font-size: 9.0pt; line-height: 110%;">a</span> <span style="font-size: 9.0pt; line-height: 110%;">r</span><span style="font-size: 9.0pt; line-height: 110%;">e</span><span style="font-size: 9.0pt; line-height: 110%;">s</span><span style="font-size: 9.0pt; line-height: 110%;">p</span><span style="font-size: 9.0pt; line-height: 110%;">o</span><span style="font-size: 9.0pt; line-height: 110%;">n</span><span style="font-size: 9.0pt; line-height: 110%;">s</span><span style="font-size: 9.0pt; line-height: 110%;">ib</span><span style="font-size: 9.0pt; line-height: 110%;">ilit</span><span style="font-size: 9.0pt; line-height: 110%;">y</span> <span style="font-size: 9.0pt; line-height: 110%;">f</span><span style="font-size: 9.0pt; line-height: 110%;">o</span><span style="font-size: 9.0pt; line-height: 110%;">r</span> <span style="font-size: 9.0pt; line-height: 110%;">m</span><span style="font-size: 9.0pt; line-height: 110%;">y</span> <span style="font-size: 9.0pt; line-height: 110%;">s</span><span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">f</span><span style="font-size: 9.0pt; line-height: 110%;">e</span><span style="font-size: 9.0pt; line-height: 110%;">t</span><span style="font-size: 9.0pt; line-height: 110%;">y</span> <span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">n</span><span style="font-size: 9.0pt; line-height: 110%;">d</span> <span style="font-size: 9.0pt; line-height: 110%;">s</span><span style="font-size: 9.0pt; line-height: 110%;">e</span><span style="font-size: 9.0pt; line-height: 110%;">c</span><span style="font-size: 9.0pt; line-height: 110%;">u</span><span style="font-size: 9.0pt; line-height: 110%;">r</span><span style="font-size: 9.0pt; line-height: 110%;">it</span><span style="font-size: 9.0pt; line-height: 110%;">y</span><span style="font-size: 9.0pt; line-height: 110%;">,</span> <span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">s</span> <span style="font-size: 9.0pt; line-height: 110%;">w</span><span style="font-size: 9.0pt; line-height: 110%;">e</span><span style="font-size: 9.0pt; line-height: 110%;">ll</span> <span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">s</span> <span style="font-size: 9.0pt; line-height: 110%;">t</span><span style="font-size: 9.0pt; line-height: 110%;">h</span><span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">t</span> <span style="font-size: 9.0pt; line-height: 110%;">o</span><span style="font-size: 9.0pt; line-height: 110%;">f</span> <span style="font-size: 9.0pt; line-height: 110%;">m</span><span style="font-size: 9.0pt; line-height: 110%;">y</span> <span style="font-size: 9.0pt; line-height: 110%;">c</span><span style="font-size: 9.0pt; line-height: 110%;">o</span><span style="font-size: 9.0pt; line-height: 110%;">-&shy;‐</span><span style="font-size: 9.0pt; line-height: 110%;">wo</span><span style="font-size: 9.0pt; line-height: 110%;">rk</span><span style="font-size: 9.0pt; line-height: 110%;">e</span><span style="font-size: 9.0pt; line-height: 110%;">r</span><span style="font-size: 9.0pt; line-height: 110%;">s</span> <span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">n</span><span style="font-size: 9.0pt; line-height: 110%;">d </span><span style="font-size: 9.0pt; line-height: 110%;">our clients and hotel guests, and will conduct myself in a safe manner, and report any accidents, or unsafe conditions immediately to ensure that corrective action is taken;</span></li>
</ol>
<p style="margin: 0.15pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt;">&nbsp;</span></p>
<ol style="margin-bottom: 0in; margin-top: 0px;" start="4">
<li style="line-height: 110%; margin: 0in 6.4pt 0.0001pt 6.9333px; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">I</span> <span style="font-size: 9.0pt; line-height: 110%;">w</span><span style="font-size: 9.0pt; line-height: 110%;">ill</span> <span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">rr</span><span style="font-size: 9.0pt; line-height: 110%;">iv</span><span style="font-size: 9.0pt; line-height: 110%;">e</span> <span style="font-size: 9.0pt; line-height: 110%;">t</span><span style="font-size: 9.0pt; line-height: 110%;">o</span> <span style="font-size: 9.0pt; line-height: 110%;">m</span><span style="font-size: 9.0pt; line-height: 110%;">y</span> <span style="font-size: 9.0pt; line-height: 110%;">wo</span><span style="font-size: 9.0pt; line-height: 110%;">rk</span><span style="font-size: 9.0pt; line-height: 110%;">p</span><span style="font-size: 9.0pt; line-height: 110%;">l</span><span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">c</span><span style="font-size: 9.0pt; line-height: 110%;">e</span> <span style="font-size: 9.0pt; line-height: 110%;">w</span><span style="font-size: 9.0pt; line-height: 110%;">i</span><span style="font-size: 9.0pt; line-height: 110%;">t</span><span style="font-size: 9.0pt; line-height: 110%;">h</span> <span style="font-size: 9.0pt; line-height: 110%;">s</span><span style="font-size: 9.0pt; line-height: 110%;">u</span><span style="font-size: 9.0pt; line-height: 110%;">ff</span><span style="font-size: 9.0pt; line-height: 110%;">i</span><span style="font-size: 9.0pt; line-height: 110%;">c</span><span style="font-size: 9.0pt; line-height: 110%;">i</span><span style="font-size: 9.0pt; line-height: 110%;">e</span><span style="font-size: 9.0pt; line-height: 110%;">n</span><span style="font-size: 9.0pt; line-height: 110%;">t</span> <span style="font-size: 9.0pt; line-height: 110%;">t</span><span style="font-size: 9.0pt; line-height: 110%;">i</span><span style="font-size: 9.0pt; line-height: 110%;">m</span><span style="font-size: 9.0pt; line-height: 110%;">e</span> <span style="font-size: 9.0pt; line-height: 110%;">t</span><span style="font-size: 9.0pt; line-height: 110%;">o</span> <span style="font-size: 9.0pt; line-height: 110%;">e</span><span style="font-size: 9.0pt; line-height: 110%;">n</span><span style="font-size: 9.0pt; line-height: 110%;">s</span><span style="font-size: 9.0pt; line-height: 110%;">u</span><span style="font-size: 9.0pt; line-height: 110%;">r</span><span style="font-size: 9.0pt; line-height: 110%;">e</span> <span style="font-size: 9.0pt; line-height: 110%;">t</span><span style="font-size: 9.0pt; line-height: 110%;">h</span><span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">t</span> <span style="font-size: 9.0pt; line-height: 110%;">I</span> <span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">m</span> <span style="font-size: 9.0pt; line-height: 110%;">i</span><span style="font-size: 9.0pt; line-height: 110%;">n</span> <span style="font-size: 9.0pt; line-height: 110%;">un</span><span style="font-size: 9.0pt; line-height: 110%;">i</span><span style="font-size: 9.0pt; line-height: 110%;">f</span><span style="font-size: 9.0pt; line-height: 110%;">o</span><span style="font-size: 9.0pt; line-height: 110%;">r</span><span style="font-size: 9.0pt; line-height: 110%;">m</span> <span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">n</span><span style="font-size: 9.0pt; line-height: 110%;">d</span> <span style="font-size: 9.0pt; line-height: 110%;">r</span><span style="font-size: 9.0pt; line-height: 110%;">e</span><span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">d</span><span style="font-size: 9.0pt; line-height: 110%;">y</span> <span style="font-size: 9.0pt; line-height: 110%;">t</span><span style="font-size: 9.0pt; line-height: 110%;">o</span> <span style="font-size: 9.0pt; line-height: 110%;">c</span><span style="font-size: 9.0pt; line-height: 110%;">l</span><span style="font-size: 9.0pt; line-height: 110%;">o</span><span style="font-size: 9.0pt; line-height: 110%;">c</span><span style="font-size: 9.0pt; line-height: 110%;">k</span><span style="font-size: 9.0pt; line-height: 110%;">-&shy;‐</span><span style="font-size: 9.0pt; line-height: 110%;">in</span> <span style="font-size: 9.0pt; line-height: 110%;">a</span><span style="font-size: 9.0pt; line-height: 110%;">n</span><span style="font-size: 9.0pt; line-height: 110%;">d </span><span style="font-size: 9.0pt; line-height: 110%;">begin my work shift on time;</span></li>
</ol>
<p style="margin: 0.15pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt;">&nbsp;</span></p>
<ol style="margin-bottom: 0in; margin-top: 0px;" start="5">
<li style="margin: 0in 23.6pt 0.0001pt 6.9333px; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">I will practice good hygiene, including bathing and washing my hair, being clean shaven, using deodorant, brushing my teeth before reporting to work, and using clothing that is clean, pressed and presentable for the work environment;</span></li>
</ol>
<p style="margin: 0.15pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt;">&nbsp;</span></p>
<ol style="margin-top: .05pt; margin-bottom: .0001pt;" start="6">
<li style="margin: 0.05pt 16.45pt 0.0001pt 6.9333px; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">When in the front of the house guest contact areas, I will conduct myself in a positive and professional manner, making contact with and offering a warm and friendly greeting to every guest I encounter;</span></li>
</ol>
<p style="margin: 0.1pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt;">&nbsp;</span></p>
<ol style="margin-top: .05pt; margin-bottom: .0001pt;" start="7">
<li style="margin: 0.05pt 17.7pt 0.0001pt 6.9333px; text-align: justify; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">I understand that a positive work environment is critical to the success of our business, and I will treat every other Tumi Staffing employee, supervisor or manager, or those of our employment partner with the same respect and dignity as we treat our hotel guests;</span></li>
</ol>
<p style="margin: 0.5pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt;">&nbsp;</span></p>
<ol style="margin-bottom: 0in; margin-top: 0px;" start="8">
<li style="margin: 0in 37.95pt 0.0001pt 6.9333px; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">I will perform my assigned duties in a through and timely manner, with a positive attitude, always seeking to exceed the expectations of the guests and our employment partner;</span></li>
</ol>
<p style="margin: 0.15pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt;">&nbsp;</span></p>
<ol style="margin-bottom: 0in; margin-top: 0px;" start="9">
<li style="margin: 0in 12.2pt 0.0001pt 6.9333px; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">I understand that open lines of communication and a free flow of information are critical to the success of our business and our relationship with our employment partner, and I will report to Tumi Staffing Management, any problems I encounter in the workplace or which are reported to me, including any inappropriate behavior by or toward any employee of Tumi Staffing, any safety or security hazards or violations, any guest or employee accidents, or any inappropriate or unethical conduct, and will never do anything to hinder communication between Tumi employees, supervisors, managers, or our employment partner;</span></li>
</ol>
<p style="margin: 0in 6.4pt 0.0001pt 41.2pt; text-indent: -0.25in; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt;">&nbsp;</span></p>
<p style="margin: 0in 12.2pt 0.0001pt 41.2pt; text-indent: 0in; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">&nbsp;</span></p>
<ol style="margin-top: .2pt; margin-bottom: .0001pt;" start="10">
<li style="margin: 0.2pt 11.9pt 0.0001pt 6.9333px; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">I will conduct myself with honesty and integrity in all interactions with my coworkers, hotel staff, supervisors and managers and will not engage in any unsafe or inappropriate conduct, or actions which would negatively reflect on Tumi Staffing or our hotel partner, or cause a conflict of interest with either one;</span></li>
</ol>
<p style="margin: 0.2pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt;">&nbsp;</span></p>
<ol style="margin-bottom: 0in; margin-top: 0px;" start="11">
<li style="margin: 0in 23.35pt 0.0001pt 6.9333px; line-height: 110%; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.0pt; line-height: 110%;">I am committed to the success of Tumi Staffing, Inc and providing a positive environment to all of my fellow employees!</span></li>
</ol>
<p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 10.0pt;">&nbsp;</span></p>
<p style="margin: 0in 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 10.0pt;">&nbsp;</span></p>
<p style="margin: 0.45pt 0in 0.0001pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;"><span style="font-size: 9.5pt;">&nbsp;</span></p>
<p style="margin: 5.4pt 0in 0.0001pt 5.2pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">Signed: <u>{Signature}</u>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Date: <u>{DateSigned}</u> </p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
<p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: 'Trebuchet MS', sans-serif;">&nbsp;</p>
<p style="margin: 1.4pt 0in 0.0001pt 1pt; font-size: 10.5pt; font-family: 'Trebuchet MS', sans-serif;">Printed Name: <u> {Name} </u> 
</div>`)}

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

export default ConductCode;