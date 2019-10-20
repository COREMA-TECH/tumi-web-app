import React, { Fragment } from 'react';

const Document = props => {
    const {applicantName, signature} = props;
    return(
        <Fragment>
            <h3>Tumi Staffing Policy on Non-­‐Retaliation.</h3>
            <p>Tumi Staffing policy prohibits the taking of any retaliatory action for reporting or inquiring about alleged improper or wrongful activity.&nbsp; &nbsp;&nbsp;</p>
            <p><span style={{textDecoration: 'underline'}}><strong>Encouragement of Reporting.</strong></span></p>
            <p>Tumi Staffing Managers and employees are encouraged to report in good faith all information regarding alleged improper or wrongful activity that may constitute:&nbsp; &nbsp;&nbsp;</p>
            <ul style={{paddingLeft: "2rem"}}>
                <li>Discrimination or harassment;&nbsp; &nbsp; &nbsp;</li>
                <li>Fraud;&nbsp; &nbsp;</li>
                <li>Unethical or&nbsp; unprofessional business conduct;&nbsp; &nbsp; &nbsp;</li>
                <li>Noncompliance with Tumi Staffing policies/procedures; or those of our client hotels,&nbsp; &nbsp; &nbsp;</li>
                <li>Circumstances of substantial, specific or imminent danger to a hotel or staff member or the public’s health and/or safety;&nbsp; &nbsp; &nbsp;</li>
                <li>Violations of local, state or federal laws and regulations; or&nbsp; &nbsp; &nbsp;</li>
                <li>Other illegal or improper practices or policies.&nbsp; &nbsp;&nbsp;</li>
            </ul>
            <p>Tumi Staffing is firmly committed to a policy that encourages timely disclosure of such concerns and prohibits retribution or retaliation against any staff member who, in good faith, report such concerns. No Tumi Staffing employee will be exempt from the consequences of misconduct or inadequate performance by reporting his own misconduct or inadequate performance.</p>
            <p><span style={{textDecoration: 'underline'}}><strong>Protection from Retaliation.</strong></span></p>
            <p>Any Tumi Staffing employee who, in good faith, report such incidents as described above will be protected from retaliation (defined as an adverse action taken because an individual has engaged in protected activities), threats of retaliation, discharge, or other discrimination including&nbsp; but not limited to discrimination&nbsp; in compensation or terms and conditions of employment that are directly related to the disclosure of such information. In addition, no Tumi staffing employee may be adversely affected because they refused to carry out a directive which constitutes fraud or is a violation of local, state, federal or other applicable laws ane regulations.</p>
            <p><span style={{textDecoration: 'underline'}}><strong>Reporting Process.</strong></span></p>
            <p>Tumi Staffing employees should timely report evidence of alleged improper activity as described above by contacting their Tumi Staffing immediate supervisor or manager. Any instances of alleged retaliation of retribution should be reported in the same manner. Where the Tumi Staffing employee is not satisfied with the response of the Tumi Staffing supervisor or manager, or is uncomfortable for any reason addressing such concerns to one of these individuals, the employee may contact the President, Claudia Robbins, or Vice President, Stephen Robbins. All reports will be handled as promptly and discreetly as possible, with facts made available only to those who need to know to investigate and resolve the matter.&nbsp;</p>
            <p style={{textAlign: 'center'}}><strong>Employee Acknowledgment</strong> &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;</p>
            <p style={{textAlign: 'left'}}>I understand compliance with the Non-­‐Discrimination policy is a condition of my employment with TUMI STAFFING, INC., and I agree to abide by the above policy:</p>
            <table style={{borderCollapse: 'collapse', width: '100%'}} border={0}>
            <tbody>
                <tr>
                    <td style={{width: '15.7839%'}}>Employee Name:&nbsp; &nbsp;&nbsp;</td>
                    <td style={{width: '84.216%'}} colSpan={2}>{applicantName}</td>
                </tr>
                <tr>
                    <td style={{width: '15.7839%'}}>Employee Signature</td>
                    <td style={{width: '37.447%'}}>
                        {
                            signature ? 
                                <img src={`${signature}`} />
                            : ''
                            }
                    </td>
                    <td style={{width: '46.769%'}}>&nbsp;</td>
                </tr>
            </tbody>
            </table>
        </Fragment>
    );
};

export default Document;
