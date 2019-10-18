import React, {Fragment, Component} from 'react';

import withGlobalContent from "../../../Generic/Global";
import withApollo from "react-apollo/withApollo";

import {ADD_DOC} from './mutations';
import {GET_APPLICANT_INFO} from './queries';

import Select from 'react-select';
import makeAnimated from "react-select/lib/animated";
import Button from "@material-ui/core/es/Button/Button";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";

import Dependent from './dependents';
const uuidv4 = require('uuid/v4');

class Benefits extends Component{
    INITIAL_STATE = {
        openSignature: false,
        signature: null,
        hmo: 0,
        hmoReason: "",
        ooaReason: "",
        outOfArea: 0,        
        marital: true, //single
        gender: true, //male
        dependents: [],
        preTax: true,  
        isCreated: false      
    }

    constructor(props){
        super(props);
        this.state = {
            hmoOptions: [
                { value: 1, label: "Employee Only - $ 54.46" },
                { value: 2, label: "Employee + Spouse - $426.55" },
                { value: 3, label: "Employee + Child(ren) - $333.53" },
                { value: 4, label: "Employee + Family - $736.62" },
                { value: 0, label: "Decline" },
            ],
            outOfAreaOptions: [
                { value: 1, label: "Employee Only - $ 54.46" },
                { value: 2, label: "Employee + Spouse - $445.87" },
                { value: 3, label: "Employee + Child(ren) - $384.02" },
                { value: 4, label: "Employee + Family - $772.04" },
                { value: 0, label: "Decline" },
            ],

            coverageOptions: [
                { value: 1, label: "Medical" },
                { value: 2, label: "Dental" },
                { value: 3, label: "Vision" },
                { value: 0, label: "Decline" },
            ],
            ...this.INITIAL_STATE
        }
    }

    componentWillMount(){
        this.loadDocumentInfo();       
    }

    loadDocumentInfo = _ => {
        this.props.client
            .query({
                query: GET_APPLICANT_INFO,
                variables: {
                    ApplicationId: this.props.applicationId,
                    ApplicationDocumentTypeId: 22
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                if (data.lastApplicantLegalDocument) {
                    const fd = data.lastApplicantLegalDocument.fieldsData;
                    const formData = fd ? JSON.parse(fd) : {}
                    
                    this.setState({
                        isCreated: true,
                        urlPDF: data.lastApplicantLegalDocument.url || '',
                        ...formData
                    });
                } else {
                    this.setState({
                        isCreated: false,
                    })
                }
                // this.fetchApplicantInfo();
            })
            .catch(error => {                
                console.log(error);
            })
    }

    saveDocument = _ => {
        const { signature, hmo, hmoReason, outOfArea, ooaReason, preTax, dependents, name, ssn, marital, effectiveDate, address, birthday,
            gender, location, city, state, zipcode, hiredate, homePhone, workPhone, date } = this.state;

        const saveData = {
            name, gender, marital, ssn, effectiveDate, address, birthday, location, city, state, zipcode, hiredate, homePhone, workPhone,
            signature,
            hmo,
            outOfArea,
            hmoReason: hmo ? hmoReason : "",
            ooaReason: outOfArea ? ooaReason : "",
            dependents: (hmo === 0 && outOfArea === 0) ? [] : [...dependents],
            preTax,
            date: date || ""
        }

        const jsonFields = JSON.stringify(saveData);
        const random = uuidv4();

        this.props.client.mutate({
            mutation: ADD_DOC,            
            variables: {
                fileName: "BenefitsForm-" + random + name,
                applicantLegalDocument: {
                    fieldsData: jsonFields,
                    ApplicationDocumentTypeId: 22,
                    ApplicationId: this.props.applicationId,
                    UserId: localStorage.getItem('LoginId') || 0,
                    completed: true
                }
            }
        })
        .then(() => {
            this.props.handleOpenSnackbar(
                'success',
                'Record Saved!',
                'bottom',
                'right'
            );

            this.props.changeTabState();
        })
        .catch(error => {
            // If there's an error show a snackbar with a error message
            this.props.handleOpenSnackbar(
                'error',
                'Failed to save Benefits Form. Please, try again!',
                'bottom',
                'right'
            );

            console.log(error);
        });
    }

    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false,
            date: new Date().toISOString().substring(0, 10)
        }, _ => {
            if(this.state.signature) {
                this.saveDocument()
            }
        });
    };

    handleChange = ({target: {name, value}}) => {
        this.setState(_ => ({
            [name]: value
        }))
    }

    handleHMOChange = ({value}) => {
        this.setState(_ => {
            return { hmo: value }
        })
    }
    
    handleOutOfAreaChange = ({value}) => {
        this.setState(_ => {
            return { outOfArea: value }
        })
    }    

    removeDependent = position => {
        this.setState(_ => ({
            dependents: [...this.state.dependents.filter((item, index) => {
                return index !== position;
            })]
        }));
    }

    addDependent = dependent => {
        this.setState(_ => ({
            dependents: [...this.state.dependents, dependent]
        }))
    }

    findSelectedHMO = selected => {
        const defValue = { value: 1, label: "Employee Only - $ 54.46" }
        const found = this.state.hmoOptions.find(item => item.value === selected);

        return found || defValue;
    }

    findSelectedOOA = selected => {
        const defValue = { value: 1, label: "Employee Only - $ 54.46" }
        const found = this.state.outOfAreaOptions.find(item => item.value === selected);

        return found || defValue;
    }

    updateDependent = (index, updated) => {
        let current = [...this.state.dependents];
        current[index] = {...current[index], ...updated};
        
        this.setState(_ => ({
            dependents: [...current]
        }));
    }  

    render(){
        return(
            <Fragment>
                <div className="Apply-container--application">
                    <div className="row">
                        <div className="col-12">
                            <div className="applicant-card">
                                <div className="applicant-card__header">
                                    <span className="applicant-card__title">Benefits</span>
                                </div>
                                <div className="applicant-card__body BenefitsDoc" style={{padding: "1.5rem"}}>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h2>Tumi Staffing</h2>
                                            <span>Plan Year January 1, 2019 - December 31, 2019</span>
                                        </div>
                                        <div className="col-md-6">
                                            <h1>Benefit Election Form</h1>
                                        </div>
                                    </div>
                                    <div className="BenefitsDoc-sec section-1">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="BenefitsDoc-secTitle">
                                                    <span>Section I: Tell Us About You...</span>
                                                </div>
                                            </div>                                            
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label htmlFor="" className="BenefitsDoc-label">Employee Name (Last, First, M)</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.name} name="name" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Social Security Number</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.ssn} name="ssn" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Marital Status</label>
                                                <span><input onChange={_ => { this.setState({marital: true}) }} type="checkbox" checked={this.state.marital} name="marital" /> Single</span>
                                                <span style={{paddingLeft: "8px"}}><input onChange={_ => { this.setState({marital: false}) }} type="checkbox" checked={!this.state.marital} name="marital" /> Married</span>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Effective Date</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.effectiveDate} name="effectiveDate" id=""/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label htmlFor="" className="BenefitsDoc-label">Mailing Address</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.address} name="address" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Date of Birth</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.birthday} name="birthday" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Gender</label>
                                                <span><input onChange={_ => { this.setState({gender: true}) }} type="checkbox" checked={this.state.gender} name="gender"/> Male</span>
                                                <span style={{paddingLeft: "8px"}}><input onChange={_ => { this.setState({gender: false}) }} type="checkbox" checked={!this.state.gender} name="gender"/> Female</span>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Location</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.location} name="location" id=""/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <label htmlFor="" className="BenefitsDoc-label">City</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.city} name="city" id=""/>
                                            </div>
                                            <div className="col-md-1">
                                                <label htmlFor="" className="BenefitsDoc-label">State</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.state} name="state" id=""/>
                                            </div>
                                            <div className="col-md-1">
                                                <label htmlFor="" className="BenefitsDoc-label">Zip Code</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.zipcode} name="zipcode" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Full-Time Date of Hire</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.hiredate} name="hiredate" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Home Phone Number</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.homePhone} name="homePhone" id=""/>                                                
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Work Phone Number</label>
                                                <input className="BenefitsDoc-input" type="text" onChange={this.handleChange} value={this.state.workPhone} name="workPhone" id=""/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="BenefitsDoc-sec section-2">
                                        <div className="row">
                                            <div className="col-md-12">
                                                <div className="BenefitsDoc-secTitle">
                                                    <span>Section II: Tell Us About The Benefits You Are Electing...</span>
                                                </div>
                                            </div>                                            
                                        </div>
                                        <div className="row">
                                            <div className="col-md-2">
                                                <span>Medical - HMO Austin</span>
                                            </div>
                                            <div className="col-md-4">
                                                <Select
                                                    options={this.state.hmoOptions}
                                                    value={this.findSelectedHMO(this.state.hmo)}
                                                    onChange={this.handleHMOChange}
                                                    closeMenuOnSelect={true}
                                                    components={makeAnimated()}
                                                    isMulti={false}                                                                          
                                                />
                                            </div>
                                            {
                                                this.state.hmo === 0 ? (
                                                    <div className="col-md-6">
                                                        <label htmlFor="">Decline (I choose NOT to participate) Reason:</label>
                                                        <input className="BenefitsDoc-input" type="text" name="hmoReason" value={this.state.hmoReason} style={{marginTop: "0"}} id=""/>
                                                    </div>
                                                ) : ''
                                            }
                                        </div>
                                        <div className="row">
                                            <div className="col-md-2">
                                                <span>Medical - Out-of-Area</span>
                                            </div>
                                            <div className="col-md-4">
                                                <Select
                                                    options={this.state.outOfAreaOptions}
                                                    value={this.findSelectedOOA(this.state.outOfArea)}
                                                    onChange={this.handleOutOfAreaChange}
                                                    closeMenuOnSelect={true}
                                                    components={makeAnimated()}
                                                    isMulti={false}                                                                          
                                                />
                                            </div>
                                            {
                                                this.state.outOfArea === 0 ? (
                                                    <div className="col-md-6">
                                                        <label htmlFor="">Decline (I choose NOT to participate) Reason:</label>
                                                        <input className="BenefitsDoc-input" type="text" name="ooaReason" value={this.state.ooaReason} style={{marginTop: "0"}} id=""/>
                                                    </div>
                                                ) : ''
                                            }
                                        </div>
                                    </div>
                                    {
                                        this.state.hmo === 0 && this.state.outOfArea === 0 ? "" : (
                                            <Fragment>
                                                <div className="BenefitsDoc-sec section-3">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="BenefitsDoc-secTitle">
                                                                <span>Section III: Tell Us About Your Eligible Dependents...</span>
                                                            </div>
                                                        </div>                                            
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-1">
                                                            <label htmlFor="">Add/Cancel</label>
                                                        </div>
                                                        <div className="col-md-3">
                                                            <label htmlFor="">Dependant Name (Last, First, M)</label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label htmlFor="">Date of Birth</label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label htmlFor="">Gender</label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label htmlFor="">Relationship</label>
                                                        </div>
                                                        <div className="col-md-2">
                                                            <label class="d-block" htmlFor="">Coverage</label>                                                
                                                        </div>
                                                    </div>                                                
                                                    {
                                                        this.state.dependents.map((item, index) => {
                                                            return <Dependent removeDependent={this.removeDependent} updateDependent={this.updateDependent} index={index} info={item}/>
                                                        })
                                                    }
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <input type="button" onClick={_ => { this.addDependent({}) }} class="btn btn-success" value="Add +"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="BenefitsDoc-sec section-4">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="BenefitsDoc-secTitle">
                                                                <span>Section IV: Section 125</span>
                                                            </div>
                                                        </div>                                            
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <p>
                                                                Premiums for the benefits listed above can be tax-sheltered under the Premium Conversion Plan. Electing to have the premiums pre-tax (tax-sheltered) means that the premiums taken out of your salary are taken out before taxes, not after taxes. The amount you pay for the benefit will automatically be taken out of your pay pre-tax if you elect to participate in the pre-tax program (by checkiing the “yes” box below). Sectionn 125 enables you to pay your share of the cost for medical and/or dental coverage on a pre-tax basis. This means you do not pay federal income tax and social security taxes on the money you spend for medical, dental and or vision premiums. Your contribution to the cost of coverage(s) is automatically deduced from your paycheck on a pre-tax basis. This means the amount you spend for coverage will not be included in the amount reported as federal taxable income on your W-2 at the end of the year. Since you do not pay Social Security taxes on your contributions, the amount you receive from Social Security when you retire may be slightly reduced. The reduction, if any, depends on your salary, how many years you make pre-tax contributions and other factors. The benefit elections you make initially cannot change until the next annual enrollment unless you have a qualified status change under Section 125 of the Internal Revenue Code and you request the change within thirty days of the at event.
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <input onChange={_ => { this.setState({preTax: true}) }} type="checkbox" checked={this.state.preTax} name="preTax"/> I elect to participate in the pre-tax option of the current Plan Year. I authorize my employer to reduce my annual compensation during the Plan Year on a pre-tax basis to pay for my share of the premium for those benefits for which I have enrolled on separate benefit enrollment form(s)
                                                        </div>
                                                        <div className="col-md-12">
                                                            <input onChange={_ => { this.setState({preTax: false}) }} type="checkbox" checked={!this.state.preTax} name="preTax"/> I elect to pay for my eligible premiums on an after-tax basis outside of this Plan, and I authorize appropriate after-tax payroll deductions.
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="BenefitsDoc-sec section-5">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="BenefitsDoc-secTitle">
                                                                <span>Section V: Payroll Deduction Authorization</span>
                                                            </div>
                                                        </div>                                            
                                                    </div>
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <p>
                                                                I represent that all the information supplied in this application is true and complete. I certify that these are my benefit elections and authorize my employer to deduct premiums for these benefits from my pay. I understand that I cannot change my pre-tax benefit elections during the plan year unless I have a qualified change in my family status. If I have a qualified change in my family status, I will be allowed to make corresponding changes in my benefit elections provided that I request these changes in writing within 31 days of the qualifying event. These benefit elections will remain in force for subsequent plan years unless I submit a new form changing my benefit elections. I understand that I must submit a new form each plan year to continue my flexible benefit account elections. If a new form is not submitted, my flexible spending account elections will be discontinued in subsequent plan years.
                                                            </p>
                                                        </div>
                                                    </div>                                                    
                                                </div>
                                            </Fragment>
                                        )
                                    }
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label htmlFor="" className="BenefitsDoc-label">Employee Signature</label>
                                            <img src={this.state.signature}
                                                style={{
                                                    width: '100px',
                                                    height: '30px',
                                                    display: 'inline-block',
                                                    backgroundColor: '#f9f9f9',
                                                    cursor: 'pointer'
                                                }} onClick={() => { this.setState({ openSignature: true, }); }}                                                
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="" className="BenefitsDoc-label">Date</label>
                                            <input className="BenefitsDoc-input" type="text" name="date" disabled={true} value={this.state.date} style={{marginTop: "0"}} id=""/>
                                        </div>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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
                            applicationId={0}
                            signatureValue={this.handleSignature}
                            showSaveIcon={null}
                        />
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

export default withApollo(withGlobalContent(Benefits));