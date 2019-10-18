import React, {Fragment, Component} from 'react';

import Select from 'react-select';
import makeAnimated from "react-select/lib/animated";
import Dependent from './dependents';

class Benefits extends Component{
    INITIAL_STATE = {
        hmo: 0,
        outOfArea: 0,
        coverage: 0,
        marital: true, //single
        gender: true, //male
        dependents: []
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

    handleCoverageChange = ({value}) => {
        this.setState(_ => {
            return { coverage: value }
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
        }), console.log(this.state.dependents))
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
                                                <input type="text" onChange={this.handleChange} value={this.state.name} name="name" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Social Security Number</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.ssn} name="ssn" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Marital Status</label>
                                                <span><input onChange={_ => { this.setState({marital: true}) }} type="checkbox" checked={this.state.marital} name="marital" /> Single</span>
                                                <span style={{paddingLeft: "8px"}}><input onChange={_ => { this.setState({marital: false}) }} type="checkbox" checked={!this.state.marital} name="marital" /> Married</span>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Effective Date</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.effectiveDate} name="effectiveDate" id=""/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-6">
                                                <label htmlFor="" className="BenefitsDoc-label">Mailing Address</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.address} name="address" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Date of Birth</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.birthday} name="birthday" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Gender</label>
                                                <span><input onChange={_ => { this.setState({gender: true}) }} type="checkbox" checked={this.state.gender} name="gender"/> Male</span>
                                                <span style={{paddingLeft: "8px"}}><input onChange={_ => { this.setState({gender: false}) }} type="checkbox" checked={!this.state.gender} name="gender"/> Female</span>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Location</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.location} name="location" id=""/>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-md-4">
                                                <label htmlFor="" className="BenefitsDoc-label">City</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.city} name="city" id=""/>
                                            </div>
                                            <div className="col-md-1">
                                                <label htmlFor="" className="BenefitsDoc-label">State</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.state} name="state" id=""/>
                                            </div>
                                            <div className="col-md-1">
                                                <label htmlFor="" className="BenefitsDoc-label">Zip Code</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.zipcode} name="zipcode" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Full-Time Date of Hire</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.hiredate} name="hiredate" id=""/>
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Home Phone Number</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.homePhone} name="homePhone" id=""/>                                                
                                            </div>
                                            <div className="col-md-2">
                                                <label htmlFor="" className="BenefitsDoc-label">Work Phone Number</label>
                                                <input type="text" onChange={this.handleChange} value={this.state.workPhone} name="workPhone" id=""/>
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
                                                        <input type="text" name="hmoReason" value={this.state.hmoReason} style={{borderBottom: "1px solid black"}} id=""/>
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
                                                        <input type="text" name="hmoReason" value={this.state.hmoReason} style={{borderBottom: "1px solid black"}} id=""/>
                                                    </div>
                                                ) : ''
                                            }
                                        </div>
                                    </div>
                                    {
                                        this.state.hmo === 0 && this.state.outOfArea === 0 ? "" : (
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
                                                        return <Dependent removeDependent={this.removeDependent} updateDependent={this.updateDependent} index={index} {...item}/>
                                                    })
                                                }
                                                <div className="row">
                                                    <div className="col-md-12">
                                                        <input type="button" onClick={_ => { this.addDependent({}) }} class="btn btn-success" value="Add +"/>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default Benefits;