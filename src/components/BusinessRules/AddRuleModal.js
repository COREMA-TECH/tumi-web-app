import React, {Component, Fragment} from 'react';

import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";

import Select from 'react-select';

import withApollo from 'react-apollo/withApollo';
import withGlobalContent from "../Generic/Global";

import HolidayRules from './HolidayRules';
import TimeOfDayRules from './TimeOfDayRules';
import OvertimeRules from './Overtime';


class AddRuleModal extends Component{
    INITIAL_STATE = {
        ruleName: '',
        ruleType: { value: "holiday", label: "Holiday" },
        selectedDays: 'MO,TU,WE,TH,FR,SA,SU',
        start: "00:00",
        end: "00:00",

        ruleTypes: [
            { value: "holiday", label: "Holiday" },
            { value: "tod", label: "Time of Day" },
            { value: "overtime", label: "Overtime" },
        ],    
        holidayRule: {
            multiplier: 1
        },
        timeOfDayRule: {
            hourStart: "00:00",
            hourEnd: "00:00",
            multiplier: 1,
            days: ""
        },
        overtimeRule: {
            days: "",
            type: "day", //Day, Week, Holiday ??
            payRate: 1,
            startAfterHours: 8
        }
    }
    
    constructor(props){
        super(props);
        this.state = {
            ...this.INITIAL_STATE
        }
    }

    setHolidayRule = (multiplier) => {
        this.setState(_ => ({
            holidayRule: {multiplier}
        }));   
    }

    setTimeOfDayRule = (hourStart, hourEnd, multiplier, days = "") => {
        this.setState(_ => ({
            timeOfDayRule: {hourStart, hourEnd, multiplier, days}
        }));
    }

    setOvertimeRule = (days = "", type, payRate = 1, startAfterHours) => {
        this.setState(_ => ({
            ovetimeRule: {days, type, payRate, startAfterHours}
        }))
    }

    handleChangeRuleTypeSelect = selected => {
        this.setState(_ => {
            return { ruleType: selected }
        })
    }    

    handleChange = ({target: {name, value}}) => {
        this.setState(_ => ({
            [name]: value
        }));
    }

    renderRuleType = _ => {
        switch(this.state.ruleType.value){
            case "holiday":
                return <HolidayRules setData={this.setHolidayRule}/>

            case "tod":
                return <TimeOfDayRules setData={this.setTimeOfDayRule}/>
            
            case "overtime":
                return <OvertimeRules setData={this.setOvertimeRule}/>
            
            default:
                return <HolidayRules setData={this.setHolidayRule}/>
        }
    }

    render(){
        return(
            <Fragment>
                {/* this.props.openModal */}
                <Dialog className="BreaksModal BRModal" fullWidth maxWidth="sm" open={true}>
                    <DialogTitle style={{ padding: '0px' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Add Rules</h5>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <form className="BRModal-form" onSubmit={_ => {}}>
                            <div className="BRModal-section">
                                <div className="form-group form-row">                                
                                    <label className="col-sm-2" for="ruleName">Rule Name</label>
                                    <input className="col-sm-10 form-control" required value={this.state.ruleName} onChange={this.handleChange} name="ruleName" type="text" id="ruleName" placeholder="Rule Name"/>                                                                
                                </div>
                                <div className="form-group form-row">
                                    <label className="col-sm-2" for="code">Type</label>
                                    <Select
                                        className="col-sm-10 pl-0 pr-0"
                                        options={this.state.ruleTypes}
                                        value={this.state.ruleType}
                                        onChange={this.handleChangeRuleTypeSelect}
                                        closeMenuOnSelect={true}                                                                                                            
                                    />
                                </div>  
                            </div>
                            <div className="BRModal-section no-border">
                                {
                                    this.renderRuleType()
                                }
                            </div>
                            <div className="BreaksModal-buttons">
                                <button type="submit" className="btn btn-success mr-2">Save</button>
                                <button type="reset" onClick={this.handleClose} className="btn btn-default BreaksModal-cancel">Cancel</button>                                                        
                            </div>     
                        </form>
                    </DialogContent>
                </Dialog>
            </Fragment>
        )
    }
}

export default withApollo(withGlobalContent(AddRuleModal));