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

import {GET_RULE_TYPES} from './queries';
import {CREATE_RULE, UPDATE_RULE} from './mutations';


class AddRuleModal extends Component{
    INITIAL_STATE = {
        ruleName: '',
        ruleType: { value: 41755, label: "Holiday" },
        selectedDays: '',
        start: "00:00",
        end: "00:00",

        ruleTypes: [],    
        holidayRule: {
            id: 0,
            multiplier: 1
        },
        timeOfDayRule: {
            id: 0,
            startTime: "00:00",
            endTime: "00:00",
            multiplier: 1,
            days: ""
        },
        overtimeRule: {
            days: '',
            multiplier: 1.00,
            startAfterHours: 8.0,
            type: "day"
        }
    }
    
    constructor(props){
        super(props);
        this.state = {
            ...this.INITIAL_STATE
        }

        this.fetchRuleTypes();
    }

    fetchRuleTypes = _ => {
        this.props.client.query({
            query: GET_RULE_TYPES
        })
        .then(({data: {catalogitem}}) => {
            const options = catalogitem.map(item => {
                return {value: item.Id, label: item.Name.trim()}
            });

            this.setState(_ => ({
                ruleTypes: [...options]
            }))
        })
    }

    setHolidayRule = (multiplier) => {
        this.setState(_ => ({
            holidayRule: {multiplier}
        }));   
    }

    setTimeOfDayRule = (startTime, endTime, multiplier, days = "") => {
        this.setState(_ => ({
            timeOfDayRule: {startTime, endTime, multiplier, days}
        }));
    }

    setOvertimeRule = (days = "", type, multiplier = 1.0, startAfterHours) => {
        this.setState(_ => ({
            overtimeRule: {days, type, multiplier, startAfterHours}
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

    saveRule = _ => {
        const {ruleType, holidayRule, timeOfDayRule, overtimeRule} = this.state;
        let data = {};

        switch(ruleType.value){
            case 41755:
                data = {catalogItemId: ruleType.value, ...holidayRule}               
                break;

            case 41757:
                data = {catalogItemId: ruleType.value, ...overtimeRule}               
                break;
                
            case 41756:
                data = {catalogItemId: ruleType.value, ...timeOfDayRule}               
                break;
        }

        this.props.client.mutate({
            mutation: CREATE_RULE,
            variables: {
                input: { ...data, name: this.state.ruleName }
            }
        })
        .then(_ => {
            this.props.handleOpenSnackbar(
                'success',
                'Saved Successfully',
                'bottom',
                'center'
            );            
        })
        .catch(error => {
            this.props.handleOpenSnackbar(
                'error',
                `Error: ${error}`,
                'bottom',
                'center'
            );
        })
    }

    renderRuleType = _ => {
        switch(this.state.ruleType.value){
            case 41755:
                return <HolidayRules setData={this.setHolidayRule}/>

            case 41757:
                return <OvertimeRules setData={this.setOvertimeRule}/>
                
            case 41756:
                return <TimeOfDayRules setData={this.setTimeOfDayRule}/>
            
            default:
                return <HolidayRules setData={this.setHolidayRule}/>
        }
    }

    onFormSubmit = event => {
        event.preventDefault();
        this.saveRule();
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
                        <form className="BRModal-form" onSubmit={this.onFormSubmit}>
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