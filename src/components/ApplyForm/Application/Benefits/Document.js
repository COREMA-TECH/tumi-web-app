import React, {Fragment} from 'react';

const BenefitsForm = props => {
    return(
        <Fragment>
            <h1>Document</h1>           
            <div style={{ width: '100%', margin: '0 auto' }}>
                <div className="row pdf-container" id="benefitsDoc" style={{ maxWidth: '100%' }}>
                    <div id="DocumentPDF" className="signature-information">
                        <table style={{borderCollapse: 'collapse', width: '100%', border: "none"}}>
                            <tbody>
                            <tr>
                                <td style={{width: '50%', border: "none"}}><span style={{fontSize: "32px", fontWeight: "700"}}><b>Tumi Staffing</b></span></td>
                                <td style={{width: '50%', border: "none"}}><span style={{fontSize: "32px", fontWeight: "700", backgroundColor: "#c7c7c7", padding: "0px 8px"}}>BENEFIT ELECTION FORM</span></td>
                            </tr>
                            <tr>
                                <td style={{width: '50%', border: "none"}}><span style={{fontSize: "16px"}}>Plan Year January 1, 2019 - December 31, 2019</span></td>
                                <td style={{width: '50%', border: "none"}}>&nbsp;</td>
                            </tr>
                            </tbody>
                        </table>
                        <p><span style={{display: "block", width:"100%", color: "white", backgroundColor: "black", padding: "5px", fontWeight: "700"}}>SECTION I: TELL US ABOUT YOU...</span></p>
                        <table style={{borderCollapse: 'collapse', width: '100%', height: 32}} border={1}>
                            <tbody>
                            <tr style={{height: 10}}>
                                <td style={{width: '50.2336%', height: 10}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize", paddingBottom: "5px"}}>
                                        Employee Name (Last, First, M)
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.name || ""}/>
                                </td>
                                <td style={{width: '16.7056%', height: 10}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize", paddingBottom: "5px"}}>
                                        Social Security Number
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.ssn  || ""}/>
                                </td>
                                <td style={{width: '16.8224%', height: 10}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize", paddingBottom: "5px"}}>
                                        Marital Status
                                    </label>
                                    <span style={{paddingLeft: "5px"}}><label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${props.marital ? '&#10003;' : '&#9633;'}`}} /> Single</span>
                                    <span style={{paddingLeft: "8px"}}><label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${!props.marital ? '&#10003;' : '&#9633;'}`}} /> Married</span>
                                </td>
                                <td style={{width: '17.6402%', height: 10}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize", paddingBottom: "5px"}}>
                                        Effective Date
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.effectiveDate || ""}/>
                                </td>
                            </tr>
                            <tr style={{height: 22}}>
                                <td style={{width: '50.2336%', height: 10}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize", paddingBottom: "5px"}}>
                                        Address
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.address || ""}/>
                                </td>
                                <td style={{width: '16.7056%', height: 10}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize", paddingBottom: "5px"}}>
                                        Date of Birth
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.birthday || ""}/>
                                </td>
                                <td style={{width: '16.8224%', height: 10}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize", paddingBottom: "5px"}}>
                                        Gender
                                    </label>
                                    <span style={{paddingLeft: "5px"}}><label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${props.gender ? '&#10003;' : '&#9633;'}`}} /> Male</span>
                                    <span style={{paddingLeft: "8px"}}><label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${!props.gender ? '&#10003;' : '&#9633;'}`}} /> Female</span>
                                </td>
                                <td style={{width: '17.6402%', height: 10}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize", paddingBottom: "5px"}}>
                                        Location
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.location || ""}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <table style={{borderCollapse: 'collapse', width: '100%', borderBottom: "5px solid black"}} border={1}>
                            <tbody>
                            <tr>
                                <td style={{width: '28.9331%', borderBottom: "5px solid black"}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize"}}>
                                        City                                        
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.city || ""}/>
                                </td>
                                <td style={{width: '7.90505%', borderBottom: "5px solid black"}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize"}}>
                                        State                                        
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.state || ""}/>
                                </td>
                                <td style={{width: '13.5125%', borderBottom: "5px solid black"}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize"}}>
                                        Zip Code                                        
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.zipcode || ""}/>
                                </td>
                                <td style={{width: '16.5498%', borderBottom: "5px solid black"}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize"}}>
                                        Full-Time Date of Hire                                        
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.hiredate || ""}/>
                                </td>
                                <td style={{width: '16.9004%', borderBottom: "5px solid black"}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize"}}>
                                        Home Phone number                                        
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.homePhone || ""}/>
                                </td>
                                <td style={{width: '16.1994%', borderBottom: "5px solid black"}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize"}}>
                                        Phone Number                                        
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.workPhone || ""}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <p><span style={{display: "block", width:"100%", color: "white", backgroundColor: "black", padding: "5px", fontWeight: "700"}}>SECTION II: TELL US ABOUT THE BENEFITS YOU ARE ELECTING...</span></p>
                        <table style={{borderCollapse: 'collapse', width: '100%'}} border={1}>
                            <tbody>
                            <tr>
                                <td style={{width: '21.6527%'}}>Medical - HMO Austin</td>
                                <td style={{width: '49.5432%'}}>
                                <table style={{borderCollapse: 'collapse', width: '100%'}} border={0}>
                                    <tbody>
                                    <tr>
                                        <td style={{width: '50%'}}><label style={{ fontSize: "18px", marginLeft: "5px" }} dangerouslySetInnerHTML={{ __html: `${props.hmo === 1 ? '&#10003;' : '&#9633;'}`}} /> Employee Only</td>
                                        <td style={{width: '50%'}}>$54.46</td>
                                    </tr>
                                    <tr>
                                        <td style={{width: '50%'}}><label style={{ fontSize: "18px", marginLeft: "5px" }} dangerouslySetInnerHTML={{ __html: `${props.hmo === 2 ? '&#10003;' : '&#9633;'}`}} /> Employee + Spouse</td>
                                        <td style={{width: '50%'}}>$426.55</td>
                                    </tr>
                                    <tr>
                                        <td style={{width: '50%'}}><label style={{ fontSize: "18px", marginLeft: "5px" }} dangerouslySetInnerHTML={{ __html: `${props.hmo === 3 ? '&#10003;' : '&#9633;'}`}} /> Employee + Child(ren)</td>
                                        <td style={{width: '50%'}}>$333.53</td>
                                    </tr>
                                    <tr>
                                        <td style={{width: '50%'}}><label style={{ fontSize: "18px", marginLeft: "5px" }} dangerouslySetInnerHTML={{ __html: `${props.hmo === 4 ? '&#10003;' : '&#9633;'}`}} />Employee + Family</td>
                                        <td style={{width: '50%'}}>$763.62</td>
                                    </tr>
                                    </tbody>
                                </table>
                                </td>
                                <td style={{width: '28.804%'}}><span>Decilne (I choose NOT to participate) Reason:</span><input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.hmoReason  || ""}/></td>
                            </tr>
                            <tr>
                                <td style={{width: '21.6527%'}}>Medical - Out-of-Area</td>
                                <td style={{width: '49.5432%'}}>
                                <table style={{borderCollapse: 'collapse', width: '100%'}} border={0}>
                                    <tbody>
                                    <tr>
                                        <td style={{width: '50%'}}><label style={{ fontSize: "18px", marginLeft: "5px" }} dangerouslySetInnerHTML={{ __html: `${props.outOfArea === 1 ? '&#10003;' : '&#9633;'}`}} /> Employee Only</td>
                                        <td style={{width: '50%'}}>$54.46</td>
                                    </tr>
                                    <tr>
                                        <td style={{width: '50%'}}><label style={{ fontSize: "18px", marginLeft: "5px" }} dangerouslySetInnerHTML={{ __html: `${props.outOfArea === 2 ? '&#10003;' : '&#9633;'}`}} /> Employee + Spouse</td>
                                        <td style={{width: '50%'}}>$445.87</td>
                                    </tr>
                                    <tr>
                                        <td style={{width: '50%'}}><label style={{ fontSize: "18px", marginLeft: "5px" }} dangerouslySetInnerHTML={{ __html: `${props.outOfArea === 3 ? '&#10003;' : '&#9633;'}`}} /> Employee + Child(ren)</td>
                                        <td style={{width: '50%'}}>$348.02</td>
                                    </tr>
                                    <tr>
                                        <td style={{width: '50%'}}><label style={{ fontSize: "18px", marginLeft: "5px" }} dangerouslySetInnerHTML={{ __html: `${props.outOfArea === 4 ? '&#10003;' : '&#9633;'}`}} /> Employee + Family</td>
                                        <td style={{width: '50%'}}>$772.04</td>
                                    </tr>
                                    </tbody>
                                </table>
                                </td>
                                <td style={{width: '28.804%'}}><span>Decilne (I choose NOT to participate) Reason:</span><input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.ooaReason || ""}/></td>
                            </tr>
                            </tbody>
                        </table>
                        <p><span style={{display: "block", width:"100%", color: "white", backgroundColor: "black", padding: "5px", fontWeight: "700"}}>SECTION III: TELL US ABOUT YOUR ELIGIBLE DEPENDENTS ATTACH AN ADDITIONAL SHEET IF NECESSARY</span></p>
                        <table style={{borderCollapse: 'collapse', width: '100%'}} border={1}>
                            <tbody>
                            <tr style={{backgroundColor: "#c7c7c7"}}>
                                <td style={{width: '16.6667%', border: "none", backgroundColor: "#c7c7c7"}}>&nbsp;</td>
                                <td style={{width: '16.6667%', border: "none", backgroundColor: "#c7c7c7"}}>&nbsp;</td>
                                <td style={{width: '16.6667%', border: "none", backgroundColor: "#c7c7c7"}}>&nbsp;</td>
                                <td style={{width: '12.3759%', border: "none", backgroundColor: "#c7c7c7"}}>&nbsp;</td>
                                <td style={{width: '20.9575%', border: "none", backgroundColor: "#c7c7c7"}}>&nbsp;</td>
                                <td style={{width: '4.16668%', textAlign: 'center', backgroundColor: "#c7c7c7"}} colSpan={4}><span style={{}}>Coverage Elected</span></td>
                            </tr>
                            <tr style={{backgroundColor: "#c7c7c7"}}>
                                <td style={{width: '16.6667%'}}><span style={{display: "block", width: "100%", textAlign: "center", borderTop: "none", backgroundColor: "#c7c7c7", fontWeight: "700"}}>Add/Cancel</span></td>
                                <td style={{width: '16.6667%'}}><span style={{display: "block", width: "100%", textAlign: "center", borderTop: "none", backgroundColor: "#c7c7c7", fontWeight: "700"}}>Dependant Name (Last, First, M)</span></td>
                                <td style={{width: '16.6667%'}}><span style={{display: "block", width: "100%", textAlign: "center", borderTop: "none", backgroundColor: "#c7c7c7", fontWeight: "700"}}>Date of Birth</span></td>
                                <td style={{width: '12.3759%'}}><span style={{display: "block", width: "100%", textAlign: "center", borderTop: "none", backgroundColor: "#c7c7c7", fontWeight: "700"}}>Gender</span></td>
                                <td style={{width: '20.9575%'}}><span style={{display: "block", width: "100%", textAlign: "center", borderTop: "none", backgroundColor: "#c7c7c7", fontWeight: "700"}}>Relationship</span></td>
                                <td style={{width: '4.16668%'}}><span style={{display: "block", width: "100%", textAlign: "center", backgroundColor: "#c7c7c7", fontWeight: "700"}}>Medical</span></td>
                                <td style={{width: '4.16668%'}}><span style={{display: "block", width: "100%", textAlign: "center", backgroundColor: "#c7c7c7", fontWeight: "700"}}>Dental</span></td>
                                <td style={{width: '4.16668%'}}><span style={{display: "block", width: "100%", textAlign: "center", backgroundColor: "#c7c7c7", fontWeight: "700"}}>Vision</span></td>
                                <td style={{width: '4.16668%'}}><span style={{display: "block", width: "100%", textAlign: "center", backgroundColor: "#c7c7c7", fontWeight: "700"}}>Decline</span></td>
                            </tr>
                            {
                                props.dependents ? (props.dependents.map(item => {
                                    return (
                                        <tr>
                                            <td style={{width: '16.6667%'}}>
                                                <div style={{paddingLeft: "5px"}}><label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${item.addCancel ? '&#10003;' : '&#9633;'}`}} /> ADD</div>
                                                <div style={{paddingLeft: "5px"}}><label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${!item.addCancel ? '&#10003;' : '&#9633;'}`}} /> CANCEL</div>
                                            </td>
                                            <td style={{width: '16.6667%'}}>
                                                <input type="text" style={{border: "none"}} value={item.dependent_name || ""} id=""/>
                                            </td>
                                            <td style={{width: '16.6667%'}}>
                                                <input type="text" style={{border: "none"}} value={item.dependent_dob || ""} id=""/>                                                
                                            </td>
                                            <td style={{width: '12.3759%'}}>
                                                <div><label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${item.dependent_gender ? '&#10003;' : '&#9633;'}`}} /> MALE</div>
                                                <div><label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${!item.dependent_gender ? '&#10003;' : '&#9633;'}`}} />  FEMALE</div>                                                
                                            </td>
                                            <td style={{width: '20.9575%'}}>
                                                <input type="text" style={{border: "none"}} value={item.relationship || ""} id=""/>                                                                                                
                                            </td>
                                            <td style={{width: '4.16668%', textAlign: "center"}}>
                                                <label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${item.coverage === 1 ? '&#10003;' : '&#9633;'}`}} /> 
                                            </td>
                                            <td style={{width: '4.16668%', textAlign: "center"}}>
                                                <label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${item.coverage === 2 ? '&#10003;' : '&#9633;'}`}} /> 
                                            </td>
                                            <td style={{width: '4.16668%', textAlign: "center"}}>
                                                <label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${item.coverage === 3 ? '&#10003;' : '&#9633;'}`}} /> 
                                            </td>
                                            <td style={{width: '4.16668%', textAlign: "center"}}>
                                                <label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${item.coverage === 4 ? '&#10003;' : '&#9633;'}`}} /> 
                                            </td>
                                        </tr>                                              
                                    )
                                })) : ""
                            }
                            </tbody>
                        </table>
                        <p><span style={{display: "block", width:"100%", color: "white", backgroundColor: "black", padding: "5px", fontWeight: "700"}}>Section IV: Section 125</span></p>
                        <p style={{backgroundColor: "#c8c8c8", margin: "0", padding: "5px 2px", border: "1px solid black"}}>Premiums for the benefits listed above can be tax-sheltered under the Premium Conversion Plan. Electing to have the premiums pre-tax (tax-sheltered) means that the premiums taken out of your salary are taken out before taxes, not after taxes. The amount you pay for the benefit will automatically be taken out of your pay pre-tax if you elect to participate in the pre-tax program (by checkiing the “yes” box below). Sectionn 125 enables you to pay your share of the cost for medical and/or dental coverage on a pre-tax basis. This means you do not pay federal income tax and social security taxes on the money you spend for medical, dental and or vision premiums. Your contribution to the cost of coverage(s) is automatically deduced from your paycheck on a pre-tax basis. This means the amount you spend for coverage will not be included in the amount reported as federal taxable income on your W-2 at the end of the year. Since you do not pay Social Security taxes on your contributions, the amount you receive from Social Security when you retire may be slightly reduced. The reduction, if any, depends on your salary, how many years you make pre-tax contributions and other factors. The benefit elections you make initially cannot change until the next annual enrollment unless you have a qualified status change under Section 125 of the Internal Revenue Code and you request the change within thirty days of the at event.</p>
                        <div style={{padding: "0px", border: "2px solid black"}}>
                            <p style={{marginBottom: "10px"}}><label style={{ fontSize: "18px" }} dangerouslySetInnerHTML={{ __html: `${props.preTax ? '&#10003;' : '&#9633;'}`}} /> Pre-Tax: I elect to participate in the pre-tax option of the current Plan Year. I authorize my employer to reduce my annual compensation during the Plan Year on a pro-tax basis to pay for my share of the premium for those benefits for which I have enrolled on separate benefit form(s).</p>
                            <p><label style={{ fontSize: "18px", margin: "0" }} dangerouslySetInnerHTML={{ __html: `${!props.preTax ? '&#10003;' : '&#9633;'}`}} /> Post-Tax: I elect to pay for my eligible premiums on an after-tax basis outside of this Plan, and I authorize appropriate after-tax payroll deductions.</p>
                        </div>                        
                        <p><span style={{display: "block", width:"100%", color: "white", backgroundColor: "black", padding: "5px", fontWeight: "700"}}>Section V: Payroll Deduction Authorization</span></p>
                        <p style={{backgroundColor: "#c8c8c8", padding: "5px 2px", border: "2px solid black"}}>I represent that all the information supplied in this application is true and complete. I certify that these are my benefit elections and authorize my employer to deduct premiums for these benefits from my pay. I understand that I cannot change my pre-tax benefit elections during the plan year unless I have a qualified change in my family status. If I have a qualified change in my family status, I will be allowed to make corresponding changes in my benefit elections provided that I request these changes in writing within 31 days of the qualifying event. These benefit elections will remain in force for subsequent plan years unless I submit a new form changing my benefit elections. I understand that I must submit a new form each plan year to continue my flexible benefit account elections. If a new form is not submitted, my flexible spending account elections will be discontinued in subsequent plan years.</p>
                        <table style={{borderCollapse: 'collapse', width: '100%'}} border={1}>
                            <tbody>
                            <tr>
                                <td style={{width: '50%'}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize", paddingBottom: "5px"}}>
                                        Employee Signature                                                                            
                                    </label>
                                    <img src={props.signature}
                                        style={{
                                            width: '100px',
                                            height: '30px',
                                            display: 'inline-block',
                                            backgroundColor: 'transparent',
                                            cursor: 'pointer'
                                        }}                                                 
                                    />
                                </td>
                                <td style={{width: '50%'}}>
                                    <label  className="BenefitsDoc-label" style={{display: "block", fontSize: "10px", paddingLeft: "5px", paddingRight: "5px", textTransform: "capitalize", paddingBottom: "5px"}}>
                                        Date
                                    </label>
                                    <input style={{border: "none", width: "100%", paddingLeft: "5px"}} type="text"   value={props.date || ""}/>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div> 
                </div>
            </div>        
        </Fragment>
    )
}

export default BenefitsForm;