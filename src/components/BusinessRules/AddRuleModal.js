import React, {Component, Fragment} from 'react';

import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";

import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';

import Datetime from 'react-datetime';
import moment from 'moment';

import withApollo from 'react-apollo/withApollo';
import withGlobalContent from "../Generic/Global";

import HolidayRules from './HolidayRules';


class AddRuleModal extends Component{
    INITIAL_STATE = {
        ruleName: '',
        type: { value: "holiday", label: "Holiday" },
        selectedDays: 'MO,TU,WE,TH,FR,SA,SU',
        start: "00:00",
        end: "00:00",
        multiplier: 1,
        ruleTypes: [
            { value: "tod", label: "Time of Day" },
            { value: "overtime", label: "Overtime" },
            { value: "holiday", label: "Holiday" },
        ],
        holidays: [
            {id: 1, name: "Christmas", date: "12/25/2019"},
            {id: 2, name: "Boxing Day", date: "12/26/2019"},
            {id: 3, name: "New Year", date: "01/01/2020"},
        ]
    }
    
    constructor(props){
        super(props);
        this.state = {
            ...this.INITIAL_STATE
        }
    }

    handleChangeRuleTypeSelect = selected => {
        this.setState(_ => {
            return { type: selected }
        })
    }

    handleStartTimeChange = text => {
        this.setState({
            start: moment(text, "HH:mm:ss").format("HH:mm"),
        });
    }

    handleEndTimeChange = text => {
        this.setState({
            end: moment(text, "HH:mm:ss").format("HH:mm"),
        });
    }

    handleChange = ({target: {name, value}}) => {
        this.setState(_ => ({
            [name]: value
        }));
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
                                    <input className="col-sm-10 form-control" required value={this.state.ruleName} onChange={this.handleChange} name="ruleName" type="text" id="ruleName"/>                                                                
                                </div>
                                <div className="form-group form-row">
                                    <label className="col-sm-2" for="code">Type</label>
                                    <Select
                                        className="col-sm-10 pl-0 pr-0"
                                        options={this.state.ruleTypes}
                                        value={this.state.type}
                                        onChange={this.handleChangeRuleTypeSelect}
                                        closeMenuOnSelect={true}                                                                                                            
                                    />
                                </div>  
                            </div>
                            <div className="BRModal-section no-border">
                                <HolidayRules />
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