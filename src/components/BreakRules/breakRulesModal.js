import React, {Component} from 'react';

import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU"

class BreakRulesModal extends Component {
    INITIAL_STATE = {
        ruleName: '',
        code: '',
        time: 0,
        lenght: 0,
        
        lenghtOptions: [
            { value: 'Minutes', label: 'Minutes' },
            { value: 'hours', label: 'Hours' },
        ],   

        selectedEmployees: [],
        selectedEmployee: null,
        employeeSelectOptions: [],
        isAutomaticBreak: true,
        isManualBreak: false,
        shiftReached: 0,
        repeatBreak: false,
        selectedDays: 'MO,TU,WE,TH,FR,SA,SU',
        
        placeBreakOptions: [
            { value: 'middle', label: 'Middle of Shift' },
            { value: 'specific', label: 'Specific Time' },
        ]  
    }

    constructor(props) {
        super(props);

        this.state = {
            ...this.INITIAL_STATE
        }
    }

    getWeekDayStyle = (dayName) => {
        return `btn btn-secondary RowForm-day ${this.state.selectedDays.includes(dayName) ? 'btn-success' : ''}`;
    }

    selectWeekDay = (dayName) => {
        if (this.state.selectedDays.includes(dayName))
            this.setState((prevState) => {
                return { selectedDays: prevState.selectedDays.replace(dayName, '') }
            })
        else
            this.setState((prevState) => {
                return { selectedDays: prevState.selectedDays.concat(dayName) }
            })
    }

    handleClose = _ => {
        this.setState(_ => {
            return { ...this.INITIAL_STATE }
        }, _ => this.props.handleClose());
    }

    renderAutoBreakConfig = _ => {
        if(this.state.isAutomaticBreak){
            return(
                <React.Fragment>
                    <div className="AutoBreak">
                        <span className="AutoBreak-title d-block">When</span>
                        <label className="AutoBreak-reached"><span className="tumi-text-blue">Shift</span> has Reached</label>
                        
                        <div class="form-group form-row tumi-row-vert-center">
                            <div className="col-md-2">
                                <input value={this.state.shiftReached} name="shiftReached" type="number" className="form-control" />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    options={this.state.lenghtOptions}
                                    value={{value: 'minutes', label: "Minutes"}}
                                    onChange={_ => {}}
                                    closeMenuOnSelect={true}
                                    components={makeAnimated()}
                                    isMulti={false}                                                                          
                                />
                            </div>
                            <div className="col-md-6">
                                <div class="form-check">
                                    <input type="checkbox" value={this.state.repeatBreak} name="repeatBreak" class="form-check-input" id="repeatBreak" />
                                    <label class="form-check-label" for="repeatBreak">{`Repeat Every ${this.state.shiftReached} hours`}</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group form-row">
                            <div className="col-md-12">
                                <label className="AutoBreak-weekDays mb-2">Days of the Week</label>                                
                            </div>
                            <div className="col-md-12">
                                <div className="btn-group RowForm-days" role="group" aria-label="Basic example">
                                    <button type="button" className={this.getWeekDayStyle(MONDAY)} onClick={() => this.selectWeekDay(MONDAY)}>{MONDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(TUESDAY)} onClick={() => this.selectWeekDay(TUESDAY)}>{TUESDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(WEDNESDAY)} onClick={() => this.selectWeekDay(WEDNESDAY)}>{WEDNESDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(THURSDAY)} onClick={() => this.selectWeekDay(THURSDAY)}>{THURSDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(FRIDAY)} onClick={() => this.selectWeekDay(FRIDAY)}>{FRIDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(SATURDAY)} onClick={() => this.selectWeekDay(SATURDAY)}>{SATURDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(SUNDAY)} onClick={() => this.selectWeekDay(SUNDAY)}>{SUNDAY}</button>
                                </div>
                            </div>
                        </div>
                        <div className="AutoBreak-insert">
                            <span className="AutoBreak-title d-block">Insert Break</span>
                            <label className="AutoBreak-reached">Place Break at</label>
                            
                            <div className="form-group form-row">
                                <div className="col-md-6">
                                    <Select
                                        options={this.state.placeBreakOptions}
                                        value={{value: 'middle', label: "Middle of Shift"}}
                                        onChange={_ => {}}
                                        closeMenuOnSelect={true}
                                        components={makeAnimated()}
                                        isMulti={false}                                                                          
                                    />
                                </div>                                
                            </div>

                            <div className="form-group form-row">
                                <div className="col-md-12 BreaksModal-checkWrapper">
                                    <div class="form-check">
                                        <input type="checkbox" checked={this.state.isManualBreak} value={this.state.isManualBreak} class="form-check-input" id="manualBreak" />
                                        <label class="form-check-label" for="manualBreak">Manual Break - Employee can Start/Stop a Break</label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }

    render() {
        return(
            <Dialog className="BreaksModal" fullWidth maxWidth="sm" open={this.props.openModal} onClose={this.handleClose}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Break Rule</h5>
                    </div>
                </DialogTitle>
                <DialogContent>
                   <form onSubmit={this.props.handleSubmit}>
                        <div className="form-row">
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label for="ruleName">Name</label>
                                    <input value={this.state.ruleName} name="ruleName" type="text" className="form-control" id="ruleName"/>
                                </div>                            
                            </div>    
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label for="code">Code</label>
                                    <input value={this.state.code} name="code" type="text" className="form-control" id="code"/>
                                </div>                            
                            </div>    
                        </div>
                        <div className="form-row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label for="lenght">Lenght</label>
                                    <input value={this.state.lenght} name="lenght" type="text" className="form-control" id="lenght"/>
                                </div>                            
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <Select
                                        options={this.state.lenghtOptions}
                                        value={{value: 'minutes', label: "Minutes"}}
                                        onChange={_ => {}}
                                        closeMenuOnSelect={true}
                                        components={makeAnimated()}
                                        isMulti={false}
                                        className='BreaksModal-timeOpt'                                        
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group mb-0">
                                    <label className="d-block" for="">Type</label>
                                    <div className="BreaksModal-radioWrap">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="isPaid" id="isPaid" value="true" />
                                            <label className="form-check-label" for="isPaid">
                                                Paid
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="isPaid" id="isUnpaid" value="false" />
                                            <label className="form-check-label" for="isUnpaid">
                                                Unpaid
                                            </label>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div> 
                        {/* End Form Row */}
                        <div class="form-group row">
                            <label for="employeeSelect" class="col-md-2 col-form-label mt-0">Employees:</label>
                            <div class="col-md-10">
                                <div className="ScheduleWrapper">
                                    <Select
                                        className="EmployeeFilter"
                                        options={this.state.selectedEmployees}
                                        value={this.state.selectedEmployee}
                                        onChange={_ => {}}
                                        closeMenuOnSelect={false}                                                                         
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-md-12 BreaksModal-checkWrapper">
                                <div class="form-check">
                                    <input type="checkbox" checked={this.state.isAutomaticBreak} value={this.state.isAutomaticBreak} class="form-check-input" id="automaticBreak" />
                                    <label class="form-check-label" for="automaticBreak">Automatic Break</label>
                                </div>
                            </div>
                        </div>
                        {this.renderAutoBreakConfig()}
                        <div className="BreaksModal-buttons">
                            <button type="submit" className="btn btn-success mr-2">Save</button>
                            <button type="reset" onClick={this.handleClose} className="btn btn-default BreaksModal-cancel">Cancel</button>                                                        
                        </div>
                   </form>
                </DialogContent>
            </Dialog>
        );
    }
}

export default BreakRulesModal;