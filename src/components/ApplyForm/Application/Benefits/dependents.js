import React, {Fragment, Component} from 'react';

import Select from 'react-select';
import makeAnimated from "react-select/lib/animated";

class Dependent extends Component{
    constructor(props){
        super(props);
        this.state = {
            coverageOptions: [
                { value: 1, label: "Medical" },
                { value: 2, label: "Dental" },
                { value: 3, label: "Vision" },
                { value: 4, label: "Decline" },
            ],
            ...props.info
        }
    }   
    
    componentWillReceiveProps(nextProps) {
        const { addCancel, dependent_name, dependent_gender, dependent_dob, relationship, coverage } = nextProps.info;
        this.setState(_ => {
            return {
                addCancel,
                dependent_name: dependent_name || "",
                dependent_dob: dependent_dob || "",
                dependent_gender,
                relationship: relationship || "",
                coverage: coverage || 0
            }
        });
    }

    handleCoverageChange = ({value}) => {
        this.setState(_ => {
            return { coverage: value }
        })
    }

    findCoverage = selected => {
        const defValue = { value: 4, label: "Decline" };
        const found = this.state.coverageOptions.find(item => item.value === selected)

        return found || defValue;
    }

    handleChange = ({target: {name, value}}) => {
        this.setState(_ => {
            return { [name]: value }
        })
    }

    updateDependent = _ => {
        const { addCancel, dependent_name, dependent_dob, dependent_gender, relationship, coverage } = this.state;
        this.props.updateDependent(this.props.index, {
            addCancel, dependent_name, dependent_dob, dependent_gender, relationship, coverage
        });
    }

    render(){
        return(
            <Fragment>
                <div className="row" style={{position: "relative"}}>
                    <input type="button" class="BenefitsDoc-remove" onClick={_ => {this.props.removeDependent(this.props.index)}} value="&times;" style={{}}/>
                    <div className="col-md-1">
                        <div><input onBlur={this.updateDependent} onChange={_ => { this.setState(_ => ({addCancel: true}), _ => {this.updateDependent()}) }} type="checkbox" checked={this.state.addCancel} name="addCancel" id=""/> ADD</div>
                        <div><input onBlur={this.updateDependent} onChange={_ => { this.setState(_ => ({addCancel: false}), _ => {this.updateDependent()}) }} type="checkbox" checked={!this.state.addCancel} name="addCancel" id=""/> CANCEL</div>
                    </div>
                    <div className="col-md-3">
                        <input onBlur={this.updateDependent} className="BenefitsDoc-input" onChange={this.handleChange} type="text" name="dependent_name" value={this.state.dependent_name} id=""/>
                    </div>
                    <div className="col-md-2">
                        <input onBlur={this.updateDependent} className="BenefitsDoc-input" onChange={this.handleChange} type="text" name="dependent_dob" value={this.state.dependent_dob} id=""/>                        
                    </div>
                    <div className="col-md-2">
                        <div><input onBlur={this.updateDependent} onChange={_ => { this.setState(_ => ({dependent_gender: true}), _ => { this.updateDependent() }) }} type="checkbox" checked={this.state.dependent_gender} name="dependent_gender" value={true} id=""/> MALE</div>
                        <div><input onChange={_ => { this.setState(_ => ({dependent_gender: false}), _ => { this.updateDependent() }) }}type="checkbox" checked={!this.state.dependent_gender} name="dependent_gender" value={false} id=""/> FEMALE</div>
                    </div>
                    <div className="col-md-2">
                        <input onBlur={this.updateDependent} className="BenefitsDoc-input" onChange={this.handleChange} type="text" name="relationship" value={this.state.relationship} id=""/>                                                
                    </div>
                    <div className="col-md-2">
                        <Select
                            options={this.state.coverageOptions}
                            value={this.findCoverage(this.state.coverage)}
                            onChange={this.handleCoverageChange}
                            closeMenuOnSelect={true}
                            components={makeAnimated()}
                            isMulti={false}    
                            onBlur={this.updateDependent}                                                                      
                        />
                    </div>
                </div>
            </Fragment>
        );
    }
}

export default Dependent;